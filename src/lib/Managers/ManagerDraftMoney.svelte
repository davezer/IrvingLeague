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
  let fetchUrl = '';
  let rawData = null;
  let apiError = '';

  onMount(async () => {
    if (!pivot.length && managerIndex != null) {
      try {
        fetchUrl = `/api/pivot?manager=${managerIndex}`;
        const newPivot = await fetchPivotData(window.fetch, managerIndex);
        pivot = newPivot;
        rawData = newPivot;
      } catch (e) {
        console.error('Failed to fetch pivot in ManagerDraftMoney:', e);
        apiError = e.message;
      }
    } else {
      rawData = pivot;
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
        <img src="/dollarbill.png" alt="Dollar sign" />
      </div>
      <div class="infoAnswer">{formatCurrency(draftMoneyCurrent)}</div>
    </div>
  {/if}

  {#if draftMoneyNext != null}
    <div class="infoSlot">
      <div class="infoLabel">{nextY} Draft Money</div>
      <div class="infoIcon">
        <img src="/dollarbill.png" alt="Dollar sign" />
      </div>
      <div class="infoAnswer">{formatCurrency(draftMoneyNext)}</div>
    </div>
  {/if}
</div>

<style>
  /* exactly the same sizing you use elsewhere */
 .fantasyInfos {
        display: flex;
        justify-content: space-evenly;
        align-items: flex-start;
        flex-wrap: wrap;
        padding: 0 0 2em;
        margin: 0em 0 4em;
        border-bottom: 1px solid var(--aaa);
        border-top: px solid var(--aaa);
        box-shadow: 0 0 8px 4px var(--ccc);
    }

  .infoSlot {
        text-align: center;
        margin: 2em 1em 0;
    }

  .infoIcon {
        display: block;
        height: 80px;
        width: 80px;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        border: 1px solid var(--ccc);
        overflow: hidden;
        background-color: var(--fff);
        transition: box-shadow 0.4s;
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
        margin-bottom: 3em;
        height: 30px;
        width: 90px;
        text-align: center;
        line-height: 1.2em;
        font-size: 25px;
    }
 .infoAnswer {
        font-size: 25px;
        color: green;
        margin-top: 1em;
        width: 90px;
        text-align: center;
        line-height: 1.2em;
    }

</style>