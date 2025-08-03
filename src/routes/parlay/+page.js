import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
  // 1️⃣ Static config you need in the page
  const endpoint =
    'https://script.google.com/macros/s/AKfycbxAztc1rJmEyBdN_bYknMALIE2wZEgxEQt8rroYLOrh6UgPYBtUB-GY5Bcbpy--r9fa/exec';

  const columns = [
    { data: 'GM Team' },
    { data: 'Date' },
    { data: 'Group Parlay Bet' },
    { data: 'Group Parlay Result' },
    { data: 'Bet Category 1' },
  ];

  // 2️⃣ Fetch the pivot data from your internal API
  const res = await fetch('/api/parlayPivot');
  if (!res.ok) {
    throw error(res.status, `Failed to load parlay pivot: ${res.statusText}`);
  }
  const parlayPivot = await res.json();

  // 3️⃣ Return everything in one object
  return { endpoint, columns, parlayPivot };
}