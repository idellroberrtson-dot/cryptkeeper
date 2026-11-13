import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'

describe('CryptKeeper App UI', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renders graveyard view with sample projects and navigates across tabs', () => {
    render(<App />)

    expect(screen.getByText('The Side-Project Graveyard')).toBeTruthy()
    expect(screen.getByText('ObsidianVault.wasm')).toBeTruthy()
    expect(screen.getByText('TabNecromancer v4')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /Ritual Chamber/i }))
    expect(screen.getByText('The Midnight Ritual Chamber')).toBeTruthy()
    expect(screen.getByText('10s Demo')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /Necronomicon/i }))
    expect(screen.getByText('The Necronomicon Ledger')).toBeTruthy()
    expect(screen.getByText('Causes of Project Death')).toBeTruthy()
  })

  it('allows burying a new abandoned side project via modal', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Bury Project/i }))
    fireEvent.change(screen.getByLabelText(/Repository \/ Project Name/i), {
      target: { value: 'MidnightCompiler' },
    })
    fireEvent.change(screen.getByLabelText(/Tombstone Epitaph/i), {
      target: { value: 'Abandoned after inventing a custom bytecode format.' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Carve Tombstone/i }))

    expect(screen.getByText('MidnightCompiler')).toBeTruthy()
  })
})
