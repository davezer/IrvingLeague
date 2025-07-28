
export async function load({ fetch }) {
  const endpoint = 'https://script.google.com/macros/s/AKfycbwlYoNVAM8u60WsP85yCb2SUb1wTBb-gltwXeyOLs5Ek5PINghBz3IDwQg4RxvnV2W9/exec';

  // 1) Fetch the JSON from your Apps Script
  const res = await fetch(endpoint, { cache: 'no-cache' });
  if (!res.ok) {
    console.error('Failed to fetch parlay data', res.status, res.statusText);
    return { parlayData: [], columns: [] };
  }
  const json    = await res.json();
  const parlayData = Array.isArray(json.data) ? json.data : [];

  // 2) Define your DataTable columns here, too
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

  // 3) Returned values become `data` in +page.svelte
  return {
    parlayData,
    columns
  };
}
