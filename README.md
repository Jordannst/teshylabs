# Teshy Labs

Static company profile for https://teshylabs.me. No dependencies or build step.

Deploy `index.html`, `robots.txt`, `sitemap.xml`, and `assets/` at the domain root. For Vercel, use the Other framework preset, no build command, and the project root as the output directory. Add `teshylabs.me` as the production domain in the project's domain settings.

`footer-snippet.html` contains the ownership link to insert into each product's existing footer. It has not been applied to the product websites.

## Decisions for review

- Native HTML and inline CSS; system sans-serif fonts, no external font requests or runtime dependencies.
- Warm off-white and charcoal with one green accent, automatic dark mode, an editorial grid, and ruled product rows. CSS handles the staggered intro, smooth anchor navigation, link feedback, and product preview reveals. Motion is disabled by prefers-reduced-motion; browsers without scroll-animation support show static previews.
- Product links open in the same tab. Contact uses a mailto link.
- The hero reuses the two product posters as links to their demos. Hero and About copy use a company voice and the confirmed focus on integrating AI into products. Founder information remains a quiet fact list; no personal quote was added. Built with Claude distinguishes development assistance from Kassentix's AI analytics feature, without claiming an AI feature in KLK.
- Portfolio descriptions were checked at `C:/projects/aboutme-2026/dev-folio/src/data/portfolio.ts`. Kassentix AI analytics is confirmed there; use of Claude for those analytics was separately confirmed by the founder in this conversation. KLK is described as developed with AI assistance, without claiming an AI feature inside the product.
- Following the request for a more visual page, both original 720p60 demo videos and their poster images were copied from the portfolio into `assets/` (about 6.4 MiB total). Videos use native accessible playback controls and load on demand, without autoplay. The HTML/CSS remain in one file; media files must be deployed alongside it.
- Organization data uses `owns` for the two product URLs. No social profiles, affiliation claims, or other company facts were added.
- Open Graph metadata is text-only; no social preview image was requested or invented.
- The footer year updates locally with one line of JavaScript, with 2026 as the no-JavaScript fallback.

Deployment and changes to the product websites are separate from delivering these files.
