import { useRef, useState, useEffect } from 'react'
import { Group, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { Vector3 } from 'three'
import Interactive from '../Interactive'
import { HoverGlow, BreathingAnimation } from '../Effects'
import { ProjectData } from '@/lib/types'
import { PortalConfig } from '@/lib/managers/PortalManager'
import { usePortal } from '@/hooks/usePortal'

interface ProjectPortalProps {
  position: [number, number, number]
  project: ProjectData
  onEnter?: () => void
}

/**
 * Project Portal Component
 * Visual representation of a project portal with entrance detection
 */
export default function ProjectPortal({ position, project, onEnter }: ProjectPortalProps) {
  const groupRef = useRef<Group>(null)
  const portalRef = useRef<Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { registerPortal, unregisterPortal } = usePortal()

  // Register portal on mount
  useEffect(() => {
    const config: PortalConfig = {
      id: project.id,
      position: new Vector3(...position),
      project,
      entryPoint: new Vector3(position[0], position[1] + 5, position[2] + 10),
      exitPoint: new Vector3(position[0], position[1], position[2] + 15),
      transitionDuration: 2
    }

    registerPortal(config)

    return () => {
      unregisterPortal(project.id)
    }
  }, [project, position, registerPortal, unregisterPortal])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }

    if (portalRef.current) {
      // Slow rotation
      portalRef.current.rotation.y += 0.005
    }
  })

  return (
    <BreathingAnimation speed={0.6} intensity={0.1}>
      <Interactive
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        onClick={() => onEnter?.()}
        hoverScale={1.15}
        hoverColor={project.theme.primaryColor}
      >
        <group ref={groupRef} position={position}>
          {/* Portal frame */}
          <mesh ref={portalRef}>
            <torusGeometry args={[2, 0.3, 16, 32]} />
            <meshStandardMaterial
              color={project.theme.primaryColor}
              emissive={project.theme.primaryColor}
              emissiveIntensity={0.5}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Portal surface */}
          <mesh>
            <circleGeometry args={[2, 32]} />
            <meshStandardMaterial
              color={project.theme.accentColor}
              emissive={project.theme.accentColor}
              emissiveIntensity={0.3}
              transparent
              opacity={0.6}
              side={2}
            />
          </mesh>

          {/* Inner glow */}
          <mesh scale={1.8}>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial
              color={project.theme.primaryColor}
              transparent
              opacity={0.2}
              side={2}
            />
          </mesh>

          {/* Project title */}
          <Text
            position={[0, -3, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {project.title}
          </Text>

          {/* Domain label */}
          <Text
            position={[0, -3.6, 0]}
            fontSize={0.2}
            color={project.theme.accentColor}
            anchorX="center"
            anchorY="middle"
          >
            {project.domain.toUpperCase()}
          </Text>

          {/* Hover glow */}
          <HoverGlow
            isHovered={isHovered}
            color={project.theme.primaryColor}
            intensity={0.6}
            scale={2.5}
          />

          {/* Orbiting particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <OrbitingParticle
              key={i}
              index={i}
              total={8}
              radius={2.5}
              color={project.theme.particleColor}
            />
          ))}
        </group>
      </Interactive>
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

      meshRef.current.position.x = Math.cos(time * 0.5 + offset) * radius
      meshRef.current.position.y = Math.sin(time * 0.5 + offset) * radius * 0.3
      meshRef.current.position.z = Math.sin(time * 0.5 + offset) * 0.5

      // Pulsing
      const material = meshRef.current.material as any
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.5 + Math.sin(time * 2 + offset) * 0.3
      }
    }
  })

  return (
    <mesh ref={meshRef} scale={0.1}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  )
}
