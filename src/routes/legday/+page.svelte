
<script>
  import { onMount } from 'svelte';
  import { loadScript }    from '$lib/utils/loadScript.js';  // your helper

  // `data` is whatever you returned in +page.js
  export let data;
  const { ajaxUrl, columns } = data;

  onMount(async () => {
    // load dependencies in sequence
    await loadScript('https://code.jquery.com/jquery-3.7.1.js');
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.2/moment.min.js');
    await loadScript('https://cdn.datatables.net/2.3.2/js/dataTables.js');

    // init the DataTable once everything’s ready
    window.$('#parlayStats').DataTable({
      ajax:  ajaxUrl,
      columns
    });
  });
</script>

<style>
  /* your styles here */
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
        <th>Group Parlay Win</th>
        <th>Bet Category 1</th>
        <th>Bet Category 2</th>
      </tr>
    </thead>
  </table>
</div>


