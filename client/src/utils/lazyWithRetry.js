import { lazy } from "react";

// This app deploys constantly, and Vite gives each lazy-loaded page a
// content-hashed chunk filename that changes on almost every deploy. A
// browser tab left open from before a deploy still has the OLD filename
// baked into its already-loaded bundle — clicking into a page it hasn't
// loaded yet then requests a chunk that no longer exists on the server,
// the dynamic import 404s, and the page renders blank. A manual refresh
// fetches the current index.html (with the current filenames) and fixes
// it, which is exactly the "blank until I refresh" symptom this works
// around automatically, once, before giving up and surfacing the error
// normally.
export function lazyWithRetry(factory, chunkName) {
  return lazy(async () => {
    const storageKey = `chunk-reload:${chunkName}`;
    try {
      const module = await factory();
      sessionStorage.removeItem(storageKey);
      return module;
    } catch (error) {
      if (!sessionStorage.getItem(storageKey)) {
        sessionStorage.setItem(storageKey, "1");
        window.location.reload();
        // Never resolve — the reload is about to replace this whole page.
        return new Promise(() => {});
      }
      throw error;
    }
  });
}
