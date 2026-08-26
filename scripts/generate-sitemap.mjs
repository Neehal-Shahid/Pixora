// Regenerates public/sitemap.xml on every build so lastmod stays current.
// Only lists stable, indexable, high-value pages — dynamic/infinite routes
// (search results, photo details, personal saved collections) are deliberately
// excluded; see robots meta on those pages instead.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

const SITE_URL = 'https://pixora.workwithneehal.com';
const today = new Date().toISOString().split('T')[0];

const routes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/explore', changefreq: 'daily', priority: '0.9' },
  { path: '/collections', changefreq: 'weekly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
];

const urlEntries = routes
  .map(
    ({ path: p, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log(`✓ sitemap.xml (${routes.length} URLs)`);
