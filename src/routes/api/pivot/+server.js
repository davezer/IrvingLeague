import { json } from '@sveltejs/kit';

// 🔥 this must point at your Apps Script URL that serves the PIVOT table,
//    _not_ the detail sheet!
const UPSTREAM_URL =
  'https://script.google.com/macros/s/AKfycby5H8hQmlCoiDl6WOdoEcTxEddym__VtMFuqzotiewfNX0uGv2dEfErERAwp5KPShXO/exec?type=pivot';

export async function GET({ fetch }) {
  // cache‐bust so we always get fresh pivot
  const res = await fetch(`${UPSTREAM_URL}&cacheBust=${Date.now()}`);
  if (!res.ok) {
    return json(
      { error: `Upstream error ${res.status}: ${res.statusText}` },
      { status: 502 }
    );
  }
  // your Apps Script pivot endpoint _must_ return an array of objects
  const pivot = await res.json();
  return json(pivot);
}
