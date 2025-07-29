<script>
  // `data` contains everything returned by load()
  export let data;
  const { parlayData, columns } = data;
</script>

<!-- Render immediately with no client-side fetch -->
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