/**
 * Fallback utilities for non-3D experience
 * Provides text-first alternatives and WebGL failure handling
 */

export interface FallbackMode {
  type: 'webgl-failure' | 'user-choice' | 'mobile-optimized' | 'accessibility'
  reason: string
}

/**
 * Check if WebGL is supported
 */
export function checkWebGLSupport(): {
  supported: boolean
  version: 1 | 2 | null
  error?: string
} {
  try {
    const canvas = document.createElement('canvas')

    // Try WebGL2 first
    const gl2 = canvas.getContext('webgl2')
    if (gl2) {
      return { supported: true, version: 2 }
    }

    // Fall back to WebGL1
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl1) {
      return { supported: true, version: 1 }
    }

    return {
      supported: false,
      version: null,
      error: 'WebGL is not supported by your browser or device'
    }
  } catch (error) {
    return {
      supported: false,
      version: null,
      error: error instanceof Error ? error.message : 'Unknown error checking WebGL support'
    }
  }
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof navigator === 'undefined') return false

  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']

  return mobileKeywords.some(keyword => userAgent.includes(keyword))
}

/**
 * Check if device has low performance
 */
export function isLowPerformanceDevice(): boolean {
  if (typeof navigator === 'undefined') return false

  const cores = navigator.hardwareConcurrency || 1
  // Use type assertion for deviceMemory property
  const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4

  // Consider low-end if less than 4 cores or less than 4GB RAM
  return cores < 4 || memory < 4
}

/**
 * Determine if fallback should be automatically activated
 */
export function shouldActivateFallback(): FallbackMode | null {
  // Check WebGL support
  const webgl = checkWebGLSupport()
  if (!webgl.supported) {
    return {
      type: 'webgl-failure',
      reason: webgl.error || 'WebGL not supported'
    }
  }

  // Check if mobile with low performance
  if (isMobileDevice() && isLowPerformanceDevice()) {
    return {
      type: 'mobile-optimized',
      reason: 'Mobile device with limited resources detected'
    }
  }

  return null
}

/**
 * Get fallback recommendation message
 */
export function getFallbackRecommendation(mode: FallbackMode): string {
  switch (mode.type) {
    case 'webgl-failure':
      return 'Your browser or device does not support WebGL, which is required for the 3D experience. Please use the text-based version instead.'

    case 'user-choice':
      return 'You have chosen to use the text-based version of the portfolio.'

    case 'mobile-optimized':
      return 'For optimal performance on your mobile device, we recommend using the simplified text-based version.'

    case 'accessibility':
      return 'You are using the accessibility-focused text-based version with enhanced screen reader support.'

    default:
      return 'The 3D experience is unavailable. Please use the text-based version.'
  }
}

/**
 * Store user's fallback preference
 */
export function storeFallbackPreference(useFallback: boolean): void {
  try {
    localStorage.setItem('portfolio-use-fallback', useFallback ? 'true' : 'false')
  } catch (error) {
    console.warn('Could not store fallback preference:', error)
  }
}

/**
 * Get user's fallback preference
 */
export function getFallbackPreference(): boolean | null {
  try {
    const stored = localStorage.getItem('portfolio-use-fallback')
    if (stored === null) return null
    return stored === 'true'
  } catch (error) {
    console.warn('Could not retrieve fallback preference:', error)
    return null
  }
}

/**
 * Clear fallback preference
 */
export function clearFallbackPreference(): void {
  try {
    localStorage.removeItem('portfolio-use-fallback')
  } catch (error) {
    console.warn('Could not clear fallback preference:', error)
  }
}

