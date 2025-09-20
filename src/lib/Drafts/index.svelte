<script>
  import { waitForAll } from '$lib/utils/helper';
  import LinearProgress from '@smui/linear-progress';
  import Draft from './Draft.svelte';
  import ManagerDraftMoney from '$lib/Managers/ManagerDraftMoney.svelte';
  import { goto } from '$app/navigation';

  // Static list used to map to canonical array indexes + optional fallback render
  import { managers as leagueInfoManagers } from '$lib/utils/leagueInfo';

  export let upcomingDraftData, previousDraftsData, leagueTeamManagersData, playersData;

  /** unwrap common wrappers */
  const unwrap = (v) =>
    v && typeof v === 'object' ? (v.data ?? v.value ?? v.payload ?? v) : v;

  /** normalize managers array from many possible shapes */
  const toManagers = (src) => {
    const s = unwrap(src);

    if (Array.isArray(s)) return s;

    // typical array keys
    const arrayKeys = ['managers', 'teams', 'items', 'list', 'rows', 'result'];
    for (const k of arrayKeys) {
      if (Array.isArray(s?.[k])) return s[k];
      if (Array.isArray(s?.[k]?.data)) return s[k].data;
    }

    // map-of-objects
    const mapKeys = ['byManager', 'managersById', 'byId', 'map', 'records'];
    for (const k of mapKeys) {
      const m = s?.[k];
      if (m && typeof m === 'object' && !Array.isArray(m)) {
        const vals = Object.values(m);
        if (vals.length && typeof vals[0] === 'object') return vals;
      }
    }

    // plain object fallback
    if (s && typeof s === 'object') {
      const vals = Object.values(s);
      if (vals.length && typeof vals[0] === 'object') return vals;
    }

    return [];
  };

  /** stable key for each loop */
  const keyOf = (m, i) =>
    m?.managerID || m?.managerId || m?.id || m?.teamName || m?.name || `mgr-${i}`;

  /** add fallback from static league info list (optional) */
  const withFallback = (arr) =>
    arr && arr.length ? arr : (Array.isArray(leagueInfoManagers) ? leagueInfoManagers : []);

  /** initials if no logo */
  const initialsOf = (name = '') =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('') || 'TM';

  const same = (a = '', b = '') =>
    String(a).toLowerCase().trim() === String(b).toLowerCase().trim();

  /** resolve canonical array index for /manager?manager=<index> */
  const indexForManager = (m, iFallback = 0) => {
    if (!Array.isArray(leagueInfoManagers)) return iFallback;

    const id = m?.managerID ?? m?.managerId ?? m?.id;
    const team = m?.teamName ?? m?.name;

    // 1) match by id or by (team/name)
    const idx = leagueInfoManagers.findIndex(
      (x) =>
        (id && (x.managerID === id || x.managerId === id || x.id === id)) ||
        same(x.teamName, team) ||
        same(x.name, team)
    );
    return idx >= 0 ? idx : iFallback;
  };

  const teamPathOf = (m, i) => `/manager?manager=${indexForManager(m, i)}`;
  const onCardClick = (m, i) => goto(teamPathOf(m, i));
</script>

<style>

	.budgets :global(.draftMoneyLabel) {
  display: none !important;
}

.budgets :global(.draftMoneyAnswer) {
  margin-top: 2px;
  font-size: 16px;
  font-weight: 800;
}

.loading {
  display: block;
  width: 85%;
  max-width: 500px;
  margin: 80px auto;
  }

  h4, h6 { text-align: center; }

  /* Section header + spacing */
  .sectionTitle {
    margin: 28px auto 12px;
    text-align: center;
  }

  /* Budgets container spacing (adds side padding to avoid edge clipping) */
  .budgets--compact {
    width: 96%;
    max-width: 1200px;
    margin: 0 auto 1.25rem;
    padding: 8px 16px 0 16px;
    box-sizing: border-box;
  }

  /* ===== Desktop: exactly two rows, centered ===== */
  @media (min-width: 901px) {
    .budgetGrid {
      display: grid;
      grid-template-rows: repeat(2, auto);   /* two rows only */
      grid-auto-flow: column;                /* fill horizontally first */
      justify-content: center;               /* center all columns */
      gap: 14px 18px;                        /* row, col */
      padding: 0;
    }
    .budgetCard { width: 160px; }
  }

  /* Base card styles */
  .budgetCard {
    border: 1px solid var(--border, rgba(0,0,0,.12));
    border-radius: 12px;
    padding: 8px 10px;
    background: var(--surface, rgba(255,255,255,0.02));
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
    box-sizing: border-box;
    text-decoration: none;
    color: inherit;
    outline: none;
  }
  .budgetCard:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 12px rgba(0,0,0,.18);
    border-color: rgba(255,255,255,.18);
  }
  .budgetCard:focus-visible {
    box-shadow: 0 0 0 3px rgba(0, 160, 255, 0.45);
    border-color: rgba(0, 160, 255, 0.55);
  }

  /* Logo styles */
  .logoWrap {
    width: 44px;
    height: 44px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: radial-gradient(ellipse at 30% 30%, rgba(255,255,255,.12), rgba(255,255,255,.04));
    overflow: hidden;
  }
  .teamLogo {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 1px 1px rgba(0,0,0,.25));
  }
  .logoFallback {
    width: 44px;
    height: 44px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    font-weight: 800;
    letter-spacing: .5px;
    font-size: 14px;
    background: linear-gradient(135deg, rgba(0,136,255,.25), rgba(0,255,170,.18));
    color: rgba(255,255,255,.9);
    border: 1px solid rgba(255,255,255,.12);
  }

  /* Team name (white) + money text (scoped tweaks for ManagerDraftMoney) */
  .teamLabel {
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    line-height: 1.2;
    color: #fff;                 /* white names */
    min-height: 28px;
    display: -webkit-box;
    -webkit-line-clamp: 2;       /* truncate to 2 lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Hide the blue "Future Draft Money" label inside this section only */
  .budgets .draftMoneyLabel { display: none !important; }
  .budgetCard .draftMoneyAnswer { margin-top: 2px; font-size: 16px; font-weight: 800; }

  hr.divider {
    margin: 1.25rem auto;
    width: 92%;
    border: none;
    height: 1px;
    background: rgba(255,255,255,.12);
  }

  /* ===== Tablet & down: normal responsive grid, no edge clipping ===== */
  @media (max-width: 900px) {
    .budgetGrid {
      display: grid;
      grid-auto-flow: row;                 /* stop column fill */
      grid-template-rows: none;            /* remove forced 2 rows */
      grid-template-columns: repeat(3, minmax(0, 1fr));
      justify-content: center;
      gap: 12px;
      padding: 0 6px;                      /* keeps both columns off the edges */
      box-sizing: border-box;
    }
    .budgetCard {
      width: 100%;                         /* fluid */
      max-width: 220px;                    /* but not too wide */
      margin: 0 auto;                      /* center each card in its grid cell */
    }
    .logoWrap, .logoFallback { width: 42px; height: 42px; }
    .teamLabel { font-size: 12px; }
  }

  /* ===== Phones: 2-up ===== */
@media (max-width: 600px) {
  .budgetGrid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);   /* two per row */
    gap: 10px;
    padding: 0 8px;                          /* breathing room left/right */
    justify-items: center;                   /* center each card inside its cell */
  }

  .budgetCard {
    width: 100%;
    max-width: 180px;                        /* keeps cards from stretching too wide */
    margin: 0 auto;
  }

  .logoWrap, .logoFallback { width: 38px; height: 38px; }
  .teamLabel { font-size: 11.5px; }
  .budgetCard :global(.draftMoneyAnswer) { font-size: 15px; }
}


  /* ===== Ultra-narrow: 1-up ===== */
@media (max-width: 380px) {
  .budgetGrid {
    grid-template-columns: 1fr;   /* single column stack */
  }
}
</style>

<!-- Header is outside await so it always shows -->
<hr class="divider" />
<h4 class="sectionTitle">Future Draft Budgets</h4>

{#await waitForAll(previousDraftsData, leagueTeamManagersData, playersData) }
  <div class="loading">
    <p>Retrieving team budgets...</p>
    <br />
    <LinearProgress indeterminate />
  </div>
{:then [previousDrafts, leagueTeamManagersRaw, { players }] }
  <!-- Budgets -->
  <section class="budgets budgets--compact">
    <div class="budgetGrid">
      {#each withFallback(toManagers(leagueTeamManagersRaw)) as m, i (keyOf(m, i))}
        <a
          class="budgetCard"
          href={teamPathOf(m, i)}
          on:click|preventDefault={() => onCardClick(m, i)}
          title={(m.teamName || m.name) + ' – view team'}
        >
          {#if (m.logo || m.photo || m.image || m.avatar)}
            <div class="logoWrap">
              <img
                class="teamLogo"
                src={m.logo || m.photo || m.image || m.avatar}
                alt={(m.teamName || m.name) + ' logo'}
                loading="lazy"
              />
            </div>
          {:else}
            <div class="logoFallback" aria-hidden="true">
              {initialsOf(m.teamName || m.name)}
            </div>
          {/if}

          <div class="teamLabel" title={m.teamName || m.name}>
            {m.teamName || m.name}
          </div>

          <ManagerDraftMoney viewManager={m} />
        </a>
      {/each}
    </div>
  </section>

  <hr class="divider" />
  <h4>Previous Drafts</h4>

  {#if previousDrafts?.length}
    {#each previousDrafts as previousDraft}
      <h6>{previousDraft.year} Draft</h6>
      <Draft
        draftData={previousDraft}
        previous={true}
        leagueTeamManagers={unwrap(leagueTeamManagersRaw)}
        year={previousDraft.year}
        {players}
      />
    {/each}
  {/if}
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}
