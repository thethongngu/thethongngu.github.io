---
title: My WindowServer's CPU usage is always higher than 50%
date: 2026-10-09
---

## Debugging steps
- Turned on “Reduce transparency”.
    - WindowServer CPU stayed high, so transparency was not the main cause.
- Quit all apps, including menu bar apps.
    - WindowServer CPU stayed near 36%, so the cause was not only an open app.
- Measured WindowServer CPU in Terminal instead of Activity Monitor.
    - WindowServer CPU dropped to about 24%, because the Activity Monitor window itself added redraw work.
- Opened and quit Chrome.
    - WindowServer CPU went up to 40% and stayed there after Chrome quit.
- Recorded what WindowServer was doing for a few seconds.
    - WindowServer was not stuck; WindowServer redrew the screen without stop for three displays.
- Recorded all processes and counted which processes sent new frames to WindowServer.
    - The Aerial wallpaper process kept sending frames, so the moving wallpaper was the steady load.
- Changed every display to a still wallpaper.
    - WindowServer CPU dropped from about 30% to 15%, but short spikes to 30–40% remained.
- Checked the Aerial wallpaper process again.
    - The Aerial wallpaper process no longer sent frames, so the spikes had another source.
- Recorded WindowServer again after the wallpaper change.
    - The video work was gone; menu bar work and window animations remained.
- Ran a script that waits for a calm period and a spike, records both, and compares which processes send extra screen updates.
    - No app sent extra updates during the spike; only WindowServer itself did.
- Compared the main parts of WindowServer between the calm and the spike recordings.
    - The menu bar rebuild went from 0 to 97 samples, so the menu bar caused the spikes.
- Ran a script every second that lists all windows and prints the windows that changed, appeared, or disappeared.
    - Small menu bar items owned by WindowServer were removed and created again every few seconds on two displays.
- Looked at the menu bar during a spike.
    - The blinking item was the location arrow next to the Control Center icon.
- Turned off the location icon for System Services in the Location Services settings.
    - WindowServer CPU dropped to about 1% at idle.
- Root cause:
    - A system service keeps requesting the location, so the location arrow shows and hides every few seconds.
    - Each show or hide makes WindowServer rebuild the menu bar on every display, which causes the CPU spikes.
