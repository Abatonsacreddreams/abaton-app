// Verifica il PIN staff (variabile STATS_PIN su Vercel). Usato dal pannello staff del tablet:
// così il PIN non è più scritto nel codice dell'app, che è pubblico.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const pin = process.env.STATS_PIN || '1950';
  const sent = String((req.body || {}).pin || '');
  if (sent && sent === pin) return res.status(204).end();
  await new Promise((r) => setTimeout(r, 1200)); // rallenta i tentativi a caso
  return res.status(401).json({ error: 'Unauthorized' });
}
