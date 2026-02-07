import { useRef } from 'react'
import { Group, Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { WORLD_ZONES } from '@/lib/constants'

export default function SystemsTower() {
  const groupRef = useRef<Group>(null)
  const position = WORLD_ZONES['systems-tower'].position

  useFrame((_state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Main tower structure - vertical layers */}
      {Array.from({ length: 5 }).map((_, i) => (
        <TowerLayer key={i} index={i} totalLayers={5} />
      ))}

      {/* Database crystals */}
      <DatabaseCrystal position={[-2, 2, 0]} />
      <DatabaseCrystal position={[2, 3, 0]} />
      <DatabaseCrystal position={[0, 4, 2]} />

      {/* API Gateway structures */}
      <APIGateway position={[0, 1, -2]} />
      <APIGateway position={[-1.5, 2.5, 1]} />

      {/* Data flow connections */}
      <DataFlowLines />
    </group>
  )
}

interface TowerLayerProps {
  index: number
  totalLayers: number
}

function TowerLayer({ index, totalLayers }: TowerLayerProps) {
  const meshRef = useRef<Mesh>(null)
  const yPos = index * 1.5
  const scale = 1 - (index / totalLayers) * 0.3

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing data flow
      const pulse = Math.sin(state.clock.elapsedTime * 2 + index) * 0.05 + 1
      meshRef.current.scale.y = pulse
    }
  })

  return (
    <mesh ref={meshRef} position={[0, yPos, 0]} scale={[scale, 1, scale]}>
      <cylinderGeometry args={[1, 1, 0.3, 6]} />
      <meshStandardMaterial
        color="#00ff88"
        emissive="#00ff88"
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

interface DatabaseCrystalProps {
  position: [number, number, number]
}

function DatabaseCrystal({ position }: DatabaseCrystalProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02
      // Pulsing glow
      const material = meshRef.current.material as any
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      }
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color="#00ffff"
        emissive="#00ffff"
        emissiveIntensity={0.4}
        transparent
        opacity={0.9}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  )
}

interface APIGatewayProps {
  position: [number, number, number]
}

function APIGateway({ position }: APIGatewayProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[0.4, 0.1, 16, 32]} />
      <meshStandardMaterial
        color="#ffd700"
        emissive="#ffd700"
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

function DataFlowLines() {
  return (
    <group>
      {/* Vertical data streams */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 1.5
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 3, Math.sin(angle) * radius]}
          >
            <cylinderGeometry args={[0.02, 0.02, 6, 8]} />
            <meshBasicMaterial
              color="#00ff88"
              transparent
              opacity={0.3}
            />
          </mesh>
        )
      })}
    </group>
  )
}
