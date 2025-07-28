<script>
  import { onMount }   from 'svelte';
  import { getParlay } from '$lib/utils/helper.js';

  export let data;                  // from +page.js
  const { ajaxUrl, columns } = data;

  onMount(async () => {
    try {
      // 1) load jQuery
      await getParlay('https://code.jquery.com/jquery-3.7.1.js');
      // 2) load DataTables core (note 1.x, not 2.x)
      await getParlay('https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js');
      // 3) (optional) load Moment if you need it
      await getParlay('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.2/moment.min.js');

      // initialize
      window.$('#parlayStats').DataTable({
        ajax: {
          url:     ajaxUrl,
          dataSrc: 'data'
        },
        columns
      });
    } catch (err) {
      console.error('Script load or DataTable init failed:', err);
    }
  });
</script>

<style>
      .main {
        position: relative;
        z-index: 1;
    }
    .display {
        display: table;
        text-align: center;
        line-height: 1.1em;
        font-size: 1.4em;
        margin: 6px auto 10px;
        cursor: pointer;
    }
    h4 {
        text-align: center;
        font-size: 1.8em;
        margin: 10px;
        font-style: italic;
    }
</style>

<div class="main">
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
                <th>Group Parlay Win</th>
                <th>Bet Category 1</th>
                <th>Bet Category 2</th>
            </tr>
        </thead>
    </table>
</div>



