# Meridian

A weekly spaceflight status map: who is doing what in space right now, organized into 8 jobs
(Flying people, Stations, Cargo, The Moon, Launch, Orbital networks, Suborbital flight, Stations not in orbit yet).

Live: https://deanrwhite.github.io/meridian/

- Data: `src/data/briefing.ts` (typed; `npm run validate` checks org/source references).
- Entries with no firm date are marked "Date open"; launch dates are never inferred.
- Installable PWA (manifest + service worker).

```sh
npm ci
npm run dev        # http://localhost:8080
npm run typecheck
npm run build      # outputs dist/ for base /meridian/
```

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `main`.
