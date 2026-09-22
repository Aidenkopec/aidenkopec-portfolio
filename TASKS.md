# Particle Swarm Tasks

Full plan: `~/.claude/plans/pasted-content-id-8669-i-want-greedy-barto.md`

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
- [ ] 6. Slots and scroll morph (globe, frames, envelope, dust)
- [ ] 7. Nav clusters and fly to section
- [ ] 8. Theme colours
- [ ] 9. Tiers and runtime downgrade
- [ ] 10. Reduced motion, no WebGL fallback, touch
- [ ] 11. Cleanup, lint, typecheck, build, format check

## Found along the way

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
