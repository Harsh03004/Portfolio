import { Raycaster, Vector2, Camera, Scene, Object3D, Intersection } from 'three'
import { INTERACTION_SETTINGS } from '@/lib/constants'

export interface InteractionEvent {
  type: 'hover' | 'click' | 'scroll'
  object?: Object3D
  intersection?: Intersection
  point?: Vector2
  delta?: number
}

export type InteractionCallback = (event: InteractionEvent) => void

export class InteractionManager {
  private raycaster: Raycaster
  private mouse: Vector2
  private camera: Camera
  private hoveredObject: Object3D | null = null
  private interactiveObjects: Map<Object3D, InteractionCallbacks> = new Map()
  private isEnabled: boolean = true
  
  // Event callbacks
  private globalCallbacks: {
    onHover?: InteractionCallback
    onClick?: InteractionCallback
    onScroll?: InteractionCallback
  } = {}

  constructor(camera: Camera, _scene: Scene) {
    this.raycaster = new Raycaster()
    this.mouse = new Vector2()
    this.camera = camera
    // Scene is passed but not stored as it's not needed for raycasting

    this.setupEventListeners()
  }

  /**
   * Register an object as interactive with callbacks
   */
  addInteractiveObject(
    object: Object3D, 
    callbacks?: InteractionCallbacks
  ): void {
    this.interactiveObjects.set(object, callbacks || {})
    object.userData.interactive = true
  }

  /**
   * Remove an object from interactive list
   */
  removeInteractiveObject(object: Object3D): void {
    this.interactiveObjects.delete(object)
    object.userData.interactive = false
  }

  /**
   * Set global event callbacks
   */
  setGlobalCallbacks(callbacks: {
    onHover?: InteractionCallback
    onClick?: InteractionCallback
    onScroll?: InteractionCallback
  }): void {
    this.globalCallbacks = callbacks
  }

  /**
   * Enable/disable interaction manager
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  /**
   * Setup DOM event listeners
   */
  private setupEventListeners(): void {
    // Mouse move for hover detection
    window.addEventListener('mousemove', this.handleMouseMove)
    
    // Click events
    window.addEventListener('click', this.handleClick)
    
    // Touch events for mobile
    window.addEventListener('touchstart', this.handleTouchStart)
    window.addEventListener('touchend', this.handleTouchEnd)
  }

  /**
   * Handle mouse movement for hover detection
   */
  private handleMouseMove = (event: MouseEvent): void => {
    if (!this.isEnabled) return
    
    this.updateMousePosition(event.clientX, event.clientY)
    this.checkHover()
  }

  /**
   * Handle click events
   */
  private handleClick = (event: MouseEvent): void => {
    if (!this.isEnabled) return
    
    this.updateMousePosition(event.clientX, event.clientY)
    const intersection = this.getIntersection()
    
    if (intersection) {
      const object = this.findInteractiveObject(intersection.object)
      if (!object) return
      // Call object-specific callback
      const callbacks = this.interactiveObjects.get(object)
      if (callbacks?.onClick) {
        callbacks.onClick({
          type: 'click',
          object,
          intersection,
          point: this.mouse.clone()
        })
      }
      
      // Call global callback
      if (this.globalCallbacks.onClick) {
        this.globalCallbacks.onClick({
          type: 'click',
          object,
          intersection,
          point: this.mouse.clone()
        })
      }
    }
  }

  /**
   * Handle touch start for mobile
   */
  private touchStartPosition: { x: number; y: number } | null = null

  private handleTouchStart = (event: TouchEvent): void => {
    if (!this.isEnabled || event.touches.length !== 1) return
    
    const touch = event.touches[0]
    this.touchStartPosition = { x: touch.clientX, y: touch.clientY }
  }

  /**
   * Handle touch end (tap detection)
   */
  private handleTouchEnd = (event: TouchEvent): void => {
    if (!this.isEnabled || !this.touchStartPosition) return
    
    const touch = event.changedTouches[0]
    const dx = touch.clientX - this.touchStartPosition.x
    const dy = touch.clientY - this.touchStartPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // If movement is small, treat as tap
    if (distance < 10) {
      this.updateMousePosition(touch.clientX, touch.clientY)
      const intersection = this.getIntersection()
      
      if (intersection) {
        const object = this.findInteractiveObject(intersection.object)
        if (!object) {
          this.touchStartPosition = null
          return
        }
        
        // Call object-specific callback
        const callbacks = this.interactiveObjects.get(object)
        if (callbacks?.onClick) {
          callbacks.onClick({
            type: 'click',
            object,
            intersection,
            point: this.mouse.clone()
          })
        }
        
        // Call global callback
        if (this.globalCallbacks.onClick) {
          this.globalCallbacks.onClick({
            type: 'click',
            object,
            intersection,
            point: this.mouse.clone()
          })
        }
      }
    }
    
    this.touchStartPosition = null
  }

  /**
   * Update mouse position in normalized device coordinates
   */
  private updateMousePosition(clientX: number, clientY: number): void {
    this.mouse.x = (clientX / window.innerWidth) * 2 - 1
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1
  }

  /**
   * Check for hover interactions
   */
  private checkHover(): void {
    const intersection = this.getIntersection()
    const newHoveredObject = intersection
        ? this.findInteractiveObject(intersection.object)
        : null
    
    // Handle hover out
    if (this.hoveredObject && this.hoveredObject !== newHoveredObject) {
      this.hoveredObject.userData.hovered = false
      
      const callbacks = this.interactiveObjects.get(this.hoveredObject)
      if (callbacks?.onHoverOut) {
        callbacks.onHoverOut({
          type: 'hover',
          object: this.hoveredObject
        })
      }
    }
    
    // Handle hover in
    if (newHoveredObject && newHoveredObject !== this.hoveredObject) {
      newHoveredObject.userData.hovered = true
      
      const callbacks = this.interactiveObjects.get(newHoveredObject)
      if (callbacks?.onHoverIn) {
        callbacks.onHoverIn({
          type: 'hover',
          object: newHoveredObject,
          intersection: intersection || undefined
        })
      }
      
      // Call global callback
      if (this.globalCallbacks.onHover) {
        this.globalCallbacks.onHover({
          type: 'hover',
          object: newHoveredObject,
          intersection: intersection || undefined,
          point: this.mouse.clone()
        })
      }
    }
    
    this.hoveredObject = newHoveredObject
  }

  /**
   * Walk up the hierarchy to find a registered interactive object.
   */
  private findInteractiveObject(object: Object3D | null): Object3D | null {
    let current = object

    while (current) {
      if (this.interactiveObjects.has(current)) {
        return current
      }
      current = current.parent
    }

    return null
  }

  /**
   * Get the closest intersected interactive object
   */
  private getIntersection(): Intersection | null {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    
    const objects = Array.from(this.interactiveObjects.keys())
    const intersects = this.raycaster.intersectObjects(objects, true)
    
    for (const intersect of intersects) {
      if (intersect.distance <= INTERACTION_SETTINGS.hoverDistance) {
        return intersect
      }
    }
    
    return null
  }

  /**
   * Get currently hovered object
   */
  getHoveredObject(): Object3D | null {
    return this.hoveredObject
  }

  /**
   * Cleanup event listeners
   */
  dispose(): void {
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('click', this.handleClick)
    window.removeEventListener('touchstart', this.handleTouchStart)
    window.removeEventListener('touchend', this.handleTouchEnd)
    
    this.interactiveObjects.clear()
  }
}

export interface InteractionCallbacks {
  onClick?: InteractionCallback
  onHoverIn?: InteractionCallback
  onHoverOut?: InteractionCallback
}
