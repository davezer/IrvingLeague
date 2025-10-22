export const prerender = false; // DO NOT bake this page
export const ssr = true;        // allow server rendering
export const csr = true;        // allow client hydration/fetch


export async function load({ fetch, url }) {
  const season = url.searchParams.get('season') ?? '2025';
  const res = await fetch(`/api/badges-index?season=${season}`, { cache: 'no-store' });
  if (!res.ok) return { items: [] };
  const data = await res.json();
  return { items: data?.data ?? [] };
}
