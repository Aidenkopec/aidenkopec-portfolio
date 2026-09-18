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

**Modified:** all three were re-encoded from 256 kbps CBR to roughly 128 kbps VBR
(LAME `-q:a 5`) to cut 17 MB to 7.8 MB. Durations are unchanged. This does not
affect the provenance question below.

**To resolve:** re-source the three tracks from a single provider with unambiguous terms
(Pixabay Audio is the simplest: one blanket licence, no attribution required, real artist
names on every track). Replace the files, fill in this table, and update the `playlist`
array in `context/MusicContext.tsx` plus the hydration fallback in
`components/FloatingMusicBar.tsx`.

Until then the audio is of unknown provenance and is **not** covered by this repository's
MIT licence. See `LICENSE`.

## 3D models

Both models under `public/models/` are CC-BY-4.0 and require attribution. Both
have been **modified**: recompressed to `.glb` with WebP textures and quantized
meshes, and the desktop PC's textures were resized to a 1024 px maximum. See
`public/models/README.md` for the exact transform.

| File                   | Title             | Author                                         | Licence                                                  |
| ---------------------- | ----------------- | ---------------------------------------------- | -------------------------------------------------------- |
| `desktop-pc/scene.glb` | Gaming Desktop PC | [Yolala1232](https://sketchfab.com/Yolala1232) | [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/) |
| `planet/scene.glb`     | Stylized planet   | [cmzw](https://sketchfab.com/cmzw)             | [CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/) |

This work is based on ["Gaming Desktop PC"](https://sketchfab.com/3d-models/gaming-desktop-pc-d1d8282c9916438091f11aeb28787b66)
by [Yolala1232](https://sketchfab.com/Yolala1232), licensed under
[CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/), and on
["Stylized planet"](https://sketchfab.com/3d-models/stylized-planet-789725db86f547fc9163b00f302c3e70)
by [cmzw](https://sketchfab.com/cmzw), licensed under
[CC-BY-4.0](http://creativecommons.org/licenses/by/4.0/). Both were modified.

The per-model `license.txt` files are kept alongside the models.
