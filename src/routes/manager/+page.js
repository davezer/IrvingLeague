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

  // NEW: fetch the badges index (managerId -> {personas, weekly, yearly, legacy})
  let byManager = {};
  try {
    const res = await fetch('/api/badges-index', { cache: 'no-store' });
    if (res.ok) byManager = await res.json();
  } catch {
    // leave as {}
  }

  return {
    manager: manager && manager < managersObj.length ? manager : -1,
    managers: managersObj,
    managersInfo,
    byManager                 // <- pass down
  };
}
