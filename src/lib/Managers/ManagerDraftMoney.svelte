
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

  // fetch state
  let apiError = '';
  onMount(async () => {
    if (!pivot.length && managerIndex != null) {
      try {
        await fetchPivotData(window.fetch, managerIndex)
          .then(newPivot => {
            pivot = newPivot;
          });
      } catch (e) {
        console.error('Failed to fetch pivot in ManagerDraftMoney:', e);
        apiError = e.message;
      }
    }
  });

  // reactive lookups
  $: draftMoneyCurrent = pivot.length && viewManager.name
    ? getPivotValue(pivot, viewManager.name, year,  `${year} Total`)
    : null;

  $: draftMoneyNext = pivot.length && viewManager.name
    ? getPivotValue(pivot, viewManager.name, nextY, `${nextY} Total`)
    : null;

  // return a CSS color based on the value
  function moneyColor(val) {
    if (val === null || isNaN(val)) return 'inherit';
    if (val < 100)    return 'red';
    if (val <= 200)   return 'green';
    return 'gold';
  }

  // pre-compute for easy binding
  $: currentColor = moneyColor(draftMoneyCurrent);
  $: nextColor    = moneyColor(draftMoneyNext);

</script>

{#if apiError}
  <p class="error">Error loading draft-money data: {apiError}</p>
{:else}
  <div class="fantasyInfos">
    <div class="infoSlot">
      <div class="infoLabel">{year} Draft Money</div>
      <div class="infoIcon">
         <img src="/dollarbill.png" alt="Dollar sign" />
      </div>
      
      <div class="infoAnswer" style="color: {currentColor}">
        {draftMoneyCurrent != null
          ? formatCurrency(draftMoneyCurrent)
          : '–'}
      </div>
    </div>

    <div class="infoSlot">
      <div class="infoLabel">{nextY} Draft Money</div>
      <div class="infoIcon">
         <img src="/dollarbill.png" alt="Dollar sign" />
      </div>
      
      <div class="infoAnswer" style="color: {nextColor}">
        {draftMoneyNext != null
          ? formatCurrency(draftMoneyNext)
          : '–'}
      </div>
    </div>
  </div>
{/if}

<style>
  .fantasyInfos {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 0 0 2em;
    margin: 0 0 4em;
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

  .infoIcon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .infoLabel {
    font-size: 18px;
    color: var(--blueOne);
    font-weight: 700;
    margin-bottom: 0.5em;
    width: 90px;
    text-align: center;
    line-height: 1.2;
  }

  .infoAnswer {
    font-size: 25px;
    margin-top: 1em;
    width: 90px;
    text-align: center;
    line-height: 1.2;
    /* color is now set dynamically via inline style */
  }

  .error {
    color: red;
    font-size: 0.9em;
  }
</style>
