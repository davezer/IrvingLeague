// src/routes/api/pivot/+server.js
import { json, error } from '@sveltejs/kit';

// PUBLIC_ vars
import { PUBLIC_PIVOT_WEBAPP_URL } from '$env/static/public';

// VITE_ vars (or any other VITE_* you’ve defined)
const VITE_PIVOT_WEBAPP_URL = import.meta.env.VITE_PIVOT_WEBAPP_URL;

export async function GET({ fetch }) {
  if (!PUBLIC_PIVOT_WEBAPP_URL || !VITE_PIVOT_WEBAPP_URL) {
    console.error('Missing env vars:', {
      PUBLIC_PIVOT_WEBAPP_URL,
      VITE_PIVOT_WEBAPP_URL
    });
    throw error(500, 'Server misconfiguration');
  }

  // now you can use both:
  console.error('Using webapp URL:', PUBLIC_PIVOT_WEBAPP_URL);
  console.error('Using VITE secret:', VITE_PIVOT_WEBAPP_URL);

  // … rest of your fetch logic …
  const res = await fetch(PUBLIC_PIVOT_WEBAPP_URL, {
    headers: { 'x-api-key': VITE_PIVOT_WEBAPP_URL }
  });

  if (!res.ok) throw error(res.status, res.statusText);
  const data = await res.json();
  return json(data);
}
