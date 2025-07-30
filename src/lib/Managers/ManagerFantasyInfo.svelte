<script>
  // Props injected by SvelteKit load function
  export let data;
  export let viewManager;
  export let players;
  export let changeManager;

  // Merge pivot results into viewManager state
  if (data.draftMoneyCurrentYear != null) {
    viewManager.draftMoneyCurrentYear = data.draftMoneyCurrentYear;
  }
  if (data.draftMoneyNextYear != null) {
    viewManager.draftMoneyNextYear = data.draftMoneyNextYear;
  }
</script>

<div class="fantasyInfos">
  <!-- Rookies or Vets -->
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

  <!-- Favorite Fantasy Asset -->
  {#if viewManager.valuePosition}
    <div class="infoSlot">
      <div class="infoLabel">Favorite Fantasy Asset</div>
      <div class="infoIcon {viewManager.valuePosition}">
        <span class="valuePosition">{viewManager.valuePosition}</span>
      </div>
    </div>
  {/if}

  <!-- Trading Scale -->
  {#if viewManager.tradingScale}
    <div class="infoSlot">
      <div class="infoLabel">Desire to Trade</div>
      <div class="infoIcon">
        <span class="tradingScale">{viewManager.tradingScale}</span>
      </div>
      <div class="infoAnswer">{viewManager.tradingScale} out of 10</div>
    </div>
  {/if}

  <!-- Draft Money Current Year -->
  {#if viewManager.draftMoneyCurrentYear}
    <div class="infoSlot">
      <div class="infoLabel">{data.currentYear || new Date().getFullYear()} Draft Money</div>
      <div class="infoIcon">
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <img class="draftMoneyCurrentYear" src="/dollar-sign.png" alt="Dollar sign" />
      </div>
      <div class="infoAnswer">{viewManager.draftMoneyCurrentYear}</div>
    </div>
  {/if}

  <!-- Draft Money Next Year -->
  {#if viewManager.draftMoneyNextYear}
    <div class="infoSlot">
      <div class="infoLabel">{(data.currentYear || new Date().getFullYear()) + 1} Draft Money</div>
      <div class="infoIcon">
        <img class="draftMoneyNextYear" src="/dollar-sign.png" alt="Dollar sign" />
      </div>
      <div class="infoAnswer">{viewManager.draftMoneyNextYear}</div>
    </div>
  {/if}

  <!-- Win Now or Rebuild -->
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

  <!-- Rival -->
  <div
    class="infoSlot infoRival"
    on:click={() => changeManager(viewManager.rival.link)}
    role="button"
    tabindex="0"
  >
    <div class="infoLabel">Rival</div>
    <div class="infoIcon">
      <img class="rival" src={viewManager.rival.image} alt="rival" />
    </div>
    <div class="infoAnswer">{viewManager.rival.name}</div>
  </div>
</div>

<style>
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
  .QB { background-color: var(--QB); }
  .WR { background-color: var(--WR); }
  .RB { background-color: var(--RB); }
  .TE { background-color: var(--TE); }
  .Picks { background: #73b647; }
  .K { background-color: var(--K); }
  .DEF { background-color: var(--DEF); }
  .CB { background-color: #ffcc7a; }
  .SS { background-color: #b7a1db; }
  .FS { background-color: #ebe7b3; }
  .DE { background-color: #b1d0e9; }
  .DL { background-color: #c392d3; }
  .LB { background-color: #98c097; }

  .draftMoneyCurrentYear, .draftMoneyNextYear {
    height: 65px;
    vertical-align: middle;
  }

  /* media queries */
  @media (max-width: 731px) { .infoSlot { margin: 2em 3em 0; } }
  @media (max-width: 558px) { .infoSlot { margin: 2em 2em 0; } }
  @media (max-width: 461px) { .infoSlot { margin: 2em 1em 0; } }
</style>


<div class="fantasyInfos">
  <!-- Rookies or Vets (optional) -->
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

  <!-- Favorite fantasy position (optional) -->
  {#if viewManager.valuePosition}
    <div class="infoSlot">
      <div class="infoLabel">Favorite Fantasy Asset</div>
      <div class="infoIcon {viewManager.valuePosition}">
        <span class="valuePosition">{viewManager.valuePosition}</span>
      </div>
    </div>
  {/if}

  {#if viewManager.tradingScale}
    <!-- Trading Scale -->
    <div class="infoSlot">
      <div class="infoLabel">Desire to Trade</div>
      <div class="infoIcon">
        <span class="tradingScale">{viewManager.tradingScale}</span>
      </div>
      <div class="infoAnswer">{viewManager.tradingScale} out of 10</div>
    </div>
  {/if}

  {#if viewManager.draftMoneyCurrentYear}
    <!-- Current Year Draft Money -->
    <div class="infoSlot">
      <div class="infoLabel">{new Date().getFullYear()} Draft Money</div>
      <div class="infoIcon">
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <img class="draftMoneyCurrentYear" src="/dollar-sign.png" alt="Dollar sign" />
      </div>
      <div class="infoAnswer">{viewManager.draftMoneyCurrentYear}</div>
    </div>
  {/if}

  {#if viewManager.draftMoneyNextYear}
    <!-- Next Year Draft Money -->
    <div class="infoSlot">
      <div class="infoLabel">{new Date().getFullYear() + 1} Draft Money</div>
      <div class="infoIcon">
        <!-- svelte-ignore a11y_missing_attribute -->
        <img class="draftMoneyNextYear" src="/dollar-sign.png" alt="Dollar sign" />
      </div>
      <div class="infoAnswer">{viewManager.draftMoneyNextYear}</div>
    </div>
  {/if}

  <!-- Rebuild Mod (optional) -->
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

  <!-- Rival -->
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


