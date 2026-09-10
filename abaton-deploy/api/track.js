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
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
