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

Stato: bozza (`georeferenziare-disegni-cad`, draft = true)

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
architect. Tre tagli possibili, probabilmente una serie e non un pezzo solo:
l'architettura del viewer, la gestione dei dati urbani (tiling, livelli di
dettaglio, formati), e come l'architettura è cambiata nel tempo, con quello
che oggi si rifarebbe diversamente. Si collega all'idea sulla precisione in
virgola mobile già in lista. Lingua: italiano per il taglio di design,
inglese possibile per i pezzi più tecnici.

Da fare: buttare giù le decisioni chiave e i vicoli ciechi di ciascun taglio
finché si ricorda il perché di ogni scelta.

## felib: progettare una libreria condivisa tra prodotti

Stato: idea

felib è la libreria condivisa dei prodotti 3DGIS. Il tema è il design di una
libreria interna che serve più prodotti: cosa ci entra e cosa no, come si fa
evolvere senza rompere chi la usa, confini delle API e versioning. Anche
questa è una serie, un pezzo per decisione di design. Tema trasversale che
parla anche a chi non fa GIS. Lingua: italiano.

Da fare: la voce va riempita con decisioni concrete ed errori reali, per ora
è solo il perimetro.

## carto.bi: dove il GIS incontra la business intelligence

Stato: idea

Il design di un prodotto di location intelligence, su tre livelli: le scelte
architetturali per far convivere dati spaziali e BI, la pipeline dei dati
(aggregazioni, PostGIS, multi-tenancy), e il design del prodotto per clienti
reali. Anche questa è una serie, un pezzo per livello o per decisione.
Lingua: italiano.

Da fare: come per felib, servono le decisioni e i vicoli ciechi di prima
mano.

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
