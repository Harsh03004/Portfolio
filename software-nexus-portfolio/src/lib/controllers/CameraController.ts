import { Vector3, Camera } from 'three'
import { gsap } from 'gsap'
import { CAMERA_PATH, ANIMATION_DURATIONS } from '@/lib/constants'

export class CameraController {
  private camera: Camera
  private currentZoneIndex: number = 0
  private isTransitioning: boolean = false

  constructor(camera: Camera) {
    this.camera = camera
  }

  /**
   * Update camera position based on scroll progress
   * @param scrollProgress - Value between 0 and 1
   */
  updateCameraFromScroll(scrollProgress: number): void {
    if (this.isTransitioning) return

    const totalZones = CAMERA_PATH.length
    const zoneProgress = scrollProgress * (totalZones - 1)
    const currentZone = Math.floor(zoneProgress)
    const localProgress = zoneProgress - currentZone

    if (currentZone >= totalZones - 1) {
      // At the end
      const lastPath = CAMERA_PATH[totalZones - 1]
      this.camera.position.copy(lastPath.position)
      this.camera.lookAt(lastPath.target)
      return
    }

    // Interpolate between current and next zone
    const currentPath = CAMERA_PATH[currentZone]
    const nextPath = CAMERA_PATH[currentZone + 1]

    const newPosition = this.interpolatePosition(
      currentPath.position,
      nextPath.position,
      localProgress
    )

    const newTarget = this.interpolatePosition(
      currentPath.target,
      nextPath.target,
      localProgress
    )

    this.camera.position.copy(newPosition)
    this.camera.lookAt(newTarget)
  }

  /**
   * Smooth transition to a specific zone
   */
  async transitionToZone(zoneIndex: number, duration: number = ANIMATION_DURATIONS.zoneTransition): Promise<void> {
    if (this.isTransitioning || zoneIndex >= CAMERA_PATH.length) return

    this.isTransitioning = true
    const targetPath = CAMERA_PATH[zoneIndex]

    return new Promise((resolve) => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.isTransitioning = false
          this.currentZoneIndex = zoneIndex
          resolve()
        }
      })

      // Animate camera position
      timeline.to(this.camera.position, {
        x: targetPath.position.x,
        y: targetPath.position.y,
        z: targetPath.position.z,
        duration: duration,
        ease: "power2.inOut"
      })

      // Animate camera target (lookAt)
      const tempTarget = new Vector3()
      this.camera.getWorldDirection(tempTarget)
      
      timeline.to(tempTarget, {
        x: targetPath.target.x,
        y: targetPath.target.y,
        z: targetPath.target.z,
        duration: duration,
        ease: "power2.inOut",
        onUpdate: () => {
          this.camera.lookAt(tempTarget.x, tempTarget.y, tempTarget.z)
        }
      }, 0)
    })
  }

  /**
   * Enter project portal with cinematic transition
   */
  async enterProjectPortal(portalPosition: Vector3): Promise<void> {
    this.isTransitioning = true
    
    const entryPosition = portalPosition.clone().add(new Vector3(0, 2, 5))
    
    return new Promise((resolve) => {
      gsap.to(this.camera.position, {
        x: entryPosition.x,
        y: entryPosition.y,
        z: entryPosition.z,
        duration: ANIMATION_DURATIONS.portalEntry,
        ease: "power2.inOut",
        onComplete: () => {
          this.isTransitioning = false
          resolve()
        }
      })
    })
  }

  /**
   * Exit project portal and return to main world
   */
  async exitProjectPortal(): Promise<void> {
    return this.transitionToZone(this.currentZoneIndex, ANIMATION_DURATIONS.portalExit)
  }

  /**
   * Interpolate between two Vector3 positions
   */
  interpolatePosition(start: Vector3, end: Vector3, progress: number): Vector3 {
    const easedProgress = this.applyCinematicEasing(progress)
    return start.clone().lerp(end, easedProgress)
  }

  /**
   * Apply cinematic easing for smooth transitions
   */
  applyCinematicEasing(progress: number): number {
    // Smooth step function for cinematic feel
    return progress * progress * (3 - 2 * progress)
  }

  /**
   * Get current zone index
   */
  getCurrentZone(): number {
    return this.currentZoneIndex
  }

  /**
   * Check if camera is currently transitioning
   */
  isInTransition(): boolean {
    return this.isTransitioning
  }
}
