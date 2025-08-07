import { readable } from 'svelte/store';

export const pivotStore = readable(
  { data: [], error: null, loading: true },
  (set) => {
    fetch('/api/pivot')
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        set({ data, error: null, loading: false });
      })
      .catch((error) => {
        set({ data: [], error: error.message, loading: false });
      });

    // no teardown needed
    return () => {};
  }
);