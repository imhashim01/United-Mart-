// Lets Vercel's edge cache these public, read-only responses instead of
// hitting the origin function on every single request — this is the
// single biggest lever against Fast Origin Transfer, since a cache hit
// never reaches the origin at all. Short TTL keeps admin edits visible
// to new visitors within roughly a minute, not stale for hours.
export const cachePublic = (seconds = 60, staleSeconds = 300) => (req, res, next) => {
  res.set('Cache-Control', `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`);
  next();
};