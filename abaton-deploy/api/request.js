import { sql } from '@vercel/postgres';

let ready = false;
async function ensureTable() {
  if (ready) return;
  await sql`
    CREATE TABLE IF NOT EXISTS guest_requests (
      id SERIAL PRIMARY KEY,
      name TEXT,
      room TEXT,
      item TEXT NOT NULL,
      time_pref TEXT,
      note TEXT,
      lang TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  ready = true;
}

const ROOM_NAMES = { terra: 'Terra', metalli: 'Metalli', acqua: 'Acqua', specchi: 'Specchi', popoli: 'Popoli' };

async function notifyTelegram({ name, room, item, timePref, note }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const roomName = room ? (ROOM_NAMES[room] || room) : null;
  const lines = [
    `✨ Nuova richiesta ospite`,
    item ? `Cosa: ${item}` : null,
    name ? `Nome: ${name}` : null,
    roomName ? `Stanza: ${roomName}` : null,
    timePref ? `Orario preferito: ${timePref}` : null,
    note ? `Note: ${note}` : null,
  ].filter(Boolean);
  const text = lines.join('\n');

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (err) {
    // Never let a Telegram hiccup break the request.
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, room, item, timePref, note, lang } = req.body || {};
    if (!item) return res.status(400).json({ error: 'Missing item' });
    await ensureTable();
    await sql`
      INSERT INTO guest_requests (name, room, item, time_pref, note, lang)
      VALUES (
        ${name ? String(name).slice(0, 80) : null},
        ${room ? String(room).slice(0, 40) : null},
        ${String(item).slice(0, 200)},
        ${timePref ? String(timePref).slice(0, 60) : null},
        ${note ? String(note).slice(0, 500) : null},
        ${lang ? String(lang).slice(0, 5) : null}
      )
    `;
    await notifyTelegram({ name, room, item, timePref, note });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
