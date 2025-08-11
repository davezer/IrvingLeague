export async function load({ fetch }) {
  const r = await fetch('/api/badges-index', { cache: 'no-store' });
  const data = r.ok ? await r.json() : null;

  return {
    sections: data?.sections ?? { personas: [], weekly: [], yearly: [], legacy: [] },
    byManager: data?.byManager ?? {} // <- add this
  };
}