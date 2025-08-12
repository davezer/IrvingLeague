import { json } from '@sveltejs/kit';

// You can move this into $env/static/private if you prefer.
const UPSTREAM_URL =
  'https://script.google.com/macros/s/AKfycby5H8hQmlCoiDl6WOdoEcTxEddym__VtMFuqzotiewfNX0uGv2dEfErERAwp5KPShXO/exec?type=pivot';

// In-memory cache (per server instance)
const TTL_MS = 5 * 60 * 1000; // 5 minutes
let cache = { ts: 0, data: null, etag: '' };

function etagOf(obj) {
  const s = JSON.stringify(obj);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return `"p${h.toString(16)}"`;
}

function pickOne(pivot, id) {
  if (!id) return null;
  const key = String(id);
  // adjust these field names to whatever your pivot returns
  return (
    pivot.find(
      (r) =>
        String(r.managerID ?? r.managerId ?? r.id ?? '').trim() === key ||
        String(r.teamId ?? '').trim() === key
    ) || null
  );
}

export async function GET({ url, request, setHeaders, fetch }) {
  const manager = url.searchParams.get('manager')?.trim() || null;
  const now = Date.now();

  // Serve from memory if fresh
  if (cache.data && now - cache.ts < TTL_MS) {
    const inm = request.headers.get('if-none-match');
    setHeaders({
      // Let the browser & Vercel cache, but require revalidation
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
      ETag: cache.etag
    });

    if (inm && inm === cache.etag) {
      // Client already has this version
      return new Response(null, { status: 304 });
    }

    // Optionally slice to a single manager to send less over the wire
    if (manager) {
      const item = pickOne(cache.data, manager);
      return json(item ?? {}, { status: item ? 200 : 404 });
    }
    return json(cache.data);
  }

  // Refresh from upstream
  try {
    // No cache-bust! We manage caching here.
    const res = await fetch(UPSTREAM_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const pivot = await res.json(); // should be an array of objects
    cache = { ts: now, data: pivot, etag: etagOf(pivot) };

    setHeaders({
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
      ETag: cache.etag
    });

    if (manager) {
      const item = pickOne(pivot, manager);
      return json(item ?? {}, { status: item ? 200 : 404 });
    }
    return json(pivot);
  } catch (err) {
    // If upstream fails but we have old data, serve it as stale
    if (cache.data) {
      setHeaders({
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
        ETag: cache.etag,
        Warning: '110 - "Response is Stale"'
      });
      if (manager) {
        const item = pickOne(cache.data, manager);
        return json(item ?? {}, { status: item ? 200 : 404 });
      }
      return json(cache.data);
    }
    return json({ error: 'Upstream error', detail: String(err) }, { status: 502 });
  }
}
