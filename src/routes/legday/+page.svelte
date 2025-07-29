<script>
  import { onMount } from 'svelte';
  import { getParlay } from '$lib/utils/helper';  
  export let data;

  const { scriptSrc, endpoint, columns } = data;
  let parlayData = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      if (scriptSrc) {
        // Load any local wrapper script if provided
        await getParlay(scriptSrc);
      }

      // Fetch JSON directly
      const res = await fetch(endpoint, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
      }
      const json = await res.json();
      if (!Array.isArray(json)) {
        throw new Error('Invalid parlay data format');
      }
      parlayData = json;
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
  <table style="width:100%; border-collapse: collapse;">
    <thead>
      <tr>
        {#each columns as col}
          <th style="padding:8px; border-bottom:2px solid #ddd; text-align:left;">
            {col.data}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each parlayData as row}
        <tr>
          {#each columns as col}
            <td style="padding:8px; border-bottom:1px solid #eee;">
              {row[col.data]}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{/if}