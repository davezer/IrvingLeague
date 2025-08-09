// Base weekly badges (no winners yet)
export const weeklyBase = [
  { id: 'ides',  type: 'weekly', name: 'The Ides',  definition: 'Highest-scoring loser of the week.', icon: '/ides.png',  earned: [] },
  { id: 'doyle', type: 'weekly', name: 'The Doyle', definition: "He can't keep getting away with it!", icon: '/doyle.png', earned: [] },
  { id: 'bde',   type: 'weekly', name: 'BDE',       definition: 'Highest-scoring team of the week.',   icon: '/bde.png',   earned: [] }
];

// Fast lookups
export const managersIndex = (managers = []) =>
  Object.fromEntries(managers.map((m) => [m.managerID, m]));

// Push a weekly winner row with normalized fields
export function awardWeekly(badges, managersById, { badgeId, managerId, season, week, points, opponent, opponentPoints, rosterId }) {
  const badge = badges.find((b) => b.id === badgeId && b.type === 'weekly');
  const m = managersById[managerId];
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
    opponentPoints,
    rosterId
  });
}

// Build the byManager index your Manager page expects
export function buildByManagerFromSections({ personas = [], weekly = [], yearly = [], legacy = [] } = {}) {
  const index = {};
  const buckets = ['personas', 'weekly', 'yearly', 'legacy'];
  const add = (badge, e, bucket) => {
    const id = e.managerId;
    if (!id) return;
    if (!index[id]) index[id] = { personas: [], weekly: [], yearly: [], legacy: [] };
    index[id][bucket].push({
      badgeId: badge.id,
      badgeName: badge.name,
      icon: badge.icon,
      years: e.years || null,
      season: e.season || null,
      week: e.week || null
    });
  };

  personas.forEach((b) => (b.earned || []).forEach((e) => add(b, e, 'personas')));
  weekly.forEach((b)   => (b.earned || []).forEach((e) => add(b, e, 'weekly')));
  yearly.forEach((b)   => (b.earned || []).forEach((e) => add(b, e, 'yearly')));
  legacy.forEach((b)   => (b.earned || []).forEach((e) => add(b, e, 'legacy')));

  return index;
}
