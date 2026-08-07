# Backlog articoli

Lista dei temi candidati. Non è un piano editoriale, è un raccoglitore: si
aggiunge quando capita qualcosa, si pesca quando si ha voglia di scrivere.

Regola di alimentazione: ogni volta che risolvere un problema costa più di due
o tre ore di indagine, quello diventa una voce qui, scritta entro pochi giorni
finché si ricordano i vicoli ciechi. I vicoli ciechi sono la parte più utile,
quella che non sta nella documentazione ufficiale.

Stati usati: `idea`, `bozza`, `in revisione`, `pubblicato`.

## Nginx e Tomcat non sono d'accordo su cosa sia un path

Stato: bozza

Il bypass `..;` che espone il manager di Tomcat dietro un `deny all` su Nginx.
Due normalizzazioni diverse dello stesso URI, il fix su `$request_uri`, e il
motivo per cui il fix non basta. Lingua: italiano.

Da verificare prima di pubblicare: che il sistema di origine non sia più
esposto, e il comportamento di Tomcat sul separatore percent-encoded `%3b`.

## Il drift dei file CAD georiferiti

Stato: idea

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