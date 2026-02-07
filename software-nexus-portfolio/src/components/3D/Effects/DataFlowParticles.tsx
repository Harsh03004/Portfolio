import { useRef, useMemo } from 'react'
import { Points } from 'three'
import { useFrame } from '@react-three/fiber'

interface DataFlowParticlesProps {
  count?: number
  radius?: number
  color?: string
  size?: number
  speed?: number
}

export default function DataFlowParticles({
  count = 100,
  radius = 10,
  color = '#00ffff',
  size = 0.1,
  speed = 1.0
}: DataFlowParticlesProps) {
  const pointsRef = useRef<Points>(null)

  // Generate particle positions and velocities
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Random position in sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = Math.random() * radius
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = r * Math.cos(phi)
      
      // Random velocity
      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
    }
    
    return { positions, velocities }
  }, [count, radius])

  useFrame((_state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        
        // Update positions
        positions[i3] += particles.velocities[i3] * speed
        positions[i3 + 1] += particles.velocities[i3 + 1] * speed
        positions[i3 + 2] += particles.velocities[i3 + 2] * speed
        
        // Wrap around if out of bounds
        const distance = Math.sqrt(
          positions[i3] ** 2 + 
          positions[i3 + 1] ** 2 + 
          positions[i3 + 2] ** 2
        )
        
        if (distance > radius) {
          // Reset to center with random offset
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(Math.random() * 2 - 1)
          const r = Math.random() * 2
          
          positions[i3] = r * Math.sin(phi) * Math.cos(theta)
          positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
          positions[i3 + 2] = r * Math.cos(phi)
        }
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
