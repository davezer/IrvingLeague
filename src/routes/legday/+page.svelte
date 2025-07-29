<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // Access data returned by load()
  let parlayData = [];
  let error;
  let loading = true;

  // Destructure endpoint and columns from page data
  $: endpoint = $page.data.endpoint;
  $: columns = $page.data.columns;

  onMount(async () => {
    try {
      // Fetch parlay JSON directly from the Apps Script endpoint
      const response = await fetch(endpoint, { mode: 'cors' });
      if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}${body ? ' - ' + body : ''}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid parlay data format');
      }

      parlayData = data;
    } catch (e) {
      console.error('Fetch error details:', e);
      error = e;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Loading parlay data...</p>
{:else if error}
  <div class="error">
    <p>Error loading parlay:</p>
    <pre>{error.message}</pre>
    <p>Check console for details and ensure your Apps Script is deployed as a web app.</p>
  </div>
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