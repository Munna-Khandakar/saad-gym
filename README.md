# SAAD GYM

**Train Hard. Stay Consistent.**

A mobile-first personal workout tracker. Warm up, pick your plan, and work through the cycle one day at a time. The app remembers every finished day and celebrates when you complete the whole cycle. It runs entirely in the browser: no backend, no account and no environment variables.

## Features

- **Home page (`/`):** the intro, then **1. Warm-up** (10 min, checkable), then **2. Choose your level** (Beginner, Intermediate or Advanced (Pro)), then **3. Choose your plan** for that level. The chosen level is remembered.
- **Plan page (`/plan/beginner-1`):** day tabs, progress and the exercise checklist, with a back button to return home. Old `/plan/1` links redirect here.
- **Beginner Plan 1:** six workout days (Push, Pull, Legs, Rest / Cardio, Upper Body, Legs & Arms). Every other plan (Beginner Plan 2, Intermediate Plans 1–2, Advanced Plans 1–2) is coming soon. Add its days in `src/data/plans.ts` and its card becomes a link automatically.
- **Level colours:** Beginner is lime, Intermediate is a yellow-to-red blend and Advanced (Pro) is light red. The colour follows you onto that level's plan pages, so stepping up a level feels like it.
- **Weight log:** hold an exercise for 1 second, or tap its **kg** button, to save the weight you lifted (in kg). The row then shows it, so you can match or beat it next session. Weights are kept when you reset a day or start a new cycle. Each exercise keeps one weight, shared across every day and plan that uses it (Leg Extension on Day 3 and Day 6 shows the same number). Rest-day items have no weight.
- **My weights (`/weights`):** every exercise with its last weight and the date you logged it, grouped by Chest, Back, Shoulders, Legs and Arms, so you can see your numbers at a glance. Tap a row to change or remove a weight. Open it from the card on the home page or the weight icon at the top of a plan.
- **Cycle tracking:** ticks are kept until the cycle ends. Each day tab shows "Done · date", "x/y done" or "Not started", and a cycle bar shows "N of 6 days done".
- **Cycle complete:** finishing the last remaining day opens a celebration with **Start new cycle**, which clears the cycle. Choosing "Not now" keeps the data until you tap it.
- **Day 4 (Rest / Cardio):** done when **Rest day done** is ticked. Walking, Cycling and Battle Rope are optional extras.
- **Resets:** a small "Reset cycle" button on the cycle card and a "Reset Day N" button under each day, both with a confirmation step.
- **Warm-up:** each tick clears itself 4 hours later, ready for the next session.
- The last selected day is remembered, and every item has a large, touch-friendly checkbox.
- Keyboard accessible: arrow keys switch days, Space toggles items, and focus rings are visible.

## Adding exercises and plans

The workout data works like two small tables:

- `src/data/exercises.ts` lists every exercise once, keyed by a stable id: `"leg-extension": { name: "Leg Extension" }`.
- `src/data/plans.ts` lists the plans. Each day is a list of exercise ids:

```ts
exercises: ["squat", "leg-extension", { exercise: "walking", optional: true }]
```

Give each new exercise a `group` (`"chest"`, `"back"`, `"shoulders"`, `"legs"` or `"arms"`) so it appears under the right heading on My weights. Use `{ exercise, name: "…" }` to give one slot its own label. A misspelled id fails the type check. Don't rename an existing id, because its logged weight is stored under it.

## Keep your data: add to Home Screen

Safari deletes a website's saved data if you don't open it for 7 days. Installed web apps are exempt. On iPhone, open the app in Safari, tap **Share**, then **Add to Home Screen**, and use it from there. The app also asks the browser to keep its data permanently.

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

Exercise ticks are stored in `localStorage` under `saad-gym-workout-v2`. Each tick's id is the plan, day and exercise:

```json
{ "completions": [{ "itemId": "beginner-1/1/flat-bench-press", "dayId": 1, "completedAt": 1730000000000 }] }
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

The warm-up is stored with `"itemId": "warmup", "dayId": 0`. It is not counted in any day's progress.

Logged weights are stored under `saad-gym-weights-v2`, one entry per exercise (the latest):

```json
{ "weights": [{ "exerciseId": "flat-bench-press", "kg": 42.5, "updatedAt": 1730000000000 }] }
```

Data saved by older versions (`saad-gym-workout-v1` / `saad-gym-weights-v1`) is moved to the new keys automatically on first load. Where two old entries map to the same exercise, the newest weight wins.

The selected day is stored under `saad-gym-selected-day-v1`, and the selected level under `saad-gym-selected-level-v1`.

## Project structure

```
src/
├── app/              layout, home page, plan/[planId] page, global styles/theme
├── components/       HomeView, PlanView, WarmupCard, PlanCards, CycleTracker, DaySelector, ProgressTracker, WorkoutCard, …
│   └── ui/           shadcn/ui primitives
├── data/
│   ├── exercises.ts  exercise catalog (one entry per exercise)
│   ├── plans.ts      levels + plans referencing exercise ids
│   └── workouts.ts   warm-up, resolved plans and lookup helpers
├── hooks/            useWorkoutProgress: localStorage-backed store + expiry checks; useLongPress
├── lib/storage.ts    safe read/validate/prune/write helpers
└── types/workout.ts
```
