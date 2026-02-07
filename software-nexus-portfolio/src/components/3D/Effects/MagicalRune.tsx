import { useRef } from 'react'
import { Group, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import BreathingAnimation from './BreathingAnimation'

interface MagicalRuneProps {
  position: [number, number, number]
  symbol: string
  label?: string
  color?: string
  size?: number
}

export default function MagicalRune({
  position,
  symbol,
  label,
  color = '#ffd700',
  size = 1
}: MagicalRuneProps) {
  const groupRef = useRef<Group>(null)
  const runeRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }

    if (runeRef.current) {
      // Pulsing glow
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 1
      runeRef.current.scale.setScalar(pulse * size)
    }

    if (glowRef.current) {
      // Rotating glow
      glowRef.current.rotation.z -= 0.02
      const material = glowRef.current.material as any
      if (material.opacity !== undefined) {
        material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      }
    }
  })

  return (
    <BreathingAnimation speed={0.8} intensity={0.08} scaleOnly>
      <group ref={groupRef} position={position}>
        {/* Outer glow ring */}
        <mesh ref={glowRef} scale={size * 1.5}>
          <ringGeometry args={[0.8, 1, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={2}
          />
        </mesh>

      {/* Inner rune circle */}
      <mesh ref={runeRef} scale={size}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
          side={2}
        />
      </mesh>

      {/* Rune symbol */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.5 * size}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={color}
      >
        {symbol}
      </Text>

      {/* Label below */}
      {label && (
        <Text
          position={[0, -1.2 * size, 0]}
          fontSize={0.2 * size}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {label}
        </Text>
      )}

        {/* Orbiting particles */}
        {Array.from({ length: 6 }).map((_, i) => (
          <OrbitingParticle
            key={i}
            index={i}
            total={6}
            radius={1.2 * size}
            color={color}
          />
        ))}
      </group>
    </BreathingAnimation>
  )
}

interface OrbitingParticleProps {
  index: number
  total: number
  radius: number
  color: string
}

function OrbitingParticle({ index, total, radius, color }: OrbitingParticleProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const offset = (index / total) * Math.PI * 2
      
      meshRef.current.position.x = Math.cos(time + offset) * radius
      meshRef.current.position.y = Math.sin(time + offset) * radius
      
      // Pulsing
      const material = meshRef.current.material as any
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.5 + Math.sin(time * 3 + offset) * 0.3
      }
    }
  })

  return (
    <mesh ref={meshRef} scale={0.08}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}
