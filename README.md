# CryptKeeper

**Bury abandoned side projects, diagnose what killed them, and resurrect them through atmospheric Midnight Ritual focus sessions.**

Built for the **Kiroween 2026 Hackathon — Costume Contest** category.

## Features

- **Side-Project Graveyard**: Interactive carved-slate tombstones with honest epitaphs, tech stack badges, and diagnosed *Causes of Death* (`Scope Creep`, `Shiny New Idea`, `Auth & Config Hell`, `Burnout`, `Dependency Rot`, `Lost Motivation`).
- **Midnight Ritual Chamber**: An SVG wax-burn countdown timer (`25m Ritual`, `15m Sprint`, `5m Embers`, plus a `10s Demo` mode) paired with project micro-tasks and Soul Spark progression.
- **Zero-Asset Web Audio Soundscape**: Procedural *Night Rain*, *Crypt Wind*, and *Bronze Ritual Bell* synthesized live via the browser Web Audio API—no external or copyrighted audio files.
- **Necronomicon Ledger**: Revival rate analytics, cause-of-death breakdown charts, schema-validated JSON backup export/import, and one-click sample crypt reset.
- **Local-First Privacy**: Runs 100% client-side in your browser via `localStorage` with no backend or API keys required.

## Kiro Architecture (`.kiro/`)

This repository includes the full `.kiro/` specification and workflow setup at the root:

- `.kiro/specs/cryptkeeper-core/` — `requirements.md` (EARS acceptance criteria), `design.md` (architecture & data flow), and `tasks.md` (implementation checklist).
- `.kiro/steering/` — Always-on `product.md` and `tech.md` steering plus `spooky-design.md` file-matched CSS guidelines.
- `.kiro/hooks/` — Agent hooks for automated Vitest execution on domain edits and compliance checks.

## Local Development

```bash
npm install
npm run dev
```

### Run Tests & Production Build

```bash
npm test
npm run build
```

## Deploy to GitHub Pages

This repo ships with `.github/workflows/deploy.yml`:

1. Push this repository to GitHub (`main` branch).
2. Open **Settings -> Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` automatically runs `npm test`, builds `./dist`, and publishes your live demo URL.

## License

[MIT](./LICENSE)
