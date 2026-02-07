import { INTERACTION_SETTINGS } from '@/lib/constants'

export interface ScrollEvent {
  progress: number
  delta: number
  direction: 'up' | 'down' | 'none'
  velocity: number
}

export class ScrollManager {
  private progress: number = 0
  private targetProgress: number = 0
  private velocity: number = 0
  private lastDelta: number = 0
  private smoothing: number = 0.1
  private sensitivity: number = INTERACTION_SETTINGS.scrollSensitivity
  
  private onScroll?: (event: ScrollEvent) => void
  private animationFrameId?: number
  private isActive: boolean = false

  constructor(options?: {
    smoothing?: number
    sensitivity?: number
    onScroll?: (event: ScrollEvent) => void
  }) {
    if (options?.smoothing) this.smoothing = options.smoothing
    if (options?.sensitivity) this.sensitivity = options.sensitivity
    if (options?.onScroll) this.onScroll = options.onScroll
  }

  /**
   * Start listening to scroll events
   */
  start(): void {
    if (this.isActive) return
    
    this.isActive = true
    this.setupEventListeners()
    this.startAnimation()
    
    console.log('ScrollManager started')
  }

  /**
   * Stop listening to scroll events
   */
  stop(): void {
    if (!this.isActive) return
    
    this.isActive = false
    this.removeEventListeners()
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    
    console.log('ScrollManager stopped')
  }

  /**
   * Set up event listeners for scroll input
   */
  private setupEventListeners(): void {
    window.addEventListener('wheel', this.handleWheel, { passive: false })
    window.addEventListener('touchstart', this.handleTouchStart, { passive: false })
    window.addEventListener('touchmove', this.handleTouchMove, { passive: false })
    window.addEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    window.removeEventListener('wheel', this.handleWheel)
    window.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('touchmove', this.handleTouchMove)
    window.removeEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Handle wheel events
   */
  private handleWheel = (event: WheelEvent): void => {
    event.preventDefault()
    
    const delta = event.deltaY * this.sensitivity
    this.addDelta(delta)
  }

  /**
   * Handle touch start
   */
  private touchStartY: number = 0
  private handleTouchStart = (event: TouchEvent): void => {
    if (event.touches.length === 1) {
      this.touchStartY = event.touches[0].clientY
    }
  }

  /**
   * Handle touch move for mobile scrolling
   */
  private handleTouchMove = (event: TouchEvent): void => {
    if (event.touches.length === 1) {
      event.preventDefault()
      
      const touchY = event.touches[0].clientY
      const delta = (this.touchStartY - touchY) * INTERACTION_SETTINGS.touchSensitivity
      
      this.addDelta(delta)
      this.touchStartY = touchY
    }
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    const keyDelta = 0.05 // 5% per key press
    
    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault()
        this.addDelta(keyDelta)
        break
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault()
        this.addDelta(-keyDelta)
        break
      case 'Home':
        event.preventDefault()
        this.setProgress(0)
        break
      case 'End':
        event.preventDefault()
        this.setProgress(1)
        break
    }
  }

  /**
   * Add delta to target progress
   */
  private addDelta(delta: number): void {
    this.targetProgress = Math.max(0, Math.min(1, this.targetProgress + delta))
    this.lastDelta = delta
  }

  /**
   * Set progress directly
   */
  setProgress(progress: number): void {
    this.targetProgress = Math.max(0, Math.min(1, progress))
    this.progress = this.targetProgress
  }

  /**
   * Get current progress
   */
  getProgress(): number {
    return this.progress
  }

  /**
   * Get target progress
   */
  getTargetProgress(): number {
    return this.targetProgress
  }

  /**
   * Get current velocity
   */
  getVelocity(): number {
    return this.velocity
  }

  /**
   * Animation loop for smooth interpolation
   */
  private startAnimation(): void {
    const animate = () => {
      if (!this.isActive) return

      const diff = this.targetProgress - this.progress
      
      // Calculate velocity
      this.velocity = diff * this.smoothing
      
      // If close enough, snap to target
      if (Math.abs(diff) < 0.0001) {
        this.progress = this.targetProgress
        this.velocity = 0
      } else {
        // Smooth interpolation
        this.progress += this.velocity
      }

      // Determine scroll direction
      let direction: 'up' | 'down' | 'none' = 'none'
      if (this.lastDelta > 0) direction = 'down'
      else if (this.lastDelta < 0) direction = 'up'

      // Emit scroll event
      if (this.onScroll) {
        this.onScroll({
          progress: this.progress,
          delta: this.lastDelta,
          direction,
          velocity: this.velocity
        })
      }

      // Reset delta after emitting
      this.lastDelta *= 0.9 // Decay delta

      this.animationFrameId = requestAnimationFrame(animate)
    }

    this.animationFrameId = requestAnimationFrame(animate)
  }

  /**
   * Update callback
   */
  setOnScroll(callback: (event: ScrollEvent) => void): void {
    this.onScroll = callback
  }

  /**
   * Dispose and cleanup
   */
  dispose(): void {
    this.stop()
  }
}
