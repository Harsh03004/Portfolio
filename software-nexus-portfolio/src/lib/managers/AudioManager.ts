/**
 * Audio Manager for handling sound cues and ambient audio
 * Provides spatial audio support and volume management
 */

export type SoundType = 'hover' | 'click' | 'transition' | 'ambient' | 'zone-enter'

interface AudioSettings {
  masterVolume: number
  sfxVolume: number
  ambientVolume: number
  enabled: boolean
}

export class AudioManager {
  private audioContext: AudioContext | null = null
  private sounds: Map<SoundType, AudioBuffer> = new Map()
  private activeSources: Set<AudioBufferSourceNode> = new Set()
  private settings: AudioSettings = {
    masterVolume: 0.5,
    sfxVolume: 0.7,
    ambientVolume: 0.3,
    enabled: true
  }

  constructor() {
    // Initialize audio context on first user interaction
    this.initializeAudioContext()
  }

  /**
   * Initialize Web Audio API context
   */
  private initializeAudioContext(): void {
    if (typeof window === 'undefined') return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      console.log('AudioManager initialized')
    } catch (error) {
      console.warn('Web Audio API not supported:', error)
    }
  }

  /**
   * Resume audio context (required after user interaction)
   */
  async resumeContext(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
      console.log('Audio context resumed')
    }
  }

  /**
   * Load a sound file
   */
  async loadSound(type: SoundType, url: string): Promise<void> {
    if (!this.audioContext) return

    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      this.sounds.set(type, audioBuffer)
      console.log(`Sound loaded: ${type}`)
    } catch (error) {
      console.warn(`Failed to load sound ${type}:`, error)
    }
  }

  /**
   * Play a sound effect
   */
  playSound(type: SoundType, volume: number = 1): void {
    if (!this.settings.enabled || !this.audioContext) return

    const buffer = this.sounds.get(type)
    if (!buffer) {
      // Generate simple beep for missing sounds (development)
      this.playBeep(type, volume)
      return
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = buffer
    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Calculate final volume
    const finalVolume = this.settings.masterVolume * this.settings.sfxVolume * volume
    gainNode.gain.value = finalVolume

    // Track active source
    this.activeSources.add(source)
    source.onended = () => {
      this.activeSources.delete(source)
    }

    source.start(0)
  }

  /**
   * Generate a simple beep sound (fallback for missing audio files)
   */
  private playBeep(type: SoundType, volume: number): void {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    // Different frequencies for different sound types
    const frequencies: Record<SoundType, number> = {
      hover: 800,
      click: 1000,
      transition: 600,
      ambient: 400,
      'zone-enter': 1200
    }

    oscillator.frequency.value = frequencies[type] || 800
    oscillator.type = 'sine'

    const finalVolume = this.settings.masterVolume * this.settings.sfxVolume * volume * 0.1
    gainNode.gain.value = finalVolume

    // Quick fade out
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.1
    )

    oscillator.start(0)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  /**
   * Play hover sound
   */
  playHover(): void {
    this.playSound('hover', 0.3)
  }

  /**
   * Play click sound
   */
  playClick(): void {
    this.playSound('click', 0.5)
  }

  /**
   * Play transition sound
   */
  playTransition(): void {
    this.playSound('transition', 0.4)
  }

  /**
   * Play zone enter sound
   */
  playZoneEnter(): void {
    this.playSound('zone-enter', 0.6)
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.settings.masterVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Set SFX volume
   */
  setSfxVolume(volume: number): void {
    this.settings.sfxVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Set ambient volume
   */
  setAmbientVolume(volume: number): void {
    this.settings.ambientVolume = Math.max(0, Math.min(1, volume))
  }

  /**
   * Enable/disable audio
   */
  setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled
    if (!enabled) {
      this.stopAll()
    }
  }

  /**
   * Get current settings
   */
  getSettings(): AudioSettings {
    return { ...this.settings }
  }

  /**
   * Stop all active sounds
   */
  stopAll(): void {
    this.activeSources.forEach(source => {
      try {
        source.stop()
      } catch (error) {
        // Source may already be stopped
      }
    })
    this.activeSources.clear()
  }

  /**
   * Cleanup
   */
  dispose(): void {
    this.stopAll()
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }
}

// Singleton instance
let audioManagerInstance: AudioManager | null = null

export function getAudioManager(): AudioManager {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager()
  }
  return audioManagerInstance
}
