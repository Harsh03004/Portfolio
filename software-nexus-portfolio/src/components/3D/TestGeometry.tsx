import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { FANTASY_TECH_THEME } from '@/lib/constants'

interface TestGeometryProps {
  position?: [number, number, number]
  scale?: number
}

export default function TestGeometry({ 
  position = [0, 0, 0], 
  scale = 1 
}: TestGeometryProps) {
  const meshRef = useRef<Mesh>(null)

  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      meshRef.current.rotation.y += 0.01
      
      // Gentle floating motion
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2
    }
  })

  return (
    <group>
      {/* Main test cube with holographic material */}
      <mesh 
        ref={meshRef}
        position={position}
        scale={scale}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={FANTASY_TECH_THEME.colors.primary}
          emissive={FANTASY_TECH_THEME.colors.primary}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Wireframe overlay for tech aesthetic */}
      <mesh position={position} scale={scale * 1.01}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color={FANTASY_TECH_THEME.colors.accent}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Floating particles around the cube */}
      {Array.from({ length: 8 }).map((_, i) => (
        <FloatingParticle
          key={i}
          index={i}
          centerPosition={position}
          radius={2}
        />
      ))}
    </group>
  )
}

interface FloatingParticleProps {
  index: number
  centerPosition: [number, number, number]
  radius: number
}

function FloatingParticle({ index, centerPosition, radius }: FloatingParticleProps) {
  const particleRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (particleRef.current) {
      const time = state.clock.elapsedTime
      const offset = (index / 8) * Math.PI * 2
      
      particleRef.current.position.x = centerPosition[0] + Math.cos(time * 0.5 + offset) * radius
      particleRef.current.position.z = centerPosition[2] + Math.sin(time * 0.5 + offset) * radius
      particleRef.current.position.y = centerPosition[1] + Math.sin(time * 0.8 + offset) * 0.5
      
      // Gentle glow pulsing
      const material = particleRef.current.material as any
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.5 + Math.sin(time * 2 + offset) * 0.3
      }
    }
  })

  return (
    <mesh ref={particleRef} scale={0.1}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial
        color={FANTASY_TECH_THEME.colors.secondary}
        emissive={FANTASY_TECH_THEME.colors.secondary}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}
