+++
date = "2026-09-28"
lastmod = "2026-09-28"
draft = true
title = "Perché carto.app disegna le mappe sulla CPU"
slug = "carto-app-mappe-cpu"
summary = "Nel 2022 avevo lasciato aperta una domanda: come si disegna una ventina di layer su una mappa mobile senza perdere fluidità. La risposta è che mentre la mappa si muove non si ridisegnano affatto."
tags = ["carto", "android", "rendering", "gis", "mobile"]
ogimage = "img/og/carto-app-mappe-cpu.png"
language = "it"
mermaid = true
+++

Nel luglio 2022 avevo chiuso un [post tecnico su carto.app](/2022/07/behind-carto-app-technical-review/)
con una domanda: come si disegnano cento layer raster mantenendo un frame rate
ragionevole? Non avevo mai risposto.

In un'installazione tipica i layer accesi sono una ventina, non cento, ma il
problema è lo stesso. La risposta breve è che, mentre la mappa si muove, non li
si ridisegna affatto.

carto.app è l'app Android di [3DGIS](https://www.3dgis.it) per i rilievi sul
campo. Il motore che disegna la mappa non sta nell'app, ma nel framework mobile
che sviluppo dal 2015 e sul quale carto.app costruisce la propria logica. È un
motore 2D, che disegna sulla CPU.

## Il canvas accelerato in hardware è stato provato due volte

Il motore disegna con `android.graphics.Canvas`, che in Android può lavorare in
due modi. Nella gerarchia delle view di un'app con accelerazione hardware, che
è il default, i comandi di disegno vengono eseguiti dalla GPU. Su una `Bitmap`,
o su una superficie ottenuta con `lockCanvas()`, lavora invece sulla CPU.

Il motore di carto.app usa il secondo modo, e ci è arrivato per gradi. Nel 2017
ridisegnava tutti i layer a ogni fotogramma, trenta volte al secondo, su una
`SurfaceView` con il canvas software. Nel giugno 2019 sono arrivati il doppio
buffer, il render differito e la separazione dei layer in due classi, e con
loro il canvas accelerato in hardware, `lockHardwareCanvas()`. Nell'ottobre
2020 il motore è passato alla `TextureView`, all'inizio ancora con il canvas
hardware e due settimane dopo con quello software, `lockCanvas()`. Da allora è
rimasto così.

**[DA COMPLETARE: perché si è tornati dal canvas hardware a quello software, e
se la scelta nasce da problemi visti su dispositivi reali. Negli appunti:
semplicità e prevedibilità, comportamento identico su qualsiasi dispositivo,
anche sui rugged di fascia bassa.]**

Oggi il render differito disegna su una bitmap fuori schermo, e il thread che
aggiorna lo schermo disegna sulla `TextureView` con il canvas software. La GPU
interviene solo quando il sistema compone la `TextureView` insieme al resto
dell'interfaccia. OpenGL nel motore non c'è, e nella storia del repository non
compare mai.

## Non tutti i layer sono uguali

La separazione in due classi, arrivata nel giugno 2019, funziona così.

I layer **deferred** sono quelli pesanti: gli sfondi raster (OpenStreetMap, WMS,
le tile del server Carto) e i dati vettoriali, come la segnaletica stradale e
le assegnazioni. Vengono disegnati in background, in una bitmap fuori schermo,
e solo quando la mappa è ferma.

I layer **realtime** sono quelli che devono seguire l'utente istante per
istante: la posizione GPS, la selezione, la geometria in modifica, gli overlay.
Vengono ridisegnati a ogni fotogramma, sopra la bitmap dei deferred.

I realtime sono leggeri perché di solito contengono poco: una geometria in
modifica, qualche marker, la posizione. È la separazione che permette di avere
un puntino GPS che si muove fluido sopra uno sfondo che non si sta
ridisegnando.

## Mentre la mappa si muove, si sposta una fotografia

Durante un trascinamento o un pinch il motore non ridisegna i layer deferred.
Un thread a 25 fotogrammi al secondo prende l'ultima bitmap renderizzata e la
trasforma con una matrice di traslazione e scala, calcolata dalla differenza
fra la posizione della camera al momento del render e quella attuale.

In pratica l'utente sta spostando una fotografia della mappa. La fotografia
costa sempre uguale, che sotto ci siano due layer o venti, e **il pan
resta fluido indipendentemente dal peso dei dati**.

## Quando la mappa si ferma, si lavora

Il lavoro vero comincia quando il gesto finisce. Il motore lo capisce con un
debounce: ogni passo del gesto fa ripartire un timer di 150 millisecondi, e
quando il timer scade il gesto è considerato concluso.

A quel punto si sveglia il thread di rendering differito, che per ogni layer
deferred visibile fa quattro cose, nell'ordine:

1. annulla le richieste ancora in corso, che riguardano una vista ormai vecchia;
2. ricalcola la griglia delle tile visibili, da 256 pixel per i raster a tile;
3. rimanda al pool le tile uscite dallo schermo, senza distruggerle;
4. chiede i dati delle tile nuove.

Il recupero è asincrono. Prima si guarda la cache su disco, poi la sorgente.
In carto.app le sorgenti sono le tile raster via HTTP (il server Carto, WMS,
OpenStreetMap), la segnaletica chiesta alle API del server Carto per l'area
visibile e fusa con le modifiche di campagna non ancora inviate, e i dati
locali dell'app, come le assegnazioni. Le immagini vengono decodificate su un
pool con un thread per core, riusando la memoria delle bitmap già allocate
(`inBitmap`, fino a 128 MB) invece di chiederne di nuova. Le geometrie
vettoriali vengono filtrate e ritagliate ai bordi della vista. Il motore
prevede anche una semplificazione Douglas-Peucker con una tolleranza di circa
un pixel, disponibile ma oggi non attiva.

Ogni tile che arriva segnala che serve un ridisegno, ma il ridisegno non parte
subito. Un secondo timer, di 67 millisecondi, raccoglie le segnalazioni: una
raffica ravvicinata di tile produce un solo render.

Il render avviene in un secondo buffer. Quando è finito i due buffer si
scambiano, la matrice di trasformazione si azzera e il thread a 25 fotogrammi
ricomincia a disegnare la fotografia nuova, con i layer realtime sopra.

{{< mermaid >}}
graph TD
    A["Gesto: pan o pinch"] --> B["Trasformazione dell'ultima bitmap, 25 FPS"]
    A --> C["Debounce 150 ms"]
    C --> D["Annullamento delle richieste obsolete"]
    D --> E["Griglia delle tile e riciclo dal pool"]
    E --> F["Cache su disco o sorgente, in asincrono"]
    F --> G["Decodifica e ritaglio"]
    G --> H["Accorpamento dei ridisegni, 67 ms"]
    H --> I["Render nel back buffer"]
    I --> J["Scambio dei buffer"]
    J --> K["Bitmap nuova + layer realtime, 25 FPS"]
    B --> K
{{< /mermaid >}}

Il render non aspetta la tile più lenta. Se una tile non è ancora arrivata, al
suo posto resta un vuoto, e di norma sarà l'arrivo di quella tile a provocare
il render successivo.

## Il lavoro migliore è quello che non si fa

Messi in fila, quasi tutti i meccanismi del motore servono a evitare lavoro. Il
debounce evita di renderizzare viste che l'utente sta già abbandonando.
L'annullamento evita di scaricare e decodificare tile che non verranno mai
mostrate. L'accorpamento evita render intermedi che nessuno vedrebbe. Il
riciclo di tile e bitmap evita allocazioni, e su Android meno allocazioni
significano meno pause del garbage collector.

Anche i tentativi falliti seguono la stessa logica. Fino a marzo 2026 una
richiesta fallita veniva ritentata ogni 3 secondi; oggi i tentativi si
diradano con un backoff esponenziale, da 3 fino a 64 secondi, con una
componente casuale.

**[DA COMPLETARE: il motivo del backoff. Il cambio è arrivato insieme al lavoro
sui layer OpenStreetMap.]**

## Il prezzo di questa scelta

Un motore costruito così ha dei limiti, e conviene dirli. Alcuni dipendono dal
modo in cui disegna, altri no.

Mentre la mappa si muove, la bitmap che si sposta contiene solo quello che era
già stato disegnato, quindi ai bordi compaiono aree vuote fino al render
successivo. Quanto sono larghe dipende dal tipo di layer: i vettoriali sono
disegnati esattamente sull'area visibile, i raster a immagine singola hanno 20
pixel di margine, quelli a tile arrivano fino al bordo dell'ultima tile
parzialmente visibile.

A mappa ferma, ogni arrivo di tile ridisegna tutti i layer deferred a schermo
intero, quindi il costo del render cresce con il numero di layer. La fotografia
mentre ci si muove costa sempre uguale, il render a mappa ferma no.

Nemmeno i layer realtime sono gratis. La geometria in modifica viene
ridisegnata a ogni fotogramma per intero, senza ritaglio, ricostruendo il
tracciato vertice per vertice: con una geometria da migliaia di vertici, il
costo di ogni fotogramma cresce con il numero di vertici.

Altri limiti invece non vengono dal `Canvas`. Lo zoom procede per livelli
interi perché tutta la catena è indicizzata per livello: le risoluzioni del
sistema di riferimento, spesso fornite dal server, le piramidi di tile, i range
di zoom delle regole di stile. Durante il pinch la bitmap si scala in modo
continuo, ma al rilascio lo zoom si ferma su un livello intero. La rotazione
non c'è perché la griglia delle tile è pensata allineata agli assi, anche se
`Canvas` saprebbe ruotare. Animazioni e fling non sono mai stati implementati.

## La fluidità è una questione di tempi

La domanda del 2022 era posta in termini di potenza: quanti layer riesci a
disegnare in un fotogramma. Il motore di carto.app la sposta su un altro piano:
quali layer serve disegnare, e quando.

**[DA COMPLETARE: chiusura. Cityvu mobile, se si può nominare.]**
