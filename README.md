# Forge — publish through GitHub Pages

## What changed in this update

- **Removed the 8-week limit.** Forge is now a permanent training system. Training runs in repeating "blocks" of four phases (Adaptation → Progression → Productive → Recovery) that continue indefinitely — Block 1, Block 2, Block 3... with no end date. All history, records and streaks carry forward forever.
- **Added a manual Heavy / Easy switch.** A visible toggle on the dashboard lets you choose today's intensity directly. Heavy uses 3 sets / 6–12 reps / RIR 1–2 on main lifts; Easy uses 2 sets / 10–15 reps / RIR 3–4. Switching updates every exercise's prescription instantly.
- **Added a recommendation engine.** Based on your readiness check-in (energy, soreness, sleep, motivation) and your recent Heavy/Easy history, the dashboard suggests a mode — but never blocks you from choosing the other one.
- **Added a fatigue indicator** (Low / Moderate / High) and a **recovery status**, visible at a glance on the dashboard.
- **Added smart load suggestions.** Each exercise now shows your last logged performance and a suggested target for today — a lighter recovery load in Easy mode, or a small increase once you've hit the top of your rep range in Heavy mode.
- **Added a technique guide** (collapsed by default) under each exercise, so daily use stays clean.
- **Added a Performance Intelligence section**: an 8-session Heavy/Easy history strip, fatigue signals, muscle-group volume balance per workout, and a summary of your last completed session.
- **Added a last-backup tracker** with a reminder if it's been 14+ days since your last export.

## Publish once
1. Sign in to GitHub.
2. Create a new **public** repository, for example named `forge-app`.
3. Open the repository and select **Add file > Upload files**.
4. Extract this ZIP first, then upload all seven files directly (select the individual files inside the extracted folder, not the folder itself):
   - `index.html`
   - `app.js`
   - `manifest.webmanifest`
   - `service-worker.js`
   - `icon-192.png`
   - `icon-512.png`
   - `apple-touch-icon.png`
   Do not upload the ZIP itself.
5. Select **Commit changes**.
6. Open **Settings > Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**.
8. Select branch **main** and folder **/(root)**, then **Save**.
9. Wait about 1–3 minutes, then refresh — GitHub will show the live HTTPS address.

## Install on your iPhone
1. Open the GitHub Pages address in **Safari** (not the GitHub app or another preview).
2. Let the page load fully once while online.
3. Tap **Share → Add to Home Screen → Add**.
4. Open **Forge** from the new Home Screen icon for daily use.

## What's inside
- **Permanent, indefinite training system** — no end date, repeating blocks of four phases forever
- Flexible, non-day-locked workout rotation (Upper A → Lower A → Upper B → Lower B → repeat)
- **Manual Heavy / Easy switch** with an intelligent recommendation based on readiness and recent training history
- **Fatigue and recovery indicators** on the main dashboard
- **Smart per-exercise load suggestions** based on your own logged history for that specific exercise variation
- **Phase tracker**: a progress ring showing workouts completed in the current phase, plus a 32-workout history timeline
- **Streak counter**: consecutive completed rotations without a long gap
- **Personal record log**: automatically flags and stores a new best whenever a logged load (or reps at the same load) beats your previous entry for that exercise
- **Phase history list**: a compact log of every completed phase with its date range
- **Performance Intelligence panel**: Heavy/Easy session history, fatigue signals, muscle-group volume balance, last workout summary
- **Collapsible technique guide** per exercise, hidden until tapped
- Daily readiness check-in (segmented pill buttons: Energy, Soreness, Sleep, Motivation) with a traffic-light training recommendation
- Express / Standard / Complete duration modes that filter exercises by essential/recommended/optional tiers
- Exercise variation picker for every movement — machine-based alternatives only (free-weight squats and deadlifts intentionally excluded)
- Absolute-time rest timer that self-corrects after the phone locks or the app is backgrounded
- Weekly check-in: weight, waist, steps, sleep, energy, training quality, notes
- **Export backup** and **Restore from backup**, with a last-backup date reminder
- Offline support after the first successful online load
- Safe-storage fallback for browsers that restrict persistent storage
- Light theme (forced, ignores system dark mode), steel-blue accent, all text/button combinations verified against WCAG AA contrast standards
- Stable button rendering: workout, mode and intensity buttons are built once and only updated afterward, so rapid switching never causes an unresponsive tap

## Important data note
All workout, phase, PR and check-in data live on this specific phone/browser installation only — nothing is stored on GitHub. Use **Export backup** periodically, and especially before deleting the Home Screen app, clearing Safari data, or switching phones. Use **Restore from backup** afterward to bring the data back.

## If you already published an earlier version
Just re-upload these same seven filenames to the existing repository (**Add file > Upload files**, then commit, confirming the overwrite). The service worker cache name changed to `forge-v2`, so your phone will automatically fetch the corrected files the next time you open the installed app while online.

## Updating later
Upload replacement files using the same filenames. Bump the cache name in `service-worker.js` (e.g. `forge-v3`) whenever you push a future update, so your phone refreshes the cached app instead of reusing an older version.
