import { managers as managersObj } from '$lib/utils/leagueInfo.js';

/** @type {import('./$types').PageLoad} */
export function load() {
  return {
    managers: managersObj
  };
}