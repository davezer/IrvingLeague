
<script>
  import { onMount } from 'svelte';
  import { fetchPivotData, getPivotValue, formatCurrency } from '$lib/utils/helperFunctions/fetchPivotData';

  // props from parent
  export let managerIndex;
  export let viewManager;
  export let pivot = [];
  let apiError = '';

  // current/next year
  const year  = new Date().getFullYear();
  const nextY = year + 1;

  // fetch state
 onMount(async () => {
  console.log('🔍 ManagerDraftMoney mount, managerIndex =', managerIndex);

  try {
    const newPivot = await fetchPivotData(window.fetch, managerIndex);
    console.log('✅ fetched pivot →', newPivot);
    pivot = newPivot;
  } catch (e) {
    console.error('❌ fetchPivotData failed:', e);
    apiError = e.message;
  }
});

  // reactive lookups

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
  $: nextColor    = moneyColor(draftMoneyNext);

</script>

{#if apiError}
      <p class="error">Error loading draft-money data: {apiError}</p>
    {:else}

  <div class="draftMoneyInfo">
    <div class="draftMoneySlot">
      <div class="draftMoneyLabel">{nextY} Draft Money</div>
      <div class="draftMoneyAnswer" style="color: {nextColor}">
        {draftMoneyNext != null
          ? formatCurrency(draftMoneyNext)
          : '–'}
      </div>
  </div>
</div>
 
{/if}
 

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
      margin-top: 0.5em;
     
    }

</style>
