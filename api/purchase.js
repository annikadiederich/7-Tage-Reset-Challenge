// Vercel Serverless Function — marks an email as a buyer in Brevo
// Adds contact to Käufer list and removes from Leads list, so the
// drip automation stops. Configure via Vercel Environment Variables:
//   BREVO_API_KEY            (required)
//   BREVO_BUYER_LIST_ID      (required) — numeric ID of the buyers list
//   BREVO_LIST_ID            (optional) — numeric ID of the leads list (will be unlinked)

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

  const buyerListId = parseInt(process.env.BREVO_BUYER_LIST_ID || '', 10);
  const leadsListId = parseInt(process.env.BREVO_LIST_ID || '', 10);

  const attributes = {
    PURCHASED: true,
    PURCHASE_DATE: new Date().toISOString().slice(0, 10),
    FUNNEL: '7-tage-reset-challenge',
  };
  if (body.order_id) attributes.ORDER_ID = String(body.order_id);
  if (body.product_id) attributes.PRODUCT_ID = String(body.product_id);
  if (body.first_name) attributes.VORNAME = String(body.first_name);
  if (body.last_name) attributes.NACHNAME = String(body.last_name);
  if (body.amount) {
    const amt = parseFloat(String(body.amount).replace(',', '.'));
    if (!Number.isNaN(amt)) attributes.AMOUNT = amt;
  }

  const payload = {
    email,
    attributes,
    updateEnabled: true,
  };
  if (!Number.isNaN(buyerListId)) payload.listIds = [buyerListId];
  if (!Number.isNaN(leadsListId)) payload.unlinkListIds = [leadsListId];

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
    console.error('Purchase handler error', err);
    return res.status(200).json({ ok: false, queued: true });
  }
}
