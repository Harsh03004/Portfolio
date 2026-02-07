import { useRef, ReactNode } from 'react'
import { Group } from 'three'
import { useFrame } from '@react-three/fiber'

interface BreathingAnimationProps {
  children: ReactNode
  speed?: number
  intensity?: number
  scaleOnly?: boolean
}

/**
 * Breathing animation for ambient objects
 * Creates subtle scale and opacity pulsing
 */
export default function BreathingAnimation({ 
  children, 
  speed = 1, 
  intensity = 0.1,
  scaleOnly = false 
}: BreathingAnimationProps) {
  const groupRef = useRef<Group>(null)
  const timeRef = useRef(0)

  useFrame((_state, delta) => {
    if (!groupRef.current) return

    timeRef.current += delta * speed

    // Breathing scale effect
    const breathe = Math.sin(timeRef.current) * intensity + 1
    groupRef.current.scale.setScalar(breathe)

    // Optional opacity breathing (for materials that support it)
    if (!scaleOnly) {
      groupRef.current.traverse((child) => {
        if ('material' in child && child.material) {
          const material = child.material as any
          if (material.transparent && 'opacity' in material) {
            const baseOpacity = material.userData?.baseOpacity ?? material.opacity
            if (!material.userData?.baseOpacity) {
              material.userData.baseOpacity = material.opacity
            }
            material.opacity = baseOpacity * (0.7 + Math.sin(timeRef.current * 0.5) * 0.3)
          }
        }
      })
    }
  })

  return <group ref={groupRef}>{children}</group>
}
