import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text, RoundedBox } from '@react-three/drei'
import { ProjectData } from '@/lib/types'

interface EngineeringNarrativeProps {
  project: ProjectData
  position?: [number, number, number]
  visible?: boolean
}

/**
 * Engineering Narrative Display System
 * Shows the problem statement, solution approach, and key achievements
 */
export function EngineeringNarrative({
  project,
  position = [0, 3, -50],
  visible = true
}: EngineeringNarrativeProps) {
  const groupRef = useRef<Group>(null)
  const { engineeringStory } = project

  // Gentle pulsing animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.02
      groupRef.current.scale.set(scale, scale, scale)
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Title */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.6}
        color={project.theme.accentColor}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        Engineering Story
      </Text>

      {/* Problem Statement Section */}
      <group position={[-5, 3, 0]}>
        <RoundedBox args={[4.5, 3, 0.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={project.theme.primaryColor}
            opacity={0.15}
            transparent
          />
        </RoundedBox>

        <Text
          position={[0, 1.2, 0.15]}
          fontSize={0.35}
          color={project.theme.accentColor}
          anchorX="center"
          anchorY="top"
          fontWeight={700}
        >
          Problem
        </Text>

        <Text
          position={[0, 0.7, 0.15]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          maxWidth={4}
          textAlign="center"
        >
          {engineeringStory.problemStatement}
        </Text>
      </group>

      {/* Solution Approach Section */}
      <group position={[5, 3, 0]}>
        <RoundedBox args={[4.5, 3, 0.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={project.theme.accentColor}
            opacity={0.15}
            transparent
          />
        </RoundedBox>

        <Text
          position={[0, 1.2, 0.15]}
          fontSize={0.35}
          color={project.theme.primaryColor}
          anchorX="center"
          anchorY="top"
          fontWeight={700}
        >
          Solution
        </Text>

        <Text
          position={[0, 0.7, 0.15]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          maxWidth={4}
          textAlign="center"
        >
          {engineeringStory.solutionApproach}
        </Text>
      </group>

      {/* Results & Impact Section */}
      <group position={[0, -1.5, 0]}>
        <RoundedBox args={[10, 2.5, 0.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={project.theme.primaryColor}
            opacity={0.2}
            transparent
          />
        </RoundedBox>

        <Text
          position={[0, 0.8, 0.15]}
          fontSize={0.35}
          color={project.theme.accentColor}
          anchorX="center"
          anchorY="top"
          fontWeight={700}
        >
          Results & Impact
        </Text>

        <Text
          position={[0, 0.3, 0.15]}
          fontSize={0.24}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          maxWidth={9}
          textAlign="center"
        >
          {engineeringStory.resultsAndImpact}
        </Text>
      </group>

      {/* Lessons Learned Section */}
      <group position={[0, -4.5, 0]}>
        <RoundedBox args={[10, 2, 0.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial
            color={project.theme.accentColor}
            opacity={0.1}
            transparent
          />
        </RoundedBox>

        <Text
          position={[0, 0.6, 0.15]}
          fontSize={0.3}
          color={project.theme.primaryColor}
          anchorX="center"
          anchorY="top"
          fontWeight={700}
        >
          Key Lessons
        </Text>

        <Text
          position={[0, 0.15, 0.15]}
          fontSize={0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="top"
          maxWidth={9}
          textAlign="center"
        >
          {engineeringStory.lessonsLearned}
        </Text>
      </group>
    </group>
  )
}

