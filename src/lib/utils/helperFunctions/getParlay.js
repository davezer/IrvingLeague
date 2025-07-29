export function getParlay(src) {
  return new Promise((resolve, reject) => {
    // If a local script is ever provided, this will load it once
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.async = false; // preserve execution order if used
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}