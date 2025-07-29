export function load() {
  const src = '/scripts/parlay.js';  // your external parlay script
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

  // Return values are exposed via `data` in the page
  return { src, columns };
}