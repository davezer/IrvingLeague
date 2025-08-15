<script>
  import { createEventDispatcher } from 'svelte';
  import { managers } from '$lib/utils/leagueInfo';

  export let open = false;
  export let endpoint = '/api/nominate';

  const dispatch = createEventDispatcher();

  // ------- Load weekly badges -------
  let badgeOptions = [];
  let badgesLoading = false;
  let badgesError = '';
  let selectedBadgeId = '';

  const flattenBadges = (data) => {
    const pushType = (arr = [], type) =>
      (Array.isArray(arr) ? arr : []).filter(Boolean).map((b) => ({ ...b, type }));
    const s = data?.sections || data || {};
    return [
      ...pushType(s.personas, 'personas'),
      ...pushType(s.weekly, 'weekly'),
      ...pushType(s.yearly, 'yearly'),
      ...pushType(s.legacy, 'legacy'),
      ...pushType(s.stains, 'stains'),
    ];
  };

  async function loadBadges() {
    try {
      badgesLoading = true;
      badgesError = '';
      const res = await fetch('/api/badges-index', { headers: { accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const flat = flattenBadges(json).filter(Boolean);
      badgeOptions = flat
        .filter((b) => b?.type === 'stains')
        .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''));
      selectedBadgeId ||= String(badgeOptions[0]?.id ?? '');
    } catch (e) {
      badgesError = e.message || 'Failed to load badges.';
    } finally {
      badgesLoading = false;
    }
  }

  const idOf = (b) => String(b?.id ?? '');
  $: selectedBadge = badgeOptions.find((b) => idOf(b) === String(selectedBadgeId)) ?? null;

  // ------- Teams from leagueInfo.js -------
  const teamNames = Array.from(
    new Set(
      (Array.isArray(managers) ? managers : [])
        .map((m) => m?.team ?? m?.teamName ?? m?.name ?? '')
        .filter((s) => !!s && typeof s === 'string')
    )
  ).sort((a, b) => a.localeCompare(b));
  let selectedTeam = teamNames[0] ?? '';

  // ------- Form fields & UX -------
  let evidenceUrl = '';
  let submitterTeam = teamNames[0] ?? '';
  let submitterEmail = '';
  let website = ''; // honeypot

  let sending = false;
  let sent = false;
  let error = '';

  function resetForm() {
    selectedTeam = teamNames[0] ?? '';
    evidenceUrl = '';
    submitterEmail = '';
    submitterTeam = teamNames[0] ?? '';
    website = '';
    error = '';
    sent = false;
    if (!selectedBadgeId) selectedBadgeId = '';
  }

  $: if (open) {
    resetForm();
    loadBadges();
  }

  function close() { dispatch('close'); }
  function stop(e){ e.stopPropagation(); }

  async function submit() {
    if (sending) return;
    error = '';

    if (!selectedBadgeId) { error = 'Please select a stain.'; return; }
    if (!selectedTeam)    { error = 'Please select a team.'; return; }
    if (!submitterEmail)  { error = 'Your email is required.'; return; }
    if (!submitterTeam) { error = 'Please choose your team.'; return; }

    sending = true;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          website,
          badgeId:   selectedBadge?.id,
          badgeName: selectedBadge?.name,
          badgeType: selectedBadge?.type,
          nomineeTeam: selectedTeam,
          evidenceUrl,
          submitterEmail,
          submitterTeam,
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json?.error || 'Failed to send nomination.');
      sent = true;
      dispatch('submitted', { badge: selectedBadge, team: selectedTeam });
    } catch (e) {
      error = e.message || 'Something went wrong.';
      dispatch('error', { message: error });
    } finally {
      sending = false;
    }
  }
</script>

{#if open}
  <div class="modal-backdrop" />

  <form class="modal" role="dialog" aria-modal="true" aria-label="Nominate player"
        on:click={stop} on:submit|preventDefault={submit}>

    <button class="modal-close" type="button" aria-label="Close" on:click={close}>×</button>

    <!-- Fixed header with themed icon -->
   <div class="modal-header">
  <img
    class="nominate-shield"
    src="/stains.png"
    alt="Nominate Player"
    width="56"
    height="56"
    on:error={(e) => (e.target.style.display = 'none')}
  />
  <h3 class="modal-title-text">Slap a Stain on {selectedTeam}</h3>
</div>
    <p class="blurb">
  Nominate a <b><i>Stain</i></b> for any team. We’ll review and announce winners (or losers?) on Tuesdays. 
  Please include a link or note if you have one.<br> <br>
  <i>Please note that this is meant to be a fun way to celebrate our season. Lets not abuse it. The honor system is in place. <br> <br>
  (Also note that I, Dave, can see who is actually submitting these on the backend, so please use your actual team name and email address and not someone elses to stir up shit.)</i>
</p>


    {#if sent}
      <p class="success">Thanks! Your nomination was sent.</p>
      <div class="actions end">
        <button class="btn" type="button" on:click={close}>Close</button>
      </div>
    {:else}
      <!-- Honeypot -->
      <div class="hp"><label>Website <input type="text" bind:value={website} tabindex="-1" autocomplete="off" /></label></div>

      {#if badgesLoading}
        <p class="muted">Loading weekly badges…</p>
      {:else if badgesError}
        <p class="error">Couldn’t load badges: {badgesError}</p>
      {/if}

      <div class="form-grid" aria-busy={badgesLoading}>
        <!-- Weekly badge (name only) -->
        <label class="row wide">
          <span class="lab">Stains</span>
          <select class="input select" bind:value={selectedBadgeId} required disabled={badgesLoading || !!badgesError}>
            <option value="" disabled selected={!selectedBadgeId}>Select a weekly badge…</option>
            {#each badgeOptions as b}
               <option value={idOf(b)} title={b?.definition || ''}>{b?.name}</option>
            {/each}
          </select>
          {#if selectedBadge}
  <div class="badge-preview" aria-live="polite">
    <img class="bp-icon" src={selectedBadge.icon} alt="" on:error={(e)=> e.target.style.display='none'} />
    <div class="bp-body">
      <div class="bp-name">{selectedBadge.name}</div>
      {#if selectedBadge.definition}
        <div class="bp-def">{selectedBadge.definition}</div>
      {/if}
    </div>
  </div>
{/if}
        </label>

        <!-- Team -->
        <label class="row wide">
          <span class="lab">Team</span>
          <select class="input select" bind:value={selectedTeam} required>
            {#each teamNames as name}
              <option value={name}>{name}</option>
            {/each}
          </select>
        </label>

        <!-- Evidence URL -->
        <label class="row wide">
  <span class="lab">Evidence / Link </span>
  <input
    class="input"
    type="text"             
    bind:value={evidenceUrl}
    placeholder="URL or note to screenshot, box score, etc."
    inputmode="url"
  />
</label>

        <div class="divider wide"></div>

        <!-- Submitter -->
        <label class="row">
  <span class="lab">Your team</span>
  <select class="input select" bind:value={submitterTeam} required>
    {#each teamNames as name}
      <option value={name}>{name}</option>
    {/each}
  </select>
</label>

        <label class="row">
          <span class="lab">Your email</span>
          <input class="input" type="email" bind:value={submitterEmail} required />
        </label>
      </div>

      {#if error}<p class="error">{error}</p>{/if}

      <div class="actions end">
        <button class="btn" type="button" on:click={close}>Cancel</button>
        <button class="btn primary" type="submit" disabled={sending || !selectedBadgeId || !selectedTeam || badgesLoading}>
          {sending ? 'Sending…' : 'Submit nomination'}
        </button>
      </div>
    {/if}
  </form>


{/if}
  <svelte:window on:keydown={(e)=> e.key === 'Escape' && close()} />
<style>

  :global(.modal-backdrop){ position:fixed; inset:0; background:rgba(0,0,0,.55); backdrop-filter:blur(2px); z-index:40; }
  .modal{
    position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
    width:min(680px,92vw); background:var(--panel-2);
    border:1px solid var(--border); border-radius:1rem; box-shadow:0 20px 48px rgba(0,0,0,.6);
    padding:1rem; z-index:50;
    color: hsl(214, 14%, 90%);
  }
  .modal-close{
    position:absolute; right:.6rem; top:.6rem; width:32px; height:32px; border-radius:999px;
    border:1px solid var(--border); background:var(--chip); color:var(--text); cursor:pointer;
  }

  /* Larger header + themed icon */
  .modal-head.simple{ display:flex; align-items:center; gap:.6rem; margin-bottom:.6rem; }
  .nominate-icon{
    width:40px; height:40px; border-radius:999px;
    display:grid; place-items:center;
    background:linear-gradient(180deg, #0d1016, #12161d);
    border:1px solid var(--border);
    box-shadow:0 4px 10px rgba(0,0,0,.45);
  }
  .modal-title h3{ margin:.1rem 0; font-size:1.4rem; letter-spacing:.2px; }

  .muted{ color:var(--muted); }

  /* Dark themed inputs + selects */
  .form-grid{ display:grid; grid-template-columns:1fr 1fr; gap:.6rem; }
  .row{ display:flex; flex-direction:column; gap:.3rem; }
  .wide{ grid-column:1 / -1; }
  .lab{ font-size:.9rem; color:var(--muted); }
  .input{
    padding:.6rem .9rem; border:1px solid var(--border); border-radius:.6rem;
    background:linear-gradient(180deg, var(--panel), #12161d); color:var(--text);
    box-shadow:0 1px 0 rgba(255,255,255,.03) inset, 0 4px 10px rgba(0,0,0,.25) inset;
  }
  .input::placeholder{ color:var(--muted); opacity:.9; }
  .input:focus{ outline:none; border-color:var(--ring); box-shadow:0 0 0 3px rgba(59,130,246,.22), 0 4px 10px rgba(0,0,0,.25) inset; }

  /* Themed select with arrow INSIDE */
  .select{
    appearance:none; -webkit-appearance:none; -moz-appearance:none;
    padding-right:2.2rem; cursor:pointer;
    color-scheme: dark;                 /* hint UA to darken the popup */
    background-image:
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="%23a3adbc"><path d="M7 10l5 5 5-5z"/></svg>');
    background-repeat:no-repeat;
    background-position: right .6rem center;
    background-size:14px 14px;
  }
  .select:disabled{ opacity:.6; cursor:not-allowed; }
  /* Try to darken the dropdown list itself (support varies by browser) */
  .select option{
    background: var(--panel-2);
    color: var(--text);
  }

  .divider{ height:1px; background:var(--border); margin:.2rem 0 .2rem; opacity:.8; }
  .actions{ display:flex; gap:.5rem; margin-top:.6rem; }
  .end{ justify-content:flex-end; }

  .btn{
    padding:.45rem .8rem; border:1px solid var(--border); border-radius:.6rem;
    background:var(--chip); color:var(--text); cursor:pointer; box-shadow:var(--shadow);
  }
  .btn:hover{ border-color:#3a4557; }
  .btn.primary{ background:linear-gradient(180deg,#30415f,#24324a); border-color:#3b4b6a; }

  .error{ color:#ff9aa2; }
  .success{ color:#7dffa7; }

  .modal-head.simple{
  display:flex; align-items:center; gap:.75rem; margin-bottom:.75rem;
}
.modal-title h3{
  margin:.1rem 0; font-size:1.55rem; letter-spacing:.2px;
}

.nominate-shield{
  width:64px; height:64px; border-radius:12px; /* soft corners to match your theme */
  background:#0d1016;
  border:1px solid var(--border);
  box-shadow:0 4px 10px rgba(0,0,0,.45);
  object-fit:cover;
  image-rendering:auto;
}
.blurb{
  color: var(--muted);
  font-size: .95rem;
  line-height: 1.35;
  margin: .25rem 0 .9rem;
}
.blurb b{ color: var(--text); opacity:.95; }

.lab .optional{
  font-weight: 500;
  color: var(--muted);
  opacity: .9;
  margin-left: .25rem;
  font-size: .9em;
}

.modal-header{
  display:flex; align-items:center; gap:.75rem;
  padding-bottom:.6rem; margin-bottom:.6rem;
  border-bottom:1px solid var(--border);
}
.modal-title-text{
  margin:0; font-size:1.5rem; letter-spacing:.2px;
}
.nominate-shield{
  width:56px; height:56px; border-radius:12px;
  background:#0d1016; border:1px solid var(--border);
  box-shadow:0 4px 10px rgba(0,0,0,.45); object-fit:cover;
}

.blurb{
  color: var(--muted);
  font-size: .95rem;
  line-height: 1.35;
  margin: .25rem 0 .9rem;
}
.blurb b{ color: var(--text); opacity:.95; }

.badge-preview{
  display:flex; gap:.6rem; align-items:flex-start;
  margin:.35rem 0 .5rem; padding:.55rem .6rem;
  border:1px solid var(--border); border-radius:.6rem;
  background:linear-gradient(180deg, var(--panel), #12161d);
}
.bp-icon{ width:36px; height:36px; border-radius:8px; object-fit:cover; border:1px solid var(--border); }
.bp-body{ display:flex; flex-direction:column; gap:.15rem; }
.bp-name{ font-weight:700; line-height:1.1; }
.bp-def{ color:var(--muted); line-height:1.25; }

/* Small screens */
@media (max-width:560px){
  .nominate-shield{ width:52px; height:52px; border-radius:10px; }
  .modal-title h3{ font-size:1.35rem; }
}

  .hp{ position:absolute; left:-9999px; width:1px; height:1px; overflow:hidden; }
</style>
