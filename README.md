# Forge — publish through GitHub Pages

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
- Flexible, non-day-locked workout rotation (Upper A → Lower A → Upper B → Lower B → repeat)
- Automatic 4-phase periodization (Adaptation → Progression → Productive → Recovery) that advances only when you complete a full rotation — never tied to the calendar
- **Phase tracker**: a progress ring showing workouts completed in the current phase, plus a 32-workout history timeline
- **Streak counter**: consecutive completed rotations without a long gap
- **Personal record log**: automatically flags and stores a new best whenever a logged load (or reps at the same load) beats your previous entry for that exercise
- **Phase history list**: a compact log of every completed phase with its date range
- Daily readiness check-in (segmented pill buttons: Energy, Soreness, Sleep, Motivation) with a traffic-light training recommendation
- Express / Standard / Complete duration modes that filter exercises by essential/recommended/optional tiers
- Exercise variation picker for every movement — machine-based alternatives only (free-weight squats and deadlifts intentionally excluded)
- Absolute-time rest timer that self-corrects after the phone locks or the app is backgrounded
- Weekly check-in: weight, waist, steps, sleep, energy, training quality, notes
- **Export backup** and **Restore from backup**
- Offline support after the first successful online load
- Safe-storage fallback for browsers that restrict persistent storage
- Light theme (forced, ignores system dark mode), steel-blue accent, all text/button combinations verified against WCAG AA contrast standards
- Stable button rendering: workout and mode picker buttons are built once and only updated afterward, so rapid switching never causes an unresponsive tap

## Important data note
All workout, phase, PR and check-in data live on this specific phone/browser installation only — nothing is stored on GitHub. Use **Export backup** periodically, and especially before deleting the Home Screen app, clearing Safari data, or switching phones. Use **Restore from backup** afterward to bring the data back.

## Updating later
Upload replacement files using the same filenames. Bump the cache name in `service-worker.js` (e.g. `forge-v2`) whenever you push a future update, so your phone refreshes the cached app instead of reusing an older version.
