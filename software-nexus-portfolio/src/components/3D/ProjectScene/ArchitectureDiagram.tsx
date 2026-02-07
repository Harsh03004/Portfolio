import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Vector3 } from 'three'
import { Text } from '@react-three/drei'
import { ProjectData } from '@/lib/types'
import Interactive from '../Interactive'

interface ArchitectureDiagramProps {
  project: ProjectData
  position?: [number, number, number]
}

interface DiagramNode {
  id: string
  label: string
  position: Vector3
  color: string
  connections: string[]
}

/**
 * Interactive architecture diagram display system
 * Shows system components and their connections
 */
export function ArchitectureDiagram({ project, position = [0, 0, 0] }: ArchitectureDiagramProps) {
  const groupRef = useRef<Group>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Generate diagram nodes based on project data
  const diagramNodes: DiagramNode[] = [
    {
      id: 'frontend',
      label: 'Frontend',
      position: new Vector3(-4, 2, 0),
      color: project.theme.primaryColor,
      connections: ['backend', 'cache']
    },
    {
      id: 'backend',
      label: 'Backend',
      position: new Vector3(0, 2, 0),
      color: project.theme.accentColor,
      connections: ['database', 'cache']
    },
    {
      id: 'database',
      label: 'Database',
      position: new Vector3(4, 2, 0),
      color: project.theme.primaryColor,
      connections: []
    },
    {
      id: 'cache',
      label: 'Cache',
      position: new Vector3(0, -1, 0),
      color: project.theme.accentColor,
      connections: []
    }
  ]

  // Gentle floating animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.05
    }
  })

  const renderConnections = () => {
    const connections: React.ReactElement[] = []

    diagramNodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const target = diagramNodes.find(n => n.id === targetId)
        if (target) {
          const start = node.position
          const end = target.position
          const midPoint = new Vector3().addVectors(start, end).multiplyScalar(0.5)
          const distance = start.distanceTo(end)

          connections.push(
            <mesh key={`${node.id}-${targetId}`} position={midPoint.toArray()}>
              <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
              <meshStandardMaterial
                color={hoveredNode === node.id || hoveredNode === targetId ? '#ffffff' : project.theme.primaryColor}
                emissive={project.theme.primaryColor}
                emissiveIntensity={hoveredNode === node.id || hoveredNode === targetId ? 0.8 : 0.3}
                transparent
                opacity={0.6}
              />
            </mesh>
          )
        }
      })
    })

    return connections
  }

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
        Architecture Overview
      </Text>

      {/* Connection lines */}
      {renderConnections()}

      {/* Diagram nodes */}
      {diagramNodes.map((node) => (
        <Interactive
          key={node.id}
          onHoverIn={() => setHoveredNode(node.id)}
          onHoverOut={() => setHoveredNode(null)}
          onClick={() => console.log(`Clicked node: ${node.label}`)}
        >
          <group position={node.position.toArray()}>
            {/* Node box */}
            <mesh castShadow>
              <boxGeometry args={[1.5, 0.8, 0.3]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={hoveredNode === node.id ? 0.8 : 0.3}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>

            {/* Glow effect when hovered */}
            {hoveredNode === node.id && (
              <mesh>
                <boxGeometry args={[1.8, 1.1, 0.4]} />
                <meshBasicMaterial
                  color={node.color}
                  transparent
                  opacity={0.2}
                />
              </mesh>
            )}

            {/* Label */}
            <Text
              position={[0, 0, 0.2]}
              fontSize={0.25}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {node.label}
            </Text>
          </group>
        </Interactive>
      ))}

      {/* Legend */}
      <group position={[-6, -3, 0]}>
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.3}
          color={project.theme.accentColor}
          anchorX="left"
          anchorY="middle"
        >
          Tech Stack:
        </Text>
        {project.techStack.technologies.slice(0, 5).map((tech, index) => (
          <Text
            key={tech}
            position={[0, -index * 0.4, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
          >
            • {tech}
          </Text>
        ))}
      </group>
    </group>
  )
}

