const SITE_URL = "https://unitedmartsukkur.com";
const API_URL = process.env.VITE_API_URL || "https://united-mart-phye.vercel.app/api/v1";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/shop", priority: "0.9", changefreq: "daily" },
  { path: "/deals", priority: "0.8", changefreq: "daily" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/contact", priority: "0.5", changefreq: "monthly" },
  { path: "/delivery-info", priority: "0.4", changefreq: "monthly" },
  { path: "/faqs", priority: "0.4", changefreq: "monthly" },
  { path: "/returns", priority: "0.3", changefreq: "monthly" },
  { path: "/privacy", priority: "0.2", changefreq: "yearly" },
  { path: "/terms", priority: "0.2", changefreq: "yearly" },
];

const escapeXml = (str) =>
  String(str).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

const urlEntry = (path, priority, changefreq, lastmod) => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

async function fetchAllPages(endpoint, maxLimit = 100) {
  const results = [];
  let page = 1;
  let totalPages = 1;
  do {
    const res = await fetch(`${API_URL}${endpoint}?limit=${maxLimit}&page=${page}`);
    const json = await res.json();
    results.push(...(json?.data ?? []));
    totalPages = json?.meta?.totalPages ?? 1;
    page += 1;
  } while (page <= totalPages);
  return results;
}

export default async function handler(req, res) {
  try {
    const [products, categories] = await Promise.all([
      fetchAllPages("/products", 200),
      fetchAllPages("/categories", 100),
    ]);

    const staticEntries = STATIC_PAGES.map((p) => urlEntry(p.path, p.priority, p.changefreq)).join("");

    const categoryEntries = categories
      .map((c) =>
        urlEntry(
          `/category/${encodeURIComponent(c.slug || c.name)}`,
          "0.7",
          "daily",
          c.updatedAt ? new Date(c.updatedAt).toISOString() : undefined
        )
      )
      .join("");

    const productEntries = products
      .map((p) =>
        urlEntry(
          `/product/${p.id ?? p._id}`,
          "0.6",
          "weekly",
          p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined
        )
      )
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticEntries}${categoryEntries}${productEntries}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600"); // cache 1 hour so it doesn't hit your DB on every crawl
    res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation failed:", error.message);
    res.status(500).send("Failed to generate sitemap");
  }
}