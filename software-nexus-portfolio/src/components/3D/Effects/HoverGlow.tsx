import { useRef } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'

interface HoverGlowProps {
  isHovered: boolean
  color?: string
  intensity?: number
  scale?: number
}

/**
 * Hover glow effect that appears when an object is hovered
 * Provides smooth fade in/out with pulsing animation
 */
export default function HoverGlow({ 
  isHovered, 
  color = '#00ffff', 
  intensity = 0.5,
  scale = 1.5 
}: HoverGlowProps) {
  const glowRef = useRef<Mesh>(null)
  const opacityRef = useRef(0)
  const pulseRef = useRef(0)

  useFrame((_state, delta) => {
    if (!glowRef.current) return

    // Smooth fade in/out
    const targetOpacity = isHovered ? intensity : 0
    opacityRef.current += (targetOpacity - opacityRef.current) * delta * 8

    // Pulsing effect when hovered
    if (isHovered) {
      pulseRef.current += delta * 2
      const pulse = Math.sin(pulseRef.current) * 0.1 + 1
      glowRef.current.scale.setScalar(scale * pulse)
    } else {
      glowRef.current.scale.setScalar(scale)
      pulseRef.current = 0
    }

    // Update material opacity
    if (glowRef.current.material && 'opacity' in glowRef.current.material) {
      glowRef.current.material.opacity = opacityRef.current
    }
  })

  return (
    <mesh ref={glowRef} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  )
}
