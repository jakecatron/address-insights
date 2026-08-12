# Address Insights

**Live demo:** [https://address-insights-beta.vercel.app](https://address-insights-beta.vercel.app)

A simple address insights tool built for the RentEngine interview challenge. Enter an address and get a walking score, driving score, urban/suburban/rural index, map of nearby amenities, and a shareable results page.

## What I Built vs AI

I owned the overall architecture, API selection, scoring design, UI direction, and testing strategy. AI was used for scaffolding components, wiring Mapbox + Google Places, iterating on the scoring heuristics, and generating the unit tests. I reviewed, refined, and justified every part.

## Approach

- I started by creating a checklist for how to tackle the project step by step and to help keep track of all project brief requirements
- Utilized **Next.js App Router + TypeScript + Vercel** for speed and alignment with RentEngine’s stack
- Opted for **Tailwind** for styling to aid in speed and allow for easily matching the RentEngine brandkit as closely as possible due to its versatility
- **Mapbox** for geocoding, address autocomplete, and the map
- **Google Places API** for real amenity data - I've worked with GCP extensively and found leveraging this API to be fast to set up due to that experience
- Simple weighted scoring with diminishing returns and density-based Urban / Suburban / Rural (named Address Type in the UI) label
- Search history in `localStorage`
- Shareable insights via query string (`/insights?address=...`) so anyone with the link sees the same results
- Minimal unit tests on the pure scoring logic given the time constraints

## Assumptions & Design Decisions

- Heuristics are intentional — the goal was transparent reasoning, not a production Drive/Walk Score competitor
- I made an effort to make this look and feel as close to a real RentEngine product as possible - fonts, colors, copy (similar language as RentEngine website), and favicon
- No backend database required for the core features - search history lives in localStorage, and insights are recalculated on the fly from the address in the URL so shared links work without any stored state
- Originally considered Overpass API and Leaflet (no API keys/accounts required), but Overpass was slow/unreliable and Leaflet looked dated. Switched to Mapbox and Places API for significantly better reliability, performance, and visual quality
- Reduced calls from ~18 type-specific requests down to 2 broad Places API calls per address (one per radius) and categorized results. This stays well within the free tier and keeps responses fast, at the acceptable cost of slightly less complete amenity coverage in very dense areas

---  
<br>
<br>
<br>
<br>

## Getting Started Locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running Tests
```bash
npm run test:run
```