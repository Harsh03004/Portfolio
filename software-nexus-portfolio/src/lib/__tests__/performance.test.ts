/**
 * Performance Optimization Tests
 * Tests for rendering optimizations, asset loading, and performance monitoring
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  PerformanceMonitor,
  QualityAdjuster,
  getDevicePerformanceTier,
  checkWebGLCapabilities,
  MemoryEstimator,
  FrameRateController
} from '@/lib/utils/performance'
import {
  RenderingStats
} from '@/lib/utils/renderingOptimization'
import {
  AssetCache,
  LoadingQueue,
  AssetManager,
  CompressionSupport
} from '@/lib/managers/AssetManager'

// ============================================================================
// Performance Monitor Tests
// ============================================================================

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor

  beforeEach(() => {
    monitor = new PerformanceMonitor({
      targetFPS: 60,
      maxFrameTime: 16.67,
      warningFPS: 45,
      criticalFPS: 30
    })
  })

  it('should track FPS', () => {
    for (let i = 0; i < 60; i++) {
      monitor.update()
    }
    expect(monitor.getFPS()).toBeGreaterThan(0)
  })

  it('should track frame time', () => {
    monitor.update()
    const frameTime = monitor.getFrameTime()
    expect(frameTime).toBeGreaterThanOrEqual(0)
  })

  it('should calculate average FPS', () => {
    for (let i = 0; i < 60; i++) {
      monitor.update()
    }
    const avgFPS = monitor.getAverageFPS()
    expect(avgFPS).toBeGreaterThan(0)
  })

  it('should determine performance status', () => {
    monitor.update()
    const status = monitor.getStatus()
    expect(['optimal', 'warning', 'critical']).toContain(status)
  })

  it('should store metrics', () => {
    for (let i = 0; i < 10; i++) {
      monitor.update()
    }
    const metrics = monitor.getMetrics()
    expect(metrics.length).toBeGreaterThan(0)
  })

  it('should reset metrics', () => {
    monitor.update()
    monitor.reset()
    const metrics = monitor.getMetrics()
    expect(metrics).toHaveLength(0)
  })
})

// ============================================================================
// Quality Adjuster Tests
// ============================================================================

describe('QualityAdjuster', () => {
  let monitor: PerformanceMonitor
  let adjuster: QualityAdjuster

  beforeEach(() => {
    monitor = new PerformanceMonitor()
    adjuster = new QualityAdjuster(monitor)
  })

  it('should have default quality', () => {
    expect(adjuster.getQuality()).toBe('high')
  })

  it('should allow manual quality setting', () => {
    adjuster.setQuality('medium')
    expect(adjuster.getQuality()).toBe('medium')

    adjuster.setQuality('low')
    expect(adjuster.getQuality()).toBe('low')
  })

  it('should provide texture quality', () => {
    const quality = adjuster.getTextureQuality()
    expect(['high', 'medium', 'low']).toContain(quality)
  })

  it('should provide shadow quality', () => {
    const quality = adjuster.getShadowQuality()
    expect(['high', 'medium', 'low']).toContain(quality)
  })

  it('should calculate particle multiplier', () => {
    const multiplier = adjuster.getParticleMultiplier()
    expect(multiplier).toBeGreaterThan(0)
    expect(multiplier).toBeLessThanOrEqual(1)
  })

  it('should auto-adjust quality based on performance', () => {
    const changed = adjuster.autoAdjust()
    expect(typeof changed).toBe('boolean')
  })
})

// ============================================================================
// Device Detection Tests
// ============================================================================

describe('Device Detection', () => {
  it('should detect device performance tier', () => {
    const tier = getDevicePerformanceTier()
    expect(['high', 'medium', 'low']).toContain(tier)
  })

  it('should check WebGL capabilities', () => {
    const capabilities = checkWebGLCapabilities()
    expect(capabilities).toHaveProperty('supported')
    expect(capabilities).toHaveProperty('capabilities')
  })
})

// ============================================================================
// Memory Estimator Tests
// ============================================================================

describe('MemoryEstimator', () => {
  it('should estimate geometry memory', () => {
    const memory = MemoryEstimator.estimateGeometryMemory(1000, 2000)
    expect(memory).toBeGreaterThan(0)
  })

  it('should estimate texture memory', () => {
    const memory = MemoryEstimator.estimateTextureMemory(2048, 2048, 'RGBA')
    expect(memory).toBeGreaterThan(0)
  })

  it('should format memory correctly', () => {
    expect(MemoryEstimator.formatMemory(512)).toContain('B')
    expect(MemoryEstimator.formatMemory(1024)).toContain('KB')
    expect(MemoryEstimator.formatMemory(1024 * 1024)).toContain('MB')
  })

  it('should handle different texture formats', () => {
    const rgbaMemory = MemoryEstimator.estimateTextureMemory(1024, 1024, 'RGBA')
    const rgbMemory = MemoryEstimator.estimateTextureMemory(1024, 1024, 'RGB')
    const dxtMemory = MemoryEstimator.estimateTextureMemory(1024, 1024, 'DXT')

    expect(dxtMemory).toBeLessThan(rgbMemory)
    expect(rgbMemory).toBeLessThan(rgbaMemory)
  })
})

// ============================================================================
// Frame Rate Controller Tests
// ============================================================================

describe('FrameRateController', () => {
  it('should create with default FPS', () => {
    const controller = new FrameRateController()
    expect(controller).toBeDefined()
  })

  it('should accept custom target FPS', () => {
    const controller = new FrameRateController(30)
    expect(controller).toBeDefined()
  })

  it('should allow setting target FPS', () => {
    const controller = new FrameRateController(60)
    controller.setTargetFPS(30)
    expect(controller).toBeDefined()
  })
})

// ============================================================================
// Asset Cache Tests
// ============================================================================

describe('AssetCache', () => {
  let cache: AssetCache

  beforeEach(() => {
    cache = new AssetCache(1) // 1 MB
  })

  it('should store and retrieve assets', () => {
    const asset = { type: 'geometry', data: [] }
    cache.set('test-asset', asset, 1000)

    expect(cache.get('test-asset')).toEqual(asset)
  })

  it('should return null for missing assets', () => {
    expect(cache.get('nonexistent')).toBeNull()
  })

  it('should evict oldest items when max size exceeded', () => {
    // Fill cache to capacity (1 MB = 1024 * 1024 bytes)
    cache.set('asset1', { data: 'a'.repeat(512 * 1024) }, 512 * 1024)
    cache.set('asset2', { data: 'b'.repeat(512 * 1024) }, 512 * 1024)
    cache.set('asset3', { data: 'c'.repeat(512 * 1024) }, 512 * 1024)

    const stats = cache.getStats()
    expect(stats.currentSize).toBeLessThanOrEqual(stats.maxSize)
  })

  it('should report cache statistics', () => {
    cache.set('test', { data: 'test' }, 1000)
    const stats = cache.getStats()

    expect(stats).toHaveProperty('itemCount')
    expect(stats).toHaveProperty('currentSize')
    expect(stats).toHaveProperty('maxSize')
    expect(stats).toHaveProperty('utilizationPercent')
  })

  it('should clear cache', () => {
    cache.set('test1', { data: 'test' }, 1000)
    cache.set('test2', { data: 'test' }, 1000)
    cache.clear()

    expect(cache.get('test1')).toBeNull()
    expect(cache.get('test2')).toBeNull()
  })
})

// ============================================================================
// Asset Manager Tests
// ============================================================================

describe('AssetManager', () => {
  let manager: AssetManager

  beforeEach(() => {
    manager = new AssetManager(50)
  })

  it('should load assets', async () => {
    const mockLoader = vi.fn(async () => ({ type: 'mesh' }))
    const asset = await manager.loadAsset('test.gltf', mockLoader)

    expect(asset).toEqual({ type: 'mesh' })
    expect(mockLoader).toHaveBeenCalled()
  })

  it('should cache loaded assets', async () => {
    const mockLoader = vi.fn(async () => ({ type: 'mesh' }))

    await manager.loadAsset('test.gltf', mockLoader)
    const asset = manager.getAsset('test.gltf')

    expect(asset).toBeDefined()
  })

  it('should report cache statistics', () => {
    const stats = manager.getCacheStats()
    expect(stats).toHaveProperty('itemCount')
    expect(stats).toHaveProperty('currentSize')
  })

  it('should clear cache', async () => {
    const mockLoader = vi.fn(async () => ({ type: 'mesh' }))
    await manager.loadAsset('test.gltf', mockLoader)

    manager.clearCache()
    const asset = manager.getAsset('test.gltf')

    expect(asset).toBeNull()
  })
})

// ============================================================================
// Compression Support Tests
// ============================================================================

describe('CompressionSupport', () => {
  it('should check Draco support', () => {
    const supported = CompressionSupport.supportsDraco()
    expect(typeof supported).toBe('boolean')
  })

  it('should check KTX2 support', () => {
    const supported = CompressionSupport.supportsKTX2()
    expect(typeof supported).toBe('boolean')
  })

  it('should recommend optimal format', () => {
    const format = CompressionSupport.getOptimalFormat()
    expect(['gltf', 'glb-draco', 'glb']).toContain(format)
  })

  it('should recommend optimal texture format', () => {
    const format = CompressionSupport.getOptimalTextureFormat()
    expect(['ktx2', 'webp', 'png']).toContain(format)
  })
})

// ============================================================================
// Loading Queue Tests
// ============================================================================

describe('LoadingQueue', () => {
  let queue: LoadingQueue

  beforeEach(() => {
    queue = new LoadingQueue()
  })

  it('should enqueue assets', async () => {
    const loader = vi.fn(async () => ({ type: 'asset' }))
    queue.enqueue('test.gltf', 'high', loader)

    expect(queue.getQueueLength()).toBe(1)
  })

  it('should set max concurrent loads', () => {
    queue.setMaxConcurrent(5)
    expect(queue).toBeDefined()
  })

  it('should clear queue', () => {
    const loader = vi.fn(async () => ({}))
    queue.enqueue('test1.gltf', 'high', loader)
    queue.enqueue('test2.gltf', 'medium', loader)
    queue.clear()

    expect(queue.getQueueLength()).toBe(0)
  })
})

// ============================================================================
// Rendering Stats Tests
// ============================================================================

describe('RenderingStats', () => {
  let stats: RenderingStats

  beforeEach(() => {
    stats = new RenderingStats()
  })

  it('should provide stats summary', () => {
    const summary = stats.getSummary()
    expect(summary).toContain('Meshes')
    expect(summary).toContain('Triangles')
  })

  it('should return raw statistics', () => {
    const rawStats = stats.getStats()
    expect(rawStats).toHaveProperty('meshes')
    expect(rawStats).toHaveProperty('drawCalls')
    expect(rawStats).toHaveProperty('triangles')
  })
})

