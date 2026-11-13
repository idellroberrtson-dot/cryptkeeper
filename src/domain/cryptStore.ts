import type {
  CauseOfDeath,
  CryptProject,
  CryptState,
  CryptStats,
  NewGraveInput,
  ProjectStatus,
} from './types'

export const STORAGE_KEY = 'cryptkeeper.v1'

export const CAUSES_OF_DEATH: CauseOfDeath[] = [
  'Scope Creep',
  'Shiny New Idea',
  'Auth & Config Hell',
  'Burnout',
  'Dependency Rot',
  'Lost Motivation',
]

function makeId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function createInitialCryptState(): CryptState {
  const projects: CryptProject[] = [
    {
      id: 'proj-wasm-notes',
      name: 'ObsidianVault.wasm',
      stack: ['Rust', 'WebAssembly', 'IndexedDB'],
      epitaph: 'Died mid-refactor chasing 0.2ms faster markdown parsing.',
      causeOfDeath: 'Scope Creep',
      status: 'resurrected',
      buriedDate: '2025-11-18',
      resurrectedAt: '2026-11-10T20:00:00.000Z',
      ritualsCompleted: 3,
      focusMinutes: 75,
      tasks: [
        {
          id: 'task-1',
          title: 'Trim custom lexer and ship plain editor MVP',
          done: true,
          createdAt: '2026-11-10T20:05:00.000Z',
        },
        {
          id: 'task-2',
          title: 'Wire localStorage fallback for Safari private mode',
          done: false,
          createdAt: '2026-11-10T20:10:00.000Z',
        },
        {
          id: 'task-3',
          title: 'Publish static demo build to GitHub Pages',
          done: false,
          createdAt: '2026-11-11T09:00:00.000Z',
        },
      ],
    },
    {
      id: 'proj-tab-necromancer',
      name: 'TabNecromancer v4',
      stack: ['TypeScript', 'Chrome MV3', 'SQLite'],
      epitaph: 'Abandoned after rebuilding the popup UI three times in a weekend.',
      causeOfDeath: 'Shiny New Idea',
      status: 'dormant',
      buriedDate: '2026-02-04',
      ritualsCompleted: 0,
      focusMinutes: 0,
      tasks: [
        {
          id: 'task-4',
          title: 'Collapse 400 open tabs into domain snapshots',
          done: false,
          createdAt: '2026-02-04T12:00:00.000Z',
        },
      ],
    },
    {
      id: 'proj-oauth-dungeon',
      name: 'IndieSaaS Starter',
      stack: ['Next.js', 'Postgres', 'OAuth2'],
      epitaph: 'Perished silently inside a 14-file RBAC middleware labyrinth.',
      causeOfDeath: 'Auth & Config Hell',
      status: 'dormant',
      buriedDate: '2026-04-22',
      ritualsCompleted: 1,
      focusMinutes: 25,
      tasks: [
        {
          id: 'task-5',
          title: 'Replace multi-tenant policy engine with single-user magic link',
          done: false,
          createdAt: '2026-04-22T18:00:00.000Z',
        },
      ],
    },
    {
      id: 'proj-roguelike-ascii',
      name: 'Lantern & Bone',
      stack: ['Canvas', 'TypeScript', 'WebAudio'],
      epitaph: 'Got lost designing procedural dungeon lore before player movement worked.',
      causeOfDeath: 'Scope Creep',
      status: 'resurrected',
      buriedDate: '2026-06-14',
      resurrectedAt: '2026-11-11T14:30:00.000Z',
      ritualsCompleted: 2,
      focusMinutes: 50,
      tasks: [
        {
          id: 'task-6',
          title: 'Lock map size to 16x16 crypt rooms',
          done: true,
          createdAt: '2026-11-11T14:35:00.000Z',
        },
        {
          id: 'task-7',
          title: 'Add keyboard WASD lantern flicker radius',
          done: false,
          createdAt: '2026-11-11T15:00:00.000Z',
        },
      ],
    },
    {
      id: 'proj-rss-cauldron',
      name: 'NightOwl RSS',
      stack: ['Go', 'HTMX', 'SQLite'],
      epitaph: 'Once slept for 8 months due to a broken Docker Compose volume.',
      causeOfDeath: 'Dependency Rot',
      status: 'ascended',
      buriedDate: '2025-09-09',
      resurrectedAt: '2026-10-31T21:00:00.000Z',
      ascendedAt: '2026-11-05T19:00:00.000Z',
      ritualsCompleted: 5,
      focusMinutes: 125,
      tasks: [
        {
          id: 'task-8',
          title: 'Upgrade Go stdlib feed parser and pin dependencies',
          done: true,
          createdAt: '2026-10-31T21:10:00.000Z',
        },
        {
          id: 'task-9',
          title: 'Ship single binary release on GitHub',
          done: true,
          createdAt: '2026-11-03T11:00:00.000Z',
        },
      ],
    },
    {
      id: 'proj-cli-changelog',
      name: 'GhostLog CLI',
      stack: ['Node.js', 'Git', 'Markdown'],
      epitaph: 'Stalled at 90% done because writing docs felt scarier than shipping.',
      causeOfDeath: 'Burnout',
      status: 'dormant',
      buriedDate: '2026-08-19',
      ritualsCompleted: 0,
      focusMinutes: 0,
      tasks: [
        {
          id: 'task-10',
          title: 'Add --since-tag flag and publish v0.1.0',
          done: false,
          createdAt: '2026-08-19T16:00:00.000Z',
        },
      ],
    },
  ]

  return {
    version: 1,
    activeProjectId: 'proj-wasm-notes',
    totalSoulSparks: 11,
    projects,
  }
}

export function buryProject(state: CryptState, input: NewGraveInput): CryptState {
  const id = makeId('proj')
  const nowIso = new Date().toISOString()
  const initialTask = input.initialTask?.trim()

  const newProject: CryptProject = {
    id,
    name: input.name.trim(),
    stack: input.stack.map((s) => s.trim()).filter(Boolean),
    epitaph: input.epitaph.trim(),
    causeOfDeath: input.causeOfDeath,
    status: 'dormant',
    buriedDate: input.buriedDate || nowIso.slice(0, 10),
    ritualsCompleted: 0,
    focusMinutes: 0,
    tasks: initialTask
      ? [
          {
            id: makeId('task'),
            title: initialTask,
            done: false,
            createdAt: nowIso,
          },
        ]
      : [],
  }

  return {
    ...state,
    projects: [newProject, ...state.projects],
  }
}

export function transitionProjectStatus(
  state: CryptState,
  projectId: string,
  nextStatus: ProjectStatus,
): CryptState {
  const nowIso = new Date().toISOString()
  let sparkBonus = 0

  const projects = state.projects.map((proj) => {
    if (proj.id !== projectId) return proj

    if (nextStatus === 'resurrected' && proj.status === 'dormant') {
      sparkBonus = 1
      return {
        ...proj,
        status: 'resurrected' as const,
        resurrectedAt: proj.resurrectedAt ?? nowIso,
      }
    }

    if (nextStatus === 'ascended' && proj.status !== 'ascended') {
      sparkBonus = 3
      return {
        ...proj,
        status: 'ascended' as const,
        ascendedAt: nowIso,
      }
    }

    return {
      ...proj,
      status: nextStatus,
    }
  })

  const nextActiveId =
    nextStatus === 'resurrected'
      ? projectId
      : state.activeProjectId === projectId && nextStatus === 'dormant'
        ? projects.find((p) => p.status === 'resurrected')?.id ?? null
        : state.activeProjectId

  return {
    ...state,
    activeProjectId: nextActiveId,
    totalSoulSparks: state.totalSoulSparks + sparkBonus,
    projects,
  }
}

export function removeProject(state: CryptState, projectId: string): CryptState {
  const projects = state.projects.filter((p) => p.id !== projectId)
  const activeProjectId =
    state.activeProjectId === projectId
      ? projects.find((p) => p.status === 'resurrected')?.id ?? projects[0]?.id ?? null
      : state.activeProjectId

  return {
    ...state,
    activeProjectId,
    projects,
  }
}

export function addTaskToProject(
  state: CryptState,
  projectId: string,
  title: string,
): CryptState {
  const trimmed = title.trim()
  if (!trimmed) return state

  const nowIso = new Date().toISOString()
  return {
    ...state,
    projects: state.projects.map((proj) =>
      proj.id === projectId
        ? {
            ...proj,
            tasks: [
              ...proj.tasks,
              {
                id: makeId('task'),
                title: trimmed,
                done: false,
                createdAt: nowIso,
              },
            ],
          }
        : proj,
    ),
  }
}

export function toggleTaskInProject(
  state: CryptState,
  projectId: string,
  taskId: string,
): CryptState {
  let sparkDelta = 0
  const projects = state.projects.map((proj) => {
    if (proj.id !== projectId) return proj
    return {
      ...proj,
      tasks: proj.tasks.map((task) => {
        if (task.id !== taskId) return task
        const nextDone = !task.done
        sparkDelta = nextDone ? 1 : -1
        return { ...task, done: nextDone }
      }),
    }
  })

  return {
    ...state,
    totalSoulSparks: Math.max(0, state.totalSoulSparks + sparkDelta),
    projects,
  }
}

export function deleteTaskFromProject(
  state: CryptState,
  projectId: string,
  taskId: string,
): CryptState {
  return {
    ...state,
    projects: state.projects.map((proj) =>
      proj.id === projectId
        ? {
            ...proj,
            tasks: proj.tasks.filter((t) => t.id !== taskId),
          }
        : proj,
    ),
  }
}

export function recordCompletedRitual(
  state: CryptState,
  projectId: string | null,
  minutesLogged: number,
): CryptState {
  const safeMinutes = Math.max(1, Math.round(minutesLogged))
  return {
    ...state,
    totalSoulSparks: state.totalSoulSparks + 2,
    projects: state.projects.map((proj) =>
      proj.id === projectId
        ? {
            ...proj,
            ritualsCompleted: proj.ritualsCompleted + 1,
            focusMinutes: proj.focusMinutes + safeMinutes,
          }
        : proj,
    ),
  }
}

export function computeCryptStats(state: CryptState): CryptStats {
  const totalProjects = state.projects.length
  const dormantCount = state.projects.filter((p) => p.status === 'dormant').length
  const resurrectedCount = state.projects.filter((p) => p.status === 'resurrected').length
  const ascendedCount = state.projects.filter((p) => p.status === 'ascended').length

  const revivedOrShipped = resurrectedCount + ascendedCount
  const revivalRatePercent =
    totalProjects === 0 ? 0 : Math.round((revivedOrShipped / totalProjects) * 100)

  const totalRituals = state.projects.reduce((acc, p) => acc + p.ritualsCompleted, 0)
  const totalFocusMinutes = state.projects.reduce((acc, p) => acc + p.focusMinutes, 0)

  const allTasks = state.projects.flatMap((p) => p.tasks)
  const completedTasks = allTasks.filter((t) => t.done).length

  const causeCounts = new Map<CauseOfDeath, number>()
  for (const cause of CAUSES_OF_DEATH) {
    causeCounts.set(cause, 0)
  }
  for (const proj of state.projects) {
    causeCounts.set(proj.causeOfDeath, (causeCounts.get(proj.causeOfDeath) ?? 0) + 1)
  }

  const causeBreakdown = Array.from(causeCounts.entries())
    .map(([cause, count]) => ({
      cause,
      count,
      percentage: totalProjects === 0 ? 0 : Math.round((count / totalProjects) * 100),
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count)

  return {
    totalProjects,
    dormantCount,
    resurrectedCount,
    ascendedCount,
    revivalRatePercent,
    totalRituals,
    totalFocusMinutes,
    completedTasks,
    totalTasks: allTasks.length,
    causeBreakdown,
  }
}

export function formatDurationClock(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds))
  const mins = Math.floor(clamped / 60)
  const secs = clamped % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function loadCryptState(): CryptState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialCryptState()
    return parseCryptBackup(raw)
  } catch {
    return createInitialCryptState()
  }
}

export function saveCryptState(state: CryptState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore storage quota errors in restricted browsing contexts
  }
}

export function parseCryptBackup(rawJson: string): CryptState {
  const parsed: unknown = JSON.parse(rawJson)
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid crypt backup: expected a JSON object.')
  }

  const candidate = parsed as Record<string, unknown>
  if (candidate.version !== 1 || !Array.isArray(candidate.projects)) {
    throw new Error('Invalid crypt backup: missing version 1 schema or projects array.')
  }

  const validProjects: CryptProject[] = candidate.projects.map((item, idx) => {
    if (!item || typeof item !== 'object') {
      throw new Error(`Invalid project entry at index ${idx}.`)
    }
    const proj = item as Record<string, unknown>
    if (
      typeof proj.id !== 'string' ||
      typeof proj.name !== 'string' ||
      typeof proj.epitaph !== 'string'
    ) {
      throw new Error(`Project at index ${idx} is missing required string fields.`)
    }

    const status =
      proj.status === 'dormant' ||
      proj.status === 'resurrected' ||
      proj.status === 'ascended'
        ? proj.status
        : 'dormant'

    const causeOfDeath = CAUSES_OF_DEATH.includes(proj.causeOfDeath as CauseOfDeath)
      ? (proj.causeOfDeath as CauseOfDeath)
      : 'Scope Creep'

    const tasks = Array.isArray(proj.tasks)
      ? proj.tasks
          .filter((t): t is Record<string, unknown> => Boolean(t && typeof t === 'object'))
          .map((t, tIdx) => ({
            id: typeof t.id === 'string' ? t.id : `imported-task-${idx}-${tIdx}`,
            title: typeof t.title === 'string' ? t.title : 'Untitled ritual step',
            done: Boolean(t.done),
            createdAt:
              typeof t.createdAt === 'string' ? t.createdAt : new Date().toISOString(),
          }))
      : []

    return {
      id: proj.id,
      name: proj.name,
      stack: Array.isArray(proj.stack)
        ? proj.stack.filter((s): s is string => typeof s === 'string')
        : [],
      epitaph: proj.epitaph,
      causeOfDeath,
      status,
      buriedDate:
        typeof proj.buriedDate === 'string'
          ? proj.buriedDate
          : new Date().toISOString().slice(0, 10),
      resurrectedAt:
        typeof proj.resurrectedAt === 'string' ? proj.resurrectedAt : undefined,
      ascendedAt: typeof proj.ascendedAt === 'string' ? proj.ascendedAt : undefined,
      ritualsCompleted:
        typeof proj.ritualsCompleted === 'number' && proj.ritualsCompleted >= 0
          ? proj.ritualsCompleted
          : 0,
      focusMinutes:
        typeof proj.focusMinutes === 'number' && proj.focusMinutes >= 0
          ? proj.focusMinutes
          : 0,
      tasks,
    }
  })

  return {
    version: 1,
    activeProjectId:
      typeof candidate.activeProjectId === 'string' ? candidate.activeProjectId : null,
    totalSoulSparks:
      typeof candidate.totalSoulSparks === 'number' && candidate.totalSoulSparks >= 0
        ? candidate.totalSoulSparks
        : 0,
    projects: validProjects,
  }
}
