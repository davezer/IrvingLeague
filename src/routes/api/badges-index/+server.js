// src/routes/api/badges-index/+server.js
import { json } from '@sveltejs/kit';
import { managers, leagueName } from '$lib/utils/leagueInfo';

const personaDefs = {
  'The Wolf': 'Max Chaos. Always pouncing on the possibilities.',
  'The Littlefinger': 'The Schemer. Edges found in backchannels and fine print.',
  'The Flacco': 'Steady and unflashy until it’s time to sling it deep and steal a week.',
  'The Kornacki': 'Data first tactician. Charts, trends, and probability trees all the way.'
};

const leagueDefs = (lname) => ({
  Irving: `Winner of the historic Irving League—merged into ${lname}.`,
  DTSP: `Champion of DTSP—legacy honors recognized in ${lname}.`
});

const slugify = (s) =>
  String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function GET() {
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
    name: `Persona: ${p}`,
    definition: personaDefs[p] || `Managers with the “${p}” persona.`,
    icon: `/${p}.png`,
    earned: ms.map((m) => ({
      managerId: m.managerID,
      managerName: m.name,
      teamName: m.teamName,
      teamLogo: m.photo
    }))
  }));

  // -------- Weekly (base list)
  const weeklyBadges = [
    { id: 'ides',  type: 'weekly', name: 'The Ides',  definition: 'Beware the Ides — awarded for being the highest scoring loser of the week. You loser.', icon: '/ides.png',  earned: [] },
    { id: 'doyle', type: 'weekly', name: 'The Doyle', definition: "He can't keep getting away with it!",  icon: '/doyle.png', earned: [] },
    { id: 'bde',   type: 'weekly', name: 'BDE',       definition: 'Awarded to the highest scoring team of the week.', icon: '/bde.png',   earned: [] }
  ];

  // Helper: add a weekly winner row using managerID
  const byId = Object.fromEntries(list.map((m) => [m.managerID, m]));
  function awardWeekly({ badgeId, managerId, season, week, points, opponent, opponentPoints }) {
    const badge = weeklyBadges.find((b) => b.id === badgeId);
    const m = byId[managerId];
    if (!badge || !m) return;
    badge.earned.push({
      managerId,
      managerName: m.name,
      teamName: m.teamName,
      teamLogo: m.photo,
      season,
      week,
      points,
      opponent,
      opponentPoints
    });
  }

// helpers near top
const THIS_YEAR = new Date().getFullYear();
const toInt = (v) => {
  const n = Number(String(v ?? '').trim());
  return Number.isFinite(n) ? n : null;
};
function getStartYear(m) {
  const candidates = [
    toInt(m?.startYear),
    toInt(m?.joinYear),
    toInt(m?.since),
    toInt(m?.fantasyStart),
  ].filter(Boolean);

  // fallback: earliest championship year
  const champYears = String(m?.championship?.years || '')
    .split(',')
    .map(toInt)
    .filter(Boolean);
  if (champYears.length) candidates.push(Math.min(...champYears));

  return candidates.length ? Math.min(...candidates) : null;
}
const tenureFromStart = (start, now = THIS_YEAR) =>
  !start ? 0 : Math.max(0, now - start); // use +1 if you count inclusively



  //  Add weekly winners here
  awardWeekly({ badgeId: 'bde', managerId: '857309838424809472', season: 2024, week: 3, points: 172 });
  awardWeekly({ badgeId: 'ides', managerId: '1253772062900621312', season: 2024, week: 5, points: 142 });
  awardWeekly({ badgeId: 'ides', managerId: '1256320322135674880', season: 2025, week: 7, points: 142 });
  awardWeekly({ badgeId: 'bde', managerId: '1005329348477419520', season: 2025, week: 8, points: 142});
  awardWeekly({ badgeId: 'ides', managerId: '1256320322135674880', season: 2025, week: 9, points: 142 });
  awardWeekly({ badgeId: 'doyle', managerId: '1253772062900621312', season: 2025, week: 9, points: null })
  awardWeekly({ badgeId: 'doyle', managerId: '1254577682394386432', season: 2025, week: 9, points: null });
  awardWeekly({ badgeId: 'doyle', managerId: '1253772062900621312', season: 2025, week: 9, points: null });
  awardWeekly({ badgeId: 'doyle', managerId: '1253772062900621312', season: 2025, week: 9, points: null });
  awardWeekly({ badgeId: 'bde', managerId: '1253772062900621312', season: 2024, week: 3, points: 172 });
  awardWeekly({ badgeId: 'ides', managerId: '1253772062900621312', season: 2024, week: 5, points: 142 });
  awardWeekly({ badgeId: 'ides', managerId: '792114259365597184', season: 2025, week: 12, points: 142 });
  awardWeekly({ badgeId: 'bde', managerId: '1253772062900621312', season: 2025, week: 8, points: 142});
  awardWeekly({ badgeId: 'ides', managerId: '1253772062900621312', season: 2025, week: 9, points: 142 });
  awardWeekly({ badgeId: 'doyle', managerId: '1258962574360182785', season: 2025, week: 9, points: null })
  awardWeekly({ badgeId: 'bde', managerId: '1253772062900621312', season: 2025, week: 9, points: 142 });
  awardWeekly({ badgeId: 'doyle', managerId: '1253772062900621312', season: 2025, week: 9, points: null });
  awardWeekly({ badgeId: 'doyle', managerId: '1254577895943192576', season: 2025, week: 9, points: null });
  awardWeekly({ badgeId: 'bde', managerId: '1256320322135674880', season: 2024, week: 3, points: 172 });
  awardWeekly({ badgeId: 'ides', managerId: '1253772062900621312', season: 2024, week: 5, points: 142 });
  awardWeekly({ badgeId: 'bde', managerId: '1253772062900621312', season: 2025, week: 7, points: 142 });
  awardWeekly({ badgeId: 'bde', managerId: '1253772062900621312', season: 2025, week: 8, points: 142 });
  awardWeekly({ badgeId: 'ides', managerId: '1256320322135674880', season: 2025, week: 9, points: 142 });
  awardWeekly({ badgeId: 'doyle', managerId: '76521957268799488', season: 2025, week: 9, points: null })
  awardWeekly({ badgeId: 'doyle', managerId: '857309838424809472', season: 2025, week: 9, points: null });
  awardWeekly({ badgeId: 'ides', managerId: '1253515645044133888', season: 2025, week: 9, points: 142 });
  awardWeekly({ badgeId: 'doyle', managerId: '1253772062900621312', season: 2025, week: 9, points: null });

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
    const icon =
      key === 'irving' ? '/Irving.png' :
      key === 'dtsp'   ? '/DTSP.png'   :
      '/trophy.svg';
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

  // Legacy (pre-2025 only)
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

// -------- Years of Service (Yearly Badges: only 10 & 20)
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

  const byId = Object.fromEntries(defs.map((d) => [d.id, d]));

  for (const m of list) {
    const startYear = getStartYear(m);
    const tenure = tenureFromStart(startYear);

    if (!tenure || tenure < 10) continue;

    const best = [...YEAR_THRESHOLDS].reverse().find((y) => tenure >= y);
     if (best) {
       byId[`years-${best}`].earned.push({
         managerId: m.managerID,
         managerName: m.name,
         teamName: m.teamName,
         teamLogo: m.photo,
         years: tenure
      });
    }
  }

  return Object.values(byId);
})();


  // Utilities
  const addCount = (arr) => arr.map((b) => ({ ...b, count: (b.earned || []).length }));
  const sortByName = (arr) => [...arr].sort((a, b) => a.name.localeCompare(b.name));

  const personas = sortByName(addCount(personaBadges));
  const weekly   = addCount(weeklyBadges);
  const yearly   = addCount(yearlyBadges);
  const legacy   = sortByName(addCount(legacyBadges));

  // Build byManager index for Manager page
  const byManager = {};
  const addToIndex = (badge) => {
    const bucket =
      badge.type === 'persona'      ? 'personas' :
      badge.type === 'championship' ? 'legacy'   :
      badge.type; // weekly | yearly | legacy

    for (const e of badge.earned || []) {
      const id = e.managerId;
      if (!id) continue;
      if (!byManager[id]) byManager[id] = { personas: [], weekly: [], yearly: [], legacy: [] };
      byManager[id][bucket].push({
        badgeId: badge.id,
        badgeName: badge.name,
        icon: badge.icon,
        years: e.years || null,
        season: e.season || null,
        week: e.week || null,
        points: e.points ?? null,
       opponent: e.opponent ?? null,
       opponentPoints: e.opponentPoints ?? null

      });
    }
  };

  [...personas, ...weekly, ...yearly, ...legacy].forEach(addToIndex);

  return json(
    { sections: { personas, weekly, yearly, legacy }, byManager },
    { headers: { 'cache-control': 'no-store' } }
  );
}
