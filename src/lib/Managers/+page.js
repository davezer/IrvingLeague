import { fetchPivotData, getMetricByYear } from '$lib/helper';

/** @type {import('./$types').PageLoad} */
export async function load() {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  let draftMoneyCurrentYear = null;
  let draftMoneyNextYear = null;

  try {
    const pivot = await fetchPivotData();
    draftMoneyCurrentYear = getMetricByYear(pivot, 'Draft Money', currentYear);
    draftMoneyNextYear = getMetricByYear(pivot, 'Draft Money', nextYear);
  } catch (error) {
    console.error('Error loading pivot data:', error);
  }

  return {
    draftMoneyCurrentYear,
    draftMoneyNextYear
  };
}