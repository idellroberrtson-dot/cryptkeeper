import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  Flame,
  Plus,
  Search,
  Skull,
  Sparkles,
  Trash2,
} from 'lucide-react'
import type { CryptProject, ProjectStatus } from '../domain/types'

interface GraveyardViewProps {
  projects: CryptProject[]
  onResurrect: (projectId: string) => void
  onAscend: (projectId: string) => void
  onRebury: (projectId: string) => void
  onDelete: (projectId: string) => void
  onOpenChamber: (projectId: string) => void
  onOpenNewGrave: () => void
}

type FilterMode = 'all' | ProjectStatus

export function GraveyardView({
  projects,
  onResurrect,
  onAscend,
  onRebury,
  onDelete,
  onOpenChamber,
  onOpenNewGrave,
}: GraveyardViewProps) {
  const [filter, setFilter] = useState<FilterMode>('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(
    () => ({
      all: projects.length,
      dormant: projects.filter((p) => p.status === 'dormant').length,
      resurrected: projects.filter((p) => p.status === 'resurrected').length,
      ascended: projects.filter((p) => p.status === 'ascended').length,
    }),
    [projects],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((proj) => {
      if (filter !== 'all' && proj.status !== filter) return false
      if (!q) return true
      return (
        proj.name.toLowerCase().includes(q) ||
        proj.epitaph.toLowerCase().includes(q) ||
        proj.causeOfDeath.toLowerCase().includes(q) ||
        proj.stack.some((s) => s.toLowerCase().includes(q))
      )
    })
  }, [projects, filter, query])

  return (
    <section aria-labelledby="graveyard-heading">
      <div className="view-banner">
        <div>
          <h1 id="graveyard-heading" className="view-heading">
            The Side-Project Graveyard
          </h1>
          <p className="view-lead">
            Every unfinished repository rests beneath an honest epitaph. Diagnose what killed it,
            then summon one back into the Ritual Chamber to ship it for good.
          </p>
        </div>
        <button type="button" className="btn-secondary" onClick={onOpenNewGrave}>
          <Plus size={15} />
          <span>Inter Another Repo</span>
        </button>
      </div>

      <div className="toolbar-row">
        <div className="filter-pills" role="group" aria-label="Filter projects by status">
          {(
            [
              ['all', `All (${counts.all})`],
              ['dormant', `Dormant (${counts.dormant})`],
              ['resurrected', `Resurrected (${counts.resurrected})`],
              ['ascended', `Ascended (${counts.ascended})`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              id={`filter-${value}`}
              type="button"
              className={`filter-btn ${filter === value ? 'is-active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="search-box">
          <Search size={15} className="search-icon" aria-hidden="true" />
          <input
            id="graveyard-search"
            type="search"
            className="search-input"
            placeholder="Search repo, stack, or curse..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search graveyard projects"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No tombstones match your current filter. Try clearing the search or bury a new project.</p>
        </div>
      ) : (
        <div className="graveyard-grid">
          {filtered.map((proj) => {
            const doneTasks = proj.tasks.filter((t) => t.done).length
            return (
              <article
                key={proj.id}
                className={`tombstone-card status-${proj.status}`}
              >
                <div className="tombstone-crest">
                  <span className={`status-tag ${proj.status}`}>
                    {proj.status === 'dormant' && <Skull size={12} />}
                    {proj.status === 'resurrected' && <Flame size={12} />}
                    {proj.status === 'ascended' && <Sparkles size={12} />}
                    {proj.status}
                  </span>
                  <span className="buried-date">Buried {proj.buriedDate}</span>
                </div>

                <h2 className="tombstone-title">{proj.name}</h2>
                <p className="tombstone-epitaph">“{proj.epitaph}”</p>

                <div className="cause-badge" title="Primary cause of abandonment">
                  <span>Curse: {proj.causeOfDeath}</span>
                </div>

                {proj.stack.length > 0 && (
                  <div className="stack-row">
                    {proj.stack.map((tech) => (
                      <span key={tech} className="stack-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="tombstone-meta">
                  <span>
                    Tasks: {doneTasks}/{proj.tasks.length}
                  </span>
                  <span>
                    {proj.ritualsCompleted} rituals · {proj.focusMinutes}m
                  </span>
                </div>

                <div className="tombstone-actions">
                  {proj.status === 'dormant' && (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => onResurrect(proj.id)}
                    >
                      <Flame size={15} />
                      <span>Resurrect</span>
                    </button>
                  )}

                  {proj.status === 'resurrected' && (
                    <>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => onOpenChamber(proj.id)}
                      >
                        <Flame size={15} />
                        <span>Enter Ritual</span>
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onAscend(proj.id)}
                        title="Mark this project as shipped"
                      >
                        <CheckCircle2 size={15} />
                        <span>Ship</span>
                      </button>
                    </>
                  )}

                  {proj.status === 'ascended' && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onRebury(proj.id)}
                    >
                      <span>Re-open Sprint</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn-ghost btn-danger-ghost"
                    onClick={() => onDelete(proj.id)}
                    aria-label={`Remove ${proj.name} from graveyard`}
                    title="Exhume & delete permanently"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
