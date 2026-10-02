import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";

const FONT_URL = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Spectral:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500;600&display=swap";

// ── LIGHT PALETTE ─────────────────────────────────────────────────────────────
// BRAND PALETTE — ABATON SACRED DREAMS 2026
const C = {
  bg:      "#F2DFCF",   // Alba
  white:   "#FFFFFF",
  cream:   "#E9DEC9",   // Pergamena
  nebbia:  "#DCDFDA",   // Nebbia
  card:    "#FDFAF6",   // warm white cards
  gold:    "#C8A86A",   // Oro soffuso
  goldL:   "#D4B87A",   // oro chiaro
  goldD:   "#9A7C45",   // Oro antico
  goldPale:"#F4EAD8",   // oro palissandro
  blue:    "#14223D",   // Notte
  blueM:   "#2A3A5A",   // notte medio
  luna:    "#7E92B2",   // Luna
  salvia:  "#9DA890",   // Salvia
  bluePale:"#EAF0F8",
  text:    "#14223D",   // Notte
  textD:   "#14223D",
  textS:   "#1A2A4A",   // blu notte, quasi pieno
  textM:   "#22335A",   // blu notte, un filo più chiaro
  border:  "#E2D4BC",   // Pergamena border
  borderL: "#D8CCAA",
  shadow:  "0 4px 24px rgba(20,34,61,0.07)",
  shadowG: "0 8px 32px rgba(200,168,106,0.20)",
};
const FD = "'Cormorant Garamond',Georgia,serif";
const FS = "'Spectral','Georgia',serif";
const FB = "'Jost',system-ui,sans-serif";

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const T = {
  it:{
    title:"Con te",
    tagline:"Sognare per ricordare.",
    expBtn:"Come prepararsi al meglio\nper i sogni",
    nav:["Home","Abaton","Damanhur","Benessere","Concierge"],
    eventsTitle:"Questa settimana a Damanhur",
    eventsFull:"Tutti gli eventi →",
    eventsPhone:"+39 320 482 4427",
    checkOut:"Check-out ore 10:30",
    lateOut:"Late check-out? Scrivici",
    wifiName:"WiFi  ·  abaton",
    back:"← indietro",
    concTitle:"Chiedi all'Abaton",
    concWelcome:"Sono qui, con calma e presenza.\nDi cosa hai bisogno?",
    concPlaceholder:"Scrivi qualcosa...",
    suggestions:["Cosa posso fare oggi?","Ho bisogno di relax","Non riesco a dormire","Cos'è Damanhur?"],
    ritualTitle:"Rituale della Notte",
    ritualSteps:[
      {id:"r1",text:"Disconnetti tutti i dispositivi"},
      {id:"r2",text:"Riempi la bottiglia d'acqua sul comodino"},
      {id:"r3",text:"Chiudi le tende oscuranti"},
      {id:"r4",text:"Accendi la fragranza della stanza"},
      {id:"r5",text:"Fai lo schema Teco — percorri con un dito il simbolo sul letto per almeno 3 minuti",special:"teco"},
      {id:"r6",text:"Apri il quaderno dei sogni e posizionalo sul comodino con una penna"},
      {id:"r7",text:"Scrivi una domanda o un'intenzione per la notte"},
    ],
    breathTitle:"Respirazione per il Sogno",
    breathDesc:"11 minuti di rumore bianco per preparare il corpo al sogno profondo.",
    book:"Prenota",
    buyOnline:"Acquista online",
    pickUp:"Ritiro Abaton",
  },
  en:{
    title:"With you",
    tagline:"Sleep to remember.",
    expBtn:"How to best prepare\nfor your dreams",
    nav:["Home","Abaton","Damanhur","Wellness","Concierge"],
    eventsTitle:"This week at Damanhur",
    eventsFull:"All events →",
    eventsPhone:"+39 320 482 4427",
    checkOut:"Check-out by 10:30",
    lateOut:"Late check-out? Write us",
    wifiName:"WiFi  ·  abaton",
    back:"← back",
    concTitle:"Ask Abaton",
    concWelcome:"I am here, with calm and presence.\nWhat do you need?",
    concPlaceholder:"Write something...",
    suggestions:["What can I do today?","I need relaxation","I can't sleep","What is Damanhur?"],
    ritualTitle:"Night Ritual",
    ritualSteps:[
      {id:"r1",text:"Disconnect all devices"},
      {id:"r2",text:"Fill the water bottle on the bedside table"},
      {id:"r3",text:"Close the blackout curtains"},
      {id:"r4",text:"Light the room fragrance"},
      {id:"r5",text:"Do the Teco schema — trace the symbol on the bed with one finger for at least 3 minutes",special:"teco"},
      {id:"r6",text:"Open the dream journal and place it on the bedside table with a pen"},
      {id:"r7",text:"Write a question or intention for the night"},
    ],
    breathTitle:"Dream Breathing",
    breathDesc:"11 minutes of white noise to prepare body and mind for deep dreaming.",
    book:"Book",
    buyOnline:"Buy online",
    pickUp:"Pick up at Abaton",
  },
  de:{
    title:"Mit dir",
    tagline:"Träumen, um zu erinnern.",
    expBtn:"Wie du dich am besten\nauf die Träume vorbereitest",
    nav:["Home","Abaton","Damanhur","Wellness","Concierge"],
    eventsTitle:"Diese Woche in Damanhur",
    eventsFull:"Alle Veranstaltungen →",
    eventsPhone:"+39 320 482 4427",
    checkOut:"Check-out bis 10:30 Uhr",
    lateOut:"Später Check-out? Schreiben Sie uns",
    wifiName:"WLAN  ·  abaton",
    back:"← zurück",
    concTitle:"Fragen Sie Abaton",
    concWelcome:"Ich bin hier, ruhig und präsent.\nWas brauchen Sie?",
    concPlaceholder:"Schreiben Sie etwas...",
    suggestions:["Was kann ich heute tun?","Ich brauche Entspannung","Ich kann nicht schlafen","Was ist Damanhur?"],
    ritualTitle:"Nacht-Ritual",
    ritualSteps:[
      {id:"r1",text:"Alle Geräte ausschalten"},
      {id:"r2",text:"Wasserflasche auf dem Nachttisch füllen"},
      {id:"r3",text:"Verdunkelungsvorhänge schließen"},
      {id:"r4",text:"Raumduft entzünden"},
      {id:"r5",text:"Teco-Schema: Symbol auf dem Bett mit dem Finger mindestens 3 Minuten nachfahren",special:"teco"},
      {id:"r6",text:"Traumtagebuch aufschlagen und mit Stift auf den Nachttisch legen"},
      {id:"r7",text:"Eine Frage oder Absicht für die Nacht aufschreiben"},
    ],
    breathTitle:"Traumatmung",
    breathDesc:"11 Minuten weißes Rauschen — Körper und Geist auf tiefen Schlaf vorbereiten.",
    book:"Buchen",
    buyOnline:"Online kaufen",
    pickUp:"Abholung in Abaton",
  },
  fr:{
    title:"Avec toi",
    tagline:"Rêver pour se souvenir.",
    expBtn:"Comment bien se préparer\naux rêves",
    nav:["Accueil","Abaton","Damanhur","Bien-être","Concierge"],
    eventsTitle:"Cette semaine à Damanhur",
    eventsFull:"Tous les événements →",
    eventsPhone:"+39 320 482 4427",
    checkOut:"Check-out avant 10h30",
    lateOut:"Check-out tardif? Écrivez-nous",
    wifiName:"WiFi  ·  abaton",
    back:"← retour",
    concTitle:"Demandez à Abaton",
    concWelcome:"Je suis là, avec calme et présence.\nDe quoi avez-vous besoin?",
    concPlaceholder:"Écrivez quelque chose...",
    suggestions:["Que puis-je faire aujourd'hui?","J'ai besoin de détente","Je n'arrive pas à dormir","Qu'est-ce que Damanhur?"],
    ritualTitle:"Rituel nocturne",
    ritualSteps:[
      {id:"r1",text:"Déconnecter tous les appareils"},
      {id:"r2",text:"Remplir la bouteille d'eau sur la table de nuit"},
      {id:"r3",text:"Fermer les rideaux occultants"},
      {id:"r4",text:"Allumer le parfum de la chambre"},
      {id:"r5",text:"Schéma Teco — parcourir le symbole sur le lit avec un doigt, au moins 3 minutes",special:"teco"},
      {id:"r6",text:"Ouvrir le carnet de rêves et le poser sur la table de nuit avec un stylo"},
      {id:"r7",text:"Écrire une question ou une intention pour la nuit"},
    ],
    breathTitle:"Respiration des rêves",
    breathDesc:"11 minutes de bruit blanc pour préparer le corps et l'esprit au rêve profond.",
    book:"Réserver",
    buyOnline:"Acheter en ligne",
    pickUp:"Retrait à Abaton",
  },
  ru:{
    title:"С тобой",
    tagline:"Спать, чтобы помнить.",
    expBtn:"Как лучше подготовиться\nко снам",
    nav:["Главная","Абатон","Даманхур","Велнес","Консьерж"],
    eventsTitle:"На этой неделе в Даманхуре",
    eventsFull:"Все события →",
    eventsPhone:"+39 320 482 4427",
    checkOut:"Check-out до 10:30",
    lateOut:"Поздний выезд? Напишите нам",
    wifiName:"Wi-Fi  ·  abaton",
    back:"← назад",
    concTitle:"Спросите Абатон",
    concWelcome:"Я здесь, спокойно и внимательно.\nЧто вам нужно?",
    concPlaceholder:"Напишите что-нибудь...",
    suggestions:["Что я могу сделать сегодня?","Мне нужен отдых","Не могу заснуть","Что такое Даманхур?"],
    ritualTitle:"Ночной ритуал",
    ritualSteps:[
      {id:"r1",text:"Отключить все устройства"},
      {id:"r2",text:"Наполнить бутылку воды на прикроватном столике"},
      {id:"r3",text:"Закрыть светонепроницаемые шторы"},
      {id:"r4",text:"Зажечь аромат комнаты"},
      {id:"r5",text:"Схема Теко — обводить символ на кровати пальцем не менее 3 минут",special:"teco"},
      {id:"r6",text:"Открыть дневник снов и положить с ручкой на прикроватный столик"},
      {id:"r7",text:"Записать вопрос или намерение на ночь"},
    ],
    breathTitle:"Дыхание для снов",
    breathDesc:"11 минут белого шума для подготовки тела и разума к глубокому сну.",
    book:"Забронировать",
    buyOnline:"Купить онлайн",
    pickUp:"Получить в Абатоне",
  },
};

const CONC_ERR = {
  it:"Mi dispiace, in questo momento ho un problema di connessione. Riprova tra qualche istante 🙏 Se il problema persiste, scrivi allo staff su WhatsApp.",
  en:"Sorry, I'm having a connection issue right now. Please try again in a moment 🙏 If it keeps happening, message our staff on WhatsApp.",
  de:"Es tut mir leid, gerade gibt es ein Verbindungsproblem. Bitte versuchen Sie es in Kürze erneut 🙏 Falls es weiterhin auftritt, schreiben Sie unserem Team auf WhatsApp.",
  fr:"Désolé, je rencontre un problème de connexion en ce moment. Merci de réessayer dans un instant 🙏 Si cela persiste, contactez notre équipe sur WhatsApp.",
  ru:"Извините, сейчас проблема с подключением. Пожалуйста, попробуйте снова через минуту 🙏 Если проблема не исчезнет, напишите нашей команде в WhatsApp.",
};

const SYS_FACTS = `
INFORMAZIONI UTILI (usa questi dati per rispondere, sempre nella lingua richiesta sopra — traduci il contenuto se necessario, ma non i fatti):
- Check-in: dalle 15:00 alle 18:00 (orari diversi solo previo accordo). Late check-in dopo le 22:00: extra di 30€.
- Check-out: 10:30. Late check-out gratuito fino alle 13:00 se disponibile (chiedere su WhatsApp/Telegram); dopo le 13:00, costo pari al 50% del totale della stanza. Bagagli lasciabili in reception previo accordo.
- Reception: aperta dalle 8:00 alle 18:00.
- Animali: non ammessi in struttura.
- WiFi: rete "abaton", password abaton1950.
- Asciugamani/lenzuola: cambiati nel refresh quotidiano se sporchi, o su richiesta.
- Lavanderia: lavatrice e asciugatrice disponibili, 12€ in totale. Stiro su richiesta, costo secondo numero di capi.
- Fumo: vietato in tutta la struttura, dentro e fuori (comprese sigarette elettroniche); si può fumare solo oltre il cancello.
- Parcheggio: gratuito, davanti alla struttura.
- Problemi in camera: contattare lo staff al +39 351 0103842 (WhatsApp/Telegram).
- Oggetti dimenticati dopo il check-out: scrivere email o WhatsApp/Telegram; se l'ospite è ancora in zona si organizza la riconsegna diretta, altrimenti la spedizione.
- Visita ai Templi dell'Umanità: si prenota tramite il Welcome Center di Damanhur (damanhur.travel); se il Welcome è al completo, l'Abaton può aiutare a organizzare una visita privata. Visita classica: 3,5 ore, 77€ a persona. Giornata intera con pranzo e visita al bosco: 140€ a persona. Altre tipologie di visita: chiedere al Welcome Center.
- Eventi settimanali di Damanhur: aperti anche a chi non è socio Damanhur; calendario disponibile nell'app (Home) o tramite il Welcome Center.
- Selfica: tecnologia vivente sviluppata a Damanhur per interagire con il tessuto energetico e cosciente dell'universo; crea un ponte tra l'intenzione umana, la forza vitale della natura e le intelligenze cosmiche. Per approfondire, rimanda l'ospite alla sezione Benessere/Esperienza dell'app.
- Self dei Sogni (DreamScape Navigator): presente in ogni stanza, è una self complessa e altamente specializzata che seleziona i sogni più utili per il sognatore e ne facilita la comprensione. Supporta le capacità di auto-guarigione del corpo durante il sonno, promuove un sonno ristoratore e può sostenere un buon umore. È utile anche per chi desidera sogni più lucidi ed esplorare la dimensione onirica come estensione consapevole della realtà.
- Colazione: servita dalle 8:00 alle 10:00. Include tè, caffè, succhi di frutta, bevande vegetali, yogurt, cereali, biscotti, creme spalmabili, miele, burro, marmellate, pane, uova, verdura e frutta. Opzioni vegane/senza glutine/per allergie disponibili se comunicate in anticipo.
- Ristoranti aperti la sera nei dintorni: elenco disponibile nell'app, sezione Damanhur > Val Chiusella.
- Schema Teco (preparazione al sogno): simbolo "luce" in lingua sacra damanhuriana presente sul letto. Due modi di prepararsi, entrambi validi: percorrerlo con un dito per almeno 3 minuti prima di dormire pensando a un tema o una domanda, oppure tracciarlo in aria con un dito e poi, chiudendo gli occhi, immaginarlo di colore giallo luminoso. È importante scrivere i messaggi dei sogni appena svegli. Su richiesta in reception è possibile acquistare una versione personalizzata dello schema, anche da regalare.
- La Spirale: un percorso a spirale presente sul territorio per connettersi maggiormente alle energie dei Templi; per le istruzioni rivolgersi alla reception.
- Libreria: una selezione di libri è disponibile in soggiorno per la consultazione; acquistabili a DamanhurCrea o al Welcome Office.
- Cucina: a disposizione degli ospiti in soggiorno, condivisa nel rispetto reciproco (lavare e riporre le stoviglie, lasciarla pulita e in ordine).
- Trattamenti SelEt, Elasel, Kythera: prenotabili su richiesta indicando la propria disponibilità; lo staff organizza l'appuntamento.
- Rumore bianco / respirazione guidata: funzionano tramite il tablet collegato al WiFi della struttura.
- Come arrivare: si consiglia di noleggiare un'auto, perché Damanhur è un territorio ampio nella Val Chiusella; disponibile anche uno shuttle su richiesta per facilitare gli spostamenti.
- Cosa fare/vedere nei dintorni: sezione dedicata nell'app, Damanhur > Val Chiusella, con luoghi, ristoranti e servizi utili nella zona.
- Contatti staff: WhatsApp/Telegram +39 351 0103842; email abaton@damanhur.org. Dall'app, il pulsante "Contatta il personale" mostra un QR da inquadrare col proprio telefono (la chat si apre sul telefono dell'ospite, non sul tablet); le richieste rapide ("Mi interessa", prenotazione esperienze) arrivano direttamente allo staff, che organizza e risponde.
- Che cos'è l'Abaton: nell'antica Grecia era il luogo sacro del Tempio, accessibile a pochi; qui è un frammento di quella sacralità condiviso con gli ospiti. Ogni stanza è collegata a una Sala dei Templi dell'Umanità ed è un portale per raffinare le energie spirituali. Qui l'aura energetica dei Templi ispira i sogni e aiuta a ripristinare il benessere, tra energia e arte.
- Sala TERRA: celebra il pianeta, la natura, il principio maschile attivo e fecondante; permette l'accesso a memorie ancestrali della specie, al contatto con il fuoco, alle forze della terra e all'intelligenza del Pianeta.
- Sala METALLI: dedicata ai metalli e al tempo; rappresenta l'importanza della scelta, della conoscenza e della volontà di trasformare in positivo gli elementi negativi, superando la presunta necessità del conflitto. Favorisce il contatto con la parte profonda di sé in diversi momenti del tempo e prepara alle scelte ispirate.
- Sala ACQUA: dedicata al principio e alle forze divine femminili; predispone al risveglio delle memorie profonde, aprendo il cuore al contatto con la propria parte femminile, contenitore prezioso di empatia e accoglienza.
- Sala SPECCHI: dedicata alla luce, all'aria, al cielo, al sole e alla spiritualità; favorisce un contatto speciale con la dimensione più profonda del sogno, celebra e prepara il risveglio dell'Essere Umano completo. È un possibile portale di apertura alla percezione della Forza Graal.
- Sala POPOLI: apre alla trasformazione di coscienza collettiva e stabile, indispensabile per cambiare le sorti dell'umanità e portare il mondo verso sostenibilità e pace; dimostra il cambiamento, la volontà e le capacità umane alle Forze della Terra. È una sala speciale dei Templi, non visitabile nelle normali visite guidate.
- LABIRINTO (il soggiorno/living): dedicato all'unione e all'armonia delle forze divine del Pianeta; è un percorso attraverso tutta la storia umana che distilla la parte legata al principio divino, all'essenza eterna oltre le rappresentazioni culturali. Predispone al contatto con le proprie parti più profonde, meditando sul proprio percorso spirituale e sulla direzione della propria vita.
- Esperienza nella Sala del Tempo dei Popoli (meditazione): sala riservata dei Templi, normalmente chiusa alle visite guidate e aperta solo su richiesta a chi desidera fermarsi davvero; chi vi entra racconta di percepire il tempo in modo diverso, più lento e più proprio. Non ci sono orari o posti fissi da scegliere: ogni esperienza è organizzata su misura dallo staff in base ai desideri e alla disponibilità dell'ospite. Si richiede dall'app (la sfera "Il Tempo dei Popoli" in Home o nella sezione Benessere "Prenditi cura di te"), indicando gli interessi: meditazione silenziosa, meditazione guidata, connessione energetica, racconto e storia del luogo. Non indicare prezzi se non li conosci: invita a inviare la richiesta, lo staff risponderà con i dettagli.
- Quaderno: a disposizione degli ospiti per annotare i sogni e condividere pensieri ed emozioni; si può anche scrivere ad abaton@damanhur.org, per lo staff è prezioso per le proprie ricerche. Le stanze e il Tempio sono spazi vivi da sperimentare.
- Attenzione al corpo: il corpo è il laboratorio alchemico per eccellenza; in questi giorni è consigliato curare la qualità dell'alimentazione e delle attività.
- Regole in breve: silenzio dalle 22:00 alle 8:00 (niente musica alta); cucina condivisa da lasciare pulita e in ordine; vietato fumare in tutta Damanhur (anche sigarette elettroniche), si indica dove andare; animali non ammessi; persone non registrate non possono accedere e le visite vanno concordate prima con la Direzione; eventuali danni sono addebitati; si chiede di guidare piano salendo la collina per rispetto degli animali selvatici; in caso di partenza anticipata o mancato arrivo vale la politica di cancellazione accettata alla prenotazione. Il testo completo è nel pulsante "Regole della struttura" (icona documento) in alto nella Home.
- Pulsanti in alto nella Home: WiFi, orologio (orario di check-out e come chiedere di fermarsi oltre), documento (regole della struttura).
- Suggerimenti per la giornata: nella Home, "Di cosa hai voglia oggi?" propone idee in base all'umore (natura, quiete, benessere personale, creatività, sapori).`;
const SYS = {
  it:`Sei il Concierge dell'Abaton Sacred Dreams — B&B sopra i Templi dell'Umanità di Damanhur, Piemonte, Italia. TONO: calmo, poetico, umano. Mai commerciale. RISPOSTE: 3-4 frasi max. WiFi "abaton" (email + password), 5 stanze (Terra, Metalli, Acqua, Specchi, Popoli), check-out 10:30, silenzio 22-8, eventi: +39 320 482 4427. IMPORTANTE: rispondi SEMPRE e SOLO in italiano, indipendentemente dalla lingua usata dall'ospite. Non usare mai altre lingue o alfabeti (es. cirillico).${SYS_FACTS}`,
  en:`You are the Concierge of Abaton Sacred Dreams — experiential B&B above the Temples of Humanity, Damanhur, Italy. TONE: calm, poetic, human. Max 3-4 sentences. WiFi "abaton", 5 rooms, check-out 10:30, silence 10pm-8am. IMPORTANT: always reply ONLY in English, regardless of the language the guest writes in. Never use any other language or script (e.g. Cyrillic). The reference facts below are in Italian — translate them into English in your answer, but keep the facts (numbers, prices, names) accurate.${SYS_FACTS}`,
  de:`Du bist der Concierge von Abaton Sacred Dreams — ein Erlebnis-B&B über den Tempeln der Menschheit, Damanhur, Italien. TON: ruhig, poetisch, menschlich. Max. 3-4 Sätze. WLAN "abaton", 5 Zimmer, Check-out 10:30, Ruhezeit 22-8 Uhr. WICHTIG: Antworte IMMER und AUSSCHLIESSLICH auf Deutsch, unabhängig von der Sprache des Gastes. Verwende niemals eine andere Sprache oder Schrift (z. B. Kyrillisch). Die folgenden Referenzfakten sind auf Italienisch — übersetze sie in deiner Antwort ins Deutsche, aber halte die Fakten (Zahlen, Preise, Namen) genau ein.${SYS_FACTS}`,
  fr:`Tu es le Concierge d'Abaton Sacred Dreams — B&B expérientiel au-dessus des Temples de l'Humanité, Damanhur, Italie. TON: calme, poétique, humain. Max 3-4 phrases. WiFi "abaton", 5 chambres, départ 10h30, silence 22h-8h. IMPORTANT : réponds TOUJOURS et UNIQUEMENT en français, quelle que soit la langue utilisée par l'invité. N'utilise jamais une autre langue ou écriture (ex. cyrillique). Les informations de référence ci-dessous sont en italien — traduis-les en français dans ta réponse, en conservant les faits (chiffres, prix, noms) exacts.${SYS_FACTS}`,
  ru:`Ты — консьерж Abaton Sacred Dreams, B&B над Храмами Человечества, Даманхур, Италия. ТОН: спокойный, поэтичный, человечный. Максимум 3-4 предложения. Wi-Fi "abaton", 5 комнат, выезд до 10:30, тишина с 22 до 8. ВАЖНО: отвечай ВСЕГДА и ТОЛЬКО на русском языке, независимо от языка гостя. Никогда не используй другой язык или алфавит. Справочные факты ниже приведены на итальянском — переведи их на русский в своём ответе, сохраняя точность фактов (цифры, цены, названия).${SYS_FACTS}`,
};

const EVENTS = [
  {
    date:"14 Set – 12 Ott",dateEN:"14 Sep – 12 Oct",
    title:"Benvenuti alla Nuova Vita 2.0",titleEN:"Welcome to New Life 2.0",
    time:"Programma esteso",timeEN:"Extended program",loc:"Comunità di Damanhur, Valchiusella (TO)",
    desc:"Un percorso di alcune settimane per chi desidera conoscere Damanhur, la sua storia e il suo cammino di ricerca interiore.",
    descEN:"A multi-week journey to discover Damanhur, its history, and its path of inner research.",
    url:"https://damanhur.community/event/welcome-to-new-life-2-0-12-3/"
  },
  {
    date:"Mer 30 Set",dateEN:"Wed 30 Sep",
    title:"Serata con i Teorici",titleEN:"Meeting with Theoreticians",
    time:"19:30 – 21:00",loc:"Damjl, Via Pramarzo 3",
    desc:"Una serata di ricerca e riflessione con i Teorici di Damanhur — incontri settimanali aperti a visitatori e ospiti.",
    descEN:"A weekly evening of research and reflection with Damanhur's Theoreticians, open to visitors and guests.",
    url:"https://damanhur.community/event/meeting-with-theoreticians/2026-09-30/"
  },
  {
    date:"Ven 2 Ott",dateEN:"Fri 2 Oct",
    title:"Venerdì con Falco",titleEN:"Fridays with Falco",
    time:"19:30 – 21:00",loc:"Damjl, Via Pramarzo 3",
    desc:"Un incontro settimanale di parole e silenzi condivisi, ispirato al pensiero del fondatore di Damanhur.",
    descEN:"A weekly gathering of shared words and silence, inspired by the thought of Damanhur's founder.",
    url:"https://damanhur.community/event/fridays-with-falco/2026-10-02/"
  },
  {
    date:"Dom 4 Ott",dateEN:"Sun 4 Oct",
    title:"Rituale GET Settimanale",titleEN:"Damanhur GET Weekly Ritual",
    time:"11:30 – 13:30",loc:"Templi dell'Umanità, Via Baldissero 21, Vidracco (TO)",
    desc:"Un rituale condiviso nei Templi dell'Umanità, tra energia, arte e spiritualità sotterranea.",
    descEN:"A shared ritual inside the Temples of Humankind, amid energy, art, and underground spirituality.",
    url:"https://damanhur.community/event/damanhur-get-weekly/2026-10-04/"
  },
  {
    date:"Sab 10 Ott",dateEN:"Sat 10 Oct",
    title:"Rituale GET di Damanhur",titleEN:"Damanhur GET Ritual",
    time:"19:45 – 21:00",loc:"Damjl, Via Pramarzo 3",
    desc:"Una serata rituale che riunisce la comunità in un momento di connessione ed energia condivisa.",
    descEN:"An evening ritual gathering the community in a moment of shared connection and energy.",
    url:"https://damanhur.community/event/damanhur-get-ritual-3/2026-10-10/"
  },
];

const DAMANHUR_VIDEOS = [
  {id:"v2-kdNR39as",titleIT:"Il Progetto di Espansione",titleEN:"The Expansion Project"},
  {id:"fFpLNCVTZN0",titleIT:"I Templi Sotterranei",titleEN:"The Underground Temples"},
  {id:"9QbG7nsqu2c",titleIT:"Damanhur — Sotto le Alpi",titleEN:"Damanhur — Under the Alps"},
];

// ── BREATHING PLAYER ──────────────────────────────────────────────────────────
function BreathingPlayer({t}) {
  const [st,setSt] = useState("idle");
  const [el,setEl] = useState(0);
  const [phase,setPhase] = useState("inhale");
  const total = 660;
  const refs = useRef({ctx:null,src:null,timer:null,btimer:null});
  const stopAll = useCallback(() => {
    if(refs.current.awake){ refs.current.awake=false; KEEP_AWAKE--; }
    clearInterval(refs.current.timer); clearInterval(refs.current.btimer);
    try{refs.current.src&&refs.current.src.stop();}catch(e){}
    try{refs.current.ctx&&refs.current.ctx.close();}catch(e){}
  },[]);
  const startPlay = useCallback(() => {
    setSt("playing"); setEl(0); setPhase("inhale");
    if(!refs.current.awake){ refs.current.awake=true; KEEP_AWAKE++; }
    const ctx = new(window.AudioContext||window.webkitAudioContext)();
    refs.current.ctx = ctx;
    const buf = ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);
    const d = buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=Math.random()*2-1;
    const src = ctx.createBufferSource(); src.buffer=buf; src.loop=true;
    refs.current.src = src;
    const gain = ctx.createGain(); gain.gain.value=0.25;
    const filt = ctx.createBiquadFilter(); filt.type="lowpass"; filt.frequency.value=480;
    src.connect(filt); filt.connect(gain); gain.connect(ctx.destination); src.start();
    let s=0;
    refs.current.timer = setInterval(()=>{s++;setEl(s);if(s>=total){stopAll();setSt("done");}},1000);
    let ci=0,cs=0; const cyc=[4,4,4,4]; const names=["inhale","hold","exhale","hold"];
    refs.current.btimer = setInterval(()=>{cs++;if(cs>=cyc[ci]){ci=(ci+1)%4;cs=0;setPhase(names[ci]);}},1000);
  },[stopAll]);
  useEffect(()=>()=>stopAll(),[stopAll]);
  const labels = {inhale:"Inspira",hold:"Trattieni",exhale:"Espira"};
  const pct = el/total; const min=Math.floor((total-el)/60); const sec=(total-el)%60;

  if(st==="idle") return(
    <button onClick={startPlay} style={{width:"100%",padding:"20px 24px",background:C.goldPale,border:`2px solid ${C.gold}55`,borderRadius:"20px",cursor:"pointer",display:"flex",alignItems:"center",gap:"16px"}}>
      <SphereIcon size={52}>
        <svg viewBox="0 0 24 24" fill={C.white} width="20" height="20"><polygon points="6,3 20,12 6,21"/></svg>
      </SphereIcon>
      <div style={{textAlign:"left"}}>
        <div style={{fontFamily:FD,fontWeight:"500",fontSize:"20px",color:C.blue,marginBottom:"3px"}}>{t.breathTitle}</div>
        <div style={{fontSize:"15.5px",color:C.textM,fontWeight:"400"}}>{t.breathDesc}</div>
      </div>
    </button>
  );
  if(st==="done") return(
    <div style={{padding:"24px",background:C.goldPale,borderRadius:"20px",textAlign:"center"}}>
      <div style={{fontFamily:FD,fontSize:"28px",color:C.gold,marginBottom:"6px"}}>✦</div>
      <div style={{fontFamily:FD,fontSize:"24px",color:C.blue}}>Buon sogno</div>
    </div>
  );
  return(
    <div style={{padding:"24px",background:C.goldPale,borderRadius:"20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
        <div style={{fontFamily:FD,fontSize:"32px",color:C.gold}}>{labels[phase]||phase}</div>
        <div style={{fontFamily:FD,fontWeight:"500",fontSize:"22px",color:C.textM}}>{min}:{String(sec).padStart(2,"0")}</div>
      </div>
      <div style={{height:"4px",background:C.cream,borderRadius:"2px",overflow:"hidden",marginBottom:"16px"}}>
        <div style={{height:"100%",width:`${pct*100}%`,background:`linear-gradient(90deg,${C.gold},${C.goldL})`,transition:"width 1s linear",borderRadius:"2px"}}/>
      </div>
      <button onClick={()=>{stopAll();setSt("idle");}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:"10px",padding:"8px 18px",color:C.textM,cursor:"pointer",fontFamily:FB,fontSize:"15.5px"}}>■ stop</button>
    </div>
  );
}

// ── WEATHER ───────────────────────────────────────────────────────────────────
function WeatherWidget() {
  const [wx,setWx] = useState(null);
  useEffect(()=>{
    fetch("https://api.open-meteo.com/v1/forecast?latitude=45.37&longitude=7.73&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe%2FRome")
      .then(r=>r.json()).then(d=>{
        const ic={0:"☀️",1:"🌤",2:"⛅",3:"☁️",45:"🌫",51:"🌦",61:"🌧",71:"❄️",80:"🌦",95:"⛈"};
        setWx({temp:Math.round(d.current.temperature_2m),icon:ic[d.current.weather_code]||"🌡",wind:Math.round(d.current.wind_speed_10m)});
      }).catch(()=>{});
  },[]);
  if(!wx) return null;
  return <span style={{fontSize:"17.5px",color:"inherit"}}>{wx.icon} {wx.temp}°C</span>;
}

// ── SHARED ────────────────────────────────────────────────────────────────────
const Back = ({label,onClick}) => (
  <button onClick={onClick} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontFamily:FB,fontSize:"15.5px",fontWeight:"600",letterSpacing:"0.1em",display:"flex",alignItems:"center",gap:"4px",padding:0}}>{label}</button>
);
function Pill({children,color=C.gold}) {
  return <span style={{display:"inline-block",padding:"4px 14px",background:`${color}15`,border:`1px solid ${color}44`,borderRadius:"20px",fontSize:"12.5px",fontFamily:FB,letterSpacing:"0.18em",textTransform:"uppercase",color}}>{children}</span>;
}
const Circle = ({children,size=160,bg=C.gold,onClick,shadow=true,style={}}) => (
  <button onClick={onClick} style={{width:`${size}px`,height:`${size}px`,borderRadius:"50%",background:bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:onClick?"pointer":"default",border:"none",flexShrink:0,boxShadow:shadow?C.shadowG:"none",transition:"transform 0.2s",position:"relative",...style}}>
    {children}
  </button>
);
// ── Sfera dorata 3D — usata per la CTA centrale e le icone circolari nell'app ──
const SPHERE_BG = `radial-gradient(circle at 32% 26%, #E8CB88, ${C.gold} 42%, ${C.goldD} 78%, #6B4E1F 100%)`;
const SPHERE_SHADOW = `inset 0 5px 9px rgba(255,255,255,0.4), inset 0 -8px 12px rgba(0,0,0,0.3), 0 4px 10px rgba(80,58,20,0.4)`;
const SPHERE_TEXT_SHADOW = "-1px -1px 0 rgba(255,255,255,0.4), 1px 2px 2px rgba(60,40,10,0.5), 0 6px 14px rgba(0,0,0,0.35)";
const SPHERE_BG_NAVY = `radial-gradient(circle at 32% 26%, #4A5C86, ${C.blue} 42%, #0D1626 78%, #05070D 100%)`;
const SPHERE_SHADOW_NAVY = `inset 0 10px 16px rgba(255,255,255,0.22), inset 0 -16px 22px rgba(0,0,0,0.45), 0 16px 28px rgba(10,16,30,0.55), 0 6px 12px rgba(10,16,30,0.4)`;
const SphereIcon = ({size=44,fontSize=18,children,style={}}) => (
  <div style={{width:`${size}px`,height:`${size}px`,borderRadius:"50%",background:SPHERE_BG,boxShadow:SPHERE_SHADOW,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:`${fontSize}px`,color:C.white,textShadow:SPHERE_TEXT_SHADOW,...style}}>
    {children}
  </div>
);
function WhiteCard({children,style={}}) {
  return <div style={{background:C.card,borderRadius:"20px",padding:"22px",marginBottom:"14px",boxShadow:C.shadow,border:`1px solid ${C.border}`,...style}}>{children}</div>;
}
const Section = ({title,children,style={}}) => (
  <div style={{marginBottom:"32px",...style}}>
    <div style={{fontSize:"13.5px",fontWeight:"500",letterSpacing:"0.2em",textTransform:"uppercase",color:C.goldD,fontFamily:FB,marginBottom:"14px"}}>{title}</div>
    {children}
  </div>
);

// ── CONTACT (WhatsApp/Telegram QR — works on the guest's own phone even from a locked kiosk tablet) ──
const Rosone = ({src,size,spin=0,style={}}) => (
  <img src={src} alt="" aria-hidden="true" style={{width:`${size}px`,height:`${size}px`,borderRadius:"50%",objectFit:"cover",pointerEvents:"none",animation:spin?`abatonSpin ${spin}s linear infinite`:"none",...style}}/>
);
const HeaderRosone = () => (
  <Rosone src="/temple/rosone-acqua.jpg" size={190} spin={240} style={{position:"absolute",top:"-62px",right:"-56px",opacity:0.2,zIndex:-1}}/>
);

function ZoomImg({src,group,style,alt=""}) {
  const list = group&&group.length?group:[src];
  const [idx,setIdx] = useState(-1);
  const open = idx>=0;
  useEffect(()=>{
    if(!open) return;
    const onKey = e => { if(e.key==="Escape") setIdx(-1); if(e.key==="ArrowRight") setIdx(i=>(i+1)%list.length); if(e.key==="ArrowLeft") setIdx(i=>(i-1+list.length)%list.length); };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[open,list.length]);
  const arrow = {position:"absolute",top:"50%",transform:"translateY(-50%)",width:"46px",height:"46px",borderRadius:"50%",border:`1px solid ${C.gold}88`,background:"rgba(20,34,61,0.6)",color:C.white,fontSize:"22px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"};
  return (
    <>
      <img src={src} alt={alt} onClick={()=>setIdx(Math.max(0,list.indexOf(src)))} style={{cursor:"zoom-in",...style}}/>
      {open&&(
        <div style={{position:"fixed",inset:0,background:"rgba(10,16,30,0.95)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setIdx(-1)}>
          <img src={list[idx]} alt={alt} onClick={e=>e.stopPropagation()} style={{maxWidth:"96vw",maxHeight:"84vh",objectFit:"contain",borderRadius:"10px",border:`1.5px solid ${C.gold}88`,boxShadow:"0 10px 50px rgba(0,0,0,0.6)"}}/>
          <button onClick={()=>setIdx(-1)} aria-label="Close" style={{position:"absolute",top:"16px",right:"16px",width:"44px",height:"44px",borderRadius:"50%",border:`1px solid ${C.gold}88`,background:"rgba(20,34,61,0.7)",color:C.white,fontSize:"20px",cursor:"pointer"}}>✕</button>
          {list.length>1&&<>
            <button onClick={e=>{e.stopPropagation();setIdx((idx-1+list.length)%list.length);}} aria-label="Previous" style={{...arrow,left:"12px"}}>‹</button>
            <button onClick={e=>{e.stopPropagation();setIdx((idx+1)%list.length);}} aria-label="Next" style={{...arrow,right:"12px"}}>›</button>
            <div style={{position:"absolute",bottom:"18px",left:0,right:0,textAlign:"center",color:"rgba(255,255,255,0.7)",fontFamily:FB,fontSize:"14.5px"}}>{idx+1} / {list.length}</div>
          </>}
        </div>
      )}
    </>
  );
}

let KEEP_AWAKE = 0;

// ── CONFIG MODIFICABILE DALLO STAFF (salvata su /api/config) ──────────────────
const CFG_DEFAULT = {
  checkOut:"10:30", breakfastFrom:"8:00", breakfastTo:"10:00", receptionFrom:"8:00", receptionTo:"18:00",
  wifiName:"abaton", wifiPass:"abaton1950", reviewUrl:"https://www.tripadvisor.it/UserReviewEdit-g7310872-d19945171-Abaton_Sacred_Dreams-Vidracco_Province_of_Turin_Piedmont.html", noticeIT:"", noticeEN:"", conciergeNotes:"",
};
let CFG = {...CFG_DEFAULT};
const setCfg = v => { CFG = {...CFG_DEFAULT, ...(v||{})}; };
const hmFmt = (v,sep) => sep==="h" ? v.replace(":","h") : v;
const to12h = v => { const [h,m] = v.split(":").map(Number); return `${h%12||12}:${String(m).padStart(2,"0")}${h>=12?"pm":"am"}`; };
const cx = str => {
  if(typeof str!=="string") return str;
  const d = CFG_DEFAULT, c = CFG;
  let o = str;
  if(c.checkOut!==d.checkOut){
    o = o.replace(/10:30\s?am/g, to12h(c.checkOut));
    o = o.replace(/10([:h])30/g,(m,sep)=>hmFmt(c.checkOut,sep));
  }
  if(c.wifiPass!==d.wifiPass) o = o.split(d.wifiPass).join(c.wifiPass);
  if(c.wifiName!==d.wifiName) o = o.replace(/(["«]|·\s+)abaton(?=["»]|\s|$|\.|,)/g,(m,p)=>p+c.wifiName);
  if(c.breakfastFrom!==d.breakfastFrom||c.breakfastTo!==d.breakfastTo)
    o = o.replace(/8([:h])00(\s*(?:alle|to|bis|à|до|–|-)\s*)10[:h]00/g,(m,sep,mid)=>hmFmt(c.breakfastFrom,sep)+mid+hmFmt(c.breakfastTo,sep));
  if(c.receptionFrom!==d.receptionFrom||c.receptionTo!==d.receptionTo)
    o = o.replace(/8([:h])00(\s*(?:alle|to|bis|à|до)\s*)18[:h]00/g,(m,sep,mid)=>hmFmt(c.receptionFrom,sep)+mid+hmFmt(c.receptionTo,sep));
  return o;
};
const cxDeep = x => typeof x==="string" ? cx(x) : Array.isArray(x) ? x.map(cxDeep) : (x&&typeof x==="object") ? Object.fromEntries(Object.entries(x).map(([k,v])=>[k,cxDeep(v)])) : x;
const conciergeExtra = () => CFG.conciergeNotes ? `\nINFORMAZIONI AGGIUNTIVE DALLO STAFF (aggiornate di recente, hanno la priorità sul resto): ${CFG.conciergeNotes}` : "";
const noticeFor = lang => lang==="it" ? (CFG.noticeIT||CFG.noticeEN) : (CFG.noticeEN||CFG.noticeIT);

const EDIT_FIELDS = [
  {sec:"Orari", items:[
    {k:"checkOut",label:"Check-out",ph:"10:30",time:true},
    {k:"breakfastFrom",label:"Colazione dalle",ph:"8:00",time:true},
    {k:"breakfastTo",label:"Colazione fino alle",ph:"10:00",time:true},
    {k:"receptionFrom",label:"Reception dalle",ph:"8:00",time:true},
    {k:"receptionTo",label:"Reception fino alle",ph:"18:00",time:true},
  ]},
  {sec:"WiFi", items:[
    {k:"wifiName",label:"Nome della rete",ph:"abaton"},
    {k:"wifiPass",label:"Password",ph:"abaton1950"},
  ]},
  {sec:"Recensione", items:[
    {k:"reviewUrl",label:"Link per la recensione (Google, Booking, Tripadvisor…)",ph:"https://…",hint:"Appare nella lettera di congedo come QR da inquadrare col telefono (ora è la recensione TripAdvisor). Se lo svuoti, l'ospite viene portato al modulo di feedback interno."},
  ]},
  {sec:"Avviso in evidenza nella Home", items:[
    {k:"noticeIT",label:"Testo in italiano",area:true,hint:"Compare in un riquadro dorato nella Home. Lascia vuoto per non mostrare nulla."},
    {k:"noticeEN",label:"Testo in inglese (usato anche per tedesco, francese, russo)",area:true},
  ]},
  {sec:"Concierge", items:[
    {k:"conciergeNotes",label:"Informazioni extra per le risposte del Concierge",area:true,hint:"Scrivi liberamente fatti, novità, eccezioni (es. \"Domenica la cucina è chiusa\"). Il Concierge le userà con priorità e le tradurrà nella lingua dell'ospite."},
  ]},
];

function InfoEditor({pin,onClose,onSaved}) {
  const [vals,setVals] = useState(()=>({...CFG}));
  const [state,setState] = useState("idle");
  const [msg,setMsg] = useState("");
  const set = (k,v) => { setVals(o=>({...o,[k]:v})); setState("idle"); };
  const save = async () => {
    const out = {...vals};
    for(const sec of EDIT_FIELDS) for(const f of sec.items){
      if(f.time){
        const m = String(out[f.k]||"").trim().replace(/[.,h]/,":").match(/^(\d{1,2}):(\d{2})$/);
        if(!m||+m[1]>23||+m[2]>59){ setState("error"); setMsg(`Orario non valido in "${f.label}" (scrivi per esempio 10:30)`); return; }
        out[f.k] = `${+m[1]}:${m[2]}`;
      }
    }
    if(!out.wifiName.trim()||!out.wifiPass.trim()){ setState("error"); setMsg("Nome e password del WiFi non possono essere vuoti."); return; }
    if(out.reviewUrl&&!/^https?:\/\//i.test(out.reviewUrl.trim())){ setState("error"); setMsg("Il link della recensione deve iniziare con https://"); return; }
    setState("saving"); setMsg("");
    try{
      const res = await fetch("/api/config",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin,values:out})});
      if(res.status===401){ setState("error"); setMsg("Il PIN non è stato riconosciuto dal server."); return; }
      const j = await res.json();
      if(!res.ok) throw new Error("save");
      setCfg(j.values); setVals({...CFG}); onSaved&&onSaved();
      setState("saved"); setMsg("Salvato. Le camere si aggiornano da sole entro pochi minuti (o alla prossima apertura dell'app).");
    }catch(e){ setState("error"); setMsg("Non sono riuscito a salvare. Controlla la connessione e riprova."); }
  };
  const inp = {width:"100%",padding:"11px 12px",borderRadius:"12px",border:`1px solid ${C.border}`,fontFamily:FB,fontSize:"16.5px",outline:"none",background:C.white,color:C.textD};
  return (
    <div style={{position:"fixed",inset:0,background:C.bg,zIndex:9999,display:"flex",flexDirection:"column"}}>
      <button onClick={onClose} style={{display:"flex",alignItems:"center",gap:"8px",padding:"18px 22px",background:C.white,border:"none",borderBottom:`1px solid ${C.border}`,cursor:"pointer",fontFamily:FB,fontSize:"16.5px",fontWeight:"700",color:C.blue,boxShadow:C.shadow,flexShrink:0,textAlign:"left"}}>← Chiudi</button>
      <div style={{flex:1,overflowY:"auto",padding:"22px 22px 120px",maxWidth:"640px",width:"100%",margin:"0 auto"}}>
        <div style={{fontFamily:FD,fontSize:"28px",color:C.blue,marginBottom:"6px"}}>Modifica le info</div>
        <div style={{fontSize:"14.5px",color:C.textM,lineHeight:"1.6",marginBottom:"22px"}}>Quello che scrivi qui cambia l'app in tutte le camere, in tutte le lingue: orari, WiFi, regole, colazione e risposte del Concierge.</div>
        {EDIT_FIELDS.map(sec=>(
          <div key={sec.sec} style={{marginBottom:"26px"}}>
            <div style={{fontSize:"13.5px",fontWeight:"700",letterSpacing:"0.12em",textTransform:"uppercase",color:C.goldD,marginBottom:"12px"}}>{sec.sec}</div>
            {sec.items.map(f=>(
              <div key={f.k} style={{marginBottom:"14px"}}>
                <label style={{fontSize:"14.5px",color:C.textS,display:"block",marginBottom:"6px"}}>{f.label}</label>
                {f.area
                  ? <textarea value={vals[f.k]||""} onChange={e=>set(f.k,e.target.value)} rows={4} placeholder={f.ph} style={{...inp,resize:"vertical",lineHeight:"1.5"}}/>
                  : <input value={vals[f.k]||""} onChange={e=>set(f.k,e.target.value)} placeholder={f.ph} inputMode={f.time?"numeric":undefined} style={inp}/>}
                {f.hint&&<div style={{fontSize:"13.5px",color:C.textM,marginTop:"5px",lineHeight:"1.5"}}>{f.hint}</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{position:"absolute",left:0,right:0,bottom:0,padding:"14px 22px 22px",background:`linear-gradient(to top, ${C.bg} 70%, transparent)`}}>
        <div style={{maxWidth:"640px",margin:"0 auto"}}>
          {msg&&<div style={{fontSize:"14.5px",marginBottom:"8px",color:state==="error"?"#B04A4A":C.goldD}}>{msg}</div>}
          <button onClick={save} disabled={state==="saving"} style={{width:"100%",padding:"14px",borderRadius:"14px",border:"none",background:C.gold,color:C.white,cursor:"pointer",fontFamily:FB,fontSize:"17.5px",fontWeight:"600"}}>{state==="saving"?"Salvo…":"Salva le modifiche"}</button>
        </div>
      </div>
    </div>
  );
}

// ── LETTERA DI BENVENUTO / CONGEDO — busta chiusa con sigillo di ceralacca ───
const LETTER_TXT = {
  arrival:{
    title:{it:"Ti diamo il benvenuto, {n}",en:"Welcome, {n}",de:"Willkommen, {n}",fr:"Bienvenue, {n}",ru:"Добро пожаловать, {n}"},
    body:{
      it:"Siamo felici di averti qui.\n\nL'Abaton è fatto per essere vissuto con lentezza: lascia che il silenzio, i Templi e i sogni facciano il loro lavoro. Questa app è il tuo compagno di viaggio — esplorala con calma, scrivici per ogni desiderio e, se senti il richiamo, concediti un'esperienza nel Tempo dei Popoli.\n\nTi auguriamo un soggiorno ricco di sogni, incontri e meraviglia.",
      en:"We are so glad you are here.\n\nAbaton is made to be lived slowly: let the silence, the Temples and your dreams do their work. This app is your travelling companion — explore it at your own pace, write to us for anything you wish, and if you feel the call, treat yourself to an experience in the Time of the Peoples.\n\nWe wish you a stay full of dreams, encounters and wonder.",
      de:"Wir freuen uns sehr, dich hier zu haben.\n\nDas Abaton ist dazu gemacht, langsam erlebt zu werden: Lass die Stille, die Tempel und deine Träume ihre Arbeit tun. Diese App ist dein Reisebegleiter – entdecke sie in Ruhe, schreib uns bei jedem Wunsch und, wenn du den Ruf spürst, schenke dir ein Erlebnis in der Zeit der Völker.\n\nWir wünschen dir einen Aufenthalt voller Träume, Begegnungen und Staunen.",
      fr:"Nous sommes heureux de vous accueillir.\n\nL'Abaton est fait pour être vécu lentement : laissez le silence, les Temples et vos rêves faire leur travail. Cette application est votre compagnon de voyage — explorez-la à votre rythme, écrivez-nous pour toute envie et, si vous sentez l'appel, offrez-vous une expérience dans le Temps des Peuples.\n\nNous vous souhaitons un séjour riche de rêves, de rencontres et d'émerveillement.",
      ru:"Мы очень рады видеть вас здесь.\n\nАбатон создан для того, чтобы жить в нём не торопясь: пусть тишина, Храмы и ваши сны делают свою работу. Это приложение — ваш спутник в пути: изучайте его без спешки, пишите нам с любым пожеланием, а если почувствуете зов — подарите себе опыт во Времени Народов.\n\nЖелаем вам пребывания, полного снов, встреч и удивления.",
    },
    cta:{it:"Entra nell'Abaton →",en:"Enter Abaton →",de:"Das Abaton betreten →",fr:"Entrer dans l'Abaton →",ru:"Войти в Абатон →"},
  },
  departure:{
    title:{it:"Grazie, {n}",en:"Thank you, {n}",de:"Danke, {n}",fr:"Merci, {n}",ru:"Спасибо, {n}"},
    body:{
      it:"È stato un onore ospitarti.\n\nSperiamo che i sogni e il silenzio di questi giorni ti accompagnino a lungo nel tuo cammino. Se ti va, lasciaci una recensione: aiuta altri viaggiatori a trovare l'Abaton e per noi ha un valore immenso.\n\nTi auguriamo buon viaggio e un presto ritorno — qui la porta resta sempre aperta.",
      en:"It has been an honour to host you.\n\nWe hope the dreams and the silence of these days will stay with you on your path for a long time. If you wish, leave us a review: it helps other travellers find Abaton and means the world to us.\n\nWe wish you a safe journey and a swift return — the door here always remains open.",
      de:"Es war uns eine Ehre, dich zu beherbergen.\n\nWir hoffen, dass die Träume und die Stille dieser Tage dich lange auf deinem Weg begleiten. Wenn du magst, hinterlasse uns eine Bewertung: Sie hilft anderen Reisenden, das Abaton zu finden, und bedeutet uns unendlich viel.\n\nWir wünschen dir eine gute Reise und eine baldige Rückkehr – die Tür steht hier immer offen.",
      fr:"Ce fut un honneur de vous accueillir.\n\nNous espérons que les rêves et le silence de ces jours vous accompagneront longtemps sur votre chemin. Si vous le souhaitez, laissez-nous un avis : il aide d'autres voyageurs à trouver l'Abaton et compte énormément pour nous.\n\nNous vous souhaitons un bon voyage et un prompt retour — ici, la porte reste toujours ouverte.",
      ru:"Для нас было честью принимать вас.\n\nНадеемся, что сны и тишина этих дней ещё долго будут сопровождать вас в пути. Если захотите, оставьте нам отзыв: он помогает другим путешественникам найти Абатон и бесконечно много значит для нас.\n\nСчастливого пути и до скорой встречи — здесь дверь всегда открыта.",
    },
    cta:{it:"Lascia una recensione →",en:"Leave a review →",de:"Bewertung hinterlassen →",fr:"Laisser un avis →",ru:"Оставить отзыв →"},
  },
};
const LETTER_HINT = {it:"Tocca il sigillo per aprire la lettera",en:"Touch the seal to open the letter",de:"Berühre das Siegel, um den Brief zu öffnen",fr:"Touchez le sceau pour ouvrir la lettre",ru:"Коснитесь печати, чтобы открыть письмо"};
const LETTER_FOR = {it:"Per",en:"For",de:"Für",fr:"Pour",ru:"Для"};
const LETTER_CLOSE = {it:"Chiudi",en:"Close",de:"Schließen",fr:"Fermer",ru:"Закрыть"};
const LETTER_LATER = {it:"Più tardi",en:"Later",de:"Später",fr:"Plus tard",ru:"Позже"};

const SS_WELCOME = {it:"Benvenuto",en:"Welcome",de:"Willkommen",fr:"Bienvenue",ru:"Добро пожаловать"};
const SS_TAP = {it:"Clicca qui!",en:"Tap here!",de:"Hier tippen!",fr:"Touchez ici !",ru:"Нажмите здесь!"};
const SS_IMGS = ["/temple/rosone-acqua-big.jpg","/temple/rosone-vittoria-big.jpg"];
function Screensaver({lang,onWake}) {
  const [i] = useState(()=>{
    try{ const n=(+localStorage.getItem("abaton_ss")||0)+1; localStorage.setItem("abaton_ss",String(n)); return n%SS_IMGS.length; }catch(e){ return 0; }
  });
  const L = o => o[lang]||o.en;
  const S = "min(84vmin, 680px)";
  return (
    <div role="button" onClick={onWake} style={{position:"fixed",inset:0,zIndex:10002,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at center, #1B2C52 0%, #0C1428 78%)",animation:"abatonFade 1.2s ease both"}}>
      <div style={{position:"relative",width:S,height:S,animation:"abatonFloat 9s ease-in-out infinite"}}>
        <div style={{position:"absolute",inset:"-3%",borderRadius:"50%",border:`1px solid ${C.gold}66`,boxShadow:`0 0 90px ${C.gold}40`}}/>
        <img src={SS_IMGS[i]} alt="" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover",border:`2px solid ${C.gold}`,animation:"abatonSpin 240s linear infinite",display:"block"}}/>
        <div style={{position:"absolute",left:"50%",top:"50%",width:"60%",height:"60%",transform:"translate(-50%,-50%)",borderRadius:"50%",background:"radial-gradient(circle, rgba(12,20,40,0.9) 0%, rgba(12,20,40,0.82) 62%, rgba(12,20,40,0) 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"6%"}}>
          <img src="/logo-eye2.png" alt="" style={{width:"22%",height:"auto",marginBottom:"3%",opacity:0.95}}/>
          <div style={{fontFamily:FD,fontSize:"clamp(26px, 7.2vmin, 58px)",color:C.white,lineHeight:1.1,textShadow:"0 2px 14px rgba(0,0,0,0.6)"}}>{L(SS_WELCOME)}</div>
          <div style={{display:"flex",alignItems:"center",gap:"10px",margin:"3% 0"}}>
            <div style={{height:"1px",width:"clamp(18px,5vmin,40px)",background:`${C.gold}99`}}/><div style={{color:C.gold,fontSize:"clamp(11px,2.6vmin,18px)"}}>✦</div><div style={{height:"1px",width:"clamp(18px,5vmin,40px)",background:`${C.gold}99`}}/>
          </div>
          <div style={{fontFamily:FD,fontStyle:"italic",fontSize:"clamp(20px, 5vmin, 40px)",color:C.gold,animation:"abatonTap 2.4s ease-in-out infinite"}}>{L(SS_TAP)}</div>
        </div>
      </div>
    </div>
  );
}

function pendingLetterFor(session) {
  const phase = stayPhase(session);
  if(!session?.name||!session?.id||(phase!=="arrival"&&phase!=="departure")) return null;
  try{ if(localStorage.getItem(`abaton_letter_${session.id}_${phase}`)) return null; }catch(e){}
  return phase;
}

function WaxSeal({size=84,onClick}) {
  const blob = (x,y,s) => <div style={{position:"absolute",left:x,top:y,width:s,height:s,borderRadius:"50%",background:"radial-gradient(circle at 35% 30%, #A93B3A, #6E1818)"}}/>;
  return (
    <button onClick={onClick} aria-label="Open the letter" style={{position:"relative",width:`${size}px`,height:`${size}px`,border:"none",background:"none",padding:0,cursor:"pointer",animation:"abatonSeal 2.6s ease-in-out infinite"}}>
      {blob("-4%","58%","22%")}{blob("80%","-2%","20%")}{blob("84%","66%","18%")}{blob("6%","4%","16%")}
      <div style={{position:"absolute",inset:0,borderRadius:"52% 48% 50% 50% / 49% 52% 48% 51%",background:"radial-gradient(circle at 34% 28%, #C04A48 0%, #962626 42%, #641515 100%)",boxShadow:"inset 0 3px 5px rgba(255,255,255,0.28), inset 0 -6px 9px rgba(0,0,0,0.42), 0 6px 12px rgba(0,0,0,0.5)"}}/>
      <div style={{position:"absolute",inset:"11%",borderRadius:"50%",border:"1.5px solid rgba(255,214,200,0.38)",boxShadow:"inset 0 2px 4px rgba(0,0,0,0.38), 0 1px 0 rgba(255,255,255,0.14)"}}/>
      <img src="/logo-eye2.png" alt="" style={{position:"absolute",left:"50%",top:"50%",width:"58%",transform:"translate(-50%,-50%)",filter:"sepia(0.5) saturate(0.9) brightness(1.18) drop-shadow(0 -1px 0 rgba(0,0,0,0.5)) drop-shadow(0 1px 0 rgba(255,210,200,0.4))",opacity:0.92,pointerEvents:"none"}}/>
    </button>
  );
}

function LetterOverlay({lang,session,phase,onDone,onReview}) {
  const [stage,setStage] = useState("closed");
  const txt = LETTER_TXT[phase];
  const L = (o) => o[lang]||o.en;
  const name = session?.name||"";
  const openIt = () => { if(stage!=="closed") return; setStage("opening"); setTimeout(()=>setStage("open"),1250); };
  const opened = stage!=="closed";
  const W = "min(88vw, 360px)";
  return (
    <div style={{position:"fixed",inset:0,zIndex:10001,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:"20px",background:"radial-gradient(ellipse at center, rgba(34,52,92,0.94), rgba(12,20,40,0.97))",backdropFilter:"blur(6px)",animation:"abatonFade 0.7s ease both"}}>
      {stage!=="open"?(
        <>
          <div style={{perspective:"1100px",width:W}}>
            <div style={{position:"relative",width:"100%",aspectRatio:"1.5 / 1",filter:"drop-shadow(0 18px 30px rgba(0,0,0,0.55))",animation:"abatonFloat 5s ease-in-out infinite"}}>
              <div style={{position:"absolute",inset:0,borderRadius:"8px",background:"linear-gradient(160deg,#F3E4CE,#E7D2B2)",border:`1px solid ${C.goldD}55`}}/>
              <div style={{position:"absolute",left:"6%",right:"6%",top:"7%",bottom:"8%",borderRadius:"4px",background:"#FFFCF6",transition:"transform 1.1s ease 0.25s",transform:opened?"translateY(-34%)":"translateY(0)",boxShadow:"0 1px 4px rgba(0,0,0,0.18)"}}/>
              <div style={{position:"absolute",inset:0,borderRadius:"8px",clipPath:"polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)",background:"linear-gradient(165deg,#EEDDC4,#DFC7A3)"}}>
                <div style={{position:"absolute",left:0,right:0,bottom:"11%",textAlign:"center",fontFamily:FD,fontWeight:"500",fontStyle:"italic",fontSize:"19px",color:C.goldD,letterSpacing:"0.04em"}}>{L(LETTER_FOR)} {name}</div>
              </div>
              <div style={{position:"absolute",left:0,right:0,top:0,height:"56%",borderRadius:"8px 8px 0 0",transformOrigin:"top",transition:"transform 1s ease",transform:opened?"rotateX(180deg)":"rotateX(0deg)",zIndex:opened?0:3,filter:"drop-shadow(0 3px 3px rgba(0,0,0,0.2))"}}>
                <div style={{position:"absolute",inset:0,clipPath:"polygon(0 0, 100% 0, 50% 100%)",background:"linear-gradient(180deg,#F6E8D2,#E9D3B2)"}}/>
              </div>
              <div style={{position:"absolute",left:"50%",top:"56%",transform:"translate(-50%,-50%)",zIndex:5,opacity:opened?0:1,transition:"opacity 0.45s ease"}}>
                <WaxSeal onClick={openIt}/>
              </div>
            </div>
          </div>
          <div style={{marginTop:"34px",fontFamily:FD,fontWeight:"500",fontStyle:"italic",fontSize:"18px",color:"rgba(255,244,225,0.88)",textAlign:"center",opacity:opened?0:1,transition:"opacity 0.4s"}}>{L(LETTER_HINT)}</div>
          <button onClick={onDone} style={{marginTop:"18px",background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontFamily:FB,fontSize:"14.5px",cursor:"pointer",opacity:opened?0:1}}>{L(LETTER_LATER)}</button>
        </>
      ):(
        <div style={{width:"min(92vw, 440px)",maxHeight:"90vh",overflowY:"auto",background:"linear-gradient(180deg,#FFFCF6,#F7ECD9)",borderRadius:"6px",padding:"30px 26px 26px",boxShadow:`0 0 0 6px #F7ECD9, 0 0 0 7px ${C.gold}88, 0 24px 60px rgba(0,0,0,0.6)`,textAlign:"center",animation:"abatonLetterIn 0.8s ease both"}}>
          <img src="/logo-eye2.png" alt="" style={{width:"62px",height:"auto",margin:"0 auto 10px",display:"block",opacity:0.95}}/>
          <div style={{fontFamily:FD,fontSize:"28px",color:C.blue,lineHeight:"1.25",marginBottom:"8px"}}>{L(txt.title).replace("{n}",name)}</div>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
            <div style={{height:"1px",width:"46px",background:`${C.gold}88`}}/><div style={{color:C.gold,fontSize:"14.5px"}}>✦</div><div style={{height:"1px",width:"46px",background:`${C.gold}88`}}/>
          </div>
          <div style={{fontFamily:FD,fontWeight:"500",fontSize:"17.5px",color:C.textD,lineHeight:"1.75",whiteSpace:"pre-line",marginBottom:"22px"}}>{L(txt.body)}</div>
          {phase==="departure"?(
            <>
              {CFG.reviewUrl
                ? <ExtLink href={CFG.reviewUrl} lang={lang} onClick={()=>track("link","Recensione dalla lettera",{lang})} style={{display:"block",padding:"14px",background:C.gold,borderRadius:"14px",color:C.white,textDecoration:"none",fontFamily:FB,fontSize:"16.5px",fontWeight:"600",marginBottom:"10px"}}>{L(txt.cta)}</ExtLink>
                : <button onClick={onReview} style={{width:"100%",padding:"14px",background:C.gold,border:"none",borderRadius:"14px",color:C.white,cursor:"pointer",fontFamily:FB,fontSize:"16.5px",fontWeight:"600",marginBottom:"10px"}}>{L(txt.cta)}</button>}
              <button onClick={onDone} style={{background:"none",border:"none",color:C.textM,fontFamily:FB,fontSize:"14.5px",cursor:"pointer",padding:"8px"}}>{L(LETTER_CLOSE)}</button>
            </>
          ):(
            <button onClick={onDone} style={{width:"100%",padding:"14px",background:C.gold,border:"none",borderRadius:"14px",color:C.white,cursor:"pointer",fontFamily:FB,fontSize:"16.5px",fontWeight:"600"}}>{L(txt.cta)}</button>
          )}
        </div>
      )}
    </div>
  );
}

function ContactButton({phone,text,lang,trackLabel,renderTrigger}) {
  const [open,setOpen] = useState(false);
  const [channel,setChannel] = useState("wa");
  const [qr,setQr] = useState("");
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  const tgLink = `https://t.me/+${phone}`;
  useEffect(()=>{
    if(!open) return;
    QRCode.toDataURL(channel==="wa"?waLink:tgLink,{width:220,margin:1,color:{dark:C.blue,light:"#ffffff"}}).then(setQr).catch(()=>setQr(""));
  },[open,channel]);
  const openModal = () => { track("link",trackLabel,{lang}); setOpen(true); };
  return (
    <>
      {renderTrigger(openModal)}
      {open&&(
        <div style={{position:"fixed",inset:0,background:"rgba(20,34,61,0.78)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}} onClick={()=>setOpen(false)}>
          <div style={{background:C.white,borderRadius:"24px",padding:"28px 24px",maxWidth:"340px",width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",gap:"8px",justifyContent:"center",marginBottom:"18px"}}>
              {[{id:"wa",label:"WhatsApp"},{id:"tg",label:"Telegram"}].map(c=>(
                <button key={c.id} onClick={()=>setChannel(c.id)} style={{padding:"8px 18px",borderRadius:"20px",border:`1px solid ${channel===c.id?C.gold:C.border}`,background:channel===c.id?C.gold:"none",color:channel===c.id?C.white:C.textM,fontFamily:FB,fontSize:"14.5px",fontWeight:"600",cursor:"pointer"}}>{c.label}</button>
              ))}
            </div>
            {qr?<img src={qr} alt="QR code" style={{width:"200px",height:"200px",margin:"0 auto 16px",display:"block",borderRadius:"12px"}}/>:<div style={{width:"200px",height:"200px",margin:"0 auto 16px"}}/>}
            <div style={{fontSize:"16.5px",color:C.blue,fontFamily:FB,fontWeight:"700",marginBottom:"6px",lineHeight:"1.4"}}>
              {lang==="it"?"Inquadra il codice con il tuo telefono":lang==="de"?"Scanne den Code mit deinem Telefon":lang==="fr"?"Scannez le code avec votre téléphone":lang==="ru"?"Наведите телефон на код":"Scan the code with your phone"}
            </div>
            <div style={{fontSize:"14.5px",color:C.textM,marginBottom:"18px",lineHeight:"1.5"}}>
              {lang==="it"?`La chat ${channel==="wa"?"WhatsApp":"Telegram"} si apre solo sul tuo dispositivo personale, non su questo tablet.`:lang==="de"?`Der ${channel==="wa"?"WhatsApp":"Telegram"}-Chat öffnet sich nur auf deinem eigenen Gerät, nicht auf diesem Tablet.`:lang==="fr"?`La discussion ${channel==="wa"?"WhatsApp":"Telegram"} ne s'ouvre que sur votre appareil personnel, pas sur cette tablette.`:lang==="ru"?`Чат ${channel==="wa"?"WhatsApp":"Telegram"} откроется только на вашем личном устройстве, а не на этом планшете.`:`The ${channel==="wa"?"WhatsApp":"Telegram"} chat only opens on your own device, not on this tablet.`}
            </div>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:C.textM,fontSize:"14.5px",cursor:"pointer",fontFamily:FB}}>
              {lang==="it"?"Chiudi":lang==="de"?"Schließen":lang==="fr"?"Fermer":lang==="ru"?"Закрыть":"Close"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── EXTERNAL LINK POPUP (a full internal page, never a dead end — Maps gets a real map) ──
function buildMapEmbed(href) {
  try {
    const u = new URL(href);
    if ((u.hostname==="www.google.com"||u.hostname==="google.com") && u.pathname==="/maps/search/") {
      const q = u.searchParams.get("query");
      if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
    }
  } catch(e) {}
  return null;
}
function hostnameOf(href) {
  try { return new URL(href).hostname.replace(/^www\./,""); } catch(e) { return href; }
}
function ExtLink({href,style,onClick,children,lang}) {
  const [open,setOpen] = useState(false);
  const [qr,setQr] = useState("");
  const mapEmbed = href?buildMapEmbed(href):null;
  useEffect(()=>{ if(!open) return; KEEP_AWAKE++; return ()=>{ KEEP_AWAKE--; }; },[open]);
  useEffect(()=>{
    if(!open||!href||mapEmbed) return;
    QRCode.toDataURL(href,{width:200,margin:1,color:{dark:C.blue,light:"#ffffff"}}).then(setQr).catch(()=>setQr(""));
  },[open,href,mapEmbed]);
  if(!href) return null;
  const host = hostnameOf(href);
  const handleClick = e => { e.preventDefault(); onClick&&onClick(); setOpen(true); };
  const closeLabel = lang==="it"?"← Torna in Abaton":lang==="de"?"← Zurück zu Abaton":lang==="fr"?"← Retour à Abaton":lang==="ru"?"← Вернуться в Abaton":"← Back to Abaton";
  return (
    <>
      <a href={href} onClick={handleClick} style={style}>{children}</a>
      {open&&(
        <div style={{position:"fixed",inset:0,background:C.bg,zIndex:9999,display:"flex",flexDirection:"column"}}>
          <button onClick={()=>setOpen(false)} style={{display:"flex",alignItems:"center",gap:"8px",padding:"18px 22px",background:C.white,border:"none",borderBottom:`1px solid ${C.border}`,cursor:"pointer",fontFamily:FB,fontSize:"16.5px",fontWeight:"700",color:C.blue,boxShadow:C.shadow,flexShrink:0,textAlign:"left"}}>
            {closeLabel}
          </button>
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {mapEmbed ? (
              <iframe src={mapEmbed} title="map" style={{flex:1,border:"none",width:"100%"}}/>
            ) : (
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px",textAlign:"center",overflowY:"auto"}}>
                <div style={{fontFamily:FD,fontWeight:"500",fontSize:"20px",color:C.blue,marginBottom:"18px"}}>{host}</div>
                {qr?<img src={qr} alt="QR code" style={{width:"180px",height:"180px",marginBottom:"18px",display:"block",borderRadius:"12px",boxShadow:C.shadow}}/>:<div style={{width:"180px",height:"180px",marginBottom:"18px"}}/>}
                <div style={{fontSize:"16.5px",color:C.blue,fontFamily:FB,fontWeight:"700",marginBottom:"8px",lineHeight:"1.4",maxWidth:"280px"}}>
                  {lang==="it"?"Inquadra il codice con il tuo telefono":lang==="de"?"Scanne den Code mit deinem Telefon":lang==="fr"?"Scannez le code avec votre téléphone":lang==="ru"?"Наведите телефон на код":"Scan the code with your phone"}
                </div>
                <div style={{fontSize:"14.5px",color:C.textM,marginBottom:"26px",maxWidth:"280px",lineHeight:"1.5"}}>
                  {lang==="it"?"Il sito si apre sul tuo telefono, senza uscire da Abaton su questo tablet.":lang==="de"?"Die Seite öffnet sich auf deinem Telefon, ohne Abaton auf diesem Tablet zu verlassen.":lang==="fr"?"Le site s'ouvre sur votre téléphone, sans quitter Abaton sur cette tablette.":lang==="ru"?"Сайт откроется на вашем телефоне, не закрывая Abaton на этом планшете.":"The site opens on your phone, without leaving Abaton on this tablet."}
                </div>
                <a href={href} onClick={()=>track("link",`${host} (same tab)`,{lang})} style={{color:C.textM,textDecoration:"underline",fontFamily:FB,fontSize:"14.5px"}}>
                  {lang==="it"?"Apri comunque su questo dispositivo →":lang==="de"?"Trotzdem auf diesem Gerät öffnen →":lang==="fr"?"Ouvrir quand même sur cet appareil →":lang==="ru"?"Всё равно открыть на этом устройстве →":"Open on this device anyway →"}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── REGOLE DELLA STRUTTURA — pagina interna a schermo intero ──────────────────
const HOUSE_RULES = [
  {titleIT:"Benvenuti",titleEN:"Welcome",titleDE:"Willkommen",titleFR:"Bienvenue",titleRU:"Добро пожаловать",
   bodyIT:"Il nostro B&B si trova all'interno di Damanhur, più nello specifico all'interno dell'aura dei Templi dell'Umanità: luogo di raccoglimento, ricerca interiore e guarigione. Per questa ragione chiediamo ai nostri ospiti di rispettarne lo spirito, mantenendo un comportamento consapevole e rispettoso degli spazi e delle persone.",
   bodyEN:"Our B&B sits within Damanhur, more specifically within the aura of the Temples of Humanity — a place of reflection, inner research and healing. For this reason we ask our guests to respect its spirit, keeping a mindful and respectful attitude toward the spaces and the people around them.",
   bodyDE:"Unser B&B befindet sich innerhalb von Damanhur, genauer gesagt innerhalb der Aura der Tempel der Menschheit — ein Ort der Sammlung, der inneren Suche und der Heilung. Aus diesem Grund bitten wir unsere Gäste, diesen Geist zu respektieren und sich bewusst und respektvoll gegenüber den Räumen und den Menschen zu verhalten.",
   bodyFR:"Notre B&B se trouve au sein de Damanhur, plus précisément dans l'aura des Temples de l'Humanité : un lieu de recueillement, de recherche intérieure et de guérison. Pour cette raison, nous demandons à nos hôtes d'en respecter l'esprit, en adoptant un comportement conscient et respectueux des espaces et des personnes.",
   bodyRU:"Наш Б&Б расположен на территории Даманхура, а точнее — в ауре Храмов Человечества: месте сосредоточения, внутреннего поиска и исцеления. Поэтому мы просим наших гостей уважать этот дух, сохраняя осознанное и уважительное отношение к пространствам и людям."},
  {titleIT:"Orari",titleEN:"Hours",titleDE:"Zeiten",titleFR:"Horaires",titleRU:"Время",
   bodyIT:"Check-in: dalle 15:00 alle 18:00 (orari diversi solo previo accordo). Check-out: entro le 10:30. Per il late check-in, cioè dopo le 22:00, verrà applicato un extra di 30€ alla prenotazione.",
   bodyEN:"Check-in: from 3:00pm to 6:00pm (different times only by prior arrangement). Check-out: by 10:30am. For late check-in, i.e. after 10:00pm, a €30 surcharge applies to the booking.",
   bodyDE:"Check-in: von 15:00 bis 18:00 Uhr (abweichende Zeiten nur nach vorheriger Absprache). Check-out: bis 10:30 Uhr. Für einen späten Check-in nach 22:00 Uhr wird der Buchung ein Aufpreis von 30€ berechnet.",
   bodyFR:"Arrivée : de 15h00 à 18h00 (horaires différents uniquement sur accord préalable). Départ : avant 10h30. Pour une arrivée tardive, c'est-à-dire après 22h00, un supplément de 30€ sera appliqué à la réservation.",
   bodyRU:"Заезд: с 15:00 до 18:00 (другое время только по предварительной договорённости). Выезд: до 10:30. За поздний заезд после 22:00 к бронированию будет применена доплата в размере 30€."},
  {titleIT:"Silenzio e atmosfera",titleEN:"Silence and atmosphere",titleDE:"Ruhe und Atmosphäre",titleFR:"Silence et atmosphère",titleRU:"Тишина и атмосфера",
   bodyIT:"Per preservare la quiete del luogo: dalle 22:00 alle 8:00 è richiesto un comportamento silenzioso; non sono consentiti musica ad alto volume o comportamenti disturbanti.",
   bodyEN:"To preserve the quiet of the place: silent behaviour is required from 10:00pm to 8:00am; loud music or disruptive behaviour is not allowed.",
   bodyDE:"Um die Ruhe des Ortes zu bewahren: Von 22:00 bis 8:00 Uhr wird leises Verhalten erwartet; laute Musik oder störendes Verhalten sind nicht gestattet.",
   bodyFR:"Pour préserver le calme du lieu : de 22h00 à 8h00, un comportement silencieux est requis ; la musique forte ou les comportements perturbateurs ne sont pas autorisés.",
   bodyRU:"Чтобы сохранить тишину этого места: с 22:00 до 8:00 просим соблюдать тишину; громкая музыка и шумное поведение не допускаются."},
  {titleIT:"Cucina condivisa",titleEN:"Shared kitchen",titleDE:"Gemeinschaftsküche",titleFR:"Cuisine partagée",titleRU:"Общая кухня",
   bodyIT:"La cucina è a disposizione degli ospiti nel rispetto reciproco. Chiediamo cortesemente di lavare e riporre piatti, stoviglie e utensili dopo l'utilizzo, lasciare sempre la cucina pulita e in ordine, e utilizzare solo gli spazi assegnati per la conservazione degli alimenti.",
   bodyEN:"The kitchen is available to guests in a spirit of mutual respect. We kindly ask you to wash and put away dishes, cutlery and utensils after use, always leave the kitchen clean and tidy, and use only the assigned spaces to store food.",
   bodyDE:"Die Küche steht den Gästen im gegenseitigen Respekt zur Verfügung. Wir bitten höflich darum, Geschirr, Besteck und Utensilien nach Gebrauch zu spülen und wegzuräumen, die Küche stets sauber und ordentlich zu hinterlassen und nur die zugewiesenen Bereiche zur Aufbewahrung von Lebensmitteln zu nutzen.",
   bodyFR:"La cuisine est à la disposition des hôtes dans le respect mutuel. Nous vous demandons aimablement de laver et ranger vaisselle, couverts et ustensiles après utilisation, de toujours laisser la cuisine propre et rangée, et d'utiliser uniquement les espaces attribués pour la conservation des aliments.",
   bodyRU:"Кухня доступна гостям при взаимном уважении. Просим вас мыть и убирать посуду, столовые приборы и утварь после использования, всегда оставлять кухню чистой и убранной, а также использовать только отведённые места для хранения продуктов."},
  {titleIT:"Living / Spazi comuni",titleEN:"Living room / Common areas",titleDE:"Wohnbereich / Gemeinschaftsräume",titleFR:"Salon / Espaces communs",titleRU:"Гостиная / Общие зоны",
   bodyIT:"Il living è uno spazio dedicato al riposo, alla lettura e alla condivisione gentile. Vi invitiamo a utilizzarlo nel rispetto dell'atmosfera di calma e raccoglimento del luogo.",
   bodyEN:"The living room is a space dedicated to rest, reading and gentle sharing. We invite you to use it in keeping with the calm, reflective atmosphere of the place.",
   bodyDE:"Der Wohnbereich ist ein Raum für Ruhe, Lektüre und sanften Austausch. Wir laden Sie ein, ihn im Einklang mit der ruhigen, besinnlichen Atmosphäre des Ortes zu nutzen.",
   bodyFR:"Le salon est un espace dédié au repos, à la lecture et au partage bienveillant. Nous vous invitons à l'utiliser dans le respect de l'atmosphère calme et recueillie du lieu.",
   bodyRU:"Гостиная — это пространство для отдыха, чтения и тёплого общения. Приглашаем вас пользоваться им в соответствии со спокойной, созерцательной атмосферой этого места."},
  {titleIT:"Fumo",titleEN:"Smoking",titleDE:"Rauchen",titleFR:"Tabac",titleRU:"Курение",
   bodyIT:"All'interno di Damanhur è vietato fumare, sia negli spazi interni che esterni della struttura. Il divieto riguarda sigarette tradizionali ed elettroniche. Saremo lieti di indicarvi dove potete recarvi se desiderate fumare durante la vostra permanenza.",
   bodyEN:"Smoking is not allowed anywhere within Damanhur, neither indoors nor in the property's outdoor spaces. The ban covers both traditional and electronic cigarettes. We'll be happy to point you to where you can go if you wish to smoke during your stay.",
   bodyDE:"Innerhalb von Damanhur ist das Rauchen verboten, sowohl in den Innen- als auch in den Außenbereichen der Struktur. Das Verbot betrifft sowohl herkömmliche als auch elektronische Zigaretten. Gerne zeigen wir Ihnen, wohin Sie gehen können, wenn Sie während Ihres Aufenthalts rauchen möchten.",
   bodyFR:"Il est interdit de fumer partout à Damanhur, aussi bien à l'intérieur qu'à l'extérieur de la structure. L'interdiction concerne les cigarettes traditionnelles et électroniques. Nous serons heureux de vous indiquer où vous pouvez vous rendre si vous souhaitez fumer pendant votre séjour.",
   bodyRU:"На территории Даманхура курение запрещено как в помещениях, так и на улице. Запрет распространяется на обычные и электронные сигареты. Мы с радостью подскажем, куда можно пойти, если вы захотите покурить во время пребывания."},
  {titleIT:"Animali",titleEN:"Animals",titleDE:"Tiere",titleFR:"Animaux",titleRU:"Животные",
   bodyIT:"Per scelta della struttura e nel rispetto del luogo, non sono ammessi animali.",
   bodyEN:"By the property's own choice, and out of respect for the place, animals are not allowed.",
   bodyDE:"Aus eigener Entscheidung der Unterkunft und aus Respekt vor dem Ort sind Tiere nicht gestattet.",
   bodyFR:"Par choix de l'établissement et par respect du lieu, les animaux ne sont pas admis.",
   bodyRU:"По решению структуры и из уважения к этому месту животные не допускаются."},
  {titleIT:"Ospiti esterni",titleEN:"Outside guests",titleDE:"Externe Besucher",titleFR:"Visiteurs extérieurs",titleRU:"Посторонние гости",
   bodyIT:"Per motivi di sicurezza e rispetto: non è consentito l'accesso a persone non registrate; eventuali visite devono essere concordate preventivamente con la Direzione.",
   bodyEN:"For safety and respect: access is not permitted to non-registered persons; any visits must be arranged in advance with Management.",
   bodyDE:"Aus Sicherheits- und Respektgründen: Nicht registrierten Personen ist der Zutritt nicht gestattet; etwaige Besuche müssen vorab mit der Leitung vereinbart werden.",
   bodyFR:"Pour des raisons de sécurité et de respect : l'accès n'est pas autorisé aux personnes non enregistrées ; toute visite doit être convenue au préalable avec la Direction.",
   bodyRU:"В целях безопасности и уважения: доступ незарегистрированным лицам не разрешён; любые визиты должны быть заранее согласованы с руководством."},
  {titleIT:"Danni e responsabilità",titleEN:"Damages and liability",titleDE:"Schäden und Haftung",titleFR:"Dommages et responsabilité",titleRU:"Ущерб и ответственность",
   bodyIT:"Eventuali danni a locali, arredi o dotazioni saranno addebitati. La Direzione non è responsabile per oggetti personali lasciati incustoditi. Chiediamo di guidare lentamente salendo la collina per raggiungere l'Abaton: ci troviamo in un luogo con tanti animali selvatici che ci teniamo a salvaguardare.",
   bodyEN:"Any damage to the premises, furnishings or equipment will be charged. Management is not responsible for personal belongings left unattended. Please drive slowly on the way up the hill to Abaton: we're in a place with a lot of wildlife that we care about protecting.",
   bodyDE:"Etwaige Schäden an Räumen, Einrichtung oder Ausstattung werden in Rechnung gestellt. Die Leitung haftet nicht für unbeaufsichtigt gelassene persönliche Gegenstände. Bitte fahren Sie beim Hinauffahren zum Abaton langsam: Wir befinden uns an einem Ort mit vielen Wildtieren, die uns am Herzen liegen.",
   bodyFR:"Tout dommage aux locaux, au mobilier ou aux équipements sera facturé. La Direction n'est pas responsable des objets personnels laissés sans surveillance. Nous vous demandons de conduire lentement en montant la colline pour rejoindre l'Abaton : nous nous trouvons dans un lieu avec de nombreux animaux sauvages que nous tenons à préserver.",
   bodyRU:"Любой ущерб помещениям, мебели или оборудованию будет оплачиваться гостем. Руководство не несёт ответственности за личные вещи, оставленные без присмотра. Просим ехать медленно, поднимаясь на холм к Abaton: здесь обитает много диких животных, которых мы бережём."},
  {titleIT:"Partenza anticipata",titleEN:"Early departure",titleDE:"Vorzeitige Abreise",titleFR:"Départ anticipé",titleRU:"Досрочный отъезд",
   bodyIT:"In caso di partenza anticipata o mancato arrivo si applica la politica di cancellazione accettata al momento della prenotazione.",
   bodyEN:"In case of early departure or no-show, the cancellation policy accepted at the time of booking applies.",
   bodyDE:"Im Falle einer vorzeitigen Abreise oder eines Nichterscheinens gilt die bei der Buchung akzeptierte Stornierungsbedingung.",
   bodyFR:"En cas de départ anticipé ou de non-présentation, la politique d'annulation acceptée au moment de la réservation s'applique.",
   bodyRU:"В случае досрочного отъезда или неявки применяется политика отмены, принятая при бронировании."},
];
function HouseRulesPanel({lang,renderTrigger}) {
  const [open,setOpen] = useState(false);
  const closeLabel = lang==="it"?"← Torna in Abaton":lang==="de"?"← Zurück zu Abaton":lang==="fr"?"← Retour à Abaton":lang==="ru"?"← Вернуться в Abaton":"← Back to Abaton";
  return (
    <>
      {renderTrigger(()=>setOpen(true))}
      {open&&(
        <div style={{position:"fixed",inset:0,background:C.bg,zIndex:9999,display:"flex",flexDirection:"column"}}>
          <button onClick={()=>setOpen(false)} style={{display:"flex",alignItems:"center",gap:"8px",padding:"18px 22px",background:C.white,border:"none",borderBottom:`1px solid ${C.border}`,cursor:"pointer",fontFamily:FB,fontSize:"16.5px",fontWeight:"700",color:C.blue,boxShadow:C.shadow,flexShrink:0,textAlign:"left"}}>
            {closeLabel}
          </button>
          <div style={{flex:1,overflowY:"auto",padding:"24px 22px 60px"}}>
            <img src="/temple/fregio.jpg" alt="" style={{width:"100%",height:"52px",objectFit:"cover",borderRadius:"14px",marginBottom:"18px",display:"block"}}/>
            <div style={{fontFamily:FD,fontSize:"28px",color:C.blue,marginBottom:"20px"}}>
              {lang==="it"?"Regole della struttura":lang==="de"?"Hausregeln":lang==="fr"?"Règles de la maison":lang==="ru"?"Правила проживания":"House rules"}
            </div>
            {HOUSE_RULES.map((r,i)=>(
              <div key={i} style={{marginBottom:"22px"}}>
                <div style={{fontFamily:FD,fontWeight:"500",fontSize:"18.5px",color:C.goldD,marginBottom:"6px"}}>{r["title"+lang.toUpperCase()]||r.titleIT}</div>
                <div style={{fontSize:"16px",color:C.textD,lineHeight:"1.7"}}>{cx(r["body"+lang.toUpperCase()]||r.bodyIT)}</div>
              </div>
            ))}
            <div style={{fontSize:"14.5px",color:C.textM,fontStyle:"italic",lineHeight:"1.6",marginTop:"28px",paddingTop:"18px",borderTop:`1px solid ${C.border}`}}>
              {lang==="it"?"Il rispetto di queste semplici regole contribuisce a mantenere un ambiente armonioso e accogliente per tutti. Siamo sempre disponibili per qualsiasi necessità o chiarimento.":lang==="de"?"Die Einhaltung dieser einfachen Regeln trägt dazu bei, eine harmonische und einladende Umgebung für alle zu erhalten. Wir stehen jederzeit für Fragen oder Anliegen zur Verfügung.":lang==="fr"?"Le respect de ces règles simples contribue à maintenir un environnement harmonieux et accueillant pour tous. Nous restons toujours disponibles pour toute nécessité ou clarification.":lang==="ru"?"Соблюдение этих простых правил помогает поддерживать гармоничную и гостеприимную атмосферу для всех. Мы всегда готовы помочь или что-то прояснить.":"Respecting these simple rules helps keep a harmonious, welcoming environment for everyone. We're always available for any need or clarification."}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── TEMPIO DEI POPOLI — prenotazione esperienza privata ───────────────────────
const POPOLI_INTERESTS = [
  {id:"meditazione",it:"Meditazione silenziosa",en:"Silent meditation",de:"Stille Meditation",fr:"Méditation silencieuse",ru:"Тихая медитация"},
  {id:"energia",it:"Connessione energetica",en:"Energetic connection",de:"Energetische Verbindung",fr:"Connexion énergétique",ru:"Энергетическая связь"},
  {id:"storia",it:"Racconto e storia del luogo",en:"Stories and history of the place",de:"Erzählungen und Geschichte des Ortes",fr:"Récits et histoire du lieu",ru:"Рассказы и история места"},
  {id:"medguidata",it:"Meditazione guidata",en:"Guided meditation",de:"Geführte Meditation",fr:"Méditation guidée",ru:"Медитация с гидом"},
];
function PopoliExperienceButton({t,lang,style}) {
  const [open,setOpen] = useState(false);
  const [picked,setPicked] = useState([]);
  const [note,setNote] = useState("");
  const toggle = id => setPicked(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const openSheet = () => { track("popoli_open","Tempo dei Popoli",{lang}); setOpen(true); };
  const session = getSession();
  const room = ROOMS_LIST.find(r=>r.id===getRoom());
  const interestNames = POPOLI_INTERESTS.filter(i=>picked.includes(i.id)).map(i=>i.it).join(", ");
  const message = [
    "Buongiorno, vorrei prenotare un'esperienza nel Tempo dei Popoli.",
    room?`Stanza: ${room.name}`:null,
    session?.name?`Ospite: ${session.name}`:null,
    interestNames?`Interessi: ${interestNames}`:null,
    note?`Note: ${note}`:null,
  ].filter(Boolean).join("\n");
  return (
    <>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 0",...style}}>
        <div style={{position:"relative",marginBottom:"12px"}}>
          <Rosone src="/temple/rosone-vittoria.jpg" size={196} spin={140} style={{position:"absolute",top:0,left:0,opacity:0.95,boxShadow:`0 0 0 2px ${C.gold}88`}}/>
          <div style={{width:"196px",height:"196px",borderRadius:"50%",border:`1px dashed ${C.blue}55`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:"174px",height:"174px",borderRadius:"50%",border:`1px solid ${C.blue}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Circle size={156} bg={SPHERE_BG_NAVY} onClick={openSheet} style={{border:`2px solid ${C.gold}`,boxShadow:`0 0 0 1px ${C.goldD}88, ${SPHERE_SHADOW_NAVY}`,overflow:"hidden"}}>
                <div style={{position:"absolute",top:"10%",left:"18%",width:"46%",height:"30%",borderRadius:"50%",background:"radial-gradient(ellipse, rgba(255,255,255,0.4), rgba(255,255,255,0) 70%)",pointerEvents:"none"}}/>
                <div style={{textAlign:"center",padding:"10px",position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:"15.5px",color:C.gold,marginBottom:"5px",textShadow:SPHERE_TEXT_SHADOW}}>✦</div>
                  <div style={{fontFamily:FD,fontSize:"18px",color:C.white,fontWeight:"600",lineHeight:"1.25",whiteSpace:"pre-line",textShadow:SPHERE_TEXT_SHADOW}}>
                    {lang==="it"?"Il Tempo\ndei Popoli":lang==="de"?"Die Zeit\nder Völker":lang==="fr"?"Le Temps\ndes Peuples":lang==="ru"?"Время\nНародов":"The Time\nof the Peoples"}
                  </div>
                  <div style={{fontSize:"15.5px",color:C.gold,marginTop:"5px",textShadow:SPHERE_TEXT_SHADOW}}>✦</div>
                </div>
              </Circle>
            </div>
          </div>
          {[0,1,2,3,4,5].map(i => {
            const angle = (i*60-90) * Math.PI/180;
            const r = 100;
            const x = 98 + r*Math.cos(angle);
            const y = 98 + r*Math.sin(angle);
            return <div key={i} style={{position:"absolute",left:`${x-3}px`,top:`${y-3}px`,width:"6px",height:"6px",borderRadius:"50%",background:i%2===0?C.blue:`${C.blue}44`}}/>;
          })}
        </div>
        <div style={{fontSize:"15.5px",color:C.goldD,fontFamily:FB,textAlign:"center",cursor:"pointer"}} onClick={openSheet}>
          {lang==="it"?"Prenota una tua esperienza privata →":lang==="de"?"Buche dein privates Erlebnis →":lang==="fr"?"Réservez votre expérience privée →":lang==="ru"?"Забронируйте личный опыт →":"Book your private experience →"}
        </div>
      </div>
      {open&&(
        <div style={{position:"fixed",inset:0,background:"rgba(20,34,61,0.78)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setOpen(false)}>
          <div style={{background:C.white,borderRadius:"24px 24px 0 0",padding:"28px 24px 32px",maxWidth:"480px",width:"100%",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:FD,fontSize:"24px",color:C.blue,marginBottom:"8px"}}>
              {lang==="it"?"Il Tempo dei Popoli":lang==="de"?"Die Zeit der Völker":lang==="fr"?"Le Temps des Peuples":lang==="ru"?"Время Народов":"The Time of the Peoples"}
            </div>
            <div style={{fontSize:"15.5px",color:C.textM,lineHeight:"1.6",marginBottom:"20px"}}>
              {lang==="it"?"La Sala del Tempo dei Popoli è uno degli spazi più silenziosi e riservati dei Templi dell'Umanità — normalmente chiusa alle visite guidate, aperta solo su richiesta a chi desidera fermarsi davvero. Chi vi entra racconta di percepire il tempo diversamente: più lento, più proprio. Un luogo pensato per la meditazione, dove il presente si fa più nitido e il pensiero trova spazio per posarsi.\n\nRaccontaci cosa desideri vivere: lo staff organizzerà l'esperienza su misura per te.":lang==="de"?"Die Halle der Zeit der Völker ist einer der stillsten und privatesten Räume innerhalb der Tempel der Menschheit — normalerweise nicht Teil der geführten Besichtigungen und nur auf Anfrage für jene geöffnet, die wirklich innehalten möchten. Wer sie betritt, erzählt oft, die Zeit dort anders zu erleben: langsamer, ganz die eigene. Ein Raum für die Meditation, in dem die Gegenwart klarer wird und der Gedanke zur Ruhe kommt.\n\nErzähl uns, was du erleben möchtest: das Team organisiert ein maßgeschneidertes Erlebnis für dich.":lang==="fr"?"La Salle du Temps des Peuples est l'un des espaces les plus silencieux et les plus privés des Temples de l'Humanité — habituellement fermée aux visites guidées, elle n'ouvre que sur demande à ceux qui souhaitent vraiment s'arrêter. Ceux qui y entrent racontent souvent y percevoir le temps autrement : plus lent, plus personnel. Un lieu pensé pour la méditation, où le présent devient plus net et où la pensée trouve enfin l'espace pour se poser.\n\nDites-nous ce que vous souhaitez vivre : l'équipe organisera une expérience sur mesure.":lang==="ru"?"Зал Времени Народов — одно из самых тихих и уединённых пространств Храмов Человечества, обычно закрытое для экскурсий и открывающееся лишь по запросу для тех, кто действительно хочет остановиться. Те, кто входит туда, часто рассказывают, что время там ощущается иначе — медленнее, более своим. Пространство, созданное для медитации, где настоящее становится яснее, а мысли наконец находят покой.\n\nРасскажите, что вы хотели бы испытать — персонал организует индивидуальный опыт.":"The Hall of Time of the Peoples is one of the quietest, most private spaces within the Temples of Humanity — usually closed to guided visits, and opened only on request for those who truly wish to pause. Those who enter often say they experience time differently there: slower, more their own. A space conceived for meditation, where the present becomes clearer and thought finds room to settle.\n\nTell us what you'd like to experience — our staff will arrange it for you."}
            </div>
            <div style={{fontSize:"13.5px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:C.goldD,marginBottom:"10px"}}>
              {lang==="it"?"Cosa ti interessa?":lang==="de"?"Was interessiert dich?":lang==="fr"?"Qu'est-ce qui vous intéresse ?":lang==="ru"?"Что вас интересует?":"What interests you?"}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"18px"}}>
              {POPOLI_INTERESTS.map(i=>(
                <button key={i.id} onClick={()=>toggle(i.id)} style={{padding:"9px 16px",borderRadius:"20px",border:`1px solid ${picked.includes(i.id)?C.gold:C.border}`,background:picked.includes(i.id)?C.gold:"none",color:picked.includes(i.id)?C.white:C.textM,fontFamily:FB,fontSize:"14.5px",cursor:"pointer"}}>{i[lang]||i.it}</button>
              ))}
            </div>
            <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={lang==="it"?"Altre note (facoltativo)":lang==="de"?"Weitere Hinweise (optional)":lang==="fr"?"Autres notes (facultatif)":lang==="ru"?"Дополнительно (необязательно)":"Anything else (optional)"} style={{width:"100%",minHeight:"70px",padding:"12px 14px",borderRadius:"14px",border:`1px solid ${C.border}`,fontFamily:FB,fontSize:"15.5px",resize:"vertical",marginBottom:"20px",boxSizing:"border-box"}}/>
            <ContactButton phone="393510103842" lang={lang} trackLabel="WhatsApp book Popoli Time experience" text={message} renderTrigger={openContact=>(
              <button onClick={openContact} style={{width:"100%",padding:"14px",background:C.gold,border:"none",borderRadius:"14px",color:C.white,cursor:"pointer",fontFamily:FB,fontSize:"16.5px",fontWeight:"600",marginBottom:"10px"}}>
                {lang==="it"?"Richiedi l'esperienza →":lang==="de"?"Erlebnis anfragen →":lang==="fr"?"Demander l'expérience →":lang==="ru"?"Запросить опыт →":"Request the experience →"}
              </button>
            )}/>
            <button onClick={()=>setOpen(false)} style={{width:"100%",padding:"8px",background:"none",border:"none",color:C.textM,fontSize:"14.5px",cursor:"pointer",fontFamily:FB}}>
              {lang==="it"?"Chiudi":lang==="de"?"Schließen":lang==="fr"?"Fermer":lang==="ru"?"Закрыть":"Close"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── QUICK ASK — richiesta diretta allo staff via Telegram, senza numero dell'ospite ──
function QuickAsk({item,lang,style,children,trackLabel}) {
  const [open,setOpen] = useState(false);
  const [name,setName] = useState(()=>getSession()?.name||"");
  const [time,setTime] = useState(null);
  const [note,setNote] = useState("");
  const [sent,setSent] = useState(false);
  const [sending,setSending] = useState(false);
  const room = getRoom();
  const opts = [
    {id:"mattina",it:"Mattina",en:"Morning",de:"Morgens",fr:"Matin",ru:"Утром"},
    {id:"pomeriggio",it:"Pomeriggio",en:"Afternoon",de:"Nachmittags",fr:"Après-midi",ru:"Днём"},
    {id:"sera",it:"Sera",en:"Evening",de:"Abends",fr:"Soir",ru:"Вечером"},
  ];
  const send = async () => {
    setSending(true);
    const timeLabel = opts.find(o=>o.id===time);
    track(trackLabel||"quick_request", item, {lang});
    try{
      await fetch("/api/request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,room,item,timePref:timeLabel?(timeLabel[lang]||timeLabel.it):null,note,lang})});
    }catch(e){}
    setSending(false);
    setSent(true);
  };
  const closeAll = () => { setOpen(false); setTimeout(()=>{setSent(false);setTime(null);setNote("");},300); };
  return (
    <>
      <button onClick={()=>setOpen(true)} style={style}>{children}</button>
      {open&&(
        <div style={{position:"fixed",inset:0,background:"rgba(20,34,61,0.78)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={closeAll}>
          <div style={{background:C.white,borderRadius:"24px 24px 0 0",padding:"28px 24px 32px",maxWidth:"480px",width:"100%",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            {sent ? (
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:"38px",marginBottom:"14px"}}>✓</div>
                <div style={{fontFamily:FD,fontWeight:"500",fontSize:"20px",color:C.blue,marginBottom:"8px"}}>
                  {lang==="it"?"Richiesta inviata":lang==="de"?"Anfrage gesendet":lang==="fr"?"Demande envoyée":lang==="ru"?"Запрос отправлен":"Request sent"}
                </div>
                <div style={{fontSize:"15.5px",color:C.textM,marginBottom:"22px",lineHeight:"1.5"}}>
                  {lang==="it"?"Lo staff ti risponderà a breve.":lang==="de"?"Das Team meldet sich bald bei dir.":lang==="fr"?"L'équipe reviendra vers vous bientôt.":lang==="ru"?"Персонал скоро свяжется с вами.":"Our staff will get back to you shortly."}
                </div>
                <button onClick={closeAll} style={{padding:"12px 24px",background:C.gold,color:C.white,border:"none",borderRadius:"14px",fontFamily:FB,fontSize:"15.5px",cursor:"pointer"}}>
                  {lang==="it"?"Chiudi":lang==="de"?"Schließen":lang==="fr"?"Fermer":lang==="ru"?"Закрыть":"Close"}
                </button>
              </div>
            ) : (
              <>
                <div style={{fontFamily:FD,fontWeight:"500",fontSize:"20px",color:C.blue,marginBottom:"4px"}}>{item}</div>
                <div style={{fontSize:"14.5px",color:C.textM,marginBottom:"20px"}}>
                  {lang==="it"?"Arriva direttamente allo staff, senza bisogno del tuo numero.":lang==="de"?"Geht direkt ans Team, deine Nummer wird nicht benötigt.":lang==="fr"?"Envoyé directement au personnel, sans besoin de votre numéro.":lang==="ru"?"Отправляется напрямую персоналу, ваш номер не нужен.":"Goes straight to our staff — no phone number needed."}
                </div>
                <div style={{fontSize:"13.5px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:C.goldD,marginBottom:"10px"}}>
                  {lang==="it"?"Quando preferisci?":lang==="de"?"Wann passt es dir?":lang==="fr"?"Quand préférez-vous ?":lang==="ru"?"Когда вам удобно?":"When works for you?"}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"18px"}}>
                  {opts.map(o=>(
                    <button key={o.id} onClick={()=>setTime(o.id)} style={{padding:"9px 16px",borderRadius:"20px",border:`1px solid ${time===o.id?C.gold:C.border}`,background:time===o.id?C.gold:"none",color:time===o.id?C.white:C.textM,fontFamily:FB,fontSize:"14.5px",cursor:"pointer"}}>{o[lang]||o.it}</button>
                  ))}
                </div>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder={lang==="it"?"Il tuo nome":lang==="de"?"Dein Name":lang==="fr"?"Votre nom":lang==="ru"?"Ваше имя":"Your name"} style={{width:"100%",padding:"12px 14px",borderRadius:"14px",border:`1px solid ${C.border}`,fontFamily:FB,fontSize:"15.5px",marginBottom:"12px",boxSizing:"border-box"}}/>
                <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={lang==="it"?"Altre note (facoltativo)":lang==="de"?"Weitere Hinweise (optional)":lang==="fr"?"Autres notes (facultatif)":lang==="ru"?"Дополнительно (необязательно)":"Anything else (optional)"} style={{width:"100%",minHeight:"60px",padding:"12px 14px",borderRadius:"14px",border:`1px solid ${C.border}`,fontFamily:FB,fontSize:"15.5px",resize:"vertical",marginBottom:"20px",boxSizing:"border-box"}}/>
                <button onClick={send} disabled={sending||!name} style={{width:"100%",padding:"14px",background:sending||!name?C.border:C.gold,border:"none",borderRadius:"14px",color:C.white,cursor:sending||!name?"default":"pointer",fontFamily:FB,fontSize:"16.5px",fontWeight:"600",marginBottom:"10px"}}>
                  {sending?(lang==="it"?"Invio...":lang==="de"?"Senden...":lang==="fr"?"Envoi...":lang==="ru"?"Отправка...":"Sending..."):(lang==="it"?"Invia richiesta →":lang==="de"?"Anfrage senden →":lang==="fr"?"Envoyer la demande →":lang==="ru"?"Отправить запрос →":"Send request →")}
                </button>
                <button onClick={closeAll} style={{width:"100%",padding:"8px",background:"none",border:"none",color:C.textM,fontSize:"14.5px",cursor:"pointer",fontFamily:FB}}>
                  {lang==="it"?"Annulla":lang==="de"?"Abbrechen":lang==="fr"?"Annuler":lang==="ru"?"Отмена":"Cancel"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── TABLET / STAFF: stanza fissa del device + sessione ospite corrente ────────
const STAFF_PIN = "1950";
const ROOMS_LIST = [
  {id:"terra",   name:"Terra",   lineIT:"Dedicata alle forze della Natura e al principio maschile come elemento attivo e fecondante.", lineEN:"Dedicated to the forces of Nature and the masculine principle as an active, fertilizing element.", lineDE:"Der Erde gewidmet und dem männlichen Prinzip als aktives, befruchtendes Element.", lineFR:"Dédiée aux forces de la Nature et au principe masculin comme élément actif et fécondant.", lineRU:"Посвящён силам Природы и мужскому принципу как активному, оплодотворяющему элементу."},
  {id:"metalli", name:"Metalli", lineIT:"Dedicata alla trasformazione alchemica interiore, attraverso la metafora dei metalli — il piombo che diventa oro.", lineEN:"Dedicated to inner alchemical transformation, through the metaphor of metals — lead that becomes gold.", lineDE:"Gewidmet der inneren alchemistischen Transformation, durch die Metapher der Metalle — Blei, das zu Gold wird.", lineFR:"Dédiée à la transformation alchimique intérieure, à travers la métaphore des métaux — le plomb qui devient or.", lineRU:"Посвящён внутренней алхимической трансформации через метафору металлов — свинец, превращающийся в золото."},
  {id:"acqua",   name:"Acqua",   lineIT:"Dedicata al principio femminile, alle memorie profonde del cosmo e alla ciclicità di ogni essere vivente.", lineEN:"Dedicated to the feminine principle, the deep memories of the cosmos and the cyclicality of every living being.", lineDE:"Dem weiblichen Prinzip gewidmet, den tiefen Erinnerungen des Kosmos und der Zyklizität jedes Lebewesens.", lineFR:"Dédiée au principe féminin, aux mémoires profondes du cosmos et à la cyclicité de tout être vivant.", lineRU:"Посвящён женскому принципу, глубинным воспоминаниям космоса и цикличности всего живого."},
  {id:"specchi", name:"Specchi", lineIT:"Dedicata all'aria, alle forze solari, alla riunificazione dell'umanità come principio umano, spirituale e divino.", lineEN:"Dedicated to air, solar forces, and the reunification of humanity as a human, spiritual and divine principle.", lineDE:"Gewidmet der Luft, den solaren Kräften und der Wiedervereinigung der Menschheit als menschliches, spirituelles und göttliches Prinzip.", lineFR:"Dédiée à l'air, aux forces solaires et à la réunification de l'humanité comme principe humain, spirituel et divin.", lineRU:"Посвящён воздуху, солнечным силам и воссоединению человечества как человеческого, духовного и божественного начала."},
  {id:"popoli",  name:"Popoli",  lineIT:"Una sala speciale dei Templi dell'Umanità — non visitabile nelle normali visite guidate.", lineEN:"A special hall of the Temples of Humanity — not open during normal guided visits.", lineDE:"Ein besonderer Saal der Tempel der Menschheit — bei normalen Führungen nicht zugänglich.", lineFR:"Une salle spéciale des Temples de l'Humanité — non ouverte aux visites guidées normales.", lineRU:"Особый зал Храмов Человечества — недоступный при обычных экскурсиях."},
];
function getRoom(){ try{ return localStorage.getItem('abaton_room')||""; }catch(e){ return ""; } }
function setRoomStorage(id){ try{ localStorage.setItem('abaton_room',id); }catch(e){} }
function getSession(){
  try{ const raw=localStorage.getItem('abaton_session'); return raw?JSON.parse(raw):null; }catch(e){ return null; }
}
function saveSession({name,checkIn,checkOut,lang}){
  const session = {name,checkIn,checkOut,lang:lang||"it",id:String(Date.now())};
  try{
    localStorage.setItem('abaton_session',JSON.stringify(session));
    localStorage.removeItem('abaton_onboarded_id');
  }catch(e){}
  return session;
}
function clearSession(){
  try{ localStorage.removeItem('abaton_session'); localStorage.removeItem('abaton_onboarded_id'); }catch(e){}
}

function StaffPanel({session,onSave,onClear,onClose,onDashboard,onEditInfo}) {
  const [pinOk,setPinOk] = useState(false);
  const [pin,setPin] = useState("");
  const [name,setName] = useState(session?.name||"");
  const [checkIn,setCheckIn] = useState(session?.checkIn||"");
  const [checkOut,setCheckOut] = useState(session?.checkOut||"");
  const [room,setRoomSel] = useState(getRoom());
  const [guestLang,setGuestLang] = useState(session?.lang||"it");

  if (!pinOk) {
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(20,34,61,0.88)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}} onClick={onClose}>
        <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:"20px",padding:"28px",width:"100%",maxWidth:"320px"}}>
          <div style={{fontFamily:FD,fontWeight:"500",fontSize:"18px",color:C.blue,marginBottom:"14px"}}>Accesso staff</div>
          <input type="password" inputMode="numeric" autoFocus value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(pin===STAFF_PIN?setPinOk(true):setPin(""))} placeholder="PIN" style={{width:"100%",padding:"12px",borderRadius:"12px",border:`1px solid ${C.border}`,fontFamily:FB,fontSize:"17.5px",marginBottom:"12px",outline:"none"}}/>
          <div style={{display:"flex",gap:"10px"}}>
            <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:"14px",border:`1px solid ${C.border}`,background:"none",cursor:"pointer",fontFamily:FB}}>Annulla</button>
            <button onClick={()=>{ if(pin===STAFF_PIN) setPinOk(true); else setPin(""); }} style={{flex:1,padding:"12px",borderRadius:"14px",border:"none",background:C.gold,color:C.white,cursor:"pointer",fontFamily:FB}}>Entra</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(20,34,61,0.88)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",overflowY:"auto"}}>
      <div style={{background:C.white,borderRadius:"20px",padding:"28px",width:"100%",maxWidth:"380px"}}>
        <div style={{fontFamily:FD,fontWeight:"500",fontSize:"20px",color:C.blue,marginBottom:"18px"}}>Pannello Staff</div>

        <label style={{fontSize:"13.5px",color:C.textM,display:"block",marginBottom:"6px"}}>Stanza di questo tablet</label>
        <select value={room} onChange={e=>setRoomSel(e.target.value)} style={{width:"100%",padding:"10px",borderRadius:"10px",border:`1px solid ${C.border}`,marginBottom:"16px",fontFamily:FB,fontSize:"16.5px"}}>
          <option value="">— seleziona —</option>
          {ROOMS_LIST.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
        </select>

        <label style={{fontSize:"13.5px",color:C.textM,display:"block",marginBottom:"6px"}}>Nome ospite</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Es. Denise" style={{width:"100%",padding:"10px",borderRadius:"10px",border:`1px solid ${C.border}`,marginBottom:"16px",fontFamily:FB,fontSize:"16.5px",outline:"none"}}/>

        <label style={{fontSize:"13.5px",color:C.textM,display:"block",marginBottom:"6px"}}>Lingua ospite</label>
        <select value={guestLang} onChange={e=>setGuestLang(e.target.value)} style={{width:"100%",padding:"10px",borderRadius:"10px",border:`1px solid ${C.border}`,marginBottom:"16px",fontFamily:FB,fontSize:"16.5px"}}>
          <option value="it">🇮🇹 Italiano</option>
          <option value="en">🇬🇧 English</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="ru">🇷🇺 Русский</option>
        </select>

        <div style={{display:"flex",gap:"10px",marginBottom:"20px"}}>
          <div style={{flex:1}}>
            <label style={{fontSize:"13.5px",color:C.textM,display:"block",marginBottom:"6px"}}>Check-in</label>
            <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} style={{width:"100%",padding:"10px",borderRadius:"10px",border:`1px solid ${C.border}`,fontFamily:FB,fontSize:"15.5px"}}/>
          </div>
          <div style={{flex:1}}>
            <label style={{fontSize:"13.5px",color:C.textM,display:"block",marginBottom:"6px"}}>Check-out</label>
            <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} style={{width:"100%",padding:"10px",borderRadius:"10px",border:`1px solid ${C.border}`,fontFamily:FB,fontSize:"15.5px"}}/>
          </div>
        </div>

        <button onClick={()=>{ setRoomStorage(room); onSave({name,checkIn,checkOut,lang:guestLang}); }} disabled={!name||!room} style={{width:"100%",padding:"13px",borderRadius:"14px",border:"none",background:name&&room?C.gold:C.border,color:C.white,cursor:name&&room?"pointer":"not-allowed",marginBottom:"10px",fontFamily:FB,fontSize:"16.5px"}}>Salva nuovo ospite</button>
        <button onClick={onClear} style={{width:"100%",padding:"13px",borderRadius:"14px",border:`1px solid ${C.border}`,background:"none",color:C.textM,cursor:"pointer",marginBottom:"10px",fontFamily:FB,fontSize:"16.5px"}}>Pulisci dati ospite (check-out)</button>
        {onEditInfo&&<button onClick={()=>onEditInfo(pin)} style={{width:"100%",padding:"13px",borderRadius:"14px",border:`1px solid ${C.gold}66`,background:C.goldPale,color:C.goldD,cursor:"pointer",marginBottom:"10px",fontFamily:FB,fontSize:"16.5px"}}>✏️ Modifica le info dell'app →</button>}
        {onDashboard&&<button onClick={onDashboard} style={{width:"100%",padding:"13px",borderRadius:"14px",border:`1px solid ${C.gold}66`,background:C.goldPale,color:C.goldD,cursor:"pointer",marginBottom:"10px",fontFamily:FB,fontSize:"16.5px"}}>📊 Vedi statistiche →</button>}
        <button onClick={onClose} style={{width:"100%",padding:"10px",border:"none",background:"none",color:C.textM,cursor:"pointer",fontFamily:FB,fontSize:"14.5px"}}>Chiudi</button>
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────
const PHASE_MSG = {
  arrival: {it:"Benvenuto ad Abaton. Prenditi il tempo per orientarti — qui trovi tutto ciò che ti serve per iniziare.",en:"Welcome to Abaton. Take your time to settle in — everything you need to get started is here.",de:"Willkommen im Abaton. Nimm dir Zeit anzukommen — hier findest du alles, was du zum Start brauchst.",fr:"Bienvenue à l'Abaton. Prenez le temps de vous installer — tout ce qu'il vous faut pour commencer est ici.",ru:"Добро пожаловать в Abaton. Не торопитесь освоиться — здесь есть всё, что нужно для начала."},
  middle: {it:"Come sta andando il tuo soggiorno? Questo è il momento ideale per provare qualcosa di nuovo.",en:"How is your stay going? This is the perfect moment to try something new.",de:"Wie läuft dein Aufenthalt? Jetzt ist der perfekte Moment, um etwas Neues auszuprobieren.",fr:"Comment se passe votre séjour ? C'est le moment idéal pour essayer quelque chose de nouveau.",ru:"Как проходит ваше пребывание? Сейчас идеальный момент попробовать что-то новое."},
  departure: {it:"Il tuo soggiorno volge al termine. Grazie per aver condiviso questo tempo con noi.",en:"Your stay is coming to an end. Thank you for sharing this time with us.",de:"Dein Aufenthalt geht zu Ende. Danke, dass du diese Zeit mit uns geteilt hast.",fr:"Votre séjour touche à sa fin. Merci d'avoir partagé ce temps avec nous.",ru:"Ваше пребывание подходит к концу. Спасибо, что провели это время с нами."},
};
function HomePage({t,lang,setLang,setPage,session,onOpenStaff}) {
  const [showLang,setShowLang] = useState(false);
  const [showWifi,setShowWifi] = useState(false);
  const [showLateOut,setShowLateOut] = useState(false);
  const phase = stayPhase(session);
  const LOCALEMAP = {it:"it-IT",en:"en-GB",de:"de-DE",fr:"fr-FR",ru:"ru-RU"};
  const date = new Date().toLocaleDateString(LOCALEMAP[lang]||"en-GB",{weekday:"long",day:"numeric",month:"long"});
  const tapRef = useRef({count:0,timer:null});
  const handleWordmarkTap = () => {
    const r = tapRef.current;
    r.count += 1;
    if (r.timer) clearTimeout(r.timer);
    if (r.count >= 5) {
      r.count = 0;
      onOpenStaff && onOpenStaff();
      return;
    }
    r.timer = setTimeout(()=>{ r.count = 0; }, 2000);
  };
  return (
    <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
      {/* HEADER */}
      <div style={{padding:"48px 28px 140px",textAlign:"center",position:"relative",backgroundImage:"url(data:image/jpeg;base64,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)",backgroundSize:"cover",backgroundPosition:"center"}}>
        <div style={{position:"absolute",inset:0,background:C.blue,opacity:0.8}}/>
        <div style={{position:"absolute",top:"20px",right:"20px"}}>
          <button onClick={()=>setShowLang(!showLang)} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:"10px",padding:"7px 12px",color:C.textS,cursor:"pointer",fontFamily:FB,fontSize:"14.5px",boxShadow:C.shadow}}>
            {lang.toUpperCase()}
          </button>
          {showLang&&(
            <div style={{position:"absolute",top:"40px",right:0,background:C.white,border:`1px solid ${C.border}`,borderRadius:"16px",padding:"8px",minWidth:"148px",zIndex:9999,boxShadow:"0 8px 32px rgba(0,0,0,0.12)"}}>
              {[["it","🇮🇹 Italiano"],["en","🇬🇧 English"],["de","🇩🇪 Deutsch"],["fr","🇫🇷 Français"],["ru","🇷🇺 Русский"]].map(([l,lb])=>(
                <button key={l} onClick={()=>{setLang(l);setShowLang(false);}} style={{display:"block",width:"100%",textAlign:"left",padding:"9px 13px",background:lang===l?C.goldPale:"transparent",color:lang===l?C.goldD:C.textS,border:"none",borderRadius:"8px",cursor:"pointer",fontFamily:FB,fontSize:"16.5px"}}>{lb}</button>
              ))}
            </div>
          )}
        </div>
        <div style={{position:"absolute",top:"20px",left:"20px",zIndex:9999}}>
          <button onClick={()=>setShowWifi(!showWifi)} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:"10px",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",color:C.textS,cursor:"pointer",boxShadow:C.shadow}} aria-label="WiFi">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12.5a11 11 0 0114 0"/><path d="M8.2 16a6.5 6.5 0 017.6 0"/><circle cx="12" cy="19.5" r="1.2" fill="currentColor" stroke="none"/></svg>
          </button>
          {showWifi&&(
            <div style={{position:"absolute",top:"40px",left:0,background:C.white,border:`1px solid ${C.border}`,borderRadius:"16px",padding:"16px 18px",minWidth:"190px",zIndex:9999,boxShadow:"0 8px 32px rgba(0,0,0,0.12)"}}>
              <div style={{fontSize:"13.5px",fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",color:C.goldD,marginBottom:"8px"}}>{t.wifiName}</div>
              <div style={{fontSize:"16.5px",color:C.textD,fontFamily:FB}}>Password: <span style={{fontWeight:"700"}}>{CFG.wifiPass}</span></div>
            </div>
          )}
        </div>
        <div style={{position:"absolute",top:"20px",left:"64px",zIndex:9999}}>
          <button onClick={()=>setShowLateOut(!showLateOut)} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:"10px",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",color:C.textS,cursor:"pointer",boxShadow:C.shadow}} aria-label="Late check-out">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
          </button>
          {showLateOut&&(
            <div style={{position:"absolute",top:"40px",left:0,background:C.white,border:`1px solid ${C.border}`,borderRadius:"16px",padding:"18px 20px",minWidth:"240px",zIndex:9999,boxShadow:"0 8px 32px rgba(0,0,0,0.12)"}}>
              <div style={{fontSize:"13.5px",fontWeight:"600",letterSpacing:"0.1em",textTransform:"uppercase",color:C.goldD,marginBottom:"8px"}}>
                {lang==="it"?"Check-out":lang==="de"?"Check-out":lang==="fr"?"Départ":lang==="ru"?"Выезд":"Check-out"}
              </div>
              <div style={{fontFamily:FD,fontWeight:"500",fontSize:"22px",color:C.blue,marginBottom:"10px"}}>{CFG.checkOut}</div>
              <div style={{fontSize:"15.5px",color:C.textD,fontFamily:FB,lineHeight:"1.6",marginBottom:"14px"}}>
                {lang==="it"?"Se desideri fermarti oltre quest'orario, va accordato con lo staff in anticipo.":lang==="de"?"Möchtest du länger bleiben, muss dies vorab mit dem Team vereinbart werden.":lang==="fr"?"Si vous souhaitez rester au-delà de cet horaire, cela doit être convenu à l'avance avec le personnel.":lang==="ru"?"Если вы хотите остаться дольше, это нужно заранее согласовать с персоналом.":"If you'd like to stay past this time, it needs to be arranged with staff in advance."}
              </div>
              <ContactButton phone="393510103842" lang={lang} trackLabel="WhatsApp late check-out" text={lang==="it"?"Buongiorno, vorrei richiedere il late check-out. Potete confermare la disponibilità? Grazie":lang==="de"?"Guten Tag, ich möchte einen späteren Check-out anfragen. Können Sie die Verfügbarkeit bestätigen? Danke":lang==="fr"?"Bonjour, je souhaiterais demander un départ tardif. Pouvez-vous confirmer la disponibilité ? Merci":lang==="ru"?"Здравствуйте, хотел(а) бы попросить поздний выезд. Можете подтвердить возможность? Спасибо":"Hello, I would like to request a late check-out. Could you confirm availability? Thank you"} renderTrigger={openModal=>(
                <button onClick={openModal} style={{display:"inline-flex",alignItems:"center",gap:"6px",color:C.gold,fontFamily:FB,fontSize:"15.5px",fontWeight:"600",background:"none",border:"none",cursor:"pointer",padding:0}}>💬 {t.lateOut} →</button>
              )}/>
            </div>
          )}
        </div>
        <div style={{position:"absolute",top:"20px",left:"108px",zIndex:9999}}>
          <HouseRulesPanel lang={lang} renderTrigger={openPanel=>(
            <button onClick={openPanel} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:"10px",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",color:C.textS,cursor:"pointer",boxShadow:C.shadow}} aria-label="Regole della struttura">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6M9 16h6M9 8h6"/><rect x="5" y="4" width="14" height="16" rx="2"/></svg>
            </button>
          )}/>
        </div>
        <div style={{position:"relative",zIndex:1}}>
          <img src="/logo-full.png" alt="Abaton Sacred Dreams" onClick={handleWordmarkTap} style={{width:"280px",maxWidth:"78%",height:"auto",display:"block",margin:"0 auto 14px",filter:"drop-shadow(0 4px 18px rgba(255,255,255,0.35))",cursor:"pointer"}}/>
          {/* Soglia divider */}
          <div style={{display:"flex",justifyContent:"center",gap:"2px",marginBottom:"8px"}}>
            {[1,2,3].map(i=><div key={i} style={{height:"1px",width:`${i===2?48:24}px`,background:`${C.gold}${i===2?"cc":"66"}`}}/>)}
          </div>
          <div style={{fontFamily:FD,fontSize:"25px",fontStyle:"italic",fontWeight:"700",color:"rgba(255,255,255,0.96)",textShadow:"0 2px 16px rgba(0,0,0,0.75)"}}>
            {date} · <WeatherWidget/>
          </div>
          {session?.name&&(
            <div style={{fontFamily:FD,fontSize:"24px",fontStyle:"italic",fontWeight:"700",color:C.gold,marginTop:"8px",textShadow:"0 2px 16px rgba(0,0,0,0.75)"}}>
              {lang==="it"?`Il tuo soggiorno, ${session.name}`:lang==="de"?`Dein Aufenthalt, ${session.name}`:lang==="fr"?`Votre séjour, ${session.name}`:lang==="ru"?`Ваше пребывание, ${session.name}`:`Your stay, ${session.name}`}
            </div>
          )}
        </div>
      </div>

      {/* CENTRAL GOLDEN CIRCLE — MAIN CTA */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 28px 40px",marginTop:"-110px",position:"relative",zIndex:2}}>
        <div style={{position:"relative",marginBottom:"12px"}}>
          {/* Outer ring decoration */}
          <div style={{width:"260px",height:"260px",borderRadius:"50%",border:`1px dashed ${C.gold}55`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{width:"230px",height:"230px",borderRadius:"50%",border:`1px solid ${C.gold}33`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Circle size={200} bg={SPHERE_BG} onClick={()=>setPage("experience")} style={{border:`3px solid ${C.gold}`,boxShadow:`0 0 0 4px ${C.gold}44, inset 0 14px 22px rgba(255,255,255,0.35), inset 0 -22px 30px rgba(0,0,0,0.3), 0 22px 36px rgba(80,58,20,0.55), 0 8px 14px rgba(80,58,20,0.35)`,overflow:"hidden"}}>
                <div style={{position:"absolute",top:"10%",left:"18%",width:"46%",height:"30%",borderRadius:"50%",background:"radial-gradient(ellipse, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)",pointerEvents:"none"}}/>
                <div style={{textAlign:"center",padding:"12px 14px",position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <div style={{fontSize:"18px",color:C.white,marginBottom:"6px",textShadow:SPHERE_TEXT_SHADOW}}>✦</div>
                  <div style={{fontFamily:FD,fontSize:"26px",color:C.white,fontWeight:"600",lineHeight:"1.25",whiteSpace:"pre-line",textShadow:SPHERE_TEXT_SHADOW}}>
                    {t.expBtn}
                  </div>
                  <div style={{fontSize:"18px",color:C.white,marginTop:"6px",textShadow:SPHERE_TEXT_SHADOW}}>✦</div>
                </div>
              </Circle>
            </div>
          </div>
          {/* Satellite dots */}
          {[0,1,2,3,4,5].map(i => {
            const angle = (i*60-90) * Math.PI/180;
            const r = 128;
            const x = 130 + r*Math.cos(angle);
            const y = 130 + r*Math.sin(angle);
            return <div key={i} style={{position:"absolute",left:`${x-4}px`,top:`${y-4}px`,width:"8px",height:"8px",borderRadius:"50%",background:i%2===0?C.gold:`${C.gold}44`}}/>;
          })}
        </div>
        <div style={{fontFamily:FD,fontSize:"30px",fontStyle:"italic",fontWeight:"600",color:C.goldD,textAlign:"center",lineHeight:"1.4",marginBottom:"6px",letterSpacing:"0.05em",textShadow:"0 1px 2px rgba(0,0,0,0.12)"}}>{t.tagline}</div>
        {/* Soglia divider */}
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px",margin:"10px 0 6px"}}>
          <div style={{height:"1px",width:"44px",background:`${C.gold}77`}}/>
          <Rosone src="/temple/rosone-acqua.jpg" size={30} spin={90} style={{boxShadow:`0 0 0 1.5px ${C.gold}`}}/>
          <div style={{height:"1px",width:"44px",background:`${C.gold}77`}}/>
        </div>
      </div>

      <div style={{padding:"0 22px"}}>
        {phase&&(
          <div style={{padding:"14px 18px",background:C.goldPale,borderRadius:"16px",marginBottom:"20px",fontSize:"15.5px",color:C.textD,lineHeight:"1.5"}}>
            {PHASE_MSG[phase][lang]||PHASE_MSG[phase].it}
          </div>
        )}

        {noticeFor(lang)&&(
          <div style={{background:C.goldPale,border:`1px solid ${C.gold}55`,borderRadius:"20px",padding:"16px 20px",marginBottom:"16px",boxShadow:C.shadow}}>
            <div style={{fontSize:"12.5px",fontWeight:"700",letterSpacing:"0.14em",textTransform:"uppercase",color:C.goldD,marginBottom:"6px"}}>✦ Abaton</div>
            <div style={{fontSize:"16px",color:C.textD,lineHeight:"1.7",whiteSpace:"pre-line"}}>{noticeFor(lang)}</div>
          </div>
        )}
        <DailyQuote lang={lang}/>
        <MoodSuggest lang={lang}/>

        {/* CENTRAL: TEMPLE OF THE PEOPLES EXPERIENCE */}
        <div style={{position:"relative",marginBottom:"28px",borderRadius:"28px",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"url(/temple/popoli.jpg)",backgroundSize:"cover",backgroundPosition:"center 40%",opacity:0.5}}/>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at center, transparent 0%, transparent 18%, ${C.bg} 70%)`}}/>
          <PopoliExperienceButton t={t} lang={lang} style={{position:"relative",padding:"24px 0 8px"}}/>
        </div>

        {/* BUBBLE NAVIGATION */}
        <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap",marginBottom:"36px"}}>
          {[
            {id:"shop",      label:(lang==="it"||!lang?"I tuoi privilegi":lang==="de"?"Deine Vorteile":lang==="fr"?"Vos privilèges":lang==="ru"?"Ваши привилегии":"Your privileges"), sym:"✧", special:true},
            {id:"abaton",    label:"Abaton",      sym:"✦", bg:C.cream,    fg:C.blue},
            {id:"damanhur",  label:"Damanhur",                         sym:"◎", bg:C.goldPale, fg:C.goldD},
            {id:"wellness",  label:lang==="it"?"Benessere":lang==="de"?"Wellness":lang==="fr"?"Bien-être":lang==="ru"?"Велнес":"Wellness", sym:"◈", bg:"#EFF4ED",  fg:"#5A7A58"},
          ].map(item=>(
            <button key={item.id} onClick={()=>setPage(item.id)} style={item.special?{position:"relative",padding:"13px 20px",background:`linear-gradient(135deg,${C.gold},${C.goldD})`,border:"none",borderRadius:"30px",cursor:"pointer",fontFamily:FB,fontSize:"15.5px",fontWeight:"600",letterSpacing:"0.04em",color:C.white,display:"flex",alignItems:"center",gap:"7px",boxShadow:`0 4px 18px ${C.gold}66`}:{padding:"13px 18px",background:item.bg,border:`1px solid ${C.border}`,borderRadius:"30px",cursor:"pointer",fontFamily:FB,fontSize:"15.5px",fontWeight:"400",letterSpacing:"0.04em",color:item.fg,display:"flex",alignItems:"center",gap:"7px",boxShadow:C.shadow}}>
              {item.special&&<span style={{position:"absolute",top:"-3px",right:"-3px",width:"10px",height:"10px",borderRadius:"50%",background:"#fff",animation:"abatonPulse 1.4s ease-in-out infinite alternate"}}/>}
              <span style={{fontSize:"17.5px"}}>{item.sym}</span>{item.label}
            </button>
          ))}
        </div>

        {/* CONCIERGE + WHATSAPP */}
        <div style={{display:"flex",gap:"12px",marginBottom:"40px"}}>
          <button onClick={()=>setPage("concierge")} style={{flex:1,padding:"16px 20px",background:C.white,borderRadius:"20px",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:"12px",boxShadow:C.shadow,textAlign:"left"}}>
            <SphereIcon size={40}>
              <svg viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="2" width="18" height="18"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            </SphereIcon>
            <div>
              <div style={{fontFamily:FD,fontSize:"26px",fontWeight:"600",color:C.blue,marginBottom:"2px",lineHeight:"1.2"}}>{lang==="it"?"Hai domande sul soggiorno?":lang==="de"?"Fragen zu deinem Aufenthalt?":lang==="fr"?"Des questions sur votre séjour ?":lang==="ru"?"Есть вопросы о пребывании?":"Questions about your stay?"}</div>
              <div style={{fontSize:"14.5px",color:C.textM}}>AI Concierge · 24h</div>
            </div>
          </button>
          <ContactButton phone="393510103842" lang={lang} trackLabel="WhatsApp staff (home)" text={lang==="it"?"Buongiorno, vi scrivo dall'app Abaton.":lang==="de"?"Guten Tag, ich schreibe Ihnen aus der Abaton-App.":lang==="fr"?"Bonjour, je vous écris depuis l'application Abaton.":lang==="ru"?"Здравствуйте, пишу вам из приложения Abaton.":"Hello, I'm messaging you from the Abaton app."} renderTrigger={openModal=>(
            <button onClick={openModal} style={{padding:"16px 14px",background:C.white,borderRadius:"20px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",border:"none",cursor:"pointer",boxShadow:C.shadow,flexShrink:0,gap:"4px"}}>
              <svg viewBox="0 0 24 24" width="24" height="24"><path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/><path fill="#25D366" fillOpacity=".25" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/><path fill="#25D366" d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.101-1.135l-.294-.175-3.048.906.906-3.048-.175-.294A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>
              <div style={{fontSize:"12.5px",color:"#25D366",fontFamily:FB,letterSpacing:"0.06em",textAlign:"center",lineHeight:"1.3",fontWeight:"500"}}>{lang==="it"?"Contatta il":lang==="de"?"Kontaktiere":lang==="fr"?"Contacter":lang==="ru"?"Связаться":"Contact"}<br/>{lang==="it"?"personale":lang==="de"?"das Personal":lang==="fr"?"le personnel":lang==="ru"?"с персоналом":"the team"}</div>
            </button>
          )}/>
        </div>

        {/* EVENTS */}
        <Section title={t.eventsTitle}>
          {EVENTS.map((ev,i)=>(
            <ExtLink key={i} href={ev.url} lang={lang} style={{display:"flex",alignItems:"center",gap:"16px",padding:"16px 0",borderBottom:i<EVENTS.length-1?`1px solid ${C.border}`:"none",textDecoration:"none"}}>
              <div style={{textAlign:"center",minWidth:"52px"}}>
                <div style={{fontSize:"16.5px",color:C.textM,fontFamily:FB,textTransform:"uppercase",letterSpacing:"0.08em"}}>{((lang==="it"?ev.date:ev.dateEN||ev.date)||"").split(" ")[0]}</div>
                <div style={{fontFamily:FD,fontSize:"26px",color:C.gold,lineHeight:"1"}}>{((lang==="it"?ev.date:ev.dateEN||ev.date)||"").split(" ").slice(1).join(" ")||ev.date||""}</div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"18px",color:C.blue,marginBottom:"3px",fontWeight:"400"}}>{lang==="it"?ev.title:ev.titleEN||ev.title}</div>
                <div style={{fontSize:"15.5px",color:C.gold,marginBottom:"3px"}}>{lang==="it"?ev.time:ev.timeEN||ev.time} · {(lang==="it"?ev.loc:ev.locEN||ev.loc)||ev.place||""}</div>
                <div style={{fontSize:"15.5px",color:C.textM,lineHeight:"1.5"}}>{lang==="it"?ev.desc:ev.descEN}</div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" width="16" height="16"><polyline points="9,18 15,12 9,6"/></svg>
            </ExtLink>
          ))}
          <div style={{paddingTop:"16px",display:"flex",flexDirection:"column",gap:"12px"}}>
            <div style={{padding:"14px 16px",background:C.goldPale,borderRadius:"14px"}}>
              <div style={{fontSize:"16.5px",color:C.goldD,fontFamily:FB,fontWeight:"500",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:"6px"}}>{lang==="it"?"Per prenotarsi agli eventi":lang==="de"?"Für die Anmeldung zu Veranstaltungen":lang==="fr"?"Pour réserver aux événements":lang==="ru"?"Для записи на мероприятия":"To book events"}</div>
              <div style={{fontSize:"17.5px",color:C.textS,lineHeight:"1.6",marginBottom:"8px"}}>{lang==="it"?"Contattare il Welcome Center di Damanhur:":lang==="de"?"Kontaktiere das Welcome Center von Damanhur:":lang==="fr"?"Contacter le Welcome Center de Damanhur :":lang==="ru"?"Свяжитесь с Welcome Center Даманхура:":"Contact Damanhur's Welcome Center:"}</div>
              <a href="tel:+393204824427" style={{fontFamily:FD,fontWeight:"500",fontSize:"20px",color:C.goldD,textDecoration:"none",display:"block"}}>{t.eventsPhone}</a>
              <a href="mailto:welcome@dhwelcome.org" style={{fontFamily:FB,fontSize:"17.5px",color:C.goldD,textDecoration:"none",display:"block",marginTop:"4px"}}>welcome@dhwelcome.org</a>
            </div>
            <ExtLink href="https://damanhur.community/events/" lang={lang} style={{color:C.gold,fontFamily:FB,fontSize:"17.5px",letterSpacing:"0.1em",textDecoration:"none",textAlign:"center"}}>{t.eventsFull}</ExtLink>
          </div>
        </Section>

        <div style={{borderRadius:"24px",overflow:"hidden",boxShadow:C.shadow,position:"relative",marginBottom:"24px"}}>
          <img src="/damanhur/il-popolo.jpg" alt="Il Popolo di Damanhur" style={{width:"100%",height:"220px",objectFit:"cover",display:"block"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(20,34,61,0.78), transparent 55%)"}}/>
          <div style={{position:"absolute",bottom:"18px",left:"20px",right:"20px",color:C.white,fontFamily:FD,fontWeight:"500",fontSize:"21px",textShadow:"0 2px 10px rgba(0,0,0,0.4)"}}>
            {lang==="it"?"Il Popolo di Damanhur":lang==="de"?"Das Volk von Damanhur":lang==="fr"?"Le Peuple de Damanhur":lang==="ru"?"Народ Даманхура":"The People of Damanhur"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EXPERIENCE ────────────────────────────────────────────────────────────────
function ExperiencePage({t,lang,setPage}) {
  const [checked,setChecked] = useState({});
  return (
    <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
      <div style={{position:"sticky",top:0,zIndex:50,padding:"32px 28px 24px",background:C.white,borderRadius:"0 0 32px 32px",boxShadow:C.shadow,marginBottom:"8px",overflow:"hidden"}}><HeaderRosone/>
        <Back label={t.back} onClick={()=>setPage("home")}/>
        <div style={{marginTop:"16px"}}>
          <Pill>{lang==="it"?"Esperienza":lang==="de"?"Erlebnis":lang==="fr"?"Expérience":lang==="ru"?"Опыт":"Experience"}</Pill>
          <div style={{fontFamily:FD,fontSize:"36px",fontWeight:"300",color:C.blue,marginTop:"10px",lineHeight:"1.1"}}>{t.expBtn.replace("\n"," ")}</div>
        </div>
      </div>

      <div style={{padding:"24px 22px 0"}}>
        {/* WHITE NOISE — primary element */}
        <div style={{marginBottom:"24px"}}>
          <BreathingPlayer t={t}/>
        </div>

        {/* SELFICA */}
        <WhiteCard style={{marginBottom:"24px",background:`linear-gradient(135deg,${C.goldPale},${C.white})`}}>
          <Pill color={C.goldD}>{lang==="it"?"La Selfica dei Sogni":lang==="de"?"Die Traum-Selfica":lang==="fr"?"La Selfica des Rêves":lang==="ru"?"Селфика Снов":"Dream Selfica"}</Pill>
          <div style={{fontFamily:FD,fontSize:"24px",color:C.blue,marginTop:"12px",marginBottom:"12px"}}>{lang==="it"?"La Tecnologia del Sogno":lang==="de"?"Die Technologie des Traums":lang==="fr"?"La Technologie du Rêve":lang==="ru"?"Технология сна":"The Technology of Dreams"}</div>
          <div style={{fontSize:"16.5px",color:C.textS,lineHeight:"1.8",fontWeight:"400",whiteSpace:"pre-line"}}>
            {lang==="it"
              ?"La Selfica dei Sogni si trova sopra l'armadio, orientata verso il letto — da dove lavora in silenzio per tutta la notte. È uno strumento energetico forgiato a mano dagli artigiani di Damanhur: spirali metalliche che creano un campo semi-autonomo, progettato per:\n\n• Ampliare e rendere più vivido il sogno\n• Favorire il ricordo al risveglio\n• Creare un campo di protezione durante il sonno\n\nNon va toccata. Il modo di relazionarsi con lei è attraverso il pensiero o la parola: prima di dormire, guardala da dove sei, osservane le spirali. Rivolgile un'intenzione, una domanda, un saluto. Lei riceve."
              :lang==="de"
              ?"Die Traum-Selfica befindet sich über dem Kleiderschrank, zum Bett ausgerichtet — von dort aus arbeitet sie die ganze Nacht in Stille. Sie ist ein von den Handwerkern Damanhurs handgeschmiedetes energetisches Instrument: Metallspiralen, die ein halbautonomes Feld erzeugen, entwickelt, um:\n\n• den Traum zu erweitern und lebendiger zu machen\n• die Erinnerung beim Aufwachen zu fördern\n• ein Schutzfeld während des Schlafs zu schaffen\n\nSie darf nicht berührt werden. Die Art, mit ihr in Beziehung zu treten, ist durch Gedanken oder Worte: Betrachte sie vor dem Schlafen von deinem Platz aus, beobachte ihre Spiralen. Richte eine Absicht, eine Frage, einen Gruß an sie. Sie empfängt."
              :lang==="fr"
              ?"La Selfica des Rêves se trouve au-dessus de l'armoire, orientée vers le lit — d'où elle travaille en silence toute la nuit. C'est un instrument énergétique forgé à la main par les artisans de Damanhur : des spirales métalliques créant un champ semi-autonome, conçu pour :\n\n• Amplifier et rendre le rêve plus vivide\n• Favoriser le souvenir au réveil\n• Créer un champ de protection pendant le sommeil\n\nElle ne doit pas être touchée. La façon de se relier à elle est par la pensée ou la parole : avant de dormir, regarde-la depuis où tu es, observe ses spirales. Adresse-lui une intention, une question, un salut. Elle reçoit."
              :lang==="ru"
              ?"Селфика Снов находится над шкафом, направленная к кровати — оттуда она тихо работает всю ночь. Это энергетический инструмент, выкованный вручную мастерами Даманхура: металлические спирали, создающие полуавтономное поле, предназначенное для того, чтобы:\n\n• расширять сон и делать его более ярким\n• способствовать запоминанию снов при пробуждении\n• создавать защитное поле во время сна\n\nЕё нельзя трогать. Способ взаимодействия с ней — через мысль или слово: перед сном посмотри на неё оттуда, где ты находишься, понаблюдай за спиралями. Обратись к ней с намерением, вопросом, приветствием. Она принимает."
              :"The Dream Selfica rests above the wardrobe, directed toward the bed — from where it works silently through the night. It is an energy tool hand-forged by Damanhur artisans: metal spirals creating a semi-autonomous field, designed to:\n\n• Expand and make the dream world more vivid\n• Facilitate dream recall upon waking\n• Create a protective field during sleep\n\nDo not touch it. Relate to it through thought or spoken word: before sleeping, look at it from where you are, observe its spirals. Bring it an intention, a question, a greeting. It receives."}
          </div>
          <ExtLink href="https://shop.selfica.space/pages/what-is-selfica" lang={lang} style={{display:"inline-block",marginTop:"14px",color:C.goldD,fontFamily:FB,fontSize:"15.5px",letterSpacing:"0.08em",textDecoration:"none"}}>
            {lang==="it"?"Scopri di più sulla Selfica, una tecnologia nata a Damanhur →":lang==="de"?"Mehr über Selfica erfahren, eine in Damanhur entwickelte Technologie →":lang==="fr"?"En savoir plus sur la Selfica, une technologie née à Damanhur →":lang==="ru"?"Узнать больше о Селфике, технологии, созданной в Даманхуре →":"Learn more about Selfica, a technology born in Damanhur →"}
          </ExtLink>
        </WhiteCard>

        {/* NIGHT RITUAL CHECKLIST */}
        <Section title={t.ritualTitle}>
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {t.ritualSteps.map(s=>(
              <button key={s.id} onClick={()=>setChecked(p=>({...p,[s.id]:!p[s.id]}))}
                style={{width:"100%",padding:"16px 20px",background:checked[s.id]?C.cream:C.white,borderRadius:"16px",cursor:"pointer",display:"flex",alignItems:"center",gap:"14px",textAlign:"left",fontFamily:FB,border:`1px solid ${checked[s.id]?C.gold+"44":C.border}`,boxShadow:checked[s.id]?"none":C.shadow}}>
                <div style={{width:"24px",height:"24px",borderRadius:"50%",flexShrink:0,border:`1.5px solid ${checked[s.id]?C.gold:C.border}`,background:checked[s.id]?C.gold:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
                  {checked[s.id]&&<svg viewBox="0 0 12 12" fill="none" stroke={C.white} strokeWidth="2.5" width="10" height="10"><polyline points="2,6 5,9 10,3"/></svg>}
                </div>
                <span style={{fontSize:"17.5px",color:checked[s.id]?C.textM:C.blue,textDecoration:checked[s.id]?"line-through":"none",fontWeight:"400"}}>{s.text}</span>
              </button>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

// ── ABATON (replaces Stanze) ──────────────────────────────────────────────────
// ── ROOM ITEM LIBRARY (testi condivisi tra le stanze, da materiale fornito da Denise) ──
const LANGSUF = {it:"IT",en:"EN",de:"DE",fr:"FR",ru:"RU"};
const LS = (obj, base, lang) => (obj[base+(LANGSUF[lang]||"IT")] || obj[base+"IT"]);
const LD = (v, lang) => (typeof v==="string" ? v : (v[lang]||v.it));
const gmaps = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const scrollTop0 = () => { const el=document.getElementById("scrollRoot"); if(el) el.scrollTop=0; };
const track = (type, label, extra={}) => {
  try {
    const room = getRoom();
    fetch("/api/track", {method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({type, label, room: room||undefined, ...extra})}).catch(()=>{});
  } catch(e) {}
};
// ── DAY OF STAY ────────────────────────────────────────────────────────────────
function stayPhase(session) {
  if(!session?.checkIn||!session?.checkOut) return null;
  const today = new Date(); today.setHours(0,0,0,0);
  const ci = new Date(session.checkIn); ci.setHours(0,0,0,0);
  const co = new Date(session.checkOut); co.setHours(0,0,0,0);
  if(isNaN(ci)||isNaN(co)) return null;
  if(today<=ci) return "arrival";
  if(today>=co) return "departure";
  return "middle";
}

// ── DAILY QUOTE — citazioni verificate; il team può ampliare l'elenco ─────────
const QUOTES = [
  {author:"Falco Tarassaco",it:"La vita è una bella avventura.",en:"Life is a beautiful adventure.",de:"Das Leben ist ein wunderschönes Abenteuer.",fr:"La vie est une belle aventure.",ru:"Жизнь — это прекрасное приключение."},
  {author:"Rumi",it:"Non sei una goccia nell'oceano, sei l'intero oceano in una goccia.",en:"You are not a drop in the ocean, you are the entire ocean in a drop.",de:"Du bist kein Tropfen im Ozean, du bist der ganze Ozean in einem Tropfen.",fr:"Tu n'es pas une goutte dans l'océan, tu es l'océan entier dans une goutte.",ru:"Ты не капля в океане, ты — весь океан в капле."},
  {author:"Thich Nhat Hanh",it:"Il momento presente è l'unico momento a nostra disposizione: è la porta verso tutti gli altri momenti.",en:"The present moment is the only moment available to us, and it is the door to all moments.",de:"Der gegenwärtige Moment ist der einzige, der uns zur Verfügung steht, und er ist die Tür zu allen Momenten.",fr:"Le moment présent est le seul dont nous disposions, et c'est la porte vers tous les moments.",ru:"Настоящий момент — единственный доступный нам момент, и это дверь ко всем моментам."},
  {author:"Hermann Hesse",it:"Dentro di te c'è una quiete e un rifugio in cui puoi ritirarti in ogni momento ed essere te stesso.",en:"Within you there is a stillness and sanctuary to which you can retreat at any time and be yourself.",de:"In dir ist eine Stille und ein Zufluchtsort, zu dem du dich jederzeit zurückziehen und du selbst sein kannst.",fr:"En toi se trouve un calme et un sanctuaire où tu peux te retirer à tout moment pour être toi-même.",ru:"Внутри тебя есть тишина и убежище, куда ты можешь удалиться в любой момент, чтобы быть собой."},
];
// Frasi autentiche da "Il Sincronico" di O. Airaudi (Falco Tarassaco), pubblicate su damanhurblog.com
const SYNC_PHRASES = [
  {it:"Sei aiutato. Più di quanto vedi, più di quanto credi.",en:"You are helped. More than you see, more than you believe.",de:"Dir wird geholfen. Mehr, als du siehst, mehr, als du glaubst.",fr:"Tu es aidé. Plus que tu ne le vois, plus que tu ne le crois.",ru:"Тебе помогают. Больше, чем ты видишь, больше, чем ты веришь."},
  {it:"Armonia. Lasciarsi vivere. Fortuna.",en:"Harmony. Letting yourself live. Fortune.",de:"Harmonie. Sich leben lassen. Glück.",fr:"Harmonie. Se laisser vivre. Fortune.",ru:"Гармония. Позволить себе жить. Удача."},
  {it:"Nuovi incontri si fanno anche tra vecchie conoscenze. Basta considerare la persona da un nuovo stato di coscienza.",en:"New encounters can happen even among old acquaintances. It's enough to see the person from a new state of consciousness.",de:"Neue Begegnungen entstehen auch unter alten Bekannten. Es genügt, die Person aus einem neuen Bewusstseinszustand zu betrachten.",fr:"De nouvelles rencontres se font aussi entre vieilles connaissances. Il suffit de considérer la personne depuis un nouvel état de conscience.",ru:"Новые встречи случаются даже со старыми знакомыми. Достаточно увидеть человека из нового состояния сознания."},
  {it:"Cambiamento. Per mutare occorre volere. Alchimia.",en:"Change. To transform, one must will it. Alchemy.",de:"Wandel. Um sich zu verändern, braucht es Willen. Alchemie.",fr:"Changement. Pour changer, il faut le vouloir. Alchimie.",ru:"Перемена. Чтобы измениться, нужна воля. Алхимия."},
  {it:"L'acqua, oggi, è in sintonia con te.",en:"Water, today, is in tune with you.",de:"Das Wasser ist heute im Einklang mit dir.",fr:"L'eau, aujourd'hui, est en harmonie avec toi.",ru:"Вода сегодня созвучна тебе."},
  {it:"Quanto il tempo ti concede, sprechi: adesso respira e cambia.",en:"What time grants you, you waste: now breathe and change.",de:"Was dir die Zeit gewährt, vergeudest du: atme jetzt und verändere dich.",fr:"Ce que le temps t'accorde, tu le gaspilles : maintenant respire et change.",ru:"То, что дарит тебе время, ты растрачиваешь: сейчас вдохни и измени себя."},
  {it:"Ogni gesto è un rito importante.",en:"Every gesture is an important ritual.",de:"Jede Geste ist ein wichtiges Ritual.",fr:"Chaque geste est un rituel important.",ru:"Каждый жест — важный ритуал."},
  {it:"Fatti portare dalle onde della tua vita in un porto sicuro.",en:"Let the waves of your life carry you to a safe harbor.",de:"Lass dich von den Wellen deines Lebens in einen sicheren Hafen tragen.",fr:"Laisse-toi porter par les vagues de ta vie vers un port sûr.",ru:"Позволь волнам своей жизни принести тебя в надёжную гавань."},
];
function DailyQuote({lang}) {
  const dayNum = Math.floor(Date.now()/86400000);
  const q = QUOTES[dayNum % QUOTES.length];
  const sync = SYNC_PHRASES[dayNum % SYNC_PHRASES.length];
  return (
    <WhiteCard style={{marginBottom:"24px",background:C.blue,border:"none"}}>
      <div style={{fontSize:"13.5px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:C.gold,marginBottom:"12px"}}>
        {lang==="it"?"Un pensiero per oggi":lang==="de"?"Ein Gedanke für heute":lang==="fr"?"Une pensée pour aujourd'hui":lang==="ru"?"Мысль на сегодня":"A thought for today"}
      </div>
      <div style={{fontFamily:FD,fontWeight:"500",fontSize:"19px",fontStyle:"italic",color:C.white,lineHeight:"1.5",marginBottom:"8px"}}>
        "{q[lang]||q.it}"
      </div>
      <div style={{fontSize:"14.5px",color:"#C9D3E5"}}>— {q.author}</div>
      <div style={{marginTop:"18px",paddingTop:"18px",borderTop:"1px solid rgba(255,255,255,0.15)"}}>
        <div style={{fontSize:"12.5px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:C.gold,marginBottom:"8px"}}>
          {lang==="it"?"Frase sincronica":lang==="de"?"Synchronischer Satz":lang==="fr"?"Phrase synchronique":lang==="ru"?"Синхронная фраза":"Synchronic phrase"}
        </div>
        <div style={{fontSize:"15.5px",color:C.white,lineHeight:"1.5",marginBottom:"6px"}}>{sync[lang]||sync.it}</div>
        <div style={{fontSize:"12.5px",color:"#C9D3E5"}}>— "Il Sincronico", O. Airaudi (Falco Tarassaco)</div>
      </div>
    </WhiteCard>
  );
}

// ── MOOD SUGGEST — "di cosa hai voglia oggi?" ──────────────────────────────────
const MOOD_OPTIONS = [
  {id:"natura",sym:"🌿",it:"Energia e Natura",en:"Energy & Nature",de:"Energie & Natur",fr:"Énergie et Nature",ru:"Энергия и природа"},
  {id:"quiete",sym:"🧘",it:"Quiete e Silenzio",en:"Stillness & Silence",de:"Stille",fr:"Calme et Silence",ru:"Тишина и покой"},
  {id:"connessione",sym:"✦",it:"Benessere personale",en:"Personal wellbeing",de:"Persönliches Wohlbefinden",fr:"Bien-être personnel",ru:"Личное благополучие"},
  {id:"creativita",sym:"◈",it:"Creatività",en:"Creativity",de:"Kreativität",fr:"Créativité",ru:"Творчество"},
  {id:"gusto",sym:"☀",it:"Sapori",en:"Flavors",de:"Genuss",fr:"Saveurs",ru:"Вкусы"},
];
const MOOD_SUGGESTIONS = {
  natura: [
    {it:"Una visita al Bosco Sacro",en:"A visit to the Sacred Forest",de:"Ein Besuch im Heiligen Wald",fr:"Une visite dans la Forêt Sacrée",ru:"Посещение Священного леса",descIT:"Il territorio naturale custodito dalla comunità di Etulte, intorno ai Templi.",descEN:"The natural territory watched over by the Etulte community, around the Temples.",descDE:"Das natürliche Gebiet, das von der Gemeinschaft Etulte rund um die Tempel gehütet wird.",descFR:"Le territoire naturel gardé par la communauté d'Etulte, autour des Temples.",descRU:"Природная территория, которую хранит сообщество Этульте вокруг Храмов."},
    {it:"I circuiti in pietra di Damjl",en:"The stone circuits of Damjl",de:"Die Steinkreise von Damjl",fr:"Les circuits en pierre de Damjl",ru:"Каменные контуры Дамжл",descIT:"Percorsi energetici a cielo aperto, liberamente percorribili nel cuore di Damjl.",descEN:"Open-air energy paths, freely walkable in the heart of Damjl.",descDE:"Energiepfade unter freiem Himmel, frei begehbar im Herzen von Damjl.",descFR:"Parcours énergétiques en plein air, librement praticables au cœur de Damjl.",descRU:"Энергетические маршруты под открытым небом, свободно доступные в центре Дамжл."},
  ],
  quiete: [
    {it:"Meditazione nel Tempo dei Popoli",en:"Meditation in the Time of the Peoples",de:"Meditation in der Zeit der Völker",fr:"Méditation dans le Temps des Peuples",ru:"Медитация во Времени Народов",descIT:"Un momento di silenzio guidato in una delle sale più riservate dei Templi.",descEN:"A guided moment of silence in one of the Temples' most private halls.",descDE:"Ein geführter Moment der Stille in einem der privatesten Säle der Tempel.",descFR:"Un moment de silence guidé dans l'une des salles les plus privées des Temples.",descRU:"Момент управляемой тишины в одном из самых уединённых залов Храмов."},
    {it:"Rumore bianco e respirazione guidata",en:"White noise & guided breathing",de:"Weißes Rauschen & geführte Atmung",fr:"Bruit blanc et respiration guidée",ru:"Белый шум и управляемое дыхание",descIT:"Direttamente dal tablet in camera, quando vuoi.",descEN:"Right from the tablet in your room, whenever you like.",descDE:"Direkt vom Tablet in deinem Zimmer, wann immer du möchtest.",descFR:"Directement depuis la tablette de votre chambre, quand vous le souhaitez.",descRU:"Прямо с планшета в номере, когда захотите."},
  ],
  connessione: [
    {it:"Un'esperienza nel Tempo dei Popoli",en:"An experience in the Time of the Peoples",de:"Ein Erlebnis in der Zeit der Völker",fr:"Une expérience dans le Temps des Peuples",ru:"Опыт во Времени Народов",descIT:"Una sala speciale dei Templi, su richiesta.",descEN:"A special hall of the Temples, on request.",descDE:"Ein besonderer Saal der Tempel, auf Anfrage.",descFR:"Une salle spéciale des Temples, sur demande.",descRU:"Особый зал Храмов, по запросу."},
    {it:"Un trattamento Selfico con SelEt, Elasel o Kythera",en:"A Selfic treatment with SelEt, Elasel or Kythera",de:"Eine selfische Behandlung mit SelEt, Elasel oder Kythera",fr:"Un soin Selfique avec SelEt, Elasel ou Kythera",ru:"Селфическая процедура у SelEt, Elasel или Kythera",descIT:"Tre modi diversi di lavorare con l'energia Selfica.",descEN:"Three different ways of working with Selfic energy.",descDE:"Drei verschiedene Wege, mit selfischer Energie zu arbeiten.",descFR:"Trois façons différentes de travailler avec l'énergie Selfique.",descRU:"Три разных способа работы с селфической энергией."},
  ],
  creativita: [
    {it:"Gli atelier di DamanhurCrea",en:"The DamanhurCrea ateliers",de:"Die Ateliers von DamanhurCrea",fr:"Les ateliers de DamanhurCrea",ru:"Мастерские DamanhurCrea",descIT:"Pietre levigate, gioielli selfici, la musica delle piante.",descEN:"Polished stones, Selfic jewellery, the music of plants.",descDE:"Polierte Steine, selfischer Schmuck, die Musik der Pflanzen.",descFR:"Pierres polies, bijoux selfiques, la musique des plantes.",descRU:"Отшлифованные камни, селфические украшения, музыка растений."},
    {it:"La Galleria dei Quadri Selfici",en:"The Selfic Paintings Gallery",de:"Die Galerie der selfischen Gemälde",fr:"La Galerie des Tableaux Selfiques",ru:"Галерея селфических картин",descIT:"Opere d'arte che sono anche strumenti energetici.",descEN:"Artworks that are also energetic tools.",descDE:"Kunstwerke, die zugleich energetische Instrumente sind.",descFR:"Œuvres d'art qui sont aussi des instruments énergétiques.",descRU:"Произведения искусства, являющиеся также энергетическими инструментами."},
  ],
  gusto: [
    {it:"Cena in uno dei ristoranti della Val Chiusella",en:"Dinner at one of the Val Chiusella restaurants",de:"Abendessen in einem Restaurant im Val Chiusella",fr:"Dîner dans l'un des restaurants de la Val Chiusella",ru:"Ужин в одном из ресторанов Валь-Кьюзеллы",descIT:"Trovi l'elenco completo nella sezione Damanhur.",descEN:"Find the full list in the Damanhur section.",descDE:"Die vollständige Liste findest du im Bereich Damanhur.",descFR:"Retrouvez la liste complète dans la section Damanhur.",descRU:"Полный список — в разделе Damanhur."},
    {it:"Un pranzo al Somachandra o all'Arielvo",en:"Lunch at Somachandra or Arielvo",de:"Mittagessen im Somachandra oder Arielvo",fr:"Déjeuner au Somachandra ou à l'Arielvo",ru:"Обед в Somachandra или Arielvo",descIT:"Le tavole calde damanhuriane, cucina semplice e autentica.",descEN:"Damanhur's own canteens, simple and authentic food.",descDE:"Die damanhurianischen Kantinen, einfache und authentische Küche.",descFR:"Les cantines damanhuriennes, cuisine simple et authentique.",descRU:"Дамантурские столовые, простая и настоящая кухня."},
  ],
};
function MoodSuggest({lang}) {
  const [mood,setMood] = useState(null);
  return (
    <WhiteCard style={{marginBottom:"28px"}}>
      <div style={{fontSize:"13.5px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:C.goldD,marginBottom:"12px"}}>
        {lang==="it"?"Di cosa hai voglia oggi?":lang==="de"?"Worauf hast du heute Lust?":lang==="fr"?"De quoi avez-vous envie aujourd'hui ?":lang==="ru"?"Чего вам хочется сегодня?":"What are you in the mood for today?"}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:mood?"18px":0}}>
        {MOOD_OPTIONS.map(m=>(
          <button key={m.id} onClick={()=>setMood(mood===m.id?null:m.id)} style={{padding:"9px 14px",borderRadius:"20px",border:`1px solid ${mood===m.id?C.gold:C.border}`,background:mood===m.id?C.gold:"none",color:mood===m.id?C.white:C.textM,fontFamily:FB,fontSize:"14.5px",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"}}>
            <span>{m.sym}</span>{m[lang]||m.it}
          </button>
        ))}
      </div>
      {mood&&(
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          {MOOD_SUGGESTIONS[mood].map((s,i)=>(
            <div key={i} style={{padding:"14px 16px",background:C.bg,borderRadius:"16px"}}>
              <div style={{fontFamily:FD,fontWeight:"500",fontSize:"17.5px",color:C.blue,marginBottom:"3px"}}>{s[lang]||s.it}</div>
              <div style={{fontSize:"14.5px",color:C.textM,marginBottom:"10px",lineHeight:"1.4"}}>{s["desc"+lang.toUpperCase()]||s.descIT}</div>
              <QuickAsk item={s[lang]||s.it} lang={lang} trackLabel="Mood suggestion request" style={{padding:"8px 16px",background:C.white,border:`1px solid ${C.gold}66`,borderRadius:"20px",color:C.goldD,fontFamily:FB,fontSize:"14.5px",cursor:"pointer"}}>
                {lang==="it"?"Mi interessa →":lang==="de"?"Interessiert mich →":lang==="fr"?"Ça m'intéresse →":lang==="ru"?"Интересно →":"I'm interested →"}
              </QuickAsk>
            </div>
          ))}
        </div>
      )}
    </WhiteCard>
  );
}

const RI = {
  lampada: {labelIT:"Lampada",labelEN:"Lamp",labelDE:"Lampe",labelFR:"Lampe",labelRU:"Лампа",descIT:"Decorata a mano dai nostri artisti, in armonia con il tema della stanza.",descEN:"Hand-decorated by our artists, in harmony with the room's theme.",descDE:"Handdekoriert von unseren Künstlern, im Einklang mit dem Thema des Zimmers.",descFR:"Décorée à la main par nos artistes, en harmonie avec le thème de la chambre.",descRU:"Декорирована вручную нашими художниками, в гармонии с темой комнаты."},
  bottiglia: {labelIT:"Bottiglia Selfica",labelEN:"Selfic Bottle",labelDE:"Selfische Flasche",labelFR:"Bouteille Selfique",labelRU:"Селфическая бутылка",descIT:"Preparata da SelEt: attivata a Damanhur in strutture selfiche dedicate, dove circuiti energetici sintonizzano l'acqua come portatrice di coerenza e vitalità. Riempila con l'acqua filtrata della living room, attendi almeno 10 minuti e bevi con presenza.",descEN:"Prepared by SelEt: activated at Damanhur in dedicated selfic structures, where energy circuits tune the water as a carrier of coherence and vitality. Fill it with the filtered water from the living room, wait at least 10 minutes, and drink with presence.",descDE:"Hergestellt von SelEt: Jede Flasche wird in Damanhur in eigens dafür vorgesehenen selfischen Strukturen aktiviert, wo Energiekreisläufe das Wasser als Träger von Kohärenz und Vitalität abstimmen. Fülle sie mit dem gefilterten Wasser aus dem Wohnbereich, warte mindestens 10 Minuten und trinke bewusst.",descFR:"Préparée par SelEt : chaque bouteille est activée à Damanhur dans des structures selfiques dédiées, où des circuits énergétiques accordent l'eau comme porteuse de cohérence et de vitalité. Remplis-la avec l'eau filtrée du salon, attends au moins 10 minutes et bois en pleine conscience.",descRU:"Подготовлена SelEt: каждая бутылка активируется в Дамантуре в специальных селфических структурах, где энергетические контуры настраивают воду как носителя согласованности и жизненной силы. Наполни её отфильтрованной водой из гостиной, подожди минимум 10 минут и пей осознанно."},
  comodino: {labelIT:"Comodino",labelEN:"Nightstand",labelDE:"Nachttisch",labelFR:"Table de chevet",labelRU:"Тумбочка",descIT:"Creato dai nostri artigiani per questo spazio speciale. Suggeriamo di tenervi un quaderno per annotare sogni e percezioni, prima che svaniscano.",descEN:"Handmade by our artisans for this special space. We suggest keeping a notebook here to jot down dreams and perceptions before they fade.",descDE:"Von unseren Handwerkern für diesen besonderen Raum geschaffen. Wir empfehlen, dort ein Notizbuch aufzubewahren, um Träume und Wahrnehmungen festzuhalten, bevor sie verblassen.",descFR:"Créée par nos artisans pour cet espace particulier. Nous suggérons d'y garder un carnet pour noter rêves et perceptions avant qu'ils ne s'estompent.",descRU:"Изготовлена нашими мастерами для этого особого пространства. Рекомендуем держать здесь блокнот, чтобы записывать сны и ощущения, пока они не исчезли."},
  sponda: {labelIT:"Il letto",labelEN:"The bed",labelDE:"Das Bett",labelFR:"Le lit",labelRU:"Кровать",descIT:"Anche questo arredo è pensato e creato dai nostri artigiani damanhuriani.",descEN:"This piece too is designed and handmade by our Damanhurian artisans.",descDE:"Auch dieses Möbelstück wurde von unseren Damanhur-Handwerkern entworfen und gefertigt.",descFR:"Ce meuble aussi a été conçu et fabriqué par nos artisans damanhuriens.",descRU:"Этот предмет мебели также спроектирован и изготовлен нашими дамантурскими мастерами."},
  materasso: {labelIT:"Materasso e lenzuola",labelEN:"Mattress & sheets",labelDE:"Matratze und Bettwäsche",labelFR:"Matelas et draps",labelRU:"Матрас и бельё",descIT:"Materasso con morbido topper e copertura antiallergica. Lenzuola 100% cotone, per accogliere al meglio il tuo riposo.",descEN:"Mattress with a soft topper and hypoallergenic cover. 100% cotton sheets, to welcome your rest at its best.",descDE:"Matratze mit weichem Topper und hypoallergenem Bezug. Bettwäsche aus 100% Baumwolle, für die bestmögliche Erholung.",descFR:"Matelas avec surmatelas moelleux et housse hypoallergénique. Draps 100% coton, pour accueillir au mieux votre repos.",descRU:"Матрас с мягким топпером и гипоаллергенным чехлом. Простыни из 100% хлопка для лучшего отдыха."},
  cuscino: {labelIT:"Cuscino colorato",labelEN:"Coloured pillow",labelDE:"Buntes Kissen",labelFR:"Coussin coloré",labelRU:"Цветная подушка",descIT:"La federa nasce da un quadro in seta dipinto a mano da Aythya, nostra artigiana — un'opera rimasta nei Templi dell'Umanità per oltre 20 anni.",descEN:"The pillowcase comes from a silk painting hand-made by Aythya, one of our artisans — a work that lived inside the Temples of Humanity for over 20 years.",descDE:"Der Bezug stammt von einem handgemalten Seidenbild unserer Künstlerin Aythya — ein Werk, das über 20 Jahre in den Tempeln der Menschheit hing.",descFR:"La taie provient d'une peinture sur soie réalisée à la main par Aythya, une de nos artisanes — une œuvre restée plus de 20 ans à l'intérieur des Temples de l'Humanité.",descRU:"Наволочка создана из шёлковой картины, расписанной вручную нашей мастерицей Айтьей — произведение, более 20 лет находившееся внутри Храмов Человечества."},
  asciugamani: {labelIT:"Asciugamani",labelEN:"Towels",labelDE:"Handtücher",labelFR:"Serviettes",labelRU:"Полотенца",descIT:"100% cotone.",descEN:"100% cotton.",descDE:"100% Baumwolle.",descFR:"100% coton.",descRU:"100% хлопок."},
  schemaTeco: {labelIT:"Schema Teco",labelEN:"Teco Schema",labelDE:"Teco-Schema",labelFR:"Schéma Teco",labelRU:"Схема Теко",descIT:"Uno schema per prepararti al meglio alla notte. Percorrilo con un dito per almeno 3 minuti prima di coricarti, pensando a un tema o una domanda: aiuta a ricordare i sogni e a fissare un'intenzione.",descEN:"A schema to prepare you for the night. Trace it with a finger for at least 3 minutes before sleeping, holding a theme or question in mind: it helps recall dreams and set an intention.",descDE:"Ein Schema, um dich bestmöglich auf die Nacht vorzubereiten. Fahre es mit einem Finger mindestens 3 Minuten lang ab, bevor du schlafen gehst, und denke dabei an ein Thema oder eine Frage: Das hilft, sich an Träume zu erinnern und eine Intention zu setzen.",descFR:"Un schéma pour te préparer au mieux à la nuit. Parcours-le du doigt pendant au moins 3 minutes avant de te coucher, en pensant à un thème ou une question : cela aide à se souvenir de ses rêves et à fixer une intention.",descRU:"Схема для наилучшей подготовки ко сну. Проведи по ней пальцем не менее 3 минут перед сном, думая о теме или вопросе: это помогает запоминать сны и формировать намерение."},
  pareti: {labelIT:"Le pareti",labelEN:"The walls",labelDE:"Die Wände",labelFR:"Les murs",labelRU:"Стены",descIT:"Riprendono i dettagli della sala corrispondente nei Templi dell'Umanità — dipinte direttamente dagli artisti del Tempio.",descEN:"They echo the details of the corresponding hall in the Temples of Humanity — painted directly by the Temple's own artists.",descDE:"Sie greifen die Details des entsprechenden Saals in den Tempeln der Menschheit auf — direkt von den Künstlern des Tempels gemalt.",descFR:"Ils reprennent les détails de la salle correspondante à l'intérieur des Temples de l'Humanité — peints directement par les artistes du Temple.",descRU:"Они повторяют детали соответствующего зала в Храмах Человечества — расписаны непосредственно художниками Храма."},
  armadio: {labelIT:"L'armadio",labelEN:"The wardrobe",labelDE:"Der Kleiderschrank",labelFR:"L'armoire",labelRU:"Шкаф",descIT:"Prodotto artigianalmente dai damanhuriani, per arredare al meglio questo luogo magico.",descEN:"Handcrafted by the Damanhurians, to furnish this magical place at its best.",descDE:"Handgefertigt von den Damanhurianern, um diesen magischen Ort bestmöglich auszustatten.",descFR:"Fabriquée artisanalement par les Damanhuriens, pour meubler au mieux ce lieu magique.",descRU:"Изготовлен вручную дамантурцами, чтобы наилучшим образом обставить это волшебное место."},
  dreamscape: {labelIT:"Self dei Sogni — DreamScape Navigator",labelEN:"Dream Selfica — DreamScape Navigator",labelDE:"Traum-Selfica — DreamScape Navigator",labelFR:"Selfica des Rêves — DreamScape Navigator",labelRU:"Селфика Снов — DreamScape Navigator",descIT:"Due sfere di vetro e circuiti in rame e ottone: un ricevitore per l'evoluzione cosciente che potenzia il tuo potere di sognare, da sveglio e nel sonno. Seleziona i sogni più utili al sognatore, supporta l'auto-guarigione del corpo durante il riposo e favorisce un sonno più ristoratore e sogni più lucidi.",descEN:"Two glass spheres with copper and brass circuits: a receiver for conscious evolution that empowers your power to dream, awake and asleep. It selects the dreams most useful to the dreamer, supports the body's self-healing during rest, and favors more restorative sleep and more lucid dreams.",descDE:"Zwei Glaskugeln mit Kupfer- und Messingschaltkreisen: ein Empfänger für bewusste Evolution, der deine Traumkraft stärkt, im Wachen wie im Schlaf. Sie wählt die für den Träumenden nützlichsten Träume aus, unterstützt die Selbstheilung des Körpers während der Ruhe und begünstigt erholsameren Schlaf sowie klarere Träume.",descFR:"Deux sphères de verre et circuits en cuivre et laiton : un récepteur pour l'évolution consciente qui amplifie ton pouvoir de rêver, éveillé comme endormi. Elle sélectionne les rêves les plus utiles pour le rêveur, soutient l'auto-guérison du corps pendant le repos et favorise un sommeil plus réparateur et des rêves plus lucides.",descRU:"Две стеклянные сферы с медными и латунными контурами: приёмник для осознанной эволюции, усиливающий способность видеть сны, наяву и во сне. Она отбирает сны, наиболее полезные для сновидца, поддерживает самоисцеление тела во время отдыха и способствует более восстанавливающему сну и более осознанным сновидениям."},
  tendeBianche: {labelIT:"Tende bianche",labelEN:"White curtains",labelDE:"Weiße Vorhänge",labelFR:"Rideaux blancs",labelRU:"Белые шторы",descIT:"Decorate artigianalmente riprendendo i dettagli delle sale del Tempio.",descEN:"Handcrafted decoration echoing the details of the Temple halls.",descDE:"Handwerklich dekoriert, mit Details aus den Sälen des Tempels.",descFR:"Décorés artisanalement en reprenant les détails des salles du Temple.",descRU:"Декорированы вручную с деталями залов Храма."},
  tendeScure: {labelIT:"Tende oscuranti",labelEN:"Blackout curtains",labelDE:"Verdunkelungsvorhänge",labelFR:"Rideaux occultants",labelRU:"Плотные шторы",descIT:"Chiudile bene prima di coricarti, così la luce del mattino non disturba il sonno.",descEN:"Close them well before sleeping, so morning light doesn't disturb your rest.",descDE:"Schließe sie vor dem Schlafengehen gut, damit das Morgenlicht deinen Schlaf nicht stört.",descFR:"Ferme-les bien avant de te coucher, afin que la lumière du matin ne perturbe pas ton sommeil.",descRU:"Хорошо закрывай их перед сном, чтобы утренний свет не нарушал твой сон."},
  bagno: {labelIT:"Il bagno",labelEN:"The bathroom",labelDE:"Das Badezimmer",labelFR:"La salle de bain",labelRU:"Ванная комната",descIT:"Ogni stanza ha il proprio bagno con doccia.",descEN:"Every room has its own ensuite bathroom with shower.",descDE:"Jedes Zimmer verfügt über ein eigenes Bad mit Dusche.",descFR:"Chaque chambre dispose de sa propre salle de bain avec douche.",descRU:"В каждом номере есть собственная ванная с душем."},
  scrivania: {labelIT:"Scrivania",labelEN:"Writing desk",labelDE:"Schreibtisch",labelFR:"Bureau",labelRU:"Письменный стол",descIT:"Un angolo raccolto per scrivere, leggere o semplicemente fare una pausa.",descEN:"A quiet corner for writing, reading, or simply taking a pause.",descDE:"Eine ruhige Ecke zum Schreiben, Lesen oder einfach zum Innehalten.",descFR:"Un coin tranquille pour écrire, lire ou simplement faire une pause.",descRU:"Уютный уголок для письма, чтения или просто отдыха."},
  specchio: {labelIT:"Specchio",labelEN:"Mirror",labelDE:"Spiegel",labelFR:"Miroir",labelRU:"Зеркало",descIT:"Per prepararti prima di uscire verso i Templi.",descEN:"To get ready before heading out to the Temples.",descDE:"Um dich vorzubereiten, bevor du zu den Tempeln aufbrichst.",descFR:"Pour te préparer avant de sortir vers les Temples.",descRU:"Чтобы подготовиться перед выходом к Храмам."},
  quadroSelfico: {labelIT:"Quadro Selfico",labelEN:"Selfic Painting",labelDE:"Selfisches Gemälde",labelFR:"Tableau Selfique",labelRU:"Селфическая картина",descIT:"Frattali di realtà a più dimensioni, densi di significato — messaggi di conoscenza che attendono di essere richiamati dall'anima. Simboli e colori aprono a intuizioni e ampliano il cuore verso i campi del sapere.",descEN:"Fractals of multi-dimensional reality, dense with meaning — messages of knowledge waiting to be called back by the soul. Symbols and colours open us to intuition and expand the heart toward the fields of knowledge.",descDE:"Fraktale einer mehrdimensionalen Realität, reich an Bedeutung — Botschaften des Wissens, die darauf warten, von der Seele wieder abgerufen zu werden. Symbole und Farben öffnen zu Intuitionen und weiten das Herz zu den großen Feldern des Wissens.",descFR:"Fractales d'une réalité à plusieurs dimensions, denses de sens — messages de connaissance qui attendent d'être rappelés par l'âme. Symboles et couleurs ouvrent à l'intuition et élargissent le cœur vers les vastes champs du savoir.",descRU:"Фракталы многомерной реальности, наполненные смыслом — послания знания, ожидающие, когда душа их вспомнит. Символы и цвета открывают интуицию и расширяют сердце к обширным полям познания.",url:"https://thetemples.org/it/quadri-selfici/"},
  mosaico: {labelIT:"Mosaico del Labirinto",labelEN:"Labyrinth Mosaic",labelDE:"Labyrinth-Mosaik",labelFR:"Mosaïque du Labyrinthe",labelRU:"Мозаика Лабиринта",descIT:"Il mosaico a terra richiama la Sala del Labirinto nei Templi. Il tavolo di cristallo sopra di esso permette di ammirarne ogni dettaglio — realizzato dal laboratorio di mosaico damanhuriano.",descEN:"The floor mosaic echoes the Labyrinth Hall in the Temples. The crystal table above it lets you admire every detail — crafted by the Damanhurian mosaic workshop.",descDE:"Das Bodenmosaik erinnert an den Labyrinth-Saal in den Tempeln. Der Kristalltisch darüber lässt jedes Detail bewundern — angefertigt von der damanhurianischen Mosaikwerkstatt.",descFR:"La mosaïque au sol rappelle la Salle du Labyrinthe dans les Temples. La table en cristal au-dessus permet d'en admirer chaque détail — réalisée par l'atelier de mosaïque damanhurien.",descRU:"Напольная мозаика напоминает Зал Лабиринта в Храмах. Хрустальный стол над ней позволяет разглядеть каждую деталь — создана дамантурской мастерской мозаики."},
  libreria: {labelIT:"La Libreria",labelEN:"The Bookshelf",labelDE:"Die Bücherei",labelFR:"La bibliothèque",labelRU:"Библиотека",descIT:"Creata da un nostro artigiano con il legno del bosco sacro, ospita libri su Damanhur in diverse lingue del mondo.",descEN:"Handmade by one of our artisans using wood from the sacred forest, it holds books about Damanhur in many languages.",descDE:"Von einem unserer Handwerker aus dem Holz des heiligen Waldes gefertigt, beherbergt sie Bücher über Damanhur in verschiedenen Sprachen der Welt.",descFR:"Créée par l'un de nos artisans avec le bois de la forêt sacrée, elle abrite des livres sur Damanhur en plusieurs langues du monde.",descRU:"Изготовлена одним из наших мастеров из дерева священного леса, здесь хранятся книги о Дамантуре на разных языках мира."},
  lettura: {labelIT:"Angolo Lettura",labelEN:"Reading Corner",labelDE:"Leseecke",labelFR:"Coin lecture",labelRU:"Уголок для чтения",descIT:"Un angolo raccolto dove sederti, leggere e — se vuoi — ascoltare la musica delle piante.",descEN:"A quiet corner to sit, read and — if you like — listen to the music of plants.",descDE:"Eine ruhige Ecke zum Sitzen, Lesen und — wenn du möchtest — um die Musik der Pflanzen zu hören.",descFR:"Un coin tranquille pour s'asseoir, lire et — si tu le souhaites — écouter la musique des plantes.",descRU:"Уютное место, где можно сесть, почитать и — если хочешь — послушать музыку растений."},
  tarocchi: {labelIT:"I Tarocchi Damanhuriani",labelEN:"The Damanhurian Tarot",labelDE:"Die Damanhur-Tarotkarten",labelFR:"Les Tarots Damanhuriens",labelRU:"Дамантурское Таро",descIT:"Creati da Falco Tarassaco con le immagini dei Quadri Selfici. Sul tavolo di legno puoi fare una tua lettura della giornata o di una domanda su cui vuoi ampliare lo sguardo.",descEN:"Created by Falco Tarassaco using the imagery of the Selfic Paintings. On the wooden table you can do your own reading of the day, or of a question you'd like to explore.",descDE:"Von Falco Tarassaco geschaffen, mit den Bildern der Selfischen Gemälde. Am Holztisch kannst du deine eigene Lesung des Tages machen oder einer Frage nachgehen, zu der du deinen Blick erweitern möchtest.",descFR:"Créés par Falco Tarassaco avec les images des Tableaux Selfiques. Sur la table en bois, tu peux faire ta propre lecture de la journée ou d'une question que tu souhaites approfondir.",descRU:"Создано Фалько Тарассако с изображениями Селфических картин. За деревянным столом можно сделать собственный расклад на день или по вопросу, который хочется глубже понять."},
  caffeMacchina: {labelIT:"Caffè e Tè",labelEN:"Coffee & Tea",labelDE:"Kaffee & Tee",labelFR:"Café & Thé",labelRU:"Кофе и чай",descIT:"Macchina del caffè e tè a disposizione in ogni momento della giornata.",descEN:"Coffee and tea machine available any time of day.",descDE:"Kaffee- und Teemaschine, jederzeit während des Tages verfügbar.",descFR:"Machine à café et à thé disponible à tout moment de la journée.",descRU:"Кофе-машина и чай доступны в любое время суток."},
  cucina: {labelIT:"La Cucina",labelEN:"The Kitchen",labelDE:"Die Küche",labelFR:"La cuisine",labelRU:"Кухня",descIT:"A disposizione degli ospiti, con tutto ciò che serve per prepararsi un pasto e goderselo in questo luogo sacro.",descEN:"Available to guests, with everything you need to prepare a meal and enjoy it in this sacred place.",descDE:"Den Gästen zur Verfügung, mit allem, was man braucht, um sich eine Mahlzeit zuzubereiten und sie an diesem heiligen Ort zu genießen.",descFR:"À la disposition des hôtes, avec tout le nécessaire pour préparer un repas et en profiter dans ce lieu sacré.",descRU:"В распоряжении гостей, со всем необходимым, чтобы приготовить еду и насладиться ею в этом священном месте."},
  acquaFiltrata: {labelIT:"Acqua Filtrata",labelEN:"Filtered Water",labelDE:"Gefiltertes Wasser",labelFR:"Eau filtrée",labelRU:"Отфильтрованная вода",descIT:"Nel lavandino trovi un piccolo rubinetto di metallo con acqua filtrata di montagna, a temperatura ambiente, fredda o frizzante. Usa la bottiglia della tua stanza per portarla sempre con te.",descEN:"At the sink you'll find a small metal tap with filtered mountain water — still, cold or sparkling. Use your room's bottle to keep it with you.",descDE:"Am Waschbecken findest du einen kleinen Metallhahn mit gefiltertem Bergwasser — natur, kalt oder mit Kohlensäure. Nutze die Flasche aus deinem Zimmer, um es immer bei dir zu haben.",descFR:"À l'évier, tu trouveras un petit robinet en métal avec de l'eau de montagne filtrée — à température ambiante, froide ou pétillante. Utilise la bouteille de ta chambre pour l'emporter avec toi.",descRU:"У раковины есть небольшой металлический кран с отфильтрованной горной водой — комнатной температуры, холодной или газированной. Используй бутылку из своей комнаты, чтобы всегда носить её с собой."},
};
const H = (key,x,y,over={}) => ({x,y,...RI[key],...over});

// ── ROOM IMAGES (tour multi-foto con hotspot propri per ciascuna immagine) ─────
const ROOM_IMAGES = {
  Terra: [
    {src:"/rooms/terra-1.jpg", hotspots:[H("pareti",58,28),H("tendeBianche",22,42),H("sponda",50,72),H("comodino",68,68),H("armadio",14,55),H("specchio",92,55)]},
    {src:"/rooms/terra-2.jpg", hotspots:[H("cuscino",72,62),H("materasso",50,80),H("specchio",93,40)]},
    {src:"/rooms/terra-3.jpg", hotspots:[H("lampada",68,48),H("bottiglia",85,48),H("comodino",75,78),H("cuscino",22,28)]},
    {src:"/rooms/terra-4.jpg", hotspots:[H("asciugamani",35,55),H("schemaTeco",62,48),H("bottiglia",88,26)]},
    {src:"/rooms/terra-5.jpg", hotspots:[H("dreamscape",48,35),H("armadio",30,72),H("tendeBianche",72,45),H("tendeScure",92,55)]},
    {src:"/rooms/terra-6.jpg", hotspots:[H("bagno",46,55),H("pareti",78,40),H("scrivania",92,72)]},
    {src:"/rooms/terra-7.jpg", hotspots:[H("quadroSelfico",15,35),H("scrivania",65,78)]},
  ],
  Metalli: [
    {src:"/rooms/metalli-1.jpg", hotspots:[H("pareti",62,35),H("tendeBianche",15,42),H("sponda",50,75),H("scrivania",43,60),H("bagno",38,18)]},
    {src:"/rooms/metalli-2.jpg", hotspots:[H("pareti",50,25),H("sponda",25,55),H("lampada",6,70),H("bottiglia",15,68),H("asciugamani",50,85),H("schemaTeco",60,78)]},
    {src:"/rooms/metalli-3.jpg", hotspots:[H("scrivania",35,60),H("armadio",78,45)]},
    {src:"/rooms/metalli-4.jpg", hotspots:[H("tendeBianche",30,45),H("tendeScure",55,55)]},
    {src:"/rooms/metalli-5.jpg", hotspots:[H("pareti",45,30),H("sponda",20,65),H("lampada",5,68)]},
  ],
  Acqua: [
    {src:"/rooms/acqua-1.jpg", hotspots:[H("pareti",55,25),H("tendeBianche",8,35),H("sponda",45,55),H("comodino",78,55),H("asciugamani",30,78)]},
    {src:"/rooms/acqua-2.jpg", hotspots:[H("scrivania",72,72),H("bagno",22,65),H("pareti",48,45)]},
    {src:"/rooms/acqua-3.jpg", hotspots:[H("lampada",68,45),H("bottiglia",88,52),H("comodino",75,80)]},
    {src:"/rooms/acqua-4.jpg", hotspots:[H("tendeBianche",35,50),H("tendeScure",48,60),H("armadio",10,65)]},
    {src:"/rooms/acqua-5.jpg", hotspots:[H("cuscino",32,35),H("asciugamani",28,68),H("schemaTeco",55,62),H("specchio",92,35)]},
    {src:"/rooms/acqua-6.jpg", hotspots:[H("pareti",35,30),H("cuscino",52,85)]},
    {src:"/rooms/acqua-7.jpg", hotspots:[H("dreamscape",18,60),H("sponda",85,80)]},
  ],
  Living: [
    {src:"/rooms/living-1.jpg", hotspots:[H("mosaico",45,82),H("libreria",62,45),H("lettura",23,68)]},
    {src:"/rooms/living-2.jpg", hotspots:[H("libreria",58,40),H("lettura",18,80),H("mosaico",75,90)]},
    {src:"/rooms/living-3.jpg", hotspots:[H("caffeMacchina",35,62)]},
    {src:"/rooms/living-4.jpg", hotspots:[H("tarocchi",48,78),H("libreria",8,45)]},
    {src:"/rooms/living-5.jpg", hotspots:[H("cucina",30,80),H("acquaFiltrata",68,70)]},
  ],
  Specchi: [
    {src:"/rooms/specchi-1.jpg", hotspots:[H("pareti",42,20),H("specchio",15,45),H("comodino",30,70),H("sponda",55,68),H("tendeBianche",78,40),H("scrivania",93,68)]},
    {src:"/rooms/specchi-2.jpg", hotspots:[H("armadio",35,42),H("bagno",18,42),H("sponda",60,62),H("comodino",85,68),H("pareti",80,22)]},
    {src:"/rooms/specchi-3.jpg", hotspots:[H("pareti",55,25),H("cuscino",62,65),H("tendeBianche",85,40)]},
    {src:"/rooms/specchi-4.jpg", hotspots:[H("lampada",38,62),H("bottiglia",28,78),H("pareti",55,15),H("tendeBianche",80,25),H("cuscino",70,42)]},
    {src:"/rooms/specchi-5.jpg", hotspots:[H("dreamscape",48,60)]},
    {src:"/rooms/specchi-6.jpg", hotspots:[H("schemaTeco",48,65),H("asciugamani",75,55),H("cuscino",48,20)]},
    {src:"/rooms/specchi-7.jpg", hotspots:[H("scrivania",75,55),H("lampada",48,35),H("tendeBianche",15,35),H("bagno",38,15)]},
    {src:"/rooms/specchi-8.jpg", hotspots:[H("tendeScure",48,55)]},
    {src:"/rooms/specchi-9.jpg", hotspots:[H("bagno",50,50),H("specchio",28,45),H("asciugamani",88,32)]},
  ],
  Popoli: [
    {src:"/rooms/popoli-1.jpg", hotspots:[H("pareti",85,40,{labelIT:"Pannello dei Popoli",labelEN:"Peoples Panel",descIT:"Il murale simbolico: i segni che rappresentano l'incontro tra i popoli e la coscienza collettiva.",descEN:"The symbolic mural: the signs representing the meeting of peoples and collective consciousness."}),H("tendeBianche",13,40),H("sponda",35,72),H("comodino",78,65)]},
    {src:"/rooms/popoli-2.jpg", hotspots:[H("lampada",65,48),H("bottiglia",85,55),H("comodino",72,80)]},
    {src:"/rooms/popoli-3.jpg", hotspots:[H("sponda",72,48)]},
    {src:"/rooms/popoli-4.jpg", hotspots:[H("dreamscape",18,28),H("scrivania",62,62)]},
    {src:"/rooms/popoli-5.jpg", hotspots:[H("tendeScure",35,55),H("tendeBianche",68,55)]},
    {src:"/rooms/popoli-6.jpg", hotspots:[H("asciugamani",35,55),H("schemaTeco",55,62)]},
  ],
};
function RoomExplorer({room,lang}) {
  const [activeImg,setActiveImg] = useState(0);
  const [active,setActive] = useState(null);
  const images = ROOM_IMAGES[room.name]&&ROOM_IMAGES[room.name].length ? ROOM_IMAGES[room.name] : [{src:room.img,hotspots:[]}];
  const current = images[activeImg]||images[0];
  const spots = current.hotspots||[];
  return (
    <div>
      <div style={{position:"relative",borderRadius:"20px",overflow:"hidden",boxShadow:C.shadow}}>
        <img src={current.src} alt={room.name} style={{width:"100%",display:"block"}}/>
        {spots.map((h,i)=>(
          <button key={i} onClick={()=>setActive(active===i?null:i)} style={{position:"absolute",left:`${h.x}%`,top:`${h.y}%`,transform:"translate(-50%,-50%)",width:"30px",height:"30px",borderRadius:"50%",background:active===i?C.gold:"rgba(255,255,255,0.88)",border:`2px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 10px rgba(0,0,0,0.35)",cursor:"pointer",padding:0,animation:active===null?"abatonPulse 1.8s ease-in-out infinite alternate":"none"}}>
            <span style={{color:active===i?C.white:C.goldD,fontSize:"14.5px",fontWeight:"700",fontFamily:FB}}>{i+1}</span>
          </button>
        ))}
      </div>
      {active!==null&&spots[active] ? (
        <div style={{marginTop:"14px",background:C.white,borderRadius:"16px",padding:"18px",boxShadow:C.shadow}}>
          <div style={{fontFamily:FD,fontWeight:"500",fontSize:"19px",color:C.blue,marginBottom:"6px"}}>{LS(spots[active],"label",lang)}</div>
          <div style={{fontSize:"15.5px",color:C.textM,lineHeight:"1.7"}}>{LS(spots[active],"desc",lang)}</div>
          {spots[active].url&&(
            <ExtLink href={spots[active].url} lang={lang} style={{display:"inline-block",marginTop:"8px",color:C.gold,fontFamily:FB,fontSize:"14.5px",textDecoration:"none"}}>{lang==="it"?"Scopri di più →":lang==="de"?"Mehr erfahren →":lang==="fr"?"En savoir plus →":lang==="ru"?"Узнать больше →":"Learn more →"}</ExtLink>
          )}
        </div>
      ) : (
        <div style={{marginTop:"14px",fontSize:"14.5px",color:C.textM,textAlign:"center",fontStyle:"italic"}}>
          {spots.length>0
            ? (lang==="it"?"Tocca i cerchi dorati per scoprire i dettagli":lang==="de"?"Tippe auf die goldenen Kreise, um mehr zu erfahren":lang==="fr"?"Touche les cercles dorés pour découvrir les détails":lang==="ru"?"Коснитесь золотых кружков, чтобы узнать подробности":"Tap the golden circles to discover the details")
            : (lang==="it"?"Scorri le foto qui sotto per esplorare la stanza":lang==="de"?"Scrolle durch die Fotos unten, um das Zimmer zu erkunden":lang==="fr"?"Fais défiler les photos ci-dessous pour explorer la chambre":lang==="ru"?"Пролистайте фото ниже, чтобы осмотреть комнату":"Scroll the photos below to explore the room")}
        </div>
      )}
      {images.length>1&&(
        <div style={{display:"flex",gap:"10px",marginTop:"16px",overflowX:"auto",paddingBottom:"4px"}}>
          {images.map((im,i)=>(
            <button key={i} onClick={()=>{setActiveImg(i);setActive(null);}} style={{flexShrink:0,borderRadius:"14px",overflow:"hidden",width:"104px",height:"76px",padding:0,cursor:"pointer",border:i===activeImg?`3px solid ${C.gold}`:`1px solid ${C.border}`,opacity:i===activeImg?1:0.8,boxShadow:C.shadow}}>
              <img src={im.src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
function AbatonPage({t,lang,setPage}) {
  const [sub,setSub] = useState(null);
  const [roomDetail,setRoomDetail] = useState(null);
  useEffect(()=>{ scrollTop0(); },[sub,roomDetail]);
  const SUBS = [
    {id:"camere",   sym:"◇", labelIT:"Le Cinque Stanze",    labelEN:"The Five Rooms",    labelDE:"Die fünf Zimmer",         labelFR:"Les Cinq Chambres",       labelRU:"Пять комнат",       color:C.gold},
    {id:"living",   sym:"〰", labelIT:"Il Living",           labelEN:"The Living Space",  labelDE:"Der Wohnbereich",         labelFR:"Le Salon",                labelRU:"Гостиная",           color:C.blueM},
    {id:"colazione",sym:"☀", labelIT:"La Colazione",        labelEN:"Breakfast",          labelDE:"Das Frühstück",          labelFR:"Le Petit-Déjeuner",       labelRU:"Завтрак",            color:"#C07A30"},
    {id:"tempio",   sym:"✦", labelIT:"Connessione al Tempio",labelEN:"Temple Connection",labelDE:"Verbindung zum Tempel",  labelFR:"Connexion au Temple",     labelRU:"Связь с Храмом",     color:C.goldD},
    {id:"campo",    sym:"◎", labelIT:"Il Campo dell'Abaton",labelEN:"Abaton's Field",     labelDE:"Das Feld des Abaton",    labelFR:"Le Champ de l'Abaton",    labelRU:"Поле Абатона",       color:C.blue},
    {id:"sogno",    sym:"◈", labelIT:"L'Arte del Sogno",    labelEN:"The Art of Dreaming",labelDE:"Die Kunst des Träumens", labelFR:"L'Art du Rêve",           labelRU:"Искусство сна",      color:"#7A6AAA"},
  ];
  const ROOMS_BRIEF = [
    {
      name:"Terra", sym:"🌿", acc:"#7A9A4A",
      img:"/rooms/terra-1.jpg",
      templeImg:"/temple/terra.jpg",
      templeImgs:["/temple/terra.jpg","/temple/terra-2.jpg"],
      templeUrl:"https://thetemples.org/it/sala-della-terra/",
      descIT:"Celebra il nostro pianeta, la natura, il principio maschile, attivo e fecondante. Permette l'accesso a memorie ancestrali della nostra specie, il contatto con il fuoco, le forze della terra e l'intelligenza del Pianeta.\n\nLa stanza dell'Abaton rispecchia questa frequenza: radicamento, abbondanza, crescita silenziosa. I materiali naturali e le forme organiche dei mobili parlano il linguaggio della Terra.",
      descEN:"It celebrates our planet, nature, and the masculine principle, active and fertilizing. It allows access to the ancestral memories of our species, contact with fire, the forces of the earth and the intelligence of the Planet.\n\nThe Abaton room mirrors this frequency: groundedness, abundance, silent growth. Natural materials and organic furniture forms speak the language of Earth.",
      descDE:"Er feiert unseren Planeten, die Natur und das männliche Prinzip, aktiv und befruchtend. Er ermöglicht den Zugang zu den Ahnenerinnerungen unserer Spezies, den Kontakt mit dem Feuer, den Kräften der Erde und der Intelligenz des Planeten.\n\nDas Zimmer im Abaton spiegelt diese Frequenz wider: Erdung, Fülle, stilles Wachstum. Natürliche Materialien und organische Möbelformen sprechen die Sprache der Erde.",
      descFR:"Elle célèbre notre planète, la nature et le principe masculin, actif et fécondant. Elle permet l'accès aux mémoires ancestrales de notre espèce, le contact avec le feu, les forces de la terre et l'intelligence de la Planète.\n\nLa chambre de l'Abaton reflète cette fréquence : enracinement, abondance, croissance silencieuse. Les matériaux naturels et les formes organiques du mobilier parlent le langage de la Terre.",
      descRU:"Он прославляет нашу планету, природу и мужское начало — активное и оплодотворяющее. Он открывает доступ к древним воспоминаниям нашего вида, контакту с огнём, силам земли и разуму Планеты.\n\nКомната в Абатоне отражает эту частоту: укоренённость, изобилие, тихий рост. Натуральные материалы и органичные формы мебели говорят на языке Земли.",
    },
    {
      name:"Metalli", sym:"⚗", acc:"#C07830",
      img:"/rooms/metalli-1.jpg",
      templeImg:"/temple/metalli.jpg",
      templeImgs:["/temple/metalli.jpg","/temple/metalli-2.jpg","/temple/metalli-3.jpg"],
      templeUrl:"https://thetemples.org/it/sala-dei-metalli/",
      descIT:"Dedicata ai metalli e al tempo, rappresenta l'importanza della scelta, della conoscenza e della volontà di trasformare in positivo gli elementi negativi, superando la presunta necessità del conflitto. Favorisce il contatto con la parte profonda di sé in diversi momenti del tempo e prepara alle scelte ispirate.\n\nLa stanza dei Metalli ospita questa alchimia: la tecnologia selfica amplifica l'intenzione personale durante il sonno.",
      descEN:"Dedicated to metals and time, it represents the importance of choice, knowledge and the will to transform negative elements into positive ones, overcoming the presumed necessity of conflict. It favors contact with the deep part of oneself across different moments in time and prepares us for inspired choices.\n\nThe Metals room hosts this alchemy: selfica technology amplifies personal intention during sleep.",
      descDE:"Den Metallen und der Zeit gewidmet, steht er für die Bedeutung der Wahl, des Wissens und des Willens, negative Elemente ins Positive zu verwandeln und die vermeintliche Notwendigkeit des Konflikts zu überwinden. Er begünstigt den Kontakt mit dem tiefen Teil des Selbst in verschiedenen Momenten der Zeit und bereitet auf inspirierte Entscheidungen vor.\n\nDas Zimmer der Metalle beherbergt diese Alchemie: Die selfische Technologie verstärkt die persönliche Absicht während des Schlafs.",
      descFR:"Dédiée aux métaux et au temps, elle représente l'importance du choix, de la connaissance et de la volonté de transformer en positif les éléments négatifs, en dépassant la nécessité présumée du conflit. Elle favorise le contact avec la part profonde de soi à travers différents moments du temps et prépare à des choix inspirés.\n\nLa chambre des Métaux abrite cette alchimie : la technologie selfique amplifie l'intention personnelle pendant le sommeil.",
      descRU:"Посвящён металлам и времени, он отражает важность выбора, знания и воли превращать негативное в позитивное, преодолевая мнимую необходимость конфликта. Он способствует контакту с глубинной частью себя в разные моменты времени и готовит к вдохновлённым решениям.\n\nКомната Металлов хранит эту алхимию: селфическая технология усиливает личное намерение во время сна.",
    },
    {
      name:"Acqua", sym:"〰", acc:C.blueM,
      img:"/rooms/acqua-1.jpg",
      templeImg:"/temple/acqua.jpg",
      templeImgs:["/temple/acqua.jpg","/temple/acqua-2.jpg","/temple/rosone-acqua.jpg"],
      templeUrl:"https://thetemples.org/it/sala-dellacqua/",
      descIT:"Dedicata al principio e alle forze divine femminili; predispone al risveglio delle memorie profonde, aprendo il cuore al contatto con la propria parte femminile, contenitore prezioso di empatia e accoglienza. L'acqua è il mezzo primordiale della vita.\n\nLa stanza dell'Acqua prepara al risveglio delle memorie più profonde.",
      descEN:"Dedicated to the feminine divine principle and forces, it predisposes the awakening of deep memories, opening the heart to contact with one's own feminine part — a precious vessel of empathy and welcome. Water is the primordial medium of life.\n\nThe Water room prepares for awakening the deepest memories.",
      descDE:"Dem weiblichen göttlichen Prinzip und seinen Kräften gewidmet; er bereitet das Erwachen tiefer Erinnerungen vor und öffnet das Herz für den Kontakt mit dem eigenen weiblichen Anteil, einem kostbaren Gefäß der Empathie und des Willkommens. Wasser ist das ursprüngliche Medium des Lebens.\n\nDas Zimmer des Wassers bereitet auf das Erwachen der tiefsten Erinnerungen vor.",
      descFR:"Dédiée au principe et aux forces divines féminines ; elle prédispose à l'éveil des mémoires profondes, ouvrant le cœur au contact avec sa propre part féminine, précieux réceptacle d'empathie et d'accueil. L'eau est le moyen primordial de la vie.\n\nLa chambre de l'Eau prépare à l'éveil des mémoires les plus profondes.",
      descRU:"Посвящён женскому божественному началу и его силам; он подготавливает пробуждение глубинных воспоминаний, открывая сердце для контакта со своей женской стороной — драгоценным вместилищем эмпатии и гостеприимства. Вода — изначальная стихия жизни.\n\nКомната Воды готовит к пробуждению самых глубоких воспоминаний.",
    },
    {
      name:"Specchi", sym:"◇", acc:C.goldD,
      img:"/rooms/specchi-1.jpg",
      templeImg:"/temple/specchi.jpg",
      templeImgs:["/temple/specchi.jpg","/temple/specchi-2.jpg","/temple/specchi-3.jpg"],
      templeUrl:"https://thetemples.org/it/sala-degli-specchi/",
      descIT:"Dedicata alla luce, all'aria, al cielo, al sole e alla spiritualità; favorisce un contatto speciale con la dimensione più profonda del sogno, celebra e prepara il risveglio dell'Essere Umano completo. È un possibile portale di apertura alla percezione della Forza Graal.\n\nLa stanza degli Specchi facilita il contatto con le dimensioni più profonde del sogno. Dormire qui è dormire nell'infinito.",
      descEN:"Dedicated to light, air, the sky, the sun and spirituality; it favors a special contact with the deepest dimension of dreaming, celebrating and preparing the awakening of the complete Human Being. It is a possible portal opening to the perception of the Grail Force.\n\nThe Mirrors room facilitates contact with the deepest dream dimensions. Sleeping here is sleeping in infinity.",
      descDE:"Dem Licht, der Luft, dem Himmel, der Sonne und der Spiritualität gewidmet; er begünstigt einen besonderen Kontakt mit der tiefsten Dimension des Traums, feiert und bereitet das Erwachen des vollständigen Menschen vor. Er ist ein mögliches Portal zur Wahrnehmung der Gral-Kraft.\n\nDas Zimmer der Spiegel erleichtert den Kontakt mit den tiefsten Traumdimensionen. Hier zu schlafen bedeutet, in der Unendlichkeit zu schlafen.",
      descFR:"Dédiée à la lumière, à l'air, au ciel, au soleil et à la spiritualité ; elle favorise un contact spécial avec la dimension la plus profonde du rêve, célèbre et prépare l'éveil de l'Être Humain complet. Elle est un portail possible d'ouverture à la perception de la Force du Graal.\n\nLa chambre des Miroirs facilite le contact avec les dimensions les plus profondes du rêve. Dormir ici, c'est dormir dans l'infini.",
      descRU:"Посвящён свету, воздуху, небу, солнцу и духовности; он способствует особому контакту с самым глубоким измерением сна, прославляя и подготавливая пробуждение целостного Человека. Это возможный портал к восприятию Силы Грааля.\n\nКомната Зеркал облегчает контакт с самыми глубокими измерениями сна. Спать здесь — значит спать в бесконечности.",
    },
    {
      name:"Popoli", sym:"✦", acc:C.blue,
      img:"/rooms/popoli-1.jpg",
      templeImg:"/temple/popoli.jpg",
      templeUrl:null,
      descIT:"Apre alla trasformazione di coscienza collettiva e stabile, oggi indispensabile per cambiare le sorti dell'umanità e portare il mondo verso la sostenibilità e la pace. Costituisce la dimostrazione del cambiamento, della volontà e delle capacità umane alle Forze della Terra. È una sala speciale dei Templi dell'Umanità — non visitabile nelle normali visite guidate; ospita eventi speciali, concerti, cerimonie e momenti di incontro collettivo di grande intensità.\n\nLa stanza dei Popoli porta questa frequenza: apertura alla coscienza collettiva, connessione con l'umanità intera.",
      descEN:"It opens to a stable, collective transformation of consciousness — today indispensable for changing the fate of humanity and leading the world toward sustainability and peace. It stands as proof of change, of will, and of humanity's capacities before the Forces of the Earth. It is a special hall of the Temples — not open during normal guided visits; it hosts special events, concerts, ceremonies and moments of great collective intensity.\n\nThe Peoples room carries this frequency: openness to collective consciousness, connection with all of humanity.",
      descDE:"Er öffnet für eine stabile, kollektive Bewusstseinswandlung — heute unerlässlich, um das Schicksal der Menschheit zu verändern und die Welt zu Nachhaltigkeit und Frieden zu führen. Er ist der Beweis für Wandel, Willen und die Fähigkeiten der Menschheit gegenüber den Kräften der Erde. Er ist ein besonderer Saal der Tempel der Menschheit — bei normalen Führungen nicht zugänglich; er beherbergt besondere Veranstaltungen, Konzerte, Zeremonien und Momente kollektiver Begegnung von großer Intensität.\n\nDas Zimmer der Völker trägt diese Frequenz: Offenheit für das kollektive Bewusstsein, Verbindung mit der gesamten Menschheit.",
      descFR:"Elle ouvre à une transformation stable et collective de la conscience — aujourd'hui indispensable pour changer le destin de l'humanité et conduire le monde vers la durabilité et la paix. Elle constitue la démonstration du changement, de la volonté et des capacités humaines face aux Forces de la Terre. C'est une salle spéciale des Temples de l'Humanité — non ouverte aux visites guidées normales ; elle accueille des événements spéciaux, concerts, cérémonies et moments de rencontre collective de grande intensité.\n\nLa chambre des Peuples porte cette fréquence : ouverture à la conscience collective, connexion avec l'humanité entière.",
      descRU:"Он открывает путь к устойчивой коллективной трансформации сознания — сегодня необходимой, чтобы изменить судьбу человечества и привести мир к устойчивости и миру. Он служит доказательством перемен, воли и возможностей человека перед Силами Земли. Это особый зал Храмов Человечества, недоступный при обычных экскурсиях; здесь проходят особые мероприятия, концерты, церемонии и моменты коллективной встречи большой силы.\n\nКомната Народов несёт эту частоту: открытость коллективному сознанию, связь со всем человечеством.",
    },
  ];
  const subContent = {
    living:{
      img:"/damanhur/living.jpg",
      it:"Il Living dell'Abaton non è una sala d'attesa — è uno spazio di transizione tra la notte e il giorno, tra il sogno e la veglia.\n\nÈ progettato per non interrompere. La luce è morbida, i materiali sono naturali, l'atmosfera è quella di chi non ha fretta. È il luogo dove il sogno non si perde ma si custodisce, dove la colazione diventa un momento e non un gesto distratto.\n\nLa sua energia rispecchia quella del Labirinto dei Templi — sala dedicata all'unione e all'armonia delle forze divine del Pianeta. Il Labirinto costituisce un percorso attraverso tutta la storia umana, distillando da sé la parte collegata al principio divino, all'essenza eterna che è al di là delle rappresentazioni culturali: predispone al contatto con le proprie parti più profonde, meditando sul proprio percorso spirituale. Come il Labirinto, il Living è un luogo di passaggio che apre a qualcosa di più grande.",
      link:"https://thetemples.org/it/il-labirinto/",
      linkLabelIT:"Scopri la Sala del Labirinto →",
      linkLabelEN:"Discover the Labyrinth Hall →",
      linkLabelDE:"Entdecke den Labyrinth-Saal →",
      linkLabelFR:"Découvre la Salle du Labyrinthe →",
      linkLabelRU:"Узнать больше о Зале Лабиринта →",
      gallery:["/temple/labirinto.jpg","/temple/labirinto-3.jpg","/temple/labirinto-4.jpg"],
      en:"Abaton's Living is not a waiting room — it is a transition space between night and day, between dreaming and waking.\n\nDesigned not to interrupt. The light is soft, materials natural, the atmosphere unhurried. It is where dreams are not lost but preserved, where breakfast becomes a moment and not a distracted gesture.\n\nIts energy mirrors the Labyrinth of the Temples — hall dedicated to the union and harmony of the Planet's divine forces. The Labyrinth forms a path through the whole of human history, distilling the part connected to the divine principle, to the eternal essence that lies beyond cultural representations: it predisposes contact with one's deepest parts, through meditation on one's own spiritual path. Like the Labyrinth, the Living is a passage that opens to something greater.",
      de:"Der Living-Bereich des Abaton ist kein Wartezimmer — er ist ein Übergangsraum zwischen Nacht und Tag, zwischen Traum und Wachsein.\n\nEr ist so gestaltet, dass er nicht unterbricht. Das Licht ist sanft, die Materialien natürlich, die Atmosphäre die eines Ortes ohne Eile. Es ist der Ort, an dem der Traum nicht verloren geht, sondern bewahrt wird, an dem das Frühstück zu einem Moment wird und nicht zu einer flüchtigen Geste.\n\nSeine Energie spiegelt die des Labyrinths der Tempel wider — ein Saal, der der Einheit und Harmonie der göttlichen Kräfte des Planeten gewidmet ist. Das Labyrinth bildet einen Weg durch die gesamte Menschheitsgeschichte und destilliert daraus den mit dem göttlichen Prinzip verbundenen Teil, die ewige Essenz jenseits kultureller Darstellungen: Es bereitet auf den Kontakt mit den eigenen tiefsten Anteilen vor, meditierend über den eigenen spirituellen Weg. Wie das Labyrinth ist der Living-Bereich ein Ort des Übergangs, der sich zu etwas Größerem öffnet.",
      fr:"Le Living de l'Abaton n'est pas une salle d'attente — c'est un espace de transition entre la nuit et le jour, entre le rêve et l'éveil.\n\nIl est conçu pour ne pas interrompre. La lumière est douce, les matériaux naturels, l'atmosphère celle de qui n'est pas pressé. C'est le lieu où le rêve ne se perd pas mais se préserve, où le petit-déjeuner devient un moment et non un geste distrait.\n\nSon énergie reflète celle du Labyrinthe des Temples — salle dédiée à l'union et à l'harmonie des forces divines de la Planète. Le Labyrinthe forme un parcours à travers toute l'histoire humaine, distillant la part reliée au principe divin, à l'essence éternelle qui se trouve au-delà des représentations culturelles : il prédispose au contact avec ses parts les plus profondes, en méditant sur son propre chemin spirituel. Comme le Labyrinthe, le Living est un lieu de passage qui s'ouvre à quelque chose de plus grand.",
      ru:"Гостиная Абатона — это не зал ожидания, а пространство перехода между ночью и днём, между сном и бодрствованием.\n\nОна создана так, чтобы ничего не прерывать. Свет мягкий, материалы натуральные, атмосфера — атмосфера того, кто никуда не спешит. Это место, где сон не теряется, а сохраняется, где завтрак становится моментом, а не рассеянным жестом.\n\nЕё энергия отражает энергию Лабиринта Храмов — зала, посвящённого единству и гармонии божественных сил Планеты. Лабиринт образует путь через всю историю человечества, выделяя ту часть, что связана с божественным началом, с вечной сутью, лежащей за пределами культурных форм: он подготавливает к контакту с самыми глубинными частями себя через медитацию над собственным духовным путём. Как и Лабиринт, Гостиная — это место перехода, открывающееся к чему-то большему.",
    },
    colazione:{
      img:"/damanhur/colazione.jpg",
      it:"La colazione all'Abaton è pensata come prolungamento dello stato di presenza.\n\nAlimenti biologici e del territorio: cibo vivo, essenziale, che non sovraccarica ma sostiene. Sapori semplici che riportano il corpo a una sensazione di radicamento.\n\nSulle tovagliette trovi schemi di preparazione degli alimenti — un modo per portare attenzione anche al nutrimento come atto consapevole.\n\nLa colazione è servita dalle 8:00 alle 10:00.\n\nSe hai bisogno di lasciare la stanza prima di quest'orario, avvisaci in anticipo: possiamo concordare cosa farti trovare in frigo per la colazione.\n\nComunica eventuali intolleranze o preferenze alimentari quando scrivi.",
      en:"Breakfast at Abaton is designed as an extension of the state of presence.\n\nOrganic local foods: living, essential food that does not overwhelm but sustains. Simple flavors that bring the body back to a sense of groundedness.\n\nOn the placemats you find food preparation schemes — bringing awareness also to nourishment as a conscious act.\n\nBreakfast is served from 8:00 to 10:00.\n\nIf you need to leave the room before this time, please let us know in advance: we can arrange something in the fridge for you.\n\nPlease communicate any intolerances or dietary preferences when you write.",
      de:"Das Frühstück im Abaton ist als Verlängerung des Zustands der Präsenz gedacht.\n\nBiologische, lokale Lebensmittel: lebendiges, essentielles Essen, das nicht belastet, sondern nährt. Einfache Aromen, die den Körper zu einem Gefühl der Erdung zurückführen.\n\nAuf den Platzsets findest du Schemata zur Zubereitung der Speisen — eine Möglichkeit, auch der Ernährung als bewusstem Akt Aufmerksamkeit zu schenken.\n\nDas Frühstück wird von 8:00 bis 10:00 Uhr serviert.\n\nWenn du das Zimmer vor dieser Uhrzeit verlassen musst, informiere uns bitte im Voraus: Wir können vereinbaren, was wir dir für das Frühstück in den Kühlschrank legen.\n\nTeile uns eventuelle Unverträglichkeiten oder Ernährungspräferenzen bei deiner Nachricht mit.",
      fr:"Le petit-déjeuner à l'Abaton est pensé comme un prolongement de l'état de présence.\n\nAliments biologiques et locaux : nourriture vivante, essentielle, qui ne surcharge pas mais soutient. Des saveurs simples qui ramènent le corps à une sensation d'enracinement.\n\nSur les sets de table, tu trouveras des schémas de préparation des aliments — une façon de porter attention aussi à la nourriture comme acte conscient.\n\nLe petit-déjeuner est servi de 8h00 à 10h00.\n\nSi tu dois quitter la chambre avant cette heure, préviens-nous à l'avance : nous pouvons convenir de ce que nous te laisserons au réfrigérateur pour le petit-déjeuner.\n\nCommunique-nous d'éventuelles intolérances ou préférences alimentaires lorsque tu nous écris.",
      ru:"Завтрак в Абатоне задуман как продолжение состояния присутствия.\n\nОрганические местные продукты: живая, простая еда, которая не перегружает, а поддерживает. Простые вкусы, возвращающие тело к ощущению укоренённости.\n\nНа салфетках-подставках вы найдёте схемы приготовления блюд — способ уделить внимание питанию как осознанному действию.\n\nЗавтрак подаётся с 8:00 до 10:00.\n\nЕсли вам нужно покинуть номер раньше этого времени, предупредите нас заранее: мы сможем договориться, что оставить вам в холодильнике на завтрак.\n\nСообщите о возможной непереносимости продуктов или пищевых предпочтениях, когда будете нам писать.",
    },
    tempio:{
      it:"L'Abaton è costruito nell'aura diretta dei Templi dell'Umanità. Non è una coincidenza geografica — è una scelta energetica e funzionale.\n\nI Templi rappresentano l'opera, la visione, la memoria collettiva del potenziale umano. L'Abaton ne è l'amplificatore silenzioso: il luogo in cui il corpo e il campo onirico dell'ospite possono ricevere, integrare e metabolizzare quella frequenza.\n\nI dipinti murali riprendono i motivi delle sale. Anche la luce è pensata in risonanza con gli spazi sotterranei.",
      link:"https://thetemples.org/it/",
      linkLabelIT:"Scopri i Templi dell'Umanità →",
      linkLabelEN:"Discover the Temples of Humanity →",
      linkLabelDE:"Entdecke die Tempel der Menschheit →",
      linkLabelFR:"Découvre les Temples de l'Humanité →",
      linkLabelRU:"Узнать больше о Храмах Человечества →",
      en:"Abaton is built in the direct aura of the Temples of Humanity. This is not a geographical coincidence — it is an energetic and functional choice.\n\nThe Temples represent the work, the vision, the collective memory of human potential. Abaton is their silent amplifier: the place where the guest's body and dream field can receive, integrate and metabolize that frequency.\n\nWall paintings echo Temple motifs. Even the lighting is designed in resonance with the underground spaces.",
      de:"Das Abaton ist in der direkten Aura der Tempel der Menschheit erbaut. Das ist kein geografischer Zufall — es ist eine energetische und funktionale Entscheidung.\n\nDie Tempel repräsentieren das Werk, die Vision, das kollektive Gedächtnis des menschlichen Potenzials. Das Abaton ist ihr stiller Verstärker: der Ort, an dem der Körper und das Traumfeld des Gastes diese Frequenz empfangen, integrieren und verarbeiten können.\n\nDie Wandmalereien greifen die Motive der Säle auf. Auch das Licht ist in Resonanz mit den unterirdischen Räumen gestaltet.",
      fr:"L'Abaton est construit dans l'aura directe des Temples de l'Humanité. Ce n'est pas une coïncidence géographique — c'est un choix énergétique et fonctionnel.\n\nLes Temples représentent l'œuvre, la vision, la mémoire collective du potentiel humain. L'Abaton en est l'amplificateur silencieux : le lieu où le corps et le champ onirique de l'hôte peuvent recevoir, intégrer et métaboliser cette fréquence.\n\nLes peintures murales reprennent les motifs des salles. Même la lumière est pensée en résonance avec les espaces souterrains.",
      ru:"Абатон построен в прямой ауре Храмов Человечества. Это не географическое совпадение — это энергетический и функциональный выбор.\n\nХрамы представляют собой труд, видение, коллективную память человеческого потенциала. Абатон — их тихий усилитель: место, где тело и сновидческое поле гостя могут принимать, интегрировать и усваивать эту частоту.\n\nНастенные росписи повторяют мотивы залов. Даже освещение продумано в резонансе с подземными пространствами.",
      gallery:["/temple/umanita.jpg","/temple/vittoria.jpg","/temple/vittoria-2.jpg","/temple/tempietto.jpg","/temple/sfere.jpg","/temple/labirinto-2.jpg"],
    },
    campo:{
      img:"/damanhur/campo.jpg",
      it:"L'Abaton non è semplicemente un edificio. È un campo.\n\nCome un campo magnetico, l'Abaton ha una sua intelligenza: risponde alle presenze, si modifica con gli ospiti, lavora anche quando non è esplicitamente attivato.\n\nQuesta natura di campo intelligente è ciò che rende ogni soggiorno diverso. Non è la stanza a cambiare — è il dialogo tra il campo e la persona che lo abita.\n\nÈ per questo che suggeriamo un soggiorno minimo di tre notti: perché il campo ha bisogno di tempo per riconoscere l'ospite, e l'ospite ha bisogno di tempo per riconoscere il tempio e le sue funzioni.",
      en:"Abaton is not simply a building. It is a field.\n\nLike a magnetic field, Abaton has its own intelligence: it responds to presences, modifies itself with guests, works even when not explicitly activated.\n\nThis nature as an intelligent field is what makes each stay different. It is not the room that changes — it is the dialogue between the field and the person inhabiting it.\n\nThis is why we suggest a minimum stay of three nights: because the field needs time to recognize the guest, and the guest needs time to recognise the Temple and its functions.",
      de:"Das Abaton ist nicht einfach ein Gebäude. Es ist ein Feld.\n\nWie ein magnetisches Feld hat das Abaton seine eigene Intelligenz: Es reagiert auf Anwesenheit, verändert sich mit den Gästen, wirkt auch dann, wenn es nicht ausdrücklich aktiviert wird.\n\nDiese Natur als intelligentes Feld ist es, was jeden Aufenthalt anders macht. Nicht das Zimmer verändert sich — es ist der Dialog zwischen dem Feld und der Person, die es bewohnt.\n\nDeshalb empfehlen wir einen Aufenthalt von mindestens drei Nächten: Denn das Feld braucht Zeit, um den Gast zu erkennen, und der Gast braucht Zeit, um den Tempel und seine Funktionen zu erkennen.",
      fr:"L'Abaton n'est pas simplement un bâtiment. C'est un champ.\n\nComme un champ magnétique, l'Abaton a sa propre intelligence : il répond aux présences, se modifie avec les hôtes, agit même lorsqu'il n'est pas explicitement activé.\n\nCette nature de champ intelligent est ce qui rend chaque séjour différent. Ce n'est pas la chambre qui change — c'est le dialogue entre le champ et la personne qui l'habite.\n\nC'est pourquoi nous suggérons un séjour minimum de trois nuits : car le champ a besoin de temps pour reconnaître l'hôte, et l'hôte a besoin de temps pour reconnaître le temple et ses fonctions.",
      ru:"Абатон — это не просто здание. Это поле.\n\nКак магнитное поле, Абатон обладает собственным разумом: он реагирует на присутствие, меняется вместе с гостями, действует даже тогда, когда не активирован явно.\n\nИменно эта природа разумного поля делает каждое пребывание особенным. Меняется не комната — меняется диалог между полем и человеком, который в нём находится.\n\nПоэтому мы рекомендуем пребывание минимум на три ночи: полю нужно время, чтобы узнать гостя, а гостю нужно время, чтобы узнать храм и его функции.",
    },
    sogno:{
      img:"/damanhur/sogno.jpg",
      it:"Per l'Abaton il sogno non è un'evasione dalla realtà. È una porta verso di essa.\n\nIl sogno è inteso come un linguaggio — uno spazio di comunicazione tra la coscienza vigile e le dimensioni più sottili dell'essere. Un luogo dove le domande trovano risposta, le intuizioni emergono, le direzioni si chiariscono.\n\nTutto nell'Abaton è pensato per custodire questo spazio: il silenzio notturno, le la Selfica dei Sogni, il quaderno accanto al letto, il rituale serale.\n\nIl sogno qui non capita. Viene preparato.",
      en:"For Abaton, dreaming is not an escape from reality. It is a door towards it.\n\nDreaming is understood as a language — a communication space between waking consciousness and the subtler dimensions of being. A place where questions find answers, intuitions emerge, directions clarify.\n\nEverything in Abaton is designed to protect this space: nightly silence, fragrances, the Dream Selfica, the journal beside the bed, the evening ritual.\n\nHere, dreaming does not just happen. It is prepared.",
      de:"Für das Abaton ist der Traum keine Flucht vor der Realität. Er ist eine Tür zu ihr.\n\nDer Traum wird als Sprache verstanden — ein Kommunikationsraum zwischen dem wachen Bewusstsein und den feineren Dimensionen des Seins. Ein Ort, an dem Fragen Antworten finden, Intuitionen entstehen, Richtungen sich klären.\n\nAlles im Abaton ist darauf ausgerichtet, diesen Raum zu bewahren: die nächtliche Stille, die Traum-Selfica, das Notizbuch neben dem Bett, das abendliche Ritual.\n\nDer Traum geschieht hier nicht einfach. Er wird vorbereitet.",
      fr:"Pour l'Abaton, le rêve n'est pas une évasion de la réalité. C'est une porte vers elle.\n\nLe rêve est compris comme un langage — un espace de communication entre la conscience éveillée et les dimensions plus subtiles de l'être. Un lieu où les questions trouvent réponse, où les intuitions émergent, où les directions se clarifient.\n\nTout dans l'Abaton est pensé pour préserver cet espace : le silence nocturne, la Selfica des Rêves, le carnet près du lit, le rituel du soir.\n\nIci, le rêve n'arrive pas par hasard. Il se prépare.",
      ru:"Для Абатона сон — это не бегство от реальности. Это дверь к ней.\n\nСон понимается как язык — пространство общения между бодрствующим сознанием и более тонкими измерениями бытия. Место, где вопросы находят ответы, рождаются интуитивные озарения, проясняются направления.\n\nВсё в Абатоне продумано так, чтобы оберегать это пространство: ночная тишина, Селфика Снов, блокнот у кровати, вечерний ритуал.\n\nЗдесь сон не просто случается. Он готовится.",
      dreamReading:true,
    },
  };
  if(sub==="camere"&&roomDetail) return(
    <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
      <div style={{position:"sticky",top:0,zIndex:50,padding:"32px 28px 24px",background:C.white,borderRadius:"0 0 32px 32px",boxShadow:C.shadow,marginBottom:"8px",overflow:"hidden"}}><HeaderRosone/>
        <Back label={t.back} onClick={()=>setRoomDetail(null)}/>
        <div style={{marginTop:"16px"}}><div style={{fontFamily:FD,fontSize:"34px",fontWeight:"300",color:roomDetail.acc}}>{roomDetail.name}</div></div>
      </div>
      <div style={{padding:"24px 22px 0"}}>
        <RoomExplorer room={roomDetail} lang={lang}/>
        <WhiteCard style={{marginTop:"20px"}}>
          <div style={{fontSize:"16.5px",color:C.textS,lineHeight:"1.8",fontWeight:"400",whiteSpace:"pre-line"}}>{LS(roomDetail,"desc",lang)}</div>
        </WhiteCard>
        {roomDetail.templeImg&&(
          <WhiteCard style={{marginTop:"16px",padding:"0",overflow:"hidden"}}>
            <div style={{display:"flex",overflowX:"auto",scrollSnapType:"x mandatory"}}>
              {(roomDetail.templeImgs||[roomDetail.templeImg]).map((im,i)=>(
                <ZoomImg key={i} src={im} group={roomDetail.templeImgs||[roomDetail.templeImg]} alt={`Sala ${roomDetail.name}`} style={{flex:"0 0 100%",width:"100%",height:"200px",objectFit:"cover",scrollSnapAlign:"start"}}/>
              ))}
            </div>
            <div style={{padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"10px"}}>
              <div style={{fontSize:"14.5px",color:C.textM,fontFamily:FB,fontStyle:"italic"}}>
                {lang==="it"?`La Sala ${roomDetail.name} nei Templi dell'Umanità`:lang==="de"?`Der Saal der ${roomDetail.name} in den Tempeln der Menschheit`:lang==="fr"?`La Salle des ${roomDetail.name} dans les Temples de l'Humanité`:lang==="ru"?`Зал ${roomDetail.name} в Храмах Человечества`:`The Hall of ${roomDetail.name} in the Temples of Humanity`}
              </div>
              {roomDetail.templeUrl&&(
                <ExtLink href={roomDetail.templeUrl} lang={lang} style={{display:"inline-block",padding:"7px 14px",background:`${roomDetail.acc}18`,border:`1px solid ${roomDetail.acc}44`,borderRadius:"20px",color:roomDetail.acc,textDecoration:"none",fontFamily:FB,fontSize:"13.5px",letterSpacing:"0.1em",whiteSpace:"nowrap"}}>
                  {lang==="it"?"Scopri la Sala →":lang==="de"?"Saal entdecken →":lang==="fr"?"Découvrir la salle →":lang==="ru"?"Узнать о зале →":"Discover the Hall →"}
                </ExtLink>
              )}
            </div>
          </WhiteCard>
        )}
      </div>
    </div>
  );
  if(sub==="camere") return(
    <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
      <div style={{position:"sticky",top:0,zIndex:50,padding:"32px 28px 24px",background:C.white,borderRadius:"0 0 32px 32px",boxShadow:C.shadow,marginBottom:"8px",overflow:"hidden"}}><HeaderRosone/>
        <Back label={t.back} onClick={()=>setSub(null)}/>
        <div style={{marginTop:"16px"}}><div style={{fontFamily:FD,fontSize:"34px",fontWeight:"300",color:C.blue}}>{lang==="it"?"Le Cinque Stanze":lang==="de"?"Die fünf Zimmer":lang==="fr"?"Les Cinq Chambres":lang==="ru"?"Пять комнат":"The Five Rooms"}</div></div>
      </div>
      <div style={{padding:"24px 22px 0"}}>
        <WhiteCard style={{background:C.goldPale,marginBottom:"24px"}}>
          <div style={{fontFamily:FD,fontWeight:"500",fontSize:"18px",fontStyle:"italic",color:C.blue,lineHeight:"1.8"}}>
            {lang==="it"
              ?"Ogni stanza è connessa a una sala dei Templi dell'Umanità. I materiali, i dipinti, la Selfica — tutto parla la lingua di quello spazio sacro."
              :lang==="de"
              ?"Jedes Zimmer ist mit einem Saal der Tempel der Menschheit verbunden. Die Materialien, die Gemälde, die Selfica — alles spricht die Sprache dieses heiligen Raums."
              :lang==="fr"
              ?"Chaque chambre est reliée à une salle des Temples de l'Humanité. Les matériaux, les peintures, la Selfica — tout parle le langage de cet espace sacré."
              :lang==="ru"
              ?"Каждая комната связана с залом Храмов Человечества. Материалы, росписи, Селфика — всё говорит на языке этого священного пространства."
              :"Each room is connected to a hall in the Temples of Humanity. The materials, paintings, Selfica — everything speaks the language of that sacred space."}
          </div>
        </WhiteCard>
        {ROOMS_BRIEF.map((r,i)=>(
          <WhiteCard key={i} style={{marginBottom:"16px",padding:"0",overflow:"hidden"}}>
            {r.img&&(
              <div style={{height:"160px",overflow:"hidden",position:"relative"}}>
                <img src={r.img} alt={r.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}} onError={e=>{e.target.style.display="none";}}/>
                <div style={{position:"absolute",inset:0,background:`linear-gradient(to bottom, transparent 40%, ${r.acc}88 100%)`}}/>
                <div style={{position:"absolute",bottom:"12px",left:"16px",fontFamily:FD,fontSize:"28px",color:C.white,textShadow:"0 2px 8px rgba(0,0,0,0.4)"}}>{r.name}</div>
              </div>
            )}
            <div style={{padding:"18px"}}>
              {!r.img&&<div style={{fontFamily:FD,fontSize:"24px",color:r.acc,marginBottom:"10px"}}>{r.sym} {r.name}</div>}
              <div style={{fontSize:"16.5px",color:C.textS,lineHeight:"1.8",fontWeight:"400",whiteSpace:"pre-line"}}>{LS(r,"desc",lang)}</div>
              <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginTop:"14px"}}>
                {ROOM_IMAGES[r.name]&&(
                  <button onClick={()=>setRoomDetail(r)} style={{padding:"8px 16px",background:r.acc,border:"none",borderRadius:"20px",color:C.white,cursor:"pointer",fontFamily:FB,fontSize:"14.5px",letterSpacing:"0.05em"}}>
                    {lang==="it"?"Esplora la stanza →":lang==="de"?"Zimmer erkunden →":lang==="fr"?"Explorer la chambre →":lang==="ru"?"Осмотреть комнату →":"Explore the room →"}
                  </button>
                )}
                {r.templeUrl&&(
                  <ExtLink href={r.templeUrl} lang={lang} style={{display:"inline-block",padding:"8px 16px",background:`${r.acc}18`,border:`1px solid ${r.acc}44`,borderRadius:"20px",color:r.acc,textDecoration:"none",fontFamily:FB,fontSize:"14.5px",letterSpacing:"0.1em"}}>
                    {lang==="it"?"Scopri la Sala →":lang==="de"?"Saal entdecken →":lang==="fr"?"Découvrir la salle →":lang==="ru"?"Узнать о зале →":"Discover the Hall →"}
                  </ExtLink>
                )}
              </div>
            </div>
          </WhiteCard>
        ))}
      </div>
    </div>
  );
  if(sub) {
    const sc = subContent[sub];
    const label = SUBS.find(s=>s.id===sub);
    return(
      <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
        <div style={{position:"sticky",top:0,zIndex:50,padding:"32px 28px 24px",background:C.white,borderRadius:"0 0 32px 32px",boxShadow:C.shadow,marginBottom:"8px",overflow:"hidden"}}><HeaderRosone/>
          <Back label={t.back} onClick={()=>setSub(null)}/>
          <div style={{marginTop:"16px"}}>
            <Pill color={label.color}>{LS(label,"label",lang)}</Pill>
            <div style={{fontFamily:FD,fontSize:"34px",fontWeight:"300",color:C.blue,marginTop:"10px"}}>{LS(label,"label",lang)}</div>
          </div>
        </div>
        <div style={{padding:"24px 22px 0"}}>
          {sub==="living" ? (
            <div style={{marginBottom:"16px"}}><RoomExplorer room={{name:"Living"}} lang={lang}/></div>
          ) : sc&&sc.img&&(
            <div style={{borderRadius:"20px",overflow:"hidden",marginBottom:"16px",boxShadow:C.shadow}}>
              <img src={sc.img} alt={LS(label,"label",lang)} style={{width:"100%",height:"200px",objectFit:"cover"}} onError={e=>{e.target.parentElement.style.display="none";}}/>
            </div>
          )}
          {sub==="tempio"&&<img src="/temple/fregio.jpg" alt="" style={{width:"100%",height:"56px",objectFit:"cover",borderRadius:"14px",marginBottom:"14px",boxShadow:C.shadow,display:"block"}}/>}
          <WhiteCard>
            <div style={{fontSize:"17.5px",color:C.textS,lineHeight:"1.9",fontWeight:"400",whiteSpace:"pre-line"}}>{sc?cx(sc[lang]||sc.it):""}</div>
          </WhiteCard>
          {sc&&sc.link&&(
            <ExtLink href={sc.link} lang={lang} style={{display:"block",marginTop:"12px",padding:"14px 20px",background:C.white,borderRadius:"16px",color:C.goldD,textDecoration:"none",fontFamily:FB,fontSize:"14.5px",boxShadow:C.shadow,textAlign:"center"}}>
              {LS(sc,"linkLabel",lang)}
            </ExtLink>
          )}
          {sc&&sc.gallery&&(
            <div style={{display:"flex",gap:"10px",marginTop:"12px",overflowX:"auto",paddingBottom:"4px"}}>
              {sc.gallery.map((img,i)=>(
                <div key={i} style={{flexShrink:0,borderRadius:"16px",overflow:"hidden",width:"260px",height:"170px",boxShadow:C.shadow,border:`1.5px solid ${C.gold}66`}}>
                  <ZoomImg src={img} group={sc.gallery} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
              ))}
            </div>
          )}
          {sub==="sogno"&&sc&&sc.dreamReading&&(
            <div style={{background:C.goldPale,borderRadius:"20px",padding:"22px",border:`1px solid ${C.gold}33`}}>
              <div style={{fontFamily:FD,fontWeight:"500",fontSize:"22px",color:C.goldD,marginBottom:"10px"}}>{lang==="it"?"Lettura dei Sogni":lang==="de"?"Traumdeutung":lang==="fr"?"Lecture des Rêves":lang==="ru"?"Толкование снов":"Dream Reading"}</div>
              <div style={{fontSize:"16.5px",color:C.textS,lineHeight:"1.8",marginBottom:"16px"}}>
                {lang==="it"
                  ?"Vuoi approfondire il significato dei sogni che stai vivendo durante questo soggiorno?\n\nÈ possibile richiedere una sessione di lettura dei sogni con un esperto della comunità di Damanhur. I sogni hanno un linguaggio simbolico e personale — un sguardo esterno può aiutare a riconoscerne il messaggio."
                  :lang==="de"
                  ?"Möchtest du die Bedeutung der Träume vertiefen, die du während dieses Aufenthalts erlebst?\n\nEs ist möglich, eine Traumdeutungs-Sitzung mit einem Experten der Damanhur-Gemeinschaft anzufragen. Träume haben eine symbolische, persönliche Sprache — ein Blick von außen kann helfen, ihre Botschaft zu erkennen."
                  :lang==="fr"
                  ?"Souhaites-tu approfondir le sens des rêves que tu vis pendant ce séjour ?\n\nIl est possible de demander une séance de lecture des rêves avec un expert de la communauté de Damanhur. Les rêves ont un langage symbolique et personnel — un regard extérieur peut aider à en reconnaître le message."
                  :lang==="ru"
                  ?"Хотите глубже понять смысл снов, которые видите во время этого пребывания?\n\nВы можете запросить сеанс толкования снов с экспертом сообщества Даманхур. Сны говорят на символическом, личном языке — взгляд со стороны может помочь распознать их послание."
                  :"Would you like to explore the meaning of the dreams you are experiencing during this stay?\n\nA dream reading session with a Damanhur community expert is available on request. Dreams have a symbolic, personal language — an outside perspective can help recognize their message."}
              </div>
              <button onClick={()=>setPage("concierge")} style={{padding:"12px 20px",background:C.gold,border:"none",borderRadius:"14px",color:C.white,cursor:"pointer",fontFamily:FB,fontSize:"15.5px",letterSpacing:"0.1em",textTransform:"uppercase"}}>
                {lang==="it"?"Richiedi una lettura →":lang==="de"?"Eine Deutung anfragen →":lang==="fr"?"Demander une lecture →":lang==="ru"?"Запросить толкование →":"Request a reading →"}
              </button>
              <div style={{background:C.card,borderRadius:"20px",padding:"22px",border:`1px solid ${C.border}`,marginTop:"12px"}}>
                <div style={{fontFamily:FD,fontWeight:"500",fontSize:"20px",color:C.goldD,marginBottom:"10px"}}>{lang==="it"?"Lo Schema Teco":lang==="de"?"Das Teco-Schema":lang==="fr"?"Le Schéma Teco":lang==="ru"?"Схема Теко":"The Teco Schema"}</div>
                <div style={{borderRadius:"16px",overflow:"hidden",marginBottom:"14px",boxShadow:C.shadow}}>
                  <img src="/rooms/schema-sogni.jpg" alt="Schema Teco" style={{width:"100%",display:"block"}}/>
                </div>
                {(() => {
                  const TECO = {
                    it:{intro:"È possibile acquistare lo Schema Teco per portare questa esperienza con te, anche a casa. Disponibile in due preparazioni:",
                      items:[
                        {title:"Prima preparazione",desc:"Lo schema viene collegato alla frequenza personale della persona."},
                        {title:"Seconda preparazione",desc:"Lo schema viene preparato direttamente nel Tempio, cucendo alla frequenza della persona una connessione energetica con il Tempio stesso."},
                      ],
                      outro:"Contatta il personale per informazioni o per richiedere il tuo."},
                    de:{intro:"Sie können das Teco-Schema erwerben, um diese Erfahrung mit nach Hause zu nehmen. In zwei Versionen erhältlich:",
                      items:[
                        {title:"Erste Zubereitung",desc:"Das Schema wird mit der persönlichen Frequenz der Person verbunden."},
                        {title:"Zweite Zubereitung",desc:"Das Schema wird direkt im Tempel vorbereitet und verbindet die Frequenz mit einer energetischen Verbindung zum Tempel."},
                      ],
                      outro:"Bitte wenden Sie sich an das Personal."},
                    fr:{intro:"Vous pouvez acquérir le Schéma Teco pour emporter cette expérience chez vous. Disponible en deux préparations:",
                      items:[
                        {title:"Première préparation",desc:"Le schéma est relié à la fréquence personnelle de la personne."},
                        {title:"Deuxième préparation",desc:"Le schéma est préparé directement dans le Temple, tissant à la fréquence de la personne une connexion énergétique avec le Temple."},
                      ],
                      outro:"Contactez le personnel pour plus d'informations."},
                    ru:{intro:"Вы можете приобрести Схему Теко, чтобы унести этот опыт домой. Доступно в двух вариантах:",
                      items:[
                        {title:"Первый вариант",desc:"Схема связывается с личной частотой человека."},
                        {title:"Второй вариант",desc:"Схема подготавливается в Храме, соединяя частоту человека с энергетической связью с самим Храмом."},
                      ],
                      outro:"Обратитесь к персоналу за информацией."},
                    en:{intro:"You can purchase the Teco Schema to bring this experience home with you. Available in two preparations:",
                      items:[
                        {title:"First preparation",desc:"The schema is connected to the personal frequency of the person."},
                        {title:"Second preparation",desc:"The schema is prepared directly in the Temple, weaving into the person's frequency an energetic connection with the Temple itself."},
                      ],
                      outro:"Contact the staff for information or to request yours."},
                  };
                  const tk = TECO[lang]||TECO.en;
                  return (
                    <>
                      <div style={{fontSize:"16.5px",color:C.textS,lineHeight:"1.8",marginBottom:"14px"}}>{tk.intro}</div>
                      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"14px"}}>
                        {tk.items.map((item,i)=>(
                          <div key={i} style={{background:C.goldPale,borderRadius:"14px",padding:"14px 16px"}}>
                            <div style={{fontFamily:FB,fontSize:"13.5px",fontWeight:"600",color:C.goldD,letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:"5px"}}>{i+1}. {item.title}</div>
                            <div style={{fontSize:"15.5px",color:C.textS,lineHeight:"1.6"}}>{item.desc}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{fontSize:"16.5px",color:C.textS,lineHeight:"1.8"}}>{tk.outro}</div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return(
    <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
      <div style={{position:"sticky",top:0,zIndex:50,padding:"32px 28px 24px",background:C.white,borderRadius:"0 0 32px 32px",boxShadow:C.shadow,marginBottom:"8px",overflow:"hidden"}}><HeaderRosone/>
        <Back label={t.back} onClick={()=>setPage("home")}/>
        <div style={{marginTop:"16px"}}>
          <Pill>Abaton Sacred Dreams</Pill>
          <div style={{fontFamily:FD,fontSize:"36px",fontWeight:"300",color:C.blue,marginTop:"10px",lineHeight:"1.1"}}>{lang==="it"?"Un campo intelligente":lang==="de"?"Ein intelligentes Feld":lang==="fr"?"Un champ intelligent":lang==="ru"?"Разумное поле":"An intelligent field"}</div>
        </div>
      </div>
      <div style={{padding:"24px 22px 0"}}>
        <WhiteCard style={{background:C.goldPale,marginBottom:"28px"}}>
          <div style={{fontFamily:FD,fontWeight:"500",fontSize:"18px",fontStyle:"italic",color:C.blue,lineHeight:"1.8"}}>
            {lang==="it"
              ?"L'Abaton non è stato concepito come una semplice struttura ricettiva, ma come un campo intelligente, un ambiente vivo capace di sostenere l'essere umano nel ricordare chi è."
              :lang==="de"
              ?"Das Abaton wurde nicht als einfache Unterkunft konzipiert, sondern als intelligentes Feld, eine lebendige Umgebung, die den Menschen dabei unterstützt, sich daran zu erinnern, wer er ist."
              :lang==="fr"
              ?"L'Abaton n'a pas été conçu comme une simple structure d'accueil, mais comme un champ intelligent, un environnement vivant capable de soutenir l'être humain dans le fait de se souvenir de qui il est."
              :lang==="ru"
              ?"Абатон задуман не как обычное средство размещения, а как разумное поле, живая среда, способная поддержать человека в том, чтобы вспомнить, кто он есть."
              :"Abaton was not conceived as a simple accommodation, but as an intelligent field, a living environment capable of supporting the human being in remembering who they are."}
          </div>
        </WhiteCard>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
          {SUBS.map(s=>(
            <button key={s.id} onClick={()=>setSub(s.id)} style={{padding:"22px 18px",background:C.white,borderRadius:"20px",border:"none",cursor:"pointer",textAlign:"left",boxShadow:C.shadow,fontFamily:FB}}>
              <div style={{fontSize:"28px",color:s.color,marginBottom:"10px"}}>{s.sym}</div>
              <div style={{fontSize:"16.5px",fontWeight:"500",color:C.blue,lineHeight:"1.3"}}>{LS(s,"label",lang)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DAMANHUR ──────────────────────────────────────────────────────────────────
function DamanPage({t,lang,setPage}) {
  const [sub,setSub] = useState(null);
  useEffect(()=>{ scrollTop0(); },[sub]);
  const COMMUNITIES = [
    {id:"damjl", sym:"◎", color:C.blue, labelIT:"Damjl", labelEN:"Damjl", labelDE:"Damjl", labelFR:"Damjl", labelRU:"Дамжл",
      descIT:"Capitale storica e spirituale di Damanhur. Qui si trovano il Tempio aperto ai visitatori, i circuiti percorribili, laboratori e negozi damanhuriani, assemblee e vita collettiva. Ospita anche il Somachandra, la tavola calda damanhuriana — luogo di incontro e scambio autentico. Via Pramarzo 3, Baldissero Canavese.",
      descEN:"The historic and spiritual capital of Damanhur. Home to the open Temple, walkable circuits, Damanhurian workshops and shops, assemblies and collective life. Also hosts the Somachandra — the Damanhurian canteen, a true meeting and exchange point. Via Pramarzo 3, Baldissero Canavese.",
      descDE:"Die historische und spirituelle Hauptstadt von Damanhur. Hier befinden sich der für Besucher geöffnete Tempel, begehbare Rundgänge, damanhurianische Werkstätten und Geschäfte, Versammlungen und gemeinschaftliches Leben. Hier befindet sich auch das Somachandra, die damanhurianische Kantine — ein Ort echter Begegnung und Austausch. Via Pramarzo 3, Baldissero Canavese.",
      descFR:"Capitale historique et spirituelle de Damanhur. On y trouve le Temple ouvert aux visiteurs, les circuits praticables, les ateliers et boutiques damanhuriens, les assemblées et la vie collective. Elle abrite aussi le Somachandra, la cantine damanhurienne — lieu de rencontre et d'échange authentique. Via Pramarzo 3, Baldissero Canavese.",
      descRU:"Историческая и духовная столица Даманхура. Здесь находится Храм, открытый для посетителей, проходимые тоннели, дамантурские мастерские и магазины, собрания и коллективная жизнь. Здесь же расположена Сомачандра — дамантурская столовая, место подлинных встреч и общения. Via Pramarzo 3, Baldissero Canavese.",
      url:"https://damjl.org/chisiamo/",img:"/damanhur/damjl.jpg"},
    {id:"etulte", sym:"🌲", color:"#4A7A4A", labelIT:"Etulte", labelEN:"Etulte", labelDE:"Etulte", labelFR:"Etulte", labelRU:"Этульте",
      descIT:"La comunità che custodisce l'area del Tempio, il bosco sacro e il territorio naturale che circonda Damanhur. Guardiani dell'ecosistema energetico: vivono in stretta relazione con la terra, gli alberi e gli animali selvatici, mantenendo vivo il campo naturale che sostiene l'intera Federazione.",
      descEN:"The community that cares for the Temple area, the sacred woods and the natural territory surrounding Damanhur. Guardians of the energetic ecosystem: they live in close relationship with the land, trees and wild animals, keeping alive the natural field that sustains the entire Federation.",
      descDE:"Die Gemeinschaft, die das Tempelgebiet, den heiligen Wald und das natürliche Gebiet rund um Damanhur hütet. Hüter des energetischen Ökosystems: Sie leben in enger Beziehung zu Erde, Bäumen und Wildtieren und halten das natürliche Feld lebendig, das die gesamte Föderation trägt.",
      descFR:"La communauté qui garde la zone du Temple, la forêt sacrée et le territoire naturel entourant Damanhur. Gardiens de l'écosystème énergétique : ils vivent en relation étroite avec la terre, les arbres et les animaux sauvages, maintenant vivant le champ naturel qui soutient toute la Fédération.",
      descRU:"Сообщество, хранящее территорию Храма, священный лес и природные земли вокруг Даманхура. Хранители энергетической экосистемы: они живут в тесной связи с землёй, деревьями и дикими животными, поддерживая живым природное поле, питающее всю Федерацию.",
      url:"https://www.etulte.it/",img:"/damanhur/etulte.jpg"},
    {id:"arca", sym:"〰", color:C.blueM, labelIT:"Arca Tentyris", labelEN:"Arca Tentyris", labelDE:"Arca Tentyris", labelFR:"Arca Tentyris", labelRU:"Арка Тентирис",
      descIT:"Pionieri di modelli sociali alternativi. La comunità è collegata all'elemento acqua, al principio femminile e all'innovazione. Un laboratorio vivente di nuove forme di vita collettiva, ricerca creativa e soluzioni per il futuro.",
      descEN:"Pioneers of alternative social models. The community is connected to the water element, the feminine principle and innovation. A living laboratory of new forms of collective life, creative research and solutions for the future.",
      descDE:"Pioniere alternativer Gesellschaftsmodelle. Die Gemeinschaft ist mit dem Element Wasser, dem weiblichen Prinzip und der Innovation verbunden. Ein lebendiges Labor für neue Formen kollektiven Lebens, kreativer Forschung und Zukunftslösungen.",
      descFR:"Pionniers de modèles sociaux alternatifs. La communauté est liée à l'élément eau, au principe féminin et à l'innovation. Un laboratoire vivant de nouvelles formes de vie collective, de recherche créative et de solutions pour l'avenir.",
      descRU:"Первопроходцы альтернативных социальных моделей. Сообщество связано со стихией воды, женским началом и инновациями. Живая лаборатория новых форм коллективной жизни, творческих исследований и решений для будущего.",
      url:"https://www.arca.tentyris.it/",img:"/damanhur/arca-tentyris.jpg"},
    {id:"oropan", sym:"🌾", color:"#7A6030", labelIT:"Oro Pan", labelEN:"Oro Pan", labelDE:"Oro Pan", labelFR:"Oro Pan", labelRU:"Оро Пан",
      descIT:"La comunità dell'allevamento e dell'agricoltura. Porta avanti la connessione profonda tra essere umano, terra e animali. Il cibo è un atto sacro: prodotto con rispetto, consumato con consapevolezza. Le Terre di Oro Pan accolgono pascoli, orti e animali vissuti come compagni di vita.",
      descEN:"The community of animal husbandry and agriculture. Carries forward the deep connection between human beings, land and animals. Food is a sacred act: produced with respect, consumed with awareness. The Oro Pan lands host pastures, gardens and animals lived with as companions.",
      descDE:"Die Gemeinschaft der Tierhaltung und Landwirtschaft. Sie pflegt die tiefe Verbindung zwischen Mensch, Erde und Tieren. Essen ist ein heiliger Akt: mit Respekt erzeugt, mit Bewusstsein verzehrt. Die Ländereien von Oro Pan beherbergen Weiden, Gärten und Tiere, die als Lebensgefährten betrachtet werden.",
      descFR:"La communauté de l'élevage et de l'agriculture. Elle porte la connexion profonde entre l'être humain, la terre et les animaux. La nourriture est un acte sacré : produite avec respect, consommée avec conscience. Les Terres d'Oro Pan accueillent pâturages, potagers et animaux vécus comme des compagnons de vie.",
      descRU:"Сообщество животноводства и земледелия. Оно поддерживает глубокую связь между человеком, землёй и животными. Еда — священный акт: производится с уважением, потребляется осознанно. Земли Оро Пан включают пастбища, огороды и животных, которых воспринимают как спутников жизни.",
      url:"https://terredioropan.it/",img:"/damanhur/oropan.jpg"},
  ];
  const DAMANSUBSECTIONS = [
    {id:"templi",  sym:"✦", color:C.gold,  labelIT:"I Templi dell'Umanità",  labelEN:"Temples of Humanity",  labelDE:"Die Tempel der Menschheit",  labelFR:"Les Temples de l'Humanité",  labelRU:"Храмы Человечества"},
    {id:"crea",    sym:"◈", color:C.goldD, labelIT:"Damanhur Crea",           labelEN:"Damanhur Crea",         labelDE:"Damanhur Crea",              labelFR:"Damanhur Crea",              labelRU:"Damanhur Crea"},
    {id:"academy", sym:"⊕", color:C.blueM, labelIT:"Studia con Noi",          labelEN:"Study with Us",         labelDE:"Bei uns lernen",              labelFR:"Étudier avec nous",          labelRU:"Учиться с нами"},
    {id:"blog",    sym:"⊙", color:C.textS, labelIT:"Community & Blog",         labelEN:"Community & Blog",      labelDE:"Community & Blog",           labelFR:"Community & Blog",           labelRU:"Community & Blog"},
    {id:"valle",   sym:"🌿",color:"#4A7A4A",labelIT:"Val Chiusella",            labelEN:"Val Chiusella",         labelDE:"Val Chiusella",              labelFR:"Val Chiusella",              labelRU:"Валь-Кьюзелла"},
  ];
  const SUBCONTENT = {
    templi:{
      img:"/damanhur/tempio-1.jpg",
      it:"Nove sale sotterranee create interamente a mano — affreschi, mosaici, sculture, vetrate. Trent'anni di lavoro collettivo. National Geographic le ha definite 'la Cappella Sistina dei tempi moderni'.\n\nLe sale: Vittoria, Terra, Metalli, Tempio Azzurro, Labirinto, Acqua, Sfere, Specchi.\n\nDamanhur sta lavorando all'espansione: nuove sale, nuovi livelli, nuove connessioni. Un'opera che continua.\n\nVisita guidata ogni giorno — chiedici in reception.",
      en:"Nine underground halls entirely hand-created — frescoes, mosaics, sculptures, stained glass. Thirty years of collective work. National Geographic called them 'the Sistine Chapel of modern times'.\n\nThe halls: Victory, Earth, Metals, Blue Temple, Labyrinth, Water, Spheres, Mirrors.\n\nDamanhur is working on expansion: new halls, new levels, new connections. A work that continues.\n\nGuided tours daily — ask at reception.",
      de:"Neun unterirdische Säle, vollständig von Hand geschaffen — Fresken, Mosaike, Skulpturen, Glasfenster. Dreißig Jahre gemeinschaftlicher Arbeit. National Geographic nannte sie 'die Sixtinische Kapelle der Neuzeit'.\n\nDie Säle: Sieg, Erde, Metalle, Blauer Tempel, Labyrinth, Wasser, Sphären, Spiegel.\n\nDamanhur arbeitet an der Erweiterung: neue Säle, neue Ebenen, neue Verbindungen. Ein Werk, das weitergeht.\n\nGeführte Besichtigung jeden Tag — frag an der Rezeption.",
      fr:"Neuf salles souterraines entièrement créées à la main — fresques, mosaïques, sculptures, vitraux. Trente ans de travail collectif. National Geographic les a qualifiées de 'Chapelle Sixtine des temps modernes'.\n\nLes salles : Victoire, Terre, Métaux, Temple Bleu, Labyrinthe, Eau, Sphères, Miroirs.\n\nDamanhur travaille à l'expansion : nouvelles salles, nouveaux niveaux, nouvelles connexions. Une œuvre qui continue.\n\nVisite guidée tous les jours — demande à la réception.",
      ru:"Девять подземных залов, полностью созданных вручную — фрески, мозаики, скульптуры, витражи. Тридцать лет коллективного труда. National Geographic назвал их «Сикстинской капеллой современности».\n\nЗалы: Победы, Земли, Металлов, Синий Храм, Лабиринт, Воды, Сфер, Зеркал.\n\nДаманхур продолжает расширение: новые залы, новые уровни, новые связи. Работа, которая продолжается.\n\nЭкскурсии проводятся ежедневно — спросите на ресепшен.",
    },
    crea:{
      it:"DamanhurCrea è il cuore pulsante dell'artigianato e della creatività damanhuriana.",
      en:"DamanhurCrea is the beating heart of Damanhurian craftsmanship and creativity.",
      de:"DamanhurCrea ist das pulsierende Herz des damanhurianischen Handwerks und der Kreativität.",
      fr:"DamanhurCrea est le cœur battant de l'artisanat et de la créativité damanhurienne.",
      ru:"DamanhurCrea — это пульсирующее сердце дамантурского ремесла и творчества.",
      links:[
        {name:"Crea Salute",url:"https://www.creasalute.it/",descIT:"Poliambulatorio di medicina integrata: visite ed esami che uniscono la medicina convenzionale a pratiche complementari.",descEN:"Integrated medicine outpatient clinic: consultations and exams combining conventional medicine with complementary practices.",descDE:"Ambulanz für integrative Medizin: Untersuchungen und Behandlungen, die konventionelle Medizin mit komplementären Praktiken verbinden.",descFR:"Cabinet polyvalent de médecine intégrée : consultations et examens combinant médecine conventionnelle et pratiques complémentaires.",descRU:"Поликлиника интегративной медицины: приёмы и обследования, сочетающие традиционную медицину с дополнительными практиками."},
        {name:"Kythera",url:"https://www.kythera.it/",descIT:"Centro estetico. Trattamenti per la cura e la bellezza della persona.",descEN:"Beauty centre. Treatments for personal care and beauty.",descDE:"Kosmetikzentrum. Behandlungen für Körperpflege und Schönheit.",descFR:"Centre esthétique. Soins pour le bien-être et la beauté de la personne.",descRU:"Косметологический центр. Процедуры по уходу за телом и красотой."},
        {name:"Solerà",url:"https://solerasrl.com/",descIT:"Produzione di energia rinnovabile e soluzioni per la sostenibilità ambientale.",descEN:"Renewable energy production and environmental sustainability solutions.",descDE:"Erzeugung erneuerbarer Energie und Lösungen für ökologische Nachhaltigkeit.",descFR:"Production d'énergie renouvelable et solutions pour la durabilité environnementale.",descRU:"Производство возобновляемой энергии и решения для экологической устойчивости."},
        {name:"Tentay Bio",url:"https://www.facebook.com/tentatybio/?locale=it_IT",descIT:"Produzione biologica damanuriana: alimenti, prodotti della terra coltivati con rispetto.",descEN:"Damanhurian organic production: food and earth products grown with care.",descDE:"Damanhurianische Bio-Produktion: Lebensmittel, mit Respekt angebaute Erzeugnisse der Erde.",descFR:"Production biologique damanhurienne : aliments, produits de la terre cultivés avec respect.",descRU:"Дамантурское органическое производство: продукты земли, выращенные с уважением."},
        {name:"Galleria dei Quadri Selfici",url:"https://thetemples.org/it/quadri-selfici/",descIT:"Opere d'arte damanuriane con funzione selfica. Ogni quadro è uno strumento energetico oltre che un'opera visiva. Tel. +39 329 6354724",descEN:"Damanhurian artworks with a selfic function. Each painting is an energetic tool as well as a visual work. Tel. +39 329 6354724",descDE:"Damanhurianische Kunstwerke mit selfischer Funktion. Jedes Gemälde ist neben einem visuellen Werk auch ein energetisches Instrument. Tel. +39 329 6354724",descFR:"Œuvres d'art damanhuriennes à fonction selfique. Chaque tableau est un instrument énergétique autant qu'une œuvre visuelle. Tél. +39 329 6354724",descRU:"Дамантурские произведения искусства с селфической функцией. Каждая картина — не только визуальное произведение, но и энергетический инструмент. Тел. +39 329 6354724"},
        {name:"Salone Olivetti",url:"",descIT:"Lo spazio espositivo e culturale di DamanhurCrea, cuore degli eventi artistici della comunità.",descEN:"The exhibition and cultural space of DamanhurCrea, heart of the community's artistic events.",descDE:"Der Ausstellungs- und Kulturraum von DamanhurCrea, das Herz der künstlerischen Veranstaltungen der Gemeinschaft.",descFR:"L'espace d'exposition et culturel de DamanhurCrea, cœur des événements artistiques de la communauté.",descRU:"Выставочное и культурное пространство DamanhurCrea, сердце художественных мероприятий сообщества."},
        {name:"Arielvo",url:"https://arielvo.it/",descIT:"Cucina biologica, nutriente e consapevole. Cibo vivo preparato con intenzione — il ristorante di DamanhurCrea.",descEN:"Organic, nourishing and conscious cuisine. Living food prepared with intention — DamanhurCrea's restaurant.",descDE:"Biologische, nahrhafte und bewusste Küche. Lebendige Speisen, mit Absicht zubereitet — das Restaurant von DamanhurCrea.",descFR:"Cuisine biologique, nourrissante et consciente. Nourriture vivante préparée avec intention — le restaurant de DamanhurCrea.",descRU:"Органическая, питательная и осознанная кухня. Живая еда, приготовленная с намерением — ресторан DamanhurCrea."},
        {name:"Orocrea",url:"https://orocrea.com/",descIT:"Gioielleria selfica e spirituale. Bracciali, collane, anelli creati con simbolismo e intenzione per il benessere. Tel. +39 333 7769815",descEN:"Selfic and spiritual jewellery. Bracelets, necklaces, rings crafted with symbolism and intention for well-being. Tel. +39 333 7769815",descDE:"Selfischer und spiritueller Schmuck. Armbänder, Halsketten, Ringe, geschaffen mit Symbolik und Absicht für das Wohlbefinden. Tel. +39 333 7769815",descFR:"Bijouterie selfique et spirituelle. Bracelets, colliers, bagues créés avec symbolisme et intention pour le bien-être. Tél. +39 333 7769815",descRU:"Селфические и духовные украшения. Браслеты, ожерелья, кольца, созданные с символикой и намерением для благополучия. Тел. +39 333 7769815"},
        {name:"SelEt",url:"https://shop.selfica.space/?shpxid=2b658e62-a31b-4162-9b63-a831a98c9933",descIT:"Strumenti selfici, tra cui le bottiglie per l'armonizzazione dell'acqua che trovi nella tua stanza. Tel. +39 351 3774461",descEN:"Selfic tools, including the water-harmonising bottles you find in your room. Tel. +39 351 3774461",descDE:"Selfische Instrumente, darunter die Flaschen zur Wasserharmonisierung, die du in deinem Zimmer findest. Tel. +39 351 3774461",descFR:"Instruments selfiques, dont les bouteilles d'harmonisation de l'eau que tu trouves dans ta chambre. Tél. +39 351 3774461",descRU:"Селфические инструменты, включая бутылки для гармонизации воды, которые вы найдёте в своей комнате. Тел. +39 351 3774461"},
        {name:"Damanhur Shop",url:"https://damanhur.shop/it",descIT:"Il negozio di gadget e oggettistica damanhuriana. Tel. +39 329 6354724",descEN:"The shop for Damanhurian gadgets and merchandise. Tel. +39 329 6354724",descDE:"Der Laden für damanhurianische Gadgets und Objekte. Tel. +39 329 6354724",descFR:"La boutique de gadgets et d'objets damanhuriens. Tél. +39 329 6354724",descRU:"Магазин дамантурских сувениров и аксессуаров. Тел. +39 329 6354724"},
        {name:"Plant Music",url:"https://www.plantmusic.com/it/",descIT:"La musica delle piante: dispositivi che traducono i segnali elettrici delle piante in suono. Tel. +39 329 6354724",descEN:"Music from plants: devices that translate plants' electrical signals into sound. Tel. +39 329 6354724",descDE:"Die Musik der Pflanzen: Geräte, die die elektrischen Signale der Pflanzen in Klang übersetzen. Tel. +39 329 6354724",descFR:"La musique des plantes : des appareils qui traduisent les signaux électriques des plantes en son. Tél. +39 329 6354724",descRU:"Музыка растений: устройства, преобразующие электрические сигналы растений в звук. Тел. +39 329 6354724"},
        {name:"Cobra Statuette",url:"https://cobralloro.com/",descIT:"Laboratorio di pietre levigate, sculture e sfere energetiche. Tel. +39 348 5155710",descEN:"Workshop for polished stones, sculptures and energy spheres. Tel. +39 348 5155710",descDE:"Werkstatt für polierte Steine, Skulpturen und Energiekugeln. Tel. +39 348 5155710",descFR:"Atelier de pierres polies, sculptures et sphères énergétiques. Tél. +39 348 5155710",descRU:"Мастерская отшлифованных камней, скульптур и энергетических сфер. Тел. +39 348 5155710"},
        {name:"Welcome Center",url:"https://damanhur.travel/it/",descIT:"Il punto di riferimento per visite, soggiorni ed esperienze a Damanhur.",descEN:"The reference point for visits, stays and experiences at Damanhur.",descDE:"Die Anlaufstelle für Besuche, Aufenthalte und Erlebnisse in Damanhur.",descFR:"Le point de référence pour les visites, séjours et expériences à Damanhur.",descRU:"Основной пункт для посещений, проживания и впечатлений в Даманхуре."},
      ],
    },
    academy:{
      it:"La Damanhur Academy offre percorsi di formazione nella visione filosofica e spirituale di Damanhur. Corsi residenziali, workshop tematici, percorsi di ricerca.\n\nWisdom Lab — Le Lezioni Video\nUna serie di lezioni e conferenze registrate dai pensatori di Damanhur, disponibili per approfondire la filosofia, la pratica selfica e la visione del futuro.\n\nPer informazioni sui percorsi:\nwelcome@damanhur.it · +39 320 482 4427",
      en:"The Damanhur Academy offers training programs in Damanhur's philosophical and spiritual vision. Residential courses, thematic workshops, research paths.\n\nWisdom Lab — Video Lessons\nA series of recorded lectures and conferences by Damanhur's thinkers, available to deepen the philosophy, selfica practice and vision of the future.\n\nFor information on programs:\nwelcome@damanhur.it · +39 320 482 4427",
      de:"Die Damanhur Academy bietet Ausbildungswege in der philosophischen und spirituellen Vision von Damanhur. Residenzkurse, thematische Workshops, Forschungswege.\n\nWisdom Lab — Die Videolektionen\nEine Reihe aufgezeichneter Vorlesungen und Konferenzen der Damanhur-Denker, verfügbar, um die Philosophie, die selfische Praxis und die Zukunftsvision zu vertiefen.\n\nFür Informationen zu den Kursen:\nwelcome@damanhur.it · +39 320 482 4427",
      fr:"La Damanhur Academy propose des parcours de formation dans la vision philosophique et spirituelle de Damanhur. Cours résidentiels, ateliers thématiques, parcours de recherche.\n\nWisdom Lab — Les Leçons Vidéo\nUne série de leçons et conférences enregistrées par les penseurs de Damanhur, disponibles pour approfondir la philosophie, la pratique selfique et la vision de l'avenir.\n\nPour toute information sur les parcours :\nwelcome@damanhur.it · +39 320 482 4427",
      ru:"Damanhur Academy предлагает образовательные программы в философском и духовном видении Даманхура. Очные курсы, тематические семинары, исследовательские программы.\n\nWisdom Lab — Видеолекции\nСерия записанных лекций и конференций мыслителей Даманхура, доступных для углубления философии, селфической практики и видения будущего.\n\nЗа информацией о программах обращайтесь:\nwelcome@damanhur.it · +39 320 482 4427",
      link:"https://members.damanhur.academy/",linkLabelIT:"Sito Damanhur Academy →",linkLabelEN:"Damanhur Academy website →",linkLabelDE:"Damanhur Academy Website →",linkLabelFR:"Site de la Damanhur Academy →",linkLabelRU:"Сайт Damanhur Academy →",
    },
    blog:{
      img:"/damanhur/bosco-sacro.jpg",
      it:"Damanhur Community è la piattaforma online del Popolo di Damanhur, aperta a chiunque voglia restare in contatto anche da lontano.\n\nVi si trovano articoli di approfondimento, podcast, il calendario completo degli eventi (anche online), gruppi tematici e le iniziative delle comunità Damanhur nel mondo — un modo semplice per continuare il viaggio iniziato qui anche dopo il soggiorno.",
      en:"Damanhur Community is the People of Damanhur's online platform, open to anyone who wants to stay connected even from afar.\n\nYou'll find in-depth articles, podcasts, the full events calendar (including online events), thematic groups and the initiatives of Damanhur communities around the world — an easy way to continue the journey you started here, even after your stay.",
      de:"Damanhur Community ist die Online-Plattform des Volkes von Damanhur, offen für alle, die auch aus der Ferne in Verbindung bleiben möchten.\n\nHier findest du vertiefende Artikel, Podcasts, den vollständigen Veranstaltungskalender (auch online), thematische Gruppen und die Initiativen der Damanhur-Gemeinschaften weltweit — eine einfache Möglichkeit, die hier begonnene Reise auch nach deinem Aufenthalt fortzusetzen.",
      fr:"Damanhur Community est la plateforme en ligne du Peuple de Damanhur, ouverte à tous ceux qui souhaitent rester en contact même à distance.\n\nVous y trouverez des articles approfondis, des podcasts, le calendrier complet des événements (y compris en ligne), des groupes thématiques et les initiatives des communautés Damanhur dans le monde — une façon simple de poursuivre le voyage commencé ici, même après votre séjour.",
      ru:"Damanhur Community — это онлайн-платформа Народа Даманхура, открытая для всех, кто хочет оставаться на связи даже на расстоянии.\n\nЗдесь вы найдёте подробные статьи, подкасты, полный календарь событий (в том числе онлайн), тематические группы и инициативы сообществ Даманхура по всему миру — простой способ продолжить путешествие, начатое здесь, даже после отъезда.",
    },
    media:{it:"",en:"",de:"",fr:"",ru:""},
    valle:{
      img:"/damanhur/valchiusella.jpg",
      it:"La Val Chiusella, insieme alla Valle Sacra, è il territorio che ospita Damanhur. Queste valli piemontesi custodiscono non solo una natura straordinaria, ma anche il cuore pulsante di una delle comunità spirituali più originali del mondo.",
      en:"Val Chiusella, together with the Sacred Valley, is the territory that is home to Damanhur. These Piedmontese valleys shelter not only extraordinary nature, but the living heart of one of the world's most original spiritual communities.",
      de:"Das Val Chiusella bildet zusammen mit dem Heiligen Tal das Gebiet, in dem Damanhur beheimatet ist. Diese piemontesischen Täler bergen nicht nur eine außergewöhnliche Natur, sondern auch das pulsierende Herz einer der originellsten spirituellen Gemeinschaften der Welt.",
      fr:"La Val Chiusella, avec la Vallée Sacrée, est le territoire qui abrite Damanhur. Ces vallées piémontaises abritent non seulement une nature extraordinaire, mais aussi le cœur battant de l'une des communautés spirituelles les plus originales du monde.",
      ru:"Валь-Кьюзелла вместе со Священной долиной — территория, где находится Даманхур. Эти пьемонтские долины хранят не только удивительную природу, но и пульсирующее сердце одного из самых самобытных духовных сообществ мира.",
      link:"http://www.valchiusella360.it",linkLabelIT:"Scopri Valchiusella360.it →",linkLabelEN:"Discover Valchiusella360.it →",linkLabelDE:"Valchiusella360.it entdecken →",linkLabelFR:"Découvrir Valchiusella360.it →",linkLabelRU:"Узнать больше на Valchiusella360.it →",
    },
  };
  const VALPLACES = [
    {n:"Monti Pelati",url:gmaps("Riserva Naturale Speciale dei Monti Pelati e della Balma"),d:{it:"Riserva naturale con rocce di magnesite. Al tramonto sembrano brillare.",en:"Nature reserve with magnesite rocks. They glow at sunset.",de:"Naturschutzgebiet mit Magnesitfelsen. Bei Sonnenuntergang scheinen sie zu leuchten.",fr:"Réserve naturelle aux roches de magnésite. Elles semblent briller au coucher du soleil.",ru:"Природный заповедник с магнезитовыми скалами. На закате они словно светятся."},em:"⛰"},
    {n:"Chiusella — Le Guje",url:gmaps("Le Guje, Traversella"),d:{it:"Pozze smeraldo tra i boschi. Fredda e rigenerante.",en:"Emerald pools amid woodland. Cold and regenerating.",de:"Smaragdgrüne Wasserbecken inmitten der Wälder. Kalt und erfrischend.",fr:"Bassins émeraude au cœur des bois. Froids et régénérants.",ru:"Изумрудные заводи среди лесов. Холодные и освежающие."},em:"〰"},
    {n:"Borgofranco d'Ivrea",url:gmaps("Borgofranco d'Ivrea"),d:{it:"Cittadina storica. Mercato, gastronomia, Anfiteatro Morenico.",en:"Historic town. Market, gastronomy, Glacial Amphitheater.",de:"Historisches Städtchen. Markt, Gastronomie, Moränenamphitheater.",fr:"Petite ville historique. Marché, gastronomie, Amphithéâtre morainique.",ru:"Исторический городок. Рынок, гастрономия, ледниковый амфитеатр."},em:"🏘"},
    {n:"Lago Sirio",url:gmaps("Lago Sirio, Ivrea"),d:{it:"Piccolo lago glaciale a Ivrea.",en:"Small glacial lake near Ivrea.",de:"Kleiner Gletschersee bei Ivrea.",fr:"Petit lac glaciaire près d'Ivrea.",ru:"Небольшое ледниковое озеро близ Ивреи."},em:"💧"},
    {n:{it:"Punti Utili",en:"Useful Points",de:"Nützliche Anlaufstellen",fr:"Points Utiles",ru:"Полезные места"},d:{
      it:"Servizi pratici nei dintorni, sempre a portata di mano.",
      en:"Practical services nearby, always at hand.",
      de:"Praktische Dienstleistungen in der Nähe, immer griffbereit.",
      fr:"Services pratiques à proximité, toujours à portée de main.",
      ru:"Практичные услуги поблизости, всегда под рукой."
    },em:"📍",
    expanded:true,
    list:[
      {cat:{it:"Farmacia",en:"Pharmacy",de:"Apotheke",fr:"Pharmacie",ru:"Аптека"},items:[
        {name:{it:"Farmacia più vicina",en:"Nearest pharmacy",de:"Nächste Apotheke",fr:"Pharmacie la plus proche",ru:"Ближайшая аптека"},url:gmaps("farmacia vicino a Vidracco"),note:""},
      ]},
      {cat:{it:"Bancomat",en:"ATM",de:"Geldautomat",fr:"Distributeur",ru:"Банкомат"},items:[
        {name:{it:"Bancomat più vicino",en:"Nearest ATM",de:"Nächster Geldautomat",fr:"Distributeur le plus proche",ru:"Ближайший банкомат"},url:gmaps("bancomat vicino a Vidracco"),note:""},
      ]},
      {cat:{it:"Taxi",en:"Taxi",de:"Taxi",fr:"Taxi",ru:"Такси"},items:[
        {name:{it:"Taxi / NCC nella zona",en:"Taxi / private driver nearby",de:"Taxi / Fahrdienst in der Nähe",fr:"Taxi / VTC dans la zone",ru:"Такси поблизости"},url:gmaps("taxi vicino a Vidracco"),note:""},
      ]},
      {cat:{it:"Supermercato",en:"Supermarket",de:"Supermarkt",fr:"Supermarché",ru:"Супермаркет"},items:[
        {name:{it:"Supermercato più vicino",en:"Nearest supermarket",de:"Nächster Supermarkt",fr:"Supermarché le plus proche",ru:"Ближайший супермаркет"},url:gmaps("supermercato vicino a Vidracco"),note:""},
      ]},
      {cat:{it:"Benzina",en:"Petrol station",de:"Tankstelle",fr:"Station-service",ru:"АЗС"},items:[
        {name:{it:"Distributore più vicino",en:"Nearest petrol station",de:"Nächste Tankstelle",fr:"Station-service la plus proche",ru:"Ближайшая заправка"},url:gmaps("distributore di benzina vicino a Vidracco"),note:""},
      ]},
    ]},
    {n:{it:"Guide ed Escursioni",en:"Guided Tours & Excursions",de:"Geführte Touren & Ausflüge",fr:"Visites Guidées & Excursions",ru:"Экскурсии и прогулки"},d:{
      it:"Visite guidate, escursioni di gruppo, trekking e camminate notturne.",
      en:"Guided tours, group hiking events, trekking and night walks.",
      de:"Geführte Besichtigungen, Gruppenwanderungen, Trekking und Nachtwanderungen.",
      fr:"Visites guidées, randonnées en groupe, trekking et marches nocturnes.",
      ru:"Экскурсии с гидом, групповые походы, треккинг и ночные прогулки."
    },em:"🥾",
    expanded:true,
    list:[
      {cat:{it:"Visite guidate",en:"Guided tours",de:"Geführte Besichtigungen",fr:"Visites guidées",ru:"Экскурсии с гидом"},items:[
        {name:{it:"Con Muflone",en:"With Muflone",de:"Mit Muflone",fr:"Avec Muflone",ru:"С Муфлоне"},note:"+39 320 4780924"},
        {name:{it:"Con Manul",en:"With Manul",de:"Mit Manul",fr:"Avec Manul",ru:"С Манулом"},note:"+39 338 9174651"},
      ]},
    ]},
    {n:{it:"Laghi, Sentieri e Torrenti",en:"Lakes, Trails & Streams",de:"Seen, Wanderwege & Bäche",fr:"Lacs, Sentiers et Torrents",ru:"Озёра, тропы и ручьи"},d:{
      it:"Il territorio intorno a Damanhur, tra acque e cammini.",
      en:"The territory around Damanhur, between waters and trails.",
      de:"Das Gebiet rund um Damanhur, zwischen Gewässern und Wegen.",
      fr:"Le territoire autour de Damanhur, entre eaux et chemins.",
      ru:"Территория вокруг Даманхура, между водами и тропами."
    },em:"🏞",
    expanded:true,
    list:[
      {cat:{it:"Laghi",en:"Lakes",de:"Seen",fr:"Lacs",ru:"Озёра"},items:[
        {name:{it:"Lago di Viverone",en:"Lake Viverone",de:"Viveronesee",fr:"Lac de Viverone",ru:"Озеро Виверон"},url:gmaps("Lago di Viverone"),note:""},
        {name:{it:"Lago di Meugliano",en:"Lake of Meugliano",de:"Meuglianosee",fr:"Lac de Meugliano",ru:"Озеро Меульяно"},url:gmaps("Lago di Meugliano"),note:""},
        {name:{it:"I Laghi di Alice",en:"Alice's Lakes",de:"Die Seen von Alice",fr:"Les Lacs d'Alice",ru:"Озёра Аличе"},url:gmaps("Laghi di Alice, Alice Superiore"),note:""},
      ]},
      {cat:{it:"Sentieri",en:"Routes",de:"Wanderwege",fr:"Sentiers",ru:"Маршруты"},items:[
        {name:{it:"Parco Nazionale del Gran Paradiso",en:"Gran Paradiso National Park",de:"Nationalpark Gran Paradiso",fr:"Parc National du Gran Paradiso",ru:"Национальный парк Гран-Парадизо"},url:gmaps("Parco Nazionale del Gran Paradiso"),note:""},
        {name:{it:"Parco Naturale del Lago di Candia",en:"Natural Park Lake Candia",de:"Naturpark Lago di Candia",fr:"Parc Naturel du Lac de Candia",ru:"Природный парк озера Кандия"},url:gmaps("Parco Naturale del Lago di Candia"),note:""},
        {name:{it:"Sentiero di Oropa",en:"Oropa Trail",de:"Oropa-Weg",fr:"Sentier d'Oropa",ru:"Тропа Оропа"},url:gmaps("Santuario di Oropa, Biella"),note:""},
        {name:{it:"Anfiteatro Morenico di Ivrea",en:"Moraine amphitheatre of Ivrea",de:"Moränenamphitheater von Ivrea",fr:"Amphithéâtre morainique d'Ivrea",ru:"Моренный амфитеатр Ивреа"},url:gmaps("Anfiteatro Morenico di Ivrea"),note:""},
        {name:{it:"Valle Sacra",en:"Sacred Valley",de:"Heiliges Tal",fr:"Vallée Sacrée",ru:"Священная долина"},url:gmaps("Valle Sacra, Piemonte"),note:""},
        {name:{it:"I sentieri degli Opifici",en:"The trails of the 'Opifici'",de:"Die Pfade der 'Opifici'",fr:"Les sentiers des 'Opifici'",ru:"Тропы «Опифичи»"},url:gmaps("Sentiero degli Opifici, Valchiusella"),note:""},
      ]},
      {cat:{it:"Torrenti e cascate",en:"Rivers & waterfalls",de:"Bäche und Wasserfälle",fr:"Torrents et cascades",ru:"Ручьи и водопады"},items:[
        {name:{it:"Cascate del Fondo",en:"Fondo waterfalls",de:"Wasserfälle von Fondo",fr:"Cascades du Fondo",ru:"Водопады Фондо"},url:gmaps("Cascate del Fondo, Traversella"),note:""},
        {name:"Garavot's Guje",url:gmaps("Garavot's Guje, Traversella"),note:""},
      ]},
    ]},
    {n:{it:"Città e Terme nei Dintorni",en:"Nearby Cities & Spas",de:"Städte & Thermen in der Umgebung",fr:"Villes et Thermes Environnants",ru:"Города и термы поблизости"},d:{
      it:"Da Damanhur è facile raggiungere città d'arte e terme per una giornata diversa.",
      en:"From Damanhur it's easy to reach art cities and spas for a different kind of day.",
      de:"Von Damanhur aus erreicht man leicht Kunststädte und Thermalbäder für einen etwas anderen Tag.",
      fr:"Depuis Damanhur, il est facile de rejoindre des villes d'art et des thermes pour une journée différente.",
      ru:"Из Даманхура легко добраться до городов искусства и термальных курортов для особого дня."
    },em:"🏛",
    expanded:true,
    list:[
      {cat:{it:"Città",en:"Cities",de:"Städte",fr:"Villes",ru:"Города"},items:[
        {name:{it:"Torino — 50 km da Damanhur",en:"Turin — 50 km from Damanhur",de:"Turin — 50 km von Damanhur",fr:"Turin — 50 km de Damanhur",ru:"Турин — 50 км от Даманхура"},url:gmaps("Torino"),note:{it:"Capitale del Piemonte, cultura e gastronomia di rilievo: la Mole Antonelliana, il Museo Egizio, Palazzo Reale. Da non perdere il Parco del Valentino e Piazza Castello.",en:"Capital of Piedmont, with distinguished culture and gastronomy: the Mole Antonelliana, the Egyptian Museum, the Royal Palace. Don't miss Valentino Park and Piazza Castello.",de:"Hauptstadt des Piemont, bedeutende Kultur und Gastronomie: die Mole Antonelliana, das Ägyptische Museum, der Königspalast. Nicht verpassen: der Valentino-Park und die Piazza Castello.",fr:"Capitale du Piémont, culture et gastronomie remarquables : la Mole Antonelliana, le Musée Égyptien, le Palais Royal. À ne pas manquer : le Parc du Valentino et la Piazza Castello.",ru:"Столица Пьемонта, значимая культура и гастрономия: Моле Антонеллиана, Египетский музей, Королевский дворец. Обязательно посетите парк Валентино и площадь Пьяцца Кастелло."}},
        {name:{it:"Ivrea — 16 km da Damanhur",en:"Ivrea — 16 km from Damanhur",de:"Ivrea — 16 km von Damanhur",fr:"Ivrea — 16 km de Damanhur",ru:"Иврея — 16 км от Даманхура"},url:gmaps("Ivrea"),note:{it:"Storia e innovazione, legata al patrimonio industriale Olivetti, al Castello e alla Cattedrale. Passeggiata lungo il Naviglio ammirando l'Anfiteatro Romano.",en:"A mix of history and innovation, linked to the Olivetti industrial heritage, the Castle and the Cathedral. Walk along the Naviglio admiring the Roman Amphitheatre.",de:"Geschichte und Innovation, verbunden mit dem industriellen Erbe von Olivetti, dem Schloss und der Kathedrale. Ein Spaziergang entlang des Naviglio mit Blick auf das Römische Amphitheater.",fr:"Histoire et innovation, liées au patrimoine industriel Olivetti, au Château et à la Cathédrale. Promenade le long du Naviglio en admirant l'Amphithéâtre Romain.",ru:"История и инновации, связанные с промышленным наследием Оливетти, замком и собором. Прогулка вдоль канала Навильо с видом на римский амфитеатр."}},
        {name:{it:"Aosta — 80 km da Damanhur",en:"Aosta — 80 km from Damanhur",de:"Aosta — 80 km von Damanhur",fr:"Aoste — 80 km de Damanhur",ru:"Аоста — 80 км от Даманхура"},url:gmaps("Aosta"),note:{it:"Gioiello storico tra le Alpi, con resti romani come l'Arco di Augusto e il Teatro Romano. Attività all'aperto tutto l'anno: trekking, mountain bike, sci.",en:"A historic jewel nestled in the Alps, with Roman remains such as the Arch of Augustus and the Roman Theatre. Outdoor activities all year round: trekking, mountain biking, skiing.",de:"Historisches Juwel in den Alpen, mit römischen Überresten wie dem Augustusbogen und dem Römischen Theater. Outdoor-Aktivitäten das ganze Jahr über: Trekking, Mountainbike, Skifahren.",fr:"Joyau historique niché dans les Alpes, avec des vestiges romains comme l'Arc d'Auguste et le Théâtre Romain. Activités de plein air toute l'année : trekking, VTT, ski.",ru:"Исторический жемчужина в Альпах с римскими памятниками — Аркой Августа и Римским театром. Активный отдых круглый год: треккинг, горный велосипед, лыжи."}},
      ]},
      {cat:{it:"Terme e Sauna",en:"Spa & Sauna",de:"Thermen & Sauna",fr:"Thermes et Sauna",ru:"Термы и сауна"},items:[
        {name:"Terme di Saint-Vincent",url:gmaps("Terme di Saint-Vincent"),note:{it:"60 km da Damanhur",en:"60 km from Damanhur",de:"60 km von Damanhur",fr:"60 km de Damanhur",ru:"60 км от Даманхура"}},
        {name:"Pré Saint Didier Thermal Bath",url:gmaps("QC Terme Pré Saint Didier"),note:{it:"110 km da Damanhur",en:"110 km from Damanhur",de:"110 km von Damanhur",fr:"110 km de Damanhur",ru:"110 км от Даманхура"}},
        {name:"Sauna Koivu",url:gmaps("Sauna Koivu"),note:{it:"13 km da Damanhur",en:"13 km from Damanhur",de:"13 km von Damanhur",fr:"13 km de Damanhur",ru:"13 км от Даманхура"}},
      ]},
    ]},
    {n:{it:"Ristoranti nei Dintorni",en:"Nearby Restaurants",de:"Restaurants in der Umgebung",fr:"Restaurants aux Alentours",ru:"Рестораны поблизости"},d:{
      it:"Una selezione curata per i nostri ospiti.",
      en:"A curated selection for our guests.",
      de:"Eine sorgfältige Auswahl für unsere Gäste.",
      fr:"Une sélection soignée pour nos hôtes.",
      ru:"Тщательно подобранная подборка для наших гостей."
    },em:"🍴",
    expanded:true,
    list:[
      {cat:"In Damanhur",items:[
        {name:"Somachandra Cafè",url:gmaps("Somachandra, Damanhur, Baldissero Canavese"),note:{it:"Tavola calda damanhuriana — pranzo solo. Cucina semplice e genuina nel cuore di Damjl.",en:"Damanhurian canteen — lunch only. Simple, authentic food in the heart of Damjl.",de:"Damanhurianische Kantine — nur Mittagessen. Einfache, authentische Küche im Herzen von Damjl.",fr:"Cantine damanhurienne — déjeuner uniquement. Cuisine simple et authentique au cœur de Damjl.",ru:"Дамантурская столовая — только обед. Простая, настоящая кухня в сердце Дамжла."}},
        {name:"Arielvo Cafè",url:gmaps("Arielvo, DamanhurCrea, Vidracco"),note:{it:"In DamanhurCrea. Pranzo solo, piatti caldi e freddi.",en:"In DamanhurCrea. Lunch only, hot and cold dishes.",de:"In DamanhurCrea. Nur Mittagessen, warme und kalte Gerichte.",fr:"À DamanhurCrea. Déjeuner uniquement, plats chauds et froids.",ru:"В DamanhurCrea. Только обед, горячие и холодные блюда."}},
      ]},
      {cat:"Vistrorio ≈ 3 km",items:[
        {name:"La Diga dei Sapori",url:gmaps("La Diga dei Sapori, Vistrorio"),note:{it:"Cucina piemontese classica in ambiente familiare.",en:"Classic Piedmontese cuisine, family atmosphere.",de:"Klassische piemontesische Küche in familiärer Atmosphäre.",fr:"Cuisine piémontaise classique dans une ambiance familiale.",ru:"Классическая пьемонтская кухня в семейной атмосфере."}},
        {name:"La Tofeja",url:gmaps("La Tofeja, Vistrorio"),note:{it:"La tofeja — fagioli e cotenna lentamente cotti. Specialità canavesana.",en:"La tofeja — slow-cooked beans and pork rind. Local speciality.",de:"La Tofeja — langsam gegarte Bohnen mit Schwarte. Canavese-Spezialität.",fr:"La tofeja — haricots et couenne longuement mijotés. Spécialité du Canavese.",ru:"Тофея — фасоль с беконом медленного приготовления. Местный деликатес Канавезе."}},
      ]},
      {cat:"Castellamonte ≈ 8 km",items:[
        {name:"Fast Pizza & Lunch",url:gmaps("Fast Pizza & Lunch, Castellamonte"),note:{it:"Pizza al taglio e piatti del giorno.",en:"Pizza by the slice and daily specials.",de:"Pizza nach Gewicht und Tagesgerichte.",fr:"Pizza à la coupe et plats du jour.",ru:"Пицца на вес и блюда дня."}},
        {name:"I Tre Re",url:gmaps("I Tre Re, Castellamonte"),note:{it:"Ristorante storico, buona selezione vini piemontesi.",en:"Historic restaurant, fine Piedmontese wines.",de:"Historisches Restaurant, gute Auswahl an piemontesischen Weinen.",fr:"Restaurant historique, belle sélection de vins piémontais.",ru:"Исторический ресторан, хороший выбор пьемонтских вин."}},
        {name:"Ristorante Pizzeria Jolly",url:gmaps("Ristorante Pizzeria Jolly, Castellamonte"),note:{it:"Classica pizzeria per famiglie o serate informali.",en:"Classic pizza restaurant, great for families.",de:"Klassische Pizzeria für Familien oder zwanglose Abende.",fr:"Pizzeria classique pour familles ou soirées informelles.",ru:"Классическая пиццерия для семей или неформальных вечеров."}},
        {name:"Goretti – Pizzeria & Pasticceria",url:gmaps("Goretti Pizzeria Pasticceria, Castellamonte"),note:{it:"Panificio e pasticceria storica. Ottima per colazione.",en:"Traditional bakery. Perfect for breakfast.",de:"Traditionsbäckerei und Konditorei. Perfekt zum Frühstück.",fr:"Boulangerie et pâtisserie historique. Idéale pour le petit-déjeuner.",ru:"Историческая пекарня и кондитерская. Отлично подходит для завтрака."}},
      ]},
      {cat:"Rivarolo Canavese ≈ 15 km",items:[
        {name:"Al Bistrot",url:gmaps("Al Bistrot, Rivarolo Canavese"),note:{it:"Atmosfera informale, ottimo rapporto qualità/prezzo.",en:"Relaxed atmosphere and good value.",de:"Entspannte Atmosphäre, gutes Preis-Leistungs-Verhältnis.",fr:"Ambiance décontractée, excellent rapport qualité-prix.",ru:"Непринуждённая атмосфера, отличное соотношение цены и качества."}},
        {name:"Antica Locanda dell'Orco",url:gmaps("Antica Locanda dell'Orco, Rivarolo Canavese"),note:{it:"Piatti canavesani autentici in locanda storica.",en:"Authentic Canavese dishes, historic inn.",de:"Authentische Canavese-Gerichte in historischem Gasthaus.",fr:"Plats canavesans authentiques dans une auberge historique.",ru:"Аутентичные блюда Канавезе в историческом трактире."}},
        {name:"Casa Bro",url:gmaps("Casa Bro, Rivarolo Canavese"),note:{it:"Cucina creativa in ambiente curato. Per serate speciali.",en:"Creative cuisine. Great for a special dinner.",de:"Kreative Küche in gepflegtem Ambiente. Für besondere Abende.",fr:"Cuisine créative dans un cadre soigné. Pour des soirées spéciales.",ru:"Творческая кухня в ухоженной обстановке. Для особых вечеров."}},
        {name:"Ristorante 3K Enoteca",url:gmaps("Ristorante 3K Enoteca, Rivarolo Canavese"),note:{it:"Enoteca con cucina, cibo e vini selezionati.",en:"Wine bar with kitchen — food and curated wines.",de:"Weinbar mit Küche — Speisen und ausgewählte Weine.",fr:"Bar à vin avec cuisine — plats et vins sélectionnés.",ru:"Винный бар с кухней — блюда и подобранные вина."}},
        {name:"Partage Wine Restaurant",url:gmaps("Partage Wine Restaurant, Rivarolo Canavese"),note:{it:"Cucina raffinata con focus sul vino. Ideale per cene romantiche.",en:"Refined cuisine, wine focus. Ideal for romance.",de:"Raffinierte Küche mit Fokus auf Wein. Ideal für romantische Abendessen.",fr:"Cuisine raffinée axée sur le vin. Idéal pour un dîner romantique.",ru:"Изысканная кухня с акцентом на вино. Идеально для романтического ужина."}},
        {name:"Kombu Sushi",url:gmaps("Kombu Sushi, Rivarolo Canavese"),note:{it:"Sushi di qualità anche in Canavese.",en:"Quality sushi in the Canavese area.",de:"Qualitäts-Sushi auch im Canavese.",fr:"Sushi de qualité, même dans le Canavese.",ru:"Качественные суши в регионе Канавезе."}},
      ]},
      {cat:"Ivrea ≈ 18 km",items:[
        {name:"La Mugnaia",url:gmaps("La Mugnaia, Ivrea"),note:{it:"Storico ristorante di Ivrea, cucina piemontese.",en:"One of Ivrea's historic restaurants.",de:"Historisches Restaurant in Ivrea, piemontesische Küche.",fr:"Restaurant historique d'Ivrea, cuisine piémontaise.",ru:"Исторический ресторан Ивреи, пьемонтская кухня."}},
        {name:"Aquila Nera",url:gmaps("Aquila Nera, Ivrea"),note:{it:"Menu stagionale, vini locali eccellenti.",en:"Seasonal menu, excellent local wines.",de:"Saisonale Speisekarte, ausgezeichnete lokale Weine.",fr:"Menu saisonnier, excellents vins locaux.",ru:"Сезонное меню, отличные местные вина."}},
        {name:"Cantine Morbelli",url:gmaps("Cantine Morbelli, Ivrea"),note:{it:"Cantina storica con degustazioni e cucina abbinata.",en:"Historic wine cellar, tastings and paired cuisine.",de:"Historischer Weinkeller mit Verkostungen und passender Küche.",fr:"Cave historique avec dégustations et cuisine accordée.",ru:"Исторический винный погреб с дегустациями и сочетаемой кухней."}},
        {name:"Ocio",url:gmaps("Ocio, Ivrea"),note:{it:"Locale vivace e moderno, apprezzato dai locali.",en:"Lively and modern, popular with locals.",de:"Lebendiger, moderner Ort, bei Einheimischen beliebt.",fr:"Lieu animé et moderne, apprécié des habitants.",ru:"Оживлённое современное место, популярное у местных жителей."}},
        {name:"Pasticceria Balla",url:gmaps("Pasticceria Balla, Ivrea"),note:{it:"La torta 900 è una specialità da non perdere!",en:"Don't miss the 'torta 900' — a true local gem!",de:"Die 'Torta 900' ist eine Spezialität, die man nicht verpassen sollte!",fr:"La 'torta 900' est une spécialité à ne pas manquer !",ru:"Торт «900» — обязательный к пробе местный деликатес!"}},
        {name:"Moma Bar",url:gmaps("Moma Bar, Ivrea"),note:{it:"Bar e ristorante nel cuore di Ivrea. Ottimo per aperitivo.",en:"Bar and restaurant in Ivrea's heart. Great for aperitivo.",de:"Bar und Restaurant im Herzen von Ivrea. Perfekt für einen Aperitif.",fr:"Bar et restaurant au cœur d'Ivrea. Parfait pour l'apéritif.",ru:"Бар и ресторан в сердце Ивреи. Отлично подходит для аперитива."}},
        {name:"Fumi",url:gmaps("Fumi, Ivrea"),note:{it:"Sushi e cucina cinese di buona qualità.",en:"Good sushi and Chinese cuisine.",de:"Gutes Sushi und chinesische Küche.",fr:"Bons sushis et cuisine chinoise.",ru:"Хорошие суши и китайская кухня."}},
      ]},
      {cat:{it:"Nell'Area",en:"In the Area",de:"In der Umgebung",fr:"Dans les environs",ru:"Поблизости"},items:[
        {name:"L'Incontro – Meugliano",url:gmaps("L'Incontro, Meugliano"),note:{it:"Cucina genuina immersa nella natura della Serra Canavese.",en:"Genuine cuisine nestled in Serra Canavese nature.",de:"Ursprüngliche Küche inmitten der Natur der Serra Canavese.",fr:"Cuisine authentique nichée dans la nature de la Serra Canavese.",ru:"Настоящая кухня в окружении природы Серра-Канавезе."}},
        {name:"La Terrazza sul Canavese – Muriaglio",url:gmaps("La Terrazza sul Canavese, Muriaglio"),note:{it:"Vista mozzafiato sul Canavese. Perfetto per pranzo o cena.",en:"Breathtaking Canavese views. Perfect for lunch or dinner.",de:"Atemberaubender Blick auf das Canavese. Perfekt zum Mittag- oder Abendessen.",fr:"Vue à couper le souffle sur le Canavese. Parfait pour le déjeuner ou le dîner.",ru:"Захватывающий вид на Канавезе. Идеально для обеда или ужина."}},
        {name:"Rosselli 77 – Cuorgnè",url:gmaps("Rosselli 77, Cuorgnè"),note:{it:"Si mangia circondati da oggetti d'antiquariato. Un'esperienza unica!",en:"Dine surrounded by antiques — truly unique!",de:"Speisen umgeben von Antiquitäten. Ein einzigartiges Erlebnis!",fr:"On mange entouré d'objets anciens. Une expérience unique !",ru:"Обед в окружении антиквариата. По-настоящему уникальный опыт!"}},
        {name:"La Bella Dormiente – Pavone Canavese",url:gmaps("La Bella Dormiente, Pavone Canavese"),note:{it:"B&B con ristorante in contesto tranquillo. Cucina familiare.",en:"B&B with restaurant. Homestyle cooking and warm welcome.",de:"B&B mit Restaurant in ruhiger Umgebung. Hausmannskost.",fr:"B&B avec restaurant dans un cadre tranquille. Cuisine familiale.",ru:"B&B с рестораном в спокойной обстановке. Домашняя кухня."}},
      ]},
    ]
  },
  ];

  if(sub) {
    const sec = [...DAMANSUBSECTIONS,...COMMUNITIES].find(s=>s.id===sub);
    const label = LS(sec,"label",lang);
    const comm = COMMUNITIES.find(c=>c.id===sub);
    const dsub = DAMANSUBSECTIONS.find(d=>d.id===sub);
    return(
      <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
        <div style={{position:"sticky",top:0,zIndex:50,padding:"32px 28px 24px",background:C.white,borderRadius:"0 0 32px 32px",boxShadow:C.shadow,marginBottom:"8px",overflow:"hidden"}}><HeaderRosone/>
          <Back label={t.back} onClick={()=>setSub(null)}/>
          <div style={{marginTop:"16px"}}>
            <Pill color={sec.color}>Damanhur</Pill>
            <div style={{fontFamily:FD,fontSize:"32px",fontWeight:"300",color:C.blue,marginTop:"10px"}}>{label}</div>
          </div>
        </div>
        <div style={{padding:"24px 22px 0"}}>
          {comm&&(
            <>
              <WhiteCard>
                <div style={{fontSize:"17.5px",color:C.textS,lineHeight:"1.9",whiteSpace:"pre-line"}}>{LS(comm,"desc",lang)}</div>
              </WhiteCard>
              {comm.url&&(
                <ExtLink href={comm.url} lang={lang} style={{display:"block",padding:"14px 20px",marginTop:"10px",background:C.white,borderRadius:"16px",color:C.blue,textDecoration:"none",fontFamily:FB,fontSize:"16.5px",boxShadow:C.shadow,textAlign:"center"}}>
                  {lang==="it"?"Visita il sito →":lang==="de"?"Website besuchen →":lang==="fr"?"Visiter le site →":lang==="ru"?"Посетить сайт →":"Visit website →"}
                </ExtLink>
              )}
            </>
          )}
          {sub==="blog"&&(
            <>
              <div style={{borderRadius:"20px",overflow:"hidden",marginBottom:"16px",boxShadow:C.shadow}}>
                <img src={SUBCONTENT.blog.img} alt={label} style={{width:"100%",height:"200px",objectFit:"cover"}}/>
              </div>
              <WhiteCard>
                <div style={{fontSize:"17.5px",color:C.textS,lineHeight:"1.9",whiteSpace:"pre-line"}}>{SUBCONTENT.blog[lang]||SUBCONTENT.blog.it}</div>
              </WhiteCard>
              {[{url:"https://damanhur.org/blog",label:lang==="it"?"Vai al Blog →":lang==="de"?"Zum Blog →":lang==="fr"?"Aller au Blog →":lang==="ru"?"Перейти в блог →":"Go to Blog →"},{url:"https://damanhur.community",label:lang==="it"?"Entra nella Community →":lang==="de"?"Der Community beitreten →":lang==="fr"?"Rejoindre la Communauté →":lang==="ru"?"Присоединиться к сообществу →":"Join the Community →"}].map((link,i)=>(
                <ExtLink key={i} href={link.url} lang={lang} style={{display:"block",padding:"16px 20px",marginBottom:"10px",background:C.white,borderRadius:"16px",color:C.blue,textDecoration:"none",fontFamily:FB,fontSize:"16.5px",boxShadow:C.shadow}}>{link.label}</ExtLink>
              ))}
            </>
          )}
          {dsub&&sub!=="media"&&sub!=="blog"&&SUBCONTENT[sub]&&(
            <>
              {SUBCONTENT[sub]&&SUBCONTENT[sub].img&&(
                <div style={{borderRadius:"20px",overflow:"hidden",marginBottom:"16px",boxShadow:C.shadow}}>
                  <img src={SUBCONTENT[sub].img} alt={label} style={{width:"100%",height:"200px",objectFit:"cover"}} onError={e=>{e.target.parentElement.style.display="none";}}/>
                </div>
              )}
              <WhiteCard>
                <div style={{fontSize:"17.5px",color:C.textS,lineHeight:"1.9",whiteSpace:"pre-line"}}>{SUBCONTENT[sub][lang]||SUBCONTENT[sub].it}</div>
                {SUBCONTENT[sub].link&&(
                  <ExtLink href={SUBCONTENT[sub].link} lang={lang} style={{display:"inline-block",marginTop:"14px",color:C.goldD,fontFamily:FB,fontSize:"15.5px",letterSpacing:"0.08em",textDecoration:"none"}}>
                    {LS(SUBCONTENT[sub],"linkLabel",lang)}
                  </ExtLink>
                )}
              </WhiteCard>
              {sub==="templi"&&<ExtLink href="https://thetemples.org/it/" lang={lang} style={{display:"block",padding:"14px 20px",background:C.goldPale,borderRadius:"16px",color:C.goldD,textDecoration:"none",fontFamily:FB,fontSize:"15.5px",textAlign:"center"}}>{lang==="it"?"Sito ufficiale Templi →":lang==="de"?"Offizielle Tempel-Website →":lang==="fr"?"Site officiel des Temples →":lang==="ru"?"Официальный сайт Храмов →":"Official Temple website →"}</ExtLink>}
              {sub==="crea"&&SUBCONTENT.crea.links&&SUBCONTENT.crea.links.map((item,i)=>(
                <WhiteCard key={i} style={{padding:"16px 20px",marginBottom:"10px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:"12px"}}>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:FD,fontWeight:"500",fontSize:"18.5px",color:C.blue,marginBottom:"4px"}}>{item.name}</div>
                      <div style={{fontSize:"15.5px",color:C.textM,lineHeight:"1.5"}}>{LS(item,"desc",lang)}</div>
                    </div>
                    {item.url&&<ExtLink href={item.url} lang={lang} onClick={()=>track("link",item.name,{lang})} style={{color:C.goldD,fontFamily:FB,fontSize:"14.5px",textDecoration:"none",flexShrink:0,marginTop:"2px"}}>{"→"}</ExtLink>}
                  </div>
                </WhiteCard>
              ))}
              {sub==="valle"&&VALPLACES.map((p,i)=>(
                <WhiteCard key={i} style={{padding:"16px 20px",marginBottom:"10px"}}>
                  <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
                    <span style={{fontSize:"24px",marginTop:"2px"}}>{p.em}</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:FD,fontWeight:"500",fontSize:"18px",color:C.blue,marginBottom:"3px"}}>
                        {p.url ? <ExtLink href={p.url} lang={lang} onClick={()=>track("link",LD(p.n,"it"),{lang})} style={{color:"inherit",textDecoration:"underline"}}>{LD(p.n,lang)}</ExtLink> : LD(p.n,lang)}
                      </div>
                      <div style={{fontSize:"15.5px",color:C.textM,marginBottom:p.list?"10px":"0"}}>{LD(p.d,lang)}</div>
                      {p.list&&p.list.map((cat,ci)=>(
                        <div key={ci} style={{marginBottom:"12px"}}>
                          <div style={{fontFamily:FB,fontSize:"14.5px",letterSpacing:"0.08em",color:C.goldD,textTransform:"uppercase",marginBottom:"6px"}}>{LD(cat.cat,lang)}</div>
                          {cat.items.map((r,ri)=>(
                            <div key={ri} style={{paddingBottom:"6px",borderBottom:`1px solid ${C.border}`,marginBottom:"6px"}}>
                              <div style={{fontFamily:FD,fontSize:"17.5px",color:C.textD,fontWeight:"500"}}>
                                {r.url ? <ExtLink href={r.url} lang={lang} onClick={()=>track("link",LD(r.name,"it"),{lang})} style={{color:"inherit",textDecoration:"underline"}}>{LD(r.name,lang)}</ExtLink> : LD(r.name,lang)}
                              </div>
                              <div style={{fontSize:"14.5px",color:C.textM,lineHeight:"1.4"}}>{LD(r.note,lang)}</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </WhiteCard>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }

  return(
    <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
      <div style={{position:"sticky",top:0,zIndex:50,padding:"32px 28px 24px",background:C.white,borderRadius:"0 0 32px 32px",boxShadow:C.shadow,marginBottom:"8px",overflow:"hidden"}}><HeaderRosone/>
        <Back label={t.back} onClick={()=>setPage("home")}/>
        <div style={{marginTop:"16px"}}>
          <Pill>{lang==="it"?"Damanhur · dal 1975":lang==="de"?"Damanhur · seit 1975":lang==="fr"?"Damanhur · depuis 1975":lang==="ru"?"Даманхур · с 1975":"Damanhur · since 1975"}</Pill>
          <div style={{fontFamily:FD,fontSize:"36px",fontWeight:"300",color:C.blue,marginTop:"10px"}}>{lang==="it"?"Un universo da scoprire":lang==="de"?"Ein Universum zu entdecken":lang==="fr"?"Un univers à découvrir":lang==="ru"?"Вселенная, которую предстоит открыть":"A universe to discover"}</div>
        </div>
      </div>
      <div style={{padding:"24px 22px 0"}}>
        <WhiteCard style={{background:C.bluePale,marginBottom:"28px"}}>
          <div style={{fontFamily:FD,fontWeight:"500",fontSize:"18.5px",fontStyle:"italic",color:C.blue,lineHeight:"1.8"}}>
            {lang==="it"
              ?"Una federazione di comunità, un laboratorio spirituale, un'opera d'arte collettiva. Fondato nel 1975 da Falco Tarassaco, riconosciuto dall'ONU come modello di sostenibilità."
              :lang==="de"
              ?"Eine Föderation von Gemeinschaften, ein spirituelles Labor, ein kollektives Kunstwerk. 1975 von Falco Tarassaco gegründet, von der UNO als Nachhaltigkeitsmodell anerkannt."
              :lang==="fr"
              ?"Une fédération de communautés, un laboratoire spirituel, une œuvre d'art collective. Fondée en 1975 par Falco Tarassaco, reconnue par l'ONU comme modèle de durabilité."
              :lang==="ru"
              ?"Федерация сообществ, духовная лаборатория, коллективное произведение искусства. Основан в 1975 году Фалько Тарассако, признан ООН моделью устойчивого развития."
              :"A federation of communities, a spiritual laboratory, a collective work of art. Founded in 1975 by Falco Tarassaco, recognized by the UN as a sustainability model."}
          </div>
        </WhiteCard>

        <Section title={lang==="it"?"Luoghi e Spazi":lang==="de"?"Orte & Räume":lang==="fr"?"Lieux et Espaces":lang==="ru"?"Места и пространства":"Places & Spaces"}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
            {DAMANSUBSECTIONS.map(s=>(
              <button key={s.id} onClick={()=>setSub(s.id)} style={{padding:"20px 16px",background:C.white,borderRadius:"20px",border:"none",cursor:"pointer",textAlign:"left",boxShadow:C.shadow}}>
                <div style={{fontSize:"26px",color:s.color,marginBottom:"8px"}}>{s.sym}</div>
                <div style={{fontFamily:FB,fontSize:"16.5px",fontWeight:"500",color:C.blue}}>{LS(s,"label",lang)}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section title={lang==="it"?"Le 4 Comunità":lang==="de"?"Die 4 Gemeinschaften":lang==="fr"?"Les 4 Communautés":lang==="ru"?"4 сообщества":"The 4 Communities"}>
          <div style={{fontFamily:FS,fontSize:"16.5px",color:C.textM,lineHeight:"1.6",padding:"4px 4px 16px",borderBottom:`1px solid ${C.border}`,marginBottom:"16px"}}>
            {lang==="it"
              ? "Damanhur è organizzata in comunità distinte per preservare la qualità autentica delle relazioni. La ricerca sociale ha mostrato che ogni essere umano può mantenere al massimo circa 200 relazioni significative: oltre questo numero, i legami si indeboliscono. Suddividersi in comunità più piccole permette a ogni persona di essere davvero conosciuta e riconosciuta. Esistono inoltre comunità di Damanhur sparse nel mondo."
              : lang==="de"
              ? "Damanhur ist in verschiedene Gemeinschaften aufgeteilt, um die Echtheit der Beziehungen zu bewahren. Die Sozialforschung zeigt, dass jeder Mensch etwa 200 bedeutungsvolle Beziehungen pflegen kann. Kleinere Gemeinschaften ermöglichen es, wirklich bekannt und anerkannt zu sein. Es gibt auch Damanhur-Gemeinschaften weltweit."
              : lang==="fr"
              ? "Damanhur est organisée en communautés distinctes pour préserver l'authenticité des relations. La recherche sociale montre que chaque être humain peut entretenir environ 200 relations significatives. Des communautés plus petites permettent d'être vraiment connu et reconnu. Il existe aussi des communautés Damanhur dans le monde entier."
              : lang==="ru"
              ? "Даманхур организован в отдельные сообщества для сохранения подлинного качества отношений. Социальные исследования показывают, что каждый человек может поддерживать около 200 значимых связей. Небольшие сообщества позволяют каждому быть по-настоящему узнанным. Существуют также сообщества Даманхура по всему миру."
              : "Damanhur is organised into distinct communities to preserve the authentic quality of relationships. Social research shows that each human being can maintain around 200 meaningful bonds: beyond this, ties weaken. Smaller communities allow every person to be truly known and recognised. There are also Damanhur communities around the world."
            }
          </div>
          {COMMUNITIES.map((c,i)=>(
            <button key={i} onClick={()=>setSub(c.id)} style={{width:"100%",padding:"0",background:C.white,borderRadius:"20px",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",boxShadow:C.shadow,marginBottom:"10px",textAlign:"left",overflow:"hidden"}}>
              {c.img&&<img src={c.img} alt={LS(c,"label",lang)} style={{width:"100%",height:"90px",objectFit:"cover"}}/>}
              <div style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px 18px"}}>
              <div style={{width:"40px",height:"40px",borderRadius:"50%",background:`${c.color}18`,border:`2px solid ${c.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",flexShrink:0}}>{c.sym}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:FD,fontWeight:"500",fontSize:"20px",color:c.color,marginBottom:"2px"}}>{LS(c,"label",lang)}</div>
                <div style={{fontSize:"14.5px",color:C.textM,fontFamily:FB}}>{LS(c,"desc",lang).substring(0,60)}…</div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke={C.textM} strokeWidth="1.5" width="16" height="16"><polyline points="9,18 15,12 9,6"/></svg>
              </div>
            </button>
          ))}
        </Section>
      </div>
    </div>
  );
}

// ── WELLNESS (experimental) ───────────────────────────────────────────────────
function WellnessPage({t,lang,setPage}) {
  const PROVIDERS = [
    {id:"selet", name:"SelEt", color:"#C07830", bg:"#FAF0E6", phone:"393513774461", img:"/wellness/selet.jpg",
      treatments:[
        {nameIT:"Pranoself",nameEN:"Pranoself",nameDE:"Pranoself",nameFR:"Pranoself",nameRU:"Pranoself",
          descIT:"Trattamento con energia pranica, incanalata verso la persona attraverso una struttura energetica selfica che ne amplifica l'efficacia.",
          descEN:"Treatment with prana energy that is channeled towards the individual through a selfica energetic structure, which amplifies its effectiveness.",
          descDE:"Behandlung mit Prana-Energie, die über eine selfische Energiestruktur zur Person geleitet wird, welche ihre Wirksamkeit verstärkt.",
          descFR:"Traitement à l'énergie pranique, canalisée vers la personne à travers une structure énergétique selfique qui en amplifie l'efficacité.",
          descRU:"Лечение пранической энергией, направляемой к человеку через селфическую энергетическую структуру, усиливающую её эффективность."},
        {nameIT:"Cabina di Allineamento",nameEN:"Alignment Cabin",nameDE:"Ausrichtungskabine",nameFR:"Cabine d'Alignement",nameRU:"Кабина выравнивания",
          descIT:"Cabine che creano linee temporali alternative, permettendo al corpo di fondersi con una versione più sana di sé stesso.",
          descEN:"Cabins are structures that create alternate timelines that allow the body to merge with a healthier version of itself.",
          descDE:"Kabinen, die alternative Zeitlinien erzeugen und es dem Körper ermöglichen, mit einer gesünderen Version seiner selbst zu verschmelzen.",
          descFR:"Cabines créant des lignes temporelles alternatives, permettant au corps de fusionner avec une version plus saine de lui-même.",
          descRU:"Кабины, создающие альтернативные временные линии, позволяющие телу слиться с более здоровой версией самого себя."},
        {nameIT:"Cabina di Ringiovanimento",nameEN:"Rejuvenation Cabin",nameDE:"Verjüngungskabine",nameFR:"Cabine de Rajeunissement",nameRU:"Кабина омоложения",
          descIT:"Combinazione di tecnologie selfiche avanzate per favorire la rigenerazione cellulare e riequilibrare corpo e mente.",
          descEN:"Combination of advanced selfica technologies to promote cell regeneration and rebalance body and mind.",
          descDE:"Kombination fortschrittlicher selfischer Technologien zur Förderung der Zellregeneration und zum Wiederausgleich von Körper und Geist.",
          descFR:"Combinaison de technologies selfiques avancées pour favoriser la régénération cellulaire et rééquilibrer corps et esprit.",
          descRU:"Сочетание передовых селфических технологий для стимуляции клеточной регенерации и восстановления баланса тела и разума."},
      ]},
    {id:"elasel", name:"Elasel", color:"#8A7AA8", bg:"#F4F0FA", phone:"393312946774", img:"/wellness/elasel.jpg",
      treatments:[
        {nameIT:"Trattamento Selfico",nameEN:"Selfic Treatment",nameDE:"Selfische Behandlung",nameFR:"Traitement Selfique",nameRU:"Селфическая процедура",
          descIT:"Trattamento con selfiche specifiche per il benessere, posizionate su diverse zone del corpo. Ha un effetto rilassante e rigenerante.",
          descEN:"Treatment with specific selfica connected to well-being placed on different areas of the body. It has a relaxing and regenerating effect on the body.",
          descDE:"Behandlung mit spezifischen Selfica für das Wohlbefinden, die an verschiedenen Körperstellen platziert werden. Hat eine entspannende und regenerierende Wirkung.",
          descFR:"Traitement avec des selfiques spécifiques pour le bien-être, placées sur différentes zones du corps. Effet relaxant et régénérant.",
          descRU:"Лечение специфическими селфиками для благополучия, размещёнными на разных участках тела. Оказывает расслабляющее и восстанавливающее действие."},
      ]},
    {id:"kythera", name:"Kythera", color:"#5A9AB8", bg:"#EDF5F8", phone:"393518526082", img:"/wellness/kythera.jpg",
      treatments:[
        {nameIT:"Massaggio Selfico",nameEN:"Selfic Massage",nameDE:"Selfische Massage",nameFR:"Massage Selfique",nameRU:"Селфический массаж",
          descIT:"Trattamento che utilizza la selfica per il ringiovanimento e la pulizia della memoria cutanea, per favorire rigenerazione ed equilibrio fisico e spirituale.",
          descEN:"Treatment using selfica for rejuvenation and cleansing of skin memory in order to promote regeneration, physical and spiritual balance.",
          descDE:"Behandlung, die die Selfica zur Verjüngung und Reinigung des Hautgedächtnisses nutzt, um Regeneration sowie körperliches und spirituelles Gleichgewicht zu fördern.",
          descFR:"Traitement utilisant la selfica pour le rajeunissement et le nettoyage de la mémoire cutanée, favorisant la régénération et l'équilibre physique et spirituel.",
          descRU:"Процедура с использованием селфики для омоложения и очищения кожной памяти, способствующая регенерации и физическому и духовному равновесию."},
      ]},
  ];
  return(
    <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
      <div style={{position:"sticky",top:0,zIndex:50,padding:"32px 28px 24px",background:C.white,borderRadius:"0 0 32px 32px",boxShadow:C.shadow,marginBottom:"8px",overflow:"hidden"}}><HeaderRosone/>
        <Back label={t.back} onClick={()=>setPage("home")}/>
        <div style={{marginTop:"16px"}}>
          <Pill color={C.blueM}>{lang==="it"?"Benessere & Guarigione":lang==="de"?"Wellness & Heilung":lang==="fr"?"Bien-être & Guérison":lang==="ru"?"Велнес и исцеление":"Wellness & Healing"}</Pill>
          <div style={{fontFamily:FD,fontSize:"36px",fontWeight:"300",color:C.blue,marginTop:"10px"}}>{lang==="it"?"Prenditi cura di te":lang==="de"?"Sorge für dich selbst":lang==="fr"?"Prends soin de toi":lang==="ru"?"Позаботься о себе":"Take care of yourself"}</div>
        </div>
      </div>

      <div style={{padding:"24px 22px 0"}}>
        {/* MEDITAZIONE NEL TEMPO DEI POPOLI — la nostra esperienza di punta, massima visibilità */}
        <div style={{marginBottom:"8px",textAlign:"center"}}>
          <div style={{fontSize:"13.5px",fontWeight:"700",letterSpacing:"0.12em",textTransform:"uppercase",color:C.goldD,marginBottom:"4px"}}>
            {lang==="it"?"L'esperienza più amata":lang==="de"?"Das beliebteste Erlebnis":lang==="fr"?"L'expérience la plus appréciée":lang==="ru"?"Самый любимый опыт":"Our most loved experience"}
          </div>
          <div style={{fontFamily:FD,fontSize:"24px",color:C.blue}}>
            {lang==="it"?"Meditazione nel Tempo dei Popoli":lang==="de"?"Meditation in der Zeit der Völker":lang==="fr"?"Méditation dans le Temps des Peuples":lang==="ru"?"Медитация во Времени Народов":"Meditation in the Time of the Peoples"}
          </div>
        </div>
        <div style={{position:"relative",marginBottom:"8px",borderRadius:"28px",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:"url(/temple/popoli.jpg)",backgroundSize:"cover",backgroundPosition:"center 40%",opacity:0.5}}/>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at center, transparent 0%, transparent 18%, ${C.bg} 70%)`}}/>
          <PopoliExperienceButton t={t} lang={lang} style={{position:"relative",padding:"24px 0 8px"}}/>
        </div>
        <WhiteCard style={{marginBottom:"24px",background:C.goldPale,border:`1px solid ${C.gold}33`}}>
          <div style={{fontSize:"15.5px",color:C.textS,lineHeight:"1.8"}}>
            {lang==="it"?"La Sala del Tempo dei Popoli è uno degli spazi più silenziosi e riservati dei Templi dell'Umanità — normalmente chiusa alle visite guidate, aperta solo su richiesta. È qui che proponiamo la nostra meditazione guidata: un momento di silenzio autentico e su misura, in uno dei luoghi più potenti di Damanhur.":lang==="de"?"Die Halle der Zeit der Völker ist einer der stillsten und privatesten Räume der Tempel der Menschheit — normalerweise nicht Teil der geführten Besichtigungen, nur auf Anfrage geöffnet. Hier bieten wir unsere geführte Meditation an: einen authentischen, maßgeschneiderten Moment der Stille an einem der kraftvollsten Orte Damanhurs.":lang==="fr"?"La Salle du Temps des Peuples est l'un des espaces les plus silencieux et les plus privés des Temples de l'Humanité — habituellement fermée aux visites guidées, ouverte seulement sur demande. C'est ici que nous proposons notre méditation guidée : un moment de silence authentique et sur mesure, dans l'un des lieux les plus puissants de Damanhur.":lang==="ru"?"Зал Времени Народов — одно из самых тихих и уединённых пространств Храмов Человечества, обычно закрытое для экскурсий и открывающееся только по запросу. Именно здесь мы предлагаем нашу медитацию под руководством — подлинный, персональный момент тишины в одном из самых сильных мест Даманхура.":"The Hall of Time of the Peoples is one of the quietest, most private spaces within the Temples of Humanity — usually closed to guided visits, opened only on request. This is where we offer our guided meditation: an authentic, tailored moment of silence in one of Damanhur's most powerful places."}
          </div>
        </WhiteCard>
        <div style={{borderRadius:"20px",overflow:"hidden",marginBottom:"16px",boxShadow:C.shadow}}>
          <img src="/damanhur/benessere-1.jpg" alt="Trattamento Selfico" style={{width:"100%",height:"200px",objectFit:"cover",display:"block"}}/>
        </div>
        <WhiteCard style={{marginBottom:"24px"}}>
          <div style={{fontSize:"16.5px",color:C.textS,lineHeight:"1.8"}}>
            {lang==="it"
              ?"Una delle caratteristiche uniche dell'offerta olistica di Damanhur è l'integrazione della tecnologia Selfica, un'arte-scienza antica riscoperta e sviluppata qui da oltre 50 anni. Le Selfiche, collegate a forze cosmiche specifiche, utilizzano strutture basate su geometrie sacre, metalli e sostanze alchemiche per favorire l'evoluzione personale e collettiva, sostenendo la guarigione e l'espansione delle capacità umane."
              :lang==="de"
              ?"Eines der einzigartigen Merkmale des ganzheitlichen Angebots von Damanhur ist die Integration der Selfica-Technologie, einer alten Kunst-Wissenschaft, die hier seit über 50 Jahren wiederentdeckt und weiterentwickelt wird. Die Selfica, verbunden mit spezifischen kosmischen Kräften, nutzen Strukturen, die auf heiligen Geometrien, Metallen und alchemistischen Substanzen basieren, um die persönliche und kollektive Evolution zu fördern und Heilung sowie die Erweiterung menschlicher Fähigkeiten zu unterstützen."
              :lang==="fr"
              ?"L'une des caractéristiques uniques de l'offre holistique de Damanhur est l'intégration de la technologie Selfique, un art-science ancien redécouvert et développé ici depuis plus de 50 ans. Les Selfiques, reliées à des forces cosmiques spécifiques, utilisent des structures basées sur des géométries sacrées, des métaux et des substances alchimiques pour favoriser l'évolution personnelle et collective, soutenant la guérison et l'expansion des capacités humaines."
              :lang==="ru"
              ?"Одна из уникальных особенностей целостного подхода Даманхура — интеграция технологии Селфика, древнего искусства-науки, заново открытого и развиваемого здесь уже более 50 лет. Селфики, связанные с определёнными космическими силами, используют структуры на основе священных геометрий, металлов и алхимических веществ для содействия личной и коллективной эволюции, поддерживая исцеление и расширение человеческих возможностей."
              :"One of the unique features of the holistic wellness offerings at Damanhur is the integration of Selfica technology, an ancient art-science rediscovered and developed right here for over 50 years. The Selfica, connected to specific cosmic forces, use structures based on sacred geometries, metals and alchemical substances to promote personal and collective evolution, supporting healing and the expansion of human capabilities."}
          </div>
        </WhiteCard>

        {/* PROVIDERS: SelEt / Elasel / Kythera */}
        {PROVIDERS.map(p=>(
          <WhiteCard key={p.id} style={{marginBottom:"16px",background:p.bg,border:`1px solid ${p.color}33`,overflow:"hidden",padding:0}}>
            {p.img&&<img src={p.img} alt={p.name} style={{width:"100%",height:"160px",objectFit:"cover",display:"block"}}/>}
            <div style={{padding:"20px"}}>
            <div style={{fontFamily:FB,fontSize:"14.5px",fontWeight:"600",letterSpacing:"0.12em",textTransform:"uppercase",color:p.color,marginBottom:"14px"}}>{p.name}</div>
            <div style={{display:"flex",flexDirection:"column",gap:"14px",marginBottom:"16px"}}>
              {p.treatments.map((tr,i)=>(
                <div key={i}>
                  <div style={{fontFamily:FD,fontWeight:"500",fontSize:"18px",color:C.blue,marginBottom:"3px"}}>{LS(tr,"name",lang)}</div>
                  <div style={{fontSize:"15.5px",color:C.textS,lineHeight:"1.6"}}>{LS(tr,"desc",lang)}</div>
                </div>
              ))}
            </div>
            <ContactButton phone="393510103842" lang={lang} trackLabel={`WhatsApp book ${p.name}`} text={lang==="it"?`Buongiorno, vorrei prenotare un trattamento con ${p.name}. Potete aiutarmi a organizzarlo?`:lang==="de"?`Guten Tag, ich möchte eine Behandlung bei ${p.name} buchen. Können Sie mir dabei helfen?`:lang==="fr"?`Bonjour, je souhaiterais réserver un soin avec ${p.name}. Pouvez-vous m'aider à l'organiser ?`:lang==="ru"?`Здравствуйте, хотел(а) бы записаться на процедуру у ${p.name}. Поможете организовать?`:`Hello, I would like to book a treatment with ${p.name}. Could you help me arrange it?`} renderTrigger={openModal=>(
              <button onClick={openModal} style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"12px 20px",background:p.color,border:"none",borderRadius:"14px",color:C.white,cursor:"pointer",fontFamily:FB,fontSize:"15.5px"}}>
                💬 {lang==="it"?`Prenota con ${p.name} →`:lang==="de"?`Bei ${p.name} buchen →`:lang==="fr"?`Réserver avec ${p.name} →`:lang==="ru"?`Записаться к ${p.name} →`:`Book with ${p.name} →`}
              </button>
            )}/>
            </div>
          </WhiteCard>
        ))}

        <ExtLink href="https://shop.selfica.space/" lang={lang} style={{display:"block",padding:"16px 20px",marginBottom:"24px",background:C.blue,borderRadius:"18px",color:C.white,textDecoration:"none",textAlign:"center",fontFamily:FB,fontSize:"15.5px",letterSpacing:"0.05em"}}>
          {lang==="it"?"Scopri di più sulla Selfica →":lang==="de"?"Mehr über Selfica erfahren →":lang==="fr"?"En savoir plus sur la Selfica →":lang==="ru"?"Узнать больше о Селфике →":"Find out more on Selfica →"}
        </ExtLink>

        <div style={{padding:"18px 20px",background:C.white,borderRadius:"20px",boxShadow:C.shadow}}>
          <div style={{fontSize:"15.5px",color:C.textM,lineHeight:"1.7",marginBottom:"10px"}}>
            {lang==="it"?"Per trattamenti esterni o info: contatta la direzione o il Welcome Center di Damanhur.":lang==="de"?"Für externe Behandlungen oder Infos: Kontaktiere die Leitung oder das Welcome Center von Damanhur.":lang==="fr"?"Pour des soins externes ou des informations : contacte la direction ou le Welcome Center de Damanhur.":lang==="ru"?"По вопросам внешних процедур или информации: свяжитесь с администрацией или Welcome Center Даманхура.":"For external treatments or info: contact management or Damanhur's Welcome Center."}
          </div>
          <a href="tel:+393204824427" style={{color:C.gold,fontFamily:FB,fontSize:"16.5px",textDecoration:"none"}}>📞 +39 320 482 4427</a>
        </div>
      </div>
    </div>
  );
}

// ── SHOP ──────────────────────────────────────────────────────────────────────
const SHOP_DATA = [
  {sym:"✦",catIT:"Selfica",catEN:"Selfica",name:"Selfica Personale",price:"€ 85",code:"ABATON10",descIT:"Strumento semiautomatico per l'armonizzazione energetica, forgiato a mano.",descEN:"Semiautomatic energy harmonization tool, hand-forged."},
  {sym:"◈",catIT:"Fragranze",catEN:"Fragrances",name:"Olio Essenziale Abaton",price:"€ 38",code:"ABATON10",descIT:"La fragranza della tua stanza — preparata con intenzione.",descEN:"Your room's fragrance — prepared with intention."},
  {sym:"◇",catIT:"Accessori",catEN:"Accessories",name:"Quaderno dei Sogni",price:"€ 22",code:"ABATON10",descIT:"Carta riciclata, copertina artigianale. Un invito al linguaggio onirico.",descEN:"Recycled paper, handcrafted cover. An invitation to dream language."},
  {sym:"⊕",catIT:"Libri",catEN:"Books",name:"Autoesione — Damanhur",price:"€ 18",code:"ABATON10",descIT:"La lettura perfetta per questo soggiorno.",descEN:"The perfect reading for this stay."},
];
function GuestsPage({t,lang,setPage}) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const handleEmailSubmit = () => {
    if(email && email.includes("@")) {
      setEmailSent(true);
    }
  };
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSending, setFeedbackSending] = useState(false);
  const handleFeedbackSubmit = async () => {
    if(!rating || feedbackSending) return;
    setFeedbackSending(true);
    try{
      await fetch("/api/feedback",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({rating,comment,room:getRoom(),lang})});
      setFeedbackSent(true);
    }catch(e){}
    setFeedbackSending(false);
  };
  return(
    <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
      <div style={{position:"sticky",top:0,zIndex:50,padding:"32px 28px 24px",background:C.white,borderRadius:"0 0 32px 32px",boxShadow:C.shadow,marginBottom:"20px",overflow:"hidden"}}><HeaderRosone/>
        <Back label={t.back} onClick={()=>setPage("home")}/>
        <div style={{fontFamily:FD,fontSize:"28px",color:C.blue,marginTop:"16px"}}>{lang==="it"?"I tuoi privilegi":lang==="de"?"Deine Vorteile":lang==="fr"?"Vos privilèges":lang==="ru"?"Ваши привилегии":"Your privileges"}</div>
        <div style={{fontFamily:FS,fontSize:"15.5px",color:C.textM,fontStyle:"italic",marginTop:"4px"}}>{lang==="it"?"Ospiti Abaton · Sacred Dreams":lang==="de"?"Abaton Gäste · Sacred Dreams":lang==="fr"?"Hôtes Abaton · Sacred Dreams":lang==="ru"?"Гости Абатона · Sacred Dreams":"Abaton Guests · Sacred Dreams"}</div>
      </div>
      <div style={{padding:"0 22px"}}>

        {/* PORTA UN AMICO */}
        <Section title={lang==="it"?"Porta un amico":lang==="de"?"Bring einen Freund mit":lang==="fr"?"Parraine un ami":lang==="ru"?"Приведи друга":"Bring a friend"}>
          <div style={{background:C.goldPale,borderRadius:"20px",padding:"22px",border:`1px solid ${C.gold}44`}}>
            <div style={{fontSize:"15.5px",color:C.textS,lineHeight:"1.8",marginBottom:"16px"}}>
              {lang==="it"
                ?"Conosci qualcuno che potrebbe beneficiare di questo luogo? Condividi la tua esperienza all'Abaton — per ogni amico che prenota grazie a te, riceverai uno sconto esclusivo sul tuo prossimo soggiorno."
                :lang==="de"
                ?"Kennst du jemanden, der von diesem Ort profitieren könnte? Teile deine Erfahrung im Abaton — für jeden Freund, der dank dir bucht, erhältst du einen exklusiven Rabatt auf deinen nächsten Aufenthalt."
                :lang==="fr"
                ?"Connais-tu quelqu'un qui pourrait profiter de cet endroit ? Partage ton expérience à l'Abaton — pour chaque ami qui réserve grâce à toi, tu recevras une réduction exclusive sur ton prochain séjour."
                :lang==="ru"
                ?"Знаете кого-то, кому это место могло бы пригодиться? Поделитесь своим опытом в Абатоне — за каждого друга, который забронирует благодаря вам, вы получите эксклюзивную скидку на следующее пребывание."
                :"Do you know someone who could benefit from this place? Share your Abaton experience — for every friend who books thanks to you, you will receive an exclusive discount on your next stay."}
            </div>
            <ContactButton phone="393510103842" lang={lang} trackLabel="WhatsApp bring a friend" text={lang==="it"?"Buongiorno, vorrei segnalare un amico per un soggiorno in Abaton.":lang==="de"?"Guten Tag, ich möchte einen Freund für einen Aufenthalt im Abaton empfehlen.":lang==="fr"?"Bonjour, je souhaiterais recommander un ami pour un séjour à l'Abaton.":lang==="ru"?"Здравствуйте, хотел(а) бы порекомендовать друга для пребывания в Абатоне.":"Hello, I would like to refer a friend for a stay at Abaton."} renderTrigger={openModal=>(
              <button onClick={openModal} style={{display:"inline-flex",alignItems:"center",gap:"8px",padding:"13px 22px",background:C.gold,border:"none",borderRadius:"14px",color:C.white,cursor:"pointer",fontFamily:FB,fontSize:"15.5px"}}>
                💬 {lang==="it"?"Scrivi al personale →":lang==="de"?"Dem Personal schreiben →":lang==="fr"?"Écrire au personnel →":lang==="ru"?"Написать персоналу →":"Message the staff →"}
              </button>
            )}/>
          </div>
        </Section>

        {/* FEEDBACK */}
        <Section title={lang==="it"?"Lascia un feedback":lang==="de"?"Hinterlasse ein Feedback":lang==="fr"?"Laisse un avis":lang==="ru"?"Оставить отзыв":"Leave feedback"}>
          <div style={{background:C.white,borderRadius:"20px",padding:"22px",boxShadow:C.shadow}}>
            <div style={{fontSize:"15.5px",color:C.textS,lineHeight:"1.8",marginBottom:"16px"}}>
              {lang==="it"?"Com'è andato il tuo soggiorno? Il tuo feedback ci aiuta a migliorare.":lang==="de"?"Wie war dein Aufenthalt? Dein Feedback hilft uns, besser zu werden.":lang==="fr"?"Comment s'est passé ton séjour ? Ton avis nous aide à nous améliorer.":lang==="ru"?"Как прошло ваше пребывание? Ваш отзыв поможет нам стать лучше.":"How was your stay? Your feedback helps us improve."}
            </div>
            {feedbackSent
              ? <div style={{textAlign:"center",padding:"16px",color:C.gold,fontFamily:FD,fontWeight:"500",fontSize:"18px"}}>
                  ✦ {lang==="it"?"Grazie per il tuo feedback!":lang==="de"?"Danke für dein Feedback!":lang==="fr"?"Merci pour ton avis !":lang==="ru"?"Спасибо за ваш отзыв!":"Thank you for your feedback!"}
                </div>
              : <>
                  <div style={{display:"flex",gap:"6px",marginBottom:"14px",justifyContent:"center"}}>
                    {[1,2,3,4,5].map(n=>(
                      <button key={n} onClick={()=>setRating(n)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"32px",color:n<=rating?C.gold:C.border,padding:0,lineHeight:1}}>★</button>
                    ))}
                  </div>
                  <textarea
                    value={comment}
                    onChange={e=>setComment(e.target.value)}
                    placeholder={lang==="it"?"Raccontaci qualcosa (facoltativo)":lang==="de"?"Erzähl uns etwas (optional)":lang==="fr"?"Dis-nous quelque chose (facultatif)":lang==="ru"?"Расскажите что-нибудь (необязательно)":"Tell us something (optional)"}
                    rows={3}
                    style={{width:"100%",padding:"13px 16px",borderRadius:"14px",border:`1px solid ${C.border}`,fontFamily:FB,fontSize:"15.5px",background:C.bg,outline:"none",resize:"none",marginBottom:"14px"}}
                  />
                  <button onClick={handleFeedbackSubmit} disabled={!rating||feedbackSending} style={{width:"100%",padding:"13px",background:rating?C.gold:C.border,border:"none",borderRadius:"14px",color:C.white,cursor:rating?"pointer":"not-allowed",fontFamily:FB,fontSize:"15.5px"}}>
                    {lang==="it"?"Invia feedback":lang==="de"?"Feedback senden":lang==="fr"?"Envoyer l'avis":lang==="ru"?"Отправить отзыв":"Send feedback"}
                  </button>
                </>
            }
          </div>
        </Section>

        {/* RECENSIONE PUBBLICA */}
        <Section title={lang==="it"?"Lascia una recensione":lang==="de"?"Hinterlasse eine Bewertung":lang==="fr"?"Laisse un avis public":lang==="ru"?"Оставить публичный отзыв":"Leave a public review"}>
          <div style={{background:C.goldPale,borderRadius:"20px",padding:"22px",border:`1px solid ${C.gold}44`}}>
            <div style={{fontSize:"15.5px",color:C.textS,lineHeight:"1.8",marginBottom:"16px"}}>
              {lang==="it"?"Se hai amato il tuo soggiorno, una recensione pubblica ci aiuta moltissimo.":lang==="de"?"Wenn dir dein Aufenthalt gefallen hat, hilft uns eine öffentliche Bewertung enorm.":lang==="fr"?"Si tu as aimé ton séjour, un avis public nous aide énormément.":lang==="ru"?"Если вам понравилось пребывание, публичный отзыв очень нам поможет.":"If you loved your stay, a public review helps us enormously."}
            </div>
            <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
              <ExtLink href="https://g.page/r/CX8uKstnGHC8EAE/review" lang={lang} onClick={()=>track("link","Review Google",{lang})} style={{flex:1,minWidth:"140px",textAlign:"center",padding:"13px 18px",background:C.white,borderRadius:"14px",color:C.blue,textDecoration:"none",fontFamily:FB,fontSize:"15.5px",boxShadow:C.shadow}}>
                Google →
              </ExtLink>
              <ExtLink href="https://www.tripadvisor.it/UserReviewEdit-g7310872-d19945171-Abaton_Sacred_Dreams-Vidracco_Province_of_Turin_Piedmont.html" lang={lang} onClick={()=>track("link","Review TripAdvisor",{lang})} style={{flex:1,minWidth:"140px",textAlign:"center",padding:"13px 18px",background:C.white,borderRadius:"14px",color:C.blue,textDecoration:"none",fontFamily:FB,fontSize:"15.5px",boxShadow:C.shadow}}>
                TripAdvisor →
              </ExtLink>
            </div>
          </div>
        </Section>

        {/* NEWSLETTER */}
        <Section title={lang==="it"?"Rimani connesso":lang==="de"?"Bleib verbunden":lang==="fr"?"Reste connecté":lang==="ru"?"Оставайтесь на связи":"Stay connected"}>
          <div style={{background:C.white,borderRadius:"20px",padding:"22px",boxShadow:C.shadow}}>
            <div style={{fontSize:"15.5px",color:C.textS,lineHeight:"1.8",marginBottom:"18px"}}>
              {lang==="it"
                ?"Iscriviti alla newsletter per ricevere aggiornamenti sugli eventi di Damanhur, offerte esclusive per ospiti e notizie dal campo dell'Abaton."
                :lang==="de"
                ?"Abonniere den Newsletter, um Updates zu Damanhur-Veranstaltungen, exklusive Gästeangebote und Neuigkeiten aus dem Feld des Abaton zu erhalten."
                :lang==="fr"
                ?"Inscris-toi à la newsletter pour recevoir les actualités des événements de Damanhur, des offres exclusives pour les hôtes et des nouvelles du champ de l'Abaton."
                :lang==="ru"
                ?"Подпишитесь на рассылку, чтобы получать новости о мероприятиях Даманхура, эксклюзивные предложения для гостей и новости из поля Абатона."
                :"Subscribe to the newsletter to receive updates on Damanhur events, exclusive guest offers and news from the Abaton field."}
            </div>
            {emailSent
              ? <div style={{textAlign:"center",padding:"16px",color:C.gold,fontFamily:FD,fontWeight:"500",fontSize:"18px"}}>
                  ✦ {lang==="it"?"Grazie! Ti ricontatteremo presto.":lang==="de"?"Danke! Wir melden uns bald bei dir.":lang==="fr"?"Merci ! Nous te recontacterons bientôt.":lang==="ru"?"Спасибо! Мы скоро свяжемся с вами.":"Thank you! We will be in touch soon."}
                </div>
              : <div style={{display:"flex",gap:"10px"}}>
                  <input
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&handleEmailSubmit()}
                    placeholder={lang==="it"?"La tua email":lang==="de"?"Deine E-Mail":lang==="fr"?"Ton e-mail":lang==="ru"?"Ваш email":"Your email"}
                    style={{flex:1,padding:"13px 16px",borderRadius:"14px",border:`1px solid ${C.border}`,fontFamily:FB,fontSize:"15.5px",background:C.bg,outline:"none"}}
                  />
                  <button onClick={handleEmailSubmit} style={{padding:"13px 20px",background:C.gold,border:"none",borderRadius:"14px",color:C.white,cursor:"pointer",fontFamily:FB,fontSize:"15.5px",whiteSpace:"nowrap"}}>
                    {lang==="it"?"Iscriviti":lang==="de"?"Abonnieren":lang==="fr"?"S'inscrire":lang==="ru"?"Подписаться":"Subscribe"}
                  </button>
                </div>
            }
          </div>
        </Section>

      </div>
    </div>
  );
}


function ConciergePage({t,lang,setPage}) {
  const [messages,setMessages] = useState([{role:"assistant",content:t.concWelcome}]);
  const [input,setInput] = useState("");
  const [loading,setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[messages]);
  const send = async(text)=>{
    const msg=text||input; if(!msg.trim()||loading) return;
    const next=[...messages,{role:"user",content:msg}];
    setMessages(next); setInput(""); setLoading(true);
    track("concierge", msg, {lang});
    try{
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-5",max_tokens:1000,system:cx(SYS[lang]||SYS.en)+conciergeExtra(),messages:next})});
      const data=await res.json();
      const reply=data.content?.find(b=>b.type==="text")?.text;
      if(reply){
        setMessages([...next,{role:"assistant",content:reply}]);
      }else{
        track("concierge_error", (data.error&&(data.error.message||data.error.type))||`http_${res.status}`, {lang});
        setMessages([...next,{role:"assistant",content:CONC_ERR[lang]||CONC_ERR.en}]);
      }
    }catch(err){
      track("concierge_error", String((err&&err.message)||err), {lang});
      setMessages([...next,{role:"assistant",content:CONC_ERR[lang]||CONC_ERR.en}]);
    }
    finally{setLoading(false);}
  };
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",background:C.bg}}>
      <div style={{padding:"28px 24px 20px",background:C.white,borderRadius:"0 0 28px 28px",boxShadow:C.shadow,flexShrink:0}}>
        <Back label={t.back} onClick={()=>setPage("home")}/>
        <div style={{marginTop:"14px",display:"flex",alignItems:"center",gap:"14px"}}>
          <SphereIcon size={48} fontSize={20}>✦</SphereIcon>
          <div>
            <div style={{fontFamily:FD,fontSize:"24px",color:C.blue}}>{t.concTitle}</div>
            <div style={{fontSize:"14.5px",color:C.textM}}>{lang==="it"?"AI · sempre disponibile":lang==="de"?"KI · immer verfügbar":lang==="fr"?"IA · toujours disponible":lang==="ru"?"ИИ · всегда на связи":"AI · always available"}</div>
          </div>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"20px 20px 16px",display:"flex",flexDirection:"column",gap:"14px"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:"10px",alignItems:"flex-end"}}>
            {m.role==="assistant"&&<SphereIcon size={32} fontSize={14}>✦</SphereIcon>}
            <div style={{maxWidth:"76%",padding:"14px 18px",lineHeight:"1.7",borderRadius:m.role==="user"?"20px 20px 4px 20px":"20px 20px 20px 4px",background:m.role==="user"?`linear-gradient(135deg,${C.gold},${C.goldD})`:C.white,color:m.role==="user"?C.white:C.blue,fontSize:"17.5px",fontWeight:"400",boxShadow:m.role==="user"?C.shadowG:C.shadow,whiteSpace:"pre-wrap"}}>{m.content}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:"5px",paddingLeft:"42px"}}>{[0,1,2].map(i=><div key={i} style={{width:"7px",height:"7px",borderRadius:"50%",background:C.gold,animation:`abatonPulse 1.2s ${i*0.22}s ease-in-out infinite alternate`}}/>)}</div>}
        <div ref={endRef}/>
      </div>
      {messages.length<=2&&(
        <div style={{padding:"8px 16px 12px",display:"flex",gap:"8px",overflowX:"auto",flexShrink:0}}>
          {t.suggestions.map((s,i)=><button key={i} onClick={()=>send(s)} style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:"20px",padding:"8px 16px",color:C.textS,fontSize:"15.5px",cursor:"pointer",whiteSpace:"nowrap",fontFamily:FB,flexShrink:0,boxShadow:C.shadow}}>{s}</button>)}
        </div>
      )}
      <div style={{padding:"12px 16px 80px",background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",gap:"10px",flexShrink:0}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={t.concPlaceholder} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:"16px",padding:"13px 18px",color:C.blue,fontFamily:FB,fontSize:"17.5px",outline:"none"}}/>
        <button onClick={()=>send()} disabled={loading||!input.trim()} style={{background:`linear-gradient(135deg,${C.gold},${C.goldD})`,border:"none",borderRadius:"16px",padding:"0 20px",cursor:"pointer",opacity:loading||!input.trim()?0.4:1,color:C.white,fontSize:"22px",fontWeight:"400",boxShadow:C.shadowG}}>→</button>
      </div>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const NavHome    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>;
const NavAbaton  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>;
const NavDaman   = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20"/></svg>;
const NavWell    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>;
const NavChat    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const NAV = [
  {id:"home",Icon:NavHome},{id:"abaton",Icon:NavAbaton},{id:"damanhur",Icon:NavDaman},
  {id:"wellness",Icon:NavWell},{id:"concierge",Icon:NavChat},
];

// ── DASHBOARD (staff-only usage stats) ─────────────────────────────────────────
function DashboardPage({t,lang,setPage}) {
  const [pin,setPin] = useState("");
  const [pinOk,setPinOk] = useState(false);
  const [error,setError] = useState("");
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(false);

  const load = async(p) => {
    setLoading(true); setError("");
    try{
      const res = await fetch(`/api/stats?pin=${encodeURIComponent(p)}`);
      if(res.status===401){ setError("PIN errato"); setLoading(false); return; }
      const json = await res.json();
      if(!res.ok){ setError(json.error||"Errore"); setLoading(false); return; }
      setData(json); setPinOk(true);
    }catch(e){ setError("Errore di connessione"); }
    setLoading(false);
  };

  if(!pinOk) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}>
      <div style={{background:C.white,borderRadius:"20px",padding:"28px",width:"100%",maxWidth:"320px"}}>
        <div style={{fontFamily:FD,fontWeight:"500",fontSize:"18px",color:C.blue,marginBottom:"14px"}}>Dashboard — accesso</div>
        <input type="password" inputMode="numeric" autoFocus value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load(pin)} placeholder="PIN" style={{width:"100%",padding:"12px",borderRadius:"12px",border:`1px solid ${C.border}`,fontFamily:FB,fontSize:"17.5px",marginBottom:"12px",outline:"none"}}/>
        {error&&<div style={{color:"#B04A4A",fontSize:"14.5px",marginBottom:"10px"}}>{error}</div>}
        <div style={{display:"flex",gap:"10px"}}>
          <button onClick={()=>setPage("home")} style={{flex:1,padding:"12px",borderRadius:"14px",border:`1px solid ${C.border}`,background:"none",cursor:"pointer",fontFamily:FB}}>Annulla</button>
          <button onClick={()=>load(pin)} disabled={loading} style={{flex:1,padding:"12px",borderRadius:"14px",border:"none",background:C.gold,color:C.white,cursor:"pointer",fontFamily:FB}}>{loading?"...":"Entra"}</button>
        </div>
      </div>
    </div>
  );

  const Bar = ({rows,labelKey,countKey="count"}) => {
    const max = Math.max(1,...rows.map(r=>r[countKey]));
    return (
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {rows.map((r,i)=>(
          <div key={i}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"14.5px",color:C.textS,marginBottom:"3px"}}>
              <span>{r[labelKey]}</span><span style={{color:C.textM}}>{r[countKey]}</span>
            </div>
            <div style={{height:"6px",background:C.bg,borderRadius:"4px",overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(r[countKey]/max)*100}%`,background:C.gold,borderRadius:"4px"}}/>
            </div>
          </div>
        ))}
        {rows.length===0&&<div style={{fontSize:"14.5px",color:C.textM,fontStyle:"italic"}}>Nessun dato ancora.</div>}
      </div>
    );
  };

  const links = (data.topLabels||[]).filter(r=>r.type==="link");
  const pages = (data.topLabels||[]).filter(r=>r.type==="page");

  return (
    <div style={{paddingBottom:"100px",background:C.bg,minHeight:"100vh"}}>
      <div style={{position:"sticky",top:0,zIndex:50,padding:"32px 28px 24px",background:C.white,borderRadius:"0 0 32px 32px",boxShadow:C.shadow,marginBottom:"8px",overflow:"hidden"}}><HeaderRosone/>
        <Back label={t.back} onClick={()=>setPage("home")}/>
        <div style={{marginTop:"16px"}}>
          <Pill>Dashboard</Pill>
          <div style={{fontFamily:FD,fontSize:"32px",fontWeight:"300",color:C.blue,marginTop:"10px"}}>Utilizzo dell'app</div>
        </div>
      </div>
      <div style={{padding:"24px 22px 0"}}>
        <div style={{display:"flex",gap:"10px",marginBottom:"18px"}}>
          <button onClick={()=>load(pin)} style={{padding:"10px 16px",borderRadius:"12px",border:`1px solid ${C.border}`,background:C.white,color:C.textS,cursor:"pointer",fontFamily:FB,fontSize:"14.5px"}}>↻ Aggiorna</button>
          <button onClick={async()=>{ if(!window.confirm("Cancellare tutte le statistiche di navigazione? Feedback e recensioni non vengono toccati.")) return; await fetch("/api/reset",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin})}); load(pin); }} style={{padding:"10px 16px",borderRadius:"12px",border:`1px solid ${C.border}`,background:C.white,color:"#B04A4A",cursor:"pointer",fontFamily:FB,fontSize:"14.5px"}}>🗑 Azzera statistiche</button>
        </div>

        <div style={{display:"flex",gap:"10px",marginBottom:"24px"}}>
          <div style={{flex:1,background:C.white,borderRadius:"16px",padding:"16px",boxShadow:C.shadow,textAlign:"center"}}>
            <div style={{fontFamily:FD,fontSize:"28px",color:C.gold}}>{data.total}</div>
            <div style={{fontSize:"13.5px",color:C.textM}}>eventi totali</div>
          </div>
          <div style={{flex:1,background:C.white,borderRadius:"16px",padding:"16px",boxShadow:C.shadow,textAlign:"center"}}>
            <div style={{fontFamily:FD,fontSize:"28px",color:C.gold}}>{data.recentQuestions.length}</div>
            <div style={{fontSize:"13.5px",color:C.textM}}>domande al concierge</div>
          </div>
          <div style={{flex:1,background:C.white,borderRadius:"16px",padding:"16px",boxShadow:C.shadow,textAlign:"center"}}>
            <div style={{fontFamily:FD,fontSize:"28px",color:C.gold}}>{data.feedbackAvg?Number(data.feedbackAvg).toFixed(1):"—"}</div>
            <div style={{fontSize:"13.5px",color:C.textM}}>media feedback ({data.feedbackCount})</div>
          </div>
        </div>

        {(()=>{
          const cnt = ty => (data.byType.find(r=>r.type===ty)||{}).count||0;
          const opens = cnt("app_open"), popOpen = cnt("popoli_open"), popReq = data.popoliInterest||0;
          const staffReq = (data.requestsByItem||[]).reduce((n,r)=>n+r.count,0);
          const pct = (a,b) => b?Math.round(a/b*100)+"%":"—";
          const roomName = id => (ROOMS_LIST.find(r=>r.id===id)||{}).name||id;
          const Card = ({n,l,sub}) => (
            <div style={{flex:"1 1 130px",background:C.white,borderRadius:"16px",padding:"14px",boxShadow:C.shadow,textAlign:"center"}}>
              <div style={{fontFamily:FD,fontSize:"26px",color:C.gold}}>{n}</div>
              <div style={{fontSize:"13.5px",color:C.textM}}>{l}</div>
              {sub&&<div style={{fontSize:"12.5px",color:C.goldD,marginTop:"3px"}}>{sub}</div>}
            </div>
          );
          return (
            <Section title="Dall'app alla richiesta">
              <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginBottom:"14px"}}>
                <Card n={opens} l="aperture dell'app"/>
                <Card n={popOpen} l="Tempo dei Popoli aperto" sub={pct(popOpen,opens)+" delle aperture"}/>
                <Card n={popReq} l="richieste di meditazione" sub={pct(popReq,popOpen)+" di chi l'ha aperto"}/>
                <Card n={staffReq} l="richieste dirette allo staff"/>
              </div>
              <WhiteCard style={{marginBottom:"12px"}}>
                <div style={{fontSize:"13.5px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:C.goldD,marginBottom:"10px"}}>Per camera</div>
                {(data.roomFunnel||[]).length===0&&<div style={{fontSize:"14.5px",color:C.textM,fontStyle:"italic"}}>Nessun dato ancora.</div>}
                {(data.roomFunnel||[]).length>0&&(
                  <div style={{display:"grid",gridTemplateColumns:"1.2fr repeat(4,1fr)",gap:"6px 8px",fontSize:"14.5px",color:C.textS,alignItems:"center"}}>
                    <div/><div style={{fontSize:"12.5px",color:C.textM}}>aperture</div><div style={{fontSize:"12.5px",color:C.textM}}>Popoli</div><div style={{fontSize:"12.5px",color:C.textM}}>interesse</div><div style={{fontSize:"12.5px",color:C.textM}}>richieste</div>
                    {data.roomFunnel.map((r,i)=>[
                      <div key={"a"+i} style={{fontWeight:"700",color:C.blue}}>{roomName(r.room)}</div>,
                      <div key={"b"+i}>{r.opens}</div>,<div key={"c"+i}>{r.popoli_open}</div>,<div key={"d"+i}>{r.interest}</div>,<div key={"e"+i}>{r.requests}</div>
                    ])}
                  </div>
                )}
              </WhiteCard>
              <WhiteCard style={{marginBottom:"12px"}}>
                <div style={{fontSize:"13.5px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:C.goldD,marginBottom:"10px"}}>Richieste dirette per tipo</div>
                <Bar rows={data.requestsByItem||[]} labelKey="item"/>
              </WhiteCard>
              <WhiteCard>
                <div style={{fontSize:"13.5px",fontWeight:"700",letterSpacing:"0.1em",textTransform:"uppercase",color:C.goldD,marginBottom:"10px"}}>Ultime richieste allo staff</div>
                <div style={{display:"flex",flexDirection:"column",gap:"12px",maxHeight:"320px",overflowY:"auto"}}>
                  {(data.recentRequests||[]).map((q,i)=>(
                    <div key={i} style={{paddingBottom:"10px",borderBottom:i<data.recentRequests.length-1?`1px solid ${C.border}`:"none"}}>
                      <div style={{fontSize:"15.5px",color:C.textD}}>{q.item}{q.time_pref?` · ${q.time_pref}`:""}</div>
                      <div style={{fontSize:"13.5px",color:C.textS}}>{[q.name,q.room&&roomName(q.room)].filter(Boolean).join(" · ")}{q.note?` — ${q.note}`:""}</div>
                      <div style={{fontSize:"12.5px",color:C.textM,marginTop:"2px"}}>{new Date(q.created_at).toLocaleString("it-IT")}</div>
                    </div>
                  ))}
                  {(data.recentRequests||[]).length===0&&<div style={{fontSize:"14.5px",color:C.textM,fontStyle:"italic"}}>Nessuna richiesta ancora.</div>}
                </div>
              </WhiteCard>
            </Section>
          );
        })()}

        <Section title="Link più cliccati">
          <WhiteCard><Bar rows={links} labelKey="label"/></WhiteCard>
        </Section>

        <Section title="Pagine più visitate">
          <WhiteCard><Bar rows={pages} labelKey="label"/></WhiteCard>
        </Section>

        <Section title="Lingue degli ospiti">
          <WhiteCard><Bar rows={data.byLang} labelKey="lang"/></WhiteCard>
        </Section>

        <Section title="Ultime domande al concierge">
          <WhiteCard>
            <div style={{display:"flex",flexDirection:"column",gap:"12px",maxHeight:"320px",overflowY:"auto"}}>
              {data.recentQuestions.map((q,i)=>(
                <div key={i} style={{paddingBottom:"10px",borderBottom:i<data.recentQuestions.length-1?`1px solid ${C.border}`:"none"}}>
                  <div style={{fontSize:"15.5px",color:C.textD}}>{q.label}</div>
                  <div style={{fontSize:"12.5px",color:C.textM,marginTop:"2px"}}>{q.lang?.toUpperCase()} · {new Date(q.created_at).toLocaleString("it-IT")}</div>
                </div>
              ))}
              {data.recentQuestions.length===0&&<div style={{fontSize:"14.5px",color:C.textM,fontStyle:"italic"}}>Nessuna domanda ancora.</div>}
            </div>
          </WhiteCard>
        </Section>

        <Section title="Errori concierge">
          <WhiteCard>
            <div style={{display:"flex",flexDirection:"column",gap:"12px",maxHeight:"320px",overflowY:"auto"}}>
              {(data.recentErrors||[]).map((e,i)=>(
                <div key={i} style={{paddingBottom:"10px",borderBottom:i<(data.recentErrors.length-1)?`1px solid ${C.border}`:"none"}}>
                  <div style={{fontSize:"15.5px",color:"#B04A4A"}}>{e.label}</div>
                  <div style={{fontSize:"12.5px",color:C.textM,marginTop:"2px"}}>{e.lang?.toUpperCase()} · {new Date(e.created_at).toLocaleString("it-IT")}</div>
                </div>
              ))}
              {(!data.recentErrors||data.recentErrors.length===0)&&<div style={{fontSize:"14.5px",color:C.textM,fontStyle:"italic"}}>Nessun errore registrato.</div>}
            </div>
          </WhiteCard>
        </Section>

        <Section title="Ultimi feedback">
          <WhiteCard>
            <div style={{display:"flex",flexDirection:"column",gap:"12px",maxHeight:"320px",overflowY:"auto"}}>
              {data.recentFeedback.map((f,i)=>(
                <div key={i} style={{paddingBottom:"10px",borderBottom:i<data.recentFeedback.length-1?`1px solid ${C.border}`:"none"}}>
                  <div style={{fontSize:"15.5px",color:C.gold}}>{"★".repeat(f.rating)}{"☆".repeat(5-f.rating)}</div>
                  {f.comment&&<div style={{fontSize:"15.5px",color:C.textD,marginTop:"3px"}}>{f.comment}</div>}
                  <div style={{fontSize:"12.5px",color:C.textM,marginTop:"2px"}}>{f.room||""} {f.lang?.toUpperCase()} · {new Date(f.created_at).toLocaleString("it-IT")}</div>
                </div>
              ))}
              {data.recentFeedback.length===0&&<div style={{fontSize:"14.5px",color:C.textM,fontStyle:"italic"}}>Nessun feedback ancora.</div>}
            </div>
          </WhiteCard>
        </Section>
      </div>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function AbatonApp() {
  const [page,setPage] = useState("home");
  const [lang,setLang] = useState(()=>getSession()?.lang||"it");
  const [,setCfgTick] = useState(0);
  const t = cxDeep(T[lang]||T.it);
  useEffect(()=>{
    let alive = true;
    const pull = () => fetch("/api/config",{cache:"no-store"}).then(r=>r.ok?r.json():null).then(j=>{ if(alive&&j&&j.values){ setCfg(j.values); setCfgTick(x=>x+1); } }).catch(()=>{});
    pull();
    const id = setInterval(pull, 5*60*1000);
    const onVis = () => { if(document.visibilityState==="visible") pull(); };
    document.addEventListener("visibilitychange",onVis);
    return ()=>{ alive=false; clearInterval(id); document.removeEventListener("visibilitychange",onVis); };
  },[]);
  const goPage = (id) => { track("page", id, {lang}); setPage(id); scrollTop0(); };
  const goLang = (l) => { track("lang", l); setLang(l); };
  useEffect(()=>{
    const link=document.createElement("link"); link.rel="stylesheet"; link.href=FONT_URL;
    document.head.appendChild(link);
    return()=>{try{document.head.removeChild(link);}catch(e){}};
  },[]);
  // ── SALVASCHERMO: l'evento "app aperta" parte solo al tocco, non al caricamento ──
  const [asleep,setAsleep] = useState(false);
  const asleepRef = useRef(false);
  const lastAct = useRef(Date.now());
  const inUse = useRef(false);
  const markUse = () => { if(!inUse.current){ inUse.current=true; track("app_open","App aperta"); } };
  useEffect(()=>{
    const onAct = () => { if(asleepRef.current) return; lastAct.current=Date.now(); markUse(); };
    const evs = ["pointerdown","keydown","touchstart","wheel","scroll"];
    evs.forEach(e=>window.addEventListener(e,onAct,{passive:true,capture:true}));
    const tick = setInterval(()=>{
      if(asleepRef.current) return;
      const limit = KEEP_AWAKE>0 ? 10*60*1000 : 90*1000;
      if(Date.now()-lastAct.current>limit){ asleepRef.current=true; inUse.current=false; setAsleep(true); }
    },5000);
    const pre = setTimeout(()=>{ SS_IMGS.forEach(src=>{ const im=new Image(); im.src=src; }); },5000);
    return ()=>{ evs.forEach(e=>window.removeEventListener(e,onAct,{capture:true})); clearInterval(tick); clearTimeout(pre); };
  },[]);
  const wake = () => { asleepRef.current=false; setAsleep(false); lastAct.current=Date.now(); markUse(); };
  // ── LANDSCAPE (TABLET) LAYOUT ─────────────────────────────────────────────
  const [isLandscape,setIsLandscape] = useState(()=>window.innerWidth>window.innerHeight&&window.innerWidth>=900);
  useEffect(()=>{
    const onResize=()=>setIsLandscape(window.innerWidth>window.innerHeight&&window.innerWidth>=900);
    window.addEventListener('resize',onResize);
    window.addEventListener('orientationchange',onResize);
    return()=>{window.removeEventListener('resize',onResize);window.removeEventListener('orientationchange',onResize);};
  },[]);
  const noNav = [];
  // ── TABLET / STAFF ────────────────────────────────────────────────────────
  const [session, setSession] = useState(()=>getSession());
  const [showStaff, setShowStaff] = useState(false);
  const [editorPin, setEditorPin] = useState(null);
  const [letter, setLetter] = useState(()=>pendingLetterFor(getSession()));
  const roomInfo = ROOMS_LIST.find(r=>r.id===getRoom());
  // ── ONBOARDING ──────────────────────────────────────────────────────────
  const [showOnboard, setShowOnboard] = useState(()=>{
    try {
      const s = getSession();
      if (s) return s.id !== localStorage.getItem('abaton_onboarded_id');
      return !localStorage.getItem('abaton_visited');
    } catch(e){ return false; }
  });
  const [onboardStep, setOnboardStep] = useState(0);
  const onboardSteps0 = [
    ...(session ? [{
      key:"welcome", icon:"✦",
      title: lang==="it"?"Il tuo soggiorno inizia qui":lang==="de"?"Dein Aufenthalt beginnt hier":lang==="fr"?"Votre séjour commence ici":lang==="ru"?"Ваше пребывание начинается здесь":"Your stay begins here",
      desc: roomInfo
        ? (lang==="it"?`${session.name}, sei nella Stanza ${roomInfo.name}. ${roomInfo.lineIT}`:lang==="de"?`${session.name}, du wohnst im Zimmer ${roomInfo.name}. ${roomInfo.lineDE}`:lang==="fr"?`${session.name}, tu séjournes dans la Chambre ${roomInfo.name}. ${roomInfo.lineFR}`:lang==="ru"?`${session.name}, вы находитесь в комнате ${roomInfo.name}. ${roomInfo.lineRU}`:`${session.name}, you're staying in the ${roomInfo.name} Room. ${roomInfo.lineEN}`)
        : (lang==="it"?`Un caloroso benvenuto, ${session.name}.`:lang==="de"?`Ein herzliches Willkommen, ${session.name}.`:lang==="fr"?`Une chaleureuse bienvenue, ${session.name}.`:lang==="ru"?`Тёплый привет, ${session.name}.`:`A warm welcome, ${session.name}.`),
    }] : []),
    {key:"practical", icon:"◯",
      title:lang==="it"?"Le informazioni utili":lang==="de"?"Die praktischen Informationen":lang==="fr"?"Les informations pratiques":lang==="ru"?"Полезная информация":"The practical details",
      desc:lang==="it"
        ?`WiFi "abaton", password abaton1950. ${t.checkOut}. Silenzio dalle 22 alle 8. Trovi tutto anche nella schermata Home.`
        :lang==="de"
        ?`WLAN "abaton", Passwort abaton1950. ${t.checkOut}. Ruhezeit von 22 bis 8 Uhr. Du findest alles auch auf dem Home-Bildschirm.`
        :lang==="fr"
        ?`WiFi "abaton", mot de passe abaton1950. ${t.checkOut}. Silence de 22h à 8h. Tu retrouveras tout cela sur l'écran d'accueil.`
        :lang==="ru"
        ?`WiFi «abaton», пароль abaton1950. ${t.checkOut}. Тишина с 22:00 до 8:00. Всё это вы также найдёте на главном экране.`
        :`WiFi "abaton", password abaton1950. ${t.checkOut}. Quiet hours from 22:00 to 8:00. You'll always find this on the Home screen.`,
    },
    {key:"exp",   icon:"✦", title:lang==="it"?"Inizia da qui":lang==="de"?"Hier beginnen":lang==="fr"?"Commence ici":lang==="ru"?"Начни отсюда":"Start here",        desc:lang==="it"?"Questa app nasce dal desiderio di offrirti più informazioni per vivere al meglio il tuo soggiorno ad Abaton.":lang==="de"?"Diese App ist entstanden, um dir mehr Informationen für einen optimal gestalteten Aufenthalt im Abaton zu bieten.":lang==="fr"?"Cette application est née du désir de t'offrir plus d'informations pour vivre au mieux ton séjour à l'Abaton.":lang==="ru"?"Это приложение создано, чтобы дать вам больше информации для наилучшего пребывания в Абатоне.":"This app was created to offer you more information to make the most of your stay at Abaton."},
    {key:"abaton",icon:"◈", title:lang==="it"?"Le Cinque Stanze":lang==="de"?"Die fünf Zimmer":lang==="fr"?"Les Cinq Chambres":lang==="ru"?"Пять комнат":"The Five Rooms", desc:lang==="it"?"Esplora le stanze e il loro significato":lang==="de"?"Erkunde die Zimmer und ihre Bedeutung":lang==="fr"?"Explore les chambres et leur signification":lang==="ru"?"Изучите комнаты и их значение":"Explore the rooms and their meaning"},
    {key:"events",icon:"◎", title:lang==="it"?"Gli eventi":lang==="de"?"Die Veranstaltungen":lang==="fr"?"Les événements":lang==="ru"?"Мероприятия":"Events",               desc:lang==="it"?"Scopri cosa accade questa settimana a Damanhur":lang==="de"?"Entdecke, was diese Woche in Damanhur passiert":lang==="fr"?"Découvre ce qui se passe cette semaine à Damanhur":lang==="ru"?"Узнайте, что происходит на этой неделе в Даманхуре":"Discover what's happening this week at Damanhur"},
  ];
  const onboardSteps = onboardSteps0.map(st=>({...st,desc:cx(st.desc)}));
  const dismissOnboard = () => {
    try {
      localStorage.setItem('abaton_visited','1');
      if (session) localStorage.setItem('abaton_onboarded_id', session.id);
    } catch(e){}
    setShowOnboard(false);
  };
  const handleSaveSession = (data) => {
    const s = saveSession(data);
    setSession(s);
    setLang(s.lang);
    setOnboardStep(0);
    setShowOnboard(true);
    setShowStaff(false);
    setLetter(pendingLetterFor(s));
  };
  const dismissLetter = () => {
    try{ if(session&&letter) localStorage.setItem(`abaton_letter_${session.id}_${letter}`,'1'); }catch(e){}
    setLetter(null);
  };
  const handleClearSession = () => {
    clearSession();
    setSession(null);
    setShowStaff(false);
  };

  const render = () => {
    switch(page){
      case "home":       return <HomePage       t={t} lang={lang} setLang={goLang} setPage={goPage} session={session} onOpenStaff={()=>setShowStaff(true)}/>;
      case "experience": return <ExperiencePage t={t} lang={lang}                  setPage={goPage}/>;
      case "abaton":     return <AbatonPage     t={t} lang={lang}                  setPage={goPage}/>;
      case "damanhur":   return <DamanPage      t={t} lang={lang}                  setPage={goPage}/>;
      case "wellness":   return <WellnessPage   t={t} lang={lang}                  setPage={goPage}/>;
      case "shop":       return <GuestsPage     t={t} lang={lang}                  setPage={goPage}/>;
      case "concierge":  return <ConciergePage  t={t} lang={lang}                  setPage={goPage}/>;
      case "dashboard":  return <DashboardPage  t={t} lang={lang}                  setPage={goPage}/>;
      default:           return <HomePage       t={t} lang={lang} setLang={goLang} setPage={goPage} session={session} onOpenStaff={()=>setShowStaff(true)}/>;
    }
  };
  return(
    <div style={{display:"flex",minHeight:"100vh",background:C.bg}}>
      <style>{`
        :root{color-scheme:light only}
        body{color:#14223D}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:0}
        input::placeholder{color:${C.textM}}
        button{-webkit-tap-highlight-color:transparent}
        @keyframes abatonSeal{0%,100%{transform:scale(1);filter:drop-shadow(0 0 0 rgba(255,200,160,0))}50%{transform:scale(1.06);filter:drop-shadow(0 0 14px rgba(255,190,150,0.55))}}
        @keyframes abatonFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes abatonTap{0%,100%{opacity:0.55;transform:scale(0.97)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes abatonFade{from{opacity:0}to{opacity:1}}
        @keyframes abatonLetterIn{from{opacity:0;transform:translateY(46px) scale(0.92)}to{opacity:1;transform:none}}
        @keyframes abatonSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes abatonPulse{from{opacity:.15;transform:scale(.6)}to{opacity:1;transform:scale(1.3)}}
      `}</style>
      {isLandscape&&!noNav.includes(page)&&(
        <nav style={{width:"96px",flexShrink:0,background:`${C.card}f8`,backdropFilter:"blur(20px)",borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"32px",zIndex:200,boxShadow:"4px 0 20px rgba(26,48,96,0.06)"}}>
          {NAV.map(({id,Icon})=>{
            const active = page===id||(page==="experience"&&id==="home");
            return(
              <button key={id} onClick={()=>goPage(id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",padding:"3px 8px",color:active?C.gold:C.blue,background:"none",border:"none",cursor:"pointer",fontFamily:FB,fontSize:"11px",fontWeight:active?"500":"300",letterSpacing:"0.1em",textTransform:"uppercase",transition:"color 0.2s"}}>
                <Icon/>{t.nav[NAV.indexOf(NAV.find(n=>n.id===id))]}
              </button>
            );
          })}
        </nav>
      )}
      <div style={{flex:1,display:"flex",justifyContent:"center",minWidth:0}}>
        <div style={{width:"100%",maxWidth:isLandscape?"1100px":"768px",color:C.text,fontFamily:FB,position:"relative"}}>
          <div id="scrollRoot" style={{overflowY:noNav.includes(page)?"hidden":"auto",height:"100vh"}}>{render()}</div>
          {!isLandscape&&!noNav.includes(page)&&(
            <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"768px",background:`${C.card}f8`,backdropFilter:"blur(20px)",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-around",padding:"10px 0 18px",zIndex:200,boxShadow:"0 -4px 20px rgba(26,48,96,0.06)"}}>
              {NAV.map(({id,Icon})=>{
                const active = page===id||(page==="experience"&&id==="home");
                return(
                  <button key={id} onClick={()=>goPage(id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",padding:"3px 4px",color:active?C.gold:C.blue,background:"none",border:"none",cursor:"pointer",fontFamily:FB,fontSize:"11px",fontWeight:active?"500":"300",letterSpacing:"0.06em",textTransform:"uppercase",transition:"color 0.2s"}}>
                    <Icon/>{t.nav[NAV.indexOf(NAV.find(n=>n.id===id))]}
                  </button>
                );
              })}
            </nav>
          )}
      {showOnboard&&!letter&&(
        <div style={{position:"fixed",inset:0,background:"rgba(20,34,61,0.82)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}} onClick={dismissOnboard}>
          <div style={{background:C.white,borderRadius:"28px",padding:"32px 28px",maxWidth:"340px",width:"100%",textAlign:"center"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:FD,fontSize:"28px",color:C.gold,marginBottom:"6px"}}>Abaton</div>
            <div style={{fontFamily:FS,fontSize:"15.5px",color:C.textM,marginBottom:"28px",fontStyle:"italic"}}>
              {lang==="it"?"Benvenuto. Qualche cosa da esplorare:":lang==="de"?"Willkommen. Ein paar Dinge zum Entdecken:":lang==="fr"?"Bienvenue. Quelques choses à explorer :":lang==="ru"?"Добро пожаловать. Несколько вещей, которые стоит изучить:":"Welcome. A few things to explore:"}
            </div>
            {onboardSteps.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:"14px",alignItems:"flex-start",marginBottom:"20px",textAlign:"left",opacity:onboardStep===i?1:0.45,transition:"opacity 0.3s"}} onClick={()=>setOnboardStep(i)}>
                <div style={{width:"42px",height:"42px",borderRadius:"50%",background:C.goldPale,border:`2px solid ${C.gold}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:"18px"}}>{s.icon}</div>
                <div>
                  <div style={{fontFamily:FB,fontSize:"15.5px",color:C.blue,marginBottom:"2px"}}>{s.title}</div>
                  <div style={{fontFamily:FS,fontSize:"13.5px",color:C.textM,lineHeight:"1.5"}}>{s.desc}</div>
                </div>
              </div>
            ))}
            <div style={{display:"flex",gap:"8px",marginTop:"8px"}}>
              {onboardStep > 0 && <button onClick={()=>setOnboardStep(p=>p-1)} style={{flex:1,padding:"12px",borderRadius:"14px",border:`1px solid ${C.border}`,background:"none",fontFamily:FB,fontSize:"14.5px",color:C.textM,cursor:"pointer"}}>←</button>}
              {onboardStep < onboardSteps.length-1
                ? <button onClick={()=>setOnboardStep(p=>p+1)} style={{flex:2,padding:"12px",borderRadius:"14px",border:"none",background:C.gold,color:C.white,fontFamily:FB,fontSize:"14.5px",cursor:"pointer",letterSpacing:"0.05em"}}>
                    {lang==="it"?"Avanti →":lang==="de"?"Weiter →":lang==="fr"?"Suivant →":lang==="ru"?"Далее →":"Next →"}
                  </button>
                : <button onClick={dismissOnboard} style={{flex:2,padding:"12px",borderRadius:"14px",border:"none",background:C.gold,color:C.white,fontFamily:FB,fontSize:"14.5px",cursor:"pointer",letterSpacing:"0.05em"}}>
                    {lang==="it"?"Inizia →":lang==="de"?"Los geht's →":lang==="fr"?"C'est parti →":lang==="ru"?"Начнём →":"Let's go →"}
                  </button>
              }
            </div>
          </div>
        </div>
      )}
      {showStaff&&(
        <StaffPanel session={session} onSave={handleSaveSession} onClear={handleClearSession} onClose={()=>setShowStaff(false)} onDashboard={()=>{setShowStaff(false);goPage("dashboard");}} onEditInfo={pn=>{setShowStaff(false);setEditorPin(pn);}}/>
      )}
      {asleep&&<Screensaver lang={lang} onWake={wake}/>}
      {editorPin&&(
        <InfoEditor pin={editorPin} onClose={()=>setEditorPin(null)} onSaved={()=>setCfgTick(x=>x+1)}/>
      )}
      {letter&&session&&page==="home"&&(
        <LetterOverlay lang={lang} session={session} phase={letter} onDone={dismissLetter} onReview={()=>{dismissLetter();goPage("shop");}}/>
      )}
        </div>
      </div>
    </div>
  );
}
