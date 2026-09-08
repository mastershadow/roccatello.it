+++
date = "2026-09-09"
lastmod = "2026-09-09"
draft = true
title = "La legge di Conway vale anche per gli agenti di intelligenza artificiale"
slug = "legge-di-conway-agenti-intelligenza-artificiale"
summary = "Ho aperto più sessioni di Claude Code in parallelo su una feature, una per componente, e il risultato era peggiore di quello che avrebbe fatto un agente solo, anche se ogni pezzo preso da solo era giusto. Il problema non stava nei modelli ma nell'organizzazione, e Conway lo aveva già descritto nel 1967. Vi racconto cosa è andato storto e come l'ho risolto con un documento di design condiviso e un agente di coordinamento."
tags = ["ai", "agenti", "software", "ingegneria", "development"]
ogimage = "img/og/legge-di-conway-agenti-intelligenza-artificiale.png"
language = "it"
+++

Spesso si parla dell'orchestrazione degli agenti LLM come se fosse un problema appena emerso. In realtà il coordinamento di team è il problema più vecchio
dell'ingegneria del software, cioè come si spezza un lavoro tra più teste
senza che nel risultato finale si veda dove è stato spezzato. La differenza è che
adesso le teste sono modelli e non persone.

Due parole sui termini, prima di andare avanti. I modelli linguistici di
grandi dimensioni, gli LLM, sono i sistemi di intelligenza artificiale che
stanno dietro a strumenti come ChatGPT e Claude: ricevono un testo e
producono un testo. Un agente è un LLM a cui sono stati dati degli
strumenti e un obiettivo: può leggere e scrivere file, eseguire comandi,
consultare la documentazione, e ripete il ciclo di ragionamento e azione
finché non ritiene di aver finito. Claude Code, lo strumento di cui parlo
in questo articolo, è un agente di questo tipo che lavora direttamente
dentro un repository di codice.

Orchestrare agenti significa far lavorare più agenti sullo stesso
obiettivo, ciascuno con un compito, e mettere insieme i risultati. È il
passo che si fa quando un compito è troppo grande per il contesto di un
agente solo, o quando si vuole fare in parallelo quello che in sequenza
richiederebbe ore. Ed è il passo in cui si ripresentano problemi vecchi.

Vi racconto la mia esperienza con uno dei progetti al quale sto lavorando e sul quale ho voluto condurre degli esperimenti con gli LLM. Con Claude Code ho fatto quello che sembrava naturale: ho aperto N sessioni e ho assegnato in ciascuna un compito, per poi ricomporre il tutto alla fine. Il risultato è arrivato in fretta e,
preso pezzo per pezzo, era anche corretto: ogni agente aveva fatto
esattamente quello che gli era stato chiesto. Preso nel suo insieme, però,
era peggiore di quello che un agente solo, con tutto il contesto a
disposizione, avrebbe prodotto impiegandoci magari il doppio del tempo.

## Ogni risultato era corretto, ma anche sbagliato

Nessuno degli agenti ha sbagliato il proprio compito. È questo il dettaglio
che rende il caso interessante, perché **il problema non stava dentro i
compiti ma tra un compito e l'altro**. Lo stesso concetto era stato chiamato
in tre modi diversi in tre componenti diverse, due agenti avevano risolto lo
stesso problema di validazione ciascuno a modo loro (entrambi in modo
ragionevole, va detto), e l'interfaccia che uno esponeva non era quella che
l'altro si aspettava di consumare. La ricomposizione, che sulla carta doveva
essere una formalità di dieci minuti, è diventata il lavoro vero della
giornata.

Se la stessa cosa fosse successa con sviluppatori junior chiusi in stanze diverse senza potersi parlare,
nessuno si sarebbe stupito più di tanto. Sarebbe stato quello che succede normalmente nelle aziende.

Ci saremmo detti che l'errore era
organizzativo prima ancora che tecnico. Con gli agenti invece la prima
reazione, quasi istintiva, è dare la colpa al modello, come se il problema
stesse nella qualità delle singole risposte. Ma le singole risposte erano
buone. Quello che mancava era qualcuno che guardasse l'insieme.

## Conway aveva descritto questo fenomeno nel 1967

Melvin Conway era un programmatore che nel 1967 scrisse un articolo
intitolato "How Do Committees Invent?", pubblicato su Datamation l'anno
dopo. Osservava una cosa che chiunque abbia lavorato in
un'organizzazione grande riconosce al volo: **le aziende che
progettano sistemi sono costrette a produrre progetti che sono copie della
loro struttura di comunicazione**.

Il motivo per cui la legge funziona è quasi banale. Perché due
moduli si parlino bene, le persone che li scrivono devono parlarsi, dato che
un'interfaccia è prima di tutto un accordo tra chi sta ai due lati. Dove
quell'accordo non c'è, perché i due gruppi non comunicano o comunicano male,
l'interfaccia viene fuori come può, cioè male. Quindi se avete tre team che
non si parlano vi ritroverete tre sottosistemi che non si parlano, con le
interfacce peggiori esattamente nei punti in cui passano i confini tra i
team. È un'osservazione di quasi sessant'anni fa e nel frattempo non ha
smesso di valere nemmeno per un giorno, al punto che oggi la si usa al
contrario, disegnando prima i team nella forma che si vuole dare al
software.

Agenti lanciati in parallelo sono a tutti gli effetti
un'organizzazione, e non hanno una struttura di comunicazione.
Ognuno riceve il suo brief, lavora nel suo contesto e
consegna, senza sapere che cosa stiano facendo gli altri. Il software
che ne esce rispecchia questa struttura alla lettera, coerente dentro ogni
componente e incoerente sulle interfacce.
Dove non esisteva un contratto ogni agente si è arrangiato come poteva.

## Ho spezzato il lavoro lungo i confini che esistevano già

La correzione non è stata rinunciare al parallelismo, che resta il motivo
per cui gli agenti convengono, ma rimettere i confini dove il sistema li
aveva già. Un modulo, un servizio, uno strato con un'interfaccia esistente
verso il resto: quella è una parte che un agente può gestire per intero,
dato che il contratto con gli altri esiste prima che lui cominci e non deve
inventarlo strada facendo.

La tecnica, in concreto, è questa. Prima di aprire qualunque sessione si
scrive un documento di design condiviso, in cui le componenti sono elencate
e tutte le interfacce tra loro sono già definite: cosa espone ciascuna
parte, cosa consuma, con quali nomi e in quale forma. Ogni sessione riceve
il documento insieme al proprio compito, e **il documento è il contratto**.

La seconda regola è che **le decisioni non coperte dal documento non si
prendono sul posto**. Se un agente incontra una scelta che tocca un'interfaccia
o che gli altri dovrebbero conoscere, non decide da solo: si ferma e la
riporta indietro. La decisione viene presa a livello di coordinamento, il
documento viene aggiornato e l'aggiornamento arriva a tutte le sessioni.
È esattamente la struttura di comunicazione che nel primo tentativo
mancava.

Per far funzionare le due regole serve un agente di coordinamento, con un
compito solo: tenere il documento di design, spezzare il lavoro e
distribuirlo, ricevere le domande delle altre sessioni, decidere, aggiornare
il documento e alla fine controllare che i pezzi si incastrino. Le sessioni
che lavorano sulle componenti non si parlano tra loro; parlano tutte con
lui.

La somiglianza con la gestione dei progetti non è casuale. Chi ha lavorato
su una commessa con un progetto vero, scritto prima e fatto bene, sa come
vanno le cose: le persone possono lavorare in parallelo perché ognuna sa
cosa deve produrre e cosa riceverà dagli altri, e le riunioni servono a
verificare, non a decidere. Dove invece il progetto non c'è, o c'è solo per
formalità, le cose si inventano al momento. Ogni gruppo decide per sé, le
decisioni degli altri si scoprono quando i pezzi devono incastrarsi, e il
tempo risparmiato all'inizio viene perso alla fine, con gli interessi.

Con gli agenti succede la stessa cosa. Il documento di design condiviso è il
progetto, e l'agente di coordinamento è chi lo fa rispettare; una
distribuzione delle attività con un compito per sessione e nessun documento
corrisponde a un cantiere dove si decide sul posto, con la differenza che
il problema si vede nel giro di ore invece che di mesi.

## Serve qualcuno che tenga l'insieme

In un team questo ruolo è la somma di due figure, di solito distinte ma nelle piccole realtà spesso uniche. Il product owner, che decide cosa entra nel prodotto e accetta o
respinge quello che viene consegnato, ed è quindi la persona a cui tornano
le decisioni che le sessioni riportano indietro. E il project manager, che
tiene in testa l'insieme, fa in modo che i contratti siano scritti prima
che si cominci e controlla i punti di raccordo dopo. Con gli agenti la
coincidenza delle due figure è la norma. Il ruolo non sparisce, cambia
soltanto chi lo ricopre: può essere l'agente di coordinamento, oppure potete essere voi,
che è quello che faccio più spesso. **Quello che non può succedere è che il ruolo
resti vuoto**, perché per la legge di Conway quel vuoto si ritrova poi nel
codice. Nel mio primo tentativo ogni sessione aveva il proprio brief e
nessuno aveva il brief dell'insieme.

Rifatta così, con il documento di design scritto prima e un agente di
coordinamento sopra, la stessa feature è uscita coerente e il merge è tornato ad
essere la formalità che doveva essere fin dall'inizio.

Gli strumenti sono nuovi ma le capacità necessarie sono le stesse di
sempre. Chi sa spezzare il lavoro in un team lo sa spezzare anche tra
agenti, dato che il ragionamento è identico: prima i confini e i contratti,
poi le persone, o i processi, che ci lavorano dentro. Chi non lo sa fare
otterrà lo stesso risultato di sempre, solo più in fretta, perché gli
errori di organizzazione che prima impiegavano settimane a manifestarsi
adesso si vedono in poche ore.
