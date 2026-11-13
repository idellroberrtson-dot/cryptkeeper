import { BookOpen, Flame, Plus, Skull, Sparkles } from 'lucide-react'
import type { CryptTab } from '../domain/types'

interface CryptHeaderProps {
  activeTab: CryptTab
  onSelectTab: (tab: CryptTab) => void
  totalSoulSparks: number
  onOpenNewGrave: () => void
}

export function CryptHeader({
  activeTab,
  onSelectTab,
  totalSoulSparks,
  onOpenNewGrave,
}: CryptHeaderProps) {
  return (
    <header className="crypt-header">
      <div className="brand-lockup">
        <div className="brand-emblem" aria-hidden="true">
          <Flame size={20} />
        </div>
        <div>
          <p className="brand-title">CryptKeeper</p>
          <p className="brand-subtitle">Side-Project Graveyard &amp; Midnight Focus Ritual</p>
        </div>
      </div>

      <nav className="nav-tabs" aria-label="Primary Workspace">
        <button
          id="tab-graveyard"
          type="button"
          className={`nav-tab ${activeTab === 'graveyard' ? 'is-active' : ''}`}
          onClick={() => onSelectTab('graveyard')}
        >
          <Skull size={16} />
          <span>Graveyard</span>
        </button>
        <button
          id="tab-ritual"
          type="button"
          className={`nav-tab ${activeTab === 'ritual' ? 'is-active' : ''}`}
          onClick={() => onSelectTab('ritual')}
        >
          <Flame size={16} />
          <span>Ritual Chamber</span>
        </button>
        <button
          id="tab-necronomicon"
          type="button"
          className={`nav-tab ${activeTab === 'necronomicon' ? 'is-active' : ''}`}
          onClick={() => onSelectTab('necronomicon')}
        >
          <BookOpen size={16} />
          <span>Necronomicon</span>
        </button>
      </nav>

      <div className="header-actions">
        <div className="spark-counter" title="Soul Sparks earned from reviving projects and completing rituals">
          <Sparkles size={15} />
          <span>{totalSoulSparks} Sparks</span>
        </div>
        <button
          id="btn-bury-project"
          type="button"
          className="btn-primary"
          onClick={onOpenNewGrave}
        >
          <Plus size={16} />
          <span>Bury Project</span>
        </button>
      </div>
    </header>
  )
}
