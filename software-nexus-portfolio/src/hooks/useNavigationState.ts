import { useState, useEffect, useRef } from 'react'
import { NavigationStateManager, NavigationState, NavigationMode } from '@/lib/managers/NavigationStateManager'
import { WorldZone } from '@/lib/types'

/**
 * React hook for navigation state management
 * Provides access to navigation state and control functions
 */
export function useNavigationState() {
  const managerRef = useRef<NavigationStateManager | null>(null)
  const [state, setState] = useState<NavigationState>({
    mode: 'exploration',
    currentZone: 'entry-portal',
    previousZone: null,
    activeProject: null,
    isTransitioning: false,
    history: ['entry-portal']
  })

  // Initialize manager on mount
  useEffect(() => {
    if (!managerRef.current) {
      managerRef.current = new NavigationStateManager()
      
      // Subscribe to state changes
      const unsubscribe = managerRef.current.subscribe((newState) => {
        setState(newState)
      })

      // Get initial state
      setState(managerRef.current.getState())

      return () => {
        unsubscribe()
      }
    }
  }, [])

  // Navigation control functions
  const navigateToZone = (zone: WorldZone) => {
    managerRef.current?.navigateToZone(zone)
  }

  const enterExplorationMode = () => {
    managerRef.current?.enterExplorationMode()
  }

  const enterProjectMode = (projectId: string) => {
    managerRef.current?.enterProjectMode(projectId)
  }

  const enterTransitionMode = () => {
    managerRef.current?.enterTransitionMode()
  }

  const exitTransitionMode = () => {
    managerRef.current?.exitTransitionMode()
  }

  const enterFallbackMode = () => {
    managerRef.current?.enterFallbackMode()
  }

  const goBack = () => {
    return managerRef.current?.goBack() ?? false
  }

  const goForward = () => {
    return managerRef.current?.goForward() ?? false
  }

  const clearHistory = () => {
    managerRef.current?.clearHistory()
  }

  const reset = () => {
    managerRef.current?.reset()
  }

  // Query functions
  const canGoBack = () => {
    return managerRef.current?.canGoBack() ?? false
  }

  const isInMode = (mode: NavigationMode) => {
    return managerRef.current?.isInMode(mode) ?? false
  }

  const getHistory = () => {
    return managerRef.current?.getHistory() ?? []
  }

  return {
    // State
    state,
    mode: state.mode,
    currentZone: state.currentZone,
    previousZone: state.previousZone,
    activeProject: state.activeProject,
    isTransitioning: state.isTransitioning,
    history: state.history,

    // Navigation actions
    navigateToZone,
    enterExplorationMode,
    enterProjectMode,
    enterTransitionMode,
    exitTransitionMode,
    enterFallbackMode,
    goBack,
    goForward,
    clearHistory,
    reset,

    // Query functions
    canGoBack,
    isInMode,
    getHistory
  }
}
