import { useRef } from 'react'
import { Group } from 'three'
import { ProjectData } from '@/lib/types'
import { ProjectSceneContainer } from './ProjectSceneContainer'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { DataFlowAnimation } from './DataFlowAnimation'
import { PerformanceMetrics } from './PerformanceMetrics'
import { EngineeringNarrative } from './EngineeringNarrative'
import { DecisionExplanation } from './DecisionExplanation'
import { TradeoffAnalysis } from './TradeoffAnalysis'
import { TechStackContext } from './TechStackContext'

interface ProjectInteriorProps {
  project: ProjectData
  visible: boolean
  onClose?: () => void
}

/**
 * Complete project interior scene with all visualizations
 * Displays architecture, data flow, performance metrics, and engineering narrative
 */
export function ProjectInterior({ project, visible }: ProjectInteriorProps) {
  const groupRef = useRef<Group>(null)

  if (!visible) return null

  return (
    <group ref={groupRef}>
      {/* Project scene container with lighting */}
      <ProjectSceneContainer project={project} visible={visible} />

      {/* Section 1: Architecture and Performance (Left-Center-Right Layout) */}
      {/* Architecture diagram section (left) */}
      <ArchitectureDiagram
        project={project}
        position={[-12, 2, -48]}
      />

      {/* Data flow animation section (center) */}
      <DataFlowAnimation
        project={project}
        position={[0, 2, -48]}
      />

      {/* Performance metrics section (right) */}
      <PerformanceMetrics
        project={project}
        position={[12, 2, -48]}
      />

      {/* Section 2: Engineering Story (Top of scroll) */}
      <EngineeringNarrative
        project={project}
        position={[0, 3, -50]}
        visible={true}
      />

      {/* Section 3: Design Decisions (Middle of scroll) */}
      <DecisionExplanation
        project={project}
        position={[0, 0, -50]}
        visible={true}
      />

      {/* Section 4: Technical Tradeoffs (Lower middle) */}
      <TradeoffAnalysis
        project={project}
        position={[0, -3, -50]}
        visible={true}
      />

      {/* Section 5: Tech Stack Context (Bottom) */}
      <TechStackContext
        project={project}
        position={[0, -6.5, -50]}
        visible={true}
      />

      {/* Exit portal hint */}
      <group position={[0, -9.5, -45]}>
        <mesh>
          <torusGeometry args={[0.8, 0.1, 16, 32]} />
          <meshStandardMaterial
            color={project.theme.accentColor}
            emissive={project.theme.accentColor}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </group>
  )
}

