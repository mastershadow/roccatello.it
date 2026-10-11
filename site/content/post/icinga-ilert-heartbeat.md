+++
date = "2026-10-11"
lastmod = "2026-10-11"
draft = true
title = "Il monitoraggio del monitoraggio: un heartbeat da Icinga 2 verso ilert"
slug = "icinga-ilert-heartbeat"
summary = "Se il monitoraggio si ferma gli allarmi non arrivano più. Ma non arrivano anche quando va tutto bene. Un heartbeat verso un sistema di monitoraggio esterno ci salva la vita."
tags = ["monitoraggio", "icinga", "devops", "infrastruttura"]
ogimage = "img/og/icinga-ilert-heartbeat.png"
language = "it"
+++

Il sistema di monitoring controlla i server, i servizi, i certificati e lo spazio sui
dischi, tuttavia c'è una cosa sola che non può controllare: se sta funzionando.

Se Icinga si ferma, si ferma tutto. Nessun check gira, nessun allarme parte,
nessuna notifica arriva. **Il guasto di un sistema di monitoraggio è
indistinguibile dal suo funzionamento corretto**, perché in entrambi i casi il
segnale è il silenzio. Ce ne si accorge il giorno dopo, quando qualcuno viene a chiederci
come mai non è arrivato niente per quel disco pieno.

Una soluzione naive potrebbe essere quella di mettere un secondo Icinga a controllare il primo, tuttavia si sposta il problema di un passo e basta. Un metodo che funziona è un check invertito: qualcosa che sta fuori dalla nostra infrastruttura si aspetta di ricevere un segnale a intervalli regolari, e se il segnale non arriva è quello a dare l'allarme.

Tra le varie possibilità per la componente esterna ho scelto ilert: uno dei molteplici servizi managed per alerting e reperibilità. La
ragione principale non è tecnica. È un fornitore europeo e certificato ISO 27001, e in tal modo mi consente di mantenere sia la catena di gestione per la security, che la gestione di un eventuale switch off di servizi non europei. Better safe than sorry, visto l'aria che tira.

## Configurare un Heartbeat monitor

ilert espone una URL di ping e si aspetta di riceverne periodicamente entro l'intervallo
configurato. Se i ping smettono di arrivare, apre un alert sulla alert source
collegata al monitor. Il monitor resta inattivo finché non riceve il primo
ping: il timer parte da lì.

Si crea da **Alert sources**, voce **Heartbeat monitors** nel menu a tendina,
poi **Create heartbeat monitor**. Si assegna a un team, gli si dà un nome, si
sceglie la alert source che genererà l'alert e l'intervallo oltre il quale il
ping è considerato in ritardo. Viene restituito un URL formattato come segue:

```
https://beat.ilert.com/api/pings/ih2:<intervallo>:<tenant>:<id>:<secret>
```

## Un servizio come tutti gli altri

Lato Icinga, configurare ping è semplice: un servizio che interroga
quella URL a intervalli regolari. Se lo scheduler si ferma, il servizio non
gira, i ping cessano e ilert se ne accorge.

Nel mio caso Icinga gira in container. Per non doverne modificare l'immagine né
aggiungere bind mount, il ping lo facciamo fare a `check_http`, che sta già nei monitoring
plugins dell'immagine, configurato interamente da Director. Il template di
servizio è questo:

- Name: `ilert-heartbeat`
- Check command: `http`, che è un comando ITL e non va creato
- Check interval: `1m`
- Retry interval: `1m`
- Max check attempts: `3`
- Notifications enabled: `No`

Le notifiche sono disattivate per scelta operativa: se ilert è irraggiungibile il check fallisce, e
la notifica che dovrebbe avvisarci fallirebbe insieme a lui. Se serve un
avviso su questo servizio va instradato su un canale diverso.

Utilizzare Director tuttavia implica la presenza della integration key nella configurazione, leggibile da chiunque
abbia accesso a Icinga Web con i permessi adeguati e via API.
L'alternativa
sarebbe stata uno script wrapper che tiene la chiave in un file con permessi stretti,
ma avremmo dovuto rifare il container.
Per questa infrastruttura è un compromesso accettabile.

Dopo il primo salvataggio compare il tab con gli argomenti di `check_http`:

- `http_address`: `beat.ilert.com`
- `http_vhost`: `beat.ilert.com`
- `http_ssl`: attivo
- `http_sni`: attivo
- `http_timeout`: `10`
- `http_uri`: `/api/pings/<INTEGRATION_KEY>`

Poi si assegna il servizio all'host del master, come Single Service o con una
Service Apply Rule, e si fa Deploy.

## Un caveat legato a SNI: un 404 inaspettato

La prima configurazione non aveva `http_vhost`, e il servizio rispondeva **404**.

Ecco che abbiamo sbagliato la chiave!!! 

L'ho verificata più volte, confrontata con quella sul pannello, ottenendo lo stesso risultato.
Il secondo capro espiatorio è stata la CDN davanti ilert.
Tuttavia non era né l'una né l'altra.

Nella ITL di Icinga i due campi che seguono non fanno quello che il nome potrebbe indicare intuire:

- **`http_address`** diventa `-I`, cioè l'indirizzo a cui aprire la connessione
- **`http_vhost`** diventa `-H`, cioè l'header `Host`

Configurando solo `http_address` la connessione parte verso beat.ilert.com, ma
la richiesta HTTP esce senza header `Host`. L'endpoint sta dietro un CDN con
virtual hosting e senza `Host` non sa a quale sito fare riferimento: con il risultato di un bel  404. In più `--sni` prende il nome dal valore di `-H`, quindi anche la SNI
partiva vuota e il TLS terminava sul certificato di default del CDN. 
È sufficiente valorizzare `http_vhost` oltre a `http_address`.

Per vedere il comando lanciato da Icinga, si deve aprire il servizio in Icinga Web, accedere alla sezione **Check
execution**, e leggere riga **Command** in cui devono comparire sia `-I` sia `-H`.

## La verifica

Prima di capire effettivamente il problema ho provato ad eseguire nel container, a mano sia una chiamata curl che il comando diretto di Icinga:

```bash
docker exec icinga2 curl -i -sS "https://beat.ilert.com/api/pings/<INTEGRATION_KEY>"

docker exec icinga2 /usr/lib/nagios/plugins/check_http \
  -H beat.ilert.com -u "/api/pings/<INTEGRATION_KEY>" -S --sni -t 10
```

La risposta attesa è `HTTP/1.1 202 Accepted`.

Un'ultima accortezza sugli intervalli: quello del monitor su ilert deve essere
sensibilmente più lungo del `check_interval`, altrimenti un singolo check in
ritardo apre un alert.

## Lo scopo dell'heartbeat

L'heartbeat che abbiamo impostato copre l'unico guasto che non ci si può autodiagnosticare.
Se lo scheduler si ferma, se la macchina
crasha o se il traffico non esce, non esiste nessun check che
possa dirlo: un sistema non può
segnalare la propria assenza e serve qualcuno fuori che si accorga del
silenzio.

Il passo successivo potrebbe rendere il ping dipendente dall'esito di un check più profondo: uno script che interroga `/v1/status` dell'API di Icinga e pinga solo se la risposta è sana.

Come si dice? L'importante è cominciare e migliorarsi un po' alla volta.
