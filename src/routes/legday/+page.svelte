<script>
  import { onMount } from 'svelte';
  import { getParlay } from '$lib/utils/helper';  

  // Props passed from +page.js (server)
  export let endpoint;
  export let columns;

  let error;
  let parlayData = [];
  let loading = true;

  onMount(async () => {
    try {
      // Load external script only in browser
      const src = 'https://script.google.com/macros/s/AKfycbwlYoNVAM8u60WsP85yCb2SUb1wTBb-gltwXeyOLs5Ek5PINghBz3IDwQg4RxvnV2W9/exec';
      await getParlay(src);

      // Fetch data directly from the endpoint
      const response = await fetch(endpoint);
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid parlay data format');
      }

      parlayData = data;
    } catch (e) {
      console.error(e);
      error = e;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Loading parlay data...</p>
{:else if error}
  <p class="error">Error loading parlay: {error.message}</p>
{:else}
  <table class="parlay-table" style="width:100%; border-collapse: collapse;">
    <thead>
      <tr>
        {#each columns as col}
          <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">
            {col.data}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each parlayData as row}
        <tr>
          {#each columns as col}
            <td style="padding: 8px; border-bottom: 1px solid #eee;">
              {row[col.data]}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{/if}