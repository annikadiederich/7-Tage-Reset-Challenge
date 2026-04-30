// api/analytics.js — Gibt alle Daten ans Dashboard
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Einfacher Passwortschutz
  const token = req.query.token;
  if (token !== process.env.ANALYTICS_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { kv } = await import('@vercel/kv');

    const FUNNEL_PAGES = [
      { key: 'index', label: 'Landing Page' },
      { key: 'loading-quiz', label: 'Quiz Start' },
      { key: 'quiz', label: 'Quiz (Fragen)' },
      { key: 'plan-loading', label: 'Plan wird erstellt' },
      { key: 'plan-email', label: 'E-Mail Eingabe' },
      { key: 'challenge-2', label: 'Challenge Tag 2' },
      { key: 'challenge-3', label: 'Challenge Tag 3' },
      { key: 'offer', label: 'Offer Page' },
      { key: 'danke', label: 'Danke (Kauf!)' },
    ];

    const QUIZ_QUESTIONS = [
      { id: 1, q: 'Geschlecht' },
      { id: 2, q: 'Wie alt bist du?' },
      { id: 3, q: 'Körpertyp' },
      { id: 4, q: 'Wie viel möchtest du abnehmen?' },
      { id: 5, q: 'Zielgewicht' },
      { id: 6, q: 'Bisherige Diäten' },
      { id: 7, q: 'Aktivitätslevel' },
      { id: 8, q: 'Essgewohnheiten' },
      { id: 9, q: 'Motivation' },
    ];

    // Gesamtstatistiken laden
    const total = await kv.hgetall('stats:total') || {};

    // Letzte 7 Tage
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayStats = await kv.hgetall(`stats:${dateStr}`) || {};
      const sessionCount = await kv.scard(`sessions:${dateStr}`) || 0;
      days.push({ date: dateStr, stats: dayStats, sessions: sessionCount });
    }

    // Funnel aufbauen
    const funnel = FUNNEL_PAGES.map(page => {
      const views = parseInt(total[`page:${page.key}`] || 0);
      const exits = parseInt(total[`exit:${page.key}`] || 0);
      return { ...page, views, exits };
    });

    // Drop-off Raten berechnen
    for (let i = 0; i < funnel.length; i++) {
      if (i === 0) { funnel[i].dropoff = 0; continue; }
      const prev = funnel[i - 1].views;
      const curr = funnel[i].views;
      funnel[i].dropoff = prev > 0 ? Math.round((1 - curr / prev) * 100) : 0;
    }

    // Quiz-Antworten
    const quizData = {};
    for (const q of QUIZ_QUESTIONS) {
      quizData[q.id] = { question: q.q, answers: {} };
      const keys = Object.keys(total).filter(k => k.startsWith(`quiz:q${q.id}:`));
      for (const key of keys) {
        const answer = key.replace(`quiz:q${q.id}:`, '');
        quizData[q.id].answers[answer] = parseInt(total[key] || 0);
      }
    }

    // Durchschnittliche Zeit pro Seite
    const avgTimes = {};
    for (const page of FUNNEL_PAGES) {
      const times = await kv.lrange(`time:${page.key}`, 0, 99);
      if (times.length > 0) {
        const avg = times.reduce((a, b) => a + parseFloat(b), 0) / times.length;
        avgTimes[page.key] = Math.round(avg);
      }
    }

    // Letzte 20 Events
    const recentRaw = await kv.lrange('events:all', 0, 19);
    const recentEvents = recentRaw.map(e => {
      try { return typeof e === 'string' ? JSON.parse(e) : e; } catch { return null; }
    }).filter(Boolean);

    return res.status(200).json({
      funnel,
      quizData,
      avgTimes,
      recentEvents,
      dailyStats: days,
      conversions: parseInt(total['conversions'] || 0),
      generatedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Analytics error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
