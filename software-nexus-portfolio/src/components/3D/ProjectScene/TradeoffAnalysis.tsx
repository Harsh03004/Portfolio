import { useRef } from 'react'
import { Group } from 'three'
import { Text, RoundedBox } from '@react-three/drei'
import { ProjectData } from '@/lib/types'

interface TradeoffAnalysisProps {
  project: ProjectData
  position?: [number, number, number]
  visible?: boolean
}

/**
 * Tradeoff Analysis Visualization
 * Shows pros and cons of major technical decisions
 */
export function TradeoffAnalysis({
  project,
  position = [0, -3, -50],
  visible = true
}: TradeoffAnalysisProps) {
  const groupRef = useRef<Group>(null)

  if (!visible) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Title */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.55}
        color={project.theme.accentColor}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        Technical Tradeoffs
      </Text>

      {/* Tradeoff Cards */}
      {project.tradeoffs.map((tradeoff, index) => {
        const yPos = 3.5 - index * 3.2
        const leftX = -5.5
        const rightX = 5.5

        return (
          <group key={index} position={[0, yPos, 0]}>
            {/* Tradeoff Title */}
            <Text
              position={[0, 1.5, 0]}
              fontSize={0.32}
              color={project.theme.primaryColor}
              anchorX="center"
              anchorY="middle"
              fontWeight={700}
              maxWidth={8}
            >
              {tradeoff.tradeoff}
            </Text>

            {/* Pros Card (Left) */}
            <group position={[leftX, 0, 0]}>
              <RoundedBox args={[4.5, 2.5, 0.2]} radius={0.1} smoothness={4}>
                <meshStandardMaterial
                  color="#00ff88"
                  opacity={0.15}
                  transparent
                />
              </RoundedBox>

              <Text
                position={[0, 0.9, 0.15]}
                fontSize={0.28}
                color="#00ff88"
                anchorX="center"
                anchorY="top"
                fontWeight={700}
              >
                Pros
              </Text>

              {tradeoff.pros.map((pro, proIndex) => (
                <Text
                  key={proIndex}
                  position={[-1.9, 0.4 - proIndex * 0.45, 0.15]}
                  fontSize={0.2}
                  color="#ffffff"
                  anchorX="left"
                  anchorY="top"
                  maxWidth={3.8}
                >
                  ✓ {pro}
                </Text>
              ))}
            </group>

            {/* Cons Card (Right) */}
            <group position={[rightX, 0, 0]}>
              <RoundedBox args={[4.5, 2.5, 0.2]} radius={0.1} smoothness={4}>
                <meshStandardMaterial
                  color="#ff6b6b"
                  opacity={0.15}
                  transparent
                />
              </RoundedBox>

              <Text
                position={[0, 0.9, 0.15]}
                fontSize={0.28}
                color="#ff6b6b"
                anchorX="center"
                anchorY="top"
                fontWeight={700}
              >
                Cons
              </Text>

              {tradeoff.cons.map((con, conIndex) => (
                <Text
                  key={conIndex}
                  position={[-1.9, 0.4 - conIndex * 0.45, 0.15]}
                  fontSize={0.2}
                  color="#ffffff"
                  anchorX="left"
                  anchorY="top"
                  maxWidth={3.8}
                >
                  ✗ {con}
                </Text>
              ))}
            </group>
          </group>
        )
      })}
    </group>
  )
}

