// SSR/server-only helper: fetch JSON safely with good diagnostics.
export async function fetchJSON(url, init = {}) {
  const res = await fetch(url, init);
  const contentType = res.headers.get('content-type') || '';

  // Always read as text first so we can log/show good errors
  const raw = await res.text();

  if (!res.ok) {
    // Many APIs return HTML error pages — include a snippet for debugging
    const snippet = raw.slice(0, 800);
    throw new Error(`Upstream ${res.status} ${res.statusText} from ${url}\n${snippet}`);
  }

  // If it says JSON, try to parse; otherwise try to parse anyway (some APIs forget headers)
  try {
    return JSON.parse(raw);
  } catch (e) {
    const head = raw.slice(0, 800);
    // Common causes: HTML page, trailing commas, or NDJSON.
    // If it looks like NDJSON, parse per-line:
    if (head.includes('\n') && head.trim().startsWith('{') && head.trim().endsWith('}')) {
      try {
        const lines = raw.split('\n').filter(Boolean);
        return lines.map((ln) => JSON.parse(ln));
      } catch {
        // fall through to detailed error
      }
    }
    throw new Error(`Invalid JSON from ${url}.\nFirst 800 chars:\n${head}`);
  }
}
