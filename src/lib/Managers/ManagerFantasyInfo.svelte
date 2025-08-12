<script>
  /* ===== Props ===== */
  export let viewManager = {};
  export let changeManager; // (idOrLink) => void
  export let byManager = {}; // { [managerID]: { personas, weekly, yearly, legacy } }
  export let sections = { personas: [], weekly: [], yearly: [], legacy: [] };
  export let champYears = []; // optional override

  /* ===== Helpers ===== */
  const idOf = (m) => String(m?.managerID ?? m?.managerId ?? m?.id ?? '').trim();
  const personaTitle = (t) => String(t || '').replace(/^persona:\s*/i, '').trim();
  const normId = (id) => String(id ?? '').replace(/^#/, '');

  // prefer exact map key; accept numeric-string alternate (e.g., "7" vs 7)
  function pickMine(map, id) {
    if (!map || !id) return null;
    if (map[id]) return map[id];
    const alt = String(Number(id));
    if (map[alt]) return map[alt];
    return null;
  }

  const extractPoints = (b) => {
    for (const k of ['points','pts','score','totalPoints','pointsFor','pf','weeklyPoints','weekPoints','week_total','total']) {
      const v = b?.[k];
      if (v != null && v !== '') return Number(v);
    }
    return null;
  };
  const fmtPts   = (p) => p == null || Number.isNaN(p) ? '' : `${Number(p).toFixed(2)} pts`;
  const occLabel = (o) => [o.season, o.week != null ? `Wk ${o.week}` : '', o.points != null ? fmtPts(o.points) : ''].filter(Boolean).join(' • ');
  const sortOcc  = (a, b) => (b.season ?? 0) - (a.season ?? 0) || (b.week ?? 0) - (a.week ?? 0);

  const groupWeekly = (arr = []) => {
    const map = new Map();
    for (const b of arr) {
      const key = (b.badgeId && String(b.badgeId)) || `${b.badgeName || b.title}|${b.icon || ''}`;
      if (!map.has(key)) {
        map.set(key, {
          id: b.badgeId ? String(b.badgeId) : null,
          icon: b.icon || null,
          title: b.badgeName || b.title || 'Weekly Badge',
          occurrences: []
        });
      }
      map.get(key).occurrences.push({
        season: b.season ?? null,
        week: b.week ?? null,
        points: extractPoints(b)
      });
    }
    return [...map.values()];
  };

  const parseYears = (val) =>
    Array.isArray(val) ? val.map(String)
    : String(val ?? '').split(/[,\s]+/).map(s => s.trim()).filter(Boolean);

  const otherLegacyLabel = (b) => {
    if (Array.isArray(b?.years) && b.years.length) return b.years.map(String).join(', ');
    if (b?.year != null) return String(b.year);
    return '';
  };

  /* ===== Reactive shaping ===== */
  // derive the manager id we want to show
  $: currentId = idOf(viewManager);

  // pull this manager’s record by map key only
  const empty = { personas: [], weekly: [], yearly: [], legacy: [] };
  $: mineRaw     = pickMine(byManager, currentId);
  $: loadingMine = !currentId || !mineRaw;

  $: mine = loadingMine ? empty : {
    personas: Array.isArray(mineRaw.personas) ? mineRaw.personas : [],
    weekly:   Array.isArray(mineRaw.weekly)   ? mineRaw.weekly   : [],
    yearly:   Array.isArray(mineRaw.yearly)   ? mineRaw.yearly   : [],
    legacy:   Array.isArray(mineRaw.legacy)   ? mineRaw.legacy   : []
  };

  /* Definitions (for icon/definition lookups) */
  $: allDefs = [
    ...(sections.personas ?? []),
    ...(sections.weekly ?? []),
    ...(sections.yearly ?? []),
    ...(sections.legacy ?? [])
  ];
  $: defById = new Map(allDefs.map((b) => [normId(b.id), { name: b.name, definition: b.definition, icon: b.icon }]));

  /* Years of Service tiles (10/20) */
  $: yearsItems = (mine.yearly ?? []).map((y) => {
    const yrs = Number(y.years ?? 0);
    const threshold = yrs >= 20 ? 20 : 10;
    const icon = threshold === 20 ? '/Twenty.png' : '/Ten.png';
    return { icon, title: `${threshold} Years`, years: yrs, badgeId: y.badgeId, badgeName: y.badgeName };
  });

  /* Weekly (grouped) */
  $: weeklyGrouped = groupWeekly(mine.weekly ?? []);

  /* Championships (legacy) */
  const isChampionLegacy = (b) => {
    const nm  = (b?.badgeName || b?.title || '').toLowerCase();
    const id  = String(b?.badgeId ?? '').toLowerCase();
    const def = b?.badgeId ? defById.get(normId(b.badgeId)) : null;
    const dn  = (def?.name || '').toLowerCase();
    return /champ|title|trophy/.test(nm) || /champ/.test(id) || /champ|title|trophy/.test(dn);
  };
  $: legacyChampion = (mine.legacy ?? []).filter(isChampionLegacy);
  $: legacyOther    = (mine.legacy ?? []).filter((b) => !isChampionLegacy(b));


/* ✅ Only use current manager data; never the external prop */
let champYearsEff = [];
$: {
  if (loadingMine) {
    champYearsEff = [];
  } else {
    const fromView = parseYears(viewManager?.championship?.years);
    const fromLegacy = [...new Set(
      legacyChampion.flatMap(b => {
        const acc = [];
        if (Array.isArray(b.years)) acc.push(...b.years);
        if (b.year != null) acc.push(b.year);
        return acc;
      }).map(String)
    )].sort((a,b) => Number(a) - Number(b));

    champYearsEff = fromView.length ? fromView : fromLegacy;
  }
}

/* Build the tile only when we actually have a champion badge */
$: champTile = (() => {
  if (!legacyChampion.length) return null;
  const first = legacyChampion[0];
  const meta = first.badgeId ? defById.get(normId(first.badgeId)) : null;
  return {
    icon: first.icon || meta?.icon,
    title: first.badgeName || first.title || meta?.name || 'Champion',
    years: champYearsEff
  };
})();

  /* Modal state */
  let showModal = false;
  let active = null;

  const openFromPersona = (p) => {
    const id = p.badgeId ? normId(p.badgeId) : null;
    const meta = id ? defById.get(id) : null;
    active = { id, title: personaTitle(p.badgeName || p.title || meta?.name || 'Persona'), icon: p.icon || meta?.icon, definition: meta?.definition || '', rows: [] };
    showModal = true;
  };
  const openFromYearly = (y) => {
    const id = y.badgeId ? normId(y.badgeId) : null;
    const meta = id ? defById.get(id) : null;
    active = { id, title: y.badgeName || meta?.name || 'Years of Service', icon: y.years >= 20 ? '/Twenty.png' : '/Ten.png', definition: meta?.definition || '', rows: y.years ? [{ label: `${y.years} Years` }] : [] };
    showModal = true;
  };
  const openFromWeeklyGroup = (g) => {
    const id = g.id ? normId(g.id) : null;
    const meta = id ? defById.get(id) : null;
    const occs = [...g.occurrences].sort(sortOcc);
    active = { id, title: g.title || meta?.name || 'Weekly Badge', icon: g.icon || meta?.icon, definition: meta?.definition || '', rows: occs.map((o) => ({ label: occLabel(o) })) };
    showModal = true;
  };
  const openFromLegacy = (b) => {
    const id = b.badgeId ? normId(b.badgeId) : null;
    const meta = id ? defById.get(id) : null;
    const label = otherLegacyLabel(b);
    active = { id, title: b.badgeName || b.title || meta?.name || 'Legacy', icon: b.icon || meta?.icon, definition: meta?.definition || '', rows: label ? [{ label }] : [] };
    showModal = true;
  };
  const closeModal = () => { showModal = false; active = null; };

  // close modal on manager switch
  $: if (currentId) { showModal = false; active = null; }

  // rival data
  $: rivalInfo = ({ name: viewManager?.rival?.name, image: viewManager?.rival?.image, link: viewManager?.rival?.link });
</script>

{#key currentId}
  {#if loadingMine}
    <div class="fantasyInfos" style="min-height:120px"></div>
  {:else}
    <div class="fantasyInfos">
      {#if mine.personas.length}
        <div class="infoSlot">
          <div class="infoLabel">Persona</div>
          <div class="badgesRow">
            {#each mine.personas as p}
              <div class="badge-card clickable" on:click={() => openFromPersona(p)}>
                <div class="badge-ring"><img src={p.icon} alt={personaTitle(p.badgeName || p.title)} /></div>
                <div class="badge-title">{personaTitle(p.badgeName || p.title)}</div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if yearsItems.length}
        <div class="infoSlot">
          <div class="infoLabel">Years of Service</div>
          <div class="badgesRow">
            {#each yearsItems as y}
              <div class="badge-card clickable" on:click={() => openFromYearly(y)}>
                <div class="badge-ring"><img src={y.icon} alt={y.title} /></div>
                <div class="badge-title">{y.title}</div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      {#if weeklyGrouped.length}
        {#each weeklyGrouped as g, i}
          <div class="infoSlot">
            {#if i === 0}
              <div class="infoLabel">Weekly Badges</div>
            {:else}
              <div class="infoLabel label-spacer" aria-hidden="true"></div>
            {/if}
            <div class="badgesRow">
              <div class="badge-card clickable" on:click={() => openFromWeeklyGroup(g)}>
                <div class="badge-ring has-counter">
                  <img src={g.icon} alt={g.title} />
                  {#if g.occurrences.length > 1}
                    <span class="badge-counter">{g.occurrences.length}</span>
                  {/if}
                </div>
                <div class="badge-title">{g.title}</div>
                {#if g.occurrences.length}
                  <div class="occ-latest">{occLabel([...g.occurrences].sort(sortOcc)[0])}</div>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      {/if}

     {#if champTile && champTile.years?.length}
        <div class="infoSlot">
          <div class="infoLabel">Championships (Legacy)</div>
          <div class="badgesRow">
            <div class="badge-card">
              <div class="badge-ring"><img src={champTile.icon} alt={champTile.title} /></div>
              <div class="badge-title">{champTile.title}</div>
              <div class="badge-subtitle">{champTile.years.join(', ')}</div>
            </div>
          </div>
        </div>
    {/if}

      {#if legacyOther.length}
        <div class="infoSlot">
          <div class="infoLabel">Legacy</div>
          <div class="badgesRow">
            {#each legacyOther as b}
              <div class="badge-card clickable" on:click={() => openFromLegacy(b)}>
                <div class="badge-ring"><img src={b.icon} alt={b.title} /></div>
                <div class="badge-title">{b.title}</div>
                {#if otherLegacyLabel(b)}
                  <div class="badge-subtitle">{otherLegacyLabel(b)}</div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <button type="button" class="infoSlot infoRival clickable" on:click={() => changeManager(rivalInfo.link)}>
        <div class="infoLabel">Rival</div>
        <div class="infoIcon"><img class="rival" src={rivalInfo.image} alt="rival" /></div>
        <div class="badge-title">{rivalInfo.name}</div>
      </button>
    </div>
  {/if}
{/key}

{#if showModal && active}
  <div class="modal-backdrop" on:click={closeModal} />
  <div class="modal" role="dialog" aria-modal="true" aria-label="Badge details">
    <button class="modal-close" aria-label="Close" on:click={closeModal}>×</button>
    <div class="modal-head">
      <div class="badge-avatar lg"><img src={active.icon} alt="" /></div>
      <div class="modal-title">
        <h3>{active.title}</h3>
        {#if active.id}<div class="muted">#{active.id}</div>{/if}
      </div>
    </div>
    {#if active.definition}<p class="modal-def">{active.definition}</p>{/if}
    {#if active.rows?.length}
      <div class="earned-list">
        {#each active.rows as r}
          <div class="earned-row"><div class="row-sub muted">{r.label}</div></div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<svelte:window on:keydown={(e)=> e.key === 'Escape' && closeModal()} />
<style>
/* ===== Outer layout ===== */
.fantasyInfos{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 2.5rem;
  align-items: start;
  justify-content: center;
  justify-items: center;
  padding: 1.5rem 0 2rem;
  margin: 3em 0 4em;
  border-top: 1px solid var(--aaa);
  border-bottom: 1px solid var(--aaa);
  box-shadow: 0 0 8px 4px var(--ccc);
}
.infoSlot{
  display:flex; flex-direction:column; align-items:center; text-align:center;
  margin:0; width:100%; max-width:220px;
}
.infoLabel{
  font-size: 15px; color: var(--blueOne); font-weight: 700;
  margin-bottom: .75em; line-height: 1.2;
}
.label-spacer{ visibility: hidden; }

/* ===== Rows of badges ===== */
.infoSlot .badgesRow{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 1rem 1.25rem;
  justify-items: center;
  overflow: visible;
}
.badgesRow .badge-card{ width:110px; }

/* ===== Cards & ring ===== */
.badge-card{ display:flex; flex-direction:column; align-items:center; text-align:center; }
.badge-ring{
  width:76px; height:76px; border-radius:50%; padding:3px; background:#0e0e0e;
  box-shadow:0 0 0 1px rgba(255,255,255,.06) inset, 0 3px 10px rgba(0,0,0,.6);
  display:flex; align-items:center; justify-content:center; position:relative;
}
.badge-ring img{
  width:70px; height:70px; border-radius:50%; object-fit:cover; background:#0a0a0a;
  box-shadow:0 0 0 2px #1ea0ff, 0 6px 16px rgba(0,0,0,.45);
}
.badge-title{ margin-top:.5rem; color: var(--text, #e8ecf2); line-height:1.15; font-weight:700; }
.badge-subtitle{ margin-top:.15rem; color: var(--muted, #b6c2d0); }

/* Weekly counter chip */
.badge-ring.has-counter{ position:relative; }
.badge-counter{
  position:absolute; right:-2px; bottom:-2px;
  min-width:22px; height:22px; padding:0 .35rem;
  border-radius:999px; background:#0f172a; color:#e8ecf2;
  border:1px solid rgba(255,255,255,.18);
  font-size:12px; font-weight:700; line-height:20px; text-align:center;
  box-shadow:0 4px 10px rgba(0,0,0,.45);
}

.occ-latest { margin-top:.25rem; color:var(--muted,#b6c2d0); }

/* Rival as a grid item */
.clickable{ cursor:pointer; }
.infoRival{
  all:unset;
  display:flex; flex-direction:column; align-items:center;
  justify-self:center; width:100%; max-width:220px; cursor:pointer;
}
.infoIcon{
  display:inline-flex; height:70px; width:70px; justify-content:center; align-items:center;
  border-radius:50%; border:1px solid var(--ccc); overflow:hidden; background:var(--fff);
  transition: box-shadow .4s; box-shadow:0 0 0 2px #1ea0ff, 0 6px 16px rgba(0,0,0,.45);
}
.infoRival:hover .infoIcon, .infoRival:focus .infoIcon{ box-shadow:0 0 6px 4px var(--aaa); border:1px solid var(--aaa); }
.rival{ height:100%; }

/* Modal */
.modal-backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.55); backdrop-filter:blur(2px); z-index:40; }
.modal{
  position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
  width:min(680px, 92vw); background:var(--panel-2,#1e232d);
  border:1px solid var(--border,#2a2f3a); border-radius:1rem;
  box-shadow:0 20px 48px rgba(0,0,0,.6); padding:1rem; z-index:50;
}
.modal-close{
  position:absolute; right:.6rem; top:.6rem; width:32px; height:32px; border-radius:999px;
  border:1px solid var(--border); background:var(--chip,#232935); color:var(--text,#e8ecf2); cursor:pointer;
}
.modal-head{ display:grid; grid-template-columns:64px 1fr; gap:.75rem; align-items:center; margin-bottom:.25rem; }
.badge-avatar.lg{ width:64px; height:64px; border-radius:50%; overflow:hidden; }
.badge-avatar.lg img{ width:100%; height:100%; object-fit:cover; }
.modal-title h3{ margin:.1rem 0; }
.muted{ color:var(--muted,#a3adbc); }
.modal-def{ color:#ced6e3; margin:.5rem 0 1rem; }
.earned-list{ display:flex; flex-direction:column; gap:.4rem; max-height:50vh; overflow:auto; }
.earned-row{ display:block; }

/* Responsive columns */
@media (max-width: 1100px){ .fantasyInfos{ grid-template-columns: repeat(3, minmax(140px, 1fr)); } }
@media (max-width: 780px){  .fantasyInfos{ grid-template-columns: repeat(2, minmax(140px, 1fr)); } }
@media (max-width: 480px){
  .fantasyInfos{
    grid-template-columns: repeat(2, 160px);
    gap: 14px 12px;
    width: max-content;
    margin-left: auto; margin-right: auto;
    justify-items: center; align-items: start;
    box-shadow: none !important; border: none !important; background: transparent !important;
  }
  .infoSlot{ max-width: none; }
  .badgesRow .badge-card{ width: auto; }
}
@media (max-width: 360px) { .fantasyInfos { grid-template-columns: 1fr; } }
</style>
