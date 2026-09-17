# Credits

## Music

The three tracks under `public/music/` are third-party works. Their origin was not
recorded when they were added, so the artist and licence columns below are unresolved
and the player currently shows "Unknown artist" rather than a guessed name.

| File                   | Title            | Artist       | Source       | Licence      |
| ---------------------- | ---------------- | ------------ | ------------ | ------------ |
| `deep-space.mp3`       | Deep Space       | _unresolved_ | _unresolved_ | _unresolved_ |
| `synthwave-nights.mp3` | Synthwave Nights | _unresolved_ | _unresolved_ | _unresolved_ |
| `digital-dreams.mp3`   | Digital Dreams   | _unresolved_ | _unresolved_ | _unresolved_ |

**To resolve:** re-source the three tracks from a single provider with unambiguous terms
(Pixabay Audio is the simplest: one blanket licence, no attribution required, real artist
names on every track). Replace the files, fill in this table, and update the `playlist`
array in `context/MusicContext.tsx` plus the hydration fallback in
`components/FloatingMusicBar.tsx`.

Until then the audio is of unknown provenance and is **not** covered by this repository's
MIT licence. See `LICENSE`.
