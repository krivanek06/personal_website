/**
 * Generates public/sitemap.xml and public/rss.xml from the blog markdown files.
 * Run with: npm run feeds  (also runs automatically before `npm run build`).
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fm = require('front-matter');

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const contentDir = join(root, 'src', 'content', 'blog');
const publicDir = join(root, 'public');

const SITE = 'https://eduardkrivanek.com';

function escapeXml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** "21.12.2025" -> "2025-12-21" */
function toISODate(value) {
  if (!value || typeof value !== 'string') return '';
  const parts = value.split('.');
  if (parts.length !== 3) return '';
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function toRFC822(value) {
  const iso = toISODate(value);
  if (!iso) return '';
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? '' : date.toUTCString();
}

const posts = readdirSync(contentDir)
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const raw = readFileSync(join(contentDir, file), 'utf8');
    return { attributes: fm(raw).attributes ?? {} };
  })
  .filter(({ attributes }) => attributes.slug)
  .sort((a, b) => Number(b.attributes.order ?? 0) - Number(a.attributes.order ?? 0));

// ---------- sitemap.xml ----------
const staticPages = ['/', '/blog', '/toolkit'];
const sitemapUrls = [
  ...staticPages.map(path => ({ loc: `${SITE}${path}`, lastmod: '' })),
  ...posts.map(({ attributes }) => ({
    loc: `${SITE}/blog/${attributes.slug}`,
    lastmod: toISODate(attributes.datePublished),
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    ({ loc, lastmod }) =>
      `  <url>\n    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`
  )
  .join('\n')}
</urlset>
`;

// ---------- rss.xml ----------
const rssItems = posts
  .map(
    ({ attributes }) => `    <item>
      <title>${escapeXml(attributes.title)}</title>
      <link>${SITE}/blog/${attributes.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${attributes.slug}</guid>
      <description>${escapeXml(attributes.seoDescription)}</description>
      <pubDate>${toRFC822(attributes.datePublished)}</pubDate>
    </item>`
  )
  .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Eduard Krivanek — Blog</title>
    <link>${SITE}/blog</link>
    <description>Tutorials, deep dives and notes on web development — Angular, RxJS, NestJS and Firebase.</description>
    <language>en</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`;

writeFileSync(join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(join(publicDir, 'rss.xml'), rss, 'utf8');

console.log(`✓ Generated sitemap.xml (${sitemapUrls.length} URLs) and rss.xml (${posts.length} posts)`);
