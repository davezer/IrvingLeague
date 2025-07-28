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

  <style>
    .pageBody {
        position: relative;
        z-index: 1;
    }

    :global(.list) {
        width: 90%;
        max-width: 800px;
        border: 1px solid
        var(--mdc-theme-text-hint-on-background, var(--d7d7d7));
        margin: 15px auto;
        padding: 0 !important;
        box-shadow: 0px 3px 3px -2px var(--boxShadowOne), 0px 3px 4px 0px var(--boxShadowTwo), 0px 1px 8px 0px var(--boxShadowThree);
    }
    
</style>

<div class="pageBody">
    <div class="banner">
        <h4>Leg Day Parlay</h4>
    </div>
    <table id="parlayStats" class="display">
        <thead>
            <tr>
                <th>GM Name</th>
                <th>GM Team</th>
                <th>Date</th>
                <th>Week</th>
                <th>Group Parlay Bet</th>
                <th>Odds</th>
                <th>Group Parlay Result</th>
                <th>Bet Category 1</th>
                <th>Bet Category 2</th>
            </tr>
        </thead>
    </table>
</div>