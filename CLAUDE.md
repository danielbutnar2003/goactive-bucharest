# GoActive Bucharest website

Static site for an informal youth group (Erasmus+ youth exchanges). Plain HTML, CSS and JS: no build step, no dependencies, no cookies, no analytics. Live on GitHub Pages from `main` at https://goactivebucharest.me (DNS on Cloudflare, registrar Namecheap; `www` redirects to the apex). README.md holds the full hosting, DNS and security notes; read it before touching deployment.

## Layout
- One HTML file per page in the root: `index`, `ideas`, `contact`, `brand`, `privacy`, `cookies`, `404`, and the three team profiles. Header, nav and footer markup is duplicated in every page, so a change to shared chrome must be applied to all of them (`rg` for the snippet first). `404.html` is the exception: reduced header, no nav or footer, and root-absolute asset paths so it also renders for deep URLs.
- `assets/css/style.css` is the design system: tokens at the top (`--ink`, `--paper`, `--blue`, `--lime`, `--coral`, fonts, radii, `--wrap`). Add new colours or spacing as tokens, not as literals.
- `assets/css/fonts.css` + `assets/fonts/` are self-hosted Archivo and Inter (woff2 only). Do not add Google Fonts or any third-party asset.
- `assets/js/main.js` handles header state, mobile menu, reveal animations and both forms. Editable settings sit in the `CONFIG` object at the top.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `CNAME`, `.nojekyll`, `.well-known/security.txt` must stay. Adding a page means adding it to `sitemap.xml` and to the nav in every page.

## Hard rules
- Every page carries a Content Security Policy meta tag. The one inline script (`document.documentElement.classList.add("js")`) is allowed by a sha256 hash in that CSP, identical across all 10 pages. If that line changes, recompute the hash and update every page, or the animations break. Never add other inline scripts or inline event handlers; put JS in `main.js`.
- Forms post to FormSubmit (`formsubmit.co`); it is the only external domain in the CSP `connect-src` and `form-action`. Any new external service must be added to the CSP in every page and to the privacy and cookie policies first.
- Keep the head block complete on every page: title, description, canonical, theme-color, Open Graph, twitter card. `og:image` is `assets/logo/og-image.png` (1200x630). `404.html` is `noindex` and carries only title and description.
- Team photos are `assets/img/{daniel,vlad,bianca}.jpg` (4:5 JPEG, cropped from the originals). The JS still shows a monogram if a file is missing; don't remove that fallback.
- Respect `prefers-reduced-motion` (main.js already checks it) and keep keyboard access for the mobile menu (`inert`, `aria-expanded`).
- Language: site copy is English (`lang="en"`, `og:locale` en_GB). Keep the tone: short, direct, youth-facing, no corporate filler.

## Design
Draft 2026-09-23, owner to edit. The tokens in `assets/css/style.css` and the brand page `brand.html` ("Loud on purpose") are the source of truth; update this section when they change.
- Palette, token → role → hex. The five brand colours are the swatches on `brand.html`; style.css records no contrast ratios.
  - `--ink` → text on paper, header, hero, `.section--ink`, footer → #0A0A10; `--ink-2` → dropdown and team-card surfaces → #14141C (`--ink-3` #1E1E29 is defined but unused).
  - `--paper` → page background, text on ink → #F3F0E7; `--paper-2` → cards and panels on paper → #E8E4D8.
  - `--lime` (signal lime) → primary button, highlight words on ink (`.hl`), `.mark`, `.section--lime`, focus ring on dark → #D4FF3F. Lime is text only on ink.
  - `--blue` (electric blue) → `.section--blue`, focus ring on paper, numbers and links on paper, `.hl-blue` → #2B36FF.
  - `--coral` → portrait and Instagram-card backgrounds, invalid-field border → #FF5B3A.
  - `--muted` → secondary text on paper → #5F5E68; `--muted-d` → on ink → #A3A2B0. Error text is the literal #B3260B, not a token yet.
- Type: Archivo (variable, 400-900, width 62-125%) for display: `.display` is 900, `font-stretch` 112%, uppercase, line-height .88; `.outline` sets words in outline. Inter (400-700) for body at 17px, 16px under 600px. No type-scale tokens: sizes are `.h-xxl`, `.h-xl`, `.h-l`, `.h-m` (clamps up to 10rem) plus per-component clamps; reuse one before adding a size.
- Spacing and radius: no spacing tokens. `--wrap` 1360px, `--gutter` clamp(20px, 4vw, 56px), `--header-h` 76px (64px once scrolled), `.section` padding clamp(88px, 11vw, 170px). Radius `--r` 22px and `--r-lg` 34px for cards and panels; 999px for buttons, nav pills, tags and chips; circles for arrows and step numbers.
- Motion: `--ease` cubic-bezier(.2, .7, .1, 1) over 0.4-1.1s. Hero title lines slide up on load, `.reveal` fades up 38px on scroll, the tilted marquee (40s), badge ring (20s) and orbs loop, cards lift on hover and circle arrows turn 45°. Keep the three safeguards: reduced motion in CSS and `main.js`, the footer's "Pause animations" button (WCAG 2.2.2), and the CSS failsafe that shows hidden content after 2.5s without JS.
- Voice: young people aged 13–30 and partner organisations. Short, direct, youth-facing, no corporate filler; "we" for the group, "you" for the reader, headlines as slogans ("Every voice gets the mic."). One label for the main action: "Share your idea". English only, so Sie/tu does not apply. Banned words: none named yet (owner to add).
- Keep: these are the brand, although the `frontend-design` skill lists them as generic tells: kickers (`.kicker`, uppercase, .16em tracking, lime dot); numbered section labels (`.label` with `.n`, "01 Our mission"); the arrow glyph (`.arrow`) in the call-to-action buttons and the circle arrows; middle dots ( · ) in kickers, meta lines and the footer; the `.reveal` scroll fade-up. Also the outline and lime-highlight words in display type and the marquee's ✦.
- Avoid: colours outside the five brand colours and their support tokens; stretching, rotating, recolouring or low-contrast placement of the logo (`brand.html` 06); new hex literals where a token exists; third-party fonts or embeds.
- References: owner to add (the docs name none).
- Tried and rejected: footer wordmark set as outlined Archivo text, replaced by the logo-lettering SVG (0465712); the spinning badge on phones, hidden under 600px (0465712); more than one label for the main action (0465712); the long ideas form, now a quick path (idea, age, e-mail) with optional details (0465712); stat numbers sized by the viewport alone, which overflowed their columns, now capped by column width with `cqi` (767081e).
- Redesign, new page or new page type: present two or three directions first (4-6 named hex values, type pairing, hero concept as an ASCII wireframe, one sentence on the memorable element) and wait for the owner's pick.
- Mechanical check: `design-lint.json` (web-qa `design-lint.mjs`, a ratchet). The devices under Keep are deliberate: never remove one to satisfy it.

## Working here
- Preview: `npx serve .` from the repo root, or open the HTML file directly.
- Before finishing UI changes: check 375 px and 1440 px in a browser, check the console (CSP violations show there), and run the `web-qa` skill before a deploy. Also confirm there is no horizontal scroll from 320 to 375 px (`document.documentElement.scrollWidth` equals the viewport width): a long name in the `.next` block of `vlad-rusu.html` once widened the page and a visual check missed it.
- The site is live, so a push to `main` is a production deploy; GitHub Pages republishes within a minute. Do not commit or push unless asked.
- Renewal dates to keep in mind: domain expires 13 September 2027; `security.txt` Expires must be refreshed before then.
