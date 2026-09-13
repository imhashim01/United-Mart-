// Cloudinary URLs follow a predictable pattern — inserting transformation
// parameters right after "/upload/" tells Cloudinary to resize/compress on
// the fly, so a small product-card thumbnail doesn't download the same
// full-resolution file someone would see zoomed in on the product page.
export function optimizeCloudinaryUrl(url, { width = 400, quality = "auto", format = "auto" } = {}) {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/w_")) return url; // already transformed, don't double up
  const transformString = `w_${width},q_${quality},f_${format},c_limit`;
  return url.replace("/upload/", `/upload/${transformString}/`);
}