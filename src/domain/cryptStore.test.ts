import { describe, expect, it } from 'vitest'
import {
  addTaskToProject,
  buryProject,
  computeCryptStats,
  createInitialCryptState,
  formatDurationClock,
  parseCryptBackup,
  recordCompletedRitual,
  toggleTaskInProject,
  transitionProjectStatus,
} from './cryptStore'

describe('cryptStore domain logic', () => {
  it('seeds curated projects and computes initial stats accurately', () => {
    const state = createInitialCryptState()
    expect(state.projects.length).toBe(6)

    const stats = computeCryptStats(state)
    expect(stats.totalProjects).toBe(6)
    expect(stats.dormantCount).toBe(3)
    expect(stats.resurrectedCount).toBe(2)
    expect(stats.ascendedCount).toBe(1)
    expect(stats.revivalRatePercent).toBe(50)
    expect(stats.totalFocusMinutes).toBe(275)
  })

  it('buries a new project and resurrects it into the active chamber', () => {
    let state = createInitialCryptState()
    state = buryProject(state, {
      name: 'GhostGraph',
      stack: ['React', 'D3'],
      epitaph: 'Froze during layout physics tuning.',
      causeOfDeath: 'Scope Creep',
      initialTask: 'Render basic static graph',
    })

    const created = state.projects[0]
    expect(created.name).toBe('GhostGraph')
    expect(created.status).toBe('dormant')
    expect(created.tasks).toHaveLength(1)

    const initialSparks = state.totalSoulSparks
    state = transitionProjectStatus(state, created.id, 'resurrected')
    const revived = state.projects.find((p) => p.id === created.id)
    expect(revived?.status).toBe('resurrected')
    expect(state.activeProjectId).toBe(created.id)
    expect(state.totalSoulSparks).toBe(initialSparks + 1)
  })

  it('tracks ritual tasks and completed focus sessions', () => {
    let state = createInitialCryptState()
    const targetId = 'proj-wasm-notes'

    state = addTaskToProject(state, targetId, 'Write keyboard shortcut guide')
    const proj = state.projects.find((p) => p.id === targetId)!
    const newTask = proj.tasks[proj.tasks.length - 1]
    expect(newTask.done).toBe(false)

    state = toggleTaskInProject(state, targetId, newTask.id)
    const afterToggle = state.projects.find((p) => p.id === targetId)!
    expect(afterToggle.tasks.find((t) => t.id === newTask.id)?.done).toBe(true)

    const beforeMinutes = afterToggle.focusMinutes
    state = recordCompletedRitual(state, targetId, 25)
    const afterRitual = state.projects.find((p) => p.id === targetId)!
    expect(afterRitual.focusMinutes).toBe(beforeMinutes + 25)
    expect(afterRitual.ritualsCompleted).toBe(afterToggle.ritualsCompleted + 1)
  })

  it('validates JSON backups and rejects malformed payloads', () => {
    const initial = createInitialCryptState()
    const serialized = JSON.stringify(initial)
    const restored = parseCryptBackup(serialized)
    expect(restored.projects).toHaveLength(initial.projects.length)

    expect(() => parseCryptBackup('{"version": 99}')).toThrow()
    expect(() => parseCryptBackup('not json')).toThrow()
  })

  it('formats countdown clocks consistently', () => {
    expect(formatDurationClock(1500)).toBe('25:00')
    expect(formatDurationClock(65)).toBe('01:05')
    expect(formatDurationClock(0)).toBe('00:00')
  })
})
