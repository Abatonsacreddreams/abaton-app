import { sql } from '@vercel/postgres';

// Antifurto dei tablet in camera.
// POST: segnale periodico di un tablet ({tablet, battery, charging}).
//       Se arriva da una rete diversa da quella dell'Abaton, avvisa lo staff su Telegram.
// GET:  stato dei tablet (ultimo segnale e batteria), senza indirizzi di rete.

const ROOMS = { terra: 'Terra', metalli: 'Metalli', acqua: 'Acqua', specchi: 'Specchi', popoli: 'Popoli' };

let ready = false;
async function ensureTable() {
  if (ready) return;
  await sql`CREATE TABLE IF NOT EXISTS tablet_beats (
    id SERIAL PRIMARY KEY, tablet TEXT NOT NULL, net TEXT NOT NULL, place TEXT,
    battery INT, charging BOOLEAN, alerted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  ready = true;
}

// Rete del tablet: indirizzo IPv4 pubblico, oppure il prefisso /64 per IPv6
// (ogni dispositivo IPv6 ha un indirizzo diverso, ma la rete di casa ha lo stesso prefisso).
function networkOf(req) {
  const raw = String(req.headers['x-real-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0] || '').trim();
  if (!raw) return 'unknown';
  if (raw.includes(':')) return raw.split(':').slice(0, 4).join(':') + '::/64';
  return raw;
}

function placeOf(req) {
  const dec = (v) => { try { return decodeURIComponent(v || ''); } catch (e) { return v || ''; } };
  return [dec(req.headers['x-vercel-ip-city']), dec(req.headers['x-vercel-ip-country-region']), req.headers['x-vercel-ip-country']]
    .filter(Boolean).join(', ') || null;
}

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (e) { /* un problema di Telegram non deve bloccare il segnale */ }
}

// Reti "di casa": quelle da cui hanno scritto almeno 2 tablet diversi negli ultimi 14 giorni,
// più quelle usate a lungo (almeno 12 segnali = 2 ore) da questo tablet.
async function homeNetworks(tablet) {
  const { rows } = await sql`
    SELECT net FROM tablet_beats WHERE created_at > now() - interval '14 days' AND alerted = false
    GROUP BY net HAVING COUNT(DISTINCT tablet) >= 2
    UNION
    SELECT net FROM tablet_beats WHERE created_at > now() - interval '14 days' AND alerted = false AND tablet = ${tablet}
    GROUP BY net HAVING COUNT(*) >= 12
    UNION
    SELECT net FROM tablet_beats WHERE created_at > now() - interval '14 days' AND tablet = ${tablet}
    GROUP BY net HAVING MAX(created_at) - MIN(created_at) > interval '48 hours'`;
  // L'ultima regola: se l'Abaton cambia connessione e c'è un solo tablet, dopo 2 giorni
  // di avvisi la nuova rete viene accettata come quella di casa.
  const extra = String(process.env.ABATON_NETWORKS || '').split(',').map((s) => s.trim()).filter(Boolean);
  return new Set([...rows.map((r) => r.net), ...extra]);
}

export default async function handler(req, res) {
  try {
    await ensureTable();
    if (req.method === 'GET') {
      const { rows } = await sql`
        SELECT DISTINCT ON (tablet) tablet, battery, charging, created_at
        FROM tablet_beats ORDER BY tablet, created_at DESC`;
      return res.status(200).json({ tablets: rows.map((r) => ({ room: r.tablet, lastSeen: r.created_at, battery: r.battery, charging: r.charging })) });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { tablet, battery, charging } = req.body || {};
    const room = String(tablet || '').toLowerCase();
    if (!ROOMS[room]) return res.status(400).json({ error: 'Unknown tablet' });
    const net = networkOf(req);
    const place = placeOf(req);
    const bat = Number.isFinite(Number(battery)) ? Math.max(0, Math.min(100, Math.round(Number(battery)))) : null;

    const home = await homeNetworks(room);
    // Si avvisa solo quando esiste già una rete "di casa" (dopo le prime ore) e questa è diversa.
    let alert = home.size > 0 && !home.has(net);
    if (alert) {
      // Se un altro tablet usa la stessa rete negli ultimi 30 minuti, è l'Abaton che ha cambiato connessione.
      const { rows: others } = await sql`SELECT 1 FROM tablet_beats WHERE net = ${net} AND tablet <> ${room} AND created_at > now() - interval '30 minutes' LIMIT 1`;
      if (others.length) alert = false;
    }
    let notify = false;
    if (alert) {
      const { rows: recent } = await sql`SELECT 1 FROM tablet_beats WHERE tablet = ${room} AND alerted = true AND created_at > now() - interval '3 hours' LIMIT 1`;
      notify = recent.length === 0;
    }

    await sql`INSERT INTO tablet_beats (tablet, net, place, battery, charging, alerted)
      VALUES (${room}, ${net}, ${place}, ${bat}, ${charging === true ? true : charging === false ? false : null}, ${alert})`;
    await sql`DELETE FROM tablet_beats WHERE created_at < now() - interval '30 days'`;

    if (notify) {
      await sendTelegram(
        `⚠️ Tablet della stanza ${ROOMS[room]}: si è collegato da una rete diversa da quella dell'Abaton.\n` +
        (place ? `Zona approssimativa della rete: ${place}\n` : '') +
        (bat !== null ? `Batteria: ${bat}%\n` : '') +
        `Potrebbe essere stato portato fuori dalla struttura. Controlla che sia in camera; se manca, localizzalo con "Trova il mio dispositivo" di Google.\n` +
        `(Se all'Abaton è appena cambiata la connessione internet, ad esempio dopo il riavvio del router, puoi ignorare questo messaggio.)`
      );
    }
    return res.status(204).end();
  } catch (err) {
    console.error('heartbeat error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
