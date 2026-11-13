export type CauseOfDeath =
  | 'Scope Creep'
  | 'Shiny New Idea'
  | 'Auth & Config Hell'
  | 'Burnout'
  | 'Dependency Rot'
  | 'Lost Motivation'

export type ProjectStatus = 'dormant' | 'resurrected' | 'ascended'

export interface RitualTask {
  id: string
  title: string
  done: boolean
  createdAt: string
}

export interface CryptProject {
  id: string
  name: string
  stack: string[]
  epitaph: string
  causeOfDeath: CauseOfDeath
  status: ProjectStatus
  buriedDate: string
  resurrectedAt?: string
  ascendedAt?: string
  ritualsCompleted: number
  focusMinutes: number
  tasks: RitualTask[]
}

export interface CryptState {
  version: 1
  activeProjectId: string | null
  totalSoulSparks: number
  projects: CryptProject[]
}

export type CryptTab = 'graveyard' | 'ritual' | 'necronomicon'

export type AmbientSoundscape = 'silence' | 'rain' | 'wind'

export interface NewGraveInput {
  name: string
  stack: string[]
  epitaph: string
  causeOfDeath: CauseOfDeath
  buriedDate?: string
  initialTask?: string
}

export interface CryptStats {
  totalProjects: number
  dormantCount: number
  resurrectedCount: number
  ascendedCount: number
  revivalRatePercent: number
  totalRituals: number
  totalFocusMinutes: number
  completedTasks: number
  totalTasks: number
  causeBreakdown: Array<{
    cause: CauseOfDeath
    count: number
    percentage: number
  }>
}
