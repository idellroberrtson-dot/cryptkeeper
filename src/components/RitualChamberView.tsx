import { useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  CheckSquare,
  CloudRain,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Trash2,
  Volume2,
  VolumeX,
  Wind,
} from 'lucide-react'
import { ritualAudio } from '../audio/ritualAudio'
import { formatDurationClock } from '../domain/cryptStore'
import type { AmbientSoundscape, CryptProject } from '../domain/types'

interface RitualChamberViewProps {
  projects: CryptProject[]
  activeProjectId: string | null
  onSelectProject: (projectId: string) => void
  onAddTask: (projectId: string, title: string) => void
  onToggleTask: (projectId: string, taskId: string) => void
  onDeleteTask: (projectId: string, taskId: string) => void
  onCompleteRitual: (projectId: string | null, minutesLogged: number) => void
  onAscendProject: (projectId: string) => void
}

interface TimerPreset {
  id: string
  label: string
  seconds: number
  logMinutes: number
}

const PRESETS: TimerPreset[] = [
  { id: '25m', label: '25m Ritual', seconds: 25 * 60, logMinutes: 25 },
  { id: '15m', label: '15m Sprint', seconds: 15 * 60, logMinutes: 15 },
  { id: '5m', label: '5m Embers', seconds: 5 * 60, logMinutes: 5 },
  { id: 'demo', label: '10s Demo', seconds: 10, logMinutes: 5 },
]

export function RitualChamberView({
  projects,
  activeProjectId,
  onSelectProject,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onCompleteRitual,
  onAscendProject,
}: RitualChamberViewProps) {
  const selectableProjects = useMemo(() => {
    const active = projects.filter((p) => p.status === 'resurrected')
    return active.length > 0 ? active : projects
  }, [projects])

  const selectedProject =
    selectableProjects.find((p) => p.id === activeProjectId) ??
    selectableProjects[0] ??
    null

  const [presetId, setPresetId] = useState<string>('25m')
  const activePreset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]

  const [secondsLeft, setSecondsLeft] = useState<number>(activePreset.seconds)
  const [isRunning, setIsRunning] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [ambient, setAmbient] = useState<AmbientSoundscape>('silence')
  const [taskInput, setTaskInput] = useState('')

  useEffect(() => {
    if (!isRunning) return

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer)
          setIsRunning(false)
          setJustCompleted(true)
          ritualAudio.playRitualBell()
          onCompleteRitual(selectedProject?.id ?? null, activePreset.logMinutes)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isRunning, selectedProject?.id, activePreset.logMinutes, onCompleteRitual])

  const handleSelectPreset = (preset: TimerPreset) => {
    setIsRunning(false)
    setJustCompleted(false)
    setPresetId(preset.id)
    setSecondsLeft(preset.seconds)
  }

  const handleResetTimer = () => {
    setIsRunning(false)
    setJustCompleted(false)
    setSecondsLeft(activePreset.seconds)
  }

  const handleAmbientChange = (mode: AmbientSoundscape) => {
    setAmbient(mode)
    ritualAudio.setAmbient(mode)
  }

  const handleAddTaskSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!selectedProject || !taskInput.trim()) return
    onAddTask(selectedProject.id, taskInput)
    setTaskInput('')
  }

  const radius = 98
  const circumference = 2 * Math.PI * radius
  const progressRatio =
    activePreset.seconds > 0
      ? Math.max(0, Math.min(1, secondsLeft / activePreset.seconds))
      : 0
  const dashOffset = circumference * (1 - progressRatio)

  return (
    <section aria-labelledby="ritual-heading">
      <div className="view-banner">
        <div>
          <h1 id="ritual-heading" className="view-heading">
            The Midnight Ritual Chamber
          </h1>
          <p className="view-lead">
            Bind a resurrected repository to a focused countdown. Pair your sprint with
            browser-synthesized rain or crypt wind—zero external audio tracks.
          </p>
        </div>
      </div>

      <div className="ritual-layout">
        <div className="panel-card chamber-dial-wrap">
          <div className="preset-row" role="group" aria-label="Ritual duration presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                type="button"
                className={`preset-btn ${presetId === preset.id ? 'is-active' : ''}`}
                onClick={() => handleSelectPreset(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="dial-svg-box">
            <svg className="dial-svg" viewBox="0 0 220 220" aria-hidden="true">
              <circle className="dial-track" cx="110" cy="110" r={radius} />
              <circle
                className={`dial-progress ${justCompleted ? 'is-complete' : ''}`}
                cx="110"
                cy="110"
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="dial-readout">
              <span className="dial-clock">{formatDurationClock(secondsLeft)}</span>
              <span className="dial-state-label">
                {justCompleted
                  ? 'Ritual Complete'
                  : isRunning
                    ? 'Candle Burning'
                    : 'Ready to Summon'}
              </span>
            </div>
          </div>

          <div className="timer-controls">
            <button
              id="btn-toggle-timer"
              type="button"
              className="btn-primary"
              onClick={() => {
                if (secondsLeft === 0) {
                  setSecondsLeft(activePreset.seconds)
                }
                setJustCompleted(false)
                setIsRunning((v) => !v)
              }}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              <span>{isRunning ? 'Pause Ritual' : 'Begin Ritual'}</span>
            </button>
            <button
              id="btn-reset-timer"
              type="button"
              className="btn-secondary"
              onClick={handleResetTimer}
              aria-label="Reset timer"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>

          <div className="audio-divider">
            <div className="audio-label">
              <span>WebAudio Soundscape</span>
              <span>{ambient === 'silence' ? 'Muted' : 'Synthesizing live'}</span>
            </div>
            <div className="sound-pills" role="group" aria-label="Ambient soundscape">
              <button
                id="sound-silence"
                type="button"
                className={`sound-btn ${ambient === 'silence' ? 'is-active' : ''}`}
                onClick={() => handleAmbientChange('silence')}
              >
                <VolumeX size={14} />
                <span>Silence</span>
              </button>
              <button
                id="sound-rain"
                type="button"
                className={`sound-btn ${ambient === 'rain' ? 'is-active' : ''}`}
                onClick={() => handleAmbientChange('rain')}
              >
                <CloudRain size={14} />
                <span>Night Rain</span>
              </button>
              <button
                id="sound-wind"
                type="button"
                className={`sound-btn ${ambient === 'wind' ? 'is-active' : ''}`}
                onClick={() => handleAmbientChange('wind')}
              >
                <Wind size={14} />
                <span>Crypt Wind</span>
              </button>
            </div>
          </div>
        </div>

        <div className="panel-card">
          {selectedProject ? (
            <>
              <div className="project-selector-row">
                <select
                  id="ritual-project-select"
                  className="crypt-select"
                  aria-label="Select active project for ritual"
                  value={selectedProject.id}
                  onChange={(e) => onSelectProject(e.target.value)}
                >
                  {selectableProjects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.name} ({proj.status})
                    </option>
                  ))}
                </select>

                {selectedProject.status !== 'ascended' && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => onAscendProject(selectedProject.id)}
                  >
                    <Sparkles size={15} />
                    <span>Mark Ascended</span>
                  </button>
                )}
              </div>

              <p className="tombstone-epitaph">
                “{selectedProject.epitaph}” —{' '}
                <strong>
                  {selectedProject.ritualsCompleted} rituals · {selectedProject.focusMinutes}m logged
                </strong>
              </p>

              <form className="add-task-form" onSubmit={handleAddTaskSubmit}>
                <input
                  id="new-ritual-task"
                  type="text"
                  className="crypt-input"
                  placeholder="Add a micro-task to break the curse..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!taskInput.trim()}
                >
                  <Flame size={15} />
                  <span>Add Step</span>
                </button>
              </form>

              {selectedProject.tasks.length === 0 ? (
                <div className="empty-state">
                  <p>No ritual steps yet. Add one small deliverable above.</p>
                </div>
              ) : (
                <ul className="task-list">
                  {selectedProject.tasks.map((task) => (
                    <li
                      key={task.id}
                      className={`task-item ${task.done ? 'is-done' : ''}`}
                    >
                      <button
                        type="button"
                        className="task-toggle"
                        onClick={() => onToggleTask(selectedProject.id, task.id)}
                      >
                        {task.done ? (
                          <CheckSquare size={17} color="#6fb38a" />
                        ) : (
                          <Square size={17} color="#e59a38" />
                        )}
                        <span>{task.title}</span>
                      </button>
                      <button
                        type="button"
                        className="btn-ghost btn-danger-ghost"
                        onClick={() => onDeleteTask(selectedProject.id, task.id)}
                        aria-label={`Delete task ${task.title}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {justCompleted && (
                <div className="ritual-banner" role="status">
                  <Volume2 size={16} />
                  <span>
                    Ritual complete! +{activePreset.logMinutes} focus minutes and +2 Soul Sparks
                    inscribed onto {selectedProject.name}.
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>Bury or resurrect a project in the Graveyard to start a ritual.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
