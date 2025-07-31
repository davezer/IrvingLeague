export async function GET({ fetch }) {
  const GOOGLE_WEBAPP_URL = import.meta.env.VITE_PIVOT_WEBAPP_URL;
  if (!GOOGLE_WEBAPP_URL) {
    return new Response('Missing VITE_PIVOT_WEBAPP_URL env var', { status: 500 });
  }

  const res = await fetch(GOOGLE_WEBAPP_URL);
  if (!res.ok) {
    return new Response('Pivot fetch failed: ' + res.statusText, { status: res.status });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}