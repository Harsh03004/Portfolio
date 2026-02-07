/**
 * Asset Loading and Management System
 * Handles progressive loading, compression, and caching of 3D assets
 * Requirements: 7.1, 7.2, 8.3
 */

export interface AssetLoadConfig {
  priority?: 'high' | 'medium' | 'low'
  format?: 'gltf' | 'glb' | 'obj' | 'fbx'
  compressed?: boolean
  preload?: boolean
  maxRetries?: number
}

export interface AssetLoadProgress {
  url: string
  loaded: number
  total: number
  percentage: number
}

export interface CachedAsset {
  data: any
  timestamp: number
  size: number
}

/**
 * Asset cache with LRU eviction
 */
export class AssetCache {
  private cache = new Map<string, CachedAsset>()
  private maxSize: number // in bytes
  private currentSize = 0

  constructor(maxSizeMB: number = 100) {
    this.maxSize = maxSizeMB * 1024 * 1024
  }

  /**
   * Get cached asset
   */
  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    // Update timestamp for LRU
    cached.timestamp = Date.now()
    return cached.data
  }

  /**
   * Set cached asset
   */
  set(key: string, data: any, size: number): void {
    // Remove existing entry if present
    if (this.cache.has(key)) {
      const existing = this.cache.get(key)!
      this.currentSize -= existing.size
    }

    // Make room if needed
    while (this.currentSize + size > this.maxSize && this.cache.size > 0) {
      this.evictLRU()
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      size
    })
    this.currentSize += size
  }

  /**
   * Evict least recently used item
   */
  private evictLRU(): void {
    let lruKey: string | null = null
    let oldestTime = Date.now()

    for (const [key, cached] of this.cache.entries()) {
      if (cached.timestamp < oldestTime) {
        oldestTime = cached.timestamp
        lruKey = key
      }
    }

    if (lruKey) {
      const cached = this.cache.get(lruKey)!
      this.currentSize -= cached.size
      this.cache.delete(lruKey)
    }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear()
    this.currentSize = 0
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      itemCount: this.cache.size,
      currentSize: this.currentSize,
      maxSize: this.maxSize,
      utilizationPercent: (this.currentSize / this.maxSize) * 100
    }
  }
}

/**
 * Priority queue for asset loading
 */
export class LoadingQueue {
  private queue: Array<{
    url: string
    priority: number
    loader: () => Promise<any>
    onProgress?: (progress: AssetLoadProgress) => void
  }> = []
  private loading = false
  private maxConcurrent = 3
  private activeLoads = 0

  /**
   * Add asset to loading queue
   */
  enqueue(
    url: string,
    priority: 'high' | 'medium' | 'low',
    loader: () => Promise<any>,
    onProgress?: (progress: AssetLoadProgress) => void
  ): void {
    const priorityValue = { high: 3, medium: 2, low: 1 }[priority]

    this.queue.push({ url, priority: priorityValue, loader, onProgress })

    // Sort by priority (highest first)
    this.queue.sort((a, b) => b.priority - a.priority)

    // Start loading if not already
    if (!this.loading) {
      this.processQueue()
    }
  }

  /**
   * Process loading queue
   */
  private async processQueue(): Promise<void> {
    this.loading = true

    while (this.queue.length > 0 && this.activeLoads < this.maxConcurrent) {
      const item = this.queue.shift()
      if (!item) break

      this.activeLoads++

      try {
        await item.loader()
      } catch (error) {
        console.error(`Failed to load asset: ${item.url}`, error)
      } finally {
        this.activeLoads--
      }

      // Continue processing if more items and slots available
      if (this.queue.length > 0 && this.activeLoads < this.maxConcurrent) {
        // Process next in queue
        continue
      } else if (this.activeLoads === 0 && this.queue.length === 0) {
        break
      }
    }

    this.loading = this.activeLoads > 0
  }

  /**
   * Set maximum concurrent loads
   */
  setMaxConcurrent(count: number): void {
    this.maxConcurrent = count
    this.processQueue()
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.length
  }

  /**
   * Clear queue
   */
  clear(): void {
    this.queue = []
  }
}

/**
 * Asset Manager for coordinating loading and caching
 */
export class AssetManager {
  private cache: AssetCache
  private loadingQueue: LoadingQueue
  private loadedAssets = new Map<string, any>()

  constructor(cacheSizeMB: number = 100) {
    this.cache = new AssetCache(cacheSizeMB)
    this.loadingQueue = new LoadingQueue()
  }

  /**
   * Load asset with caching and retry logic
   */
  async loadAsset(
    url: string,
    loaderFn: (url: string) => Promise<any>,
    config: AssetLoadConfig = {}
  ): Promise<any> {
    const { maxRetries = 3 } = config

    // Check cache first
    const cached = this.cache.get(url)
    if (cached) {
      return cached
    }

    // Check if already loaded
    if (this.loadedAssets.has(url)) {
      return this.loadedAssets.get(url)
    }

    // Load with retry logic
    let lastError: Error | null = null

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const asset = await this.loadWithProgress(url, loaderFn)

        // Cache the asset (estimate size as 1MB if unknown)
        const size = config.compressed ? 1024 * 512 : 1024 * 1024
        this.cache.set(url, asset, size)
        this.loadedAssets.set(url, asset)

        return asset
      } catch (error) {
        lastError = error as Error
        console.warn(`Asset load attempt ${attempt + 1} failed: ${url}`, error)

        // Wait before retry
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
        }
      }
    }

    throw new Error(`Failed to load asset ${url} after ${maxRetries} attempts: ${lastError?.message}`)
  }

  /**
   * Load asset with progress tracking
   */
  private async loadWithProgress(
    url: string,
    loaderFn: (url: string) => Promise<any>
  ): Promise<any> {
    const progressEvent: AssetLoadProgress = {
      url,
      loaded: 0,
      total: 100,
      percentage: 0
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (progressEvent.percentage < 90) {
        progressEvent.percentage += Math.random() * 30
        progressEvent.loaded = progressEvent.percentage
      }
    }, 100)

    try {
      const asset = await loaderFn(url)
      progressEvent.percentage = 100
      progressEvent.loaded = 100
      return asset
    } finally {
      clearInterval(progressInterval)
    }
  }

  /**
   * Preload multiple assets
   */
  async preloadAssets(
    urls: string[],
    loaderFn: (url: string) => Promise<any>,
    onProgress?: (overall: number) => void
  ): Promise<void> {
    const promises = urls.map((url, index) => {
      return this.loadAsset(url, loaderFn)
        .then(() => {
          onProgress?.((index + 1) / urls.length * 100)
        })
        .catch(error => {
          console.warn(`Preload failed for ${url}:`, error)
        })
    })

    await Promise.all(promises)
  }

  /**
   * Get loaded asset
   */
  getAsset(url: string): any | null {
    return this.loadedAssets.get(url) || null
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats()
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
    this.loadedAssets.clear()
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.loadingQueue.getQueueLength()
  }

  /**
   * Set queue concurrency
   */
  setQueueConcurrency(count: number): void {
    this.loadingQueue.setMaxConcurrent(count)
  }
}

/**
 * Compression detection and format support
 */
export class CompressionSupport {
  /**
   * Check if device supports Draco compression
   */
  static supportsDraco(): boolean {
    // Check if WebAssembly is supported (required for Draco)
    return typeof WebAssembly !== 'undefined'
  }

  /**
   * Check if device supports KTX2 textures
   */
  static supportsKTX2(): boolean {
    if (typeof navigator === 'undefined') return false

    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return false

    // Check for EXT_texture_compression_bptc extension
    return !!(
      gl.getExtension('EXT_texture_compression_bptc') ||
      gl.getExtension('EXT_texture_compression_astc') ||
      gl.getExtension('WEBGL_compressed_texture_s3tc')
    )
  }

  /**
   * Get optimal asset format for device
   */
  static getOptimalFormat(): 'gltf' | 'glb-draco' | 'glb' {
    if (this.supportsDraco()) {
      return 'glb-draco'
    }
    return 'glb'
  }

  /**
   * Get optimal texture format
   */
  static getOptimalTextureFormat(): 'ktx2' | 'webp' | 'png' {
    if (this.supportsKTX2()) {
      return 'ktx2'
    }

    // Check WebP support using canvas
    const canvas = document.createElement('canvas')
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp'
    }

    return 'png'
  }
}

/**
 * Asset preloader hook configuration
 */
export interface AssetPreloadConfig {
  models?: string[]
  textures?: string[]
  audio?: string[]
  onProgress?: (progress: number) => void
}

/**
 * Preload essential assets on app startup
 */
export async function preloadEssentialAssets(
  assetManager: AssetManager,
  config: AssetPreloadConfig,
  loaderFn: (url: string) => Promise<any>
): Promise<void> {
  const allAssets = [
    ...(config.models || []),
    ...(config.textures || []),
    ...(config.audio || [])
  ]

  let loaded = 0
  const total = allAssets.length

  for (const url of allAssets) {
    try {
      await assetManager.loadAsset(url, loaderFn)
      loaded++
      config.onProgress?.(loaded / total * 100)
    } catch (error) {
      console.warn(`Failed to preload asset: ${url}`, error)
    }
  }
}

