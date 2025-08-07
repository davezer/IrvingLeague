
export async function fetchPivotData(fetchFn, type) {
  const res = await fetchFn(`/api/pivot?type=${type}`);
  if (!res.ok) {
    throw new Error(`upstream ${res.status}: ${res.statusText}`);
  }
  return await res.json(); // expecting [{ key, value }, …]
}

/** Simple USD formatter */
export function formatCurrency(amount) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}
