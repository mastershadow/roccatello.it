+++
date = "2026-09-02"
lastmod = "2026-09-02"
draft = true
title = "Georeferenziare correttamente disegni CAD: il drift tra AutoCAD e QGIS"
slug = "georeferenziare-disegni-cad"
summary = "Centinaia di file DXF e DWG e nessuno posizionato correttamente. Eppure in AutoCAD sembrava tutto a posto: li apri in QGIS e ci sono 150 metri di scostamento. Nessun bug: solo disegni posizionati approssimativamente. Vi spiego perché succede e come si georeferenziano correttamente."
tags = ["gis", "cad", "qgis", "gdal", "georeferenziazione"]
ogimage = "img/og/georeferenziare-disegni-cad.png"
language = "it"
+++

Centinaia di file DXF e DWG, consegnati come georiferiti. In AutoCAD stanno
esattamente dove devono stare, perfettamente allineati con le tavole di
progetto. Aperti in QGIS sopra la cartografia regionale, le stesse geometrie
si spostano: 86 metri in un punto, 150 in un altro. Nessuno dei due software
ha un bug: stanno solo trattando la stessa geometria in modi diversi.

Non è un caso isolato: ci è capitato più volte, con consegne diverse, senza
nemmeno contare il catasto, che è un altro paio di maniche. È un problema
che manda fuori strada intere commesse, e diciamoci la verità: è un mistero
per tanti. Vale la pena capire perché succede, e poi vedere come si
georeferenzia un disegno CAD correttamente.

## Il CAD non sa dove sta il mondo

Possiamo dire che un disegno CAD viva su un piano infinito con un'origine arbitraria. Il
formato DXF non trasporta alcun sistema di riferimento: le coordinate sono
numeri puri, e sta a chi legge il file decidere cosa significano. Nei
capitolati si scrive "consegna georiferita", ma quello che arriva spesso è
un'altra cosa: qualcuno ha preso il disegno, lo ha traslato sopra una base
cartografica finché non combaciava a schermo, e lo ha salvato lì.

Dentro AutoCAD tutto torna, perché dentro AutoCAD tutto è sbagliato insieme:
il rilievo, le tavole, la base di appoggio condividono lo stesso piano
locale e gli stessi errori. È un mondo internamente coerente. Il problema
emerge solo quando quelle coordinate vengono lette da un GIS, che le prende
alla lettera e le appoggia sulla cartografia vera. Lì la coerenza interna
non basta più: conta la posizione assoluta, e quella è stata decisa a
occhio.

## Le coordinate non dicono nulla senza un sistema di riferimento

Prima di guardare lo scostamento serve un passo indietro. Una coppia di
numeri come 1725000, 5032000 non è una posizione: è una posizione *dentro
un sistema di riferimento*, e cambiando sistema cambiano i numeri, non il
punto sul terreno. E i sistemi di riferimento vivono su due livelli, che
vanno tenuti distinti.

Il primo livello è il sistema geodetico, il datum: la scelta dell'ellissoide
che approssima la Terra e del modo in cui viene agganciato alla sua
superficie. Sul datum si misurano latitudine e longitudine, in gradi, su una
superficie curva. Il secondo livello è il sistema proiettato: si prende un
sistema geodetico e ci si aggiunge una proiezione cartografica, che
schiaccia la superficie curva su un piano e restituisce coordinate metriche,
quelle su cui si può disegnare e misurare. Ogni sistema, geodetico o
proiettato, ha un codice EPSG che lo identifica senza ambiguità.

Per capire i due livelli conviene fare un giro nella storia, perché
l'Italia li ha attraversati tutti. Nel dopoguerra il paese si è dato Roma40:
un ellissoide orientato all'osservatorio astronomico di Roma Monte Mario e,
sopra, la proiezione di Gauss nei due fusi ovest ed est. È il sistema che
tutti chiamano Gauss-Boaga (EPSG:3003 e 3004), e gran parte della
cartografia tecnica italiana è nata lì. In mezzo c'è stato anche ED50, il
datum europeo adottato dalla cartografia IGM, ma la svolta vera è arrivata
dal satellite.

Il GPS misura in WGS84 (EPSG:4326), un sistema geodetico globale:
latitudine e longitudine su un ellissoide geocentrico, nessuna proiezione.
Ma un datum globale ha un difetto per chi fa cartografia: i continenti si
muovono, e la placca euroasiatica scivola di un paio di centimetri all'anno.
Per questo l'Europa si è data ETRS89, un datum agganciato alla placca: le
coordinate di un punto fermo restano ferme nel tempo.

L'Italia ha realizzato ETRS89 con la Rete Dinamica Nazionale misurata nel
2008, da cui il nome RDN2008, cioè ETRF2000 all'epoca 2008.0. E qui la
geodesia incontra la legge: con il DM 10 novembre 2011 quello è diventato il
sistema geodetico nazionale, obbligatorio per le pubbliche amministrazioni,
con sopra le proiezioni UTM nei fusi 32, 33 e 34. Quando una consegna per un
ente pubblico si dichiara georiferita, il sistema di riferimento atteso è
quindi stabilito per decreto, non lasciato alla discrezione del fornitore.

Lo stesso chiusino ha coordinate diverse in ognuno di questi sistemi, e
nessuna è più vera delle altre: sono traduzioni della stessa posizione, e
per passare dall'una all'altra esistono trasformazioni note e documentate.

Il GIS è costruito attorno a un contratto preciso: ogni dataset dichiara il
sistema di riferimento in cui sono espresse le sue coordinate. Su questa
dichiarazione alcuni software costruiscono la riproiezione al volo: QGIS,
per esempio, permette di sovrapporre un'ortofoto in UTM e una mappa
catastale in Gauss-Boaga e le mostra allineate, convertendo le coordinate a
ogni ridisegno. È una funzionalità, non una garanzia: altri sistemi
richiedono che tutti i dati arrivino già nello stesso sistema di
riferimento. In entrambi i casi la dichiarazione è il prerequisito: senza
sapere da quale sistema si parte, nessuna conversione è possibile. Il CAD questo contratto non ce l'ha.
I numeri sono numeri, il significato sta nella testa di chi ha disegnato, e
quando quella testa non ha scelto un sistema il significato non c'è. È qui
che "georiferito" scivola verso "traslato".

## Perché lo scostamento non è una traslazione

Se l'errore fosse uguale dappertutto basterebbe spostare tutto una volta e
chiuderla lì. Invece 86 metri a un capo del disegno e 150 all'altro: lo
scostamento cambia lungo l'estensione del rilievo, e questo dice che oltre
alla traslazione ci sono di mezzo una rotazione e una scala.

Il motivo è geodetico prima che informatico. Un rilievo in coordinate locali
è un piano appoggiato al terreno in un punto; una proiezione cartografica è
un'altra cosa: ha una convergenza del meridiano che ruota il nord e un
modulo di deformazione lineare che cambia le distanze. Sovrapponendo a
occhio si fa combaciare un punto, magari il primo incrocio del disegno, e da
lì in poi le due superfici si aprono come una forbice: più ci si allontana
dal punto di appoggio, più l'errore cresce. Su un tracciato di qualche
chilometro, una strada o una condotta, quella forbice vale decine di metri.

Con centinaia di file la cosa peggiora, perché ogni file ha la sua storia:
origini diverse, rotazioni diverse, mani diverse che hanno traslato. Non
esiste *la* correzione, ne esistono tante quante sono le famiglie di file
che condividono lo stesso piano locale.

## Si georeferenzia con una trasformazione affine, non traslando

La soluzione non è traslare meglio, è smettere di traslare. Serve una
trasformazione affine stimata su punti di controllo: sei parametri, due
traslazioni, rotazione, scala e le loro combinazioni, calcolati ai minimi
quadrati su coppie di punti omologhi. Il procedimento è sempre lo stesso:
si scelgono i punti, si stima la trasformazione, si controllano i residui,
si applica.

I punti omologhi si scelgono su elementi riconoscibili sia nel disegno che
in una fonte affidabile, cartografia tecnica o ortofoto: chiusini, spigoli
di fabbricati, incroci di recinzioni. Ne bastano tre in teoria, ne servono
di più in pratica, distribuiti su tutta l'estensione del disegno: i
residui della stima sono l'unico modo per sapere se la trasformazione tiene
o se il file ha problemi peggiori di un piano locale.

Una volta stimati i parametri, PROJ sa applicarli direttamente, quindi la
correzione si automatizza con `ogr2ogr` su tutta la famiglia di file che
condivide lo stesso piano:

```sh
ogr2ogr -f GPKG corretto.gpkg disegno.dxf \
  -ct "+proj=affine +s11=... +s12=... +s21=... +s22=... +xoff=... +yoff=..." \
  -a_srs EPSG:25832
```

> `ogr2ogr` è lo strumento di conversione dei
> dati vettoriali di GDAL, la libreria su cui poggia mezzo mondo
> geospaziale, QGIS compreso. Legge un formato e ne scrive un altro, DXF
> incluso, e lungo la strada può trasformare le coordinate. L'opzione `-ct`
> accetta una pipeline PROJ e la applica a ogni geometria: qui
> `+proj=affine` esegue la trasformazione stimata, con i parametri da
> `s11` a `s22` che contengono rotazione e scala e `xoff`, `yoff` le due
> traslazioni. Da non confondere con `-a_srs`, che non trasforma nulla:
> dichiara soltanto il sistema di riferimento del file in uscita. Prima si
> trasformano le coordinate con `-ct`, poi si dichiara con `-a_srs` cosa
> sono diventate: è la stessa distinzione tra trasformare e dichiarare che
> attraversa tutto questo articolo.

In QGIS la stessa cosa si fa con l'algoritmo di trasformazione affine del
processing.

C'è poi il caso in cui i residui restano alti anche con una trasformazione
ben stimata. Succede con i disegni internamente incoerenti: fogli
digitalizzati dalla carta, mosaici di rilievi diversi incollati insieme,
geometrie ritoccate a mano negli anni. Lì l'affine non può funzionare,
perché non esiste una trasformazione unica da stimare: ogni zona del
disegno ha la sua. La tecnica per questi casi si chiama rubber sheeting: si
distribuiscono molti punti di controllo e il disegno viene deformato
localmente, come un foglio di gomma ancorato in più punti, interpolando la
deformazione tra un punto e l'altro. In QGIS lo fa il plugin Vector Bender,
in AutoCAD Map 3D la funzione omonima. Va usato sapendo cosa state
comprando: la posizione torna corretta sui punti di controllo, ma le forme
tra un punto e l'altro vengono piegate, e distanze e aree smettono di
essere affidabili. È una tecnica di recupero per un disegno compromesso,
non un modo per georeferenziarlo bene.

Il punto fermo, in ogni caso, è uno: **prima si
raggruppano i file per piano locale, poi si stima una trasformazione per
gruppo, e i residui si guardano sempre.** Applicare un'unica trasformazione
a tutti i file in blocco non elimina l'errore: lo ripartisce. La stima si
adatta alla media dei file, i più lontani dalla media restano fuori posto, e
nessuno finisce esattamente dove deve stare.

## Lavorare in locale è legittimo, consegnare senza aggancio no

Attenzione però a non rovesciare il problema: la colpa non è del sistema
locale in sé. Alla scala dell'oggetto il locale è lo strumento giusto. Una
casa si progetta in metri veri, perché in cantiere le distanze devono essere
quelle reali: sul piano UTM un lato di 100 metri misurato a terra può valere
99.96, a seconda della posizione nel fuso e della quota, e quella
contrazione, irrilevante per la cartografia, su una struttura è un errore.
Nessuno progetta un edificio in coordinate proiettate, e fa bene.

Alla scala dell'edificio, peraltro, collocare il progetto sul territorio è
un problema risolto: su poche decine di metri il modulo di deformazione è
praticamente costante, la trasformazione si riduce a una rototraslazione, e
bastano poche coppie di punti misurati in entrambi i sistemi per posizionare
il disegno senza ambiguità. Il progettista lavora in metri veri, chi riceve
ha l'aggancio.

Il discorso cambia quando il disegno copre chilometri. Un tracciato
stradale, una condotta, una rete non sono più alla scala dell'oggetto ma a
quella del territorio, e a quella scala le deformazioni della proiezione non
si possono ignorare: vanno gestite. È il lavoro per cui esistono il GIS e i
CAD con un motore di coordinate, come AutoCAD Map 3D o Civil 3D. Il drift da
150 metri con cui si apre questo articolo è il sintomo di uno strumento
usato fuori dal suo campo: un CAD in piano locale trattato come se fosse un
GIS.

Resta da capire come le coordinate proiettate arrivino in un disegno, ed è
qui che si chiude il cerchio: non dichiarando un codice EPSG al software, ma
dal rilievo. Un rilievo GNSS inquadrato nella rete nazionale restituisce
punti già in ETRF2000 proiettato UTM, e si disegna appoggiandosi a quei
punti. Un rilievo celerimetrico nasce locale e va inquadrato agganciando la
poligonale a vertici di coordinate note, lasciando al software topografico
il compito di applicare il modulo di deformazione. In entrambi i casi la
regola è la stessa: in un sistema proiettato si disegna sui punti calcolati,
mai riportando le distanze misurate. I punti del rilievo stanno sul piano
proiettato, dove le distanze sono già passate per il modulo di deformazione;
una distanza misurata a terra non coincide con la sua proiezione, e
riportarla tra quei punti reintroduce nel disegno lo stesso errore di scala
che si voleva eliminare.

## Il problema non è tecnico, è contrattuale

Sistemare centinaia di file costa giorni di lavoro. Prevenirli costava
qualche riga nel capitolato, e sono righe che impongono un metodo, non un
software: alla scala del territorio, consegna in un sistema di riferimento
dichiarato con codice EPSG; alla scala dell'oggetto, disegno locale
accompagnato dalle coordinate dei punti di controllo in entrambi i sistemi.
Il CAD e il GIS continueranno a convivere, ciascuno alla propria scala, e il
confine tra i due non si presidia a valle, quando i file vi sono già
arrivati traslati: si presidia a monte, nel momento in cui si scrive cosa
deve
contenere una consegna. Tutto il resto è georeferenziazione a occhio, e
l'occhio, su un piano proiettato, non è lo strumento migliore: è come
misurare i micron con il metro da sarto.
