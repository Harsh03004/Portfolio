import { useEffect, useRef, useState } from 'react'
import { getAudioManager, AudioManager } from '@/lib/managers/AudioManager'

/**
 * React hook for audio management
 * Provides access to audio manager and sound playback functions
 */
export function useAudio() {
  const managerRef = useRef<AudioManager | null>(null)
  const [isEnabled, setIsEnabled] = useState(true)
  const [masterVolume, setMasterVolumeState] = useState(0.5)

  useEffect(() => {
    // Get singleton instance
    managerRef.current = getAudioManager()

    // Resume audio context on first user interaction
    const resumeAudio = () => {
      managerRef.current?.resumeContext()
    }

    window.addEventListener('click', resumeAudio, { once: true })
    window.addEventListener('keydown', resumeAudio, { once: true })

    return () => {
      window.removeEventListener('click', resumeAudio)
      window.removeEventListener('keydown', resumeAudio)
    }
  }, [])

  const playHover = () => {
    managerRef.current?.playHover()
  }

  const playClick = () => {
    managerRef.current?.playClick()
  }

  const playTransition = () => {
    managerRef.current?.playTransition()
  }

  const playZoneEnter = () => {
    managerRef.current?.playZoneEnter()
  }

  const setMasterVolume = (volume: number) => {
    managerRef.current?.setMasterVolume(volume)
    setMasterVolumeState(volume)
  }

  const toggleAudio = () => {
    const newState = !isEnabled
    managerRef.current?.setEnabled(newState)
    setIsEnabled(newState)
  }

  return {
    playHover,
    playClick,
    playTransition,
    playZoneEnter,
    setMasterVolume,
    toggleAudio,
    isEnabled,
    masterVolume
  }
}
