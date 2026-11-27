import { logConsent } from './_consents.js';

// POST: registra l'accettazione di un'informativa mostrata nell'app
// (primo accesso, Concierge IA). Le richieste e la newsletter registrano il consenso nei loro endpoint.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { section, name, room, lang, version, ref } = req.body || {};
    if (!['primo_accesso', 'concierge_ia'].includes(section)) return res.status(400).json({ error: 'Unknown section' });
    await logConsent({ section, name, room, lang, version, ref });
    return res.status(204).end();
  } catch (err) {
    console.error('consent error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
