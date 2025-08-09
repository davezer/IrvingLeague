
import { managers, leagueName } from '$lib/utils/leagueInfo';

const personaDefs = {
  'The Wolf': 'Max Chaos. Always pouncing on the possibilities.',
  'The Littlefinger': 'The Scheme. Edges found in backchannels and fine print.',
  'The Flacco': 'Steady and unflashy until it’s time to sling it deep and steal a week.',
  'The Kornacki': 'Data first tactician. Charts, trends, and probability trees all the way.'
};

const leagueDefs = (lname) => ({
  Irving: `Winner of the historic Irving League—merged into ${lname}.`,
  DTSP: `Champion of DTSP—legacy honors recognized in ${lname}.`
});

const slugify = (s) =>
  String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function load() {
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
    icon: `/${p}.png`, // lives in /static
    earned: ms.map((m) => ({
      managerId: m.managerID,
      managerName: m.name,
      teamName: m.teamName,
      teamLogo: m.photo
    }))
  }));

  // -------- Weekly (static list for now)
  const weeklyBadges = [
    {
      id: 'ides',
      type: 'weekly',
      name: 'The Ides',
      definition: 'Beware the Ides — awarded for being the highest scoring loser of the week. You loser.',
      icon: '/ides.png',
      earned: []
    },
    {
      id: 'doyle',
      type: 'weekly',
      name: 'The Doyle',
      definition: 'He can\'t keep getting away with it!',
      icon: '/doyle.png',
      earned: []
    },
    {
      id: 'bde',
      type: 'weekly',
      name: 'BDE',
      definition: 'Awarded to the highest scoring team of the week.',
      icon: '/bde.png',
      earned: []
    }
  ];

  // -------- Championships (source for Legacy)
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
      key === 'irving' ? '/Irving.png'
      : key === 'dtsp'  ? '/DTSP.png'
      : '/trophy.svg'; // fallback in /static
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

  // -------- Yearly (placeholder for future)
  const yearlyBadges = []; // fill later (e.g., 2025 season awards)

  // -------- Utilities
  const addCount = (arr) => arr.map((b) => ({ ...b, count: (b.earned || []).length }));
  const sortByName = (arr) => [...arr].sort((a, b) => a.name.localeCompare(b.name));

  const personas = sortByName(addCount(personaBadges));
  const weekly   = addCount(weeklyBadges);
  const yearly   = addCount(yearlyBadges);
  const legacy   = sortByName(addCount(legacyBadges));

  // -------- byManager index (safe buckets)
  const byManager = {};
  const normalize = (b) => ({
    ...b,
    type: b.type || 'weekly',
    earned: Array.isArray(b.earned) ? b.earned : []
  });

  const addToIndex = (badge) => {
    const bucket =
      badge.type === 'persona'       ? 'personas' :
      badge.type === 'championship'  ? 'legacy'   : // safety
      badge.type; // 'weekly' | 'yearly' | 'legacy'

    for (const e of badge.earned) {
      const id = e.managerId;
      if (!id) continue;
      if (!byManager[id]) byManager[id] = { personas: [], weekly: [], yearly: [], legacy: [] };
      if (!byManager[id][bucket]) byManager[id][bucket] = [];
      byManager[id][bucket].push({
        badgeId: badge.id,
        badgeName: badge.name,
        icon: badge.icon,
        years: e.years || null,
        season: e.season || null,
        week: e.week || null
      });
    }
  };

  [...personas, ...weekly, ...yearly, ...legacy].map(normalize).forEach(addToIndex);

  return {
    sections: { personas, weekly, yearly, legacy },
    byManager
  };
}
