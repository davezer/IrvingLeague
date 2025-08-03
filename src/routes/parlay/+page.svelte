<script>
  import { onMount } from 'svelte';
  export let data;

  const { endpoint, columns, parlayPivot } = data;
  let parlayData = [];
  let loading = true;
  let error = null;

  // --- Small table sorting state ---
  let smallSortCol = null;
  let smallSortDir = 'asc';

  // compute small table data
  $: smallSortedData = smallSortCol
    ? [...parlayPivot].sort((a, b) => {
        const aVal = a[smallSortCol] ?? '';
        const bVal = b[smallSortCol] ?? '';
        if (aVal < bVal) return smallSortDir === 'asc' ? -1 : 1;
        if (aVal > bVal) return smallSortDir === 'asc' ? 1 : -1;
        return 0;
      })
    : parlayPivot;

  function toggleSmallSort(col) {
    if (smallSortCol === col) {
      smallSortDir = smallSortDir === 'asc' ? 'desc' : 'asc';
    } else {
      smallSortCol = col;
      smallSortDir = 'asc';
    }
  }

  // --- Bottom table logic left unchanged ---
  const perPageOptions = [20, 30, 40, 50, 100];
  let perPage = 20;
  let sortCol = null;
  let sortDir = 'asc';
  let searchTerm = '';
  let filteredData, sortedData, visibleData;

  function toggleSort(col) {
    if (sortCol === col) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortCol = col;
      sortDir = 'asc';
    }
  }

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

  $: filteredData = parlayData.filter(row => {
    const tokens = searchTerm
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(t => t);
    if (tokens.length === 0) return true;
    return tokens.every(token =>
      columns.some(col => {
        const cell = row[col.data];
        return cell != null && String(cell).toLowerCase().includes(token);
      })
    );
  });

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
</script>

<style>
  /* === Small Table === */
  :global(.small-table-container) {
    max-width: 300px;
    margin: 2rem auto;
    padding: 1rem;
    background: #000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    overflow-x: auto;
    color: #fff;
  }
  :global(.small-table) {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    background: #000;
    color: #fff;
  }
  :global(.small-table th),
  :global(.small-table td) {
    padding: 0.5rem;
    border-bottom: 1px solid #333;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  :global(.small-table th.sorted-asc::after) {
    content: ' ▲';
  }
  :global(.small-table th.sorted-desc::after) {
    content: ' ▼';
  }
  :global(.small-table th) {
    background: #222;
    user-select: none;
  }

  /* === Bottom Table & Controls (unchanged) === */
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

<!-- Top small table with sorting -->
{#if parlayPivot && parlayPivot.length}
  <div class="small-table-container">
    <table class="small-table">
      <thead>
        <tr>
          {#each Object.keys(parlayPivot[0]) as header}
            <th
              class:sorted-asc={smallSortCol === header && smallSortDir === 'asc'}
              class:sorted-desc={smallSortCol === header && smallSortDir === 'desc'}
              on:click={() => toggleSmallSort(header)}
            >
              {header}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each smallSortedData as row}
          <tr>
            {#each Object.values(row) as cell}
              <td>{cell}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:else}
  <p>No parlay pivot data found.</p>
{/if}

<!-- Bottom interactive table unchanged -->
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
