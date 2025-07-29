<script>
  import { onMount } from 'svelte';
  import { getParlay } from '$lib/utils/helper';

  const { endpoint, columns } = data;
  let parlayData = [];
  let loading = true;
  let error = null;

  // Pagination & Sorting state
  const perPageOptions = [5, 10, 15];
  let perPage = 10;
  let sortCol = null;
  let sortDir = 'asc';

  onMount(async () => {
    try {
      const res = await fetch(endpoint, { mode: 'cors' });
      if (!res.ok) throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error('Parlay data is not an array');
      parlayData = json;
    } catch (fetchError) {
      console.warn('Standard fetch failed, JSONP fallback', fetchError);
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

  // Derived sorted and paginated data
  $: sortedData = sortCol
    ? [...parlayData].sort((a, b) => {
        const aVal = a[sortCol] ?? '';
        const bVal = b[sortCol] ?? '';
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      })
    : parlayData;

  $: visibleData = sortedData.slice(0, perPage);

  function toggleSort(col) {
    if (sortCol === col) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortCol = col;
      sortDir = 'asc';
    }
  }
</script>

<style>
  .table-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
    text-align: left;
  }
  th {
    cursor: pointer;
    user-select: none;
  }
  th.sorted-asc::after {
    content: ' ▲';
  }
  th.sorted-desc::after {
    content: ' ▼';
  }
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  select {
    padding: 0.25rem;
    border-radius: 4px;
  }
</style>

{#if loading}
  <p>Loading parlay data...</p>
{:else if error}
  <p class="error">Error loading parlay: {error.message}</p>
{:else}
  <div class="table-container">
    <div class="controls">
      <label>
        Show
        <select bind:value={perPage}>
          {#each perPageOptions as opt}
            <option value={opt}>{opt}</option>
          {/each}
        </select>
        entries
      </label>
      <div>Showing {visibleData.length} of {parlayData.length} entries</div>
    </div>

    <table>
      <thead>
        <tr>
          {#each columns as col}
            <th
              class:sorted-asc={sortCol === col.data && sortDir === 'asc'}
              class:sorted-desc={sortCol === col.data && sortDir === 'desc'}
              on:click={() => toggleSort(col.data)}
            >
              {col.data}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each visibleData as row}
          <tr>
            {#each columns as col}
              <td>{row[col.data]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}