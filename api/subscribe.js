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
const DEFAULT_PDF_URL = 'https://analyse.elliottaziz.de/pdf';
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

  // Optional first name (from new email gate); sanitized to a sensible length.
  let firstName = String(body.name || '').trim().replace(/\s+/g, ' ');
  if (firstName.length > 60) firstName = firstName.slice(0, 60);

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
  if (firstName) contactPayload.attributes.FIRSTNAME = firstName;

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
    to: [{ email, ...(firstName ? { name: firstName } : {}) }],
    subject: 'Deine Abnehm-Analyse ist da (Stress & Heißhunger)',
    htmlContent: buildEmailHtml({ challengeUrl, pdfUrl, firstName }),
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
function buildEmailHtml({ challengeUrl, pdfUrl, firstName }) {
  const cta = escapeHtml(challengeUrl);
  const pdf = escapeHtml(pdfUrl);
  const greeting = firstName ? `Hi ${escapeHtml(firstName)},` : 'Hi,';
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Deine Abnehm-Analyse</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f4f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1e1c1a;-webkit-font-smoothing:antialiased;">

  <!-- Preheader (shows in inbox preview, hidden in body) -->
  <div style="display:none;font-size:1px;color:#f6f4f1;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
    Dein Report zeigt dir schwarz auf weiß, warum du feststeckst — und wie du in 7 Tagen den Kreislauf brichst.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f6f4f1;padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(30,28,26,0.06);">

          <!-- Top accent bar -->
          <tr><td style="height:5px;background:linear-gradient(90deg,#e8530e 0%,#DF031C 70%,#14482c 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

          <!-- Single body block -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#7a7568;">Dein persönlicher Report</p>

              <h1 style="margin:0 0 28px;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;font-weight:800;font-size:28px;line-height:1.15;letter-spacing:-0.015em;color:#1e1c1a;">
                Hier ist deine Abnehm-Analyse.
              </h1>

              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#3a332e;">${greeting}</p>

              <p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:#3a332e;">
                hier ist deine Abnehm-Analyse.
              </p>

              <p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:#3a332e;">
                Darin siehst du schwarz auf weiß:
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 24px;">
                <tr><td style="padding:2px 0;font-size:16px;line-height:1.6;color:#3a332e;">— dein Stress- &amp; Heißhunger-Profil,</td></tr>
                <tr><td style="padding:2px 0;font-size:16px;line-height:1.6;color:#3a332e;">— warum du trotz „Wissen" immer wieder aus der Spur fliegst,</td></tr>
                <tr><td style="padding:2px 0;font-size:16px;line-height:1.6;color:#3a332e;">— und was dein 3-Schritt-Plan aus der Analyse ist.</td></tr>
              </table>

              <p style="margin:0 0 8px;font-size:16px;line-height:1.6;color:#3a332e;">
                Lies vor allem:
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 28px;">
                <tr><td style="padding:2px 0;font-size:16px;line-height:1.6;color:#3a332e;">— <strong style="color:#1e1c1a;">Seite 2–3:</strong> Alltag &amp; Muster</td></tr>
                <tr><td style="padding:2px 0;font-size:16px;line-height:1.6;color:#3a332e;">— <strong style="color:#1e1c1a;">Seite 4:</strong> ehrliche Prognose, wenn du nichts änderst</td></tr>
                <tr><td style="padding:2px 0;font-size:16px;line-height:1.6;color:#3a332e;">— <strong style="color:#1e1c1a;">Seite 5–6:</strong> dein 3-Schritt-Plan + Mona (−10 kg in 12 Wochen)</td></tr>
              </table>

              <p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:#3a332e;">
                <strong style="color:#1e1c1a;">Die harte Wahrheit:</strong> Die Analyse allein ändert nichts, wenn du danach weitermachst wie bisher.
              </p>

              <p style="margin:0 0 28px;font-size:16px;line-height:1.6;color:#3a332e;">
                Genau deshalb gibt es die <strong style="color:#1e1c1a;">7-Tage Reset-Challenge</strong> — sie setzt deinen 3-Schritt-Plan in 7 Tagen um, unter 20 Minuten pro Tag, speziell für dein Stress- &amp; Heißhunger-Profil.
              </p>

              <p style="margin:0 0 22px;font-size:16px;line-height:1.55;color:#1e1c1a;">
                👉 <strong>Wenn du nicht willst, dass der Report im Download-Ordner verstaubt:</strong>
              </p>

              <!-- CTA button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:8px auto 14px;">
                <tr>
                  <td align="center" style="border-radius:999px;background:linear-gradient(135deg,#e8530e,#DF031C);box-shadow:0 8px 24px rgba(223,3,28,0.22);">
                    <a href="${cta}" target="_blank"
                       style="display:inline-block;padding:16px 34px;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:800;letter-spacing:0.04em;color:#ffffff;text-decoration:none;border-radius:999px;">
                      Jetzt 7-Tage Reset-Challenge starten →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 32px;font-size:12.5px;line-height:1.5;color:#9b938a;text-align:center;">
                Empfohlen auf Basis deiner Analyse — Schritt 4 von 4
              </p>

              <!-- Online-Report Card (after CTA, soft secondary action) -->
              <p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#5c5650;">
                Oder lies dir deine vollständige Analyse jetzt durch:
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 32px;">
                <tr>
                  <td style="background:#faf8f5;border:1px solid rgba(30,28,26,0.10);border-radius:12px;padding:16px 18px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td width="52" valign="middle" style="padding-right:14px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                            <td align="center" valign="middle" width="44" height="52" style="background:#1e1c1a;border-radius:6px;color:#ffffff;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;font-size:18px;font-weight:800;line-height:52px;">
                              📄
                            </td>
                          </tr></table>
                        </td>
                        <td valign="middle">
                          <p style="margin:0 0 3px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14.5px;font-weight:700;color:#1e1c1a;line-height:1.3;">Deine vollständige Abnehm-Analyse</p>
                          <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12.5px;color:#7a7568;line-height:1.3;">6 Seiten · online ansehen</p>
                        </td>
                        <td valign="middle" align="right" style="padding-left:12px;">
                          <a href="${pdf}" target="_blank" style="display:inline-block;background:#1e1c1a;color:#ffffff;text-decoration:none;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;padding:10px 16px;border-radius:8px;letter-spacing:0.02em;white-space:nowrap;">
                            Öffnen →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#3a332e;">
                Liebe Grüße<br>
                Elliott
              </p>
            </td>
          </tr>

          <!-- Minimal footer (no separate background, no extra hierarchy) -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0;font-size:12.5px;color:#9b938a;line-height:1.55;">
                Wenn du Fragen hast, antworte einfach auf diese E-Mail. Du erhältst diese Nachricht, weil du die Abnehm-Analyse auf analyse.elliottaziz.de durchgeführt hast.
              </p>
            </td>
          </tr>
        </table>
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
