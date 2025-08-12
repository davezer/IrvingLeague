// src/routes/api/nominate/+server.js
import { json } from '@sveltejs/kit';
import { RESEND_API_KEY, NOMINATION_TO_EMAIL, NOMINATION_FROM_EMAIL } from '$env/static/private';

export const POST = async ({ request, getClientAddress }) => {
  const data = await request.json().catch(() => null);
  if (!data) return json({ error: 'Invalid JSON' }, { status: 400 });

  // Honeypot: if filled, silently succeed
  if ((data.website || '').trim() !== '') return json({ ok: true });

  if (!data.badgeId || !data.badgeName) {
    return json({ error: 'Missing badge information' }, { status: 400 });
  }
  if (!data.submitterEmail) {
    return json({ error: 'Missing submitter email' }, { status: 400 });
  }

  if (!RESEND_API_KEY || !NOMINATION_TO_EMAIL) {
    return json({ error: 'Email service not configured on server' }, { status: 500 });
  }

  // Build a simple HTML summary
  const rows = [
    ['Badge', `${data.badgeName} (#${data.badgeId})`],
    ['Type', data.badgeType || ''],
    ['Nominee Team', data.nomineeTeam || ''],
    ['Nominee Manager', data.nomineeManager || ''],
    ['Nominee Player', data.nomineePlayer || ''],
    ['Season', data.season || ''],
    ['Week', data.week || ''],
    ['Points', data.points || ''],
    ['Evidence', data.evidenceUrl || ''],
    ['Notes', (data.notes || '').replace(/</g, '&lt;')],
    ['Submitted By', `${data.submitterName || ''} <${data.submitterEmail}>`],
    ['IP', getClientAddress()],
    ['User Agent', data.userAgent || ''],
    ['Timestamp', data.timestamp || new Date().toISOString()]
  ];

  const table = rows.map(([k, v]) => `
    <tr>
      <td style="padding:6px 10px;border:1px solid #ddd;background:#f7f7f7;"><strong>${k}</strong></td>
      <td style="padding:6px 10px;border:1px solid #ddd;">${v || ''}</td>
    </tr>`).join('');

  const html = `
    <div>
      <h2>New Badge Nomination</h2>
      <table style="border-collapse:collapse;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;">${table}</table>
    </div>`;

  // Send via Resend
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: NOMINATION_FROM_EMAIL || 'Badges Bot <no-reply@yourdomain.com>',
      to: [NOMINATION_TO_EMAIL],
      reply_to: data.submitterEmail,
      subject: `Badge Nomination: ${data.badgeName} (#${data.badgeId})`,
      html
    })
  });

  if (!resp.ok) {
    const text = await resp.text();
    return json({ error: 'Email send failed', detail: text }, { status: 502 });
  }

  return json({ ok: true });
};
