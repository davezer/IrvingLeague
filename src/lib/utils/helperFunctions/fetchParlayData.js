export async function fetchParlayData(fetch) {
  const res = await fetch('/api/parlay');
  if (!res.ok) throw new Error(`Parlay fetch failed: ${res.status}`);
  return await res.json();
}
