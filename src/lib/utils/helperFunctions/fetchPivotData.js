import { PUBLIC_PIVOT_WEBAPP_URL } from 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLgPUT5Nhaheb449raoUPykaurl5jzleM8l4F-noEtKXotTkAOQ7KCByHDMKtGOcjV_K6E9thOlE6BHPhgnDuApk5UnbGKypewZkLT5hry94VDHktqs4rw078lC16SfhBvoikk09AIlMcrrn05e11raM0d8pDwCxei3Tx7myUb6oU_sAWid89cdOWUz_eVn7rDAUz3axswii96kx8Rwf1p_B81gIkDcv3U08pzZ3o1f5RVp8v43PFqnrbVJen0G_Pb337M_IbAd38gPmOIbPyPSFcAi7Kg&lib=MIBdXEoNJp6jeXIgDxvF2P7hWvpBjoisv';

/**
 * Fetches the raw pivot table JSON from your Apps Script Web App URL.
 * @returns {Promise<string[][]>} 2D array representing the pivot grid
 */
export async function fetchPivotData() {
  const res = await fetch(PUBLIC_PIVOT_WEBAPP_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch pivot data: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

/**
 * Extracts a specific metric value for a given year from the pivot data.
 * @param {string[][]} pivot - 2D array of pivot values (first row = headers)
 * @param {string} metricName - The label in the first column to find
 * @param {number|string} year - The year header column
 * @returns {string|null} The matching cell value or null if not found
 */
export function getMetricByYear(pivot, metricName, year) {
  if (!pivot.length) return null;
  const headers = pivot[0];
  const yearIdx = headers.indexOf(String(year));
  if (yearIdx === -1) return null;
  const row = pivot.find(r => r[0] === metricName);
  if (!row) return null;
  return row[yearIdx] ?? null;
}