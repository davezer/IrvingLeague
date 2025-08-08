<script>
   import { pivotStore } from '$lib/pivotStore.js';
  import { formatCurrency } from '$lib/utils/helperFunctions/fetchPivotData';
  import { onDestroy } from 'svelte';

  // give viewManager a safe default so .teamName never throws
  export let viewManager = {};
  export let pivot = [];
  let pivotLoading = true;
  let pivotError = null;
  export let teamName = ''

  const unsubscribe = pivotStore.subscribe(({ data, error, loading }) => {
    pivot        = data || [];
    pivotError   = error;
    pivotLoading = loading;
  });
  onDestroy(unsubscribe);

  let myDraftMoney = null;

  function moneyColor(v) {
    if (v == null || isNaN(v)) return 'inherit';
    if (v < 100)   return 'red';
    if (v <= 200)  return 'green';
    return 'gold';
  }

  // whenever pivot or viewManager change, recompute if we have both
   $: {
    const label = (viewManager.teamName ?? viewManager.name)
      .toLowerCase()
      .trim();
    const entry = pivot.find(
      (r) => String(r.key).toLowerCase().trim() === label
    );
    myDraftMoney = entry ? Number(entry.value) : null;
  }
</script>

<div class="draftMoneyInfo">
  <div class="draftMoneySlot">
    <div class="draftMoneyLabel">
      Future Draft Money
    </div>
  
  {#if pivotError}
    <p class="error">Pivot error: {pivotError}</p>
  {:else}
    <div class="draftMoneyAnswer" style="color: {moneyColor(myDraftMoney)}">
      {#if myDraftMoney != null && !isNaN(myDraftMoney)}
        {formatCurrency(myDraftMoney)}
    {:else}
      –
    {/if}
  </div>
{/if}
  </div>
</div>


<style>

.draftMoneyInfo {
  display: flex;            
  flex-direction: row;        
  justify-content: space-evenly; 
  align-items: center;       
}

.draftMoneySlot {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    align-content: center;
    flex-wrap: wrap;
    justify-content: center;
  
}

 .draftMoneyLabel{
        font-size: 15px;
        color: var(--blueOne);
        font-weight: 700;
        margin-bottom: 1em;
        height: 30px;
        width: 90px;
        text-align: center;
        line-height: 1.2em;
        
    } 

    .draftMoneyAnswer{ 
      font-size: 18px;
      color: var(--blueTwo);
      font-weight: 700;
     
    }

</style>
