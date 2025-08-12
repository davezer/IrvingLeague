// src/routes/api/nominate/+server.js
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private'; // ⬅️ dynamic envs

export const POST = async ({ request, getClientAddress, fetch }) => {
  const data = await request.json().catch(() => null);
  if (!data) return json({ error: 'Invalid JSON' }, { status: 400 });

  // Honeypot
  if ((data.website || '').trim() !== '') return json({ ok: true });

  const RESEND_API_KEY = env.RESEND_API_KEY;
  const TO_EMAIL       = env.NOMINATION_TO_EMAIL;
  const FROM_EMAIL     = env.NOMINATION_FROM_EMAIL || 'Badges Bot <no-reply@yourdomain.com>';

  if (!RESEND_API_KEY || !TO_EMAIL) {
    return json({ ok: false, error: 'Email service not configured (missing envs).' }, { status: 500 });
  }

  const rows = [
    ['Badge', `${data.badgeName ?? ''} (#${data.badgeId ?? ''})`],
    ['Type', data.badgeType ?? ''],
    ['Nominee Team', data.nomineeTeam ?? ''],
    ['Evidence', data.evidenceUrl ?? ''],
    ['Submitter Team', data.submitterTeam ?? ''],
    ['Submitter Email', data.submitterEmail ?? ''],
    ['IP', getClientAddress()],
    ['User Agent', data.userAgent ?? ''],
    ['Timestamp', data.timestamp ?? new Date().toISOString()]
  ];

  const table = rows.map(([k, v]) => `
    <tr>
      <td style="padding:6px 10px;border:1px solid #ddd;background:#f7f7f7;"><strong>${k}</strong></td>
      <td style="padding:6px 10px;border:1px solid #ddd;">${v || ''}</td>
    </tr>
  `).join('');

  const html = `<div>
    <h2>New Badge Nomination</h2>
    <table style="border-collapse:collapse;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;">
      ${table}
    </table>
  </div>`;

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: data.submitterEmail,
      subject: `Badge Nomination: ${data.badgeName ?? ''} (#${data.badgeId ?? ''})`,
      html
    })
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    return json({ ok: false, error: 'Email send failed', detail: text }, { status: 502 });
  }

  return json({ ok: true });
};
