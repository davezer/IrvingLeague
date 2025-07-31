import { json, error } from '@sveltejs/kit';
import { PUBLIC_PIVOT_WEBAPP_URL } from '$env/static/public';

export async function GET({ fetch }) {
  if (!PUBLIC_PIVOT_WEBAPP_URL) {
    throw error(500, 'Missing PUBLIC_PIVOT_WEBAPP_URL');
  }
  const res = await fetch(PUBLIC_PIVOT_WEBAPP_URL);
  if (!res.ok) {
    throw error(res.status, `Pivot fetch failed: ${res.statusText}`);
  }
  const data = await res.json();
  return json(data);
}
