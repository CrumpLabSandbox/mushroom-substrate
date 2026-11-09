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

Research and setup. No engine is built yet.

## Run

Needs Node 20 or later, no install.

```bash
node tools/check.js
```

prints each tier's size against its limit.

```bash
node tools/build-site.js
```

builds the site into `_site/`.
