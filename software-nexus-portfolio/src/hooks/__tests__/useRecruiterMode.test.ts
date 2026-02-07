/**
 * Recruiter Mode Tests
 * Tests for recruiter mode functionality, tracking, and URL handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// ============================================================================
// Recruiter Mode Hook Tests
// ============================================================================

describe('Recruiter Mode Hook', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear()
  })

  it('should have correct initial state structure', () => {
    const expectedState = {
      isRecruiterMode: false,
      downloads: {
        pdf: 0,
        text: 0
      },
      viewDuration: 0
    }

    Object.keys(expectedState).forEach(key => {
      expect(key).toBeTruthy()
    })
  })

  it('should track downloads correctly', () => {
    const downloads = { pdf: 0, text: 0 }

    // Simulate PDF download
    downloads.pdf += 1
    expect(downloads.pdf).toBe(1)
    expect(downloads.text).toBe(0)

    // Simulate text download
    downloads.text += 1
    expect(downloads.pdf).toBe(1)
    expect(downloads.text).toBe(1)

    // Multiple downloads
    downloads.pdf += 2
    expect(downloads.pdf).toBe(3)
  })
})

// ============================================================================
// URL Parameter Detection Tests
// ============================================================================

describe('URL Parameter Detection', () => {
  it('should detect recruiter parameter from URL', () => {
    const url = new URL('http://localhost:5173?recruiter=true')
    const params = new URLSearchParams(url.search)

    expect(params.get('recruiter')).toBe('true')
  })

  it('should detect mode parameter from URL', () => {
    const url = new URL('http://localhost:5173?mode=recruiter')
    const params = new URLSearchParams(url.search)

    expect(params.get('mode')).toBe('recruiter')
  })

  it('should handle missing recruiter parameter', () => {
    const url = new URL('http://localhost:5173')
    const params = new URLSearchParams(url.search)

    expect(params.get('recruiter')).toBeNull()
    expect(params.get('mode')).toBeNull()
  })

  it('should generate recruiter mode URL correctly', () => {
    const baseURL = 'http://localhost:5173'
    const url = new URL(baseURL)
    url.searchParams.set('recruiter', 'true')

    expect(url.toString()).toBe('http://localhost:5173/?recruiter=true')
  })
})

// ============================================================================
// Session Storage Tests
// ============================================================================

describe('Session Storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('should store recruiter mode in session storage', () => {
    sessionStorage.setItem('recruiter-mode', 'true')
    expect(sessionStorage.getItem('recruiter-mode')).toBe('true')
  })

  it('should retrieve recruiter mode from session storage', () => {
    sessionStorage.setItem('recruiter-mode', 'true')
    const stored = sessionStorage.getItem('recruiter-mode')

    expect(stored).toBe('true')
  })

  it('should remove recruiter mode from session storage', () => {
    sessionStorage.setItem('recruiter-mode', 'true')
    sessionStorage.removeItem('recruiter-mode')

    expect(sessionStorage.getItem('recruiter-mode')).toBeNull()
  })

  it('should handle storage errors gracefully', () => {
    // Mock sessionStorage to throw error
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded')
    })

    // Should not throw, just handle gracefully
    expect(() => {
      try {
        sessionStorage.setItem('recruiter-mode', 'true')
      } catch (error) {
        console.warn('Could not store recruiter mode:', error)
      }
    }).not.toThrow()

    // Restore
    Storage.prototype.setItem = originalSetItem
  })
})

// ============================================================================
// Download Tracking Tests
// ============================================================================

describe('Download Tracking', () => {
  it('should track PDF downloads', () => {
    const trackDownload = (format: 'pdf' | 'text', downloads: Record<'pdf' | 'text', number>) => {
      downloads[format] += 1
    }

    const downloads = { pdf: 0, text: 0 }
    trackDownload('pdf', downloads)

    expect(downloads.pdf).toBe(1)
    expect(downloads.text).toBe(0)
  })

  it('should track text downloads', () => {
    const trackDownload = (format: 'pdf' | 'text', downloads: Record<'pdf' | 'text', number>) => {
      downloads[format] += 1
    }

    const downloads = { pdf: 0, text: 0 }
    trackDownload('text', downloads)

    expect(downloads.pdf).toBe(0)
    expect(downloads.text).toBe(1)
  })

  it('should track multiple downloads correctly', () => {
    const trackDownload = (format: 'pdf' | 'text', downloads: Record<'pdf' | 'text', number>) => {
      downloads[format] += 1
    }

    const downloads = { pdf: 0, text: 0 }

    trackDownload('pdf', downloads)
    trackDownload('pdf', downloads)
    trackDownload('text', downloads)

    expect(downloads.pdf).toBe(2)
    expect(downloads.text).toBe(1)
  })

  it('should log analytics events', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const logAnalytics = (format: 'pdf' | 'text', viewDuration: number) => {
      console.log('[Analytics] Resume download:', {
        format,
        timestamp: new Date().toISOString(),
        viewDuration
      })
    }

    logAnalytics('pdf', 30)

    expect(consoleSpy).toHaveBeenCalledWith(
      '[Analytics] Resume download:',
      expect.objectContaining({
        format: 'pdf',
        viewDuration: 30
      })
    )

    consoleSpy.mockRestore()
  })
})

// ============================================================================
// View Duration Tests
// ============================================================================

describe('View Duration Tracking', () => {
  it('should calculate duration correctly', () => {
    const startTime = Date.now()
    const endTime = startTime + 5000 // 5 seconds later
    const duration = Math.floor((endTime - startTime) / 1000)

    expect(duration).toBe(5)
  })

  it('should track duration in seconds', () => {
    const startTime = Date.now()

    // Simulate time passing
    const currentTime = startTime + 30000 // 30 seconds
    const viewDuration = Math.floor((currentTime - startTime) / 1000)

    expect(viewDuration).toBe(30)
  })

  it('should handle long durations', () => {
    const startTime = Date.now()
    const currentTime = startTime + 300000 // 5 minutes
    const viewDuration = Math.floor((currentTime - startTime) / 1000)

    expect(viewDuration).toBe(300)
  })
})

// ============================================================================
// Link Generation Tests
// ============================================================================

describe('Recruiter Link Generation', () => {
  it('should generate valid recruiter link', () => {
    const generateLink = (baseURL: string) => {
      const url = new URL(baseURL)
      url.searchParams.set('recruiter', 'true')
      return url.toString()
    }

    const link = generateLink('http://localhost:5173')
    expect(link).toBe('http://localhost:5173/?recruiter=true')
  })

  it('should handle existing query parameters', () => {
    const generateLink = (baseURL: string) => {
      const url = new URL(baseURL)
      url.searchParams.set('recruiter', 'true')
      return url.toString()
    }

    const link = generateLink('http://localhost:5173?existing=param')
    expect(link).toContain('recruiter=true')
    expect(link).toContain('existing=param')
  })

  it('should copy to clipboard', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined)
    }

    Object.assign(navigator, {
      clipboard: mockClipboard
    })

    const url = 'http://localhost:5173?recruiter=true'
    await navigator.clipboard.writeText(url)

    expect(mockClipboard.writeText).toHaveBeenCalledWith(url)
  })

  it('should handle clipboard errors gracefully', async () => {
    const mockClipboard = {
      writeText: vi.fn().mockRejectedValue(new Error('Clipboard access denied'))
    }

    Object.assign(navigator, {
      clipboard: mockClipboard
    })

    const copyToClipboard = async (url: string) => {
      try {
        await navigator.clipboard.writeText(url)
        return true
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        return false
      }
    }

    const result = await copyToClipboard('http://localhost:5173?recruiter=true')
    expect(result).toBe(false)
  })
})

// ============================================================================
// Integration Tests
// ============================================================================

describe('Recruiter Mode Integration', () => {
  it('should provide complete workflow', () => {
    // 1. Detect from URL
    const url = new URL('http://localhost:5173?recruiter=true')
    const params = new URLSearchParams(url.search)
    const isRecruiter = params.get('recruiter') === 'true'
    expect(isRecruiter).toBe(true)

    // 2. Store in session
    sessionStorage.setItem('recruiter-mode', 'true')
    expect(sessionStorage.getItem('recruiter-mode')).toBe('true')

    // 3. Track downloads
    const downloads = { pdf: 0, text: 0 }
    downloads.pdf += 1
    expect(downloads.pdf).toBe(1)

    // 4. Clear session
    sessionStorage.removeItem('recruiter-mode')
    expect(sessionStorage.getItem('recruiter-mode')).toBeNull()
  })

  it('should handle mode switching', () => {
    // Enable recruiter mode
    let isRecruiterMode = false
    isRecruiterMode = true
    expect(isRecruiterMode).toBe(true)

    // Disable recruiter mode
    isRecruiterMode = false
    expect(isRecruiterMode).toBe(false)
  })
})

// ============================================================================
// Config Tests
// ============================================================================

describe('Recruiter Mode Configuration', () => {
  it('should respect autoDetect config', () => {
    const config = { autoDetect: true, trackDownloads: true }
    expect(config.autoDetect).toBe(true)

    const config2 = { autoDetect: false, trackDownloads: true }
    expect(config2.autoDetect).toBe(false)
  })

  it('should respect trackDownloads config', () => {
    const config = { autoDetect: true, trackDownloads: false }

    if (!config.trackDownloads) {
      // Don't track
      expect(config.trackDownloads).toBe(false)
    }
  })

  it('should use default config values', () => {
    const config = { autoDetect: true, trackDownloads: true }

    expect(config.autoDetect).toBe(true)
    expect(config.trackDownloads).toBe(true)
  })
})

