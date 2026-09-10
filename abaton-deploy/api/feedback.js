import { sql } from '@vercel/postgres';

let ready = false;
async function ensureTable() {
  if (ready) return;
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id SERIAL PRIMARY KEY,
      rating INT,
      comment TEXT,
      room TEXT,
      lang TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  ready = true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { rating, comment, room, lang } = req.body || {};
    const r = Number(rating);
    if (!r || r < 1 || r > 5) return res.status(400).json({ error: 'Invalid rating' });
    await ensureTable();
    await sql`
      INSERT INTO feedback (rating, comment, room, lang)
      VALUES (${r}, ${comment ? String(comment).slice(0, 2000) : null}, ${room ? String(room).slice(0, 40) : null}, ${lang ? String(lang).slice(0, 5) : null})
    `;
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
