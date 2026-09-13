export const cachePublic = (seconds = 300, staleSeconds = 600) => (req, res, next) => {
  res.set('Cache-Control', `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`);
  res.set('CDN-Cache-Control', `public, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`);
  next();
};