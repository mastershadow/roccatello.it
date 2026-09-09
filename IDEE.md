# Backlog articoli

Lista dei temi candidati. Non è un piano editoriale, è un raccoglitore: si
aggiunge quando capita qualcosa, si pesca quando si ha voglia di scrivere.

Regola di alimentazione: ogni volta che risolvere un problema costa più di due
o tre ore di indagine, quello diventa una voce qui, scritta entro pochi giorni
finché si ricordano i vicoli ciechi. I vicoli ciechi sono la parte più utile,
quella che non sta nella documentazione ufficiale.

Stati usati: `idea`, `bozza`, `in revisione`, `pubblicato`.

## Nginx e Tomcat non sono d'accordo su cosa sia un path

Stato: pubblicato (2026-08-31, `nginx-tomcat-normalizzazione-path`)

Il bypass `..;` che espone il manager di Tomcat dietro un `deny all` su Nginx.
Due normalizzazioni diverse dello stesso URI, il fix su `$request_uri`, e il
motivo per cui il fix non basta. Lingua: italiano.

## Il drift dei file CAD georiferiti

Stato: pubblicato (2026-09-03, `georeferenziare-disegni-cad`)

150 file DXF e DWG di corridoi stradali con uno scostamento di 86-150 metri tra
QGIS e AutoCAD. Causa: geometrie in CRS locale arbitrario e ancora geo_rss
posizionata a occhio senza riproiettare. L'offset non è una traslazione pura,
quindi serve una trasformazione affine con punti di controllo.

Tema classico che manda fuori strada intere commesse e che in italiano non è
spiegato bene da nessuna parte. Lingua: italiano.

## Chi tiene i log dell'Amministratore di Sistema quando si sta in cloud

Stato: idea

Il provvedimento del Garante del 2008 è scritto per un mondo on premise:
registrazione degli accessi, nomina individuale, verifica annuale. In uno
scenario cloud o in outsourcing non è ovvio su chi ricada la conservazione dei
log, e l'ambiguità è concreta nei contratti di nomina.

Potenzialmente il pezzo con più portata, dentro e fuori dal settore. Richiede
più cautela nella formulazione: niente riferimenti a clienti o contratti
specifici. Lingua: italiano.

## Da Nginx ad Ansible e Caddy senza big bang

Stato: idea

Migrazione di un sistema di deployment in produzione verso Caddy e Ansible,
con una fase intermedia che tiene le build lato server invece di cambiare tutto
in una volta. Il punto dell'articolo non è la tecnologia ma il sequenziamento
della migrazione. Lingua: italiano.

## Query in linguaggio naturale su PostGIS

Stato: idea

Architettura di una pipeline che traduce domande in linguaggio naturale in SQL
spaziale, con modelli self hosted e il database mai esposto al modello: lo
schema viene iniettato nel prompt e l'esecuzione resta fuori. Tema attuale, con
un angolo poco battuto che è l'isolamento del database. Lingua: da decidere,
qui l'inglese avrebbe senso.

## La precisione in virgola mobile nel rendering globale

Stato: idea

Perché il float32 non basta a rappresentare coordinate terrestri in una scena
3D, e come si aggira: coordinate relative alla camera, ECEF su WGS84,
emulazione double-single sulla GPU. Il più tecnico e il più di nicchia del
gruppo. Lingua: inglese, il pubblico è internazionale.

## Cityvu: il design di un viewer 3D urbano nel browser

Stato: idea

Le decisioni di design dietro Cityvu, raccontate dal suo lead software
architect. Quattro tagli possibili, probabilmente una serie e non un pezzo
solo: "perché non Cesium" (le alternative valutate all'epoca - CesiumJS,
iTowns, deck.gl - e cosa serviva che non c'era; le alternative come termini
di paragone tecnici, non confronto a griglia da brochure), l'architettura
del viewer, la gestione dei dati urbani (tiling, livelli di dettaglio,
formati), e come l'architettura è cambiata nel tempo, con quello che oggi si
rifarebbe diversamente. Il pezzo sul "perché non Cesium" è probabilmente il
più forte della serie. Si collega all'idea sulla precisione in virgola
mobile già in lista. Lingua: italiano per il taglio di design, inglese
possibile per i pezzi più tecnici.

Dal pezzo tecnico si deriva una versione commerciale per il sito 3DGIS, in
quest'ordine e non il contrario: prima il blog, poi la riscrittura per il
sito, due testi distinti con registri distinti, link incrociato tra i due.
Se la versione commerciale nomina concorrenti, ogni affermazione su di loro
deve essere verificabile.

Da fare: buttare giù le decisioni chiave e i vicoli ciechi di ciascun taglio
finché si ricorda il perché di ogni scelta: cosa è stato valutato all'epoca,
cosa è stato scartato e perché, cosa oggi si rifarebbe.

## felib: progettare una libreria condivisa tra prodotti

Stato: idea

felib è la libreria condivisa dei prodotti 3DGIS. Il tema è il design di una
libreria interna che serve più prodotti: cosa ci entra e cosa no, come si fa
evolvere senza rompere chi la usa, confini delle API e versioning. Il
confronto qui non è con prodotti (non esistono "soluzioni simili" per una
libreria interna) ma con gli approcci alternativi: copia-incolla tra
prodotti, monorepo, pacchetti npm interni versionati, comporre solo librerie
pubbliche. Il pezzo forte è "perché una libreria nostra invece di comporre
librerie pubbliche". Anche questa è una serie, un pezzo per decisione di
design. Tema trasversale che parla anche a chi non fa GIS. Lingua: italiano.
Come per Cityvu, dal pezzo tecnico si può derivare una versione per il sito
3DGIS (stesso ordine: prima il blog).

Da fare: la voce va riempita con decisioni concrete ed errori reali, per ora
è solo il perimetro.

## carto.bi: dove il GIS incontra la business intelligence

Stato: serie aperta, primo pezzo in bozza

Il design di carto.bi, la piattaforma di city intelligence di 3DGIS,
raccontato per decisioni e non per livelli: ogni pezzo sta in piedi da solo e
la serie non ha bisogno di essere completata. Il materiale di prima mano c'è
(documenti di design, ADR e codice). Due vincoli validi per tutta la serie: il
prodotto non è ancora in produzione, quindi si racconta la decisione presa e
non il consuntivo, e il nome carto.bi si cita mentre clienti e città della
prima installazione no. Lingua: italiano.

I pezzi individuati:

1. Redis in un'architettura share nothing. Stato: bozza
   (`redis-architettura-share-nothing`, draft = true). Tesi: in share nothing
   un componente infrastrutturale non costa una volta, costa una volta per
   cliente, e da lì discende la coda dei task come tabella Postgres. Include la
   soglia numerica alla quale la decisione va revocata.
2. I vicoli ciechi della coda su Postgres. Stato: idea. Lease più corto del
   tempo che un task può legittimamente impiegare, il task immortale perché la
   ripresa non contava il tentativo, i due orologi, l'upsert latest-wins che
   cancella la propria impronta, il job di housekeeping che ferma
   l'accodamento. Tesi: la ragione per isolare è il raggio e non la gravità, e
   isolare senza allarme scambia un guasto rumoroso con una crescita
   silenziosa.
3. Privilegi per ruolo con PgBouncer in transaction mode. Stato: idea.
   `server_reset_query` che non gira di default, `SET LOCAL ROLE` invece di
   `SET ROLE`, e l'harness end to end che gira da superuser e nasconde i grant
   mancanti per sette settimane con i test verdi. Non ha niente di
   geospaziale, quindi è il pezzo della serie con il pubblico più largo.
4. Share nothing come requisito e non come ottimizzazione. Stato: idea.
   Isolamento fra clienti, residenza dei dati, identità delegata a un provider
   OIDC. Si lega alle idee sui log dell'Amministratore di Sistema e sulla ISO
   27001.

Restano candidati i due livelli della voce originale che qui non compaiono, la
pipeline dei dati (aggregazioni, PostGIS) e il design di prodotto: vanno
riempiti con decisioni concrete prima di diventare pezzi.

Da valutare come voce a sé, perché non riguarda solo carto.bi: la divergenza
fra documento di design e codice (il polling dichiarato a 10 secondi che nel
codice è 1, lo scheduler proprio al posto di quello raccomandato) e cosa la
produce.

## carto.app: il design di un'app di rilievo sul campo

Stato: idea

Il design di carto.app, l'app Android per i rilievi sul campo di 3DGIS,
come serie: le decisioni di design di un'applicazione che deve funzionare
in campagna, dove la connettività va e viene e i dati raccolti non si
possono perdere. Lingua: italiano.

Da fare: elencare i pezzi della serie e le decisioni concrete di prima
mano.

## La ISO 27001 vista da chi se la gestisce davvero

Stato: idea

La 27001 in una PMI software, raccontata da chi ne guida il sistema di
gestione e non da un consulente: cosa della norma produce sicurezza reale e
cosa produce solo carta, come si fa convivere con lo sviluppo quotidiano,
cosa cambia nei rapporti con la pubblica amministrazione e nei bandi. Anche
questa è una serie, un pezzo per tema. Stessa cautela della voce sul
Garante: niente riferimenti ad audit, clienti o non conformità specifiche.
Si collega all'idea sui log dell'Amministratore di Sistema. Lingua:
italiano.

Da fare: elencare i temi della serie e per ciascuno l'esperienza concreta
che lo regge.

## Orchestrare agenti: quando serve e quando è solo overhead

Stato: bozza (`legge-di-conway-agenti-intelligenza-artificiale`, draft = true)

L'orchestrazione di agenti AI vista da chi la usa per lavorare, non da chi
la vende: cosa cambia tra un agente solo e più agenti coordinati, i pattern
che reggono (pipeline, distribuzione parallela con verifica, un agente che controlla il
lavoro di un altro), i costi in token e in tempo, e i casi in cui la
complessità in più non ripaga. Angolo poco battuto: il confine tra
orchestrazione e semplice sequenza di prompt. Si collega all'idea sulle
query in linguaggio naturale su PostGIS. Lingua: da decidere, il tema è
internazionale ma il taglio esperienziale funziona bene anche in italiano.

Da fare: elencare i casi reali di lavoro con più agenti e i vicoli ciechi,
per esempio dove l'orchestrazione ha prodotto risultati peggiori del singolo
agente.
