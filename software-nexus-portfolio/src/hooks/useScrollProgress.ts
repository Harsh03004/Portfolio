import { useState, useEffect, useCallback } from 'react'

interface UseScrollProgressOptions {
  smoothing?: number
  sensitivity?: number
}

export function useScrollProgress(options: UseScrollProgressOptions = {}) {
  const { smoothing = 0.1, sensitivity = 0.001 } = options
  
  const [scrollProgress, setScrollProgress] = useState(0)
  const [targetProgress, setTargetProgress] = useState(0)

  // Handle wheel events for scroll control
  useEffect(() => {
    let accumulatedScroll = 0

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      
      // Accumulate scroll delta
      accumulatedScroll += event.deltaY * sensitivity
      
      // Clamp between 0 and 1
      accumulatedScroll = Math.max(0, Math.min(1, accumulatedScroll))
      
      setTargetProgress(accumulatedScroll)
    }

    // Add wheel event listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [sensitivity])

  // Smooth interpolation to target progress
  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      setScrollProgress(prev => {
        const diff = targetProgress - prev
        
        // If close enough, snap to target
        if (Math.abs(diff) < 0.001) {
          return targetProgress
        }
        
        // Smooth interpolation
        return prev + diff * smoothing
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [targetProgress, smoothing])

  // Manual control functions
  const setProgress = useCallback((progress: number) => {
    const clamped = Math.max(0, Math.min(1, progress))
    setTargetProgress(clamped)
  }, [])

  const incrementProgress = useCallback((delta: number) => {
    setTargetProgress(prev => Math.max(0, Math.min(1, prev + delta)))
  }, [])

  const resetProgress = useCallback(() => {
    setTargetProgress(0)
    setScrollProgress(0)
  }, [])

  return {
    scrollProgress,
    targetProgress,
    setProgress,
    incrementProgress,
    resetProgress,
  }
}
