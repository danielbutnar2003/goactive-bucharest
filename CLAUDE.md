# GoActive Bucharest website

Static site for an informal youth group (Erasmus+ youth exchanges). Plain HTML, CSS and JS: no build step, no dependencies, no cookies, no analytics. Hosted on GitHub Pages from `main` at https://goactivebucharest.me (DNS on Cloudflare, registrar Namecheap). README.md holds the full hosting, DNS and security notes; read it before touching deployment.

## Layout
- One HTML file per page in the root: `index`, `ideas`, `contact`, `brand`, `privacy`, `cookies`, `404`, and the three team profiles. Header, nav and footer markup is duplicated in every page, so a change to shared chrome must be applied to all of them (`rg` for the snippet first).
- `assets/css/style.css` is the design system: tokens at the top (`--ink`, `--paper`, `--blue`, `--lime`, `--coral`, fonts, radii, `--wrap`). Add new colours or spacing as tokens, not as literals.
- `assets/css/fonts.css` + `assets/fonts/` are self-hosted Archivo and Inter (woff2 only). Do not add Google Fonts or any third-party asset.
- `assets/js/main.js` handles header state, mobile menu, reveal animations and both forms. Editable settings sit in the `CONFIG` object at the top.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `CNAME`, `.nojekyll`, `.well-known/security.txt` must stay. Adding a page means adding it to `sitemap.xml` and to the nav in every page.

## Hard rules
- Every page carries a Content Security Policy meta tag. The one inline script (`document.documentElement.classList.add("js")`) is allowed by a sha256 hash in that CSP, identical across all 10 pages. If that line changes, recompute the hash and update every page, or the animations break. Never add other inline scripts or inline event handlers; put JS in `main.js`.
- Forms post to FormSubmit (`formsubmit.co`); it is the only external domain in the CSP `connect-src` and `form-action`. Any new external service must be added to the CSP in every page and to the privacy and cookie policies first.
- Keep the head block complete on every page: title, description, canonical, theme-color, Open Graph, twitter card. `og:image` is `assets/logo/og-image.png` (1200x630).
- Team photos `assets/img/{daniel,vlad,bianca}.jpg` are referenced but not committed; the JS shows a monogram until they exist. Don't remove the fallback.
- Respect `prefers-reduced-motion` (main.js already checks it) and keep keyboard access for the mobile menu (`inert`, `aria-expanded`).
- Language: site copy is English (`lang="en"`, `og:locale` en_GB). Keep the tone: short, direct, youth-facing, no corporate filler.

## Working here
- Preview: `npx serve .` from the repo root, or open the HTML file directly.
- Before finishing UI changes: check 375 px and 1440 px in a browser, check the console (CSP violations show there), and run the `web-qa` skill before a deploy.
- Deploy is a push to `main`; GitHub Pages republishes within a minute. Do not commit or push unless asked.
- Renewal dates to keep in mind: domain expires 13 September 2027; `security.txt` Expires must be refreshed before then.
