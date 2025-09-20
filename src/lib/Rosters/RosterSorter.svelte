<script>
  import { onMount, onDestroy } from 'svelte';
  import { gotoManager } from '$lib/utils/helper';
  import {
    getAvatarFromTeamManagers,
    getTeamNameFromTeamManagers
  } from '$lib/utils/helperFunctions/universalFunctions';

  /* ===== props ===== */
  export let rosters;                   // map or array
  export let players = {};
  export let leagueTeamManagers;
  export let startersAndReserve = [];
  export let leagueData;

  /* ===== normalize ===== */
  function toArray(v) {
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') return Object.values(v);
    return [];
  }
  $: rostersArray = toArray(rosters);
  $: byId = new Map(rostersArray.map((r) => [r.roster_id, r]));
  $: draftOrder = rostersArray.map((r) => r.roster_id).sort((a, b) => a - b);

  function isStarterSlot(s) { return s && !/^(BN|TAXI|IR)$/i.test(s); }
  const DEFAULT_STARTERS = ['QB','RB','RB','WR','WR','TE','WRRB_FLEX','K','DEF'];
  $: starterSlots = Array.isArray(leagueData?.roster_positions)
    ? leagueData.roster_positions.filter(isStarterSlot)
    : DEFAULT_STARTERS;

  /* ===== helpers ===== */
  function pidAt(roster, idx) {
    const arr = roster && Array.isArray(roster.starters) ? roster.starters : [];
    const pid = arr[idx];
    return pid && pid !== '0' ? pid : null;
  }
  function posOf(pid) { return players && players[pid] ? players[pid].pos : ''; }
  function headshotStyle(pid) {
    if (!pid) return '';
    return posOf(pid) === 'DEF'
      ? `background-image:url(https://sleepercdn.com/images/team_logos/nfl/${String(pid).toLowerCase()}.png)`
      : `background-image:url(https://sleepercdn.com/content/nfl/players/thumb/${pid}.jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)`;
  }
  function playerLabel(pid) {
    const p = players && players[pid];
    if (!p) return '';
    return `${p.fn} ${p.ln}${p.pos === 'DEF' ? '' : ` (${p.t})`}`;
  }
  function openTeam(rosterId) {
    return gotoManager({ year: leagueData?.season, leagueTeamManagers, rosterID: rosterId });
  }

  function buildBench(r) {
    const starters = Array.isArray(r?.starters) ? r.starters : [];
    const reserve  = Array.isArray(r?.reserve)  ? r.reserve  : [];
    const all      = Array.isArray(r?.players)  ? r.players  : [];
    return all.filter((pid) => pid && pid !== '0' && !starters.includes(pid) && !reserve.includes(pid));
  }
  function buildIR(r) { return Array.isArray(r?.reserve) ? r.reserve.filter((pid) => pid && pid !== '0') : []; }

  $: benchById = new Map(draftOrder.map((rid) => [rid, buildBench(byId.get(rid))]));
  $: irById    = new Map(draftOrder.map((rid) => [rid, buildIR(byId.get(rid))]));
  $: maxBenchRows = draftOrder.reduce((m, rid) => Math.max(m, (benchById.get(rid) || []).length), 0);
  $: maxIRRows    = draftOrder.reduce((m, rid) => Math.max(m, (irById.get(rid) || []).length), 0);

  /* grid: left label + teams (no horizontal scroll) */
  $: leftColPx = 38;
  $: gridTemplate = ` ${leftColPx}px repeat(${draftOrder.length}, 1fr) `;

  /* ===== fixed header visibility (after top row scrolls off) + smooth transition ===== */
  let showSticky = false;
  let headerSentinel;

  function parsePx(v) {
    const n = parseFloat(String(v || '0').replace('px', ''));
    return Number.isFinite(n) ? n : 0;
  }

  onMount(() => {
    const css = getComputedStyle(document.documentElement);
    const offset = parsePx(css.getPropertyValue('--rosters-sticky-offset'));

    // Pre-trigger a few px early for a smoother feel
    const obs = new IntersectionObserver(
      ([entry]) => { showSticky = !entry.isIntersecting; },
      { root: null, rootMargin: `-${offset + 6}px 0px 0px 0px`, threshold: 0.00001 }
    );

    if (headerSentinel) obs.observe(headerSentinel);
    onDestroy(() => obs.disconnect());
  });
</script>

<style>
  /* ===== sizing knobs ===== */
  :root{
    /* set this globally if you have a fixed navbar (e.g. 56px) */
    --rosters-sticky-offset: 0px;

    --hdr-h: 56px;   /* fixed & in-grid header height */
    --tile-h: 66px;  /* starter tile height */
  }

  /* container toggles the state */
  .rostersView {}
  .rostersView.is-stuck .stickyWrap {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
  }
  .rostersView.is-stuck .stickySpacer { height: var(--hdr-h, 56px); }

  /* always-present sticky bar (animated in/out) */
  .stickyWrap{
    position: fixed;
    top: var(--rosters-sticky-offset, 0px);
    left: 50%;
    transform: translateX(-50%) translateY(-8px);   /* slide distance when hidden */
    width: 95%;
    z-index: 1000;
    pointer-events: none;
    transition: transform .18s ease;
    will-change: transform;
  }
  .stickyBar{
    display: grid;
    grid-auto-rows: var(--hdr-h);
    background: rgb(0, 0, 0);           /* no blur */
    border-radius: 12px 12px 0 0;
    box-shadow: 0 4px 10px rgba(0,0,0,.28);
  }
  .stickySpacer{
    height: 0;                             /* animates smoothly */
    transition: height .18s ease;
    will-change: height;
  }

  .stickyBar .teamHead,
.headerGrid .teamHead {
  display: grid;              /* simple 2-row stack */
  grid-auto-flow: row;
  place-items: center;        /* center horizontally & vertically */
  text-align: center;
  padding: 4px 6px;
}
.stickyBar .teamHead .teamName,
.headerGrid .teamHead .teamName {
  padding-bottom: 12px;
  display: block;
  width: 100%;
  text-align: center;
  margin: 0;
  line-height: 1.1;
}

.stickyBar .teamHead .avatar,
.headerGrid .teamHead .avatar {
  display: block;
  margin: 0 auto 4px;
}

.headerGrid{
  display: grid;
  grid-auto-rows: var(--hdr-h);     /* use header height, not tile height */
}

.headerGrid .cell,
.stickyBar  .cell{
  height: var(--hdr-h) !important;
  overflow: hidden;                 /* nothing inside can grow the row */
}


  /* ===== board ===== */
  .board{
    width: 95%;                   /* no horizontal scroll */
    margin: 10px auto 26px;
    border-radius: 12px;
    box-shadow: 0 6px 18px rgba(0,0,0,.24);
    background: var(--surface-2, rgba(0,0,0,.45));
    overflow: visible;
  }

  .grid{ display:grid; grid-auto-rows: var(--tile-h); }

  .cell{
    position: relative;
    border-right: 2px solid rgb(0, 0, 0);
    border-bottom: 2px solid rgb(0, 0, 0);
  }
  .cell:last-child{ border-right:none; }

  /* header cells */
.teamHead{
  height: var(--hdr-h) !important;
  padding: 3px 4px;                 /* no auto padding */
  line-height: 1.05;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;                         /* tiny gap between avatar/name */
}

.teamHead .avatar{
  width: 24px;
  height: 24px;
}
  .avatar{
    height: 28px; width: 28px;
    margin: 0 0 2px;
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 999px;
    filter: drop-shadow(0 1px 1px rgba(0,0,0,.35));
    cursor: pointer;
  }
  .teamName{
    cursor: pointer;
    font-weight: 700;
    font-size: .8rem;
    line-height: 1.05;
    display: -webkit-box;       /* clamp to 2 lines */
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* left position column */
  .slot{
    display:grid; place-items:center;
    font-weight:800; font-size:.6rem;
    background: linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  }

  /* player tiles (starters) */
  .playerAvatar{
    position:absolute; left:50%; top:34%;
    transform:translate(-50%,-50%);
    height:22px; width:22px;
    background-position:center; background-repeat:no-repeat; background-size:auto 22px;
    border-radius:50%;
    filter: drop-shadow(0 1px 1px rgba(0,0,0,.35));
  }
  .name{
    position:relative; display:block;
    padding: 36px 6px 6px;
    text-align:center; line-height:1.05;
    font-size:12px;
    color: rgba(0,0,0,.9);
    white-space:normal; word-break:break-word;
    font-weight:600;
  }

  /* section bars */
  .section{
    grid-column:1 / -1; text-align:center;
    font-weight:700; letter-spacing:.3px; padding:6px 0; font-size:.85em;
    background: rgba(255,255,255,.06);
    border-bottom: 1px solid rgba(255,255,255,.22);
  }

  /* bench / IR compact */
  .bench .cell{ min-height: 40px; }
  .bench .playerAvatar{ top:26%; height:16px; width:16px; background-size:auto 16px; }
  .bench .name{ padding:30px 4px 4px; font-size:.72rem; }

  .ir .cell{ min-height: 36px; }
  .ir .playerAvatar{ top:24%; height:15px; width:15px; background-size:auto 15px; }
  .ir .name{ padding:34px 4px 4px; font-size:.70rem; }

  /* position colors */
  .prevQB{  background-color: var(--QBfade); }
  .prevWR{  background-color: var(--WRfade); }
  .prevRB{  background-color: var(--RBfade); }
  .prevTE{  background-color: var(--TEfade); }
  .prevK{   background-color: var(--Kfade); }
  .prevDEF{ background-color: var(--DEfadeFfade); }

  @media (prefers-reduced-motion: reduce) {
    .stickyWrap, .stickySpacer { transition: none; }
  }

@media (min-width: 1200px){
  :root{ --hdr-h: 56px; }           /* slightly taller header on desktop */
  .teamName{
    white-space: normal;            /* allow wrap */
    display: -webkit-box;
    -webkit-line-clamp: 2;          /* 2 lines max */
    -webkit-box-orient: vertical;
  }
}

/* --- Large tablet / phablet (portrait) ------------------------------------ */
@media (max-width: 900px) {
  .board, .stickyWrap { width: 98%; }
  :root { --hdr-h: 50px; --tile-h: 58px; }
  .teamHead { padding: 4px 2px; }
  .teamName { font-size: .76rem; -webkit-line-clamp: 1; } /* clamp team name to 1 line */
  .avatar { width: 24px; height: 24px; }
  .name { font-size: 11px; padding: 28px 4px 6px; }
  .slot { font-size: .58rem; }
}

/* --- iPad / small tablet --------------------------------------------------- */
@media (max-width: 768px) {
  :root { --hdr-h: 48px; --tile-h: 56px; }
  .avatar { width: 22px; height: 22px; }
  .name { font-size: 10.5px; padding: 26px 3px 5px; }
  .slot { font-size: .56rem; }
}

/* --- Large phones ---------------------------------------------------------- */
@media (max-width: 600px) {
  :root { --hdr-h: 46px;}
  .avatar { width: 20px; height: 20px; }
  .teamName { font-size: .74rem; }
  .name { font-size: 10px; padding: 24px 3px 5px; }
  /* slimmer dividers on very small screens */
  .cell { border-right: 1px solid rgb(0,0,0); border-bottom: 1px solid rgb(0,0,0); }
}

/* --- iPhone Pro/Max (portrait ~430) & below -------------------------------- */
@media (max-width: 480px) {
  :root { --hdr-h: 44px;}
  .teamHead .teamName { 
  display: none !important; 
}
  .avatar { width: 19px; height: 19px; }
  .name { font-size: 4.8px; padding: 33px 3px 4px; }
  .slot { font-size: .54rem; }

  .bench .cell { min-height: 36px; }
  .bench .playerAvatar { top: 25%; width: 14px; height: 14px; }
  .bench .name { font-size: 4.8px; padding: 33px 3px 4px; }

  .ir .cell { min-height: 34px; }
  .ir .playerAvatar { top: 24%; width: 13px; height: 13px; }
  .ir .name { font-size: 4.8px; padding: 33px 3px 4px; }
}

/* --- Small phones (Pixel 4a / iPhone 12 mini) ------------------------------ */
@media (max-width: 390px) {
  :root { --hdr-h: 42px;}
  .avatar { width: 19px; height: 19px; }
  .name { font-size: 4.8px; padding: 33px 3px 4px; }
  .slot { font-size: .54rem; }

  .bench .cell { min-height: 36px; }
  .bench .playerAvatar { top: 25%; width: 14px; height: 14px; }
  .bench .name { font-size: 4.8px; padding: 33px 3px 4px; }

  .ir .cell { min-height: 34px; }
  .ir .playerAvatar { top: 24%; width: 13px; height: 13px; }
  .ir .name { font-size: 4.8px; padding: 33px 3px 4px; }
}

/* --- iPhone SE (375) and narrower ----------------------------------------- */
@media (max-width: 375px) {
  :root { --hdr-h: 40px;}
  .avatar { width: 19px; height: 19px; }
  .name { font-size: 4.8px; padding: 33px 3px 4px; }
  .slot { font-size: .54rem; }

  .bench .cell { min-height: 36px; }
  .bench .playerAvatar { top: 25%; width: 14px; height: 14px; }
  .bench .name { font-size: 4.8px; padding: 33px 3px 4px; }

  .ir .cell { min-height: 34px; }
  .ir .playerAvatar { top: 24%; width: 13px; height: 13px; }
  .ir .name { font-size: 4.8px; padding: 33px 3px 4px; }
}

/* --- Ultra-narrow safety net (320) ---------------------------------------- */
@media (max-width: 320px) {
  :root { --hdr-h: 38px;}
  .avatar { width: 19px; height: 19px; }
  .name { font-size: 4.8px; padding: 33px 3px 4px; }
  .slot { font-size: .54rem; }

  .bench .cell { min-height: 36px; }
  .bench .playerAvatar { top: 25%; width: 14px; height: 14px; }
  .bench .name { font-size: 4.8px; padding: 33px 3px 4px; }

  .ir .cell { min-height: 34px; }
  .ir .playerAvatar { top: 24%; width: 13px; height: 13px; }
  .ir .name { font-size: 4.8px; padding: 33px 3px 4px; }
}
</style>

{#if rostersArray.length === 0}
  <p style="text-align:center;margin:2rem 0;opacity:.8">Rosters not available yet.</p>
{:else}
  <!-- Wrap everything so we can toggle .is-stuck and animate smoothly -->
  <div class="rostersView {showSticky ? 'is-stuck' : ''}">
    <!-- Sticky header (always rendered; fades/slides in) -->
    <div class="stickyWrap">
      <div class="stickyBar" style="grid-template-columns:{gridTemplate}">
        <div class="cell slot"></div>
        {#each draftOrder as rid}
          <div class="cell teamHead">
            <img
              class="avatar"
              src="{getAvatarFromTeamManagers(leagueTeamManagers, rid, leagueData?.season)}"
              alt="team avatar"
              on:click={() => openTeam(rid)}
            />
            <div class="teamName" on:click={() => openTeam(rid)}>
              {getTeamNameFromTeamManagers(leagueTeamManagers, rid, leagueData?.season)}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Spacer animates height to keep layout smooth when sticky shows/hides -->
    <div class="stickySpacer"></div>

    <!-- MAIN BOARD -->
    <div class="board">
      <!-- IN-GRID HEADER (sentinel for IntersectionObserver) -->
      <div class="headerGrid" style="grid-template-columns:{gridTemplate}" bind:this={headerSentinel}>

        <div class="cell slot"></div>
        {#each draftOrder as rid}
          <div class="cell teamHead">
            <img
              class="avatar"
              src="{getAvatarFromTeamManagers(leagueTeamManagers, rid, leagueData?.season)}"
              alt="team avatar"
              on:click={() => openTeam(rid)}
            />
            <div class="teamName" on:click={() => openTeam(rid)}>
              {getTeamNameFromTeamManagers(leagueTeamManagers, rid, leagueData?.season)}
            </div>
          </div>
        {/each}
      </div>

      <!-- STARTERS -->
      {#each starterSlots as _slot, i}
        <div class="grid" style="grid-template-columns:{gridTemplate}">
          <div class="cell slot">{_slot === 'WRRB_FLEX' || _slot === 'WRRBTE_FLEX' ? 'FLEX' : _slot}</div>
          {#each draftOrder as rid}
            {#if byId.get(rid) && pidAt(byId.get(rid), i)}
              <div class="cell {posOf(pidAt(byId.get(rid), i)) ? `prev${posOf(pidAt(byId.get(rid), i))}` : ''}">
                <div class="playerAvatar" style="{headshotStyle(pidAt(byId.get(rid), i))}"></div>
                <div class="name">{playerLabel(pidAt(byId.get(rid), i))}</div>
              </div>
            {:else}
              <div class="cell"></div>
            {/if}
          {/each}
        </div>
      {/each}

      <!-- BENCH -->
      {#if maxBenchRows > 0}
        <div class="section">Bench</div>
        {#each Array(maxBenchRows) as _unused, benchIdx}
          <div class="grid bench" style="grid-template-columns:{gridTemplate}">
            <div class="cell slot">BN</div>
            {#each draftOrder as rid}
              {#if benchById.get(rid) && benchById.get(rid)[benchIdx]}
                <div class="cell {posOf(benchById.get(rid)[benchIdx]) ? `prev${posOf(benchById.get(rid)[benchIdx])}` : ''}">
                  <div class="playerAvatar" style="{headshotStyle(benchById.get(rid)[benchIdx])}"></div>
                  <div class="name">{playerLabel(benchById.get(rid)[benchIdx])}</div>
                </div>
              {:else}
                <div class="cell"></div>
              {/if}
            {/each}
          </div>
        {/each}
      {/if}

      <!-- IR -->
      {#if maxIRRows > 0}
        <div class="section">Injured Reserve</div>
        {#each Array(maxIRRows) as _unused2, irIdx}
          <div class="grid ir" style="grid-template-columns:{gridTemplate}">
            <div class="cell slot">IR</div>
            {#each draftOrder as rid}
              {#if irById.get(rid) && irById.get(rid)[irIdx]}
                <div class="cell {posOf(irById.get(rid)[irIdx]) ? `prev${posOf(irById.get(rid)[irIdx])}` : ''}">
                  <div class="playerAvatar" style="{headshotStyle(irById.get(rid)[irIdx])}"></div>
                  <div class="name">{playerLabel(irById.get(rid)[irIdx])}</div>
                </div>
              {:else}
                <div class="cell"></div>
              {/if}
            {/each}
          </div>
        {/each}
      {/if}
    </div>
  </div>
{/if}
