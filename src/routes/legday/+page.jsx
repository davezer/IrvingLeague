export function load() {
  return {
    // you could also move these into a separate config file
    ajaxUrl: 'https://script.google.com/macros/s/AKfycby5KreWSmrrF-c9py6W7d5wLNrkvRceOEN7-b2udD4afUJ622vVs55vef-FgshR4CO2/exec',
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