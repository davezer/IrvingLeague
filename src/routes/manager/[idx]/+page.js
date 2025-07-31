// src/routes/manager/[idx]/+page.js
import { error } from '@sveltejs/kit';
import { managers } from '$lib/utils/leagueInfo.js';
import { fetchPivotData } from '$lib/utils/helperFunctions/fetchPivotData.js';

export async function load({ params, fetch }) {
  // Get manager index from dynamic param
  const idx = Number(params.idx);

  // Validate index
  if (isNaN(idx) || idx < 0 || idx >= managers.length) {
    throw error(404, 'Manager not found');
  }

  // Grab the manager object
  const viewManager = managers[idx];

  // Fetch the pivot table data
  let pivot = [];
  try {
    pivot = await fetchPivotData(fetch);
  } catch (e) {
    console.warn('Pivot fetch failed:', e);
  }

  return {
    viewManager,
    pivot
  };
}
