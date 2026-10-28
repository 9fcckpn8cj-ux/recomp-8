# Forge v3.1: iPhone 17 Pro Max layout + new icon

## Update your repository
1. Extract this ZIP.
2. Open your Forge repository on GitHub, then **Add file > Upload files**.
3. Select ALL the files from the extracted folder (14 files: `index.html`, `app.js`, `manifest.webmanifest`, `service-worker.js`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, six `splash-*.png` files, and this README). Drag them in. Do not drag the folder itself.
4. **Commit changes** and wait 1–2 minutes.

## Important: re-add the app to your Home Screen
iPhone saves the app icon and launch screen at the moment you add the app, so an update does not change them by itself.
1. Long-press the old Forge icon > **Remove App** > **Delete from Home Screen**.
2. Open your Forge link in **Safari**.
3. **Share > Add to Home Screen > Add**.
Your training history stays on the device (it lives in Safari's storage for your site), but export a backup first if you want to be safe: More > Export backup.

## What changed
- **Layout tuned for iPhone 17 Pro Max** (440 x 956, Dynamic Island, home indicator). Tested on seven iPhone sizes.
  - The top of the screen is now a slim dark band under the Dynamic Island, so the status bar is always readable. Page titles no longer have a doubled gap above them.
  - All four workout tabs are visible at once (2 x 2), with nothing hidden off the side.
  - The timer is larger and scales with the screen. On short screens (iPhone SE) it compacts so Start never falls below the tab bar.
  - The app now pins itself to the screen edges instead of relying on viewport-height units, which iOS measures inconsistently in Home Screen mode.
  - A custom launch screen for each current iPhone size, so there is no white flash when the app opens.
- **New icon.** A silver rear view of a broad back with heavy traps and forge sparks struck off the shoulder, on graphite. It reflects the goal (wide, thick, dense) and the name (Forge).
