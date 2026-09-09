+++
date = "2026-09-14"
lastmod = "2026-09-14"
draft = false
title = "Perché ho tenuto Redis fuori da carto.bi"
slug = "redis-architettura-share-nothing"
summary = "Per la coda dei task Redis era una delle opzioni sul tavolo ma ha vinto la semplicità, complice l'architettura share nothing."
tags = ["architettura", "postgres", "redis", "software", "devops"]
ogimage = "img/og/redis-architettura-share-nothing.png"
language = "it"
+++

Quando si progetta un sistema che deve eseguire lavoro in background, la coda
dei task è un pensiero prepotente. Si sa già che ci vorrà un broker, 
di solito si sa già quale scegliere, anche se non si ha ancora veramente idea di cosa debba fare davvero.

carto.bi è la piattaforma di city intelligence alla quale stiamo lavorando in
[3DGIS](https://www.3dgis.it): porta la location intelligence sulla scala di una città, acquisendo dati
da fornitori diversi, calcolando indicatori a cadenza fissa e trasformandoli in
allarmi, mappe ed export per chi amministra il territorio.

Nel suo design Redis era una delle opzioni sul tavolo, in due ruoli possibili:
broker della coda dei task e cache distribuita. Non è diventato la nostra scelta: la nostra coda è
una tabella Postgres fin dal primo giorno.

## Il vero ruolo di una coda di task

La prima domanda da farsi è: quali sono i requisiti funzionali da rispettare?

**I task non si possono perdere.** Ogni riga accodata deve sopravvivere al riavvio
del worker, dello scheduler e del database, perché dietro c'è un'acquisizione
da un fornitore o il calcolo di un indicatore che qualcuno si aspetta di
trovare pronto.

La consegna progettata è at-least-once, mai exactly-once: la difesa dai duplicati sta a valle, con una chiave di idempotenza che è una
chiave di dominio e non un identificatore casuale.

```sql
INSERT INTO platform.task_queue (role, idempotency_key, payload, ...)
VALUES (...)
ON CONFLICT (idempotency_key) DO NOTHING
RETURNING id;
```

Una chiave come `ingest:{fornitore}:{oggetto}:{inizio_finestra}` dice che quel
task, per quella finestra temporale, è già stato chiesto. Nessuna riga di
ritorno significa "c'era già", che è un successo e non un errore.

La combinazione di `ON CONFLICT DO NOTHING` e `RETURNING` serve proprio a
evitare il controllo preventivo. Se cercassimo prima la chiave con una `SELECT`
e poi inserissimo, fra le due operazioni si aprirebbe una race condition: due
processi che accodano lo stesso task nello stesso istante troverebbero entrambi
la chiave assente e proverebbero entrambi a inserire. Qui l'arbitro è il vincolo
di unicità, che vive dentro il database e non lascia spazio fra il controllo e
la scrittura: o la riga è tua e ti torna l'id, o esisteva già e non torna
niente.

L'ordine non è garantito e non è necessario per il nostro use case. Due task della stessa catena possono
girare fuori ordine su due worker diversi, e dove l'ordine conterebbe abbiamo
scelto di scrivere l'ultimo vincitore sull'identità invece di serializzare la
coda. Quello che serve è la priorità, non la sequenza: le azioni interattive
della console hanno priorità sui task schedulati, e il backfill ne ha meno di tutti,
altrimenti una ricostruzione di dati affosserebbe l'acquisizione di flussi realtime.

Poi ci sono i volumi. La stima di progetto per la prima installazione parlava di 3.000
o 4.000 task al giorno, con punte di tre o cinque al minuto. Sull'ambiente di
sviluppo, dove la coda gira da metà agosto, le giornate normali stanno fra 120
e 300 task. Le due giornate più voluminose hanno generato 3.196 e 9.207 task e sono di backfill, cioè
ricostruzioni.

Il regime normale sta **un ordine di grandezza sotto la stima**, e già questa probabilmente poteva escludere la presenza di un broker.

## Il payload è un riferimento, non un dato

I numeri del paragrafo precedente sono task al giorno, non megabyte, e le due
misure non vanno confuse. Una riga da poche centinaia di byte innesca
l'acquisizione di una scena raster e può tenere occupato un worker per mezz'ora:
**la coda conta i lavori, non i dati che quei lavori muovono**.

I dati, infatti, nella coda non ci passano, ed è una regola tenuta fin
dall'inizio perché è il punto in cui molte code su database iniziano a
soffrire.

Misurando le righe per ruolo, il payload medio sta fra i 220 e i 360 byte, con
i massimi intorno al kilobyte. Sono identificatori, nomi canonici, finestre
temporali. Il flusso in tempo reale del trasporto pubblico ci consegna 21 KB di
protobuf ogni venticinque secondi, e quei byte non entrano mai nella coda:
finiscono in una tabella di transito e da lì nell'object storage. I raster
crescono nel bucket, le serie temporali nelle hypertable, e nessuno dei due
volumi ha a che vedere con la dimensione della coda.

Una tabella di coda con righe da duecento byte e una tabella di coda con
dentro i payload sono due oggetti diversi, e solo il primo dei due si comporta
come una coda.

## Ogni cliente ha il suo stack completo

Non abbiamo quindi grandissimi volumi di task, ma si potrebbe dire che un container aggiuntivo Redis ci possa anche stare.
L'ho già fatto per diversi progetti e funziona perfettamente.

Il punto è un altro: è il modello di erogazione.

carto.bi è share nothing: ogni cliente ha il suo stack completo, database
dedicato, bucket dedicato, credenziali, hostname e identity provider dedicati.
A runtime il prodotto non ha il concetto di multi-tenancy, tanto che nella
coda non esiste nemmeno una colonna che identifichi il tenant: la coda è già
sua per costruzione.

A questo punto la domanda giusta non è più su Redis, è un'altra: perché share
nothing e non multi-tenancy, che eviterebbe tutte le moltiplicazioni?

La risposta è che per noi l'isolamento fra clienti è un requisito, non
un'ottimizzazione. In un'architettura multi-tenant l'isolamento è **una proprietà
del codice**: sta nelle policy di riga, nei filtri, nella disciplina di chi
scrive le query, e va dimostrato a ogni interrogazione e a ogni migrazione. In
share nothing è **una proprietà del deployment**: database separati, bucket
separati, credenziali e identity provider separati, e nessuna riga di un altro
cliente che si possa raggiungere per sbaglio, perché a runtime gli altri
clienti non esistono. Quando il cliente è una pubblica amministrazione, e
quando fra le opzioni c'è installare il prodotto dentro il suo perimetro,
non ci sono molte alternative.

Il conto di questa scelta è un costo operativo lineare con il numero di
clienti. È una conseguenza nota, accettata e scritta nei requisiti non
funzionali.

In questo modello un componente infrastrutturale non costa una volta. **Costa una
volta per cliente.** E non costa la RAM, che sulla scala di cui parliamo è
rumore (oggi un po' meno, con i prezzi spinti dall'AI): costa un aggiornamento, un monitoraggio, un backup, una prova di
ripristino e operatori esperti, moltiplicati per il numero di
installazioni.

Redis sarebbe stato il secondo componente con stato dopo Postgres. Due sistemi
con stato significano due modelli di durabilità e due verità che possono
divergere, perché una transazione va a buon fine e l'altra no.

Con lo stesso ragionamento sono rimasti fuori Kafka e RabbitMQ, gli
orchestratori di flussi come Airflow e Prefect, visto che le nostre catene sono
lineari, e i motori di calcolo distribuito, visto che i dati stanno comodi in
un Postgres configurato al meglio.

## Trenta righe di SQL al posto di Redis

La presa in carico di un task è uno statement solo, che seleziona una riga e la
marca in esecuzione nella stessa transazione.

```sql
WITH claimed AS (
    SELECT id FROM platform.task_queue
     WHERE status IN ('pending', 'failed_retry')
       AND scheduled_at <= now()
       AND role = ANY(%(roles)s)
     ORDER BY priority DESC, scheduled_at
       FOR UPDATE SKIP LOCKED
     LIMIT 1
)
UPDATE platform.task_queue t
   SET status = 'running',
       locked_by = %(worker)s,
       locked_until = now() + %(lease)s
  FROM claimed
 WHERE t.id = claimed.id
RETURNING t.*;
```

La CTE non è un vezzo. Selezionare la riga e marcarla con due statement separati
apre la stessa race condition di poco fa, questa volta fra due worker: tutti e
due leggono la riga come disponibile, tutti e due la prendono. Qui la selezione
e l'`UPDATE` sono un solo statement, quindi una sola transazione, e non esiste
nessun istante in cui quella riga risulti libera a due processi insieme.

`FOR UPDATE` blocca la riga scelta. Senza `SKIP LOCKED` il secondo worker che
arriva su quella riga si mette ad aspettare che il primo abbia finito, e con
dieci worker si ottiene una fila indiana su un task solo. Con `SKIP LOCKED` la
riga bloccata viene saltata e il worker prende la successiva: **è la clausola
che trasforma una tabella in una coda concorrente**. Due worker che chiedono un
task nello stesso istante prendono due righe diverse, senza lock applicativi e
senza coordinamento fra i processi.

Il resto della `WHERE` fa altre due cose. `role = ANY(...)` permette a
popolazioni diverse di worker di lavorare sulla stessa tabella prendendo solo i
task che sanno eseguire, e per questo la coda resta una sola anche se i
container sono quattro. `scheduled_at <= now()`, insieme allo stato
`failed_retry`, fa sì che il retry non sia un meccanismo a parte: un tentativo
fallito viene riscritto con `scheduled_at` spostato avanti nel tempo, e torna
candidato da solo quando il backoff è scaduto.

`locked_until` è il lease, cioè per quanto tempo quel task può restare in mano a
un worker senza dare notizie. Scaduto quello la riga torna disponibile e
qualcun altro la prende: è così che si sopravvive a un worker che muore senza
dire niente. Il lease non è fisso: finché il worker è vivo lo prolunga a
intervalli regolari, quindi può restare corto senza che un task lungo venga
rubato a metà. `RETURNING t.*` consegna la riga intera a chi l'ha presa, che
quindi non deve rileggerla.

Una nota che vale per qualunque coda su database: una query così va servita da
un indice che copra sia il filtro sia l'ordinamento, altrimenti ogni presa in
carico scandisce la tabella e il costo cresce con il numero di record invece di restare
costante. È il punto in cui le code su database si guadagnano la cattiva
reputazione che hanno.

I worker sono processi separati, non thread. Ognuno prende un task alla volta e
lo porta a termine, e la concorrenza si ottiene aggiungendo container. A coda
vuota dormono un secondo. Se un task non va a buon fine riprova con un backoff incrementale, e dopo il terzo tentativo finisce in una
tabella di scarto che si può rilanciare dalla console di
amministrazione.

A gestire la coda non c'è nessuna libreria: la ragione è che la coda in sé è data dalle trenta righe
qui sopra, mentre tutto quello che è specifico di prodotto (le chiavi di idempotenza
costruite sul dominio, le catene di task, il lease dimensionato per ruolo, un
ruolo Postgres diverso a seconda del tipo di task, la coda di scarto
ispezionabile) andava scritto comunque, qualunque libreria avessimo
scelto. Non a caso le alternative valutate volevano un'istanza di Redis o di un altro broker.

## Il concetto è minimizzare quello che non serve, non togliere e basta

Sarebbe facile leggere questa scelta come minimalismo, e sarebbe sbagliato.
Nello stesso design ci sono componenti che costano e sono rimasti.

TimescaleDB invece di Postgres liscio, perché le hypertable e le aggregazioni
continue servono davvero alle serie temporali. Un object storage anche sul
deployment a singolo host, che ha già un disco, perché è il contratto S3 a
permetterci di cambiare il backend senza toccare il codice. PgBouncer dove
basterebbe il pool applicativo, perché è quello che regge il modello di
privilegi per ruolo. Un'immagine separata da trecento megabyte con dentro
Chromium, perché gli export in PDF li fa un browser vero.

Il criterio non è ridurre il numero di componenti. **È che ogni componente si
paghi il proprio costo operativo**, sapendo che quel costo va moltiplicato per il
numero di clienti.

## Quindi non serve Redis? Serve eccome... non è tutto oro quello che luccica

Ho scelto delle soglie di ragionamento: se il backlog medio della
coda supera i cento task per più di un'ora, o se la latenza di presa in carico
al novantacinquesimo percentile supera i cinque secondi, Redis ha un ruolo attivo.
Se quei numeri arrivano, questa tecnica ha finito il suo lavoro ed entra Redis, che di mestiere fa solo quello.

Nell'implementazione inoltre abbiamo avuto la nostra dose di problemi, e questa è la parte inaspettata:

* Il lease più corto del tempo massimo che un task può legittimamente impiegare, e quindi il lavoro rubato a metà da un secondo worker.
* Il task che non moriva mai, perché il giro successivo dopo la scadenza del lease non contava il tentativo.
* Due orologi leggermente diversi, quello del worker e quello del database, e righe scritte che diventano invisibili per lo sfasamento fra i due orologi.
* E molti altri problemini...

**Nessuno di questi è "Postgres come coda non regge".** Sono problemi di lease, di orologi, di privilegi e di ruoli, cioè esattamente quelli che avremmo avuto anche con un broker vero.
Se non altro in questo caso per vedere i task accodati bastava una query.
