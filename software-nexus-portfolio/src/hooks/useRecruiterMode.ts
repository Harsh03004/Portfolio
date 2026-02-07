/**
 * useRecruiterMode - React hook for recruiter mode functionality
 * Handles mode detection, tracking, and analytics
 */

import { useState, useEffect, useCallback } from 'react'

export interface RecruiterModeConfig {
  autoDetect?: boolean
  trackDownloads?: boolean
}

export interface RecruiterModeState {
  isRecruiterMode: boolean
  downloads: {
    pdf: number
    text: number
  }
  viewDuration: number
}

/**
 * Hook for managing recruiter mode
 */
export function useRecruiterMode(config: RecruiterModeConfig = {}) {
  const { autoDetect = true, trackDownloads = true } = config

  const [state, setState] = useState<RecruiterModeState>({
    isRecruiterMode: false,
    downloads: {
      pdf: 0,
      text: 0
    },
    viewDuration: 0
  })

  // Auto-detect recruiter mode from URL params
  useEffect(() => {
    if (!autoDetect) return

    const params = new URLSearchParams(window.location.search)
    const recruiterParam = params.get('recruiter') === 'true'
    const modeParam = params.get('mode') === 'recruiter'

    if (recruiterParam || modeParam) {
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        setState(prev => ({ ...prev, isRecruiterMode: true }))
      }, 0)

      // Store in session storage
      try {
        sessionStorage.setItem('recruiter-mode', 'true')
      } catch (error) {
        console.warn('Could not store recruiter mode:', error)
      }
    }
  }, [autoDetect])

  // Track view duration
  useEffect(() => {
    if (!state.isRecruiterMode) return

    const startTime = Date.now()
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        viewDuration: Math.floor((Date.now() - startTime) / 1000)
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [state.isRecruiterMode])

  // Enable recruiter mode
  const enableRecruiterMode = useCallback(() => {
    setState(prev => ({ ...prev, isRecruiterMode: true }))

    try {
      sessionStorage.setItem('recruiter-mode', 'true')
    } catch (error) {
      console.warn('Could not store recruiter mode:', error)
    }
  }, [])

  // Disable recruiter mode
  const disableRecruiterMode = useCallback(() => {
    setState(prev => ({ ...prev, isRecruiterMode: false }))

    try {
      sessionStorage.removeItem('recruiter-mode')
    } catch (error) {
      console.warn('Could not remove recruiter mode:', error)
    }
  }, [])

  // Track download
  const trackDownload = useCallback((format: 'pdf' | 'text') => {
    if (!trackDownloads) return

    setState(prev => ({
      ...prev,
      downloads: {
        ...prev.downloads,
        [format]: prev.downloads[format] + 1
      }
    }))

    // Log analytics event (could be replaced with actual analytics service)
    console.log('[Analytics] Resume download:', {
      format,
      timestamp: new Date().toISOString(),
      viewDuration: state.viewDuration
    })
  }, [trackDownloads, state.viewDuration])

  // Get recruiter mode URL
  const getRecruiterModeURL = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('recruiter', 'true')
    return url.toString()
  }, [])

  return {
    // State
    isRecruiterMode: state.isRecruiterMode,
    downloads: state.downloads,
    viewDuration: state.viewDuration,

    // Actions
    enableRecruiterMode,
    disableRecruiterMode,
    trackDownload,
    getRecruiterModeURL
  }
}

/**
 * Hook for generating shareable recruiter links
 */
export function useRecruiterLink() {
  const generateLink = useCallback((baseURL?: string) => {
    const url = new URL(baseURL || window.location.origin)
    url.searchParams.set('recruiter', 'true')
    return url.toString()
  }, [])

  const copyToClipboard = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }, [])

  return {
    generateLink,
    copyToClipboard
  }
}

