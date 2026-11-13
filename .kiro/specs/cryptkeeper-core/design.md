# Design Document: CryptKeeper Core

## Architecture Overview
CryptKeeper follows a clean separation between pure domain state logic, procedural Web Audio synthesis, and React UI components:

- `src/domain/types.ts`: Core domain types (`CryptProject`, `RitualTask`, `CauseOfDeath`, `ProjectStatus`, `CryptState`).
- `src/domain/cryptStore.ts`: Pure state transitions, analytics selectors (`computeCryptStats`), JSON import validator (`parseCryptBackup`), and curated seed data (`createInitialCryptState`).
- `src/audio/ritualAudio.ts`: Zero-asset Web Audio API sound engine (`RitualAudioEngine`) synthesizing filtered brown/pink noise for Night Rain and Crypt Wind plus a dual-partial bronze bell chime on ritual completion.
- `src/components/`:
  - `CryptHeader.tsx`: Navigation tabs (`Graveyard`, `Ritual Chamber`, `Necronomicon`), live soul-spark counter, and quick New Grave trigger.
  - `GraveyardView.tsx`: Search/filter controls, interactive engraved tombstone cards, and inline resurrection / ascension actions.
  - `NewGraveModal.tsx`: Accessible modal for burying a new side project with cause-of-death presets.
  - `RitualChamberView.tsx`: SVG wax-burn countdown ring, preset switcher (`25m / 15m / 5m / 10s Demo`), procedural soundscape mixer, and project task checklist.
  - `NecronomiconView.tsx`: Cause-of-death distribution bars, revival metrics, JSON export/import, and sample data reset.

## Data Flow & Persistence
All state mutations route through pure functions tested in `src/domain/cryptStore.test.ts` and sync to `localStorage` under key `cryptkeeper.v1`.
