# GoActive Bucharest — website

Static website for GoActive Bucharest, an informal youth group building inclusive Erasmus+ youth exchanges.
Plain HTML, CSS and JavaScript: no build step, no dependencies, no cookies.

Live at **https://goactivebucharest.me** (once the domain is connected, see below).

## Structure

| Path | What it is |
| --- | --- |
| `index.html` | Our mission (home page) |
| `ideas.html` | "Tell us your ideas" platform with form |
| `contact.html` | Contact details and partnership proposal form |
| `daniel-butnar.html`, `vlad-rusu.html`, `bianca-constantin.html` | Team profiles |
| `brand.html` | Logo and brand guidelines |
| `privacy.html`, `cookies.html` | GDPR privacy policy and cookie policy |
| `404.html` | "Page not found" page |
| `assets/css/` | `style.css` (design system) and `fonts.css` (self-hosted fonts) |
| `assets/js/main.js` | Menu, animations and form handling. **Settings live at the top.** |
| `assets/logo/` | Logo files (SVG and PNG) |
| `CNAME` | Custom domain for GitHub Pages (goactivebucharest.me) |
| `assets/img/` | Team photos: add `daniel.jpg`, `vlad.jpg`, `bianca.jpg` (portrait, about 4:5) |

## Preview locally

Open `index.html` in a browser, or run a small local server from this folder:

```bash
npx serve .
```

## Before going live

- [x] Instagram linked (https://www.instagram.com/goactivebucharest). Facebook is not used.
- [ ] Add team photos to `assets/img/`.
- [ ] **Activate the forms:** submit one test from the live site. FormSubmit emails an activation link to daniel.butnar@gmail.com. Click it once, and all later submissions arrive normally.
- [ ] Have the Privacy and Cookie policies reviewed by someone with legal knowledge, and update them if you add any new service (for example, analytics).

## Hosting on GitHub Pages

1. Push this folder to `github.com/danielbutnar2003/goactive-bucharest` (branch `main`).
2. Repository **Settings → Pages → Build and deployment**: Source "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The custom domain **goactivebucharest.me** is connected through the `CNAME` file. Keep that file in the repository.

## Domain

**goactivebucharest.me** was registered on 13 September 2026 through Namecheap (GitHub Student Developer Pack). It expires on **13 September 2027**: renew it in your Namecheap account before then, or the website goes offline.

### How it was set up (for reference)

1. Apply at **https://education.github.com/pack** with your university email or proof of enrollment. Approval can take a few days.
2. Once approved, open the pack's **Namecheap** offer (free `.me` domain for one year) and register **goactivebucharest.me**.
   - Turn on the free WHOIS privacy protection.
   - Note the renewal price after the first year, and set a reminder to renew.
3. In Namecheap go to **Domain List → Manage → Advanced DNS**, delete the default parking records, then add:

   | Type | Host | Value |
   | --- | --- | --- |
   | A Record | `@` | `185.199.108.153` |
   | A Record | `@` | `185.199.109.153` |
   | A Record | `@` | `185.199.110.153` |
   | A Record | `@` | `185.199.111.153` |
   | AAAA Record | `@` | `2606:50c0:8000::153` |
   | AAAA Record | `@` | `2606:50c0:8001::153` |
   | AAAA Record | `@` | `2606:50c0:8002::153` |
   | AAAA Record | `@` | `2606:50c0:8003::153` |
   | CNAME Record | `www` | `danielbutnar2003.github.io.` |

4. In the repository's **Settings → Pages**, confirm the custom domain shows `goactivebucharest.me`. When the DNS check passes (from minutes up to 24 hours), tick **Enforce HTTPS**.
5. Recommended for security: in your **GitHub profile Settings → Pages → Add a domain**, verify `goactivebucharest.me` with the TXT record GitHub gives you. This stops anyone else from using your domain on GitHub.

## Updating the site

Edit the files, then commit and push. GitHub Pages republishes within about a minute.

```bash
git add .
git commit -m "Update content"
git push
```

## Security and privacy measures

| Measure | Where |
| --- | --- |
| HTTPS enforced, http redirects permanently to https (certificate by GitHub, renews automatically) | GitHub Pages |
| Content Security Policy: scripts, styles and fonts only from this site, forms only to formsubmit.co | meta tag in every page |
| Referrer policy strict-origin-when-cross-origin | meta tag in every page |
| No cookies, no analytics, no third-party scripts, self-hosted fonts | whole site |
| Forms: hidden spam trap, POST fallback without JavaScript (answers never appear in URLs) | ideas.html, contact.html |
| Security contact file (renew the Expires date before 13 September 2027) | .well-known/security.txt |

**If you add a new service** (analytics, maps, embedded video), add its domain to the Content Security Policy in every page and update the Privacy and Cookie policies first.

**If you edit the one-line inline script** in the page head, its sha256 hash in the Content Security Policy must be updated too, or the animations stop working.

**GitHub Pages limits:** custom HTTP headers cannot be set, so frame-ancestors and Permissions-Policy are not available. This is acceptable for a static site without logins. GitHub Pages does not send an HSTS header on custom domains, so plain http visits rely on the permanent redirect to https, which is active.

### Account security checklist

- [ ] Two-factor authentication on GitHub (danielbutnar2003), Gmail and Namecheap
- [ ] Verify goactivebucharest.me in GitHub profile Settings, Pages (protects against domain takeover)
- [ ] Namecheap: turn on auto-renew for goactivebucharest.me (transfer lock is already active)
- [ ] Keep only core team members as collaborators on the repository
