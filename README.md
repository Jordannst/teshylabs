# Teshy Labs

Static company profile for https://teshylabs.me. No dependencies or build step.

Deploy `index.html`, `about.html`, `robots.txt`, `sitemap.xml`, and `assets/` at the domain root. For Vercel, use the Other framework preset, no build command, and the project root as the output directory. Add `teshylabs.me` as the production domain in the project's domain settings.

`footer-snippet.html` contains a company ownership link for Kassentix only. It has not been applied to the product website. Do not place this ownership claim on KLK Invoice: the founder clarified that KLK was developed personally for PT KLK; authorship does not establish Teshy Labs ownership.

## Decisions for review

- Native HTML and inline CSS; system sans-serif fonts, no external font requests or runtime dependencies.
- Warm off-white and charcoal with one green accent, automatic dark mode, an editorial grid, and ruled product rows. CSS handles the staggered intro, smooth anchor navigation, link feedback, and product preview reveals. Motion is disabled by prefers-reduced-motion; browsers without scroll-animation support show static previews.
- Product links open in the same tab. Contact uses a mailto link.
- The hero reuses the two product posters as links to their demos. Hero and About copy use a company voice and the confirmed focus on integrating AI into products. Founder information remains a quiet fact list; no personal quote was added. Built with Claude distinguishes development assistance from Kassentix's AI analytics feature, without claiming an AI feature in KLK.
- Portfolio descriptions were checked at `C:/projects/aboutme-2026/dev-folio/src/data/portfolio.ts`. Kassentix AI analytics is confirmed there; use of Claude for those analytics was separately confirmed by the founder in this conversation. KLK is described as developed with AI assistance, without claiming an AI feature inside the product.
- Following the request for a more visual page, both original 720p60 demo videos and their poster images were copied from the portfolio into `assets/` (about 6.4 MiB total). Videos use native accessible playback controls and load on demand, without autoplay. The HTML/CSS remain in one file; media files must be deployed alongside it.
- Organization data names Kassentix through `owns`, links to the WebSite publisher, and uses the existing favicon monogram as a crawlable SVG logo. KLK is a separate SoftwareApplication with the founder as creator, not company-owned software. AboutPage references the same entities. No unverified social profiles or legal registration details are included; `sameAs` and `legalName` are deliberately omitted. Founding date remains month-precise (`2025-12`).
- KLK Invoice leads the software previews and the Products & projects section, explicitly labelled as a founder project. Its description is limited to documented invoicing features, the founder's authorship, and AI-assisted development. The user clarified on 7 October 2026 that it was developed for PT KLK, a family business; no ownership by Teshy Labs, partnership, or legal identity is inferred. Embedded Claude-powered analytics remains a Kassentix-specific claim, confirmed by the founder.
- `/about.html` provides a concise company profile, linked from the homepage About section and footer. Both pages are static and contain the identity details without JavaScript. There is no public application/verification-specific copy.
- Open Graph metadata is text-only; no social preview image was requested or invented.
- The footer year updates locally with one line of JavaScript, with 2026 as the no-JavaScript fallback.

Deployment and changes to the product websites are separate from delivering these files.

## Local verification

Run `node scripts/check-site.mjs` (Node.js 18 or later; no package install). This checks static identity text, metadata, canonical URLs, JSON-LD references and basic property types, local links, product order, robots rules, and sitemap entries. It is a focused regression check, not a complete HTML or Schema.org validator.

`SITE_AUDIT.md` records the identity/discoverability audit, evidence limits, and external follow-up. Audit notes, checks, and QA output are excluded from deployment. The audit changes require review and an explicit deployment request; pushing to the connected production branch may trigger Vercel, so no push is part of this audit.
