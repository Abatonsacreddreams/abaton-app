import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const pin = process.env.STATS_PIN || '1950';
  if (req.query.pin !== pin) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await sql`CREATE TABLE IF NOT EXISTS feedback (id SERIAL PRIMARY KEY, rating INT, comment TEXT, room TEXT, lang TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    await sql`CREATE TABLE IF NOT EXISTS guest_requests (id SERIAL PRIMARY KEY, name TEXT, room TEXT, item TEXT NOT NULL, time_pref TEXT, note TEXT, lang TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    await sql`ALTER TABLE guest_requests ADD COLUMN IF NOT EXISTS phone TEXT`;
    await sql`ALTER TABLE guest_requests ADD COLUMN IF NOT EXISTS req_date TEXT`;
    const [totals, byType, topLabels, byLang, byDay, recentQuestions, feedbackSummary, recentFeedback, recentErrors, roomFunnel, requestsByItem, recentRequests, popoliInterest] = await Promise.all([
      sql`SELECT COUNT(*)::int AS count FROM events`,
      sql`SELECT type, COUNT(*)::int AS count FROM events GROUP BY type ORDER BY count DESC`,
      sql`SELECT type, label, COUNT(*)::int AS count FROM events WHERE type IN ('link','page','room') GROUP BY type, label ORDER BY count DESC LIMIT 20`,
      sql`SELECT lang, COUNT(*)::int AS count FROM events WHERE lang IS NOT NULL GROUP BY lang ORDER BY count DESC`,
      sql`SELECT to_char(created_at, 'YYYY-MM-DD') AS day, COUNT(*)::int AS count FROM events WHERE created_at > now() - interval '14 days' GROUP BY day ORDER BY day ASC`,
      sql`SELECT label, lang, created_at FROM events WHERE type = 'concierge' ORDER BY created_at DESC LIMIT 50`,
      sql`SELECT COUNT(*)::int AS count, AVG(rating)::float AS avg FROM feedback`,
      sql`SELECT rating, comment, room, lang, created_at FROM feedback ORDER BY created_at DESC LIMIT 50`,
      sql`SELECT label, lang, created_at FROM events WHERE type = 'concierge_error' ORDER BY created_at DESC LIMIT 30`,
      sql`SELECT e.room, COUNT(*) FILTER (WHERE e.type = 'app_open')::int AS opens, COUNT(*) FILTER (WHERE e.type = 'popoli_open')::int AS popoli_open, COUNT(*) FILTER (WHERE e.type = 'link' AND e.label ILIKE 'WhatsApp%')::int AS interest, (SELECT COUNT(*)::int FROM guest_requests g WHERE g.room = e.room) AS requests FROM events e WHERE e.room IS NOT NULL AND e.room <> '' GROUP BY e.room ORDER BY opens DESC`,
      sql`SELECT item, COUNT(*)::int AS count FROM guest_requests GROUP BY item ORDER BY count DESC LIMIT 15`,
      sql`SELECT item, name, phone, room, time_pref, req_date, note, created_at FROM guest_requests ORDER BY created_at DESC LIMIT 30`,
      sql`SELECT ((SELECT COUNT(*) FROM events WHERE type = 'link' AND label ILIKE '%Popoli%') + (SELECT COUNT(*) FROM guest_requests WHERE item ILIKE '%Popoli%'))::int AS count`,
    ]);
    return res.status(200).json({
      total: totals.rows[0]?.count || 0,
      byType: byType.rows,
      topLabels: topLabels.rows,
      byLang: byLang.rows,
      byDay: byDay.rows,
      recentQuestions: recentQuestions.rows,
      feedbackCount: feedbackSummary.rows[0]?.count || 0,
      feedbackAvg: feedbackSummary.rows[0]?.avg || null,
      recentFeedback: recentFeedback.rows,
      recentErrors: recentErrors.rows,
      roomFunnel: roomFunnel.rows,
      requestsByItem: requestsByItem.rows,
      recentRequests: recentRequests.rows,
      popoliInterest: popoliInterest.rows[0]?.count || 0,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', detail: String(err && err.message || err) });
  }
}
