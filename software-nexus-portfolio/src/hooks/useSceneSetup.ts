import { useCallback, useState } from 'react'
import { Scene, Camera, WebGLRenderer, ACESFilmicToneMapping, PCFSoftShadowMap, PCFShadowMap } from 'three'
import { PerformanceMode } from '@/lib/types'

interface SceneSetupState {
  isReady: boolean
  hasError: boolean
  contextLost: boolean
  errorMessage?: string
}

export function useSceneSetup(performanceMode: PerformanceMode) {
  const [state, setState] = useState<SceneSetupState>({
    isReady: false,
    hasError: false,
    contextLost: false,
  })

  const handleSceneReady = useCallback((
    scene: Scene, 
    camera: Camera, 
    renderer: WebGLRenderer
  ) => {
    try {
      // Configure renderer based on performance mode
      configureRenderer(renderer, performanceMode)
      
      // Set up scene properties
      scene.fog = null // We'll add fog later for atmosphere

      // Configure camera if it's a perspective camera
      if ('fov' in camera) {
        const perspectiveCamera = camera as any
        perspectiveCamera.fov = 75
        perspectiveCamera.near = 0.1
        perspectiveCamera.far = 1000
        perspectiveCamera.updateProjectionMatrix()
      }

      setState({
        isReady: true,
        hasError: false,
        contextLost: false,
      })

      console.log('Scene setup completed successfully')
    } catch (error) {
      console.error('Scene setup failed:', error)
      setState({
        isReady: false,
        hasError: true,
        contextLost: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }, [performanceMode])

  const handleContextLoss = useCallback(() => {
    setState(prev => ({
      ...prev,
      contextLost: true,
      isReady: false,
    }))
  }, [])

  const handleContextRestore = useCallback(() => {
    setState(prev => ({
      ...prev,
      contextLost: false,
    }))
  }, [])

  const resetError = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasError: false,
      errorMessage: undefined,
    }))
  }, [])

  return {
    ...state,
    handleSceneReady,
    handleContextLoss,
    handleContextRestore,
    resetError,
  }
}

function configureRenderer(renderer: WebGLRenderer, performanceMode: PerformanceMode) {
  // Basic renderer configuration
  renderer.setClearColor(0x0a0a0f, 1)
  renderer.setPixelRatio(getPixelRatio(performanceMode))
  
  // Shadow configuration
  if (performanceMode !== 'low') {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = getShadowMapType(performanceMode)
  } else {
    renderer.shadowMap.enabled = false
  }

  // Tone mapping for better colors
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
}

function getPixelRatio(performanceMode: PerformanceMode): number {
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
  
  switch (performanceMode) {
    case 'high':
      return Math.min(devicePixelRatio, 2)
    case 'medium':
      return Math.min(devicePixelRatio, 1.5)
    case 'low':
      return 1
    default:
      return 1
  }
}

function getShadowMapType(performanceMode: PerformanceMode) {
  switch (performanceMode) {
    case 'high':
      return PCFSoftShadowMap
    case 'medium':
    case 'low':
      return PCFShadowMap
    default:
      return PCFShadowMap
  }
}
