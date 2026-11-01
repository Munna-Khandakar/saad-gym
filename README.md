# SAAD GYM

**Train Hard. Stay Consistent.**

A mobile-first personal workout tracker. Warm up, pick your plan, and work through the cycle one day at a time. The app remembers every finished day and celebrates when you complete the whole cycle. It runs entirely in the browser: no backend, no account and no environment variables.

## Features

- **Home page (`/`):** the intro, then **1. Warm-up** (10 min, checkable), then **2. Choose your plan**.
- **Plan page (`/plan/1`):** day tabs, progress and the exercise checklist, with a back button to return home.
- **Plan 1:** six workout days (Push, Pull, Legs, Rest / Cardio, Upper Body, Legs & Arms). **Plan 2:** coming soon. Add its days in `src/data/workouts.ts` and its card becomes a link automatically.
- **Cycle tracking:** ticks are kept until the cycle ends. Each day tab shows "Done · date", "x/y done" or "Not started", and a cycle bar shows "N of 6 days done".
- **Cycle complete:** finishing the last remaining day opens a celebration with **Start new cycle**, which clears the cycle. Choosing "Not now" keeps the data until you tap it.
- **Day 4 (Rest / Cardio):** done when **Rest day done** is ticked. Walking, Cycling and Battle Rope are optional extras.
- **Resets:** a small "Reset cycle" button on the cycle card and a "Reset Day N" button under each day, both with a confirmation step.
- **Warm-up:** each tick clears itself 4 hours later, ready for the next session.
- The last selected day is remembered, and every item has a large, touch-friendly checkbox.
- Keyboard accessible: arrow keys switch days, Space toggles items, and focus rings are visible.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Lucide icons · localStorage

## Local development

Requires Node.js 20 or newer.

```bash
npm install        # install dependencies
npm run dev        # start the dev server at http://localhost:3000
npm run lint       # lint
npm run build      # production build
npm start          # serve the production build
```

## Deploy to Vercel

Every page is prerendered as static content. The app needs no environment variables, secrets or backend.

**Option A: Git import (recommended)**

1. Push this folder to a GitHub, GitLab or Bitbucket repository.
2. On [vercel.com/new](https://vercel.com/new), import the repository.
3. Keep the detected defaults (Framework: Next.js, Build: `next build`) and click **Deploy**.

**Option B: CLI**

```bash
npx vercel          # preview deployment
npx vercel --prod   # production deployment
```

## How progress is stored

Completions are stored in `localStorage` under `saad-gym-workout-v1`:

```json
{ "completions": [{ "exerciseId": "d1-flat-bench-press", "dayId": 1, "completedAt": 1730000000000 }] }
```

- **Exercise ticks** stay until the day or cycle is reset, or until "Start new cycle" is tapped. A day's finish date is the time its last required item was ticked.
- **The warm-up tick** expires 4 hours after its `completedAt`. Expiry is always calculated with `Date.now()`, so reloading the page, closing the browser or suspending a background tab never resets or extends the clock.
- Expired, unknown, duplicate or corrupted entries are removed whenever the data is read. That happens:
  - when the app loads;
  - on a timer aimed at the next expiry, plus a 30-second safety check;
  - when the tab becomes visible or the window regains focus;
  - when the data changes in another tab.
- Unchecking an item deletes its entry immediately.
- Day and cycle progress are always calculated from the stored ticks. No separate "completed" flag is stored.
- Data lives only in this browser on this device. Clearing site data or switching devices starts fresh.

The warm-up is stored with `"exerciseId": "warmup", "dayId": 0`. It is not counted in any day's progress.

The selected day is stored separately under `saad-gym-selected-day-v1`.

## Project structure

```
src/
├── app/              layout, home page, plan/[planId] page, global styles/theme
├── components/       HomeView, PlanView, WarmupCard, PlanCards, CycleTracker, DaySelector, ProgressTracker, WorkoutCard, …
│   └── ui/           shadcn/ui primitives
├── data/workouts.ts  warm-up + plans/days/exercises (typed)
├── hooks/            useWorkoutProgress: localStorage-backed store + expiry checks
├── lib/storage.ts    safe read/validate/prune/write helpers
└── types/workout.ts
```
