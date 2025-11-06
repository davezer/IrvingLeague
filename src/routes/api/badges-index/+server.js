// src/routes/api/badges-index/+server.js
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { managers, leagueName } from '$lib/utils/leagueInfo';
import { SUPABASE_URL as SUPABASE_URL_STATIC, SUPABASE_SERVICE_ROLE_KEY as SUPABASE_SERVICE_ROLE_KEY_STATIC } from '$env/static/private';
import { env } from '$env/dynamic/private';

// -------- Persona definitions
const personaDefs = {
  'The Wolf': 'Max Chaos. Always pouncing on the possibilities.',
  'The Littlefinger': 'The Schemer. Edges found in backchannels and fine print.',
  'The Flacco': 'Steady and unflashy until it’s time to sling it deep and steal a week.',
  'The Kornacki': 'Data first tactician. Charts, trends, and probability trees all the way.'
};

// -------- League descriptions factory
const leagueDefs = (lname) => ({
  Irving: `Winner of the historic Irving League—merged into ${lname}.`,
  DTSP: `Champion of DTSP—legacy honors recognized in ${lname}.`
});

// -------- Helpers
const slugify = (s) =>
  String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const THIS_YEAR = new Date().getFullYear();

const toInt = (v, fallback = null) => {
  if (v === undefined || v === null) return fallback;
  const n = Number(String(v).trim());
  return Number.isInteger(n) ? n : fallback;
};

function getStartYear(m) {
  const candidates = [
    toInt(m?.startYear),
    toInt(m?.joinYear),
    toInt(m?.since),
    toInt(m?.fantasyStart)
  ].filter(Boolean);
  const champYears = String(m?.championship?.years || '')
    .split(',')
    .map((y) => toInt(y))
    .filter(Boolean);
  if (champYears.length) candidates.push(Math.min(...champYears));
  return candidates.length ? Math.min(...candidates) : null;
}

const tenureFromStart = (start, now = THIS_YEAR) => (!start ? 0 : Math.max(0, now - start));

// -------- Supabase (create once at module scope)
// Prefer dynamic env at runtime; fall back to static if present (local/dev).
const SUPABASE_URL =
  env.SUPABASE_URL || SUPABASE_URL_STATIC || '';
const SUPABASE_SERVICE_ROLE_KEY =
  env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY_STATIC || '';

const supabaseAdmin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;

export async function GET({ url }) {
  const debug = url.searchParams.get('debug') === '1';

  // Quick env visibility
  if (debug) {
    console.log('badges-index env check', {
      hasUrl: !!SUPABASE_URL,
      keyLen: SUPABASE_SERVICE_ROLE_KEY?.length || 0
    });
  }

  const list = Array.isArray(managers) ? managers : [];

  // -------- Personas
  const personaMap = new Map();
  for (const m of list) {
    const p = m?.persona?.trim();
    if (!p) continue;
    if (!personaMap.has(p)) personaMap.set(p, []);
    personaMap.get(p).push(m);
  }
  const personaBadges = [...personaMap.entries()].map(([p, ms]) => ({
    id: `persona-${slugify(p)}`,
    type: 'persona',
    name: `${p}`,
    definition: personaDefs[p] || `Managers with the “${p}” persona.`,
    icon: `/${p}.png`,
    earned: ms.map((m) => ({
      managerId: m.managerID,
      managerName: m.name,
      teamName: m.teamName,
      teamLogo: m.photo
    }))
  }));

  // -------- Base badge lists
  const weeklyBadges = [
    { id: 'ides', type: 'weekly', name: 'The Ides', definition: 'Awarded for being the highest scoring loser of the week. You loser.', icon: '/ides.png', earned: [] },
    { id: 'bde',  type: 'weekly', name: 'BDE',      definition: 'Awarded to the highest scoring team of the week.', icon: '/bde.png', earned: [] },
    { id: 'hbk',  type: 'weekly', name: 'The HBK',  definition: 'You lost by 1.0 or less.', icon: '/heartbreaker.png', earned: [] }
  ];

  const luckBadges = [
    { id: 'doyle',   type: 'luck', name: 'The Doyle',   definition: 'Luckiest Week (includes Parlays)', icon: '/doyle.png', earned: [] },
    { id: 'lowblow', type: 'luck', name: 'The Low Blow',definition: 'Unluckiest Week (includes Parlays)', icon: '/lowblow.png', earned: [] }
  ];

  const stainsBadges = [
    { id: 'suck',      type: 'stains', name: 'The Sucko',         definition: 'Awarded to the lowest scoring team of the week.', icon: '/stains.png', earned: [] },
    { id: 'byebye',    type: 'stains', name: 'The Bye Bye Bye',   definition: 'You left a bye week player in your starting lineup.', icon: '/stains.png', earned: [] },
    { id: 'zerohour',  type: 'stains', name: 'The Zero Hour',     definition: 'You started a player who scored Zero Points.', icon: '/stains.png', earned: [] },
    { id: 'captain',   type: 'stains', name: "The Cap'n Hindsight", definition: 'You left the game winning player on your bench.', icon: '/stains.png', earned: [] },
    { id: 'traderape', type: 'stains', name: 'The Trade Rape',    definition: 'You transacted a TERRIBLE trade.', icon: '/stains.png', earned: [] },
    { id: 'badbeat',   type: 'stains', name: 'The Bad Beat',      definition: 'GM explains why his Opponent’s victory is stain-worthy', icon: '/stains.png', earned: [] }
  ];

  // -------- manager index for lookups (used later too)
  const byId = Object.fromEntries(list.map((m) => [m.managerID, m]));

  // -------- award helper
  function awardWeekly({
    badgeId,
    managerId,
    season,
    week,
    points,
    opponent,
    opponentPoints,
    explanation,
    nominatedBy
  }) {
    const badge =
      weeklyBadges.find((b) => b.id === badgeId) ||
      stainsBadges.find((b) => b.id === badgeId) ||
      luckBadges.find((b) => b.id === badgeId);

    const m = byId[managerId];
    if (!badge || !m) return;

    badge.earned.push({
      managerId,
      managerName: m?.name ?? null,
      teamName: m?.teamName ?? null,
      teamLogo: m?.photo ?? null,
      season: season ?? null,
      week: week ?? null,
      opponent: opponent ?? null,
      explanation: explanation ?? null,
      nominatedBy: nominatedBy ?? null,
      ...(points != null ? { points } : {}),
      ...(opponentPoints != null ? { opponentPoints } : {})
    });
  }

  // -------- Load awards from Supabase
  const DEFAULT_SEASON = THIS_YEAR;
  const seasonParam = url.searchParams.get('season');
  const weekParam = url.searchParams.get('week');

  const seasonQ = toInt(seasonParam, DEFAULT_SEASON);
  const weekQ = toInt(weekParam, null);

  let rows = [];
  let readError = null;

  if (!supabaseAdmin) {
    readError = new Error('Supabase admin client not configured (missing URL or SERVICE_ROLE key).');
  } else {
    let q = supabaseAdmin.from('awards').select('*').eq('season', seasonQ);
    if (weekQ !== null) q = q.eq('week', weekQ);
    const { data, error } = await q;
    rows = data || [];
    readError = error || null;
  }

  // -------- Optional debug: single consolidated response
  if (debug) {
    const sample = (rows || []).slice(0, 5).map(r => ({
      badge_id: r.badge_id,
      manager_id: r.manager_id,
      season: r.season,
      week: r.week,
      points: r.points,
      opponent: r.opponent,
      opponent_points: r.opponent_points,
      explanation: r.explanation
    }));

    const missingManagerIds = (rows || [])
      .filter(r => !byId[String(r.manager_id)])
      .map(r => r.manager_id);

    return json({
      ok: !readError,
      error: readError?.message || null,
      seasonQ,
      weekQ,
      rowCount: rows?.length || 0,
      missingManagerCount: missingManagerIds.length,
      missingManagerIds: [...new Set(missingManagerIds)].slice(0, 20),
      env: {
        hasSUPABASE_URL: Boolean(SUPABASE_URL),
        hasSERVICE_ROLE: Boolean(SUPABASE_SERVICE_ROLE_KEY)
      },
      sample
    }, { headers: { 'cache-control': 'no-store' } });
  }

  if (readError) {
    console.error('badges-index supabase read error:', readError);
  }

  // -------- Push DB rows into sections via awardWeekly
  for (const r of rows || []) {
    awardWeekly({
      badgeId: r.badge_id,
      managerId: r.manager_id,
      season: r.season,
      week: r.week,
      points: r.points,
      opponent: r.opponent,
      opponentPoints: r.opponent_points,
      explanation: r.explanation,
      nominatedBy: r.nominated_by
    });
  }

  // -------- Championships → Legacy
  const byLeague = new Map();
  for (const m of list) {
    const c = m?.championship;
    const years = (c?.years || '').trim();
    const league = (c?.league || '').trim();
    if (!league || !years) continue;
    const yearList = years.split(',').map((y) => y.trim()).filter(Boolean);
    if (!byLeague.has(league)) byLeague.set(league, []);
    byLeague.get(league).push({ ...m, _years: yearList });
  }
  const leagueDescriptions = leagueDefs(leagueName || 'this league');
  const champBadges = [...byLeague.entries()].map(([league, ms]) => {
    const key = league.trim().toLowerCase();
    const icon = key === 'irving' ? '/Irving.png' : key === 'dtsp' ? '/DTSP.png' : '/trophy.svg';
    return {
      id: `championship-${slugify(league)}`,
      type: 'championship',
      name: `${league} Champion`,
      definition: leagueDescriptions[league] || `Champion of ${league}—legacy honors recognized here.`,
      icon,
      earned: ms.map((m) => ({
        managerId: m.managerID,
        managerName: m.name,
        teamName: m.teamName,
        teamLogo: m.photo,
        years: m._years
      }))
    };
  });

  // -------- Legacy (pre-2025 only)
  const legacyBadges = champBadges
    .map((b) => {
      const earnedLegacy = (b.earned || [])
        .map((e) => {
          const legacyYears = (e.years || []).filter((yr) => Number(yr) < 2025);
          return legacyYears.length ? { ...e, years: legacyYears } : null;
        })
        .filter(Boolean);
      if (!earnedLegacy.length) return null;
      return {
        ...b,
        id: `${b.id}-legacy`,
        type: 'legacy',
        name: `${b.name} (Legacy)`,
        definition: `${b.definition} (awarded prior to 2025)`,
        earned: earnedLegacy
      };
    })
    .filter(Boolean);

  // -------- Years of Service
  const yearlyBadges = (() => {
    const YEAR_THRESHOLDS = [10, 20];
    const iconFor = (y) => (y === 10 ? '/Ten.png' : '/Twenty.png');
    const defs = YEAR_THRESHOLDS.map((y) => ({
      id: `years-${y}`,
      type: 'yearly',
      name: `${y} Years of Service`,
      definition: `Awarded to managers with at least ${y} years of league service.`,
      icon: iconFor(y),
      earned: []
    }));
    const defsById = Object.fromEntries(defs.map((d) => [d.id, d]));
    for (const m of list) {
      const startYear = getStartYear(m);
      const tenure = tenureFromStart(startYear);
      if (!tenure || tenure < 10) continue;
      const best = [...YEAR_THRESHOLDS].reverse().find((y) => tenure >= y);
      if (best) {
        defsById[`years-${best}`].earned.push({
          managerId: m.managerID,
          managerName: m.name,
          teamName: m.teamName,
          teamLogo: m.photo,
          years: tenure
        });
      }
    }
    return Object.values(defsById);
  })();

  // -------- Utilities
  const addCount = (arr) => arr.map((b) => ({ ...b, count: (b.earned || []).length }));
  const sortByName = (arr) => [...arr].sort((a, b) => a.name.localeCompare(b.name));

  const personas = sortByName(addCount(personaBadges));
  const weekly = addCount(weeklyBadges);
  const yearly = addCount(yearlyBadges);
  const legacy = sortByName(addCount(legacyBadges));
  const stains = sortByName(addCount(stainsBadges));
  const luck = sortByName(addCount(luckBadges));

  // -------- byManager
  const byManager = {};
  const addToIndex = (badge) => {
    const bucket =
      badge.type === 'persona'
        ? 'personas'
        : badge.type === 'championship'
        ? 'legacy'
        : badge.type; // weekly | yearly | legacy | stains | luck
    for (const e of badge.earned || []) {
      const id = e.managerId;
      if (!id) continue;
      if (!byManager[id])
        byManager[id] = { personas: [], weekly: [], yearly: [], legacy: [], stains: [], luck: [] };

      const nomId = e.nominatedBy ?? null;
      const nomMeta = nomId ? byId[nomId] : null;

      const oppId = e.opponent ?? null;
      const oppMeta = oppId ? byId[oppId] : null;

      byManager[id][bucket].push({
        badgeId: badge.id,
        badgeName: badge.name,
        icon: badge.icon,
        years: e.years || null,
        season: e.season ?? null,
        week: e.week ?? null,
        points: e.points ?? null,
        opponent: oppId ?? null,
        opponentPoints: e.opponentPoints ?? null,
        opponentName: oppMeta?.name ?? null,
        opponentTeamName: oppMeta?.teamName ?? null,
        opponentTeamLogo: oppMeta?.photo ?? null,
        explanation: e.explanation ?? null,
        nominatedBy: nomId ?? null,
        nominatedByName: nomMeta?.name ?? null,
        nominatedByTeamName: nomMeta?.teamName ?? null,
        nominatedByTeamLogo: nomMeta?.photo ?? null
      });
    }
  };
  [...personas, ...weekly, ...yearly, ...legacy, ...stains, ...luck].forEach(addToIndex);

  return json(
    { sections: { personas, weekly, yearly, legacy, stains, luck }, byManager },
    { headers: { 'cache-control': 'no-store' } }
  );
}
