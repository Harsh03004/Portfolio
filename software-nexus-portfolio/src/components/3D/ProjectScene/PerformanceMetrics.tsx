import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text, RoundedBox } from '@react-three/drei'
import { ProjectData } from '@/lib/types'

interface PerformanceMetricsProps {
  project: ProjectData
  position?: [number, number, number]
}

interface MetricDisplay {
  label: string
  value: string | number
  unit?: string
  color: string
  target?: number
  current?: number
}

/**
 * Performance metrics visualization with animated charts
 */
export function PerformanceMetrics({ project, position = [0, 0, 0] }: PerformanceMetricsProps) {
  const groupRef = useRef<Group>(null)
  const [animatedValues, setAnimatedValues] = useState({
    loadTime: 0,
    throughput: 0,
    errorRate: 0
  })

  // Animate metric values on mount
  useFrame(() => {
    setAnimatedValues(prev => ({
      loadTime: prev.loadTime + (project.performance.loadTime - prev.loadTime) * 0.05,
      throughput: prev.throughput + (project.performance.throughput - prev.throughput) * 0.05,
      errorRate: prev.errorRate + (project.performance.errorRate - prev.errorRate) * 0.05
    }))
  })

  const metrics: MetricDisplay[] = [
    {
      label: 'Load Time',
      value: animatedValues.loadTime.toFixed(2),
      unit: 's',
      color: project.theme.primaryColor,
      target: 2.0,
      current: animatedValues.loadTime
    },
    {
      label: 'Throughput',
      value: Math.floor(animatedValues.throughput).toLocaleString(),
      unit: 'req/s',
      color: project.theme.accentColor,
      target: project.performance.throughput,
      current: animatedValues.throughput
    },
    {
      label: 'Error Rate',
      value: (animatedValues.errorRate * 100).toFixed(2),
      unit: '%',
      color: animatedValues.errorRate < 0.01 ? '#00ff88' : '#ff6b6b',
      target: 1.0,
      current: animatedValues.errorRate * 100
    }
  ]

  return (
    <group ref={groupRef} position={position}>
      {/* Title */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color={project.theme.accentColor}
        anchorX="center"
        anchorY="middle"
      >
        Performance Metrics
      </Text>

      {/* Metric cards */}
      {metrics.map((metric, index) => {
        const xPos = (index - 1) * 3.5
        const barHeight = metric.current && metric.target
          ? Math.min((metric.current / metric.target) * 2, 2)
          : 1

        return (
          <group key={metric.label} position={[xPos, 0, 0]}>
            {/* Card background */}
            <RoundedBox
              args={[3, 3.5, 0.2]}
              radius={0.1}
              smoothness={4}
            >
              <meshStandardMaterial
                color={metric.color}
                opacity={0.2}
                transparent
                roughness={0.5}
                metalness={0.5}
              />
            </RoundedBox>

            {/* Metric label */}
            <Text
              position={[0, 1.3, 0.2]}
              fontSize={0.3}
              color={metric.color}
              anchorX="center"
              anchorY="middle"
            >
              {metric.label}
            </Text>

            {/* Metric value */}
            <Text
              position={[0, 0.5, 0.2]}
              fontSize={0.6}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              fontWeight={700}
            >
              {metric.value}
            </Text>

            {/* Metric unit */}
            {metric.unit && (
              <Text
                position={[0, -0.1, 0.2]}
                fontSize={0.25}
                color={metric.color}
                anchorX="center"
                anchorY="middle"
              >
                {metric.unit}
              </Text>
            )}

            {/* Animated bar chart */}
            {metric.target && (
              <group position={[0, -1, 0.15]}>
                {/* Bar background */}
                <mesh position={[0, 0, 0]}>
                  <boxGeometry args={[2, 2, 0.1]} />
                  <meshStandardMaterial
                    color="#1a1a2e"
                    transparent
                    opacity={0.5}
                  />
                </mesh>

                {/* Animated bar */}
                <mesh position={[0, -1 + barHeight / 2, 0.05]}>
                  <boxGeometry args={[1.8, barHeight, 0.1]} />
                  <meshStandardMaterial
                    color={metric.color}
                    emissive={metric.color}
                    emissiveIntensity={0.5}
                  />
                </mesh>
              </group>
            )}
          </group>
        )
      })}

      {/* Performance summary */}
      <group position={[0, -3.5, 0]}>
        <RoundedBox
          args={[10, 1.5, 0.2]}
          radius={0.1}
          smoothness={4}
        >
          <meshStandardMaterial
            color={project.theme.primaryColor}
            opacity={0.15}
            transparent
          />
        </RoundedBox>

        <Text
          position={[0, 0, 0.2]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={9}
          textAlign="center"
        >
          {project.engineeringStory.resultsAndImpact}
        </Text>
      </group>
    </group>
  )
}

