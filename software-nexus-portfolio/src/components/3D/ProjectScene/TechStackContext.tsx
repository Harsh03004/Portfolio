import { useRef } from 'react'
import { Group } from 'three'
import { Text, RoundedBox } from '@react-three/drei'
import { ProjectData } from '@/lib/types'

interface TechStackContextProps {
  project: ProjectData
  position?: [number, number, number]
  visible?: boolean
}

/**
 * Tech Stack Context Panel
 * Explains why specific technologies were chosen
 */
export function TechStackContext({
  project,
  position = [0, -6.5, -50],
  visible = true
}: TechStackContextProps) {
  const groupRef = useRef<Group>(null)
  const { techStack } = project

  if (!visible) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Title */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color={project.theme.accentColor}
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        Technology Stack
      </Text>

      {/* Main Context Box */}
      <group position={[0, 1.5, 0]}>
        <RoundedBox args={[10, 2.5, 0.2]} radius={0.12} smoothness={4}>
          <meshStandardMaterial
            color={project.theme.primaryColor}
            opacity={0.18}
            transparent
          />
        </RoundedBox>

        {/* Reasoning */}
        <Text
          position={[-4.5, 0.8, 0.15]}
          fontSize={0.24}
          color={project.theme.accentColor}
          anchorX="left"
          anchorY="top"
          fontWeight={700}
        >
          Why These Tools?
        </Text>

        <Text
          position={[-4.5, 0.4, 0.15]}
          fontSize={0.22}
          color="#ffffff"
          anchorX="left"
          anchorY="top"
          maxWidth={8.5}
        >
          {techStack.reasoning}
        </Text>
      </group>

      {/* Technology Badges */}
      <group position={[0, -0.8, 0]}>
        {techStack.technologies.map((tech, index) => {
          const itemsPerRow = 3
          const row = Math.floor(index / itemsPerRow)
          const col = index % itemsPerRow
          const xPos = (col - 1) * 3.5
          const yPos = -row * 1.2

          return (
            <group key={tech} position={[xPos, yPos, 0]}>
              {/* Badge Background */}
              <RoundedBox args={[2.8, 0.8, 0.15]} radius={0.08} smoothness={3}>
                <meshStandardMaterial
                  color={project.theme.accentColor}
                  opacity={0.25}
                  transparent
                  emissive={project.theme.accentColor}
                  emissiveIntensity={0.2}
                />
              </RoundedBox>

              {/* Technology Name */}
              <Text
                position={[0, 0, 0.1]}
                fontSize={0.24}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                fontWeight={600}
              >
                {tech}
              </Text>
            </group>
          )
        })}
      </group>
    </group>
  )
}

