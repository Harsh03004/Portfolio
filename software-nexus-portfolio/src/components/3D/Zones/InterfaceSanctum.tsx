import { useRef } from 'react'
import { Group, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { WORLD_ZONES } from '@/lib/constants'

export default function InterfaceSanctum() {
  const groupRef = useRef<Group>(null)
  const position = WORLD_ZONES['interface-sanctum'].position

  useFrame((_state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= 0.001
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Component library - modular blocks */}
      <ComponentBlocks />

      {/* Responsive design elements */}
      <ResponsiveFrames />

      {/* UI flow pathways */}
      <UIFlowPaths />

      {/* Performance dashboard */}
      <PerformanceDashboard position={[0, 2, 0]} />
    </group>
  )
}

function ComponentBlocks() {
  const blocks = [
    { pos: [-1, 0, -1], scale: 0.5, color: '#ff6b9d' },
    { pos: [1, 0, -1], scale: 0.6, color: '#ff6b9d' },
    { pos: [-1, 0, 1], scale: 0.4, color: '#ff6b9d' },
    { pos: [1, 0, 1], scale: 0.7, color: '#ff6b9d' },
    { pos: [0, 1, 0], scale: 0.8, color: '#ff6b9d' },
  ]

  return (
    <group>
      {blocks.map((block, i) => (
        <ComponentBlock
          key={i}
          position={block.pos as [number, number, number]}
          scale={block.scale}
          color={block.color}
          index={i}
        />
      ))}
    </group>
  )
}

interface ComponentBlockProps {
  position: [number, number, number]
  scale: number
  color: string
  index: number
}

function ComponentBlock({ position, scale, color, index }: ComponentBlockProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.2
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.7}
        roughness={0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

function ResponsiveFrames() {
  return (
    <group position={[0, 0, -2]}>
      {/* Desktop frame */}
      <mesh position={[0, 1, 0]} scale={[2, 1.2, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#ff6b9d"
          wireframe
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Tablet frame */}
      <mesh position={[-1.5, 0.5, 0.5]} scale={[1, 1.3, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#ff6b9d"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Mobile frame */}
      <mesh position={[1.5, 0.3, 0.5]} scale={[0.5, 0.9, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#ff6b9d"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}

function UIFlowPaths() {
  return (
    <group>
      {/* Connecting lines between components */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius]}
            rotation={[0, angle, 0]}
          >
            <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
            <meshBasicMaterial
              color="#ff6b9d"
              transparent
              opacity={0.3}
            />
          </mesh>
        )
      })}
    </group>
  )
}

interface PerformanceDashboardProps {
  position: [number, number, number]
}

function PerformanceDashboard({ position }: PerformanceDashboardProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <ringGeometry args={[0.8, 1, 32]} />
      <meshStandardMaterial
        color="#ffd700"
        emissive="#ffd700"
        emissiveIntensity={0.4}
        side={2}
      />
    </mesh>
  )
}
