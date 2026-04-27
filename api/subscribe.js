// Vercel Serverless Function — Brevo (Sendinblue) integration
// 1. Adds the contact to a Brevo list
// 2. Sends a confirmation email with the Abnehm-Analyse PDF attached
//
// Required Vercel Environment Variables:
//   BREVO_API_KEY        (required) — xkeysib-...
//   BREVO_SENDER_EMAIL   (required for email send) — e.g. kontakt@elliottaziz.de
//                         The sender domain MUST be verified in Brevo (SPF/DKIM).
//   BREVO_SENDER_NAME    (optional) — defaults to "Elliott Aziz"
//   BREVO_LIST_ID        (optional) — numeric ID of the list
//   PDF_URL              (optional) — public URL of the PDF attachment.
//                         Defaults to https://analyse.elliottaziz.de/abnehm-analyse.pdf

const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_EMAIL_URL = 'https://api.brevo.com/v3/smtp/email';
const DEFAULT_PDF_URL = 'https://analyse.elliottaziz.de/abnehm-analyse.pdf';
const DEFAULT_CHALLENGE_URL = 'https://analyse.elliottaziz.de/challenge';

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

  // ────────────────────── 1. Add contact to Brevo list ──────────────────────
  const contactPayload = {
    email,
    attributes: {
      FUNNEL: '7-tage-reset-challenge',
      OPT_IN_DATE: new Date().toISOString().slice(0, 10),
    },
    updateEnabled: true,
  };

  const listId = process.env.BREVO_LIST_ID;
  if (listId) {
    const parsed = parseInt(listId, 10);
    if (!Number.isNaN(parsed)) contactPayload.listIds = [parsed];
  }

  try {
    const contactRes = await fetch(BREVO_CONTACTS_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(contactPayload),
    });

    if (!contactRes.ok && contactRes.status !== 204) {
      const text = await contactRes.text();
      console.error('Brevo contact API error', contactRes.status, text);
      // Don't block — we still try to send the email below
    }
  } catch (err) {
    console.error('Subscribe handler — contact add error', err);
  }

  // ────────────────────── 2. Send confirmation email with PDF ──────────────────────
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'Elliott Aziz';
  const pdfUrl = process.env.PDF_URL || DEFAULT_PDF_URL;
  const challengeUrl = process.env.CHALLENGE_URL || DEFAULT_CHALLENGE_URL;

  if (!senderEmail) {
    console.warn('BREVO_SENDER_EMAIL not set — skipping confirmation email');
    return res.status(200).json({ ok: true, emailSent: false });
  }

  const emailPayload = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email }],
    subject: 'Deine Abnehm-Analyse — vollständiger Report im Anhang',
    htmlContent: buildEmailHtml({ challengeUrl }),
    attachment: [
      { url: pdfUrl, name: 'Deine-Abnehm-Analyse.pdf' },
    ],
    tags: ['abnehm-analyse', 'lead-magnet'],
  };

  try {
    const emailRes = await fetch(BREVO_EMAIL_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailRes.ok) {
      const text = await emailRes.text();
      console.error('Brevo email API error', emailRes.status, text);
      return res.status(200).json({ ok: true, emailSent: false });
    }

    return res.status(200).json({ ok: true, emailSent: true });
  } catch (err) {
    console.error('Subscribe handler — email send error', err);
    return res.status(200).json({ ok: true, emailSent: false });
  }
};

// ────────────────────── Email HTML template ──────────────────────
function buildEmailHtml({ challengeUrl }) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Deine Abnehm-Analyse</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f4f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1e1c1a;-webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f6f4f1;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(30,28,26,0.06);">

          <!-- Top accent bar -->
          <tr><td style="height:6px;background:linear-gradient(90deg,#e8530e 0%,#DF031C 70%,#14482c 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 28px;">
              <p style="margin:0 0 18px;font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#7a7568;">Dein persönlicher Report</p>

              <h1 style="margin:0 0 16px;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;font-weight:800;font-size:28px;line-height:1.15;letter-spacing:-0.015em;color:#1e1c1a;">
                Hier ist deine <span style="color:#e8530e;">Abnehm-Analyse</span>.
              </h1>

              <p style="margin:0 0 16px;font-size:16px;line-height:1.55;color:#3a332e;">
                Hi, danke fürs Vertrauen.
              </p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.55;color:#3a332e;">
                Im Anhang findest du deinen vollständigen Report als PDF — mit deinem persönlichen Profil, den Mechanismen, die dich aktuell ausbremsen, und dem 3-Schritt-Plan, den ich dir auf Basis deiner Antworten empfehle.
              </p>
              <p style="margin:0 0 26px;font-size:16px;line-height:1.55;color:#3a332e;">
                Lies ihn in Ruhe. Nimm dir die 5 Minuten — vor allem für die Reflexions-Fragen auf Seite 2. Genau dort liegt der Hebel.
              </p>

              <!-- CTA button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 24px;">
                <tr>
                  <td align="center" style="border-radius:999px;background:linear-gradient(135deg,#e8530e,#DF031C);box-shadow:0 8px 24px rgba(223,3,28,0.22);">
                    <a href="${escapeHtml(challengeUrl)}" target="_blank"
                       style="display:inline-block;padding:16px 32px;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;letter-spacing:0.04em;color:#ffffff;text-decoration:none;border-radius:999px;">
                      Jetzt 7-Tage Reset-Challenge starten →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 0;font-size:13px;line-height:1.5;color:#7a7568;text-align:center;">
                Empfohlen auf Basis deiner Analyse — Schritt 4 von 4
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="padding:0 36px;"><div style="height:1px;background:rgba(30,28,26,0.08);"></div></td></tr>

          <!-- Sub-section -->
          <tr>
            <td style="padding:24px 36px 32px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:#7a7568;">Was im PDF drinsteht</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr><td style="padding:6px 0;font-size:14px;color:#3a332e;">→ Dein Stress- &amp; Heißhunger-Profil</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#3a332e;">→ Reflexions-Fragen zum Ausfüllen</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#3a332e;">→ Warum dich dein aktuelles Muster ausbremst</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#3a332e;">→ Die ehrliche Prognose, wenn nichts passiert</td></tr>
                <tr><td style="padding:6px 0;font-size:14px;color:#3a332e;">→ Dein 3-Schritt-Plan + nächste Schritte</td></tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 36px 36px;background:#faf8f5;border-top:1px solid rgba(30,28,26,0.06);">
              <p style="margin:0 0 6px;font-size:13px;color:#5c5650;line-height:1.5;">
                Bei Fragen einfach auf diese E-Mail antworten.
              </p>
              <p style="margin:0;font-size:13px;color:#5c5650;line-height:1.5;">
                — Elliott
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:18px 0 0;font-size:11px;color:#9b938a;line-height:1.5;text-align:center;">
          Du erhältst diese E-Mail, weil du die Abnehm-Analyse auf analyse.elliottaziz.de durchgeführt hast.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
