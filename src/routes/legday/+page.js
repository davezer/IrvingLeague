import { getParlay } from '$lib/utils/helperFunctions/getParlay.js';

// External script URL that defines a global fetchParlayData()
const src = '/scripts/parlay.js';

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

export function load() {
  // Pass script URL and table config to the page
  return {
    props: {
      src,
      columns
    }
  };
}