<script>
  import { onMount } from 'svelte';
  import { getParlay } from '$lib/utils/helper';
  export let data;

  const { endpoint, columns } = data;
  let parlayData = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      // Attempt a standard CORS fetch
      const res = await fetch(endpoint, { mode: 'cors' });
      if (!res.ok) throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error('Parlay data is not an array');
      parlayData = json;
    } catch (fetchError) {
      console.warn('Standard fetch failed, JSONP fallback', fetchError);
      // JSONP fallback
      const callbackName = `cb${Date.now()}`;
      window[callbackName] = (data) => {
        parlayData = data;
        delete window[callbackName];
      };
      const script = document.createElement('script');
      script.src = `${endpoint}?callback=${callbackName}`;
      script.onerror = (e) => {
        console.error('JSONP request failed', e);
        error = new Error('JSONP request failed');
        delete window[callbackName];
      };
      document.body.appendChild(script);
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