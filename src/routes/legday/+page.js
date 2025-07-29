import { getParlay } from '$lib/getParlay';

// Google Apps Script endpoint for fetching parlay data
const endpoint = 'https://script.google.com/macros/s/AKfycbwlYoNVAM8u60WsP85yCb2SUb1wTBb-gltwXeyOLs5Ek5PINghBz3IDwQg4RxvnV2W9/exec';

// Define table columns for DataTable initialization
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

// SvelteKit load function to inject the parlay script and pass config to the page
export async function load() {
  const src = '/scripts/parlay.js';
  await getParlay(src);

  return {
    props: {
      src,
      endpoint,
      columns
    }
  };
}