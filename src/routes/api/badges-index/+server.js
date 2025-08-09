import { json } from '@sveltejs/kit';
import { managers } from '$lib/utils/leagueInfo';
import {
  weeklyBase,
  managersIndex,
  awardWeekly,
  buildByManagerFromSections
} from '$lib/utils/helperFunctions/builder';

export async function GET() {
  // Clone base so we don't mutate the module singleton
  const weekly = weeklyBase.map((b) => ({ ...b, earned: [...b.earned] }));

  // Example: your source of truth for winners (replace with real data)
  const weeklyResults = [
    { badgeId: 'bde',   managerId: '1254577895943192576', season: 2024, week: 3, points: 172.4 },
    { badgeId: 'ides',  managerId: '1253772062900621312', season: 2024, week: 3, points: 142.3, opponent: 'Milford Jayhawks', opponentPoints: 145.0 },
    { badgeId: 'doyle', managerId: '76521957268799488',   season: 2024, week: 5, points: 128.6 }
  ];

  const mIdx = managersIndex(managers);
  weeklyResults.forEach((r) => awardWeekly(weekly, mIdx, r));

  // (Optional) Add personas/yearly/legacy here if you have them
  const sections = { personas: [], weekly, yearly: [], legacy: [] };

  // Manager-page-friendly index
  const byManager = buildByManagerFromSections(sections);

  // Return just the index (what your /manager page expects)
  return json(byManager, {
    headers: {
      'cache-control': 'no-store'
    }
  });
}
