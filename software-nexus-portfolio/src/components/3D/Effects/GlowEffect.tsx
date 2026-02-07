import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'

interface GlowEffectProps {
  position?: [number, number, number]
  color?: string
  intensity?: number
  size?: number
  pulseSpeed?: number
}

export default function GlowEffect({
  position = [0, 0, 0],
  color = '#00ffff',
  intensity = 1.0,
  size = 1.0,
  pulseSpeed = 1.0
}: GlowEffectProps) {
  const glowRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (glowRef.current) {
      // Pulsing glow
      const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.3 + 0.7
      glowRef.current.scale.setScalar(size * pulse)
      
      // Update material opacity
      const material = glowRef.current.material as any
      if (material.opacity !== undefined) {
        material.opacity = intensity * pulse * 0.5
      }
    }
  })

  return (
    <mesh ref={glowRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity * 0.5}
        depthWrite={false}
      />
    </mesh>
  )
}
