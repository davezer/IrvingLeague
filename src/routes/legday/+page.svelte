<script>
  import { onMount } from 'svelte';

  // Local columns definition (will be overwritten by server response)
  let columns = [];
  let parlayData = [];
  let loading = true;
  let error;

  onMount(async () => {
    try {
      const res = await fetch('/api/parlay');
      if (!res.ok) {
        throw new Error(`Error fetching parlay: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      ({ parlayData, columns } = data);
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
  <p class="error">{error.message}</p>
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