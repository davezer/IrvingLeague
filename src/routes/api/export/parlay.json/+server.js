// src/routes/api/export/parlay.json/+server.js
import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

let cache = { ts: 0, data: null };
const nowSec = () => Math.floor(Date.now() / 1000);

// --- CSV utils (same as your draftmoney endpoint) ---
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
function rowsToObjects(rows) {
  if (!rows.length) return [];
  const headers = rows[0].map((h) => String(h || '').trim());
  return rows.slice(1).map((r) => {
    const o = {}; headers.forEach((h, i) => (o[h] = r[i] ?? '')); return o;
  });
}

// Try to normalize unknown JSON shapes into an array of objects
function normalizeJsonPayload(j) {
  if (Array.isArray(j)) return j;
  if (Array.isArray(j?.data)) return j.data;
  if (Array.isArray(j?.rows)) return j.rows;
  if (Array.isArray(j?.values)) {
    const [headers, ...rows] = j.values;
    if (Array.isArray(headers)) {
      return rows.map((r) => {
        const o = {};
        headers.forEach((h, i) => (o[h] = r[i] ?? ''));
        return o;
      });
    }
  }
  if (j && typeof j === 'object') return [j];
  return [];
}

// Optional filters applied to the normalized array, if those fields exist
function applyFilters(data, { season, week, user, status }) {
  let out = data || [];

  if (season) {
    const s = String(season).toLowerCase();
    out = out.filter((r) => String(r.season ?? r.Season ?? '').toLowerCase() === s);
  }
  if (week) {
    const w = String(week).toLowerCase();
    out = out.filter((r) => String(r.week ?? r.Week ?? '').toLowerCase() === w);
  }
  if (user) {
    const u = String(user).toLowerCase();
    out = out.filter((r) =>
      String(r.user ?? r.User ?? r.username ?? r.Username ?? '').toLowerCase() === u
    );
  }
  if (status) {
    const st = String(status).toLowerCase();
    out = out.filter((r) => String(r.status ?? r.Status ?? '').toLowerCase() === st);
  }

  return out;
}

export async function GET({ url, fetch }) {
  // Reuse global GOOGLE_SHEETS_MODE if no parlay-specific override
  const mode = (env.PARLAY_GOOGLE_SHEETS_MODE || env.GOOGLE_SHEETS_MODE || 'csv').toLowerCase(); // csv | api | json
  const ttl = Number(env.PARLAY_TTL || env.DRAFTMONEY_TTL || 300);

  // Query params
  const seasonQ = url.searchParams.get('season') || env.PARLAY_SEASON || env.SEASON || '';
  const weekQ   = url.searchParams.get('week')   || '';
  const userQ   = url.searchParams.get('user')   || '';
  const statusQ = url.searchParams.get('status') || '';

  // Serve cache if still fresh
  if (cache.data && nowSec() - cache.ts < ttl) {
    const filtered = applyFilters(cache.data, { season: seasonQ, week: weekQ, user: userQ, status: statusQ });
    return json({
      season: seasonQ,
      source: mode,
      cached: true,
      count: filtered.length,
      data: filtered
    });
  }

  let data = [];

  if (mode === 'json') {
    const jsonUrl = env.SHEETS_PARLAY_JSON_URL || env.PARLAY_JSON_URL;
    if (!jsonUrl) return json({ error: 'SHEETS_PARLAY_JSON_URL (or PARLAY_JSON_URL) required for JSON mode' }, { status: 500 });

    const res = await fetch(jsonUrl, { cache: 'no-store' });
    if (!res.ok) return json({ error: `JSON source error (${res.status})` }, { status: 502 });

    const payload = await res.json();
    data = normalizeJsonPayload(payload);

  } else if (mode === 'csv') {
    const csvUrl = env.SHEETS_PARLAY_CSV_URL || env.PARLAY_CSV_URL;
    if (!csvUrl) return json({ error: 'SHEETS_PARLAY_CSV_URL (or PARLAY_CSV_URL) required for CSV mode' }, { status: 500 });

    const res = await fetch(csvUrl, { cache: 'no-store' });
    if (!res.ok) return json({ error: `CSV fetch error (${res.status})` }, { status: 502 });

    const text = await res.text();
    data = rowsToObjects(parseCsv(text));

  } else if (mode === 'api') {
    const apiKey = env.SHEETS_PARLAY_API_KEY || env.SHEETS_API_KEY;
    const sheetId = env.SHEETS_PARLAY_SHEET_ID || env.SHEETS_SHEET_ID;
    const range = env.SHEETS_PARLAY_RANGE || 'Parlay!A:Z';
    if (!apiKey || !sheetId) {
      return json({ error: 'SHEETS_PARLAY_API_KEY/SHEETS_API_KEY and SHEETS_PARLAY_SHEET_ID/SHEETS_SHEET_ID required for API mode' }, { status: 500 });
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
    return json({ error: `Unknown PARLAY_GOOGLE_SHEETS_MODE/GOOGLE_SHEETS_MODE: ${mode}` }, { status: 400 });
  }

  cache = { ts: nowSec(), data };
  const filtered = applyFilters(data, { season: seasonQ, week: weekQ, user: userQ, status: statusQ });

  return json({
    season: seasonQ,
    source: mode,
    cached: false,
    count: filtered.length,
    data: filtered
  });
}
