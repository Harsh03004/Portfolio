import { useRef } from 'react'
import { DirectionalLight, AmbientLight } from 'three'
import { useFrame } from '@react-three/fiber'
import { FANTASY_TECH_THEME } from '@/lib/constants'
import { PerformanceMode } from '@/lib/types'

interface LightingProps {
  performanceMode: PerformanceMode
}

export default function Lighting({ performanceMode }: LightingProps) {
  const directionalLightRef = useRef<DirectionalLight>(null)
  const ambientLightRef = useRef<AmbientLight>(null)

  // Get lighting settings based on performance mode
  const getLightingConfig = () => {
    switch (performanceMode) {
      case 'high':
        return {
          ambientIntensity: 0.3,
          directionalIntensity: 1.2,
          shadowMapSize: 2048,
          enableShadows: true,
        }
      case 'medium':
        return {
          ambientIntensity: 0.4,
          directionalIntensity: 1.0,
          shadowMapSize: 1024,
          enableShadows: true,
        }
      case 'low':
        return {
          ambientIntensity: 0.6,
          directionalIntensity: 0.8,
          shadowMapSize: 512,
          enableShadows: false,
        }
      default:
        return {
          ambientIntensity: 0.4,
          directionalIntensity: 1.0,
          shadowMapSize: 1024,
          enableShadows: true,
        }
    }
  }

  const config = getLightingConfig()

  // Subtle light animation for fantasy atmosphere
  useFrame((state) => {
    if (directionalLightRef.current) {
      // Gentle breathing effect on the main light
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      directionalLightRef.current.intensity = config.directionalIntensity + breathe
    }

    if (ambientLightRef.current) {
      // Subtle ambient light variation
      const ambient = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
      ambientLightRef.current.intensity = config.ambientIntensity + ambient
    }
  })

  return (
    <>
      {/* Ambient lighting for overall scene illumination */}
      <ambientLight 
        ref={ambientLightRef}
        intensity={config.ambientIntensity}
        color={FANTASY_TECH_THEME.colors.primary}
      />
      
      {/* Main directional light */}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={config.directionalIntensity}
        color="#ffffff"
        castShadow={config.enableShadows}
        shadow-mapSize-width={config.shadowMapSize}
        shadow-mapSize-height={config.shadowMapSize}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Accent lighting for fantasy atmosphere */}
      <pointLight
        position={[-5, 5, 5]}
        intensity={0.5}
        color={FANTASY_TECH_THEME.colors.secondary}
        distance={20}
        decay={2}
      />
      
      <pointLight
        position={[5, -3, -5]}
        intensity={0.3}
        color={FANTASY_TECH_THEME.colors.accent}
        distance={15}
        decay={2}
      />
      
      {/* Rim lighting for depth */}
      <directionalLight
        position={[-10, 0, -10]}
        intensity={0.2}
        color={FANTASY_TECH_THEME.colors.primary}
      />
    </>
  )
}
