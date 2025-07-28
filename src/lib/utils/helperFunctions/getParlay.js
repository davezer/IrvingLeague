  import { onMount } from 'svelte';
  import { getParlay } from '$lib/utils/helperFunctions/getParlay.js';

  onMount(async () => {
    try {
      await getParlay('https://code.jquery.com/jquery-3.7.1.js');
      await getParlay('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.2/moment.min.js');
      await getParlay('https://cdn.datatables.net/2.3.2/js/dataTables.js');

      // now DataTables is ready
      window.$('#parlayStats').DataTable({
        ajax: 'https://script.google.com/macros/s/…/exec',
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
      });
    } catch (e) {
      console.error('Script load failed:', e);
    }
  });