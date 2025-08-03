import { json, error } from '@sveltejs/kit';

// VITE_ vars are available on import.meta.env
const PARLAY_PIVOT_WEBAPP_URL = import.meta.env.VITE_PARLAY_PIVOT_WEBAPP_URL;

export async function GET({ fetch }) {
  if (!PARLAY_PIVOT_WEBAPP_URL) {
    console.error('[api/parlayPivot] Missing VITE_PARLAY_PIVOT_WEBAPP_URL');
    throw error(500, 'Server misconfiguration');
  }

  // Use the injected fetch
  const res = await fetch(PARLAY_PIVOT_WEBAPP_URL);
  const text = await res.text();

  console.error(
    '[api/parlayPivot] Raw response (first 200 chars):',
    text.slice(0, 200)
  );

  if (!res.ok) {
    throw error(res.status, `Upstream fetch failed: ${res.statusText}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error('[api/parlayPivot] JSON parse error:', e);
    throw error(500, 'Invalid JSON from upstream');
  }

  if (data && data.error) {
    console.error('[api/parlayPivot] Upstream error payload:', data.error);
    throw error(500, `Upstream error: ${data.error}`);
  }

  if (!Array.isArray(data)) {
    console.error('[api/parlayPivot] Unexpected payload shape:', data);
    throw error(500, 'Unexpected data format');
  }

  return json(data);
}
