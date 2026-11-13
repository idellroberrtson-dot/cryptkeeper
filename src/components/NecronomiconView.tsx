import { useRef, useState, type ChangeEvent } from 'react'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { computeCryptStats, parseCryptBackup } from '../domain/cryptStore'
import type { CryptState } from '../domain/types'

interface NecronomiconViewProps {
  state: CryptState
  onImportState: (nextState: CryptState) => void
  onResetSampleData: () => void
}

export function NecronomiconView({
  state,
  onImportState,
  onResetSampleData,
}: NecronomiconViewProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const stats = computeCryptStats(state)

  const handleExport = () => {
    setError(null)
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `cryptkeeper-backup-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    setFeedback('Exported crypt snapshot to JSON.')
  }

  const handleImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setFeedback(null)
    setError(null)
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const restored = parseCryptBackup(text)
      onImportState(restored)
      setFeedback(`Restored ${restored.projects.length} projects from backup.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse backup file.')
    } finally {
      e.target.value = ''
    }
  }

  const handleReset = () => {
    setError(null)
    onResetSampleData()
    setFeedback('Restored curated Kiroween sample graveyard.')
  }

  return (
    <section aria-labelledby="necronomicon-heading">
      <div className="view-banner">
        <div>
          <h1 id="necronomicon-heading" className="view-heading">
            The Necronomicon Ledger
          </h1>
          <p className="view-lead">
            Pattern-match why your side projects stall, track revival momentum, and keep
            your local crypt portable with schema-validated JSON backups.
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-tile">
          <div className="metric-label">Revival Rate</div>
          <div className="metric-value">{stats.revivalRatePercent}%</div>
        </div>
        <div className="metric-tile">
          <div className="metric-label">Ritual Focus Time</div>
          <div className="metric-value">{stats.totalFocusMinutes}m</div>
        </div>
        <div className="metric-tile">
          <div className="metric-label">Completed Steps</div>
          <div className="metric-value">
            {stats.completedTasks}/{stats.totalTasks}
          </div>
        </div>
        <div className="metric-tile">
          <div className="metric-label">Ascended Repos</div>
          <div className="metric-value">{stats.ascendedCount}</div>
        </div>
      </div>

      <div className="necronomicon-split">
        <div className="panel-card">
          <h2 className="tombstone-title">Causes of Project Death</h2>
          <p className="brand-subtitle">
            Diagnose recurring traps across your buried and resurrected repositories.
          </p>

          {stats.causeBreakdown.length === 0 ? (
            <div className="empty-state">
              <p>No projects recorded yet.</p>
            </div>
          ) : (
            <div className="cause-bar-list">
              {stats.causeBreakdown.map((item) => (
                <div key={item.cause}>
                  <div className="cause-bar-head">
                    <span>{item.cause}</span>
                    <span>
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="cause-bar-track">
                    <div
                      className="cause-bar-fill"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel-card">
          <h2 className="tombstone-title">Portable Crypt Archive</h2>
          <p className="brand-subtitle">
            All state stays private in browser localStorage. Export, import, or reset demo data
            anytime.
          </p>

          <div className="backup-actions">
            <button
              id="btn-export-json"
              type="button"
              className="btn-primary"
              onClick={handleExport}
            >
              <Download size={16} />
              <span>Export Crypt JSON</span>
            </button>

            <button
              id="btn-import-json"
              type="button"
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              <span>Import Crypt JSON</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleImportFile}
              hidden
            />

            <button
              id="btn-reset-sample"
              type="button"
              className="btn-secondary"
              onClick={handleReset}
            >
              <RotateCcw size={16} />
              <span>Reset Sample Crypt</span>
            </button>
          </div>

          {feedback && (
            <p className="feedback-note" role="status">
              {feedback}
            </p>
          )}
          {error && (
            <p className="feedback-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
