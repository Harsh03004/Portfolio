import { Vector3 } from 'three'
import { ProjectData } from '@/lib/types'
import gsap from 'gsap'

export type PortalState = 'closed' | 'opening' | 'open' | 'closing'

export interface PortalConfig {
  id: string
  position: Vector3
  project: ProjectData
  entryPoint: Vector3
  exitPoint: Vector3
  transitionDuration: number
}

export interface PortalTransition {
  fromPosition: Vector3
  toPosition: Vector3
  fromTarget: Vector3
  toTarget: Vector3
  duration: number
  onComplete?: () => void
}

/**
 * Portal Manager
 * Handles project portal entry/exit and transitions
 */
export class PortalManager {
  private activePortal: string | null = null
  private portalState: PortalState = 'closed'
  private portals: Map<string, PortalConfig> = new Map()
  private callbacks: Set<(state: PortalState, portalId: string | null) => void> = new Set()

  constructor() {
    console.log('PortalManager initialized')
  }

  /**
   * Register a portal
   */
  registerPortal(config: PortalConfig): void {
    this.portals.set(config.id, config)
    console.log(`Portal registered: ${config.id}`)
  }

  /**
   * Unregister a portal
   */
  unregisterPortal(id: string): void {
    this.portals.delete(id)
    console.log(`Portal unregistered: ${id}`)
  }

  /**
   * Get portal configuration
   */
  getPortal(id: string): PortalConfig | undefined {
    return this.portals.get(id)
  }

  /**
   * Check if portal is active
   */
  isPortalActive(id: string): boolean {
    return this.activePortal === id && this.portalState === 'open'
  }

  /**
   * Get current portal state
   */
  getPortalState(): PortalState {
    return this.portalState
  }

  /**
   * Get active portal ID
   */
  getActivePortal(): string | null {
    return this.activePortal
  }

  /**
   * Subscribe to portal state changes
   */
  subscribe(callback: (state: PortalState, portalId: string | null) => void): () => void {
    this.callbacks.add(callback)
    return () => {
      this.callbacks.delete(callback)
    }
  }

  /**
   * Notify subscribers of state change
   */
  private notifySubscribers(): void {
    this.callbacks.forEach(callback => callback(this.portalState, this.activePortal))
  }

  /**
   * Enter a portal
   */
  async enterPortal(
    portalId: string,
    cameraPosition: Vector3,
    cameraTarget: Vector3,
    onUpdate: (position: Vector3, target: Vector3) => void
  ): Promise<void> {
    const portal = this.portals.get(portalId)
    if (!portal) {
      console.warn(`Portal not found: ${portalId}`)
      return
    }

    if (this.portalState !== 'closed') {
      console.warn('Cannot enter portal: another portal is active')
      return
    }

    console.log(`Entering portal: ${portalId}`)
    this.portalState = 'opening'
    this.activePortal = portalId
    this.notifySubscribers()

    return new Promise((resolve) => {
      const transition: PortalTransition = {
        fromPosition: cameraPosition.clone(),
        toPosition: portal.entryPoint.clone(),
        fromTarget: cameraTarget.clone(),
        toTarget: portal.position.clone(),
        duration: portal.transitionDuration,
        onComplete: () => {
          this.portalState = 'open'
          this.notifySubscribers()
          resolve()
        }
      }

      this.animateTransition(transition, onUpdate)
    })
  }

  /**
   * Exit current portal
   */
  async exitPortal(
    returnPosition: Vector3,
    returnTarget: Vector3,
    onUpdate: (position: Vector3, target: Vector3) => void
  ): Promise<void> {
    if (!this.activePortal || this.portalState !== 'open') {
      console.warn('No active portal to exit')
      return
    }

    const portal = this.portals.get(this.activePortal)
    if (!portal) {
      console.warn('Active portal not found')
      return
    }

    console.log(`Exiting portal: ${this.activePortal}`)
    this.portalState = 'closing'
    this.notifySubscribers()

    return new Promise((resolve) => {
      const transition: PortalTransition = {
        fromPosition: portal.entryPoint.clone(),
        toPosition: returnPosition.clone(),
        fromTarget: portal.position.clone(),
        toTarget: returnTarget.clone(),
        duration: portal.transitionDuration,
        onComplete: () => {
          this.portalState = 'closed'
          this.activePortal = null
          this.notifySubscribers()
          resolve()
        }
      }

      this.animateTransition(transition, onUpdate)
    })
  }

  /**
   * Animate camera transition
   */
  private animateTransition(
    transition: PortalTransition,
    onUpdate: (position: Vector3, target: Vector3) => void
  ): void {
    const progress = { value: 0 }
    const tempPosition = new Vector3()
    const tempTarget = new Vector3()

    gsap.to(progress, {
      value: 1,
      duration: transition.duration,
      ease: 'power2.inOut',
      onUpdate: () => {
        // Interpolate position
        tempPosition.lerpVectors(
          transition.fromPosition,
          transition.toPosition,
          progress.value
        )

        // Interpolate target
        tempTarget.lerpVectors(
          transition.fromTarget,
          transition.toTarget,
          progress.value
        )

        onUpdate(tempPosition, tempTarget)
      },
      onComplete: () => {
        transition.onComplete?.()
      }
    })
  }

  /**
   * Check if near portal entrance
   */
  isNearPortal(position: Vector3, portalId: string, threshold: number = 5): boolean {
    const portal = this.portals.get(portalId)
    if (!portal) return false

    return position.distanceTo(portal.position) < threshold
  }

  /**
   * Get all registered portals
   */
  getAllPortals(): PortalConfig[] {
    return Array.from(this.portals.values())
  }

  /**
   * Clear all portals
   */
  clearPortals(): void {
    this.portals.clear()
    this.activePortal = null
    this.portalState = 'closed'
    this.notifySubscribers()
  }
}

// Singleton instance
let portalManagerInstance: PortalManager | null = null

export function getPortalManager(): PortalManager {
  if (!portalManagerInstance) {
    portalManagerInstance = new PortalManager()
  }
  return portalManagerInstance
}
