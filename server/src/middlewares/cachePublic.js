import jwt from 'jsonwebtoken';

// Only an actual admin/manager token should bypass caching — their own
// panel needs to see fresh data right after an edit. An ordinary logged-in
// customer's token carries no such need: the product/category/brand data
// they're browsing is identical to what a guest sees, so caching it is
// completely safe and correct. Treating EVERY login token as "skip cache"
// (the previous version) meant every real customer who stays logged in
// silently stopped benefiting from caching at all — which is exactly what
// was driving Fast Origin Transfer and CPU usage back up as more real
// customers started using accounts.
const isPrivilegedRequest = (authHeader) => {
  if (!authHeader?.startsWith('Bearer ')) return false;
  try {
    // Decoding only, not verifying — this never grants access to anything,
    // it just decides a caching header. A forged/expired token might
    // occasionally get treated as "skip cache" here, which only costs one
    // extra cache miss — harmless. Real route protection for admin actions
    // still happens entirely separately, in the normal auth middleware.
    const decoded = jwt.decode(authHeader.slice(7));
    return decoded?.role === 'admin' || decoded?.role === 'manager';
  } catch {
    return false;
  }
};

export const cachePublic = (seconds = 300, staleSeconds = 600) => (req, res, next) => {
  if (isPrivilegedRequest(req.headers.authorization)) {
    res.set('Cache-Control', 'no-store');
    return next();
  }
  res.set('Cache-Control', `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`);
  res.set('CDN-Cache-Control', `public, s-maxage=${seconds}, stale-while-revalidate=${staleSeconds}`);
  next();
};