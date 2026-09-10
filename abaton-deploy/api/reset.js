import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const pin = process.env.STATS_PIN || '1950';
  if ((req.body || {}).pin !== pin) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await sql`TRUNCATE TABLE events`;
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
