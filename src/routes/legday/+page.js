import { json, error } from '@sveltejs/kit';

// Google Apps Script endpoint
const endpoint =
  'https://script.google.com/macros/s/AKfycbwlYoNVAM8u60WsP85yCb2SUb1wTBb-gltwXeyOLs5Ek5PINghBz3IDwQg4RxvnV2W9/exec';

// Define table columns for rendering
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

export async function GET() {
  // Fetch the parlay JSON
  const res = await fetch(endpoint);
  if (!res.ok) {
    throw error(res.status, `Failed to fetch parlay data: ${res.statusText}`);
  }

  const parlayData = await res.json();
  if (!Array.isArray(parlayData)) {
    throw error(502, 'Invalid parlay data format');
  }

  // Return JSON
  return json({ parlayData, columns });
}