import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { PerformanceMode } from '@/lib/types'
import SceneManager from './SceneManager'
import Lighting from './Lighting'
import { useSceneSetup } from '@/hooks/useSceneSetup'

interface SceneProps {
  performanceMode: PerformanceMode
  children: React.ReactNode
  shouldReduceMotion?: boolean
}

export default function Scene({ performanceMode, children, shouldReduceMotion: _shouldReduceMotion = false }: SceneProps) {
  const {
    isReady,
    hasError,
    contextLost,
    errorMessage,
    handleSceneReady,
    handleContextLoss,
    handleContextRestore,
    resetError,
  } = useSceneSetup(performanceMode)

  const getCanvasSettings = () => {
    const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    
    switch (performanceMode) {
      case 'high':
        return {
          shadows: true,
          antialias: true,
          dpr: Math.min(devicePixelRatio, 2),
        }
      case 'medium':
        return {
          shadows: true,
          antialias: true,
          dpr: 1,
        }
      case 'low':
        return {
          shadows: false,
          antialias: false,
          dpr: 1,
        }
      default:
        return {
          shadows: true,
          antialias: true,
          dpr: 1,
        }
    }
  }

  const canvasSettings = getCanvasSettings()

  // Error state
  if (hasError) {
    return (
      <div style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(to bottom, #0f172a, #000000)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f87171' }}>
            3D Scene Error
          </h2>
          <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>{errorMessage}</p>
          <button 
            onClick={resetError}
            style={{
              padding: '0.5rem 1rem',
              background: '#0891b2',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(to bottom, #0f172a, #000000)',
      position: 'relative'
    }}>
      <Canvas
        camera={{
          position: [0, 2, 15],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        {...canvasSettings}
        gl={{
          alpha: true,
          powerPreference: 'high-performance',
          antialias: canvasSettings.antialias,
        }}
      >
        <Suspense fallback={null}>
          {/* Scene management and context handling */}
          <SceneManager
            onContextLoss={handleContextLoss}
            onContextRestore={handleContextRestore}
            onSceneReady={handleSceneReady}
          />
          
          {/* Lighting system */}
          <Lighting performanceMode={performanceMode} />
          
          {/* Scene content */}
          {isReady && !contextLost && children}
        </Suspense>
      </Canvas>
      
      {/* Status indicators */}
      {contextLost && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: '#7f1d1d',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem'
        }}>
          WebGL Context Lost - Attempting to restore...
        </div>
      )}
      
      {!isReady && !hasError && !contextLost && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: '#1e3a8a',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.25rem'
        }}>
          Initializing 3D Scene...
        </div>
      )}
    </div>
  )
}
