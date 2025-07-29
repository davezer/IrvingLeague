<script>
  import { onMount } from 'svelte';
  import { getParlay } from '$lib/utils/helperFunctions/getParlay.js';

  // Props from +page.js
  export let src;
  export let columns;

  let parlayData = [];
  let error = null;
  let loading = true;

  onMount(async () => {
    try {
      // Load the external script on the client
      await getParlay(src);

      // Assume the script exposes a global fetchParlayData()
      const data = typeof window.fetchParlayData === 'function'
        ? window.fetchParlayData()
        : null;

      if (!Array.isArray(data)) {
        throw new Error('fetchParlayData() did not return an array');
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