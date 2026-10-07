import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://teshylabs.me';
const read = file => readFileSync(resolve(root, file), 'utf8');
const pages = new Map([['/', read('index.html')], ['/about.html', read('about.html')]]);
const definitions = new Map();
const references = [];
const canonicals = [];

function inspectNode(value) {
  if (!value || typeof value !== 'object') return;
  if (value['@id']) {
    assert.equal(new URL(value['@id']).origin, origin);
    if (value['@type']) {
      assert(!definitions.has(value['@id']), `Duplicate entity: ${value['@id']}`);
      definitions.set(value['@id'], value);
    } else references.push(value['@id']);
  }
  for (const nested of Object.values(value)) {
    if (Array.isArray(nested)) nested.forEach(inspectNode);
    else inspectNode(nested);
  }
}

for (const [path, html] of pages) {
  assert.match(html, /<html lang="en">/);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${path}: one h1`);
  const visible = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/g, '');
  for (const fact of ['Teshy Labs', 'Chrisfivo Sutarto', 'December 2025', 'Manado', 'Indonesia', 'hello@teshylabs.me']) {
    assert(visible.includes(fact), `${path}: missing static fact ${fact}`);
  }
  assert.match(visible, /<a[^>]+href="#main"/);
  assert.match(visible, /<main[^>]+id="main"[^>]+tabindex="-1"/);
  const ids = [...visible.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${path}: duplicate HTML IDs`);
  const metadata = new Map([...html.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]*)"/g)].map(match => [match[1], match[2]]));
  for (const name of ['description', 'og:type', 'og:title', 'og:description', 'og:site_name', 'og:url', 'twitter:card', 'twitter:title', 'twitter:description']) {
    assert(metadata.get(name)?.trim(), `${path}: missing ${name}`);
  }
  for (const [name, value] of metadata) {
    if (/robots|googlebot/i.test(name)) assert(!/noindex|none|nofollow/i.test(value), `${path}: restrictive robots meta`);
  }
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  assert.equal(canonical.length, 1, `${path}: one canonical`);
  assert.equal(canonical[0][1], origin + path);
  assert.equal(metadata.get('og:url'), canonical[0][1]);
  canonicals.push(canonical[0][1]);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(schemas.length, 1, `${path}: one JSON-LD block`);
  const schema = JSON.parse(schemas[0][1]);
  assert.equal(schema['@context'], 'https://schema.org');
  inspectNode(schema);
  for (const [, value] of visible.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)) {
    if (/^(mailto:|data:)/.test(value)) continue;
    const url = new URL(value, origin + path);
    if (url.origin !== origin) continue;
    assert(existsSync(resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname))), `${path}: broken local link ${value}`);
    if (url.hash && pages.has(url.pathname)) assert(pages.get(url.pathname).includes(`id="${url.hash.slice(1)}"`), `${path}: broken fragment ${value}`);
  }
  const products = [...visible.matchAll(/<article class="product"[^>]*aria-labelledby="([^"]+)"/g)];
  assert.deepEqual(products.map(match => match[1]), ['klk-heading', 'kassentix-heading'], `${path}: KLK first, both products retained`);
}
for (const id of references) assert(definitions.has(id), `Unresolved JSON-LD reference: ${id}`);
const org = definitions.get(origin + '/#organization');
assert.equal(org['@type'], 'Organization');
assert.equal(org.founder['@type'], 'Person');
assert.equal(org.foundingDate, '2025-12', 'Preserve known month; do not invent a day');
assert.equal(org.address['@type'], 'PostalAddress');
assert.equal(org.address.addressCountry, 'ID');
assert.equal(org.email, 'hello@teshylabs.me');
assert(existsSync(resolve(root, '.' + new URL(org.logo).pathname)), 'Logo file must exist');
assert.deepEqual(org.owns.map(product => product.name), ['Kassentix'], 'Do not claim ownership of the founder\'s KLK project');
assert(org.owns.every(product => product['@type'] === 'Product' && new URL(product.url).protocol === 'https:'));
assert.equal(definitions.get(origin + '/#klk')['@type'], 'SoftwareApplication');
assert.equal(definitions.get(origin + '/#klk').creator['@id'], org.founder['@id']);
const robots = read('robots.txt');
assert.match(robots, /^User-agent: \*\r?\nAllow: \/\r?\n/m);
assert(!/^Disallow:\s*\S/im.test(robots), 'Unexpected crawler exclusion');
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
const sitemap = read('sitemap.xml');
assert(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(locations.sort(), canonicals.sort(), 'Sitemap and canonical pages must agree');
console.log('PASS: 2 static pages, metadata/canonicals, JSON-LD references/types, known facts, local links/assets, product order, robots and sitemap entries.');
