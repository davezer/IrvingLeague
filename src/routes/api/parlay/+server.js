// src/routes/api/parlay/+server.js
import { json } from '@sveltejs/kit';

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbxAztc1rJmEyBdN_bYknMALIE2wZEgxEQt8rroYLOrh6UgPYBtUB-GY5Bcbpy--r9fa/exec?type=data';

export async function GET({ fetch }) {
  // Append cache‐buster so you always get the freshest
  const upstream = `${SHEET_URL}&cacheBust=${Date.now()}`;

  const res = await fetch(upstream);
  if (!res.ok) {
    return json(
      { error: `Upstream error: ${res.status}` },
      { status: 502 }
    );
  }

  const payload = await res.json();
  return json(payload);
}
