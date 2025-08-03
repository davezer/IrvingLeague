// src/routes/api/pivot/+server.js
import { json, error } from '@sveltejs/kit';
import { PUBLIC_PIVOT_WEBAPP_URL } from '$env/static/public';

export async function GET({ fetch }) {
  // 1) Log the URL so you can see exactly what you're calling
  console.error('[api/pivot] Using URL →', PUBLIC_PIVOT_WEBAPP_URL);

  if (!PUBLIC_PIVOT_WEBAPP_URL) {
    console.error('[api/pivot] Missing PUBLIC_PIVOT_WEBAPP_URL');
    throw error(500, 'Server misconfiguration: missing Sheets URL');
  }

  // 2) Use the injected fetch
  const res = await fetch(PUBLIC_PIVOT_WEBAPP_URL);
  const text = await res.text();

  console.error(
    '[api/pivot] Sheets raw response (first 300 chars):',
    text.slice(0, 300)
  );

  if (!res.ok) {
    throw error(res.status, `Sheets fetch failed: ${res.statusText}`);
  }

  let payload;
  try {
    payload = JSON.parse(text);
  } catch (err) {
    console.error('[api/pivot] JSON parse error:', err);
    throw error(500, 'Invalid JSON from Sheets WebApp');
  }

  if (payload && typeof payload === 'object' && 'error' in payload) {
    console.error('[api/pivot] Sheets WebApp reported error:', payload.error);
    throw error(500, `Sheets WebApp error: ${payload.error}`);
  }

  if (!Array.isArray(payload)) {
    console.error('[api/pivot] Unexpected payload shape:', payload);
    throw error(500, 'Unexpected response format from Sheets WebApp');
  }

  return json(payload);
}
