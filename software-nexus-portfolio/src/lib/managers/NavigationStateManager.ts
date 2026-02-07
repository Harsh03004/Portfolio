import { WorldZone } from '@/lib/types'

export type NavigationMode = 'exploration' | 'project' | 'transition' | 'fallback'

export interface NavigationState {
  mode: NavigationMode
  currentZone: WorldZone | null
  previousZone: WorldZone | null
  activeProject: string | null
  isTransitioning: boolean
  history: WorldZone[]
}

export type NavigationCallback = (state: NavigationState) => void

export class NavigationStateManager {
  private state: NavigationState = {
    mode: 'exploration',
    currentZone: 'entry-portal',
    previousZone: null,
    activeProject: null,
    isTransitioning: false,
    history: ['entry-portal']
  }

  private callbacks: Set<NavigationCallback> = new Set()
  private maxHistoryLength: number = 10

  constructor() {
    console.log('NavigationStateManager initialized')
  }

  /**
   * Get current navigation state
   */
  getState(): NavigationState {
    return { ...this.state }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback: NavigationCallback): () => void {
    this.callbacks.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback)
    }
  }

  /**
   * Notify all subscribers of state change
   */
  private notifySubscribers(): void {
    const currentState = this.getState()
    this.callbacks.forEach(callback => callback(currentState))
  }

  /**
   * Enter exploration mode
   */
  enterExplorationMode(): void {
    if (this.state.mode === 'exploration') return

    this.state.mode = 'exploration'
    this.state.activeProject = null
    this.notifySubscribers()
    
    console.log('Entered exploration mode')
  }

  /**
   * Enter project mode
   */
  enterProjectMode(projectId: string): void {
    if (this.state.mode === 'project' && this.state.activeProject === projectId) return

    this.state.mode = 'project'
    this.state.activeProject = projectId
    this.notifySubscribers()
    
    console.log(`Entered project mode: ${projectId}`)
  }

  /**
   * Enter transition mode
   */
  enterTransitionMode(): void {
    this.state.mode = 'transition'
    this.state.isTransitioning = true
    this.notifySubscribers()
    
    console.log('Entered transition mode')
  }

  /**
   * Exit transition mode
   */
  exitTransitionMode(): void {
    this.state.isTransitioning = false
    
    // Return to previous mode
    if (this.state.activeProject) {
      this.state.mode = 'project'
    } else {
      this.state.mode = 'exploration'
    }
    
    this.notifySubscribers()
    console.log('Exited transition mode')
  }

  /**
   * Enter fallback mode (for accessibility)
   */
  enterFallbackMode(): void {
    this.state.mode = 'fallback'
    this.notifySubscribers()
    
    console.log('Entered fallback mode')
  }

  /**
   * Navigate to a zone
   */
  navigateToZone(zone: WorldZone): void {
    if (this.state.currentZone === zone) return

    this.state.previousZone = this.state.currentZone
    this.state.currentZone = zone
    
    // Add to history
    this.state.history.push(zone)
    
    // Trim history if too long
    if (this.state.history.length > this.maxHistoryLength) {
      this.state.history.shift()
    }
    
    this.notifySubscribers()
    console.log(`Navigated to zone: ${zone}`)
  }

  /**
   * Go back to previous zone
   */
  goBack(): boolean {
    if (this.state.history.length <= 1) {
      console.log('No previous zone in history')
      return false
    }

    // Remove current zone from history
    this.state.history.pop()
    
    // Get previous zone
    const previousZone = this.state.history[this.state.history.length - 1]
    
    this.state.previousZone = this.state.currentZone
    this.state.currentZone = previousZone
    
    this.notifySubscribers()
    console.log(`Went back to zone: ${previousZone}`)
    
    return true
  }

  /**
   * Go forward in history (if available)
   */
  goForward(): boolean {
    // This would require a separate forward history stack
    // For now, just return false
    console.log('Forward navigation not implemented')
    return false
  }

  /**
   * Clear navigation history
   */
  clearHistory(): void {
    this.state.history = this.state.currentZone ? [this.state.currentZone] : []
    this.notifySubscribers()
    
    console.log('Navigation history cleared')
  }

  /**
   * Get navigation history
   */
  getHistory(): WorldZone[] {
    return [...this.state.history]
  }

  /**
   * Check if can go back
   */
  canGoBack(): boolean {
    return this.state.history.length > 1
  }

  /**
   * Check if in specific mode
   */
  isInMode(mode: NavigationMode): boolean {
    return this.state.mode === mode
  }

  /**
   * Get current mode
   */
  getCurrentMode(): NavigationMode {
    return this.state.mode
  }

  /**
   * Get current zone
   */
  getCurrentZone(): WorldZone | null {
    return this.state.currentZone
  }

  /**
   * Get active project
   */
  getActiveProject(): string | null {
    return this.state.activeProject
  }

  /**
   * Check if transitioning
   */
  isTransitioning(): boolean {
    return this.state.isTransitioning
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.state = {
      mode: 'exploration',
      currentZone: 'entry-portal',
      previousZone: null,
      activeProject: null,
      isTransitioning: false,
      history: ['entry-portal']
    }
    
    this.notifySubscribers()
    console.log('Navigation state reset')
  }
}
