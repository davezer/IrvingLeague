// scripts/sync-sleeper.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: 'public' } } // explicit but default
);

const SEASON = process.env.SEASON || '2025';
const LEAGUE_ID = process.env.SLEEPER_LEAGUE_ID;
if (!LEAGUE_ID) throw new Error('SLEEPER_LEAGUE_ID missing from .env');

const OUTDIR = './static/api/export';

// --- fetch helpers -----------------------------------------------------------
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return res.json();
}

async function getCurrentWeek() {
  const state = await fetchJson('https://api.sleeper.app/v1/state/nfl');
  return typeof state.week === 'number' ? state.week : 18; // offseason fallback
}

async function fetchAllTransactions(leagueId, toWeek) {
  const all = [];
  for (let w = 1; w <= toWeek; w++) {
    const url = `https://api.sleeper.app/v1/league/${leagueId}/transactions/${w}`;
    const weekTx = await fetchJson(url);
    all.push(...weekTx);
  }
  return all;
}

// --- NEW: drafts helpers -----------------------------------------------------
async function fetchDrafts(leagueId) {
  return fetchJson(`https://api.sleeper.app/v1/league/${leagueId}/drafts`);
}
async function fetchDraftPicks(draftId) {
  return fetchJson(`https://api.sleeper.app/v1/draft/${draftId}/picks`);
}
async function fetchTradedPicks(draftId) {
  // not all drafts have this; let caller handle empty array
  return fetchJson(`https://api.sleeper.app/v1/draft/${draftId}/traded_picks`);
}

async function run() {
  console.log('Syncing Sleeper League:', LEAGUE_ID);

  const currentWeek = await getCurrentWeek();

  const [league, users, rosters, transactions] = await Promise.all([
    fetchJson(`https://api.sleeper.app/v1/league/${LEAGUE_ID}`),
    fetchJson(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`),
    fetchJson(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`),
    fetchAllTransactions(LEAGUE_ID, currentWeek)
  ]);

  const avatarUrl = (id) => (id ? `https://sleepercdn.com/avatars/thumbs/${id}` : null);

  // === Managers ===
  const managers = rosters.map((r) => {
    const user = users.find((u) => u.user_id === r.owner_id);
    return {
      id: r.roster_id,
      name: user?.display_name || 'Unknown',
      team_name: user?.metadata?.team_name?.trim() || null,
      username: user?.username || null,
      display_name: user?.display_name || null,
      avatar: avatarUrl(user?.avatar) ?? null,
      user_id: user?.user_id ?? null,
      is_owner: user?.is_owner ?? null
    };
  });

  // === Trades (only completed) ===
  const trades = transactions
    .filter((tx) => tx.type === 'trade' && tx.status === 'complete')
    .map((tx) => ({
      transaction_id: tx.transaction_id,
      type: tx.type,
      status: tx.status,
      roster_ids: tx.roster_ids,
      adds: tx.adds ?? null,
      drops: tx.drops ?? null,
      draft_picks: tx.draft_picks ?? [],
      week: tx.week,
      season: SEASON
    }));

  // === Waivers ===
  const waivers = transactions
    .filter((tx) => tx.type === 'waiver' && tx.status === 'complete')
    .map((tx) => ({
      transaction_id: tx.transaction_id,
      roster_ids: tx.roster_ids,
      adds: tx.adds ?? null,
      drops: tx.drops ?? null,
      week: tx.week,
      season: SEASON
    }));

  // === Standings ===
  const standings = rosters.map((r) => {
    const managerName = managers.find((m) => m.id === r.roster_id)?.name || 'Unknown';
    return {
      id: r.roster_id,
      wins: r.settings?.wins ?? 0,
      losses: r.settings?.losses ?? 0,
      ties: r.settings?.ties ?? 0,
      fpts: r.settings?.fpts != null ? Number(r.settings.fpts) : 0,
      fpts_decimal: r.settings?.fpts_decimal != null ? Number(r.settings.fpts_decimal) : 0,
      moves: r.settings?.moves ?? 0,
      name: managerName,
      team_name: managerName, // you set this for your current schema requirement
      season: SEASON
    };
  });

  // === NEW: Drafts + Picks + Traded Picks ===================================
  const pickPlayerName = (md) =>
  md?.full_name
  || md?.player_name
  || [md?.first_name, md?.last_name].filter(Boolean).join(' ')
  || null;

const teamByRoster = new Map(managers.map(m => [Number(m.id), m.team_name || m.name || null]));
// 1) fetch the league drafts
const draftsRaw = await fetchDrafts(LEAGUE_ID);

// 2) normalize drafts so we have d.id available
const drafts = draftsRaw.map(d => ({
  id: String(d.draft_id),
  league_id: String(d.league_id ?? LEAGUE_ID),
  season: String(d.season ?? SEASON),
  status: d.status ?? null,
  type: d.type ?? null,
  rounds: Number(d.settings?.rounds ?? d.rounds ?? 0),
  sport: d.sport ?? 'nfl',
  start_time: d.start_time ? new Date(d.start_time).toISOString() : null,
  draft_order: d.draft_order ?? null,
  settings: d.settings ?? null
}));

let allPicks = [];
let allTraded = [];

if (!drafts.length) {
  console.log('(skip) no drafts for this league');
} else {
  for (const d of drafts) {
    // 3) fetch picks and traded-picks for THIS draft
    const [picksRaw, tradedRawOrErr] = await Promise.all([
      fetchDraftPicks(d.id),
      fetchTradedPicks(d.id).catch(() => [])
    ]);
    const tradedRaw = Array.isArray(tradedRawOrErr) ? tradedRawOrErr : [];

    // 4) normalize picks; stamp draft_id from the parent draft
    const picks = picksRaw.map((p, i) => ({
      draft_id: d.id,
      pick_no: Number(p.pick_no ?? (i + 1)),
      nfl_team: p.metadata?.team ?? null,
      round: Number(p.round ?? 0),
      draft_slot: Number(p.draft_slot ?? 0),
      roster_id: Number(p.roster_id ?? 0),
      picked_by: p.picked_by ?? null,
      player_id: p.player_id ?? null,
      metadata: p.metadata ?? null,
      is_keeper: Boolean(p.is_keeper ?? false),
      price: p.amount || p.price || p.metadata?.amount || null,
      pos: p.metadata?.position ?? null,


  // NEW:
  season: SEASON,
  player_name: pickPlayerName(p.metadata),
  team_name: teamByRoster.get(Number(p.roster_id ?? 0)) ?? 'Unknown'
}));


    // 5) normalize traded-picks; also stamp draft_id
    const traded = tradedRaw.map(t => ({
      draft_id: d.id,
      round: Number(t.round ?? 0),
      roster_id: Number(t.roster_id ?? 0),
      owner_id: Number(t.owner_id ?? 0),
      previous_owner_id: t.previous_owner_id != null ? Number(t.previous_owner_id) : null
    }));

    allPicks.push(...picks);
    allTraded.push(...traded);
  }
}


  // === Save as JSON ==========================================================
  await fs.mkdir(OUTDIR, { recursive: true });
  await fs.writeFile(path.join(OUTDIR, 'managers.json'), JSON.stringify(managers, null, 2));
  await fs.writeFile(path.join(OUTDIR, `trades${SEASON}.json`), JSON.stringify(trades, null, 2));
  await fs.writeFile(path.join(OUTDIR, 'waivers.json'), JSON.stringify(waivers, null, 2));
  await fs.writeFile(path.join(OUTDIR, 'standings.json'), JSON.stringify(standings, null, 2));

  // NEW
  await fs.writeFile(path.join(OUTDIR, 'drafts.json'), JSON.stringify(drafts, null, 2));
  await fs.writeFile(path.join(OUTDIR, 'draft_picks.json'), JSON.stringify(allPicks, null, 2));
  await fs.writeFile(path.join(OUTDIR, 'traded_picks.json'), JSON.stringify(allTraded, null, 2));

  // === Log counts ============================================================
  console.log({
    currentWeek,
    managersCount: managers.length,
    tradesCount: trades.length,
    waiversCount: waivers.length,
    standingsCount: standings.length,
    draftsCount: drafts.length,
    draftPicksCount: allPicks.length,
    tradedPicksCount: allTraded.length
  });

  // === Upserts with explicit error logging ==================================
  const upserts = [
    ['managers', managers, { onConflict: 'id' }],
    ['trades', trades, { onConflict: 'transaction_id' }],
    ['waivers', waivers, { onConflict: 'transaction_id' }],
    ['standings', standings, { onConflict: 'id' }],

    // NEW
    ['drafts', drafts, { onConflict: 'id' }],
    ['draft_picks', allPicks, { onConflict: 'draft_id,pick_no' }],
    ['traded_picks', allTraded, { onConflict: 'draft_id,round,roster_id,owner_id' }]
  ];

  for (const [table, rows, opts] of upserts) {
    if (!rows.length) {
      console.log(`(skip) ${table}: no rows`);
      continue;
    }
    const { error } = await supabase.from(table).upsert(rows, { ...opts, count: 'exact' });
    if (error) {
      console.error(`❌ Upsert failed for ${table}:`, error);
    } else {
      console.log(`✅ Upserted ${rows.length} rows into ${table}`);
    }
  }

  console.log('✅ Sync complete');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
