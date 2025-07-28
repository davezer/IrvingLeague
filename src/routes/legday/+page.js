// src/routes/legday/+page.js
import { error } from '@sveltejs/kit';

export async function load({ fetch }) {
  const endpoint =
    'https://script.google.com/macros/s/AKfycbwlYoNVAM8u60WsP85yCb2SUb1wTBb-gltwXeyOLs5Ek5PINghBz3IDwQg4RxvnV2W9/exec';

  // 1) Server‑side fetch
  const res = await fetch(endpoint, { cache: 'no-store' });
  if (res.status === 401) {
    throw error(401, 'Unauthorized: please re‑deploy your Apps Script as public.');
  }
  if (!res.ok) {
    throw error(res.status, `Error fetching parlay data: ${res.statusText}`);
  }

  // 2) Parse JSON
  const json = await res.json();
  const parlayData = Array.isArray(json.data) ? json.data : [];

  // 3) Define your columns
  const columns = [
    { data: 'GM Name' },
    { data: 'GM Team' },
    { data: 'Date' },
    { data: 'Week' },
    { data: 'Group Parlay Bet' },
    { data: 'Odds' },
    { data: 'Group Parlay Win' },
    { data: 'Bet Category 1' },
    { data: 'Bet Category 2' }
  ];

  // 4) Return into +page.svelte
  return {
    parlayData,
    columns
  };
}