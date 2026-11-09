# Mushroom Substrate

Physical simulators of how fungi grow: mycelial networks, the transport and signaling inside
them, the mushrooms they produce, and the substrate around them. Up to 100 kinds of mushroom,
each a research-backed data file, loaded into one of four simulator engines of increasing size:
4K, 40K, 400K and 4M bytes.

- [docs/PLAN.md](docs/PLAN.md): the plan.
- [docs/research/](docs/research/): what the models are based on, with sources.
- [notes.md](notes.md): Matt's notes.
- [CLAUDE.md](CLAUDE.md): rules for working in this repo.

## Status

The first research pass is done ([docs/research/README.md](docs/research/README.md)), the model
is specified ([docs/MODEL.md](docs/MODEL.md)), and the 4K, 40K and 400K engines are built. There
are 90 species in 12 families ([species/README.md](species/README.md)). The 4M engine is not
built yet.

## Run

Needs Node 20 or later, no install.

```bash
node tools/check.js
```

prints each tier's size against its limit.

```bash
node tools/test.js
```

checks that each engine gives the same result for the same seed, and prints its speed.

```bash
node tools/pack.js
```

rewrites each engine's packed species files from `species/`. Run it after editing a species.

To see an engine locally, serve the repo root (`python3 -m http.server 4173`) and open
`http://localhost:4173/engines/4k/`.

```bash
node tools/build-site.js
```

builds the site into `_site/`.
