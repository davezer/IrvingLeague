// src/routes/manager/+page.js
import {
  waitForAll,
  getLeagueRosters,
  getLeagueTeamManagers,
  getLeagueData,
  getLeagueTransactions,
  getAwards,
  getLeagueRecords,
  managers as managersObj
} from '$lib/utils/helper';

export async function load({ fetch, url }) {
  if (!managersObj.length) return false;

  const managersInfo = waitForAll(
    getLeagueRosters(),
    getLeagueTeamManagers(),
    getLeagueData(),
    getLeagueTransactions(),
    getAwards(),
    getLeagueRecords()
  );

  const manager = url?.searchParams?.get('manager');

  // ✅ make sure both are declared before the fetch
  let byManager = {};
  let sections = { personas: [], weekly: [], yearly: [], legacy: [] };

  try {
    const r = await fetch('/api/badges-index', { cache: 'no-store' });
    if (r.ok) {
      const api = await r.json();
      byManager = api?.byManager ?? {};
      sections  = api?.sections  ?? sections;
    }
  } catch {
    // keep defaults
  }

  return {
    manager: manager && manager < managersObj.length ? manager : -1,
    managers: managersObj,
    managersInfo,
    byManager,
    sections          // ✅ return sections for definitions
  };
}
