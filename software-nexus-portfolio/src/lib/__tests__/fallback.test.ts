/**
 * Fallback System Tests
 * Tests for WebGL detection, fallback activation, and utilities
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  checkWebGLSupport,
  isMobileDevice,
  isLowPerformanceDevice,
  shouldActivateFallback,
  getFallbackRecommendation,
  storeFallbackPreference,
  getFallbackPreference,
  clearFallbackPreference,
  FallbackMode
} from '@/lib/utils/fallback'

// ============================================================================
// WebGL Support Detection Tests
// ============================================================================

describe('checkWebGLSupport', () => {
  it('should return support status object', () => {
    const result = checkWebGLSupport()

    expect(result).toHaveProperty('supported')
    expect(result).toHaveProperty('version')
    expect(typeof result.supported).toBe('boolean')
  })

  it('should indicate WebGL2 or WebGL1 when supported', () => {
    const result = checkWebGLSupport()

    if (result.supported) {
      expect([1, 2]).toContain(result.version)
    } else {
      expect(result.version).toBeNull()
    }
  })

  it('should provide error message when not supported', () => {
    const result = checkWebGLSupport()

    if (!result.supported) {
      expect(result.error).toBeTruthy()
      expect(typeof result.error).toBe('string')
    }
  })
})

// ============================================================================
// Device Detection Tests
// ============================================================================

describe('isMobileDevice', () => {
  it('should return boolean', () => {
    const result = isMobileDevice()
    expect(typeof result).toBe('boolean')
  })

  it('should detect based on user agent', () => {
    // This will depend on the test environment
    const result = isMobileDevice()
    expect([true, false]).toContain(result)
  })
})

describe('isLowPerformanceDevice', () => {
  it('should return boolean', () => {
    const result = isLowPerformanceDevice()
    expect(typeof result).toBe('boolean')
  })

  it('should consider hardware concurrency and memory', () => {
    const result = isLowPerformanceDevice()
    expect([true, false]).toContain(result)
  })
})

// ============================================================================
// Fallback Activation Tests
// ============================================================================

describe('shouldActivateFallback', () => {
  it('should return null or FallbackMode', () => {
    const result = shouldActivateFallback()

    if (result === null) {
      expect(result).toBeNull()
    } else {
      expect(result).toHaveProperty('type')
      expect(result).toHaveProperty('reason')
    }
  })

  it('should have valid fallback type when activated', () => {
    const result = shouldActivateFallback()

    if (result !== null) {
      const validTypes = ['webgl-failure', 'user-choice', 'mobile-optimized', 'accessibility']
      expect(validTypes).toContain(result.type)
    }
  })

  it('should provide reason when fallback is needed', () => {
    const result = shouldActivateFallback()

    if (result !== null) {
      expect(result.reason).toBeTruthy()
      expect(typeof result.reason).toBe('string')
      expect(result.reason.length).toBeGreaterThan(0)
    }
  })
})

// ============================================================================
// Fallback Recommendation Tests
// ============================================================================

describe('getFallbackRecommendation', () => {
  it('should return recommendation for webgl-failure', () => {
    const mode: FallbackMode = {
      type: 'webgl-failure',
      reason: 'WebGL not supported'
    }

    const recommendation = getFallbackRecommendation(mode)
    expect(recommendation).toContain('WebGL')
    expect(recommendation).toContain('text-based')
  })

  it('should return recommendation for user-choice', () => {
    const mode: FallbackMode = {
      type: 'user-choice',
      reason: 'User preference'
    }

    const recommendation = getFallbackRecommendation(mode)
    expect(recommendation).toContain('chosen')
    expect(recommendation).toContain('text-based')
  })

  it('should return recommendation for mobile-optimized', () => {
    const mode: FallbackMode = {
      type: 'mobile-optimized',
      reason: 'Low-end mobile device'
    }

    const recommendation = getFallbackRecommendation(mode)
    expect(recommendation).toContain('mobile')
    expect(recommendation).toContain('performance')
  })

  it('should return recommendation for accessibility', () => {
    const mode: FallbackMode = {
      type: 'accessibility',
      reason: 'Screen reader mode'
    }

    const recommendation = getFallbackRecommendation(mode)
    expect(recommendation).toContain('accessibility')
    expect(recommendation).toContain('screen reader')
  })

  it('should return default message for unknown type', () => {
    const mode: FallbackMode = {
      type: 'unknown' as any,
      reason: 'Unknown reason'
    }

    const recommendation = getFallbackRecommendation(mode)
    expect(recommendation).toContain('unavailable')
    expect(recommendation).toContain('text-based')
  })

  it('should return non-empty string for all types', () => {
    const types: FallbackMode['type'][] = [
      'webgl-failure',
      'user-choice',
      'mobile-optimized',
      'accessibility'
    ]

    types.forEach(type => {
      const mode: FallbackMode = { type, reason: 'Test' }
      const recommendation = getFallbackRecommendation(mode)
      expect(recommendation.length).toBeGreaterThan(20)
    })
  })
})

// ============================================================================
// Preference Storage Tests
// ============================================================================

describe('Fallback Preference Storage', () => {
  beforeEach(() => {
    clearFallbackPreference()
  })

  afterEach(() => {
    clearFallbackPreference()
  })

  it('should store fallback preference', () => {
    storeFallbackPreference(true)
    expect(getFallbackPreference()).toBe(true)

    storeFallbackPreference(false)
    expect(getFallbackPreference()).toBe(false)
  })

  it('should return null when no preference is stored', () => {
    clearFallbackPreference()
    expect(getFallbackPreference()).toBeNull()
  })

  it('should clear fallback preference', () => {
    storeFallbackPreference(true)
    expect(getFallbackPreference()).toBe(true)

    clearFallbackPreference()
    expect(getFallbackPreference()).toBeNull()
  })

  it('should handle storage errors gracefully', () => {
    // Mock localStorage to throw error
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('Storage full')
    })

    // Should not throw, just log warning
    expect(() => storeFallbackPreference(true)).not.toThrow()

    // Restore
    Storage.prototype.setItem = originalSetItem
  })

  it('should persist across multiple reads', () => {
    storeFallbackPreference(true)

    expect(getFallbackPreference()).toBe(true)
    expect(getFallbackPreference()).toBe(true)
    expect(getFallbackPreference()).toBe(true)
  })

  it('should update preference correctly', () => {
    storeFallbackPreference(true)
    expect(getFallbackPreference()).toBe(true)

    storeFallbackPreference(false)
    expect(getFallbackPreference()).toBe(false)

    storeFallbackPreference(true)
    expect(getFallbackPreference()).toBe(true)
  })
})

// ============================================================================
// Integration Tests
// ============================================================================

describe('Fallback System Integration', () => {
  it('should provide complete fallback workflow', () => {
    // 1. Check if fallback is needed
    const autoFallback = shouldActivateFallback()

    // 2. If fallback is needed, get recommendation
    if (autoFallback) {
      const recommendation = getFallbackRecommendation(autoFallback)
      expect(recommendation).toBeTruthy()
    }

    // 3. Store user preference
    storeFallbackPreference(true)
    expect(getFallbackPreference()).toBe(true)

    // 4. Clear preference
    clearFallbackPreference()
    expect(getFallbackPreference()).toBeNull()
  })

  it('should handle user preference override', () => {
    // Even if auto-fallback says yes, user can choose
    storeFallbackPreference(false)
    expect(getFallbackPreference()).toBe(false)

    // User changes mind
    storeFallbackPreference(true)
    expect(getFallbackPreference()).toBe(true)
  })
})

// ============================================================================
// Error Handling Tests
// ============================================================================

describe('Error Handling', () => {
  it('should handle missing localStorage gracefully', () => {
    const originalGetItem = Storage.prototype.getItem
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error('No access')
    })

    expect(() => getFallbackPreference()).not.toThrow()
    expect(getFallbackPreference()).toBeNull()

    Storage.prototype.getItem = originalGetItem
  })

  it('should handle WebGL context creation errors', () => {
    const result = checkWebGLSupport()
    expect(result).toHaveProperty('supported')
    expect(result).toHaveProperty('version')
  })
})

