export function load() {
  const src = 'https://script.google.com/macros/s/AKfycbwlYoNVAM8u60WsP85yCb2SUb1wTBb-gltwXeyOLs5Ek5PINghBz3IDwQg4RxvnV2W9/exec';  // your external parlay script
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