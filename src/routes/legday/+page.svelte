<script>
  import { onMount } from 'svelte';

  // Props passed from +page.js (server)
  export let endpoint;
  export let columns;

  let error;
  let parlayData = [];
  let loading = true;

  onMount(async () => {
    try {
      // Attempt a CORS-enabled fetch
      const response = await fetch(endpoint, { mode: 'cors' });
      if (!response.ok) {
        // Try to extract server message for debugging
        const bodyText = await response.text().catch(() => '');
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText || ''}${bodyText ? ' - ' + bodyText : ''}`);
      }
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid parlay data format');
      }

      parlayData = data;
    } catch (e) {
      console.error('Fetch error details:', e);
      error = e;
      // Suggest enabling CORS on the Apps Script if status is 0 or 4xx/5xx
      if (e instanceof Error && e.message.includes('0 ')) {
        console.warn('If using Apps Script, ensure you have set Access-Control-Allow-Origin header to "*" in doGet.');
      }
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
    <p>Check console for full details and CORS settings on your Apps Script.</p>
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