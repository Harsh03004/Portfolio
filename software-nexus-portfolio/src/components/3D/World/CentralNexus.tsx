import { useRef } from 'react'
import { Group, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { FANTASY_TECH_THEME, WORLD_ZONES } from '@/lib/constants'
import { BreathingAnimation } from '../Effects'

export default function CentralNexus() {
  const groupRef = useRef<Group>(null)
  const coreRef = useRef<Mesh>(null)
  const ringsRef = useRef<Group>(null)

  const position = WORLD_ZONES['central-nexus'].position

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation of the entire nexus
      groupRef.current.rotation.y += 0.002
    }

    if (coreRef.current) {
      // Pulsing core
      const pulse = Math.sin(state.clock.elapsedTime * 0.8) * 0.1 + 1
      coreRef.current.scale.setScalar(pulse)
    }

    if (ringsRef.current) {
      // Counter-rotating rings
      ringsRef.current.rotation.y -= 0.003
      ringsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Central core - glowing sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color={FANTASY_TECH_THEME.colors.primary}
          emissive={FANTASY_TECH_THEME.colors.primary}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Inner glow */}
      <BreathingAnimation speed={0.5} intensity={0.15}>
        <mesh scale={1.8}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color={FANTASY_TECH_THEME.colors.primary}
            transparent
            opacity={0.2}
          />
        </mesh>
      </BreathingAnimation>

      {/* Rotating rings */}
      <group ref={ringsRef}>
        {/* Outer ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3, 0.1, 16, 64]} />
          <meshStandardMaterial
            color={FANTASY_TECH_THEME.colors.accent}
            emissive={FANTASY_TECH_THEME.colors.accent}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Middle ring */}
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[2.5, 0.08, 16, 64]} />
          <meshStandardMaterial
            color={FANTASY_TECH_THEME.colors.secondary}
            emissive={FANTASY_TECH_THEME.colors.secondary}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Inner ring */}
        <mesh rotation={[Math.PI / 3, Math.PI / 3, 0]}>
          <torusGeometry args={[2, 0.06, 16, 64]} />
          <meshStandardMaterial
            color={FANTASY_TECH_THEME.colors.primary}
            emissive={FANTASY_TECH_THEME.colors.primary}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Floating data particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <FloatingParticle key={i} index={i} radius={4} />
      ))}

      {/* Ground platform */}
      <mesh position={[0, -2, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5, 0.2, 32]} />
        <meshStandardMaterial
          color={FANTASY_TECH_THEME.colors.surface}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

interface FloatingParticleProps {
  index: number
  radius: number
}

function FloatingParticle({ index, radius }: FloatingParticleProps) {
  const particleRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (particleRef.current) {
      const time = state.clock.elapsedTime
      const offset = (index / 12) * Math.PI * 2

      particleRef.current.position.x = Math.cos(time * 0.5 + offset) * radius
      particleRef.current.position.z = Math.sin(time * 0.5 + offset) * radius
      particleRef.current.position.y = Math.sin(time * 0.8 + offset) * 1.5

      // Pulsing glow
      const material = particleRef.current.material as any
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.5 + Math.sin(time * 2 + offset) * 0.3
      }
    }
  })

  return (
    <mesh ref={particleRef} scale={0.15}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={FANTASY_TECH_THEME.colors.primary}
        emissive={FANTASY_TECH_THEME.colors.primary}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}
