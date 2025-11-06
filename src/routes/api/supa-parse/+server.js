// src/routes/api/supa-parse/+server.js
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

function decodePart(p) {
  try {
    // support base64url
    const s = p.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4 ? '='.repeat(4 - (s.length % 4)) : '';
    return JSON.parse(Buffer.from(s + pad, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

export async function GET() {
  const key = env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!key) return json({ ok:false, why:'no key found' }, { status:500 });
  const parts = key.split('.');
  if (parts.length < 2) return json({ ok:false, why:'malformed key' }, { status:500 });

  const header = decodePart(parts[0]);
  const payload = decodePart(parts[1]);

  // redact sensitive fields but keep what we need to confirm
  return json({
    ok: true,
    header: { alg: header?.alg, kid: header?.kid ?? null },
    payload: {
      aud: payload?.aud ?? null,
      role: payload?.role ?? null,            // should be "service_role"
      iss: payload?.iss ?? null,              // should include your project ref domain
      sub: payload?.sub ? payload.sub.slice(0,8) + '…' : null,
      project_ref_in_iss: payload?.iss?.match?.(/^https:\/\/([^.]+)\.supabase\.(?:co|in)\/auth\/v1$/)?.[1] ?? null
    }
  }, { headers: { 'cache-control': 'no-store' } });
}
