<script>
  // expects `data = { columns?: [{data:'Col'}| 'Col'], detailRows: [...] }`
  export let data;

  // rows can be array or object map
  const rawRows = Array.isArray(data?.detailRows)
    ? data.detailRows
    : data?.detailRows && typeof data.detailRows === 'object'
      ? Object.values(data.detailRows)
      : [];

  // normalize provided columns -> ['Col','Col2',...]
  const providedCols = (data?.columns || []).map(c => typeof c === 'string' ? c : c?.data).filter(Boolean);

  // If no columns provided, build union of keys across all rows
  const unionCols = (() => {
    const set = new Set();
    for (const r of rawRows) Object.keys(r || {}).forEach(k => set.add(k));
    return Array.from(set);
  })();

  const colKeys = providedCols.length ? providedCols : unionCols;

  // table state
  let search = '';
  let perPage = 'ALL';      // 10|20|50|100|'ALL'
  let sortCol = null;
  let sortDir = 'asc';

  // helpers
  const isBlank = v => v === null || v === undefined || v === '';
  const looksLikeDateHeader = (h) => String(h).toLowerCase().includes('date');
  const parseMaybeDate = (v) => {
    if (v instanceof Date) return v;
    if (typeof v === 'number' && !Number.isNaN(v)) return new Date(v);
    const d = new Date(v);
    return isNaN(d) ? null : d;
  };

  function getComparator(col, dir) {
    const isDateCol = looksLikeDateHeader(col);
    return (a, b) => {
      const av = a?.[col], bv = b?.[col];
      if (isBlank(av) && isBlank(bv)) return 0;
      if (isBlank(av)) return dir === 'asc' ? 1 : -1;
      if (isBlank(bv)) return dir === 'asc' ? -1 : 1;

      if (isDateCol) {
        const ad = parseMaybeDate(av), bd = parseMaybeDate(bv);
        if (ad && bd) {
          const diff = ad.getTime() - bd.getTime();
          return dir === 'asc' ? diff : -diff;

        }
      }
      const an = Number(av), bn = Number(bv);
      const nums = !Number.isNaN(an) && !Number.isNaN(bn) && String(av).trim() !== '' && String(bv).trim() !== '';
      if (nums) return dir === 'asc' ? an - bn : bn - an;

      const as = String(av), bs = String(bv);
      if (as < bs) return dir === 'asc' ? -1 : 1;
      if (as > bs) return dir === 'asc' ? 1 : -1;
      return 0;
    };
  }

  function toggleSort(col) {
    if (sortCol === col) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortCol = col; sortDir = 'asc'; }
  }

  // pipeline
  $: tokens = search.toLowerCase().split(/[\s,]+/).filter(Boolean);
  $: filtered = rawRows.filter(r => {
    if (!tokens.length) return true;
    const hay = colKeys.map(k => String(r?.[k] ?? '')).join(' \u0001 ').toLowerCase();
    return tokens.every(t => hay.includes(t));
  });
  $: sorted = sortCol ? [...filtered].sort(getComparator(sortCol, sortDir)) : filtered;
  $: pageSize = String(perPage) === 'ALL' ? Infinity : Number(perPage);
  $: visible = sorted.slice(0, pageSize);
</script>

<style>

  .parlay-page{padding:0 1rem}
  .parlay-header{padding:.75rem 0}
  h4{text-align:center;margin:1rem 0;font-weight:600}

  .controls{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:1rem 2rem;margin:.5rem 0 1rem;}
  .controls label{display:flex;align-items:center;gap:.5rem}
  .controls input,.controls select{border:1px solid #555;padding:.45rem .6rem;border-radius:6px;font-size:.95rem;min-width:10rem}

  .table-wrapper{max-width:1500px;margin:0 auto 2rem;padding:.5rem;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,.6)}
  .table-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}

  table{width:100%;border-collapse:collapse;font-size:.98rem;min-width:720px}
  th,td{padding:.7rem .9rem;border-bottom:1px solid #222;text-align:left;white-space:nowrap}
  thead th{position:sticky;top:0;z-index:2;cursor:pointer;user-select:none}
  th.sorted-asc::after{content:' ▲'} th.sorted-desc::after{content:' ▼'}
  tbody tr:hover td{background:rgba(255,255,255,.04)}
  .no-results{text-align:center;}

  @media (max-width:768px){
    .parlay-page{padding:0 .75rem}
    .controls{gap:.75rem 1rem}
    .controls input{min-width:0;width:100%}
    .controls label{width:100%}
    th,td{padding:.55rem .6rem;font-size:.94rem}
  }

  @media (max-width:520px){
    th,td{padding:.5rem .55rem;font-size:.9rem}
    table{min-width:640px} /* ensure horizontal scroll instead of hiding columns */
  }
</style>

<div class="parlay-page">
  <div class="parlay-header"><h4>Parlay Detail</h4></div>

  <div class="controls">
    <label>Search: <input type="text" bind:value={search} placeholder="Search…"/></label>
    <label>Show
      <select bind:value={perPage}>
        {#each [10,20,50,100,'ALL'] as n}<option value={n}>{n}</option>{/each}
      </select> entries
    </label>
    <div>Showing {visible.length} of {filtered.length}</div>
  </div>

  <div class="table-wrapper">
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            {#each colKeys as key}
              <th
                class:sorted-asc={sortCol === key && sortDir === 'asc'}
                class:sorted-desc={sortCol === key && sortDir === 'desc'}
                on:click={() => toggleSort(key)}
                title={"Sort by " + key}
              >{key}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#if visible.length === 0}
            <tr><td class="no-results" colspan={colKeys.length}>No rows match “{search}”</td></tr>
          {:else}
            {#each visible as row}
              <tr>
                {#each colKeys as key}
                  <td>{row?.[key]}</td>
                {/each}
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
