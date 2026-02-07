/**
 * usePerformanceMonitor - React hook for real-time performance monitoring
 * Tracks FPS, frame time, and quality adjustments
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { PerformanceMonitor, QualityAdjuster } from '@/lib/utils/performance'

export interface PerformanceState {
  fps: number
  frameTime: number
  averageFPS: number
  status: 'optimal' | 'warning' | 'critical'
  quality: 'high' | 'medium' | 'low'
}

/**
 * Hook for monitoring and adjusting rendering performance
 */
export function usePerformanceMonitor(
  enabled: boolean = true,
  autoAdjustQuality: boolean = false
) {
  const monitorRef = useRef<PerformanceMonitor | null>(null)
  const qualityAdjusterRef = useRef<QualityAdjuster | null>(null)
  const [state, setState] = useState<PerformanceState>({
    fps: 0,
    frameTime: 0,
    averageFPS: 0,
    status: 'optimal',
    quality: 'high'
  })

  // Initialize monitor
  useEffect(() => {
    if (!enabled) return

    monitorRef.current = new PerformanceMonitor({
      targetFPS: 60,
      maxFrameTime: 16.67,
      warningFPS: 45,
      criticalFPS: 30
    })

    qualityAdjusterRef.current = new QualityAdjuster(monitorRef.current)

    return () => {
      monitorRef.current = null
      qualityAdjusterRef.current = null
    }
  }, [enabled])

  // Update loop
  useEffect(() => {
    if (!enabled || !monitorRef.current) return

    let rafId: number

    const updatePerformance = () => {
      const monitor = monitorRef.current!
      const adjuster = qualityAdjusterRef.current!

      monitor.update()

      // Auto-adjust quality if enabled
      if (autoAdjustQuality) {
        adjuster.autoAdjust()
      }

      setState({
        fps: monitor.getFPS(),
        frameTime: monitor.getFrameTime(),
        averageFPS: monitor.getAverageFPS(),
        status: monitor.getStatus(),
        quality: adjuster.getQuality()
      })

      rafId = requestAnimationFrame(updatePerformance)
    }

    rafId = requestAnimationFrame(updatePerformance)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [enabled, autoAdjustQuality])

  const setQuality = useCallback((quality: 'high' | 'medium' | 'low') => {
    if (qualityAdjusterRef.current) {
      qualityAdjusterRef.current.setQuality(quality)
      setState(prev => ({ ...prev, quality }))
    }
  }, [])

  const getMetrics = useCallback(() => {
    return monitorRef.current?.getMetrics() || []
  }, [])

  const resetMetrics = useCallback(() => {
    monitorRef.current?.reset()
  }, [])

  return {
    // Current state
    fps: state.fps,
    frameTime: state.frameTime,
    averageFPS: state.averageFPS,
    status: state.status,
    quality: state.quality,

    // Methods
    setQuality,
    getMetrics,
    resetMetrics
  }
}

/**
 * Hook for asset loading with progress tracking
 */
export function useAssetLoading() {
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAsset = useCallback(
    async (url: string, loaderFn: (url: string) => Promise<any>) => {
      setLoading(true)
      setError(null)
      setProgress(0)

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const next = prev + Math.random() * 30
            return next > 90 ? 90 : next
          })
        }, 100)

        const asset = await loaderFn(url)

        clearInterval(progressInterval)
        setProgress(100)

        return asset
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Asset loading failed'
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return {
    progress,
    loading,
    error,
    loadAsset
  }
}

/**
 * Hook for quality adjustment based on performance
 */
export function useQualityAdjustment(
  performanceMonitor: PerformanceMonitor | null,
  autoAdjust: boolean = false
) {
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high')
  const [textureQuality, setTextureQuality] = useState<'high' | 'medium' | 'low'>('high')
  const [particleCount, setParticleCount] = useState<'full' | 'reduced' | 'minimal'>('full')

  useEffect(() => {
    if (!autoAdjust || !performanceMonitor) return

    // Initialize quality adjuster for automatic quality adjustment
    // Note: Currently not actively used but available for future implementation
    // const qualityAdjuster = new QualityAdjuster(performanceMonitor)
    let rafId: number

    const adjustQuality = () => {
      const status = performanceMonitor.getStatus()

      if (status === 'critical') {
        setQuality('low')
        setParticleCount('minimal')
      } else if (status === 'warning') {
        setQuality('medium')
        setParticleCount('reduced')
      } else {
        setQuality('high')
        setParticleCount('full')
      }

      rafId = requestAnimationFrame(adjustQuality)
    }

    rafId = requestAnimationFrame(adjustQuality)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [autoAdjust, performanceMonitor])

  const manuallySetQuality = useCallback((q: 'high' | 'medium' | 'low') => {
    setQuality(q)
    if (q === 'high') {
      setParticleCount('full')
      setTextureQuality('high')
    } else if (q === 'medium') {
      setParticleCount('reduced')
      setTextureQuality('medium')
    } else {
      setParticleCount('minimal')
      setTextureQuality('low')
    }
  }, [])

  return {
    quality,
    textureQuality,
    particleCount,
    setQuality: manuallySetQuality
  }
}

