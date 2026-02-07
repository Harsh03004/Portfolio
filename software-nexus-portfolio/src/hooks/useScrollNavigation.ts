import { useState, useEffect, useRef, useCallback } from 'react'
import { ScrollManager, ScrollEvent } from '@/lib/managers/ScrollManager'

interface UseScrollNavigationOptions {
  smoothing?: number
  sensitivity?: number
  enabled?: boolean
}

export function useScrollNavigation(options: UseScrollNavigationOptions = {}) {
  const { smoothing = 0.1, sensitivity = 0.001, enabled = true } = options
  
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none')
  const scrollManagerRef = useRef<ScrollManager | null>(null)

  // Initialize scroll manager
  useEffect(() => {
    const manager = new ScrollManager({
      smoothing,
      sensitivity,
      onScroll: (event: ScrollEvent) => {
        setScrollProgress(event.progress)
        setScrollVelocity(event.velocity)
        setScrollDirection(event.direction)
      }
    })

    scrollManagerRef.current = manager

    if (enabled) {
      manager.start()
    }

    return () => {
      manager.dispose()
    }
  }, [smoothing, sensitivity, enabled])

  // Enable/disable scroll manager
  useEffect(() => {
    if (scrollManagerRef.current) {
      if (enabled) {
        scrollManagerRef.current.start()
      } else {
        scrollManagerRef.current.stop()
      }
    }
  }, [enabled])

  // Manual control functions
  const setProgress = useCallback((progress: number) => {
    scrollManagerRef.current?.setProgress(progress)
  }, [])

  const jumpToZone = useCallback((zoneIndex: number, totalZones: number = 7) => {
    const progress = zoneIndex / (totalZones - 1)
    scrollManagerRef.current?.setProgress(progress)
  }, [])

  const resetProgress = useCallback(() => {
    scrollManagerRef.current?.setProgress(0)
  }, [])

  return {
    scrollProgress,
    scrollVelocity,
    scrollDirection,
    setProgress,
    jumpToZone,
    resetProgress,
  }
}
