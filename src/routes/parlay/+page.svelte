<script>
  export let data;
  const { columns, detailRows } = data;

  // normalize into a real array
  $: _rows = Array.isArray(detailRows)
    ? detailRows
    : detailRows && typeof detailRows === 'object'
    ? Object.values(detailRows)
    : [];

  // table state
  let search = '';
  let perPage = 20;
  let sortCol = null;
  let sortDir = 'asc';

  // split search into tokens
  $: tokens = search
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean);

  // filter
  $: filtered = _rows.filter((row) => {
    if (tokens.length === 0) return true;
    return tokens.every((tok) =>
      Object.values(row).some((cell) =>
        String(cell).toLowerCase().includes(tok)
      )
    );
  });

  // sort
  $: sorted = sortCol
    ? [...filtered].sort((a, b) => {
        const aV = String(a[sortCol] ?? '');
        const bV = String(b[sortCol] ?? '');
        if (aV < bV) return sortDir === 'asc' ? -1 : 1;
        if (aV > bV) return sortDir === 'asc' ? 1 : -1;
        return 0;
      })
    : filtered;

  // paginate
  $: visible = perPage === 'ALL'
    ? sorted
    : sorted.slice(0, +perPage);

  function toggleSort(col) {
    if (sortCol === col) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortCol = col;
      sortDir = 'asc';
    }
  }

  console.log({ columns, detailRows });
</script>

<style>
  :global(body) {
    background: #111;
    margin: 0;
    font-family: sans-serif;
  }

  h4 {
    text-align: center;
    color: #fff;
    margin-top: 2rem;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15rem;
    margin: 1.5rem 0;
    color: #fff;
  }

  .controls input,
  .controls select {
    background: #222;
    border: 1px solid #555;
    color: #fff;
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .table-wrapper {
    max-width: 1500px;
    margin: 0 auto 3rem;
    padding: 1rem;
    background: #000;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    color: #fff;
  }

  th,
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #333;
    text-align: left;
  }

  th {
    background: #111;
    cursor: pointer;
    user-select: none;
  }

  th.sorted-asc::after {
    content: ' ▲';
  }

  th.sorted-desc::after {
    content: ' ▼';
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  /* “no results” row styling */
  .no-results {
    text-align: center;
    color: #888;
  }
</style>

<h4>Parlay Detail</h4>

<div class="controls">
  <label>
    Search:
    <input type="text" bind:value={search} placeholder="Search…" />
  </label>

  <label>
    Show
    <select bind:value={perPage}>
      {#each [10, 20, 50, 100, 'ALL'] as n}
        <option value={n}>{n}</option>
      {/each}
    </select>
    entries
  </label>

  <div>Showing {visible.length} of {filtered.length}</div>
</div>

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        {#each columns as { data }}
          <th
            class:sorted-asc={sortCol === data && sortDir === 'asc'}
            class:sorted-desc={sortCol === data && sortDir === 'desc'}
            on:click={() => toggleSort(data)}
          >
            {data}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if visible.length === 0}
        <tr>
          <td class="no-results" colspan={columns.length}>
            No rows match “{search}”
          </td>
        </tr>
      {:else}
        {#each visible as row}
          <tr>
            {#each columns as { data }}
              <td>{row[data]}</td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>