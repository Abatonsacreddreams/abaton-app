import { sql } from '@vercel/postgres';

// Azzera le statistiche di navigazione (tabella events), protetto dal PIN staff.
// body: { pin, room }  room = "all" (o assente) | terra | metalli | acqua | specchi | popoli | "none" (senza stanza: telefoni)
const ROOMS = ['terra', 'metalli', 'acqua', 'specchi', 'popoli'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const pin = process.env.STATS_PIN || '1950';
  const { pin: sent, room } = req.body || {};
  if (sent !== pin) { await new Promise((r) => setTimeout(r, 1200)); return res.status(401).json({ error: 'Unauthorized' }); }
  try {
    if (!room || room === 'all') {
      await sql`TRUNCATE TABLE events`;
    } else if (ROOMS.includes(room)) {
      await sql`DELETE FROM events WHERE room = ${room}`;
    } else if (room === 'none') {
      await sql`DELETE FROM events WHERE room IS NULL OR room = ''`;
    } else {
      return res.status(400).json({ error: 'Unknown room' });
    }
    return res.status(204).end();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
