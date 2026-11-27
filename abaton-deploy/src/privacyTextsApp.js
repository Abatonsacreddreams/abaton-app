// Informative specifiche dell'app Abaton, scritte sul modello dell'informativa clienti
// (stesso titolare, DPO e diritti). Bozza da far verificare all'addetto privacy / DPO.
// Se nel pannello staff viene inserito un testo per la stessa voce, quello ha la precedenza.

const HEAD_IT = `Associazione La Grande Opera impresa sociale · Via Baldissero, 21 – Vidracco (TO) · c.f./P.Iva 12957570018`;
const HEAD_EN = HEAD_IT;

const TAIL_IT = `Titolare del trattamento
Associazione La Grande Opera impresa sociale, con sede legale in Via Baldissero, 21, Vidracco (TO), in persona del Presidente pro tempore.

Responsabile della Protezione dei Dati (DPO)
Domiciliato per la funzione presso la sede legale del Titolare, contattabile all'indirizzo direttivo@grandeopera.org

Diritti dell'interessato
Con riferimento agli artt. 15 – diritto di accesso, 16 – diritto di rettifica, 17 – diritto alla cancellazione, 18 – diritto di limitazione del trattamento, 20 – diritto alla portabilità dei dati, 21 – diritto di opposizione e 22 – processo decisionale automatizzato del GDPR, puoi esercitare i tuoi diritti scrivendo a direttivo@grandeopera.org oppure al Titolare all'indirizzo sopra indicato, specificando l'oggetto della richiesta e allegando copia di un documento d'identità. Puoi inoltre proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).

Per tutto quanto non indicato qui vale l'Informativa Clienti di Abaton, consultabile nella pagina Privacy dell'app (icona dello scudo nella Home).`;

const TAIL_EN = `Data Controller
Associazione La Grande Opera impresa sociale, with registered office at Via Baldissero, 21, Vidracco (TO), represented by its President pro tempore.

Data Protection Officer (DPO)
Domiciled for this function at the Controller's registered office, reachable at direttivo@grandeopera.org

Rights of the data subject
With reference to Arts. 15 – right of access, 16 – right to rectification, 17 – right to erasure, 18 – right to restriction of processing, 20 – right to data portability, 21 – right to object and 22 – automated decision-making of the GDPR, you may exercise your rights by writing to direttivo@grandeopera.org or to the Controller at the address above, specifying the subject of your request and enclosing a copy of an identity document. You may also lodge a complaint with the Italian Data Protection Authority (www.garanteprivacy.it).

For anything not covered here, the Abaton Client Notice applies; you can read it on the Privacy page of the app (shield icon on the Home screen).`;

// ── 1. Uso dell'app (primo accesso) ───────────────────────────────────────────
export const PRIVACY_APP = {
  it: `${HEAD_IT}

Informativa sull'uso dell'app Abaton
(art. 13 GDPR 679/2016)

Questa informativa riguarda l'app Abaton che trovi sul tablet della camera o che apri dal tuo telefono.

Quali dati trattiamo
• il nome con cui lo staff ti accoglie nell'app, le date del soggiorno e la lingua scelta;
• i dati che scegli di inserire quando invii una richiesta allo staff: nome, numero di telefono, giorno e fascia oraria preferiti, eventuali note;
• l'indirizzo email, solo se ti iscrivi alla newsletter;
• le domande che scrivi al Concierge;
• dati di utilizzo dell'app, senza dati identificativi: sezioni aperte, lingua, camera del tablet;
• le conferme che dai alle informative (data, ora e versione del testo).
L'app non ti chiede mai dati particolari (ad esempio sulla salute): se scegli di indicarli in una nota, saranno trattati solo per rispondere alla tua richiesta.

Finalità e base giuridica
1. mostrarti le informazioni sul soggiorno e sui servizi e permetterti di inviare richieste allo staff, che ti ricontatta al numero indicato (esecuzione del contratto di soggiorno e di misure richieste da te);
2. rispondere alle tue domande tramite il Concierge (esecuzione del servizio richiesto);
3. migliorare l'app e i servizi tramite statistiche di utilizzo (legittimo interesse del Titolare);
4. conservare la prova delle informative lette e dei consensi prestati (obbligo legale e legittimo interesse del Titolare);
5. tutelare i beni della struttura: i tablet in camera segnalano allo staff se vengono collegati da una rete diversa da quella di Abaton (legittimo interesse del Titolare). Questo controllo riguarda il dispositivo, non la tua persona;
6. inviarti la newsletter, solo con il tuo consenso.

Destinatari e fornitori
I dati sono trattati dal personale autorizzato di Abaton. Per far funzionare l'app ci avvaliamo di fornitori che agiscono come responsabili del trattamento: servizi cloud per l'hosting dell'app e del database, il servizio di messaggistica con cui lo staff riceve le richieste (Telegram), il servizio di intelligenza artificiale del Concierge (Anthropic) e il foglio di calcolo del registro dei consensi (Google). L'app usa inoltre servizi esterni per il meteo, i caratteri tipografici e i video (Vimeo), che ricevono solo dati tecnici di collegamento. Alcuni fornitori hanno sede o server fuori dallo Spazio Economico Europeo (ad esempio negli Stati Uniti): il trasferimento avviene sulla base delle garanzie previste dagli artt. 45 e 46 GDPR (decisione di adeguatezza o clausole contrattuali standard). I dati non sono diffusi.

Conservazione
I dati del tuo soggiorno salvati sul tablet (nome, date, conferme) vengono cancellati automaticamente il giorno della partenza. Le richieste, le domande al Concierge e le statistiche di utilizzo sono conservate per il tempo necessario a gestire il soggiorno e a migliorare il servizio, e poi cancellate. Il registro delle conferme è conservato per il tempo necessario a dimostrare l'informativa resa e i consensi prestati. L'email della newsletter è conservata fino alla revoca del consenso.

Natura del conferimento
L'uso dell'app è facoltativo. I dati richiesti nei moduli (nome e telefono) servono allo staff per ricontattarti: senza di essi non possiamo gestire la richiesta, ma puoi sempre rivolgerti allo staff di persona.

${TAIL_IT}`,
  en: `${HEAD_EN}

Notice on the use of the Abaton app
(Art. 13 GDPR 679/2016)

This notice covers the Abaton app on the tablet in your room or opened from your own phone.

What data we process
• the name with which the staff welcomes you in the app, the dates of your stay and the language you choose;
• the data you choose to enter when you send a request to the staff: name, phone number, preferred day and time of day, any notes;
• your email address, only if you subscribe to the newsletter;
• the questions you write to the Concierge;
• app usage data, with no identifying data: sections opened, language, room of the tablet;
• the confirmations you give to the notices (date, time and version of the text).
The app never asks you for special categories of data (for example about your health): if you choose to include them in a note, they will be processed only to answer your request.

Purposes and legal basis
1. to show you information about your stay and our services and let you send requests to the staff, who will contact you at the number you provide (performance of the stay contract and of steps taken at your request);
2. to answer your questions through the Concierge (provision of the requested service);
3. to improve the app and our services through usage statistics (legitimate interest of the Controller);
4. to keep proof of the notices read and the consents given (legal obligation and legitimate interest of the Controller);
5. to protect the property of the facility: the in-room tablets notify the staff if they are connected from a network other than Abaton's (legitimate interest of the Controller). This check concerns the device, not you;
6. to send you the newsletter, only with your consent.

Recipients and providers
Data are processed by authorised Abaton staff. To run the app we rely on providers acting as data processors: cloud services hosting the app and its database, the messaging service through which the staff receives requests (Telegram), the artificial intelligence service behind the Concierge (Anthropic) and the spreadsheet holding the consent register (Google). The app also uses external services for weather, fonts and videos (Vimeo), which receive only technical connection data. Some providers are based or have servers outside the European Economic Area (for example in the United States): such transfers rely on the safeguards provided by Arts. 45 and 46 GDPR (adequacy decision or standard contractual clauses). Data are not disclosed to the public.

Retention
The data of your stay saved on the tablet (name, dates, confirmations) are deleted automatically on your day of departure. Requests, questions to the Concierge and usage statistics are kept for as long as needed to manage your stay and improve the service, and then deleted. The register of confirmations is kept for as long as needed to prove the notice given and the consents obtained. Your newsletter email is kept until you withdraw your consent.

Provision of data
Using the app is optional. The data requested in the forms (name and phone) allow the staff to contact you: without them we cannot handle the request, but you can always speak to the staff in person.

${TAIL_EN}`,
};

// ── 2. Prenotazione dei trattamenti benessere ─────────────────────────────────
export const PRIVACY_WELLNESS = {
  it: `${HEAD_IT}

Informativa per la prenotazione dei trattamenti benessere
(art. 13 GDPR 679/2016)

Quali dati trattiamo
Nome, numero di telefono, trattamento scelto, giorno e fascia oraria preferiti, eventuali note che scegli di scrivere, camera e lingua.
Non ti chiediamo informazioni sulla tua salute. Se ritieni utile indicarle (ad esempio una controindicazione), puoi farlo direttamente con l'operatore al momento del trattamento; se le scrivi nella nota, saranno trattate solo per organizzare il trattamento, con il consenso che presti inviando il modulo (art. 9, par. 2, lett. a GDPR).

Finalità e base giuridica
• organizzare il trattamento richiesto e ricontattarti per confermarlo (esecuzione di misure richieste da te e del servizio);
• conservare la prova dell'informativa letta (legittimo interesse del Titolare).

Destinatari
La richiesta arriva al personale autorizzato di Abaton tramite il servizio di messaggistica usato dallo staff (Telegram). Per fissare l'appuntamento, i dati strettamente necessari (nome, recapito, trattamento, giorno e orario) sono comunicati all'operatore o alla realtà che svolge il trattamento. I dati non sono diffusi.

Conservazione
Per il tempo necessario a organizzare e svolgere il trattamento e ad adempiere agli obblighi amministrativi e fiscali collegati.

Natura del conferimento
Nome e telefono sono necessari per ricontattarti e confermare l'appuntamento: senza di essi non possiamo gestire la prenotazione dall'app, ma puoi sempre rivolgerti allo staff di persona.

${TAIL_IT}`,
  en: `${HEAD_EN}

Notice for booking wellness treatments
(Art. 13 GDPR 679/2016)

What data we process
Name, phone number, the treatment chosen, preferred day and time of day, any notes you choose to write, room and language.
We do not ask you for information about your health. If you think it is useful to share it (for example a contraindication), you can do so directly with the practitioner at the time of the treatment; if you write it in the note, it will be processed only to arrange the treatment, on the basis of the consent you give by sending the form (Art. 9(2)(a) GDPR).

Purposes and legal basis
• to arrange the requested treatment and contact you to confirm it (steps taken at your request and provision of the service);
• to keep proof of the notice read (legitimate interest of the Controller).

Recipients
The request reaches authorised Abaton staff through the messaging service used by the staff (Telegram). To set the appointment, the strictly necessary data (name, contact, treatment, day and time) are passed on to the practitioner or organisation providing the treatment. Data are not disclosed to the public.

Retention
For as long as needed to arrange and provide the treatment and to meet the related administrative and tax obligations.

Provision of data
Name and phone are needed to contact you and confirm the appointment: without them we cannot handle the booking from the app, but you can always speak to the staff in person.

${TAIL_EN}`,
};

// ── 3. Newsletter "Rimani connesso" ───────────────────────────────────────────
export const PRIVACY_NEWSLETTER = {
  it: `${HEAD_IT}

Informativa per l'iscrizione alla newsletter "Rimani connesso"
(art. 13 GDPR 679/2016)

Quali dati trattiamo
Indirizzo email, lingua, camera da cui ti iscrivi, data e ora del consenso.

Finalità e base giuridica
Inviarti la newsletter di Abaton con offerte riservate agli ospiti e notizie dalla struttura, sulla base del tuo consenso (art. 6, par. 1, lett. a GDPR), che presti spuntando la casella prima dell'iscrizione.

Destinatari
Il personale autorizzato di Abaton, che riceve la notizia dell'iscrizione tramite il servizio di messaggistica usato dallo staff (Telegram), e il fornitore del servizio di invio delle email, che agisce come responsabile del trattamento. I dati non sono diffusi né ceduti a terzi per loro finalità.

Conservazione
Fino alla revoca del consenso. Dopo la revoca l'indirizzo viene cancellato dalla lista di invio; resta solo la registrazione del consenso e della revoca, per dimostrarli.

Revoca del consenso
Puoi revocare il consenso in qualsiasi momento, gratuitamente e con effetto immediato, usando il link "disiscriviti" in fondo a ogni email o scrivendo a direttivo@grandeopera.org. La revoca non pregiudica la liceità degli invii fatti prima.

Natura del conferimento
L'iscrizione è facoltativa e non ha alcun effetto sul tuo soggiorno.

${TAIL_IT}`,
  en: `${HEAD_EN}

Notice for subscribing to the "Stay connected" newsletter
(Art. 13 GDPR 679/2016)

What data we process
Email address, language, the room you subscribe from, date and time of your consent.

Purposes and legal basis
To send you the Abaton newsletter with offers reserved for guests and news from the facility, on the basis of your consent (Art. 6(1)(a) GDPR), which you give by ticking the box before subscribing.

Recipients
Authorised Abaton staff, who are notified of the subscription through the messaging service used by the staff (Telegram), and the email delivery provider, acting as data processor. Data are not disclosed to the public or passed on to third parties for their own purposes.

Retention
Until you withdraw your consent. After withdrawal your address is removed from the mailing list; only the record of your consent and of its withdrawal is kept, as proof.

Withdrawal of consent
You may withdraw your consent at any time, free of charge and with immediate effect, by using the "unsubscribe" link at the bottom of every email or by writing to direttivo@grandeopera.org. Withdrawal does not affect the lawfulness of the emails sent before.

Provision of data
Subscribing is optional and has no effect on your stay.

${TAIL_EN}`,
};

// ── 4. Concierge con intelligenza artificiale ─────────────────────────────────
export const PRIVACY_AI = {
  it: `Il Concierge è un assistente basato sull'intelligenza artificiale (Claude, di Anthropic). Le risposte sono generate automaticamente e possono contenere imprecisioni: per le cose importanti fai sempre riferimento allo staff. Non prende decisioni che ti riguardano.

Cosa succede alle tue domande
• vengono inviate al servizio di intelligenza artificiale di Anthropic, che agisce come responsabile del trattamento, solo per generare la risposta; il fornitore ha sede negli Stati Uniti e il trasferimento avviene con le garanzie previste dagli artt. 45 e 46 GDPR;
• sono visibili allo staff di Abaton, insieme alla camera del tablet, e vengono usate in forma aggregata per migliorare il servizio (legittimo interesse del Titolare);
• sono conservate per il tempo necessario a migliorare il servizio e poi cancellate.

Ti chiediamo di non scrivere dati personali o informazioni delicate, come quelle sulla salute. Per richieste personali usa i moduli di richiesta o rivolgiti allo staff.

Titolare del trattamento è Associazione La Grande Opera impresa sociale; per esercitare i tuoi diritti scrivi a direttivo@grandeopera.org. L'informativa completa è nella pagina Privacy dell'app.`,
  en: `The Concierge is an assistant based on artificial intelligence (Claude, by Anthropic). Its answers are generated automatically and may contain inaccuracies: for anything important, always check with our staff. It does not take any decisions about you.

What happens to your questions
• they are sent to Anthropic's artificial intelligence service, acting as data processor, only to generate the answer; the provider is based in the United States and the transfer relies on the safeguards provided by Arts. 45 and 46 GDPR;
• they are visible to the Abaton staff, together with the room of the tablet, and are used in aggregate form to improve the service (legitimate interest of the Controller);
• they are kept for as long as needed to improve the service and then deleted.

Please do not write personal data or sensitive information, such as details about your health. For personal requests, use the request forms or speak to the staff.

The Data Controller is Associazione La Grande Opera impresa sociale; to exercise your rights write to direttivo@grandeopera.org. The full notice is on the Privacy page of the app.`,
};
