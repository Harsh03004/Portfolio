/**
 * Level of Detail (LOD) System
 * Manages mesh quality based on distance and performance
 * Requirements: 7.1, 7.2
 */

import * as THREE from 'three'

export interface LODConfig {
  distances: number[]
  geometries: THREE.BufferGeometry[]
  materials: THREE.Material[]
}

/**
 * LOD Manager for handling multiple levels of detail
 */
export class LODManager {
  private lodObjects: Map<string, THREE.LOD> = new Map()

  /**
   * Create a LOD object from provided geometries
   */
  createLOD(
    id: string,
    position: THREE.Vector3,
    config: LODConfig
  ): THREE.LOD {
    const lod = new THREE.LOD()
    lod.position.copy(position)

    // Add meshes at different distances
    config.geometries.forEach((geometry, index) => {
      const mesh = new THREE.Mesh(geometry, config.materials[index])
      const distance = config.distances[index]
      lod.addLevel(mesh, distance)
    })

    this.lodObjects.set(id, lod)
    return lod
  }

  /**
   * Get LOD object by ID
   */
  getLOD(id: string): THREE.LOD | undefined {
    return this.lodObjects.get(id)
  }

  /**
   * Update LOD distances dynamically
   */
  updateDistances(distances: number[]): void {
    this.lodObjects.forEach(lod => {
      lod.levels.forEach((level, index) => {
        if (index < distances.length) {
          level.distance = distances[index]
        }
      })
    })
  }

  /**
   * Get all LOD objects
   */
  getAll(): THREE.LOD[] {
    return Array.from(this.lodObjects.values())
  }

  /**
   * Remove LOD object
   */
  remove(id: string): void {
    this.lodObjects.delete(id)
  }

  /**
   * Clear all LOD objects
   */
  clear(): void {
    this.lodObjects.clear()
  }
}

/**
 * Geometry simplifier for creating LOD versions
 */
export class GeometrySimplifier {
  /**
   * Simplify geometry by removing vertices
   */
  static simplify(
    geometry: THREE.BufferGeometry,
    simplificationFactor: number = 0.5
  ): THREE.BufferGeometry {
    const simplified = geometry.clone()

    // Get position attribute
    const positions = simplified.getAttribute('position')
    if (!positions) return simplified


    // For simplicity, we'll use indices to skip vertices
    // In production, consider using a library like Simplify.js
    if (simplified.index) {
      const indices = simplified.index.array as Uint32Array
      const newIndices = new Uint32Array(
        Math.floor(indices.length * simplificationFactor)
      )

      let newIndex = 0
      for (let i = 0; i < indices.length; i += Math.ceil(1 / simplificationFactor)) {
        if (newIndex < newIndices.length) {
          newIndices[newIndex++] = indices[i]
        }
      }

      simplified.setIndex(new THREE.BufferAttribute(newIndices, 1))
    }

    return simplified
  }

  /**
   * Create multiple LOD levels from a single geometry
   */
  static createLODLevels(
    geometry: THREE.BufferGeometry,
    levels: number = 3
  ): THREE.BufferGeometry[] {
    const lodGeometries: THREE.BufferGeometry[] = [geometry]

    for (let i = 1; i < levels; i++) {
      const simplificationFactor = 1 - (i / levels) * 0.7 // Reduce by up to 70%
      lodGeometries.push(this.simplify(geometry, simplificationFactor))
    }

    return lodGeometries
  }
}

/**
 * Instancing utilities for rendering many similar objects efficiently
 */
export class InstancedMeshManager {
  private instancedMeshes: Map<string, THREE.InstancedMesh> = new Map()

  /**
   * Create instanced mesh
   */
  createInstancedMesh(
    id: string,
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    count: number
  ): THREE.InstancedMesh {
    const mesh = new THREE.InstancedMesh(geometry, material, count)
    this.instancedMeshes.set(id, mesh)
    return mesh
  }

  /**
   * Get instanced mesh by ID
   */
  getInstancedMesh(id: string): THREE.InstancedMesh | undefined {
    return this.instancedMeshes.get(id)
  }

  /**
   * Update instance transform
   */
  updateInstance(
    id: string,
    index: number,
    position: THREE.Vector3,
    quaternion?: THREE.Quaternion,
    scale?: THREE.Vector3
  ): void {
    const mesh = this.instancedMeshes.get(id)
    if (!mesh) return

    const matrix = new THREE.Matrix4()
    matrix.compose(position, quaternion || new THREE.Quaternion(), scale || new THREE.Vector3(1, 1, 1))
    mesh.setMatrixAt(index, matrix)
    mesh.instanceMatrix.needsUpdate = true
  }

  /**
   * Update multiple instances
   */
  updateInstances(
    id: string,
    updates: Array<{
      index: number
      position: THREE.Vector3
      quaternion?: THREE.Quaternion
      scale?: THREE.Vector3
    }>
  ): void {
    const mesh = this.instancedMeshes.get(id)
    if (!mesh) return

    updates.forEach(update => {
      this.updateInstance(id, update.index, update.position, update.quaternion, update.scale)
    })
  }

  /**
   * Remove instanced mesh
   */
  remove(id: string): void {
    this.instancedMeshes.delete(id)
  }

  /**
   * Get all instanced meshes
   */
  getAll(): THREE.InstancedMesh[] {
    return Array.from(this.instancedMeshes.values())
  }

  /**
   * Clear all instanced meshes
   */
  clear(): void {
    this.instancedMeshes.clear()
  }
}

/**
 * Culling utilities for visibility optimization
 */
export class CullingManager {
  /**
   * Frustum culling using Three.js Frustum
   */
  static frustumCull(
    objects: THREE.Object3D[],
    camera: THREE.Camera
  ): THREE.Object3D[] {
    const frustum = new THREE.Frustum()
    const cameraMatrix = new THREE.Matrix4()
    cameraMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    frustum.setFromProjectionMatrix(cameraMatrix)

    return objects.filter(obj => {
      const box = new THREE.Box3().setFromObject(obj)
      return frustum.intersectsBox(box)
    })
  }

  /**
   * Distance culling - hide objects beyond max distance
   */
  static distanceCull(
    objects: THREE.Object3D[],
    cameraPosition: THREE.Vector3,
    maxDistance: number
  ): THREE.Object3D[] {
    return objects.filter(obj => {
      const distance = obj.position.distanceTo(cameraPosition)
      return distance <= maxDistance
    })
  }

  /**
   * Combined culling strategy
   */
  static cullObjects(
    objects: THREE.Object3D[],
    camera: THREE.Camera,
    maxDistance: number
  ): THREE.Object3D[] {
    const afterDistance = this.distanceCull(objects, camera.position, maxDistance)
    return this.frustumCull(afterDistance, camera)
  }
}

/**
 * Texture optimization utilities
 */
export class TextureOptimizer {
  /**
   * Create mipmaps for texture
   */
  static createMipmaps(texture: THREE.Texture): THREE.Texture {
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    return texture
  }

  /**
   * Optimize texture size for target device
   */
  static optimizeSize(texture: THREE.Texture, maxSize: number = 2048): void {
    if (!texture.image || typeof texture.image !== 'object') return

    const image = texture.image as { width: number; height: number }
    const maxDimension = Math.max(image.width, image.height)
    if (maxDimension > maxSize) {
      // Note: Texture doesn't have a scale property, this would need to be handled differently
      // For now, we'll just log a warning
      console.warn(`Texture size ${maxDimension}px exceeds max ${maxSize}px`)
    }
  }

  /**
   * Set texture quality settings
   */
  static setQuality(texture: THREE.Texture, quality: 'high' | 'medium' | 'low'): void {
    const settings = {
      high: {
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        anisotropy: 16
      },
      medium: {
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        anisotropy: 8
      },
      low: {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        anisotropy: 1
      }
    }

    const setting = settings[quality]
    texture.minFilter = setting.minFilter
    texture.magFilter = setting.magFilter
    texture.anisotropy = setting.anisotropy
    texture.needsUpdate = true
  }
}

/**
 * Rendering statistics collector
 */
export class RenderingStats {
  private stats = {
    drawCalls: 0,
    triangles: 0,
    vertices: 0,
    meshes: 0,
    textures: 0,
    geometries: 0
  }

  /**
   * Collect stats from scene
   */
  collect(scene: THREE.Scene): typeof this.stats {
    this.stats = {
      drawCalls: 0,
      triangles: 0,
      vertices: 0,
      meshes: 0,
      textures: 0,
      geometries: 0
    }

    this.traverseObject(scene)
    return { ...this.stats }
  }

  /**
   * Traverse scene objects and collect statistics
   */
  private traverseObject(object: THREE.Object3D): void {
    if (object instanceof THREE.Mesh) {
      this.stats.meshes++
      this.stats.drawCalls++

      if (object.geometry) {
        this.stats.geometries++
        const positionAttr = object.geometry.getAttribute('position')
        if (positionAttr) {
          this.stats.vertices += positionAttr.count
          this.stats.triangles += positionAttr.count / 3
        }
      }

      if (Array.isArray(object.material)) {
        this.stats.textures += object.material.length
      } else if (object.material) {
        this.stats.textures++
      }
    }

    object.children.forEach(child => this.traverseObject(child))
  }

  /**
   * Get statistics summary
   */
  getSummary(): string {
    return `
      Meshes: ${this.stats.meshes}
      Draw Calls: ${this.stats.drawCalls}
      Triangles: ${Math.round(this.stats.triangles).toLocaleString()}
      Vertices: ${Math.round(this.stats.vertices).toLocaleString()}
      Textures: ${this.stats.textures}
      Geometries: ${this.stats.geometries}
    `.trim()
  }

  /**
   * Get raw stats
   */
  getStats(): typeof this.stats {
    return { ...this.stats }
  }
}

