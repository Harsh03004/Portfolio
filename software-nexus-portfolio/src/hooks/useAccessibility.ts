/**
 * useAccessibility - React hook for accessibility features
 * Handles reduced motion preferences, keyboard shortcuts, and screen reader support
 */

import { useState, useEffect, useCallback } from 'react'
import { getKeyboardShortcuts, normalizeReducedMotionPreference } from '@/lib/utils/accessibility'

export interface AccessibilityState {
  prefersReducedMotion: boolean
  reducedMotionOverride: boolean | null
  keyboardShortcutsEnabled: boolean
  screenReaderMode: boolean
  highContrastMode: boolean
}

export function useAccessibility() {
  const [state, setState] = useState<AccessibilityState>({
    prefersReducedMotion: false,
    reducedMotionOverride: null,
    keyboardShortcutsEnabled: true,
    screenReaderMode: false,
    highContrastMode: false
  })

  // Detect prefers-reduced-motion on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Use setTimeout to avoid setState during render
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        prefersReducedMotion: mediaQuery.matches
      }))
    }, 0)

    const handleChange = (e: MediaQueryListEvent) => {
      setState(prev => ({
        ...prev,
        prefersReducedMotion: e.matches
      }))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Detect high contrast mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')

    // Use setTimeout to avoid setState during render
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        highContrastMode: mediaQuery.matches
      }))
    }, 0)

    const handleChange = (e: MediaQueryListEvent) => {
      setState(prev => ({
        ...prev,
        highContrastMode: e.matches
      }))
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Check if reduced motion should be active
  const shouldReduceMotion = useCallback(() => {
    return normalizeReducedMotionPreference(
      state.prefersReducedMotion,
      state.reducedMotionOverride
    )
  }, [state.prefersReducedMotion, state.reducedMotionOverride])

  // Toggle reduced motion override
  const toggleReducedMotion = useCallback(() => {
    setState(prev => ({
      ...prev,
      reducedMotionOverride: prev.reducedMotionOverride === null
        ? !prev.prefersReducedMotion
        : !prev.reducedMotionOverride
    }))
  }, [])

  // Toggle keyboard shortcuts
  const toggleKeyboardShortcuts = useCallback(() => {
    setState(prev => ({
      ...prev,
      keyboardShortcutsEnabled: !prev.keyboardShortcutsEnabled
    }))
  }, [])

  // Toggle screen reader mode
  const toggleScreenReaderMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      screenReaderMode: !prev.screenReaderMode
    }))
  }, [])

  // Get keyboard shortcuts
  const shortcuts = getKeyboardShortcuts()

  return {
    // State
    prefersReducedMotion: state.prefersReducedMotion,
    reducedMotionOverride: state.reducedMotionOverride,
    keyboardShortcutsEnabled: state.keyboardShortcutsEnabled,
    screenReaderMode: state.screenReaderMode,
    highContrastMode: state.highContrastMode,

    // Computed
    shouldReduceMotion: shouldReduceMotion(),
    shortcuts,

    // Actions
    toggleReducedMotion,
    toggleKeyboardShortcuts,
    toggleScreenReaderMode
  }
}

/**
 * Hook to announce messages to screen readers
 */
export function useScreenReaderAnnounce() {
  const [announcement, setAnnouncement] = useState<string>('')

  const announce = useCallback((message: string, _priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement('')
    setTimeout(() => {
      setAnnouncement(message)
    }, 100)
  }, [])

  return {
    announcement,
    announce
  }
}

