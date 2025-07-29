<script>
  export let src;
  export let endpoint;
  export let columns;
  import { onMount } from 'svelte';
  import { getParlay } from '$lib/getParlay';
  import jQuery from 'jquery';
  import 'datatables.net';

  let error;

  onMount(async () => {
    try {
      // Ensure the external script is loaded
      await getParlay(src);

      // Optionally fetch data directly from the endpoint
      const response = await fetch(endpoint);
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid parlay data format');
      }

      // Initialize DataTable with the fetched data and defined columns
      jQuery('#parlay-table').DataTable({
        data,
        columns
      });
    } catch (e) {
      console.error(e);
      error = e;
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

{#if error}
  <p class="error">Error loading parlay: {error.message}</p>
{:else}
  <table id="parlay-table" class="display" style="width:100%">
    <thead>
      <tr>
        {#each columns as col}
          <th>{col.data}</th>
        {/each}
      </tr>
    </thead>
    <tbody></tbody>
  </table>
{/if}
