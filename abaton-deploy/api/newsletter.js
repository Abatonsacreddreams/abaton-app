import { sql } from '@vercel/postgres';

// Iscrizioni a "Rimani connesso": salvate con data del consenso e inviate allo staff su Telegram.

const ROOMS = { terra: 'Terra', metalli: 'Metalli', acqua: 'Acqua', specchi: 'Specchi', popoli: 'Popoli' };
const LANGS = { it: 'italiano', en: 'inglese', de: 'tedesco', fr: 'francese', ru: 'russo' };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { email, lang, room, consent } = req.body || {};
    const mail = String(email || '').trim().toLowerCase().slice(0, 200);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return res.status(400).json({ error: 'Invalid email' });
    if (consent !== true) return res.status(400).json({ error: 'Consent required' });
    const lg = LANGS[lang] ? lang : null;
    const rm = ROOMS[room] ? room : null;

    await sql`CREATE TABLE IF NOT EXISTS newsletter_signups (
      id SERIAL PRIMARY KEY, email TEXT NOT NULL, lang TEXT, room TEXT,
      consent_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    await sql`INSERT INTO newsletter_signups (email, lang, room) VALUES (${mail}, ${lg}, ${rm})`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
      const text = `📧 Nuova iscrizione a "Rimani connesso"\n${mail}` +
        (lg ? `\nLingua: ${LANGS[lg]}` : '') + (rm ? `\nStanza: ${ROOMS[rm]}` : '') +
        `\nConsenso all'informativa: sì`;
      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text }),
        });
      } catch (e) { /* l'iscrizione resta salvata anche se Telegram non risponde */ }
    }
    return res.status(204).end();
  } catch (err) {
    console.error('newsletter error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
