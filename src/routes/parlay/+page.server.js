import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
  const res = await fetch('/api/parlay', { cache: 'no-store' });
  if (!res.ok) throw error(res.status, await res.text());
  const detailRows = await res.json();
  const columns = [
    { data: 'GM Team' },
    { data: 'Date' },
    { data: 'Group Parlay Bet' },
    { data: 'Group Parlay Result' },
    { data: 'Bet Category 1' }
  ];
  return { columns, detailRows };
}
