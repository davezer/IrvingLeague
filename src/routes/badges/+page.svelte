<script>
  import NominateModal from '$lib/Nominate/NominateModal.svelte';
  export let data;

  let nominateOpen = false;
  let nominateBadge = null;

   function openNominate(badge) {
    nominateBadge = badge;
    nominateOpen = true;
  }

  let q = '';
  let showOnlyEarned = false;
  let sortBy = 'name'; // 'name' | 'count'
  const sections = data?.sections || { personas: [], weekly: [], stains: [], yearly: [], legacy: [] };

  const norm = (s) => (s || '').toString().toLowerCase().trim();
  const hasEarned = (b) => Array.isArray(b.earned) && b.earned.length > 0;
  const earnedCount = (b) => (Array.isArray(b.earned) ? b.earned.length : 0);
  const applySort = (arr) =>
    [...arr].sort((a, b) => (sortBy === 'count' ? earnedCount(b) - earnedCount(a) : a.name.localeCompare(b.name)));
  const filterBadges = (arr) => {
    const tokens = norm(q).split(/[\s,]+/).filter(Boolean);
    return applySort(
      arr.filter((b) => {
        if (showOnlyEarned && !hasEarned(b)) return false;
        if (!tokens.length) return true;
        const hay = `${b.name} ${b.definition} ${b.id} ${
          (b.earned || [])
            .map((t) => `${t.teamName} ${t.managerName} ${(t.years || []).join(' ')} ${t.season ?? ''} ${t.week ?? ''}`)
            .join(' ')
        }`.toLowerCase();
        return tokens.every((t) => hay.includes(t));
      })
    );
  };

  // Modal state
  let showModal = false;
  let activeBadge = null;

  function openBadge(badge) {
    activeBadge = badge;
    showModal = true;
  }
  function closeModal() {
    showModal = false;
    activeBadge = null;
  }

  // Helper label for earned rows
  const detailLabel = (badge, e) => {
    if (badge.type === 'legacy') {
      return e.years?.length ? `Years: ${e.years.join(', ')}` : '';
    }
    if (badge.type === 'weekly' || badge.type === 'stains') {
      const parts = [];
      if (e.season) parts.push(`${e.season}`);
      if (e.week != null) parts.push(`Week ${e.week}`);
      if (e.points != null) parts.push(`${Number(e.points).toFixed(2)} pts`);
      return parts.join(' • ');
    }
    // Add more types as needed
    return '';
  };
</script>
<div class="page-wrapper">   
<div class="actions-row actions-center">
  <button
    class="nominate-btn hero"
    on:click={() => { nominateBadge = null; nominateOpen = true; }}
  >

    <span class="stain-label">Slap A Stain On Someone</span>

    <img class="shield" src="/stains.png" alt="" />
  </button>
</div>
  
<NominateModal
  open={nominateOpen}
  badge={nominateBadge}
  on:close={() => (nominateOpen = false)}
  on:submitted={() => (nominateOpen = false)}
/>
<!-- Controls: Search and Filters -->
<!-- <div class="controls">
  <div class="search-wrap">
    <input
      class="search"
      type="text"
      placeholder="Search badges…"
      bind:value={q}
      aria-label="Search badges"
    />
    {#if q}
      <button class="clear" on:click={() => (q = '')} aria-label="Clear search">×</button>
    {/if}
  </div>
  <div class="filters">
    <label class="checkbox">
      <input type="checkbox" bind:checked={showOnlyEarned} />
      Only earned
    </label>
    <label class="select">
      Sort by:
      <select bind:value={sortBy}>
        <option value="name">Name</option>
        <option value="count">Times earned</option>
      </select>
    </label>
  </div>
</div> -->

<!-- Section: Personas -->
<section class="badge-section" id="personas">
  <h2 class="section-title">Personas</h2>
  <div class="grid">
    {#each filterBadges(sections.personas) as badge}
      <article
        class="card clickable"
        data-earned={hasEarned(badge) ? 'yes' : 'no'}
        on:click={() => openBadge(badge)}
        tabindex="0"
        on:keydown={(e)=> (e.key==='Enter'||e.key===' ') && openBadge(badge)}
      >
        <header class="card-head">
          <div class="badge-avatar">
            <img src={badge.icon} alt="" on:error={(e) => e.target.style.display = 'none'}/>
          </div>
          <div class="title-wrap">
            <h3 class="badge-name">{badge.name}</h3>
            <div class="badge-id">#{badge.id}</div>
          </div>
          <div class="earned-chip" title="Times earned">{badge.count || badge.earned?.length || 0}</div>
        </header>
        <p class="definition">{badge.definition}</p>
        <div class="earned-wrap">
          {#if hasEarned(badge)}
            <div class="logo-row" role="list">
              {#each badge.earned as t}
                <div role="listitem" class="logo-item" title={`${t.teamName} — ${t.managerName}`}>
                  <img class="team-logo" src={t.teamLogo} alt={`${t.teamName} logo`} />
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty">No teams have earned this yet.</div>
          {/if}
        </div>
      </article>
    {/each}
    {#if !filterBadges(sections.personas).length}
      <div class="empty-wide">No persona badges match your filters.</div>
    {/if}
  </div>
</section>

<!-- Section: Weekly Badges -->
<section class="badge-section" id="weekly">
  <h2 class="section-title">Weekly Badges</h2>
  <div class="grid">
    {#each filterBadges(sections.weekly) as badge}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <article
        class="card clickable"
        data-earned={hasEarned(badge) ? 'yes' : 'no'}
        on:click={() => openBadge(badge)}
        tabindex="0"
        on:keydown={(e)=> (e.key==='Enter'||e.key===' ') && openBadge(badge)}
      >
        <header class="card-head">
          <div class="badge-avatar">
            <img src={badge.icon} alt="" on:error={(e) => e.target.style.display = 'none'}/>
          </div>
          <div class="title-wrap">
            <h3 class="badge-name">{badge.name}</h3>
            <div class="badge-id">#{badge.id}</div>
          </div>
          <div class="earned-chip" title="Times earned">{badge.count || badge.earned?.length || 0}</div>
        </header>
        <p class="definition">{badge.definition}</p>
        <div class="earned-wrap">
          {#if hasEarned(badge)}
            <div class="logo-row" role="list">
              {#each badge.earned as t}
                <div role="listitem" class="logo-item" title={`${t.teamName} — ${t.managerName}`}>
                  <img class="team-logo" src={t.teamLogo} alt={`${t.teamName} logo`} />
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty">No teams have earned this yet.</div>
          {/if}
        </div>
      </article>
    {/each}
    {#if !filterBadges(sections.weekly).length}
      <div class="empty-wide">No weekly badges match your filters.</div>
    {/if}
  </div>
</section>

<section class="badge-section" id="stains">
  <h2 class="section-title">Stains</h2>
  <div class="grid">
    {#each filterBadges(sections.stains) as badge}
      <article
        class="card clickable"
        data-earned={hasEarned(badge) ? 'yes' : 'no'}
        on:click={() => openBadge(badge)}
        tabindex="0"
        on:keydown={(e)=> (e.key==='Enter'||e.key===' ') && openBadge(badge)}
      >
        <header class="card-head">
          <div class="badge-avatar">
            <img src={badge.icon} alt="" on:error={(e) => e.target.style.display = 'none'}/>
          </div>
          <div class="title-wrap">
            <h3 class="badge-name">{badge.name}</h3>
            <div class="badge-id">#{badge.id}</div>
          </div>
          <div class="earned-chip" title="Times earned">{badge.count || badge.earned?.length || 0}</div>
        </header>
        <p class="definition">{badge.definition}</p>
        <div class="earned-wrap">
          {#if hasEarned(badge)}
            <div class="logo-row" role="list">
              {#each badge.earned as t}
                <div role="listitem" class="logo-item" title={`${t.teamName} — ${t.managerName}`}>
                  <img class="team-logo" src={t.teamLogo} alt={`${t.teamName} logo`} />
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty">No teams have earned this yet.</div>
          {/if}
        </div>
      </article>
    {/each}
    {#if !filterBadges(sections.stains).length}
      <div class="empty-wide">No stains badges match your filters.</div>
    {/if}
  </div>


<!-- Section: Yearly Badges -->
<section class="badge-section" id="yearly">
  <h2 class="section-title">Yearly Badges</h2>
  <div class="grid">
    {#each filterBadges(sections.yearly) as badge}
      <article
        class="card clickable"
        data-earned={hasEarned(badge) ? 'yes' : 'no'}
        on:click={() => openBadge(badge)}
        tabindex="0"
        on:keydown={(e)=> (e.key==='Enter'||e.key===' ') && openBadge(badge)}
      >
        <header class="card-head">
          <div class="badge-avatar">
            <img src={badge.icon} alt="" on:error={(e) => e.target.style.display = 'none'}/>
          </div>
          <div class="title-wrap">
            <h3 class="badge-name">{badge.name}</h3>
            <div class="badge-id">#{badge.id}</div>
          </div>
          <div class="earned-chip" title="Times earned">{badge.count || badge.earned?.length || 0}</div>
        </header>
        <p class="definition">{badge.definition}</p>
        <div class="earned-wrap">
          {#if hasEarned(badge)}
            <div class="logo-row" role="list">
              {#each badge.earned as t}
                <div role="listitem" class="logo-item" title={`${t.teamName} — ${t.managerName}`}>
                  <img class="team-logo" src={t.teamLogo} alt={`${t.teamName} logo`} />
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty">No teams have earned this yet.</div>
          {/if}
        </div>
      </article>
    {/each}
    {#if !filterBadges(sections.yearly).length}
      <div class="empty-wide">No yearly badges match your filters.</div>
    {/if}
  </div>
</section>

<!-- Section: Legacy Badges -->
<section class="badge-section" id="legacy">
  <h2 class="section-title">Legacy Badges</h2>
  <div class="grid">
    {#each filterBadges(sections.legacy) as badge}
      <article
        class="card clickable"
        data-earned={hasEarned(badge) ? 'yes' : 'no'}
        on:click={() => openBadge(badge)}
        tabindex="0"
        on:keydown={(e)=> (e.key==='Enter'||e.key===' ') && openBadge(badge)}
      >
        <header class="card-head">
          <div class="badge-avatar">
            <img src={badge.icon} alt="" on:error={(e) => e.target.style.display = 'none'}/>
          </div>
          <div class="title-wrap">
            <h3 class="badge-name">{badge.name}</h3>
            <div class="badge-id">#{badge.id}</div>
          </div>
          <div class="earned-chip" title="Times earned">{badge.count || badge.earned?.length || 0}</div>
        </header>
        <p class="definition">{badge.definition}</p>
        <div class="earned-wrap">
          {#if hasEarned(badge)}
            <div class="logo-row" role="list">
              {#each badge.earned as t}
                <div
                  role="listitem"
                  class="logo-item"
                  title={`${t.teamName} — ${t.managerName}${t.years?.length ? ` • ${t.years.join(', ')}` : ''}`}
                >
                  <img class="team-logo" src={t.teamLogo} alt={`${t.teamName} logo`} />
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty">No teams have earned this yet.</div>
          {/if}
        </div>
      </article>
    {/each}
    {#if !filterBadges(sections.legacy).length}
      <div class="empty-wide">No legacy badges match your filters.</div>
    {/if}
  </div>
</section>
</div>

{#if showModal && activeBadge}
  <div class="modal-backdrop" on:click={closeModal} />
  <div class="modal" role="dialog" aria-modal="true" aria-label="Badge details">
    <button class="modal-close" aria-label="Close" on:click={closeModal}>×</button>

    <div class="modal-head">
      <div class="badge-avatar lg">
        <img src={activeBadge.icon} alt=""/>
      </div>
      <div class="modal-title">
        <h3>{activeBadge.name}</h3>
        <div class="muted">#{activeBadge.id}</div>
      </div>
      <div class="earned-chip">{activeBadge.count || activeBadge.earned?.length || 0}</div>
    </div>

    <p class="modal-def">{activeBadge.definition}</p>

    {#if hasEarned(activeBadge)}
      <div class="earned-list">
        {#each activeBadge.earned as e}
          <div class="earned-row">
            <img class="mini-logo" src={e.teamLogo} alt={`${e.teamName} logo`} />
            <div class="row-main">
              <div class="row-title">{e.teamName} <span class="muted">— {e.managerName}</span></div>
              {#if detailLabel(activeBadge, e)}
  <div class="row-sub muted">{detailLabel(activeBadge, e)}</div>
{/if}
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="empty">No awardees yet.</div>
    {/if}
  </div>
{/if}

<svelte:window on:keydown={(e)=> e.key === 'Escape' && closeModal()} />
<style>

:root {
  -bg:#0f1115;
  --panel:#171a21;
  --panel-2:#1e232d;
  --border:#2a2f3a;
  --muted:hsl(214, 14%, 90%);
  --chip:#232935;
  --shadow:0 6px 16px rgba(0,0,0,.45), 0 1px 0 rgba(255,255,255,.02) inset;
  --ring:#3b82f6;
}

html.light .section-title {
  color: #111;
  border-left-color: #2563eb;
}
:global(body){ background:var(--bg); color:var(--text); }

/* ===== Page layout ===== */
.page-wrapper{
  display:flex;
  flex-direction:column;
  align-items:center;
  width:min(1200px, 100% - 48px);   /* 1200px max, nice margins on small screens */
  margin-inline:auto;
}

/* ===== Section headings ===== */
.badge-section{ width:100%; margin:1.25rem 0 .75rem; }
.section-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 .6rem;
  letter-spacing: .2px;
  border-left: 3px solid var(--ring);
  padding-left: .5rem;
  opacity: .95;
}

/* Light mode only */
@media (prefers-color-scheme: light) {
  .section-title {
    color: #111; /* darker text for contrast */
    border-left-color: #2563eb; /* optional: adjust to your light theme blue */
  }
}

/* ===== Grid & cards ===== */
.grid{
  display:grid;
  gap:1rem;
  /* fixed-ish column width so the grid can center cleanly */
  grid-template-columns: repeat(auto-fit, minmax(280px, 320px));
  justify-content: center;                 /* ← centers the columns */
  width:100%;
  margin: 0 auto 2rem;                     /* center the grid block */
}
.card{
  background:var(--panel-2); border:1px solid var(--border); border-radius:1rem;
  padding:1rem; box-shadow:var(--shadow);
  display:flex; flex-direction:column; gap:.6rem;
  transition:transform .12s ease, box-shadow .12s ease, border-color .12s;
}
.card:hover{ transform:translateY(-2px); box-shadow:0 10px 22px rgba(0,0,0,.5); border-color:#364154; }
.card[data-earned="no"]{ opacity:.94; }
.card-head{
  display:grid; grid-template-columns:48px 1fr auto; gap:.75rem; align-items:center;
}
/* circular badge avatar */
.badge-avatar{
  width:48px; height:48px; border-radius:50%; border:1px solid var(--border);
  background:#0d1016; box-shadow:0 4px 10px rgba(0,0,0,.45);
  display:grid; place-items:center; overflow:hidden;
}
.badge-avatar img{ width:85%; height:85%; object-fit:contain; filter:drop-shadow(0 2px 3px rgba(0,0,0,.35)); }
.title-wrap{ min-width:0; }
.badge-name{ font-size:1.05rem; margin:0; line-height:1.15; color:var(--muted); }
.badge-id{ font-size:.78rem; color:var(--muted); }
.earned-chip{
  font-size:.85rem; padding:.2rem .55rem; border-radius:999px;
  background:var(--chip); border:1px solid var(--border); color:var(--text);
  min-width:2ch; text-align:center;
  color: hsl(214, 14%, 90%);
}
.definition{ margin:.2rem 0 .4rem; color:#ced6e3; line-height:1.35; }

/* team logos row */
.earned-wrap{ margin-top:.25rem; }
.logo-row{ display:flex; flex-wrap:wrap; gap:.5rem; }
.logo-item{
  width:38px; height:38px; border-radius:50%;
  overflow:hidden; border:1px solid var(--border); background:#0d1016;
  display:grid; place-items:center; box-shadow:0 3px 8px rgba(0,0,0,.4);
}
.team-logo{ width:100%; height:100%; object-fit:cover; }

.empty, .empty-wide{ color:var(--muted); }
.empty-wide{ grid-column:1 / -1; text-align:center; padding:2rem .5rem; }

/* clickable */
.card.clickable{ cursor:pointer; }
.card.clickable:focus{ outline:2px solid var(--ring); outline-offset:2px; }

/* ===== Modal ===== */
.modal-backdrop{
  position:fixed; inset:0; background:rgba(0,0,0,.55); backdrop-filter:blur(2px); z-index:40;
}
.modal{
  position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
  width:min(680px, 92vw); background:var(--panel-2);
  border:1px solid var(--border); border-radius:1rem;
  box-shadow:0 20px 48px rgba(0,0,0,.6); padding:1rem; z-index:50;
  color: hsl(214, 14%, 90%);
}
.modal-close{
  position:absolute; right:.6rem; top:.6rem; width:32px; height:32px; border-radius:999px;
  border:1px solid var(--border); background:var(--chip); color:var(--text); cursor:pointer;
}
.modal-head{
  display:grid; grid-template-columns:64px 1fr auto; gap:.75rem; align-items:center; margin-bottom:.25rem;
}
.badge-avatar.lg{ width:64px; height:64px; }
.modal-title h3{ margin:.1rem 0; }
.muted{ color:var(--muted); }
.modal-def{ color:#ced6e3; margin:.5rem 0 1rem; }
.earned-list{ display:flex; flex-direction:column; gap:.6rem; max-height:50vh; overflow:auto; }
.earned-row{ display:grid; grid-template-columns:36px 1fr; gap:.6rem; align-items:center; }
.mini-logo{ width:36px; height:36px; border-radius:50%; border:1px solid var(--border); object-fit:cover; background:#0d1016; }
.row-title{ font-weight:600; }
.row-sub{ font-size:.9rem; }

.actions-row{
  width:100%;
  display:flex;
  margin: 1rem 0 1.25rem;
}
.actions-row.actions-center{ justify-content:center; }

/* Big, centered pill button */
.nominate-btn{
  --btn-grad: linear-gradient(180deg, var(--panel), #12161d);
  display:inline-flex; align-items:center; justify-content:center; gap:.7rem;
  padding:.95rem 1.6rem;
  border:1px solid var(--border);
  border-radius:999px;
  background:var(--btn-grad);
  color:hsl(214, 14%, 90%);
  font-weight:550; letter-spacing:.2px;
  text-shadow:0 1px 0 rgba(0,0,0,.25);
  cursor:pointer; user-select:none;
  box-shadow: var(--shadow), 0 0 0 rgba(59,130,246,0);
  transition: border-color .15s ease, box-shadow .15s ease, transform .06s ease, background .2s ease;
  /* make it feel substantial */
  min-width: clamp(260px, 38vw, 420px);
  height: 56px;
}

.nominate-btn.hero{
  font-size: 2.1rem;
}

/* hover/focus states */
.nominate-btn:hover{
  border-color:#3a4557;
  box-shadow: var(--shadow), 0 0 0 4px rgba(59,130,246,.14);
  transform: translateY(-1px);
}
.nominate-btn:active{ transform: translateY(0); }
.nominate-btn:focus-visible{
  outline:none;
  border-color:var(--ring);
  box-shadow: var(--shadow), 0 0 0 4px rgba(59,130,246,.22);
}

/* If you prefer the shield image instead of the icon */
.nominate-btn .shield{
  width:42px; height:42px; object-fit:cover; border-radius:6px;
  box-shadow:0 1px 2px rgba(0,0,0,.35);
}

/* Smaller tweak on mobile */
@media (max-width:600px){
  .nominate-btn{ min-width: 80%; height: 52px; font-size:1.05rem; }
}

@media (max-width:430px){
  .nominate-btn.hero{ min-width: 80%; height: 52px; font-size:1.2em; }
}
</style>