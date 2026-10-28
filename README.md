# Forge v3.2: full-screen fix

## Update your repository
1. Extract this ZIP.
2. In your Forge repository on GitHub: **Add file > Upload files**.
3. Select all 14 files from the extracted folder (not the folder itself) and drag them in.
4. **Commit changes**, wait 1–2 minutes.

## Then re-add the app (important)
iPhone fixes some Home Screen app settings at the moment you add it.
1. Long-press the old Forge icon > **Remove App** > **Delete from Home Screen**.
2. Open your Forge link in **Safari**.
3. **Share > Add to Home Screen**, and make sure **Open as Web App** is switched ON, then **Add**.
4. Open Forge from the new icon.

Export a backup first (More > Export backup) if you want to be safe.

## How to check it worked
Open **More** and scroll to the bottom. A small line shows what your iPhone reports, for example:
`v3.2 · Home Screen app · view 440×956 · screen 440×956 · insets 62/34`
- If it says **v3.2**, the update reached the phone.
- If it says **Home Screen app**, you are in full-screen mode. If it says **Safari tab**, open Forge from the Home Screen icon instead.
- "view" height should match "screen" height. If the view is shorter, send me this line.

## What changed
- **Gap under the tab bar fixed.** On iOS, setting the page height as a percentage leaves a dead band about as tall as the status bar at the bottom of a Home Screen app. Forge now sizes itself in viewport units and re-measures itself on launch, when you return from the background, on rotation, and after the keyboard closes.
- If the page is ever 62 px short, it now closes the gap automatically (tested by forcing exactly that fault).
- The page background behind the app is now white, so even in a worst case any sliver reads as part of the tab bar instead of a grey strip.
- A short notice appears if Forge is opened in a Safari tab instead of from the Home Screen icon.
- Keyboard: closing the keyboard now resets the page scroll so nothing stays shifted.

## Known iOS limit
Apple's WebKit tracker has an open report that on iOS 26.1 and later, Home Screen web apps keep the status bar area reserved instead of drawing behind it. That area is drawn by iOS, so Forge cannot make it disappear. Forge paints a dark band under the clock and makes everything else edge to edge.
