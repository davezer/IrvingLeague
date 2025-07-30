const PIVOT_WEBAPP_URL = import.meta.env.PUBLIC_PIVOT_WEBAPP_URL;

export async function fetchPivotData() {
  if (!PIVOT_WEBAPP_URL) {
    throw new Error('Missing environment variable: PUBLIC_PIVOT_WEBAPP_URL');
  }
  const res = await fetch(PIVOT_WEBAPP_URL);
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
  if (!Array.isArray(pivot) || pivot.length === 0) return null;
  const headers = pivot[0];
  const yearIdx = headers.indexOf(String(year));
  if (yearIdx === -1) return null;
  const row = pivot.find(r => r[0] === metricName);
  return row ? row[yearIdx] : null;
}

