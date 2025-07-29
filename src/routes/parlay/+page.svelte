<script>
  import { onMount } from 'svelte';
  export let data;

  const { endpoint, columns } = data;
  let parlayData = [];
  let loading = true;
  let error = null;

  // Pagination & Sorting state
  const perPageOptions = [5, 10, 15];
  let perPage = 10;
  let sortCol = null;
  let sortDir = 'asc';

  // Search state
  let searchTerm = '';

  onMount(async () => {
    try {
      const res = await fetch(endpoint, { mode: 'cors' });
      if (!res.ok) throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error('Parlay data is not an array');
      parlayData = json;
    } catch (e) {
      console.warn('Fetch failed, JSONP fallback', e);
      const callbackName = `cb${Date.now()}`;
      window[callbackName] = (data) => {
        parlayData = data;
        delete window[callbackName];
      };
      const script = document.createElement('script');
      script.src = `${endpoint}?callback=${callbackName}`;
      script.onerror = (err) => {
        error = new Error('JSONP request failed');
        delete window[callbackName];
      };
      document.body.appendChild(script);
    } finally {
      loading = false;
    }
  });

  // Filter by search term
  $: filteredData = parlayData.filter(row => {
    const term = searchTerm.toLowerCase();
    return columns.some(col => {
      const val = row[col.data];
      return val != null && String(val).toLowerCase().includes(term);
    });
  });

  // Sort and paginate data
  $: sortedData = sortCol
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortCol] ?? '';
        const bVal = b[sortCol] ?? '';
        if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData;

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
    max-width: 1700px;
    margin: 2rem auto;
    padding: 1rem;
    background: #000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    overflow-x: auto;
    color: #fff;
  }
  table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    background: #000;
    color: #fff;
  }
  th, td {
    padding: 0.5rem;
    border-bottom: 1px solid #333;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    color: #fff;
  }
  .controls label {
    margin: 0.5rem;
    display: flex;
    align-items: center;
  }
  .controls input {
    margin-left: 0.5rem;
    padding: 0.25rem;
    border-radius: 4px;
    border: 1px solid #555;
    background: #222;
    color: #fff;
  }
  select {
    margin-left: 0.5rem;
    padding: 0.25rem;
    border-radius: 4px;
    background: #222;
    color: #fff;
    border: 1px solid #555;
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
        Search:
        <input type="text" placeholder="Search..." bind:value={searchTerm} />
      </label>
      <label>
        Show
        <select bind:value={perPage}>
          {#each perPageOptions as opt}
            <option value={opt}>{opt}</option>
          {/each}
        </select>
        entries
      </label>
      <div>Showing {visibleData.length} of {filteredData.length} entries</div>
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