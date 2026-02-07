/**
 * Performance Utilities - Monitoring and Optimization
 * Provides tools for performance tracking and metrics
 */

export interface PerformanceMetrics {
  fps: number
  frameTime: number
  memoryUsage?: number
  drawCalls?: number
  triangles?: number
  timestamp: number
}

export interface PerformanceThresholds {
  targetFPS: number
  maxFrameTime: number
  warningFPS: number
  criticalFPS: number
}

/**
 * Performance Monitor for tracking FPS and frame times
 */
export class PerformanceMonitor {
  private frameCount = 0
  private lastFrameTime = performance.now()
  private fps = 0
  private frameTime = 0
  private metrics: PerformanceMetrics[] = []
  private maxMetrics = 300 // Keep last 5 seconds at 60 FPS

  constructor(private thresholds: PerformanceThresholds = {
    targetFPS: 60,
    maxFrameTime: 16.67,
    warningFPS: 45,
    criticalFPS: 30
  }) {}

  /**
   * Update metrics on each frame
   */
  update(): void {
    const now = performance.now()
    this.frameTime = now - this.lastFrameTime
    this.lastFrameTime = now
    this.frameCount++

    // Update FPS every second
    if (this.frameCount % 60 === 0) {
      this.fps = Math.round(1000 / (this.frameTime * 1))
    }

    // Store metrics
    this.recordMetric({
      fps: this.fps,
      frameTime: this.frameTime,
      timestamp: now
    })
  }

  /**
   * Record performance metric
   */
  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric)
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }
  }

  /**
   * Get current FPS
   */
  getFPS(): number {
    return this.fps
  }

  /**
   * Get current frame time in milliseconds
   */
  getFrameTime(): number {
    return this.frameTime
  }

  /**
   * Get average FPS over recent frames
   */
  getAverageFPS(): number {
    if (this.metrics.length === 0) return 0
    const total = this.metrics.reduce((sum, m) => sum + m.fps, 0)
    return Math.round(total / this.metrics.length)
  }

  /**
   * Get performance status
   */
  getStatus(): 'optimal' | 'warning' | 'critical' {
    if (this.fps >= this.thresholds.warningFPS) return 'optimal'
    if (this.fps >= this.thresholds.criticalFPS) return 'warning'
    return 'critical'
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.metrics = []
    this.frameCount = 0
  }
}

/**
 * Performance quality adjuster
 */
export class QualityAdjuster {
  private quality: 'high' | 'medium' | 'low' = 'high'
  private textureQuality: 'high' | 'medium' | 'low' = 'high'
  private shadowQuality: 'high' | 'medium' | 'low' = 'high'
  private particleCount: 'full' | 'reduced' | 'minimal' = 'full'

  constructor(private performanceMonitor: PerformanceMonitor) {}

  /**
   * Auto-adjust quality based on performance
   */
  autoAdjust(): boolean {
    const status = this.performanceMonitor.getStatus()

    if (status === 'critical') {
      return this.reduceQuality()
    } else if (status === 'warning') {
      return this.maintainQuality()
    } else {
      return this.increaseQuality()
    }
  }

  /**
   * Reduce quality settings
   */
  private reduceQuality(): boolean {
    const previousQuality = this.quality

    if (this.quality === 'high') {
      this.quality = 'medium'
      this.textureQuality = 'medium'
      this.particleCount = 'reduced'
      return true
    } else if (this.quality === 'medium') {
      this.quality = 'low'
      this.shadowQuality = 'low'
      this.particleCount = 'minimal'
      return true
    }

    return previousQuality !== this.quality
  }

  /**
   * Increase quality settings
   */
  private increaseQuality(): boolean {
    const previousQuality = this.quality

    if (this.quality === 'low') {
      this.quality = 'medium'
      this.textureQuality = 'medium'
      this.particleCount = 'reduced'
      return true
    } else if (this.quality === 'medium') {
      this.quality = 'high'
      this.textureQuality = 'high'
      this.shadowQuality = 'high'
      this.particleCount = 'full'
      return true
    }

    return previousQuality !== this.quality
  }

  /**
   * Maintain current quality
   */
  private maintainQuality(): boolean {
    return false
  }

  /**
   * Get current quality level
   */
  getQuality(): 'high' | 'medium' | 'low' {
    return this.quality
  }

  /**
   * Set quality level explicitly
   */
  setQuality(quality: 'high' | 'medium' | 'low'): void {
    this.quality = quality
  }

  /**
   * Get texture quality
   */
  getTextureQuality(): 'high' | 'medium' | 'low' {
    return this.textureQuality
  }

  /**
   * Get shadow quality
   */
  getShadowQuality(): 'high' | 'medium' | 'low' {
    return this.shadowQuality
  }

  /**
   * Get particle count setting
   */
  getParticleCount(): 'full' | 'reduced' | 'minimal' {
    return this.particleCount
  }

  /**
   * Get particle multiplier based on setting
   */
  getParticleMultiplier(): number {
    const multipliers = {
      full: 1.0,
      reduced: 0.6,
      minimal: 0.3
    }
    return multipliers[this.particleCount]
  }
}

/**
 * Calculate device performance tier
 */
export function getDevicePerformanceTier(): 'high' | 'medium' | 'low' {
  if (typeof navigator === 'undefined') return 'medium'

  // Check for mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  if (isMobile) {
    // Check for newer mobile devices
    const isHighEndMobile = /iPhone 1[2-9]|iPhone 2[0-9]|iPad Pro|Samsung Galaxy S2[0-9]|Pixel [6-9]/i.test(
      navigator.userAgent
    )
    return isHighEndMobile ? 'medium' : 'low'
  }

  // For desktop, check available cores and memory
  const cores = navigator.hardwareConcurrency || 1
  const memory = (navigator as any).deviceMemory || 4

  if (cores >= 8 && memory >= 8) return 'high'
  if (cores >= 4 && memory >= 4) return 'medium'
  return 'low'
}

/**
 * Check for WebGL support and capabilities
 */
export function checkWebGLCapabilities(): {
  supported: boolean
  capabilities: {
    maxTextureSize: number
    maxCubeMapTextureSize: number
    maxRenderBufferSize: number
    maxViewportWidth: number
    maxViewportHeight: number
    compressedTextureFormats: string[]
  }
} {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')

    if (!gl) {
      return { supported: false, capabilities: {} as any }
    }


    return {
      supported: true,
      capabilities: {
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxCubeMapTextureSize: gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
        maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
        maxViewportWidth: gl.getParameter(gl.MAX_VIEWPORT_DIMS)[0],
        maxViewportHeight: gl.getParameter(gl.MAX_VIEWPORT_DIMS)[1],
        compressedTextureFormats: gl.getParameter(gl.COMPRESSED_TEXTURE_FORMATS) as string[]
      }
    }
  } catch (error) {
    return { supported: false, capabilities: {} as any }
  }
}

/**
 * Memory estimation utilities
 */
export class MemoryEstimator {
  /**
   * Estimate geometry memory usage
   */
  static estimateGeometryMemory(vertexCount: number, indexCount: number): number {
    // Estimate: 3 floats per vertex (x, y, z) + 3 floats for normal + 2 floats for UV
    const vertexData = vertexCount * (3 + 3 + 2) * 4 // 4 bytes per float
    const indexData = indexCount * 4 // 4 bytes per index
    return vertexData + indexData
  }

  /**
   * Estimate texture memory usage
   */
  static estimateTextureMemory(
    width: number,
    height: number,
    format: 'RGBA' | 'RGB' | 'DXT' = 'RGBA'
  ): number {
    const formatSizes = {
      RGBA: 4, // 4 bytes per pixel
      RGB: 3,  // 3 bytes per pixel
      DXT: 0.5 // 0.5 bytes per pixel (compressed)
    }
    return width * height * formatSizes[format]
  }

  /**
   * Format bytes for display
   */
  static formatMemory(bytes: number): string {
    if (bytes < 1024) return bytes.toFixed(2) + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
  }
}

/**
 * Request animation frame throttler for custom frame rate control
 */
export class FrameRateController {
  private targetFPS: number
  private frameTime: number
  private lastFrameTime = 0
  private frameCallback: FrameRequestCallback | null = null

  constructor(targetFPS = 60) {
    this.targetFPS = targetFPS
    this.frameTime = 1000 / targetFPS
  }

  /**
   * Start frame loop with target FPS
   */
  start(callback: FrameRequestCallback): void {
    this.frameCallback = callback
    this.lastFrameTime = performance.now()
    this.scheduleFrame()
  }

  /**
   * Schedule next frame
   */
  private scheduleFrame(): void {
    const now = performance.now()
    const elapsed = now - this.lastFrameTime

    if (elapsed >= this.frameTime) {
      this.lastFrameTime = now
      this.frameCallback?.(now)
    }

    requestAnimationFrame(() => this.scheduleFrame())
  }

  /**
   * Set target FPS
   */
  setTargetFPS(fps: number): void {
    this.targetFPS = fps
    this.frameTime = 1000 / fps
  }

  /**
   * Get current target FPS
   */
  getTargetFPS(): number {
    return this.targetFPS
  }

  /**
   * Stop frame loop
   */
  stop(): void {
    this.frameCallback = null
  }
}

