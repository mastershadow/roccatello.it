+++
date = "2026-09-09"
lastmod = "2026-09-09"
draft = false
title = "La legge di Conway vale anche per gli agenti di intelligenza artificiale"
slug = "legge-di-conway-agenti-intelligenza-artificiale"
summary = "Più sessioni di Claude Code in parallelo sono un team nelle tue mani. Lo sai gestire? Il problema non è nei modelli ma nell'organizzazione, e Conway definiva questo concetto nel 1967. Vediamo come un documento di design condiviso e un agente di coordinamento siano fondamentali."
tags = ["ai", "agenti", "software", "ingegneria", "development"]
ogimage = "img/og/legge-di-conway-agenti-intelligenza-artificiale.png"
language = "it"
+++

Spesso si parla dell'orchestrazione degli agenti LLM come se fosse un problema appena emerso. In realtà il coordinamento di team è il problema più vecchio
dell'ingegneria del software: come si spezza un lavoro tra più teste
senza che nel risultato finale si veda come è stato suddiviso? La differenza è che
adesso le teste sono modelli e non persone.

I modelli linguistici di grandi dimensioni, gli LLM, sono i sistemi di intelligenza artificiale che
stanno dietro a strumenti come ChatGPT e Claude: ricevono un testo e
producono un testo.

Un agente è un LLM a cui sono stati dati degli strumenti e un obiettivo: può leggere e scrivere file, eseguire comandi,
consultare la documentazione, e ripete il ciclo di ragionamento e azione finché non ritiene di aver finito.
Ultimamente uso Claude Code: è un agente di questo tipo che lavora direttamente dentro un repository di codice.

Orchestrare agenti significa far lavorare più agenti sullo stesso
obiettivo, ciascuno con un compito, e assemblare i risultati.
È una scelta utile quando il compito è troppo grande per un singolo agente o se si vuole parallelizzare le attività per risparmiare tempo bruciando più token.
Suddividere però crea i classici problemi dei team di sviluppo.

Vi racconto la mia esperienza con uno dei progetti al quale sto lavorando e sul quale sto facendo alcuni esperimenti con gli LLM.
Ho iniziato aprendo N sessioni di Claude Code sullo stesso repo. Ad ognuna ho assegnato un compito, per poi cercare di ottenere un risultato.
Ogni agente aveva fatto esattamente quello che gli era stato chiesto. Preso nel suo insieme, però, non funzionava nulla.
Probabilmente facendo fare tutto ad un singolo agente, avrei avuto un prodotto funzionante ma con il doppio del tempo.
Quindi? Cosa facciamo?

## Ogni risultato era corretto, ma anche sbagliato

Nessuno degli agenti ha sbagliato il proprio compito.
Gli errori sono di comunicazione. Lo stesso concetto era stato chiamato
in tre modi diversi in tre componenti diverse, due agenti avevano risolto lo
stesso problema di validazione ciascuno a modo loro.
L'interfaccia software che uno esponeva non era quella che l'altro si aspettava di consumare.
Assemblare i risultati era sostanzialmente possibile solo dopo una grande revisione.
Fortunatamente stavo solo lavorando ad un prototipo.

Riflettendoci, se la stessa cosa fosse successa con sviluppatori junior chiusi in stanze diverse senza potersi parlare, sarebbe stato quello che succede normalmente nelle aziende.
Un buon coach avrebbe detto che l'errore era organizzativo prima ancora che tecnico.

Con gli agenti invece la prima reazione, quasi istintiva, è dare la colpa al modello, come se il problema
stesse nella qualità delle singole risposte. Invece mancava un coordinamento.

## Conway aveva descritto questo fenomeno nel 1967

Melvin Conway era un programmatore che nel 1967 scrisse un articolo
intitolato "How Do Committees Invent?", pubblicato su Datamation l'anno
dopo. Osservava una cosa che chiunque abbia lavorato in
un'organizzazione grande riconosce immediatamente: **le aziende che
progettano sistemi sono costrette a produrre progetti che sono copie della
loro struttura di comunicazione**.

Perché due componenti si parlino bene, le persone che le scrivono devono parlarsi, dato che
un'interfaccia è prima di tutto un accordo tra chi sta ai due lati.
Dove quell'accordo non c'è, perché i due gruppi non comunicano o comunicano male,
l'interfaccia si scrive al volo, senza riflettere. Quindi se avete tre team che
non si parlano vi ritroverete tre sottosistemi che non si parlano.
È un'osservazione di quasi sessant'anni fa ma non ha mai perso di valore.
Alcune scuole di pensiero la utilizzano al contrario, costruendo i team nella forma che si vuole dare al software.

Agenti lanciati in parallelo sono a tutti gli effetti un'organizzazione, e non hanno una struttura di comunicazione.
Ognuno riceve il suo brief, lavora nel suo contesto e consegna qualcosa, senza sapere che cosa stiano facendo gli altri. Il software
che ne esce rispecchia questa struttura alla lettera, coerente dentro ogni
componente e incoerente sulle interfacce.

## Serve un riferimento condiviso

La correzione non è stata rinunciare al parallelismo, che è un ottimo modo di utilizzare gli agenti, ma definire bene compiti e comunicazione.
Un modulo, un servizio, uno strato con un'interfaccia esistente verso il resto: con una specifica un agente può gestire e costruire senza inventarsi le cose.

La tecnica, in concreto, è questa. Prima di aprire qualunque sessione si scrive un documento di design condiviso, in cui le componenti sono elencate e tutte le interfacce tra loro sono già definite: cosa espone ciascuna
parte, cosa consuma, con quali nomi e in quale forma. Ogni sessione riceve il documento insieme al proprio compito, e **il documento è un contratto di ferro**.

La seconda regola è che **le decisioni non coperte dal documento non si prendono sul posto**.
Se un agente dovesse pensare di modificare un'interfaccia, semplicemente non lo fa: si ferma e comunica la richiesta al coordinatore. La decisione viene presa a livello di coordinamento, il
documento viene aggiornato e l'aggiornamento arriva a tutte le sessioni.
È esattamente la struttura di comunicazione che nel primo tentativo mancava.

Per far funzionare le due regole serve un agente di coordinamento, con un compito solo: tenere il documento di design, spezzare il lavoro e distribuirlo, ricevere le domande delle altre sessioni, decidere, aggiornare
il documento e alla fine controllare che i pezzi si incastrino. Le sessioni che lavorano sulle componenti non si parlano. Mai.

La somiglianza con la gestione dei progetti non è casuale. Chi ha lavorato
su una commessa grande, progettata prima e progettata bene, sa come
vanno le cose: le persone possono lavorare in parallelo perché ognuna sa
cosa deve produrre e cosa riceverà dagli altri, e le riunioni servono a
verificare, non a decidere. Dove invece il progetto è appena abbozzato, o esiste solo per
formalità, le cose si inventano al momento. Ogni gruppo decide per sé e le
decisioni degli altri si scoprono quando i pezzi devono incastrarsi.
Tutto il tempo risparmiato all'inizio viene perso alla fine, con l'ennesima consegna mancata.

## Chi guida il progetto?

In un team questo ruolo è la somma di due figure, di solito distinte ma nelle piccole realtà spesso uniche. Il product owner, che decide cosa entra nel prodotto e accetta o
respinge quello che viene consegnato, ed è quindi la persona a cui spettano le decisioni che le sessioni sottopongono. E il project manager, che
tiene in testa l'insieme, fa in modo che le specifiche siano scritte prima che si cominci e controlla i punti di raccordo dopo. Con gli agenti la
coincidenza delle due figure è la norma. Il ruolo non sparisce, cambia soltanto chi lo ricopre: può essere l'agente di coordinamento, oppure potete essere voi.
**Quello che non può succedere è che il ruolo resti vacante**, perché per la legge di Conway quel vuoto si ritrova poi nel codice. Esattamente come è successo durante la prototipazione del mio progetto.

Rifatta così, con il documento di design scritto prima e un agente di coordinamento sopra, la stessa feature è uscita coerente e il merge è tornato ad essere la formalità che doveva essere fin dall'inizio.
Ora il prototipo funziona.

Gli strumenti sono nuovi ma le capacità necessarie sono le stesse di
sempre. Chi sa spezzare il lavoro in un team lo sa spezzare anche tra
agenti, dato che il ragionamento è identico: prima i confini e i contratti,
poi le persone, o i processi, che ci lavorano dentro. Chi non lo sa fare
otterrà lo stesso risultato di sempre, solo più in fretta, perché gli
errori di organizzazione che prima impiegavano settimane a manifestarsi
adesso si vedono in poche ore.

Quello che dico sempre: l'AI mette a leva le tue capacità. Sia nel bene che nel male.
