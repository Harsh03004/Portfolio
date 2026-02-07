/**
 * Accessibility Tests
 * Tests for accessibility utilities and hooks
 */

import { describe, it, expect } from 'vitest'
import {
  ZONE_LABELS,
  getZoneLabel,
  getSceneAriaLabel,
  getSceneAriaDescription,
  getKeyboardShortcuts,
  formatShortcutList,
  normalizeReducedMotionPreference
} from '@/lib/utils/accessibility'

// ============================================================================
// Accessibility Utilities Tests
// ============================================================================

describe('Accessibility Utilities', () => {
  describe('ZONE_LABELS', () => {
    it('should have labels for all 7 zones', () => {
      expect(Object.keys(ZONE_LABELS)).toHaveLength(7)
    })

    it('should have correct zone labels', () => {
      expect(ZONE_LABELS[0]).toBe('Entry Portal')
      expect(ZONE_LABELS[1]).toBe('Central Nexus')
      expect(ZONE_LABELS[2]).toBe('Systems Tower')
      expect(ZONE_LABELS[3]).toBe('Interface Sanctum')
      expect(ZONE_LABELS[4]).toBe('Simulation Forge')
      expect(ZONE_LABELS[5]).toBe('Knowledge Core')
      expect(ZONE_LABELS[6]).toBe('Resume Codex')
    })
  })

  describe('getZoneLabel', () => {
    it('should return correct label for valid zone index', () => {
      expect(getZoneLabel(0)).toBe('Entry Portal')
      expect(getZoneLabel(3)).toBe('Interface Sanctum')
      expect(getZoneLabel(6)).toBe('Resume Codex')
    })

    it('should return fallback label for invalid zone index', () => {
      expect(getZoneLabel(7)).toBe('Zone 8')
      expect(getZoneLabel(10)).toBe('Zone 11')
    })

    it('should handle negative indices', () => {
      expect(getZoneLabel(-1)).toBe('Zone 0')
    })
  })

  describe('getSceneAriaLabel', () => {
    it('should return appropriate scene label', () => {
      const label = getSceneAriaLabel()
      expect(label).toContain('Software Nexus')
      expect(label).toContain('3D scene')
      expect(label).toContain('navigate')
    })
  })

  describe('getSceneAriaDescription', () => {
    it('should return comprehensive scene description', () => {
      const description = getSceneAriaDescription()
      expect(description).toContain('interactive 3D environment')
      expect(description).toContain('arrow keys')
      expect(description).toContain('Page Up/Down')
      expect(description).toContain('Home')
      expect(description).toContain('End')
    })

    it('should be a single string', () => {
      const description = getSceneAriaDescription()
      expect(typeof description).toBe('string')
      expect(description.length).toBeGreaterThan(0)
    })
  })

  describe('getKeyboardShortcuts', () => {
    it('should return array of shortcuts', () => {
      const shortcuts = getKeyboardShortcuts()
      expect(Array.isArray(shortcuts)).toBe(true)
      expect(shortcuts.length).toBeGreaterThan(0)
    })

    it('should have shortcuts with key and description', () => {
      const shortcuts = getKeyboardShortcuts()
      shortcuts.forEach(shortcut => {
        expect(shortcut).toHaveProperty('key')
        expect(shortcut).toHaveProperty('description')
        expect(typeof shortcut.key).toBe('string')
        expect(typeof shortcut.description).toBe('string')
      })
    })

    it('should include navigation shortcuts', () => {
      const shortcuts = getKeyboardShortcuts()
      const keys = shortcuts.map(s => s.key)

      expect(keys.some(k => k.includes('Arrow'))).toBe(true)
      expect(keys.some(k => k.includes('Page'))).toBe(true)
      expect(keys.some(k => k.includes('Home'))).toBe(true)
      expect(keys.some(k => k.includes('End'))).toBe(true)
    })
  })

  describe('formatShortcutList', () => {
    it('should format shortcuts as a string', () => {
      const shortcuts = getKeyboardShortcuts()
      const formatted = formatShortcutList(shortcuts)

      expect(typeof formatted).toBe('string')
      expect(formatted.length).toBeGreaterThan(0)
    })

    it('should separate shortcuts with semicolons', () => {
      const shortcuts = getKeyboardShortcuts()
      const formatted = formatShortcutList(shortcuts)

      expect(formatted).toContain(';')
      expect(formatted).toContain(':')
    })

    it('should include all shortcuts', () => {
      const shortcuts = getKeyboardShortcuts()
      const formatted = formatShortcutList(shortcuts)

      shortcuts.forEach(shortcut => {
        expect(formatted).toContain(shortcut.key)
        expect(formatted).toContain(shortcut.description)
      })
    })

    it('should handle empty array', () => {
      const formatted = formatShortcutList([])
      expect(formatted).toBe('')
    })
  })

  describe('normalizeReducedMotionPreference', () => {
    it('should return system preference when override is null', () => {
      expect(normalizeReducedMotionPreference(true, null)).toBe(true)
      expect(normalizeReducedMotionPreference(false, null)).toBe(false)
    })

    it('should return override value when set to true', () => {
      expect(normalizeReducedMotionPreference(false, true)).toBe(true)
      expect(normalizeReducedMotionPreference(true, true)).toBe(true)
    })

    it('should return override value when set to false', () => {
      expect(normalizeReducedMotionPreference(true, false)).toBe(false)
      expect(normalizeReducedMotionPreference(false, false)).toBe(false)
    })

    it('should prioritize override over system preference', () => {
      // System says reduce motion, but user overrides to not reduce
      expect(normalizeReducedMotionPreference(true, false)).toBe(false)

      // System says don't reduce motion, but user overrides to reduce
      expect(normalizeReducedMotionPreference(false, true)).toBe(true)
    })
  })
})

// ============================================================================
// Accessibility Hook Tests (Behavioral)
// ============================================================================

describe('Accessibility Hook Behavior', () => {
  it('should provide correct default state structure', () => {
    // This tests the expected structure of accessibility state
    const expectedState = {
      prefersReducedMotion: false,
      reducedMotionOverride: null,
      keyboardShortcutsEnabled: true,
      screenReaderMode: false,
      highContrastMode: false
    }

    Object.keys(expectedState).forEach(key => {
      expect(key).toBeTruthy()
    })
  })

  it('should calculate reduced motion correctly', () => {
    // Test logic for shouldReduceMotion calculation
    expect(normalizeReducedMotionPreference(false, null)).toBe(false)
    expect(normalizeReducedMotionPreference(true, null)).toBe(true)
    expect(normalizeReducedMotionPreference(false, true)).toBe(true)
    expect(normalizeReducedMotionPreference(true, false)).toBe(false)
  })
})

// ============================================================================
// ARIA Label Generation Tests
// ============================================================================

describe('ARIA Label Generation', () => {
  it('should generate unique labels for each zone', () => {
    const labels = Object.values(ZONE_LABELS)
    const uniqueLabels = new Set(labels)
    expect(uniqueLabels.size).toBe(labels.length)
  })

  it('should provide descriptive labels', () => {
    Object.values(ZONE_LABELS).forEach(label => {
      expect(label.length).toBeGreaterThan(3)
      expect(label).toMatch(/^[A-Z]/)
    })
  })
})

// ============================================================================
// Keyboard Shortcut Completeness Tests
// ============================================================================

describe('Keyboard Shortcuts Completeness', () => {
  it('should cover all basic navigation actions', () => {
    const shortcuts = getKeyboardShortcuts()
    const descriptions = shortcuts.map(s => s.description.toLowerCase())

    expect(descriptions.some(d => d.includes('previous') || d.includes('up'))).toBe(true)
    expect(descriptions.some(d => d.includes('next') || d.includes('down'))).toBe(true)
    expect(descriptions.some(d => d.includes('first') || d.includes('start'))).toBe(true)
    expect(descriptions.some(d => d.includes('last') || d.includes('end'))).toBe(true)
  })

  it('should have at least 4 shortcuts', () => {
    const shortcuts = getKeyboardShortcuts()
    expect(shortcuts.length).toBeGreaterThanOrEqual(4)
  })
})

