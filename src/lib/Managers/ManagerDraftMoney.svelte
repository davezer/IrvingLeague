<!-- src/lib/Managers/ManagerDraftMoney.svelte -->
<script>
  import { onMount } from 'svelte';
  import { fetchPivotData, getPivotValue, formatCurrency } from '$lib/utils/helperFunctions/fetchPivotData';

  // props from parent
  export let managerIndex;
  export let viewManager;

  // holds the raw pivot from the API
  let pivot = [];

  // current/next year
  const year  = new Date().getFullYear();
  const nextY = year + 1;

  // on mount, grab the pivot array
  onMount(async () => {
    try {
      // if you’re using the helper, just pass SvelteKit’s `fetch`
      pivot = await fetchPivotData(fetch);
    } catch (err) {
      console.error('Failed to load pivot:', err);
    }
  });

  // reactive lookups
  $: draftMoneyCurrent = pivot.length && viewManager.name
    ? getPivotValue(pivot, viewManager.name, year,  `${year} Total`)
    : null;

  $: draftMoneyNext    = pivot.length && viewManager.name
    ? getPivotValue(pivot, viewManager.name, nextY, `${nextY} Total`)
    : null;
</script>

<div class="fantasyInfos">
  {#if draftMoneyCurrent != null}
    <div class="infoSlot">
      <div class="infoLabel">{year} Draft Money</div>
      <div class="infoIcon">
        <img src="/dollar-sign.png" alt="Dollar sign" />
      </div>
      <div class="infoAnswer">{formatCurrency(draftMoneyCurrent)}</div>
    </div>
  {/if}

  {#if draftMoneyNext != null}
    <div class="infoSlot">
      <div class="infoLabel">{nextY} Draft Money</div>
      <div class="infoIcon">
        <img src="/dollar-sign.png" alt="Dollar sign" />
      </div>
      <div class="infoAnswer">{formatCurrency(draftMoneyNext)}</div>
    </div>
  {/if}
</div>

<style>
  /* exactly the same sizing you use elsewhere */
  .fantasyInfos {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
  }

  .infoSlot {
    text-align: center;
    margin: 2em 1em 0;
    /* you can also constrain width if you like:
       width: 90px; */
  }

  .infoIcon {
    display: inline-flex;
    justify-content: center;
    align-items: center;

    /* force 70×70 circles */
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 1px solid var(--ccc);
    background-color: var(--fff);
    overflow: hidden;
  }

  /* make the <img> fill that 70×70 box */
  .infoIcon img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* or contain, as you prefer */
  }

  .infoLabel {
    font-size: 0.7em;
    color: var(--blueOne);
    font-weight: 700;
    margin-bottom: 1em;
  }

  .infoAnswer {
    font-size: 0.8em;
    color: var(--g555);
    margin-top: 1em;
  }
</style>