
<script>
  import { getPivotValue, formatCurrency } from '$lib/utils/helperFunctions/fetchPivotData';
  import { onMount } from 'svelte';
  import ManagerDraftMoney from './ManagerDraftMoney.svelte';

  // Props passed from parent Manager.svelte
  export let managerIndex = null;
  export let viewManager = {};
  export let pivot = [];
  export let players;
  export let changeManager;


  // current and next year
  const year = new Date().getFullYear();
  const nextY = year + 1;

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
  // compute draft money values with safe defaults
  $: draftMoneyCurrent = (pivot.length && viewManager.name)
    ? getPivotValue(pivot, viewManager.name, year, `${year} Total`)
    : null;
  $: draftMoneyNext = (pivot.length && viewManager.name)
    ? getPivotValue(pivot, viewManager.name, nextY, `${nextY} Total`)
    : null;
    </script>

<div class="fantasyInfos">
  {#if viewManager.rookieOrVets}
    <div class="infoSlot">
      <div class="infoLabel">Rookie or Vet Preference</div>
      <div class="infoIcon">
        <img
          class="rookiesOrVets"
          src="/{viewManager.rookieOrVets}.png"
          alt="rookie or vet preference"
        />
      </div>
      <div class="infoAnswer">{viewManager.rookieOrVets}</div>
    </div>
  {/if}

  {#if viewManager.valuePosition}
    <div class="infoSlot">
      <div class="infoLabel">Favorite Fantasy Asset</div>
      <div class="infoIcon {viewManager.valuePosition}">
        <span class="valuePosition">{viewManager.valuePosition}</span>
      </div>
    </div>
  {/if}

  {#if viewManager.tradingScale !== undefined}
    <div class="infoSlot">
      <div class="infoLabel">Desire to Trade</div>
      <div class="infoIcon">
        <span class="tradingScale">{viewManager.tradingScale}</span>
      </div>
      <div class="infoAnswer">{viewManager.tradingScale} out of 10</div>
    </div>
  {/if}

  {#if draftMoneyCurrent != null}
    <div class="infoSlot">
      <div class="infoLabel">{year} Draft Money</div>
      <div class="infoIcon">
        <img class="draftMoneyCurrentYear" src="/dollar-sign.png" alt="Dollar sign" />
      </div>
      <div class="infoAnswer">{formatCurrency(draftMoneyCurrent)}</div>
    </div>
  {/if}

  {#if draftMoneyNext != null}
    <div class="infoSlot">
      <div class="infoLabel">{nextY} Draft Money</div>
      <div class="infoIcon">
        <img class="draftMoneyNextYear" src="/dollar-sign.png" alt="Dollar sign" />
      </div>
      <div class="infoAnswer">{formatCurrency(draftMoneyNext)}</div>
    </div>
  {/if}
  
<ManagerDraftMoney {managerIndex} {viewManager} {pivot} />
  {#if viewManager.mode}
    <div class="infoSlot">
      <div class="infoLabel">Win Now or Rebuild?</div>
      <div class="infoIcon">
        <img
          class="rebuildOrWin"
          src="/{viewManager.mode.replace(' ', '%20')}.png"
          alt="win now or rebuild"
        />
      </div>
      <div class="infoAnswer">{viewManager.mode}</div>
    </div>
  {/if}

  <button
    type="button"
    class="infoSlot infoRival"
    on:click={() => changeManager(viewManager.rival.link)}
  >
    <div class="infoLabel">Rival</div>
    <div class="infoIcon">
      <img class="rival" src={viewManager.rival.image} alt="rival" />
    </div>
    <div class="infoAnswer">{viewManager.rival.name}</div>
  </button>
</div>

<style>
	.main {
		position: relative;
		z-index: 1;
	}
    .loading {
        display: block;
        width: 85%;
        max-width: 500px;
        margin: 80px auto;
    }
    .fantasyInfos {
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
        flex-wrap: wrap;
        padding: 0 0 2em;
        margin: 3em 0 4em;
        border-bottom: 1px solid var(--aaa);
        border-top: 1px solid var(--aaa);
        box-shadow: 0 0 8px 4px var(--ccc);
    }

    .infoSlot {
        text-align: center;
        margin: 2em 1em 0;
    }

    .infoIcon {
        display: inline-flex;
        height: 70px;
        width: 70px;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        border: 1px solid var(--ccc);
        overflow: hidden;
        background-color: var(--fff);
        transition: box-shadow 0.4s;
    }

    .infoLabel {
        font-size: 0.7em;
        color: var(--blueOne);
        font-weight: 700;
        margin-bottom: 1em;
        height: 30px;
        width: 90px;
        text-align: center;
        line-height: 1.2em;
    }

    .infoAnswer {
        font-size: 0.8em;
        color: var(--g555);
        margin-top: 1em;
        width: 90px;
        text-align: center;
        line-height: 1.2em;
    }

    .tradingScale {
        line-height: 70px;
        font-size: 55px;
        color: var(--blueOne);
    }

    .rookiesOrVets {
        height: 65px;
        vertical-align: middle;
    }

    .infoRival {
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        outline: inherit;
    }

    .infoRival:hover .infoIcon,
    .infoRival:focus .infoIcon {
        box-shadow: 0 0 6px 4px var(--aaa);
        border: 1px solid var(--aaa);
    }
    .rival {
        height: 100%;
    }

    .rebuildOrWin {
        height: 70px;
    }

    .valuePosition {
        line-height: 70px;
        font-size: 25px;
        color: var(--fff);
    }

    /* Position colors... */
    .QB {
        background-color: var(--QB);
    }
    .WR {
        background-color: var(--WR);
    }
    .RB {
        background-color: var(--RB);
    }
    .TE {
        background-color: var(--TE);
    }
    .Picks {
        background: #73b647;
    }
    .K {
        background-color: var(--K);
    }
    .DEF {
        background-color: var(--DEF);
    }
    .CB {
        background-color: #ffcc7a;
    }
    .SS {
        background-color: #b7a1db;
    }
    .FS {
        background-color: #ebe7b3;
    }
    .DE {
        background-color: #b1d0e9;
    }
    .DL {
        background-color: #c392d3;
    }
    .LB {
        background-color: #98c097;
    }

    .draftMoneyCurrentYear,
    .draftMoneyNextYear {
        height: 65px;
        vertical-align: middle;
    }


    /* media queries */
    @media (max-width: 731px) {
        .infoSlot {
            margin: 2em 3em 0;
        }
    }
    @media (max-width: 558px) {
        .infoSlot {
            margin: 2em 2em 0;
        }
    }
    @media (max-width: 461px) {
        .infoSlot {
            margin: 2em 1em 0;
        }
    }
</style> 