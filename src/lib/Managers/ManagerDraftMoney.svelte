<script>
  import { onMount } from 'svelte';
  import { formatCurrency } from '$lib/utils/helperFunctions/fetchPivotData';

  // Passed in from parent:
  export let viewManager;

  let pivotData = [];
  let apiError = '';
  let myDraftMoney = null;

  function moneyColor(val) {
    if (val === null || isNaN(val)) return 'inherit';
    if (val < 100)    return 'red';
    if (val <= 200)   return 'green';
    return 'gold';
  }

  onMount(async () => {
    try {
      const res = await fetch('/api/pivot');
      if (!res.ok) throw new Error(res.statusText);
      pivotData = await res.json();

      // match on teamName (or name)
      const label = (viewManager.teamName || viewManager.name)
        .trim()
        .toLowerCase();

      const entry = pivotData.find(r =>
        String(r.key || '').trim().toLowerCase() === label
      );

      myDraftMoney = entry ? Number(entry.value) : null;
    } catch (e) {
      console.error('❌ fetch pivotData failed:', e);
      apiError = e.message;
    }
  });
</script>

<div class="draftMoneyInfo">
  <div class="draftMoneySlot">
    <div class="draftMoneyLabel">
      Future Draft Money
    </div>
    <div
      class="draftMoneyAnswer"
      style="color: {moneyColor(myDraftMoney)}"
    >
      {#if myDraftMoney != null && !isNaN(myDraftMoney)}
        {formatCurrency(myDraftMoney)}
      {:else}
        –
      {/if}
    </div>
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
