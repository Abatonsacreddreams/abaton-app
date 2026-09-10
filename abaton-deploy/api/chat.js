async function callAnthropic(apiKey, body) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { status: response.status, data };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });
  try {
    let { status, data } = await callAnthropic(apiKey, req.body);
    // Anthropic occasionally returns a transient overload/rate-limit error — retry once.
    if (data?.type === 'error' && (data.error?.type === 'overloaded_error' || status === 429)) {
      console.error('Anthropic transient error, retrying once:', data.error);
      await new Promise((r) => setTimeout(r, 900));
      ({ status, data } = await callAnthropic(apiKey, req.body));
    }
    if (data?.type === 'error') {
      console.error('Anthropic API error:', status, data.error);
    }
    return res.status(status).json(data);
  } catch (err) {
    console.error('chat.js proxy error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: String((err && err.message) || err) });
  }
}
