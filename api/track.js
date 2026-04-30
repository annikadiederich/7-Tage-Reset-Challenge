// api/track.js — Funnel Analytics Tracking Endpoint
export default async function handler(req, res) {
  // CORS erlauben
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const event = req.body;
    if (!event || !event.type) return res.status(400).json({ error: 'Missing event type' });

    // Timestamp + IP (anonymisiert)
    event.timestamp = event.timestamp || Date.now();
    event.date = new Date().toISOString().split('T')[0];
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    event.ip_hash = ip ? simpleHash(ip) : 'unknown';

    // In Vercel KV speichern
    const { kv } = await import('@vercel/kv');

    // 1. Rohes Event speichern (letzte 10.000)
    await kv.lpush('events:all', JSON.stringify(event));
    await kv.ltrim('events:all', 0, 9999);

    // 2. Tages-Counter
    const dateKey = `stats:${event.date}`;

    if (event.type === 'page_view') {
      await kv.hincrby(dateKey, `page:${event.page}`, 1);
      await kv.hincrby('stats:total', `page:${event.page}`, 1);
      // Session tracken
      await kv.sadd(`sessions:${event.date}`, event.sessionId);
    }

    if (event.type === 'quiz_answer') {
      const key = `quiz:q${event.questionId}:${event.answer}`;
      await kv.hincrby(dateKey, key, 1);
      await kv.hincrby('stats:total', key, 1);
    }

    if (event.type === 'exit') {
      await kv.hincrby(dateKey, `exit:${event.page}`, 1);
      await kv.hincrby('stats:total', `exit:${event.page}`, 1);
      if (event.timeOnPage) {
        await kv.lpush(`time:${event.page}`, event.timeOnPage);
        await kv.ltrim(`time:${event.page}`, 0, 999);
      }
    }

    if (event.type === 'conversion') {
      await kv.hincrby(dateKey, 'conversions', 1);
      await kv.hincrby('stats:total', 'conversions', 1);
    }

    // TTL: Tages-Stats nach 90 Tagen löschen
    await kv.expire(dateKey, 60 * 60 * 24 * 90);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Track error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}
