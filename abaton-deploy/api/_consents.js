import { sql } from '@vercel/postgres';

// Registro dei consensi privacy (file con "_": non è un endpoint, è condiviso dalle funzioni).
// Sezioni: primo_accesso, concierge_ia, richiesta, trattamenti_benessere, newsletter.
export const SECTIONS = {
  primo_accesso: 'Primo accesso (uso dell\'app)',
  concierge_ia: 'Concierge IA',
  richiesta: 'Richieste allo staff',
  trattamenti_benessere: 'Trattamenti benessere',
  newsletter: 'Newsletter (Rimani connesso)',
};
const ROOMS = { terra: 'Terra', metalli: 'Metalli', acqua: 'Acqua', specchi: 'Specchi', popoli: 'Popoli' };
const LANGS = ['it', 'en', 'de', 'fr', 'ru'];

let ready = false;
export async function ensureConsents() {
  if (ready) return;
  await sql`CREATE TABLE IF NOT EXISTS consents (
    id SERIAL PRIMARY KEY, section TEXT NOT NULL, name TEXT, email TEXT, room TEXT, lang TEXT,
    ref TEXT, version TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
  ready = true;
}

const clip = (v, n) => (v === undefined || v === null || v === '' ? null : String(v).slice(0, n));

export async function logConsent({ section, name, email, room, lang, ref, version }) {
  if (!SECTIONS[section]) return;
  await ensureConsents();
  await sql`INSERT INTO consents (section, name, email, room, lang, ref, version) VALUES (
    ${section}, ${clip(name, 120)}, ${clip(email, 200)}, ${ROOMS[room] ? room : null},
    ${LANGS.includes(lang) ? lang : null}, ${clip(ref, 200)}, ${clip(version, 40)})`;
}

export function roomName(r) { return ROOMS[r] || ''; }
