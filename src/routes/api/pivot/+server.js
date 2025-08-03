import { json, error } from '@sveltejs/kit';

// read directly from Vite’s import.meta.env
const PIVOT_WEBAPP_URL = import.meta.env.VITE_PIVOT_WEBAPP_URL;

export async function GET({ fetch }) {
  if (!PIVOT_WEBAPP_URL) {
    console.error('[api/pivot] missing VITE_PIVOT_WEBAPP_URL');
    throw error(500, 'Server misconfiguration');
  }

  const res = await fetch(PIVOT_WEBAPP_URL);
  if (!res.ok) throw error(res.status, res.statusText);
  const data = await res.json();
  return json(data);
}