<script>
  import { onMount } from 'svelte';
  import { loadScript } from '$lib/utils/loadScript.js';

  // `data` comes from your +page.js load()
  export let data;
  const { parlayData, columns } = data;

  onMount(async () => {
    try {
      // 1) Load jQuery
      await loadScript('https://code.jquery.com/jquery-3.7.1.min.js');
      // 2) Load DataTables core
      await loadScript('https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js');

      // 3) Initialize your table with the pre‑fetched data
      window.$('#parlayStats').DataTable({
        data:    parlayData,
        columns
      });
    } catch (err) {
      console.error('Failed to load scripts or init DataTable:', err);
    }
  });
</script>

<svelte:head>
  <!-- DataTables core CSS -->
  <link
    rel="stylesheet"
    href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css"
  />
</svelte:head>


<style>
  .main {
    position: relative;
    z-index: 1;
    padding: 1rem;
  }
  .banner h4 {
    text-align: center;
    font-size: 1.8em;
    margin-bottom: 0.5em;
    font-style: italic;
  }
  /* adjust as needed */
  .display {
    width: 100%;
    margin: 0 auto;
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
    <!-- DataTables will inject <tbody> for you -->
  </table>
</div>

