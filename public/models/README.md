# 3D models

Both models are committed in their compressed form. They change approximately
never, so transcoding them on every deploy would be latency for a byte-identical
artifact, and a build step that failed would silently ship the 40 MB originals.
The commands below are recorded so the transform is reproducible without being a
build dependency.

| Model        | Before  | After  | Requests |
| ------------ | ------- | ------ | -------- |
| `desktop-pc` | 16.1 MB | 3.5 MB | 53 → 1   |
| `planet`     | 3.0 MB  | 848 KB | 5 → 1    |

Compression is `EXT_texture_webp` plus `KHR_mesh_quantization`. Both are decoded
natively by three.js with no decoder download, so nothing had to be added to the
`Content-Security-Policy` in `next.config.ts`. Draco was rejected for needing
`www.gstatic.com`, and Meshopt for needing `'wasm-unsafe-eval'`.

Run with `npx --yes @gltf-transform/cli@4`; it vendors its own `sharp` and is not
a project dependency.

## desktop-pc

The passes are chained by hand rather than run through `optimize`, because
`optimize` enables `join`, `flatten`, `instance` and `palette` by default and
every one of those rewrites node or material names. `components/canvas/Computers.tsx`
branches on `child.name` and `child.material.name` to apply the theme tint, so
those defaults would silently break it. After the chain below, node count (1514),
material count (86) and every name match are identical to the source.

```bash
gltf-transform dedup   scene.gltf  pc1.glb
gltf-transform prune   pc1.glb     pc2.glb
gltf-transform resize  pc2.glb     pc3.glb --width 1024 --height 1024

# Lossless first on the one metallicRoughness map, so the two lossy passes below
# skip it: they select by source format, and it is already webp by then.
gltf-transform webp    pc3.glb     pc4.glb --slots metallicRoughnessTexture --lossless true
gltf-transform webp    pc4.glb     pc5.glb --formats png  --quality 80
gltf-transform webp    pc5.glb     pc6.glb --formats jpeg --quality 80

gltf-transform quantize pc6.glb    scene.glb
```

## planet

`components/canvas/Earth.tsx` renders a bare `<primitive>` with no name-based
logic and the model has 2 meshes, so `optimize`'s defaults are safe. `simplify`
is off because it is a UV sphere and decimation wrecks the texture mapping.

```bash
gltf-transform optimize scene.gltf scene.glb \
  --compress quantize --texture-compress webp --texture-size 1024 --simplify false
```

## Licences

Both models are CC-BY-4.0 and **have been modified** by the transforms above,
which CC-BY requires stating. Each keeps its original `license.txt`; the
attribution the licence requires is in `CREDITS.md` at the repo root.
