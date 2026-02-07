import { useRef } from 'react'
import { Group, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import Interactive from '../Interactive'
import { FANTASY_TECH_THEME } from '@/lib/constants'
import { WorldZone } from '@/lib/types'

interface ZoneMarkerProps {
  position: [number, number, number]
  zone: WorldZone
  label: string
  color?: string
  onClick?: () => void
}

export default function ZoneMarker({ position, zone, label, color, onClick }: ZoneMarkerProps) {
  const groupRef = useRef<Group>(null)
  const markerRef = useRef<Mesh>(null)

  const zoneColor = color || getZoneColor(zone)

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }

    if (markerRef.current) {
      // Slow rotation
      markerRef.current.rotation.y += 0.01
    }
  })

  return (
    <Interactive
      onHoverIn={() => console.log(`Hovering ${label}`)}
      onClick={() => {
        console.log(`Clicked ${label}`)
        onClick?.()
      }}
      hoverScale={1.2}
    >
      <group ref={groupRef} position={position}>
        {/* Main marker */}
        <mesh ref={markerRef} castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={zoneColor}
            emissive={zoneColor}
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh scale={1.05}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color={zoneColor}
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Glow effect */}
        <mesh scale={1.3}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial
            color={zoneColor}
            transparent
            opacity={0.1}
          />
        </mesh>

        {/* Zone label */}
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {label}
        </Text>

        {/* Connection beam to ground */}
        <mesh position={[0, -position[1] / 2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, Math.abs(position[1]), 8]} />
          <meshBasicMaterial
            color={zoneColor}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    </Interactive>
  )
}

function getZoneColor(zone: WorldZone): string {
  const colors: Record<WorldZone, string> = {
    'entry-portal': FANTASY_TECH_THEME.colors.primary,
    'central-nexus': FANTASY_TECH_THEME.colors.primary,
    'systems-tower': '#00ff88',
    'interface-sanctum': '#ff6b9d',
    'simulation-forge': '#9d4edd',
    'knowledge-core': '#ffd700',
    'resume-codex': '#06b6d4',
  }
  return colors[zone] || FANTASY_TECH_THEME.colors.primary
}
