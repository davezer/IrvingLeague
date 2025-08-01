// src/lib/utils/helperFunctions/fetchPivotData.js

/**
 * Fetch the raw pivot from /api/pivot using SvelteKit's fetch.
 */
export async function fetchPivotData(fetchFn) {
  const res = await fetchFn('/api/pivot');
  if (!res.ok) {
    throw new Error(`Pivot fetch failed: ${res.status} ${res.statusText}`);
  }
  return /** @type {string[][]} */(await res.json());
}

/**
 * Stateful lookup for a managerName + year + txnType in a flat pivot.
 *
 * @param {string[][]} pivot
 * @param {string}     managerName  – e.g. "Dave Oliverio"
 * @param {number}     year         – e.g. 2025
 * @param {string}     txnType      – e.g. "Auction Budget Funded"
 *                                    or "Auction Budget Spend"
 *                                    or `${year} Total`
 */
export function getPivotValue(pivot, managerName, year, txnType) {
  const y       = String(year).trim();
  const totalId = `${y} Total`;
  // Skip first two rows (header + grand "Total" row)
  const rows = pivot.slice(2);

  let currentManager = null;
  for (const rawRow of rows) {
    const [gm, rYear, rType, amount] = rawRow.map(c => String(c).trim());
    // If gm cell is non-empty, start a new group
    if (gm) currentManager = gm;
    // Only consider rows for the manager we care about
    if (currentManager !== managerName) continue;

    // Case A: matching the net‐total row
    if (txnType === totalId && rYear === totalId) {
      return amount;
    }
    // Case B: matching a funded/spend line
    if (rYear === y && rType === txnType) {
      return amount;
    }
  }

  // not found
  return null;
}

/**
 * Turn "$123.45" or "-$10" into a properly formatted USD string.
 */
export function formatCurrency(value) {
  const num = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return String(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(num);
}