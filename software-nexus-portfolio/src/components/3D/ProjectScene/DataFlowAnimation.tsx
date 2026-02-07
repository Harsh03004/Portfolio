import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, Vector3, Color } from 'three'
import { Text } from '@react-three/drei'
import { ProjectData } from '@/lib/types'

interface DataFlowAnimationProps {
  project: ProjectData
  position?: [number, number, number]
}

interface FlowPath {
  points: Vector3[]
  color: string
  speed: number
}

/**
 * Animated visualization of data flow through the system
 */
export function DataFlowAnimation({ project, position = [0, 0, 0] }: DataFlowAnimationProps) {
  const pointsRef = useRef<Points>(null)
  const particleCount = 100

  // Define flow paths
  const flowPaths: FlowPath[] = useMemo(() => [
    {
      // Frontend to Backend flow
      points: [
        new Vector3(-6, 0, 0),
        new Vector3(-3, 1, 0),
        new Vector3(0, 0, 0),
        new Vector3(3, -1, 0),
        new Vector3(6, 0, 0)
      ],
      color: project.theme.primaryColor,
      speed: 0.02
    },
    {
      // Circular data flow
      points: Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const radius = 3
        return new Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * 0.5,
          0
        )
      }),
      color: project.theme.accentColor,
      speed: 0.015
    },
    {
      // Vertical processing flow
      points: [
        new Vector3(0, -3, 0),
        new Vector3(0, -1.5, 1),
        new Vector3(0, 0, 0),
        new Vector3(0, 1.5, -1),
        new Vector3(0, 3, 0)
      ],
      color: project.theme.particleColor,
      speed: 0.025
    }
  ], [project.theme])

  // Create particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const color = new Color()

    for (let i = 0; i < particleCount; i++) {
      const pathIndex = i % flowPaths.length
      const path = flowPaths[pathIndex]
      const pointIndex = Math.floor((i / flowPaths.length) % path.points.length)
      const point = path.points[pointIndex]

      positions[i * 3] = point.x
      positions[i * 3 + 1] = point.y
      positions[i * 3 + 2] = point.z

      color.set(path.color)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    return { positions, colors }
  }, [flowPaths, particleCount])

  // Animate particles along paths
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
      const time = clock.elapsedTime

      for (let i = 0; i < particleCount; i++) {
        const pathIndex = i % flowPaths.length
        const path = flowPaths[pathIndex]
        const progress = (time * path.speed + i / particleCount) % 1
        const pointIndex = Math.floor(progress * (path.points.length - 1))
        const nextIndex = (pointIndex + 1) % path.points.length
        const localProgress = (progress * (path.points.length - 1)) % 1

        const current = path.points[pointIndex]
        const next = path.points[nextIndex]

        positions[i * 3] = current.x + (next.x - current.x) * localProgress
        positions[i * 3 + 1] = current.y + (next.y - current.y) * localProgress
        positions[i * 3 + 2] = current.z + (next.z - current.z) * localProgress
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color={project.theme.accentColor}
        anchorX="center"
        anchorY="middle"
      >
        Data Flow Visualization
      </Text>

      {/* Animated particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions.positions}
            itemSize={3}
            args={[particlePositions.positions, 3] as any}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#ffffff"
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={2} // AdditiveBlending
        />
      </points>

      {/* Flow path indicators */}
      {flowPaths.map((path, index) => (
        <group key={index}>
          {path.points.map((point, i) => {
            if (i === path.points.length - 1) return null
            const next = path.points[i + 1]
            const midPoint = new Vector3().addVectors(point, next).multiplyScalar(0.5)

            return (
              <mesh key={i} position={midPoint.toArray()}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial
                  color={path.color}
                  transparent
                  opacity={0.3}
                />
              </mesh>
            )
          })}
        </group>
      ))}

      {/* Performance info */}
      <group position={[6, 2, 0]}>
        <Text
          fontSize={0.25}
          color={project.theme.accentColor}
          anchorX="left"
          anchorY="middle"
        >
          Throughput:
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          {project.performance.throughput.toLocaleString()} req/s
        </Text>
      </group>

      <group position={[6, 0, 0]}>
        <Text
          fontSize={0.25}
          color={project.theme.accentColor}
          anchorX="left"
          anchorY="middle"
        >
          Load Time:
        </Text>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          {project.performance.loadTime}s
        </Text>
      </group>
    </group>
  )
}

