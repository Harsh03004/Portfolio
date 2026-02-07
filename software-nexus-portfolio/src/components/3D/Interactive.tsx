import { useRef, useEffect, useState, ReactNode } from 'react'
import { Group } from 'three'
import { useInteractions } from '@/hooks/useInteractions'
import { useAudio } from '@/hooks/useAudio'
import { InteractionEvent } from '@/lib/managers/InteractionManager'
import HoverGlow from './Effects/HoverGlow'

interface InteractiveProps {
  children: ReactNode
  onHoverIn?: (event: InteractionEvent) => void
  onHoverOut?: (event: InteractionEvent) => void
  onClick?: (event: InteractionEvent) => void
  hoverScale?: number
  hoverColor?: string
  disabled?: boolean
  enableGlow?: boolean
  enableSound?: boolean
}

export default function Interactive({
  children,
  onHoverIn,
  onHoverOut,
  onClick,
  hoverScale = 1.1,
  hoverColor = '#00ffff',
  disabled = false,
  enableGlow = true,
  enableSound = true
}: InteractiveProps) {
  const groupRef = useRef<Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { addInteractive, removeInteractive } = useInteractions()
  const { playHover, playClick } = useAudio()

  useEffect(() => {
    if (!groupRef.current || disabled) return

    const group = groupRef.current

    // Register as interactive
    addInteractive(group, {
      onHoverIn: (event) => {
        setIsHovered(true)
        if (enableSound) playHover()
        onHoverIn?.(event)
      },
      onHoverOut: (event) => {
        setIsHovered(false)
        onHoverOut?.(event)
      },
      onClick: (event) => {
        if (enableSound) playClick()
        onClick?.(event)
      }
    })

    return () => {
      removeInteractive(group)
    }
  }, [addInteractive, removeInteractive, onHoverIn, onHoverOut, onClick, disabled, enableSound, playHover, playClick])

  // Apply hover effects
  useEffect(() => {
    if (!groupRef.current) return

    if (isHovered && !disabled) {
      // Scale up on hover
      groupRef.current.scale.setScalar(hoverScale)
      
      // Change cursor
      document.body.style.cursor = 'pointer'
    } else {
      // Reset scale
      groupRef.current.scale.setScalar(1)
      
      // Reset cursor
      document.body.style.cursor = 'default'
    }
  }, [isHovered, hoverScale, disabled])

  return (
    <group ref={groupRef}>
      {children}
      {enableGlow && (
        <HoverGlow 
          isHovered={isHovered} 
          color={hoverColor}
          intensity={0.4}
          scale={1.5}
        />
      )}
    </group>
  )
}
