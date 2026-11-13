import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { CAUSES_OF_DEATH } from '../domain/cryptStore'
import type { CauseOfDeath, NewGraveInput } from '../domain/types'

interface NewGraveModalProps {
  onClose: () => void
  onSubmit: (input: NewGraveInput) => void
}

export function NewGraveModal({ onClose, onSubmit }: NewGraveModalProps) {
  const [name, setName] = useState('')
  const [stackText, setStackText] = useState('')
  const [causeOfDeath, setCauseOfDeath] = useState<CauseOfDeath>('Scope Creep')
  const [epitaph, setEpitaph] = useState('')
  const [initialTask, setInitialTask] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !epitaph.trim()) return

    onSubmit({
      name,
      stack: stackText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      causeOfDeath,
      epitaph,
      initialTask,
    })
    onClose()
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-grave-title"
    >
      <div className="modal-card">
        <div className="modal-header">
          <h2 id="new-grave-title" className="modal-title">
            Bury an Abandoned Project
          </h2>
          <button
            type="button"
            className="btn-ghost"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="grave-name" className="form-label">
              Repository / Project Name *
            </label>
            <input
              id="grave-name"
              type="text"
              className="crypt-input"
              placeholder="e.g., HyperCalendar AI"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-field">
            <label htmlFor="grave-stack" className="form-label">
              Tech Stack (comma separated)
            </label>
            <input
              id="grave-stack"
              type="text"
              className="crypt-input"
              placeholder="e.g., React, Rust, SQLite"
              value={stackText}
              onChange={(e) => setStackText(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="grave-cause" className="form-label">
              Cause of Death
            </label>
            <select
              id="grave-cause"
              className="crypt-select"
              value={causeOfDeath}
              onChange={(e) => setCauseOfDeath(e.target.value as CauseOfDeath)}
            >
              {CAUSES_OF_DEATH.map((cause) => (
                <option key={cause} value={cause}>
                  {cause}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="grave-epitaph" className="form-label">
              Tombstone Epitaph *
            </label>
            <textarea
              id="grave-epitaph"
              className="crypt-textarea"
              placeholder="What killed momentum? e.g., Spent 3 weeks on dark mode before building login."
              value={epitaph}
              onChange={(e) => setEpitaph(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="grave-first-task" className="form-label">
              First Revival Step (optional)
            </label>
            <input
              id="grave-first-task"
              type="text"
              className="crypt-input"
              placeholder="e.g., Strip unused auth provider and ship MVP"
              value={initialTask}
              onChange={(e) => setInitialTask(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              id="submit-new-grave"
              type="submit"
              className="btn-primary"
              disabled={!name.trim() || !epitaph.trim()}
            >
              Carve Tombstone
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
