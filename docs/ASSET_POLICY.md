# Asset policy

Visual Assets is a semantic asset registry, not a dumping ground for downloaded images.

Rules:

- Prefer original parametric assets over fixed raster files.
- Every imported asset requires provenance and an explicit license record.
- Runtime use must not require a third-party API or remote CDN.
- Fonts are referenced by family or user/system installation; font binaries are not committed here.
- Assets should expose semantic IDs that remain stable while visual implementations may evolve.
- Large optional packs should be versioned independently so Studio and Engine can load only what they need.

The first pack intentionally focuses on deterministic primitives that can be rendered by Visual Engine.
