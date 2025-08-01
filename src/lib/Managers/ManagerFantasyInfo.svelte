
<script>
  import ManagerDraftMoney from './ManagerDraftMoney.svelte';


  // Props passed from parent Manager.svelte
  export let managerIndex = null;
  export let viewManager = {};
  export let pivot = [];
  export let players;
  export let changeManager;
  

</script>




<div class="fantasyInfos">
  {#if viewManager.persona}
    <div class="infoSlot">
      <div class="infoLabel">Persona</div>
      <div class="infoIcon">
        <img
          class="persona"
          src="/{viewManager.persona}.png"
          alt="persona"
        />
      </div>
      <div class="infoAnswer">{viewManager.persona}</div>
    </div>
  {/if}

  <ManagerDraftMoney
    class="fancy-money"
    {managerIndex}
    {viewManager}
    {pivot}
  />

   {#if viewManager.yearsOfService}
    <div class="infoSlot">
      <div class="infoLabel">Years of Service</div>
      <div class="infoIcon">
        <img
          class="persona"
          src="/{viewManager.yearsOfService}.png"
          alt="years of service"
        />
      </div>
      <div class="infoAnswer">{viewManager.yearsOfService}</div>
    </div>
  {/if}

    {#if viewManager.championship}
    <div class="infoSlot">
      <div class="infoLabel">Championship</div>
      <div class="infoIcon">
        <img
          class="persona"
          src="/{viewManager.championship}.png"
          alt="championship"
        />
      </div>
      <div class="infoAnswer">2004</div>
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


  
  

  <!-- {#if viewManager.tradingScale !== undefined}
    <div class="infoSlot">
      <div class="infoLabel">Desire to Trade</div>
      <div class="infoIcon">
        <span class="tradingScale">{viewManager.tradingScale}</span>
      </div>
      <div class="infoAnswer">{viewManager.tradingScale} out of 10</div>
    </div>
  {/if} -->


  

  <!-- {#if viewManager.mode}
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
  {/if} -->



<style>
 .fantasyInfos {
    display: flex;
    justify-content: space-evenly; /* or space-between */
    align-items: center;           /* vertical center all children */
    gap: 2rem;                     /* space between each “column” */
  }

  /* both your infoSlot buttons and the money component */
  .fantasyInfos .infoSlot, .fancy-money {
    display: flex;
    flex-direction: column;  /* stack label/icon/answer */
    align-items: center;     /* center items in column */
    text-align: center;
  }
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

    .infoIcon{
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

    .infoAnswer {
        font-size: 15;
        color: var(--g555);
        margin-top: 1em;
        width: 90px;
        text-align: center;
        line-height: 1.2em;
    }
/* 
    .tradingScale {
        line-height: 70px;
        font-size: 55px;
        color: var(--blueOne);
    } */

    .persona {
         height: 70px;               /* force the height */
    width: 70px;                /* make it square */
    object-fit: cover;          /* crop/scale to fill */
    border-radius: 50%;         /* turn square into circle */
    display: inline-block;      /* allow vertical-align */
    vertical-align: middle;     /* align with surrounding text */
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

    /* .rebuildOrWin {
        height: 70px;
    }

    .valuePosition {
        line-height: 70px;
        font-size: 25px;
        color: var(--fff);
    } */

    /* Position colors... */
    /* .QB {
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
    } */

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