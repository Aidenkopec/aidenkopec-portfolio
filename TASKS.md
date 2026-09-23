# Particle Swarm Tasks

Full plan: `~/.claude/plans/pasted-content-id-8669-i-want-greedy-barto.md`
Big Bang hero plan: `~/.claude/plans/great-come-up-with-rosy-puffin.md`
Swarm everywhere plan: `~/.claude/plans/yes-do-that-come-sunny-aho.md`

## Planning

- [x] Read framework, styling, build setup
- [x] Read hero, navbar, sections, existing canvases, hooks, themes
- [x] Confirm GPGPU helper exists in installed three
- [x] Write plan covering all 8 points
- [x] B1. Frames go on Projects; Work link points to `#projects`
- [x] B2. Real text stays visible; cluster beside it spells the word on hover or focus
- [x] B3. Retire Computers, Earth, Stars, WavyLines, and ProjectRing (frames take Projects)
- [x] B4. Add Home; Blog stays a plain text link with no cluster

## Build

- [x] 1. Static points behind the homepage, desk removed
- [x] 2. GPU simulation with curl noise drift (32,768 particles, 60fps, `?swarm=fps` in dev)
- [x] 3. Name forms over the real heading (desktop verified; phone width not yet checked)
- [x] 4. Cursor wind (verified with a synthetic sweep: letters part along the path and close behind)
- [ ] 5. Click shockwave (works and re-forms from the click outward; the stronger tuning, reach 420 and full release, is not yet seen in the browser)
- [x] 6. Replaced by the black hole scroll exit (Big Bang hero, below)
- [x] 7. Dropped: nav clusters, so the hero is the one star moment
- [ ] 8. Theme colours (built: dust, hot dust and ring lean toward the accent; theme switch not yet seen in the browser)
- [ ] 9. Tiers and runtime downgrade (built: 32k, 16k, 8k; one step down after a slow 2s median; not yet tested under throttling)
- [ ] 10. Reduced motion, no WebGL fallback, touch (built: calm mode, sim null path, touch hold CSS; not yet tested in DevTools emulation)
- [ ] 11. Cleanup, lint, typecheck, build, format check (lint, typecheck, build and format check pass; Lighthouse LCP not yet measured)

## Big Bang hero

- [x] 0. Slot lookup scoped to the visible page (fixes the hidden duplicate h1)
- [x] 1. Centred hero: name, "Full Stack Developer"; tagline, dot and line removed; navbar logo hidden while the hero is in view
- [x] 2. Temperature colour (fast dust glows blue white) and depth parallax (formed name stays put)
- [x] 3. Gravity well primitive with capture at the horizon; shocks carry their own strength
- [x] 4. Press and hold grows a black hole; release bangs it back (click after a hold is swallowed)
- [x] 5. Black hole core, photon ring, bang flash, point lens bending the dust
- [x] 6. Intro: galaxy gathers, collapses, bangs, name forms (`?swarm=intro` in dev forces it)
- [x] 7. Name hidden before first paint on a fresh visit via an inline head script, 4s failsafe
- [x] 8. "Press and hold" hint after the intro, gone for good after the first hold
- [x] 9. Scroll exit: a black hole swallows the name as it scrolls away, then evaporates

## Swarm everywhere

- [ ] 1. Glass surfaces: `glass` and `glass-edge` utilities on every homepage card (built; not yet checked on all four themes)
- [ ] 2. Tech: glass tiles with masked logos, spotlight border, brand colour on hover and focus; Ball canvas removed (built and seen on desktop; phone width not yet checked)
- [ ] 3. Galaxy from the swarm beside the contact form; Earth, CanvasLoader and CanvasPlaceholder removed (built; not yet seen forming)
- [ ] 4. Send collapses the galaxy and bangs it; an error wobbles it; confetti removed (built; not yet seen)
- [ ] 5. Nav: no chrome over the hero, the name's dust streams into the nav line when the hero leaves (built; not yet seen)

## Found along the way

- Straight line integration near a spinning well pushed particles outward each frame and parked them in a ring they never left; position and velocity now turn by the exact orbit angle
- The dev server sometimes serves a stale `globals.css` after an edit; saving the file again picks it up
- Exit progress is measured from scroll distance, not screen centre: the name sits above centre because the subtitle and hint share its column
- Once formed, the real heading stays transparent for good; the swarm always rebuilds the name on screen, so holds and the scroll exit never flash the text back
- React warns about rendering `<script>`; `components/InlineScript.tsx` follows the Next guide ("Preventing flash before hydration")
- The subtitle stays painted from first paint (LCP safe); the planned tracking reveal was left out
- `components/canvas/WavyLines.tsx` and `Computers.tsx` still exist though they are no longer mounted on the homepage

- CLAUDE.md says Next.js 15; installed is 16.3.5
- Nav "Work" goes to Experience; Projects has no nav link
- `test/unit` and `test/helpers` are empty, no test runner
- Drifting dust still reads a little like a starfield: density is even everywhere. Shapes in step 3 should break that up; if not, add slow density variation to the drift
- Devices without `EXT_color_buffer_float` currently show no dust (same as the no WebGL fallback). The half float path is deferred to step 10
- Simplex noise is Ashima Arts MIT code; the notice is kept in `components/swarm/shaders.ts`
- drei's `StatsGl` strips its inline style, so the dev FPS panel needs positioning classes
- Hero heading now reads "Aiden Kopec"; the accent coloured "Aiden" span is gone since the text fades out
- The heading fits on one line at 40px on phones, so the planned two line phone layout may not be needed. Unverified: the browser window could not be resized for a phone check
- Scrolling back to the top re-forms the name with particles streaming in from above the viewport, since they were released off screen
- Spring damping scales with the square root of the ramp, which keeps it critically damped (no bounce) while the pull fades in
- Resizing the Chrome window through the browser tools hid it, which pauses rendering; avoid it and use DevTools device mode for phone checks
- A fast pointer jump (click tool teleport, touch, hard flick) made the wind drag huge and lopsided; the velocity used for drag is now capped at 1400 px/s
- Clicks on links, buttons and form fields do not trigger the shockwave
- The Chrome window used for checks keeps going hidden, which freezes rendering and makes screenshots look like nothing happens. Check `document.hidden` before trusting a still frame
- Step 6 was built, then reverted at your request; files are back to their exact end of step 5 state. Projects, About and Contact are untouched
- The page contains a second, hidden copy of the hero `<h1 data-swarm-slot="name">` inside a `display: none` wrapper (seen after client navigation in dev). `trackSlot` takes the first match, which is the visible one today, but that order is not guaranteed
- Chrome on macOS reports a fully covered window as hidden and stops rendering it; keep the Chrome window uncovered during browser checks
- A WebGL canvas cannot be read back from page script without `preserveDrawingBuffer`, so formation was verified by screenshots
- WebGL probe moved to `hooks/useSupportsWebGL.ts`; `useCanRender3D` now wraps it
- Removing StarsBackdrop left the `relative z-0` wrapper around Contact pointless, so it was removed
