# Visual Assets Platform Role

This repository is the local-first asset library for the Visual Platform.

## Asset rules

1. Prefer parametric/reconstructable assets over opaque bitmaps.
2. Every asset has a stable semantic ID and version.
3. Imported resources must include provenance and license metadata.
4. Required runtime assets must be self-hostable and must not depend on a third-party CDN.
5. Large optional packs may be loaded lazily.
6. Fonts are referenced by metadata here; font binaries are managed separately and are never committed by default.

## Pack roadmap

- core: geometry, connectors, educational primitives;
- science: physics, chemistry, biology;
- layout: cards, grids and diagram components;
- maps: projections, markers and cartographic symbols;
- technical: dimensions, floor-plan symbols and engineering primitives;
- illustration: reusable vector parts and procedural components;
- materials: deterministic textures/noise/pattern recipes.

The registry is designed so Visual Studio can browse, benchmark and validate assets without external services.
