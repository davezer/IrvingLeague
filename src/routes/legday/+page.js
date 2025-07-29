export function load() {
  const scriptSrc = null; // no local wrapper script by default
  const endpoint =
    'https://script.google.com/macros/s/AKfycbwlYoNVAM8u60WsP85yCb2SUb1wTBb-gltwXeyOLs5Ek5PINghBz3IDwQg4RxvnV2W9/exec';

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

  return { scriptSrc, endpoint, columns };
}