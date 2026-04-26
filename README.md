# Opal Ambassador OS (Vibe Coding Challenge)

## Overview

Opal Ambassador OS is a purpose-built CRM for managing a student ambassador network across partner schools. It's the operational backbone I'd want on day one of the role, as it's something that lets one person manage relationships, track momentum, and spot drop-offs across dozens of schools without losing the thread.

---

## What it does

- **Schools view** — ranks all partner schools by a composite engagement score. Click any school to open a report card with engagement trend, top ambassador, next planned activation, and a recommended action. Download a one-pager to share directly with a school coordinator.
- **Rankings** — leaderboard of all ambassadors scored by momentum (tier, activations completed, activity streak, recency of contact, Uncut Gem bonus). Includes a scoring philosophy explainer.
- **Pipeline** — Kanban board tracking every ambassador from Prospect through to Young Founders Network. Hover over tier headings for definitions. Active ambassadors highlighted with lime borders.
- **Calendar** — monthly view of activations and ambassador check-ins across the network. Click any event to preview details including times in London, New York, and Paris timezones. Add new events via a form.
- **The Feed** — a live digest of network highlights (The Dispatch) alongside a community wall of ambassador posts, ideas, wins, and stories (The Wall).
- **Yearbook** — grid of all ambassador cards with tier badges, Uncut Gem flags, streak indicators, and context-aware contact buttons (Contact vs Re-engage depending on drop-off status).
- **Signal Feed sidebar** — persistent across all views. Shows top 3 action points, drop-off alerts, overall engagement, most engaged school, ambassadors ready to level up, and upcoming activations. Includes a live counter of hours of focus saved across the network.
- **Launch a School wizard** — 3-step onboarding flow for bringing a new school into the programme: identify Uncut Gem prospects, align with school leadership, set 30-day trial goals.

---

## Tech stack

- Next.js (App Router)
- React
- Tailwind CSS
- Zustand (state management with localStorage persistence)
- Familjen Grotesk via Google Fonts
- Scaffolded with v0 by Vercel
- Developed and refined in Cursor using Claude Code
- Hosted on Vercel

---

## How to run locally

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open `localhost:3000` in your browser

Or just visit the live deployment: https://opal-challenge2.vercel.app/

---

## Approach

I used an iterative vibe coding workflow — starting with a detailed PRD and a precise v0 prompt, then refining in Cursor with Claude Code through feedback loops.

The focus was on building something I'd actually want to use in the role. Every feature connects back to a real operational problem: ambassador drop-offs going unnoticed, school relationships living in spreadsheets, the cold start problem when launching at a new school, and the challenge of surfacing students who wouldn't normally self-select into a wellness programme.

Key design decisions:
- Ranking system rewards momentum over status (i.e. it uplifts who's building and moving, not just who's been around longest)
- Uncut Gems are built into the system from the first step of school onboarding, not bolted on
- Contact buttons are context-aware (a dropped-off ambassador gets a different email template than an active one)
- The Share with School feature imagines the full workflow, not just the dashboard

---

## What I'd build next

- **Ambassador-facing view** — a lightweight portal where students can log their own activations, post to The Wall, and see their progress through the tiers.
- **Opal for Schools Dashboard integration** — connect to Opal's existing school dashboard so engagement scores are pulling from actual usage data, and so schools can see their own report card and upcoming activations without needing to contact Opal directly. 


---

## Notes

All data is seeded and fake. localStorage persistence means anything added via the Launch a School wizard survives a page refresh. Hit "Reset to demo data" (bottom left) to restore the original seed data at any time. Biggest challenge was telling myself when to stop adding new features, and trying to visualise the flow between all the pages! 

Built in approximately 4 hours. Prioritised working features and role-relevance over production-level architecture.
