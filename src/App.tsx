import { useEffect, useState } from 'react'
import { ritualAudio } from './audio/ritualAudio'
import { CryptHeader } from './components/CryptHeader'
import { GraveyardView } from './components/GraveyardView'
import { NecronomiconView } from './components/NecronomiconView'
import { NewGraveModal } from './components/NewGraveModal'
import { RitualChamberView } from './components/RitualChamberView'
import {
  addTaskToProject,
  buryProject,
  createInitialCryptState,
  deleteTaskFromProject,
  loadCryptState,
  recordCompletedRitual,
  removeProject,
  saveCryptState,
  toggleTaskInProject,
  transitionProjectStatus,
} from './domain/cryptStore'
import type { CryptState, CryptTab, NewGraveInput } from './domain/types'

export function App() {
  const [state, setState] = useState<CryptState>(() => loadCryptState())
  const [activeTab, setActiveTab] = useState<CryptTab>('graveyard')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    saveCryptState(state)
  }, [state])

  useEffect(() => {
    return () => {
      ritualAudio.stopAmbient()
    }
  }, [])

  const handleBuryProject = (input: NewGraveInput) => {
    setState((prev) => buryProject(prev, input))
  }

  const handleResurrect = (projectId: string) => {
    setState((prev) => transitionProjectStatus(prev, projectId, 'resurrected'))
    setActiveTab('ritual')
  }

  const handleOpenChamber = (projectId: string) => {
    setState((prev) => ({ ...prev, activeProjectId: projectId }))
    setActiveTab('ritual')
  }

  const handleAscend = (projectId: string) => {
    setState((prev) => transitionProjectStatus(prev, projectId, 'ascended'))
  }

  const handleRebury = (projectId: string) => {
    setState((prev) => transitionProjectStatus(prev, projectId, 'resurrected'))
  }

  const handleDeleteProject = (projectId: string) => {
    setState((prev) => removeProject(prev, projectId))
  }

  return (
    <>
      <div className="crypt-shell">
        <CryptHeader
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          totalSoulSparks={state.totalSoulSparks}
          onOpenNewGrave={() => setIsModalOpen(true)}
        />

        <main>
          {activeTab === 'graveyard' && (
            <GraveyardView
              projects={state.projects}
              onResurrect={handleResurrect}
              onAscend={handleAscend}
              onRebury={handleRebury}
              onDelete={handleDeleteProject}
              onOpenChamber={handleOpenChamber}
              onOpenNewGrave={() => setIsModalOpen(true)}
            />
          )}

          {activeTab === 'ritual' && (
            <RitualChamberView
              projects={state.projects}
              activeProjectId={state.activeProjectId}
              onSelectProject={(projectId) =>
                setState((prev) => ({ ...prev, activeProjectId: projectId }))
              }
              onAddTask={(projectId, title) =>
                setState((prev) => addTaskToProject(prev, projectId, title))
              }
              onToggleTask={(projectId, taskId) =>
                setState((prev) => toggleTaskInProject(prev, projectId, taskId))
              }
              onDeleteTask={(projectId, taskId) =>
                setState((prev) => deleteTaskFromProject(prev, projectId, taskId))
              }
              onCompleteRitual={(projectId, minutesLogged) =>
                setState((prev) =>
                  recordCompletedRitual(prev, projectId, minutesLogged),
                )
              }
              onAscendProject={handleAscend}
            />
          )}

          {activeTab === 'necronomicon' && (
            <NecronomiconView
              state={state}
              onImportState={(nextState) => setState(nextState)}
              onResetSampleData={() => setState(createInitialCryptState())}
            />
          )}
        </main>

        {isModalOpen && (
          <NewGraveModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleBuryProject}
          />
        )}
      </div>

      <footer className="crypt-footer">
        CryptKeeper · Built for Kiroween 2026 Costume Contest · Local-first &amp; MIT Licensed
      </footer>
    </>
  )
}

export default App
