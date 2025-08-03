import { readable } from 'svelte/store';

/**
 * A readable store that starts fetching your pivot data immediately
 * (at module‐load time), and then holds onto it for anyone to subscribe.
 */
export const pivotStore = readable(
  { data: null, error: null, loading: true },
  (set) => {
    // Kick off the fetch as soon as this module is imported
    fetch('/api/pivot')
      .then(async (res) => {
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        set({ data: json, error: null, loading: false });
      })
      .catch((err) => {
        console.error('pivotStore failed:', err);
        set({ data: null, error: err.message, loading: false });
      });

    // no teardown necessary
    return () => {};
  }
);
