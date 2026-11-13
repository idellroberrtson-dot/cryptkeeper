# Requirements Document: CryptKeeper Core

## Introduction
CryptKeeper is a Halloween-themed developer productivity web application built for the Kiroween 2026 Costume Contest. It turns abandoned side projects into interactive tombstones that developers can diagnose, resurrect into active sprints, and complete through timed Midnight Ritual focus sessions.

## Requirements

### Requirement 1: Side-Project Graveyard Management
**User Story:** As a developer with unfinished repositories, I want to bury abandoned projects in a themed graveyard with their epitaph and cause of death, so that I can visually track and selectively revive them.

#### Acceptance Criteria
1. WHEN the application loads for the first time with no `localStorage` state THEN the system SHALL seed 6 realistic sample projects across dormant, resurrected, and shipped states.
2. WHEN a user creates a new grave entry with title, stack, epitaph, and cause of death THEN the system SHALL persist the entry to `localStorage` and render it immediately in the Graveyard grid.
3. WHEN a user filters the Graveyard by status (`All`, `Dormant`, `Resurrected`, `Ascended`) or searches by text/stack THEN the system SHALL filter matching tombstones in real time.
4. WHEN a user clicks `Resurrect` on a dormant project THEN the system SHALL transition its status to `resurrected`, record the revival timestamp, and make it selectable in the Ritual Chamber.

### Requirement 2: Midnight Ritual Focus Chamber
**User Story:** As a developer reviving a project, I want an atmospheric focus timer paired with micro-tasks and procedural ambient audio, so that I can sustain deep work sessions without distractions.

#### Acceptance Criteria
1. WHEN a user selects a resurrected project in the Ritual Chamber THEN the system SHALL display its ritual checklist tasks and allow adding, toggling, or deleting tasks.
2. WHEN a user selects a timer preset (`25m`, `15m`, `5m`, or `10s Demo`) and clicks `Begin Ritual` THEN the countdown ring SHALL decrement smoothly every second until reaching zero.
3. WHEN a ritual countdown completes THEN the system SHALL increment the project's completed ritual count, add total focus minutes, and play a synthesized bell chime if audio is enabled.
4. WHEN a user toggles ambient soundscapes (`Night Rain`, `Crypt Wind`, `Silence`) THEN the Web Audio synthesizer SHALL generate procedural audio locally without external media files.

### Requirement 3: Necronomicon Analytics & Portable Backups
**User Story:** As a user, I want insights into why my projects die and the ability to export or reset my crypt data, so that my workflow stays portable and easy to demonstrate.

#### Acceptance Criteria
1. WHEN viewing the Necronomicon Analytics tab THEN the system SHALL display revival rate, total ritual focus minutes, completed tasks, and a breakdown of causes of death.
2. WHEN clicking `Export Crypt JSON` THEN the system SHALL download a valid JSON snapshot of all projects, tasks, and metrics.
3. WHEN importing a JSON snapshot THEN the system SHALL validate the schema before overwriting state and surface a clear error message if invalid.
4. WHEN clicking `Reset Sample Crypt` THEN the system SHALL restore the curated initial dataset cleanly.
