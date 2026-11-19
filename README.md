# Grants for Good — public pages

The product, support, privacy, terms, and branding website for **Grants for Good**.

Live site: https://zombiewalrusdong.github.io/grants-for-good-pages/

This repository contains public website assets and **fictional** product illustrations. The installed application source is private. No workspace records, Google configuration, tokens, real client examples, or preconfigured installers belong here.

## Edit and preview

- Edit page content in `tools/build_site.py` and rebuild with `python3 tools/build_site.py`.
- Edit the shared design in `assets/site.css` and product illustration in `assets/site.js`.
- Preview locally with `python3 -m http.server 8791 --bind 127.0.0.1`.
- Check with `python3 tools/check_site.py` and `node --check assets/site.js`.

GitHub Pages publishes the root of `main`, matching the separate HOARD.R public-pages setup. `.nojekyll` keeps this a buildless static site. No analytics, external fonts, account creation, or backend service is used.

The homepage includes a public Google Search Console ownership marker. Keep it in `tools/build_site.py` so a rebuild preserves site ownership verification used by the Google OAuth branding checks. It is not an OAuth credential or an analytics tag.

## Scope

Publishing this website does not publish the application source, provide a public hosted workspace, change Google OAuth production/verification settings, or release version 1.0. The current beta version named on these pages is v0.135.2 (November 18, 2026).

Bug reports: use the public issue form only for non-sensitive reports. Account, privacy, and confidential workspace concerns should go privately to the workspace owner who supplied the installation.
