export function load() {
  const endpoint =
    'https://script.google.com/macros/s/AKfycbzYILyDhrFQpfaQx3crpwZ99tPx93aBMFqhxHZX-bCu4C7s4vf3ogUplN1lLHx_Iu8Q/exec';

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

  return { endpoint, columns };
}