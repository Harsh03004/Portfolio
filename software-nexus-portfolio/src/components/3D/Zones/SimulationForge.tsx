import { useRef } from 'react'
import { Group, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { WORLD_ZONES } from '@/lib/constants'

export default function SimulationForge() {
  const groupRef = useRef<Group>(null)
  const position = WORLD_ZONES['simulation-forge'].position

  return (
    <group ref={groupRef} position={position}>
      {/* Algorithm visualization nodes */}
      <AlgorithmNodes />

      {/* Data structure representations */}
      <DataStructures />

      {/* Complexity analysis display */}
      <ComplexityVisualization position={[0, 3, 0]} />

      {/* Processing particles */}
      <ProcessingParticles />
    </group>
  )
}

function AlgorithmNodes() {
  const nodes = [
    { pos: [0, 0, 0], size: 0.6 },
    { pos: [-2, 1, 0], size: 0.5 },
    { pos: [2, 1, 0], size: 0.5 },
    { pos: [-1, 2, 1], size: 0.4 },
    { pos: [1, 2, 1], size: 0.4 },
    { pos: [0, 3, 0], size: 0.5 },
  ]

  return (
    <group>
      {nodes.map((node, i) => (
        <AlgorithmNode
          key={i}
          position={node.pos as [number, number, number]}
          size={node.size}
          index={i}
        />
      ))}

      {/* Connections between nodes */}
      {nodes.slice(0, -1).map((node, i) => {
        const nextNode = nodes[i + 1]
        return (
          <ConnectionLine
            key={i}
            start={node.pos as [number, number, number]}
            end={nextNode.pos as [number, number, number]}
          />
        )
      })}
    </group>
  )
}

interface AlgorithmNodeProps {
  position: [number, number, number]
  size: number
  index: number
}

function AlgorithmNode({ position, size, index }: AlgorithmNodeProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing based on "processing"
      const pulse = Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.1 + 1
      meshRef.current.scale.setScalar(pulse)
      meshRef.current.rotation.y += 0.02
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={size}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#9d4edd"
        emissive="#9d4edd"
        emissiveIntensity={0.4}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

interface ConnectionLineProps {
  start: [number, number, number]
  end: [number, number, number]
}

function ConnectionLine({ start, end }: ConnectionLineProps) {
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ]

  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const dz = end[2] - start[2]
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)

  return (
    <mesh position={midpoint}>
      <cylinderGeometry args={[0.03, 0.03, length, 8]} />
      <meshBasicMaterial
        color="#9d4edd"
        transparent
        opacity={0.4}
      />
    </mesh>
  )
}

function DataStructures() {
  return (
    <group position={[3, 0, 0]}>
      {/* Stack representation */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.4, 0]}>
          <boxGeometry args={[0.8, 0.3, 0.8]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

interface ComplexityVisualizationProps {
  position: [number, number, number]
}

function ComplexityVisualization({ position }: ComplexityVisualizationProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <torusKnotGeometry args={[0.8, 0.2, 100, 16]} />
      <meshStandardMaterial
        color="#ffd700"
        emissive="#ffd700"
        emissiveIntensity={0.3}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  )
}

function ProcessingParticles() {
  return (
    <group>
      {Array.from({ length: 20 }).map((_, i) => (
        <ProcessingParticle key={i} index={i} />
      ))}
    </group>
  )
}

interface ProcessingParticleProps {
  index: number
}

function ProcessingParticle({ index }: ProcessingParticleProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      const offset = (index / 20) * Math.PI * 2
      const radius = 3
      
      meshRef.current.position.x = Math.cos(time + offset) * radius
      meshRef.current.position.z = Math.sin(time + offset) * radius
      meshRef.current.position.y = Math.sin(time * 2 + offset) * 2 + 1
    }
  })

  return (
    <mesh ref={meshRef} scale={0.08}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#9d4edd"
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}
