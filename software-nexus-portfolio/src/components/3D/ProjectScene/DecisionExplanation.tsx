import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text, RoundedBox } from '@react-three/drei'
import { ProjectData } from '@/lib/types'
import Interactive from '../Interactive'

interface DecisionExplanationProps {
  project: ProjectData
  position?: [number, number, number]
  visible?: boolean
}

/**
 * Interactive decision explanation interface
 * Shows design decisions and their alternatives
 */
export function DecisionExplanation({
  project,
  position = [0, 0, -50],
  visible = true
}: DecisionExplanationProps) {
  const groupRef = useRef<Group>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.03
    }
  })

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
        Design Decisions
      </Text>

      {/* Decision Cards */}
      {project.designDecisions.map((decision, index) => {
        const yPos = 3.5 - index * 2.8
        const isExpanded = expandedIndex === index
        const cardHeight = isExpanded ? 4 : 2

        return (
          <group key={index} position={[0, yPos, 0]}>
            <Interactive
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              hoverScale={1.05}
              hoverColor={project.theme.accentColor}
            >
              <group>
                {/* Card Background */}
                <RoundedBox
                  args={[8, cardHeight, 0.2]}
                  radius={0.15}
                  smoothness={4}
                >
                  <meshStandardMaterial
                    color={project.theme.primaryColor}
                    opacity={0.2 + (isExpanded ? 0.15 : 0)}
                    transparent
                    roughness={0.4}
                    metalness={0.3}
                    emissive={project.theme.primaryColor}
                    emissiveIntensity={isExpanded ? 0.3 : 0.1}
                  />
                </RoundedBox>

                {/* Decision Title */}
                <Text
                  position={[-3.5, 0.5, 0.15]}
                  fontSize={0.3}
                  color={project.theme.accentColor}
                  anchorX="left"
                  anchorY="middle"
                  fontWeight={700}
                  maxWidth={6}
                >
                  {decision.decision}
                </Text>

                {/* Expanded Content */}
                {isExpanded && (
                  <group>
                    {/* Alternatives */}
                    <Text
                      position={[-3.5, 0, 0.15]}
                      fontSize={0.22}
                      color="#cccccc"
                      anchorX="left"
                      anchorY="top"
                    >
                      Alternatives:
                    </Text>
                    {decision.alternatives.map((alt, altIndex) => (
                      <Text
                        key={altIndex}
                        position={[-3, -0.35 - altIndex * 0.35, 0.15]}
                        fontSize={0.2}
                        color="#aaaaaa"
                        anchorX="left"
                        anchorY="top"
                      >
                        • {alt}
                      </Text>
                    ))}

                    {/* Reasoning */}
                    <Text
                      position={[0, 0, 0.15]}
                      fontSize={0.22}
                      color="#cccccc"
                      anchorX="left"
                      anchorY="top"
                    >
                      Why:
                    </Text>
                    <Text
                      position={[0, -0.35, 0.15]}
                      fontSize={0.2}
                      color="#ffffff"
                      anchorX="left"
                      anchorY="top"
                      maxWidth={6}
                    >
                      {decision.reasoning}
                    </Text>
                  </group>
                )}

                {/* Expand Indicator */}
                <Text
                  position={[3.5, 0.5, 0.15]}
                  fontSize={0.4}
                  color={project.theme.accentColor}
                  anchorX="center"
                  anchorY="middle"
                >
                  {isExpanded ? '▼' : '▶'}
                </Text>
              </group>
            </Interactive>
          </group>
        )
      })}
    </group>
  )
}

