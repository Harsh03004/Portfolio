import { useMemo } from 'react'
import CentralNexus from './CentralNexus'
import ZoneMarker from './ZoneMarker'
import { SystemsTower, InterfaceSanctum, SimulationForge } from '../Zones'
import { DataFlowParticles, MagicalRune, GlowEffect } from '../Effects'
import { ProjectPortal } from '../Portal'
import { ProjectInterior } from '../ProjectScene'
import { WORLD_ZONES } from '@/lib/constants'
import { WorldZone } from '@/lib/types'
import { sampleProjects } from '@/data/sampleProjects'
import { usePortal } from '@/hooks/usePortal'
import { SkillShowcase } from '../Skills'

interface WorldProps {
  onZoneClick?: (zone: WorldZone) => void
  onProjectClick?: (projectId: string) => void
  onPortalEnter?: (projectId: string) => void
}

export default function World({ onZoneClick, onPortalEnter }: WorldProps) {
  const { activeProject, isInPortal } = usePortal()

  const zoneLabels: Record<WorldZone, string> = {
    'entry-portal': 'Entry Portal',
    'central-nexus': 'Central Nexus',
    'systems-tower': 'Systems Tower',
    'interface-sanctum': 'Interface Sanctum',
    'simulation-forge': 'Simulation Forge',
    'knowledge-core': 'Knowledge Core',
    'resume-codex': 'Resume Codex',
  }

  const handlePortalExit = () => {
    // This will be handled by the navigation system
    console.log('Exiting portal...')
  }

  return (
    <group>
      {/* Central Nexus - the main hub */}
      <CentralNexus />

      {/* Glow effect at central nexus */}
      <GlowEffect position={[0, 0, 0]} color="#00ffff" size={3} intensity={0.8} />

      {/* Zone-specific geometry */}
      <SystemsTower />
      <InterfaceSanctum />
      <SimulationForge />

      {/* Magical runes representing technologies */}
      <MagicalRune position={[-5, 2, 5]} symbol="⚛" label="React" color="#61dafb" size={0.8} />
      <MagicalRune position={[5, 2, 5]} symbol="⚡" label="Vite" color="#646cff" size={0.8} />
      <MagicalRune position={[-5, 2, -5]} symbol="TS" label="TypeScript" color="#3178c6" size={0.8} />
      <MagicalRune position={[5, 2, -5]} symbol="3D" label="Three.js" color="#000000" size={0.8} />

      {/* Project Portals */}
      {sampleProjects.map((project, index) => {
        const angle = (index / sampleProjects.length) * Math.PI * 2 + Math.PI / 4
        const radius = 18
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <ProjectPortal
            key={project.id}
            position={[x, 2, z]}
            project={project}
            onEnter={() => onPortalEnter?.(project.id)}
          />
        )
      })}

      {/* Data flow particles around the world */}
      <DataFlowParticles count={150} radius={25} color="#00ffff" size={0.08} speed={0.5} />
      <DataFlowParticles count={100} radius={15} color="#ff6b9d" size={0.06} speed={0.8} />
      <DataFlowParticles count={80} radius={35} color="#ffd700" size={0.05} speed={0.3} />

      {/* Zone markers for each area */}
      {Object.entries(WORLD_ZONES).map(([zone, data]) => {
        // Skip central nexus as it's already rendered
        if (zone === 'central-nexus') return null
        // Skip zones that have detailed geometry
        if (['systems-tower', 'interface-sanctum', 'simulation-forge'].includes(zone)) return null

        return (
          <ZoneMarker
            key={zone}
            position={[data.position.x, data.position.y, data.position.z]}
            zone={zone as WorldZone}
            label={zoneLabels[zone as WorldZone]}
            onClick={() => onZoneClick?.(zone as WorldZone)}
          />
        )
      })}

      {/* Ground grid for spatial reference */}
      <gridHelper args={[100, 50, '#00ffff', '#1a1a2e']} position={[0, -10, 0]} />

      {/* Ambient particles */}
      <AmbientParticles count={50} />

      {/* Project Interior Scenes */}
      {activeProject && (
        <ProjectInterior
          project={activeProject}
          visible={isInPortal}
          onClose={handlePortalExit}
        />
      )}

      {/* Skill nodes */}
      <SkillShowcase />
    </group>
  )
}

interface AmbientParticlesProps {
  count: number
}

function AmbientParticles({ count }: AmbientParticlesProps) {
  const particles = useMemo(() => Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2
    const radius = 20 + Math.random() * 30
    const height = (Math.random() - 0.5) * 40

    return {
      position: [
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ] as [number, number, number],
      scale: 0.05 + Math.random() * 0.1,
    }
  }), [count])

  return (
    <group>
      {particles.map((particle, i) => (
        <AmbientParticle
          key={i}
          position={particle.position}
          scale={particle.scale}
        />
      ))}
    </group>
  )
}

interface AmbientParticleProps {
  position: [number, number, number]
  scale: number
}

function AmbientParticle({ position, scale }: AmbientParticleProps) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}
