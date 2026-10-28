# Forge v3: update guide

## Updating your existing Forge repository
1. Extract this ZIP.
2. Open your existing Forge repository on GitHub, then **Add file > Upload files**.
3. Select the 7 individual files (not the folder, not the ZIP) and drag them in. Overwrite when asked.
4. **Commit changes** and wait 1–2 minutes.
5. On your iPhone, open Forge once while online. If it still looks old, delete the Home Screen icon, open the link in Safari, and add it again via Share > Add to Home Screen.

Files: `index.html`, `app.js`, `manifest.webmanifest`, `service-worker.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`.

## Your old data
This version stores data under a new name (`fg3.`), so your previous Forge data is **not deleted**, but it is not shown either: the program changed, so history starts fresh. If you want to keep the old data, export a backup from the old version first.

## What changed
- **Timer first.** The app opens on a dedicated Timer page. A compact mini-timer stays pinned at the top of the Train page, and each exercise has a one-tap "Rest" button with the recommended time.
- **Alarm.** A chime, a full-screen "Rest complete" screen and vibration (where supported). Volume, vibration, mute and a "Test alarm" button are on the Timer page. Keep-screen-on is used while timing. iPhone pauses web apps when the screen locks, so keep Forge open during rests.
- **History page.** A month calendar. Black dots are heavy sessions and hollow dots are easy sessions. Tap a day to expand every exercise with kg, reps and RIR, duration and PR badges.
- **Kg tracked per variation.** Changing the dropdown switches to that variation's own history, last performance and suggestion. The heading shows the variation you picked.
- **Mode-aware suggestions.** Heavy: repeat the load and add a rep, or step up once you hit the top of the range. Easy: about 12% below your last heavy load. Tap "Use" to fill the load.
- **New program** for a wide, thick upper body: Back & Biceps, Lower, Chest & Shoulders, Back, Traps & Arms. Plate-loaded pulldowns, T-bar row and hack/45° press come first in their dropdowns.
- **Per-set reps fields** with a number keypad. Typing never re-renders the card, so the keyboard no longer closes after one digit.
- **Stable tab bar.** The navigation is part of the layout, not a floating layer, so fast scrolling cannot make it disappear.
- **Luxury black / grey / white design** with animated page transitions, a sliding Heavy/Easy switch, press feedback and a spring-animated completion sheet.
- **Optional tracking** (More page, off by default): body measurements tagged morning / daytime / evening, and nutrition targets (2,700 kcal, 165 g protein starting point).
- Heavy/Easy recommendation from readiness and recent history, indefinite blocks, personal bests, weekly sets per muscle, backup and restore (with validation) are all kept.

## Notes
- Weekly-set bars on the Progress page count direct sets fully and indirect sets as half.
- Restoring a backup replaces the data currently on the device.
- Next time you publish an update, bump `CACHE` in `service-worker.js` (e.g. `forge-v4`).
