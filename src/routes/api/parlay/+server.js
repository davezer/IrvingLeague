// // src/routes/api/parlay/+server.js
// import { json } from '@sveltejs/kit';

// const SHEET_URL =
//   'https://script.google.com/macros/s/AKfycbwAUbUvK1mGlpVguRzgi-fQOgr0hWiAKiYwojPnInBf_mmXNVFFMVy3ze-ZnqfFImb3/exec';

// export async function GET({ fetch }) {
//   // Append cache‐buster so you always get the freshest
//   const upstream = `${SHEET_URL}&cacheBust=${Date.now()}`;

//   const res = await fetch(upstream);
//   if (!res.ok) {
//     return json(
//       { error: `Upstream error: ${res.status}` },
//       { status: 502 }
//     );
    
//   }

//   const payload = await res.json();
//   return json(payload);
// }

// src/routes/api/parlay/+server.js
import { json } from '@sveltejs/kit';

const APPS_URL = 'https://script.google.com/macros/s/AKfycbwER8arauwMUsm1bOtb9dbZV78ijMnysrD-GC66H58AtCOtANvcrxszm2TmSVCD1Rj5/exec';

export async function GET() {
  const res = await fetch(APPS_URL, { cache: 'no-store', redirect: 'follow' });
  const ct = res.headers.get('content-type') || '';

  // Read as text first so we can inspect when it's not JSON
  const bodyText = await res.text();

  if (!res.ok) {
    return json({ error: `Upstream ${res.status}`, preview: bodyText.slice(0, 200) }, { status: 502 });
  }
  if (!ct.includes('application/json')) {
    // Likely HTML (login or error page)
    return json({
      error: 'Upstream returned non-JSON',
      contentType: ct,
      preview: bodyText.slice(0, 200)
    }, { status: 502 });
  }

  // If it's JSON, parse it now
  let data;
  try {
    data = JSON.parse(bodyText);
  } catch (e) {
    return json({
      error: 'Failed to parse upstream JSON',
      message: e.message,
      preview: bodyText.slice(0, 200)
    }, { status: 502 });
  }

  return json(data);
}
