import { sql } from '@vercel/postgres';

let ready = false;
async function ensureTable() {
  if (ready) return;
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      lang TEXT,
      room TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  ready = true;
}

const ROOM_NAMES = { terra: 'Terra', metalli: 'Metalli', acqua: 'Acqua', specchi: 'Specchi', popoli: 'Popoli' };

async function notifyTelegram(type, label, lang, room) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const roomName = room ? (ROOM_NAMES[room] || room) : null;
  let text = null;
  if (type === 'app_open') {
    text = `📱 App aperta${roomName ? ` — stanza ${roomName}` : ''}`;
  } else if (type === 'concierge') {
    text = `💬 Domanda al Concierge${roomName ? ` (${roomName})` : ''}:\n"${label}"`;
  } else if (type === 'link' && /^WhatsApp/i.test(label)) {
    text = `⭐ Interesse mostrato${roomName ? ` (${roomName})` : ''}:\n${label}`;
  }
  if (!text) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (err) {
    // Never let a Telegram hiccup break tracking.
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { type, label, lang, room } = req.body || {};
    if (!type || !label) return res.status(400).json({ error: 'Missing type or label' });
    await ensureTable();
    await sql`
      INSERT INTO events (type, label, lang, room)
      VALUES (${String(type).slice(0, 40)}, ${String(label).slice(0, 200)}, ${lang ? String(lang).slice(0, 5) : null}, ${room ? String(room).slice(0, 40) : null})
    `;
    await notifyTelegram(String(type).slice(0, 40), String(label).slice(0, 200), lang, room);
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
