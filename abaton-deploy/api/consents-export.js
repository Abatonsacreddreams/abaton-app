import { sql } from '@vercel/postgres';
import { SECTIONS, ensureConsents, roomName } from './_consents.js';

// Esportazione CSV del registro consensi, letta dal foglio Google con IMPORTDATA.
// Protetta dalla parola segreta EXPORT_TOKEN, impostata su Vercel (mai scritta nel codice).
// Uso: /api/consents-export?token=...&section=primo_accesso|concierge_ia|richiesta|trattamenti_benessere|newsletter|tutte

const csvCell = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const rome = (d) => new Date(d).toLocaleString('it-IT', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const secret = process.env.EXPORT_TOKEN;
  if (!secret) return res.status(503).send('Registro non ancora attivo: manca EXPORT_TOKEN su Vercel');
  if (String(req.query.token || '') !== secret) return res.status(401).send('Parola segreta non valida');
  const section = String(req.query.section || 'tutte');
  if (section !== 'tutte' && !SECTIONS[section]) return res.status(400).send('Sezione sconosciuta');

  try {
    await ensureConsents();
    const { rows } = section === 'tutte'
      ? await sql`SELECT * FROM consents ORDER BY created_at DESC LIMIT 5000`
      : await sql`SELECT * FROM consents WHERE section = ${section} ORDER BY created_at DESC LIMIT 5000`;
    const header = ['Data e ora', 'Sezione', 'Nome', 'Email', 'Stanza', 'Lingua', 'Riferimento', 'Versione informativa'];
    const lines = [header.join(',')];
    for (const r of rows) {
      lines.push([rome(r.created_at), SECTIONS[r.section] || r.section, r.name, r.email, roomName(r.room), r.lang, r.ref, r.version].map(csvCell).join(','));
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(lines.join('\n'));
  } catch (err) {
    console.error('consents-export error:', err);
    return res.status(500).send('Errore interno');
  }
}
