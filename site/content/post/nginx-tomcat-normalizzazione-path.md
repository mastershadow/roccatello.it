+++
date = "2026-08-31"
lastmod = "2026-08-31"
draft = false
title = "Normalizzare i path tra Nginx e Tomcat per evitare vulnerabilità path traversal"
slug = "nginx-tomcat-normalizzazione-path"
summary = "Un `deny all` su Nginx sembra sufficiente ma, niente, il manager di Tomcat resta accessibile da tutti. Scopriamo perché il fix ovvio non basta."
tags = ["sicurezza", "nginx", "tomcat", "web"]
ogimage = "img/og/nginx-tomcat-normalizzazione-path.png"
language = "it"
+++

Nginx davanti ad Apache Tomcat è una delle configurazioni più diffuse che esistano.
Nginx sta in ascolto sulla 443, termina il TLS, serve i file statici e gira
tutto il resto all'application server, che ascolta solo in locale:

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
}
```

Tomcat non è raggiungibile da fuori e tutto il traffico passa da un punto solo.
A quel punto viene naturale usare quello stesso punto anche per decidere cosa
il mondo può vedere e cosa no.

Tomcat Manager è l'applicazione web che Tomcat si porta dietro di serie,
raggiungibile su `/manager`: da lì si carica un war, si ferma e si riavvia una
singola applicazione senza toccare le altre, si guardano le sessioni aperte.
Tutto dal browser. Chi ci arriva può caricare un war, e caricare un war
significa eseguire codice sulla macchina.

Su un server con una pipeline di deploy come si deve il manager non serve, e
infatti si toglie. Ma i server con una pipeline di deploy come si deve sono
meno di quanti se ne raccontino: dove si aggiorna un war ogni tanto, a mano,
magari su una macchina a cui si mette piede due volte l'anno, il manager resta
installato perché fa risparmiare mezz'ora tutte le volte.
A volte il manager può servire anche per fare operazioni particolari, come automatizzare il riavvio per far riconoscere classi dinamiche.

Il concetto di base è "**se serve davvero resta installato, e lo si chiude a chiave dietro al reverse proxy**".

Nella configurazione del vostro Nginx ecco che il `location` sembrava blindato:

```nginx
location /manager {
    deny all;
}
```

Nessuno da fuori può raggiungere `/manager`. Sembra.

Poi arriva una richiesta come questa:

`GET /..;/manager/html`

E il manager risponde.

Non è un caso di scuola: l'ho trovato durante un Vulnerability Assessment and
Penetration Test (VAPT), di quelli che faccio a rotazione sui sistemi che
teniamo in piedi. Il `deny all` c'era, funzionava, e il manager rispondeva lo
stesso. Vale la pena capire perché - e cosa serve davvero perché non succeda
più.

## Lo stesso URI può essere interpretato in modi diversi

Il punto è tutto qui, ed è più subdolo di un errore di configurazione:
**Nginx e Tomcat leggono la stessa stringa e ne ricavano due path diversi.**

**Nginx** guarda `/..;/manager/html` e vede tre segmenti: `..;`, `manager`,
`html`. Quel primo segmento, per Nginx, è una stringa opaca. Non è `..`, è
`..;` - un nome di cartella come un altro. Quindi il path *non inizia* per
`/manager`, la regola `location /manager` non scatta, il `deny all` non si
applica e la richiesta viene inoltrata a Tomcat così com'è.

**Tomcat** riceve `/..;/manager/html` e fa una cosa che Nginx non fa: interpreta
il `;` dato che non segue la specifica HTTP stretta ma quella delle Java Servlet.
Per chi non fosse esperto di Java EE, nella specifica delle servlet il punto e virgola introduce i *path
parameter* (i matrix parameter, quelli tipo `/percorso;jsessionid=...`).

Tomcat quindi vede `..;`, stacca il path parameter e si ritrova in
mano `..`. A quel punto `..` è quello che è sempre stato: un salto di livello.
Il path collassa e diventa `/manager/html`.

Due normalizzazioni diverse dello stesso URI. Nginx pensa di aver bloccato un
percorso che non esiste; Tomcat serve un percorso che Nginx non ha mai visto.
Il `deny all` era vero. Semplicemente non stava negando la cosa giusta.

## Filtriamo `..;`

La tentazione è chiudere il buco dove si vede, cioè su Nginx. 

Si cerca per prima cosa la variabile corretta: `$uri` è il path già
normalizzato e decodificato da Nginx mentre `$request_uri` invece è la richiesta grezza, com'è arrivata dal client. Serve quest'ultima:

```nginx
if ($request_uri ~* "\.\.;") {
    return 400;
}
```

Funziona!

### Ah no?

Funziona contro *quel* payload.

La regex guarda `$request_uri`, cioè i byte grezzi. Un client che invece di
scrivere `..;` in chiaro lo codifica - `%2e%2e%3b` - quei byte con `\.\.;` non
combaciano, e la richiesta passa il filtro senza che scatti niente.

Quello che succede dopo dipende da un dettaglio che quasi nessuno guarda: come
avete configurato la regola `proxy_pass`.

Senza barra finale (`proxy_pass http://127.0.0.1:8080;`) Nginx inoltra la
richiesta così com'è arrivata, byte per byte. Tomcat riceve `%2e%2e%3b`, e
quando cerca i path parameter sta ancora guardando la stringa codificata: il
`;` non c'è, c'è `%3b`. Lo decodifica solo dopo, in un `;` letterale che resta
dentro il segmento. Il segmento resta `..;` per intero quindi la traversal non avviene.
Il payload codificato non ha nessun impatto.

Con una barra finale (`proxy_pass http://127.0.0.1:8080/;`) cambia tutto. Adesso
Nginx normalizza e decodifica *prima* di girare la richiesta: `%2e%2e%3b` torna
a essere `..;` in chiaro, e a Tomcat arriva il punto e virgola vero. Path
parameter, `..`, traversal, manager. Lo stesso payload, prima inerme, ora ha saltato la regex e ha colpito.

Una barra tra il primo scenario e il secondo. È il genere di dettaglio che nella
documentazione non c'è, e che si finisce per capire dai log perdendoci moltissimo tempo.

## La mossa corretta

**Un reverse proxy non è un controllo di sicurezza. È un instradatore di
traffico che, ogni tanto, è capace di bloccare anche qualche richiesta.**

Delegargli la protezione di un endpoint critico significa affidare la tua sicurezza ad un equilibrio precario tra parser.

Il manager di Tomcat non si nasconde: o si toglie o se serve, lo si lega a `localhost` (o ad una rete privata VPN) e si
protegge con una valve di tipo `RemoteAddrValve` che utilizza le stesse convenzioni di tutto il servlet container, cioè nello stesso posto dove il `..;` viene finalmente normalizzato per quello che è.

Il filtro su Nginx tenetelo pure, come strato in più: sommato a un manager che
non è raggiungibile è difesa in profondità. Ma se è l'unica cosa che vi separa
dal manager non è difesa in profondità, è *security through obscurity* - e
l'oscurità, prima o poi, qualcuno la illumina.
