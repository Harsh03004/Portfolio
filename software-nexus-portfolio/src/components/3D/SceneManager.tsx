import { useRef, useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { WebGLRenderer, Scene as ThreeScene, Camera } from 'three'

interface SceneManagerProps {
  onContextLoss?: () => void
  onContextRestore?: () => void
  onSceneReady?: (scene: ThreeScene, camera: Camera, renderer: WebGLRenderer) => void
}

export default function SceneManager({ 
  onContextLoss, 
  onContextRestore, 
  onSceneReady 
}: SceneManagerProps) {
  const { gl, scene, camera } = useThree()
  const [contextLost, setContextLost] = useState(false)
  const sceneReadyRef = useRef(false)

  // Handle WebGL context loss and restoration
  useEffect(() => {
    const canvas = gl.domElement

    const handleContextLoss = (event: Event) => {
      event.preventDefault()
      setContextLost(true)
      sceneReadyRef.current = false
      console.warn('WebGL context lost. Attempting to restore...')
      onContextLoss?.()
    }

    const handleContextRestore = () => {
      setContextLost(false)
      console.log('WebGL context restored successfully')
      onContextRestore?.()
      
      // Re-initialize scene after context restoration
      setTimeout(() => {
        if (onSceneReady) {
          onSceneReady(scene, camera, gl)
          sceneReadyRef.current = true
        }
      }, 100)
    }

    canvas.addEventListener('webglcontextlost', handleContextLoss)
    canvas.addEventListener('webglcontextrestored', handleContextRestore)

    // Initial scene setup
    if (!sceneReadyRef.current && !contextLost) {
      onSceneReady?.(scene, camera, gl)
      sceneReadyRef.current = true
    }

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLoss)
      canvas.removeEventListener('webglcontextrestored', handleContextRestore)
    }
  }, [gl, scene, camera, onContextLoss, onContextRestore, onSceneReady, contextLost])

  // Monitor performance and context state
  useFrame(() => {
    if (contextLost) return
    
    // Basic scene validation
    if (!gl.getContext()) {
      console.warn('WebGL context is null')
      setContextLost(true)
    }
  })

  // Render context loss indicator
  if (contextLost) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 1, 0.1]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
    )
  }

  return null
}
