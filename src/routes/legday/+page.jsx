export function load() {
  return {
    // you could also move these into a separate config file
    ajaxUrl: 'https://script.google.com/macros/s/AKfycbwlYoNVAM8u60WsP85yCb2SUb1wTBb-gltwXeyOLs5Ek5PINghBz3IDwQg4RxvnV2W9/exec',
    columns: [
      { data: 'GM Name' },
      { data: 'GM Team' },
      { data: 'Date' },
      { data: 'Week' },
      { data: 'Group Parlay Bet' },
      { data: 'Odds' },
      { data: 'Group Parlay Win' },
      { data: 'Bet Category 1' },
      { data: 'Bet Category 2' }
    ]
  };
}