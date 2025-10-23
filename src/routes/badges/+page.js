export const prerender = false;
export const ssr = true;

export async function load({ fetch, url }) {
  const season = url.searchParams.get('season') ?? '2025';
  const r = await fetch(`/api/badges-index?season=${season}`, { cache: 'no-store' });
  const j = await r.json();
  return {
    sections: j?.sections ?? { personas: [], weekly: [], stains: [], yearly: [], legacy: [], luck: [] },
    byManager: j?.byManager ?? {},
    meta: { season, status: r.status }
  };
}