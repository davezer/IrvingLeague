
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
<div class="money-component" {...$$restProps}>
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
</div>  
{/if}
 

<style>
.fantasyInfos {
  display: flex;            
  flex-direction: row;        
  justify-content: space-evenly; 
  align-items: center;         
     gap: 15.5rem;
    margin-top: 38px;
    margin-bottom: -35px;         
}

.fantasyInfos .infoSlot {
  display: flex;              
  flex-direction: column;     
  align-items: center;        
  text-align: center;
  
}

 .infoLabel{
        font-size: 15px;
        color: var(--blueOne);
        font-weight: 700;
        margin-bottom: 1em;
        height: 30px;
        width: 90px;
        text-align: center;
        line-height: 1.2em;
    }

img {
  
        height: 70px;
        width: 70px;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        border: 1px solid var(--ccc);
        overflow: hidden;
        background-color: darkgreen;
        transition: box-shadow 0.4s;
}
</style>
