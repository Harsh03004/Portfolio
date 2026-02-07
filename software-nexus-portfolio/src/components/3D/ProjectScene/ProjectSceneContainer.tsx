import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group, Color } from 'three'
import { ProjectData } from '@/lib/types'

interface ProjectSceneContainerProps {
  project: ProjectData
  visible: boolean
}

/**
 * Container for project interior scenes with dedicated lighting and environment
 */
export function ProjectSceneContainer({ project, visible }: ProjectSceneContainerProps) {
  const groupRef = useRef<Group>(null)
  const { scene } = useThree()

  // Set scene background based on project theme
  useEffect(() => {
    if (visible) {
      scene.background = new Color(project.theme.primaryColor).multiplyScalar(0.1)
    }
  }, [visible, project.theme.primaryColor, scene.background])

  // Fade in/out animation
  useFrame(() => {
    if (groupRef.current) {
      const targetOpacity = visible ? 1 : 0
      groupRef.current.children.forEach((child) => {
        const obj = child as any
        if (obj.material && typeof obj.material.opacity === 'number') {
          obj.material.opacity += (targetOpacity - obj.material.opacity) * 0.1
        }
      })
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={[0, 0, -50]}>
      {/* Ambient lighting for project scene */}
      <ambientLight intensity={0.4} color={project.theme.ambientLight} />

      {/* Key light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color={project.theme.primaryColor}
        castShadow
      />

      {/* Fill light */}
      <pointLight
        position={[-10, 5, 5]}
        intensity={0.5}
        color={project.theme.accentColor}
      />

      {/* Rim light */}
      <spotLight
        position={[0, 10, -10]}
        intensity={0.6}
        color={project.theme.accentColor}
        angle={Math.PI / 6}
        penumbra={0.5}
      />

      {/* Background sphere for contained environment */}
      <mesh position={[0, 0, -20]}>
        <sphereGeometry args={[30, 32, 32]} />
        <meshStandardMaterial
          color={project.theme.primaryColor}
          opacity={0.1}
          transparent
          side={2}
        />
      </mesh>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color={project.theme.primaryColor}
          opacity={0.2}
          transparent
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Project title display */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color={project.theme.accentColor} />
      </mesh>
    </group>
  )
}

