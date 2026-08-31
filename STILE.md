# Profilo di scrittura - Eduard

Come scrive Eduard, ricavato dai suoi articoli italiani (2016-2019), da
IDEE.md (2026) e dalle sue correzioni al copy del sito. Serve a scrivere
bozze che richiedano meno revisioni. Riferimento per gli articoli del blog;
per le pagine del sito vale il registro più asciutto (vedi in fondo).

## La voce in breve

Prima persona concreta, esperienza diretta usata come prova, ironia asciutta
dosata con parsimonia, nessuna paura di prendere posizione. Parla al lettore
con il **voi**, gli dà del tu solo nella stoccata finale. Il tono è quello di
chi spiega a un collega al tavolo, non di chi tiene una conferenza.

## Struttura tipica di un articolo

1. **Attacco in medias res, da un artefatto concreto**: una domanda letta su
   Quora, una foto che circola, un problema incontrato al lavoro. Mai una
   premessa, mai "in questo articolo vedremo".
   > "Sono incappato in questa domanda su Quora:"
   > "Circola da un po' questa foto qui"
2. **Sviluppo per esame dell'oggetto**: smonta l'artefatto pezzo per pezzo
   ("lo farò analizzando le due parti separatamente"), spesso con un esempio
   personale nel mezzo ("Facciamo un esempio pratico. Questo sito è...").
3. **Tesi in grassetto**, una o due per articolo, mai di più. Sono frasi
   complete che reggono da sole:
   > "**E' molto difficile per le persone estranee al mondo dello sviluppo
   > avere idea di cosa ci sia dietro ogni progetto.**"
4. **Chiusa personale e netta**: un invito, una stoccata o un'immagine.
   Mai un riassunto.
   > "Se sei d'accordo con il post, forse dovresti rivedere alcune scelte di
   > vita ma ti prego di farmi anche sapere perché non lo sei."
   > "Abbiamo davanti una montagna di letame. Ognuno di noi ha in mano un
   > cucchiaino."

Lunghezza tipica: 400-1000 parole. Titoli di sezione diretti, a volte in
forma di domanda ("Il sito web statico deve costare poco?").

## Tratti ricorrenti

- **Domande retoriche come cerniere** tra un ragionamento e l'altro:
  "FACILE! O no?", "Non sembra più così facile vero?", "principio di pareto,
  anyone?".
- **Parentesi incidentali ironiche**: "(dopo averli elemosinati per qualche
  settimana probabilmente)", "(mi sono dimenticato questo... mi serve
  quello... è ovvio che debba essere così...)", "(cit.)".
- **Puntini di sospensione** per cambiare marcia: "Momento... cosa vuol dire
  costruire un sito statico?".
- **Colloquialismo mirato**, uno o due a pezzo, mai di più: "AMMIOCUGINO",
  "era una ciofeca", "trappole per umani", "Le chiacchere stanno a zero".
  Raro ma presente il dialetto veneto tra virgolette ("i mona che sa tutto").
- **Metafore popolari italiane**, mai metafore tech: il bar sport, l'oro
  colato, l'amaro in bocca, pecora o pappagallo, la montagna di letame.
- **Anglicismi tecnici non tradotti**: user experience, effort, deadline,
  best practice, feedback, wireframe. Non si italianizzano.
- **Corsivo per l'enfasi puntuale** ("_tutti lavorano per soldi_"), maiuscole
  rarissime per il picco emotivo ("_PRETENDO_").
- **Ammette i propri fallimenti** come parte dell'argomento: "Potete fallire,
  come è successo a tanti (anche a me)".

## Evoluzione: la voce di oggi

IDEE.md (2026) è più asciutta dei post del 2019: frasi dichiarative, sintesi
nominali dense ("Due normalizzazioni diverse dello stesso URI, il fix su
`$request_uri`, e il motivo per cui il fix non basta"), niente emoji, meno
esclamazioni. **La voce da imitare è quella: la densità di IDEE.md con i
tratti persistenti qui sopra** (attacco concreto, ironia nelle parentesi,
tesi in grassetto, chiusa netta). I vezzi più esuberanti del 2019 (emoji,
maiuscole urlate) vanno considerati superati.

Principio dichiarato in IDEE.md, da tenere come bussola dei contenuti:
> "I vicoli ciechi sono la parte più utile, quella che non sta nella
> documentazione ufficiale."

## Cosa NON scrive (anti-profilo)

Correzioni ricevute lavorando sul copy: frasi "molto americane" bocciate
senza appello. Quindi mai:

- la struttura promessa-al-lettore ("qui troverai...", value proposition);
- il lettore apostrofato e classificato ("per chi deve decidere...");
- la triade a effetto ("architetture, criteri, responsabilità");
- il gancio in negativo ("quello che nessuno ti dice su...");
- gergo da developer fuori contesto in testi rivolti a non tecnici
  ("reggere in produzione", "andare storto" - "non si può sentire");
- premesse, riassunti finali, "come vedremo", "in conclusione".

## Note per la revisione delle bozze

- Correggere in silenzio i refusi storici, non riprodurli: "perché" (non
  "perchè"), "È" (non "E'"), "chiacchiere", "approcciare".
- Non sterilizzare il ritmo: le frasi brevi consecutive, le domande, le
  parentesi lunghe sono voce, non errori.
- Ogni affermazione fattuale deve poggiare su esperienza sua o fonte citata:
  niente esempi inventati in prima persona.
- Registro delle pagine del sito (home, bio, sezioni): più sobrio degli
  articoli - dichiarativo, fatti, niente seconda persona, understatement.
  Vedi hero e "Chi sono" attuali come riferimento approvato.

## Segnali dalla revisione degli articoli

Pattern emersi confrontando le bozze con la versione che Eduard licenzia.
Aggiornare a ogni articolo.

**Nginx/Tomcat, agosto 2026** - prima bozza scritta col profilo:

- **Titoli espliciti, non evocativi.** Scarta il titolo a effetto in favore di
  quello che nomina il problema e contiene i termini che si cercano:
  "Nginx e Tomcat non sono d'accordo su cosa sia un path" →
  "Normalizzare i path tra Nginx e Tomcat per evitare vulnerabilità path
  traversal". Vale anche per i titoli di sezione: "Il fix ovvio, e perché non
  basta" → "Filtriamo `..;`". Preferisce nominare la cosa.
- **Il *voi* fin dalla prima riga**, non solo nello sviluppo:
  "C'era un `location`" → "Il vostro `location`".
- **Nomi propri per esteso alla prima occorrenza**: "Tomcat" → "Apache
  Tomcat", "il manager" → "Tomcat Manager". Non dà per scontato il contesto.
- **Aggiunge una glossa per il lettore non specialista** dove il testo
  presuppone un dominio: "Per chi non fosse esperto di Java EE, nella
  specifica delle servlet...". Il pubblico non è solo di pari.
- **Spezza i periodi lunghi e li rilancia con un sottotitolo-battuta**:
  "Funziona. Contro *quel* payload." è diventato "Funziona!" seguito da un
  `###` che dice "Ah no?". L'ironia gli piace, ma preferisce metterla nella
  struttura più che dentro la frase.
- **Grassetto anche sui soggetti tecnici** a inizio paragrafo (**Nginx**,
  **Tomcat**) per rendere scansionabile il confronto, non solo sulle tesi.
- **Attenua le metafore troppo colloquiali in contesto tecnico**:
  "whack-a-mole" → "nascondino". Tiene invece i termini di mestiere in
  inglese ("payload", "Security through Obscurity").
- **Chiede sempre il contesto prima del problema**: due paragrafi di setup
  (com'è fatta l'architettura, cos'è il componente e perché è lì) prima di
  mostrare il bug. Non parte mai dall'anomalia senza aver posato la scena.

Da tenere d'occhio nei prossimi pezzi: tende a **chiudere sull'ultima nota
tecnica** invece che con la stoccata personale prevista dal profilo. Se si
ripete, non è una svista ma un'evoluzione della voce, e va scritto qui.
