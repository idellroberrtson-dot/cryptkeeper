---
inclusion: always
---

# CryptKeeper Technical Steering

## Stack & Architecture
- **Runtime**: React 19 + TypeScript + Vite static SPA.
- **Styling**: Custom Vanilla CSS design system (`src/styles/tokens.css`, `src/index.css`) with CSS variables—no runtime CSS-in-JS overhead.
- **State & Storage**: Pure reducer/helper functions in `src/domain/cryptStore.ts` backed by `localStorage` (`cryptkeeper.v1`) with schema validation on JSON import.
- **Audio Engine**: Procedural Web Audio API synthesizer in `src/audio/ritualAudio.ts` using filtered noise buffers and harmonic oscillators, lazily initialized on user interaction.
- **Testing**: Vitest unit tests covering domain state transitions, resurrection analytics, timer formatting, and JSON backup validation.

## Deployment Target
- Configured with `base: './'` in `vite.config.ts` so the static `dist/` bundle works seamlessly on GitHub Pages under any repository subpath, Vercel, Netlify, or local preview.
