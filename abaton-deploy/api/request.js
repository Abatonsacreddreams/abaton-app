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
  await sql`ALTER TABLE guest_requests ADD COLUMN IF NOT EXISTS phone TEXT`;
  await sql`ALTER TABLE guest_requests ADD COLUMN IF NOT EXISTS req_date TEXT`;
  ready = true;
}

const ROOM_NAMES = { terra: 'Terra', metalli: 'Metalli', acqua: 'Acqua', specchi: 'Specchi', popoli: 'Popoli' };

function fmtDate(d) {
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return null;
  try { return new Date(d + 'T12:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }); } catch (e) { return d; }
}

async function notifyTelegram({ name, phone, room, item, when, note }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const roomName = room ? (ROOM_NAMES[room] || room) : null;
  const lines = [
    `✨ Nuova richiesta ospite`,
    item ? `Cosa: ${item}` : null,
    name ? `Nome: ${name}` : null,
    phone ? `Telefono: ${phone}` : null,
    roomName ? `Stanza: ${roomName}` : null,
    when ? `Quando (indicativo): ${when}` : null,
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
    const { name, phone, room, item, date, slot, note, lang } = req.body || {};
    const niceDate = fmtDate(date);
    const when = [niceDate, slot].filter(Boolean).join(' · ') || null;
    if (!item) return res.status(400).json({ error: 'Missing item' });
    if (!phone || String(phone).replace(/\D/g, '').length < 7) return res.status(400).json({ error: 'Missing phone' });
    await ensureTable();
    await sql`
      INSERT INTO guest_requests (name, phone, room, item, time_pref, req_date, note, lang)
      VALUES (
        ${name ? String(name).slice(0, 80) : null},
        ${phone ? String(phone).slice(0, 40) : null},
        ${room ? String(room).slice(0, 40) : null},
        ${String(item).slice(0, 200)},
        ${slot ? String(slot).slice(0, 60) : null},
        ${date ? String(date).slice(0, 10) : null},
        ${note ? String(note).slice(0, 500) : null},
        ${lang ? String(lang).slice(0, 5) : null}
      )
    `;
    await notifyTelegram({ name, phone, room, item, when, note });
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
