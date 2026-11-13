import type { AmbientSoundscape } from '../domain/types'

/**
 * Zero-asset procedural Web Audio synthesizer for atmospheric focus rituals.
 * Uses filtered noise buffers and harmonic oscillators—no external copyrighted audio.
 */
class RitualAudioEngine {
  private ctx: AudioContext | null = null
  private ambientSource: AudioBufferSourceNode | null = null
  private ambientGain: GainNode | null = null
  private lfoOsc: OscillatorNode | null = null
  private currentMode: AmbientSoundscape = 'silence'

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AudioCtx) return null
    if (!this.ctx) {
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    return this.ctx
  }

  public setAmbient(mode: AmbientSoundscape, volume = 0.25): void {
    if (mode === this.currentMode && mode !== 'silence') {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.setTargetAtTime(volume * 0.4, this.ctx.currentTime, 0.2)
      }
      return
    }

    this.stopAmbient()
    this.currentMode = mode
    if (mode === 'silence') return

    const ctx = this.ensureContext()
    if (!ctx) return

    const bufferSeconds = 3
    const sampleRate = ctx.sampleRate
    const bufferSize = sampleRate * bufferSeconds
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate)
    const data = buffer.getChannelData(0)

    // Generate smooth brown/pink noise for organic texture
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      lastOut = (lastOut + 0.03 * white) / 1.03
      data[i] = lastOut * 3.2
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true

    const filter = ctx.createBiquadFilter()
    const masterGain = ctx.createGain()

    if (mode === 'rain') {
      filter.type = 'bandpass'
      filter.frequency.value = 1150
      filter.Q.value = 0.55
      masterGain.gain.value = volume * 0.35
    } else {
      // Crypt wind: low resonant sweep modulated by slow LFO
      filter.type = 'lowpass'
      filter.frequency.value = 340
      filter.Q.value = 2.4
      masterGain.gain.value = volume * 0.45

      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 0.14
      lfoGain.gain.value = 170
      lfo.connect(lfoGain)
      lfoGain.connect(filter.frequency)
      lfo.start()
      this.lfoOsc = lfo
    }

    source.connect(filter)
    filter.connect(masterGain)
    masterGain.connect(ctx.destination)
    source.start()

    this.ambientSource = source
    this.ambientGain = masterGain
  }

  public stopAmbient(): void {
    try {
      this.ambientSource?.stop()
      this.ambientSource?.disconnect()
    } catch {
      // Ignore already stopped audio nodes
    }
    try {
      this.lfoOsc?.stop()
      this.lfoOsc?.disconnect()
    } catch {
      // Ignore already stopped LFO
    }
    this.ambientGain?.disconnect()
    this.ambientSource = null
    this.ambientGain = null
    this.lfoOsc = null
  }

  public playRitualBell(): void {
    const ctx = this.ensureContext()
    if (!ctx) return

    const now = ctx.currentTime
    const partials = [
      { freq: 392.0, gain: 0.16, decay: 2.2 }, // G4 warm bronze fundamental
      { freq: 587.33, gain: 0.09, decay: 1.8 }, // D5 fifth partial
      { freq: 784.0, gain: 0.05, decay: 1.4 }, // G5 octave shimmer
    ]

    for (const partial of partials) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(partial.freq, now)

      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(partial.gain, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + partial.decay)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + partial.decay + 0.05)
    }
  }
}

export const ritualAudio = new RitualAudioEngine()
