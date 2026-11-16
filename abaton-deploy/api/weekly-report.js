import { sql } from '@vercel/postgres';
import { SYS_FACTS } from '../src/sysFacts.js';

// Report settimanale per lo staff, inviato nel bot Telegram.
// Lo avvia Vercel Cron (vedi vercel.json) ogni lunedì mattina.
// Non contiene nomi né telefoni degli ospiti.

const ROOM_NAMES = { terra: 'Terra', metalli: 'Metalli', acqua: 'Acqua', specchi: 'Specchi', popoli: 'Popoli' };
const roomName = (r) => (r ? ROOM_NAMES[r] || r : '—');

function authorized(req) {
  const secret = process.env.CRON_SECRET;
  if (secret) return req.headers.authorization === `Bearer ${secret}`;
  return /vercel-cron/i.test(req.headers['user-agent'] || '');
}

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const parts = [];
  let rest = text;
  while (rest.length > 3900) {
    let cut = rest.lastIndexOf('\n', 3900);
    if (cut < 1000) cut = 3900;
    parts.push(rest.slice(0, cut));
    rest = rest.slice(cut).replace(/^\n+/, '');
  }
  parts.push(rest);
  let ok = true;
  for (const part of parts) {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: part, disable_web_page_preview: true }),
    });
    if (!r.ok) { ok = false; console.error('Telegram error:', r.status, await r.text()); }
  }
  return ok;
}

async function collect() {
  await sql`CREATE TABLE IF NOT EXISTS events (id SERIAL PRIMARY KEY, type TEXT NOT NULL, label TEXT NOT NULL, lang TEXT, room TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS feedback (id SERIAL PRIMARY KEY, rating INT, comment TEXT, room TEXT, lang TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS guest_requests (id SERIAL PRIMARY KEY, name TEXT, room TEXT, item TEXT NOT NULL, time_pref TEXT, note TEXT, lang TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  await sql`ALTER TABLE guest_requests ADD COLUMN IF NOT EXISTS req_date TEXT`;
  const [opens, langs, top, questions, errors, requests, feedback] = await Promise.all([
    sql`SELECT room, COUNT(*)::int AS n FROM events WHERE type='app_open' AND created_at > now() - interval '7 days' GROUP BY room ORDER BY n DESC`,
    sql`SELECT lang, COUNT(*)::int AS n FROM events WHERE lang IS NOT NULL AND created_at > now() - interval '7 days' GROUP BY lang ORDER BY n DESC`,
    sql`SELECT type, label, COUNT(*)::int AS n FROM events WHERE type IN ('page','link','room','video') AND created_at > now() - interval '7 days' GROUP BY type, label ORDER BY n DESC LIMIT 25`,
    sql`SELECT label, lang, room FROM events WHERE type='concierge' AND created_at > now() - interval '7 days' ORDER BY created_at ASC LIMIT 150`,
    sql`SELECT COUNT(*)::int AS n FROM events WHERE type='concierge_error' AND created_at > now() - interval '7 days'`,
    sql`SELECT item, room, time_pref, req_date, note, lang FROM guest_requests WHERE created_at > now() - interval '7 days' ORDER BY created_at ASC LIMIT 100`,
    sql`SELECT rating, comment, room, lang FROM feedback WHERE created_at > now() - interval '7 days' ORDER BY created_at ASC LIMIT 50`,
  ]);
  return {
    opens: opens.rows, langs: langs.rows, top: top.rows, questions: questions.rows,
    errors: errors.rows[0]?.n || 0, requests: requests.rows, feedback: feedback.rows,
  };
}

function plainSummary(d) {
  const totOpens = d.opens.reduce((a, r) => a + r.n, 0);
  const lines = [
    '📊 Report settimanale Abaton (ultimi 7 giorni)',
    '',
    `App aperta: ${totOpens} volte` + (d.opens.length ? ` (${d.opens.map((r) => `${roomName(r.room)} ${r.n}`).join(', ')})` : ''),
    `Domande al Concierge: ${d.questions.length}` + (d.errors ? ` · errori del Concierge: ${d.errors}` : ''),
    `Richieste degli ospiti: ${d.requests.length}`,
    `Valutazioni lasciate: ${d.feedback.length}`,
  ];
  if (d.requests.length) {
    lines.push('', 'Richieste:');
    d.requests.forEach((r) => lines.push(`• ${r.item} (${roomName(r.room)}${r.req_date ? `, ${r.req_date}` : ''})`));
  }
  if (d.questions.length) {
    lines.push('', 'Domande al Concierge:');
    d.questions.slice(0, 40).forEach((q) => lines.push(`• ${q.label}`));
  }
  return lines.join('\n');
}

async function analyze(d) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const system = `Sei l'assistente di Denise, titolare dell'Abaton Sacred Dreams, un B&B vicino a Damanhur (Piemonte) con un'app per gli ospiti in 5 lingue (tablet in camera e telefoni). Ogni lunedì le scrivi un report in italiano semplice e caldo, letto su Telegram: testo semplice, niente markdown (niente asterischi, cancelletti o tabelle), elenchi con "•", emoji con parsimonia. Massimo 3500 caratteri.

Ecco cosa sa oggi il Concierge AI dell'app (le informazioni già presenti):
${SYS_FACTS}

Regole:
- Basati solo sui dati forniti; non inventare numeri, prezzi, orari o servizi.
- Non riportare mai nomi o numeri di telefono.
- Le proposte devono essere eleganti e rispettose dell'esperienza dell'ospite, mai commerciali o insistenti.
- Non proporre di indicare un prezzo per la meditazione nel Tempio dei Popoli né un orario fisso di check-in: sono scelte volute.
- Se la settimana è stata tranquilla (pochi dati), dillo in due righe e fai al massimo una proposta.`;
  const user = `Dati degli ultimi 7 giorni (JSON):
${JSON.stringify(d)}

Scrivi il report con queste sezioni:
1. In breve: aperture dell'app per stanza, lingue usate, sezioni più guardate.
2. Richieste degli ospiti: cosa hanno chiesto, tendenze, cose da notare per lo staff.
3. Domande al Concierge senza risposta: domande a cui, con le informazioni sopra, il Concierge non poteva rispondere bene o solo in modo vago. Per ognuna proponi il testo dell'informazione da aggiungere, oppure scrivi quale dato serve da Denise (es. "serve l'orario esatto di …"). Segnala anche se ci sono stati errori del Concierge.
4. Proposte per migliorare l'app: 2-4 idee concrete nate da questi dati (contenuti, servizi da proporre con garbo, cose da rendere più facili da trovare).
Chiudi ricordando che per applicare le modifiche basta inoltrare questo messaggio a Claude.`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-5', max_tokens: 2500, system, messages: [{ role: 'user', content: user }] }),
  });
  const data = await res.json();
  const text = (data?.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
  return text || null;
}

export default async function handler(req, res) {
  if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const d = await collect();
    let text = null;
    try { text = await analyze(d); } catch (e) { console.error('weekly-report analyze error:', e); }
    if (!text) text = plainSummary(d);
    else text = `📊 Report settimanale Abaton\n\n${text}`;
    const sent = await sendTelegram(text);
    return res.status(200).json({ ok: true, sent, questions: d.questions.length, requests: d.requests.length });
  } catch (err) {
    console.error('weekly-report error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
