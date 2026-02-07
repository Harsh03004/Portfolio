import { useRef, useEffect, ReactNode } from 'react'
import { Group } from 'three'
import gsap from 'gsap'

interface FeedbackAnimationProps {
  children: ReactNode
  trigger?: boolean
  type?: 'pulse' | 'bounce' | 'shake' | 'glow'
  intensity?: number
  duration?: number
}

/**
 * Feedback animation for user actions
 * Provides immediate visual feedback with smooth animations
 */
export default function FeedbackAnimation({ 
  children, 
  trigger = false,
  type = 'pulse',
  intensity = 1.2,
  duration = 0.3
}: FeedbackAnimationProps) {
  const groupRef = useRef<Group>(null)
  const previousTrigger = useRef(trigger)

  useEffect(() => {
    if (!groupRef.current) return
    
    // Detect trigger change
    if (trigger && !previousTrigger.current) {
      playAnimation()
    }
    
    previousTrigger.current = trigger
  }, [trigger])

  const playAnimation = () => {
    if (!groupRef.current) return

    const group = groupRef.current

    switch (type) {
      case 'pulse':
        // Scale pulse animation
        gsap.to(group.scale, {
          x: intensity,
          y: intensity,
          z: intensity,
          duration: duration / 2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        })
        break

      case 'bounce':
        // Bounce animation
        gsap.to(group.position, {
          y: group.position.y + 0.5,
          duration: duration / 2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        })
        break

      case 'shake':
        // Shake animation
        const originalRotation = group.rotation.z
        gsap.to(group.rotation, {
          z: originalRotation + 0.1,
          duration: duration / 4,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 3
        })
        break

      case 'glow':
        // Glow intensity animation (for materials)
        group.traverse((child) => {
          if ('material' in child && child.material) {
            const material = child.material as any
            if ('emissiveIntensity' in material) {
              const originalIntensity = material.emissiveIntensity
              gsap.to(material, {
                emissiveIntensity: originalIntensity * intensity,
                duration: duration / 2,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
              })
            }
          }
        })
        break
    }
  }

  return <group ref={groupRef}>{children}</group>
}
