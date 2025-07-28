<script>
  import { onMount } from 'svelte';
    import { getParlay } from '$lib/utils/helper.js';
  export let data;
  const { parlayData, columns } = data;

  onMount(async () => {
    await getParlay('https://code.jquery.com/jquery-3.7.1.min.js');
    await getParlay('https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js');
    window.$('#parlayStats').DataTable({
      data:    parlayData,
      columns
    });
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
 
  .table-wrapper {
    max-width: 900px;
    margin: 2rem auto;
  }

</style>


<div class="table-wrapper">
  <h4 style="text-align:center; margin-bottom:1rem;">Leg Day Parlay</h4>
  <table id="parlayStats" class="display" style="width:100%;">
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
    <!-- DataTables will auto‑inject <tbody> for you -->
  </table>
</div>


