import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

let cache = { ts: 0, data: null };
const nowSec = () => Math.floor(Date.now() / 1000);

// --- CSV utils (kept for completeness) ---
function parseCsv(csvText) {
  const rows = [];
  let row = [], cur = '', inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i], next = csvText[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cur += ch; }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ',') { row.push(cur); cur = ''; }
      else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
      else if (ch !== '\r') { cur += ch; }
    }
  }
  row.push(cur); rows.push(row);
  while (rows.length && rows[rows.length - 1].every((c) => c === '')) rows.pop();
  return rows;
}
const rowsToObjects = (rows) => {
  if (!rows.length) return [];
  const headers = rows[0].map((h) => String(h || '').trim());
  return rows.slice(1).map((r) => {
    const o = {}; headers.forEach((h, i) => (o[h] = r[i] ?? '')); return o;
  });
};

// Try to normalize unknown JSON shapes into an array of objects
function normalizeJsonPayload(j) {
  // 1) If it's already an array of objects
  if (Array.isArray(j)) return j;

  // 2) Common wrappers
  if (Array.isArray(j?.data)) return j.data;
  if (Array.isArray(j?.rows)) return j.rows;
  if (Array.isArray(j?.values)) {
    // Sheets-like values: [headers, ...rows]
    const [headers, ...rows] = j.values;
    if (Array.isArray(headers)) {
      return rows.map(r => {
        const o = {};
        headers.forEach((h, i) => (o[h] = r[i] ?? ''));
        return o;
      });
    }
  }

  // 3) If it's an object with simple key->value, return single row
  if (j && typeof j === 'object') return [j];

  // Fallback: empty
  return [];
}

export async function GET({ url, fetch }) {
  const mode = (env.GOOGLE_SHEETS_MODE || 'csv').toLowerCase(); // csv | api | json
  const ttl = Number(env.DRAFTMONEY_TTL || 300);
  const season = url.searchParams.get('season') || env.SEASON || '';

  if (cache.data && nowSec() - cache.ts < ttl) {
    return json({ season, source: mode, cached: true, count: cache.data.length, data: cache.data });
  }

  let data = [];

  if (mode === 'json') {
    const jsonUrl = env.SHEETS_JSON_URL;
    if (!jsonUrl) return json({ error: 'SHEETS_JSON_URL required for JSON mode' }, { status: 500 });

    const res = await fetch(jsonUrl, { cache: 'no-store' });
    if (!res.ok) return json({ error: `JSON source error (${res.status})` }, { status: 502 });

    const payload = await res.json();
    data = normalizeJsonPayload(payload);

  } else if (mode === 'csv') {
    const csvUrl = env.SHEETS_CSV_URL;
    if (!csvUrl) return json({ error: 'SHEETS_CSV_URL required for CSV mode' }, { status: 500 });

    const res = await fetch(csvUrl, { cache: 'no-store' });
    if (!res.ok) return json({ error: `CSV fetch error (${res.status})` }, { status: 502 });

    const text = await res.text();
    data = rowsToObjects(parseCsv(text));

  } else if (mode === 'api') {
    const apiKey = env.SHEETS_API_KEY;
    const sheetId = env.SHEETS_SHEET_ID;
    const range = env.SHEETS_RANGE || 'DraftMoney!A:D';
    if (!apiKey || !sheetId) {
      return json({ error: 'SHEETS_API_KEY and SHEETS_SHEET_ID required for API mode' }, { status: 500 });
    }
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) return json({ error: `Sheets API error (${res.status})` }, { status: 502 });

    const j = await res.json();
    const values = Array.isArray(j.values) ? j.values : [];
    if (values.length) {
      const [headers, ...rows] = values;
      data = rows.map((r) => {
        const o = {}; headers.forEach((h, i) => (o[h] = r[i] ?? '')); return o;
      });
    }
  } else {
    return json({ error: `Unknown GOOGLE_SHEETS_MODE: ${mode}` }, { status: 400 });
  }

  cache = { ts: nowSec(), data };
  return json({ season, source: mode, cached: false, count: data.length, data });
}
