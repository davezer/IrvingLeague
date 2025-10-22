export const prerender = false
export async function load({ fetch, url }) {
  const p = new URLSearchParams(url.searchParams);
  if (!p.get('season')) p.set('season', String(new Date().getFullYear()));
  const r = await fetch(`/api/badges-index?${p.toString()}`, { cache: 'no-store' });
  const data = r.ok ? await r.json() : null;
  return {
    sections: data?.sections ?? { personas: [], weekly: [], stains: [], luck: [], yearly: [], legacy: [] },
    byManager: data?.byManager ?? {}
  };
}
