import { sql } from '@vercel/postgres';

const ALLOWED = [
  'checkOut', 'breakfastFrom', 'breakfastTo', 'receptionFrom', 'receptionTo',
  'wifiName', 'wifiPass', 'reviewUrl', 'noticeIT', 'noticeEN', 'conciergeNotes', 'privacyText',
];

async function ensureTable() {
  await sql`CREATE TABLE IF NOT EXISTS app_config (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
}

export default async function handler(req, res) {
  try {
    await ensureTable();
    if (req.method === 'GET') {
      const r = await sql`SELECT value FROM app_config WHERE key = 'main'`;
      let values = {};
      try { values = JSON.parse(r.rows[0]?.value || '{}'); } catch (e) { values = {}; }
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ values });
    }
    if (req.method === 'POST') {
      const pin = process.env.STATS_PIN || '1950';
      const { pin: sent, values } = req.body || {};
      if (sent !== pin) return res.status(401).json({ error: 'Unauthorized' });
      const clean = {};
      for (const k of ALLOWED) {
        if (values && typeof values[k] === 'string') clean[k] = values[k].trim().slice(0, k === 'privacyText' ? 20000 : 2000);
      }
      await sql`
        INSERT INTO app_config (key, value, updated_at) VALUES ('main', ${JSON.stringify(clean)}, now())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
      `;
      return res.status(200).json({ values: clean });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
