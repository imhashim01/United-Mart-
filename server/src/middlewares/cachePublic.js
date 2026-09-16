// Authenticated requests (the admin panel, or a logged-in shopper) always
// carry a Bearer token — never let Vercel's edge CDN cache those, or an
// admin write (e.g. uploading a product image) can appear to do nothing
// because the next fetch is served a pre-edit response straight from the
// edge, sometimes minutes stale despite the shorter max-age below.
export const cachePublic = (seconds = 300, staleSeconds = 600) => (req, res, next) => {
  if (req.headers.authorization) {
    res.set('Cache-Control', 'no-store');
    return next();
  }
  res.set('Cache-Control', `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`);
  res.set('CDN-Cache-Control', `public, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`);
  next();
};