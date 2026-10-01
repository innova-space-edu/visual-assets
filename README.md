# Visual Assets

Semantic, versioned and local-first asset registry for Visual Engine.

Assets are addressed by stable semantic IDs such as `chemistry.molecule` or `math.axes.cartesian`. Prefer parametric assets that Visual Engine can reconstruct over opaque raster files.

## Rules

- runtime network access is not required;
- every imported asset needs provenance and license metadata;
- original parametric assets are preferred;
- large packs can evolve independently;
- applications reference stable IDs rather than implementation paths.

## Initial pack

The core pack contains mathematical axes/geometry, chemistry atoms/molecules, diagram connectors, educational callouts, optics primitives and technical dimension lines.

```js
import { resolveAsset } from "@innova-space/visual-assets";

const asset=resolveAsset("math.axes.cartesian",{step:25});
```

See `docs/ASSET_POLICY.md`.
