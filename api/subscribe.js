// Vercel Serverless Function — adds an email to Brevo (Sendinblue)
// Configure via Vercel Environment Variables:
//   BREVO_API_KEY      (required) — xkeysib-...
//   BREVO_LIST_ID      (optional) — numeric ID of the list to add contacts to

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const email = String(body.email || '').trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Valid email required' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('BREVO_API_KEY environment variable is not set');
    return res.status(500).json({ ok: false, error: 'Server misconfigured' });
  }

  const payload = {
    email,
    attributes: {
      FUNNEL: '7-tage-reset-challenge',
      OPT_IN_DATE: new Date().toISOString(),
    },
    updateEnabled: true,
  };

  const listId = process.env.BREVO_LIST_ID;
  if (listId) {
    const parsed = parseInt(listId, 10);
    if (!Number.isNaN(parsed)) payload.listIds = [parsed];
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok && response.status !== 204) {
      const text = await response.text();
      console.error('Brevo API error', response.status, text);
      return res.status(200).json({ ok: false, queued: true });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe handler error', err);
    return res.status(200).json({ ok: false, queued: true });
  }
}
