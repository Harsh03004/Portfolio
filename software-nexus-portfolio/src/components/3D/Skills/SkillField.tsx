import { useMemo, useState } from 'react'
import { Vector3 } from 'three'
import { Text } from '@react-three/drei'
import { SkillNode as SkillNodeType, SkillCategory } from '@/lib/types'
import { WORLD_ZONES } from '@/lib/constants'
import { SkillNode } from './SkillNode'
import { SkillDependencyLines } from './SkillDependencyLines'
import { SkillDeepDivePanel } from './SkillDeepDivePanel'

interface SkillFieldProps {
  skills: SkillNodeType[]
}

interface HoveredSkill {
  skill: SkillNodeType
  position: Vector3
}

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  backend: '#00ff88',
  frontend: '#ff6b9d',
  algorithms: '#9d4edd',
  tools: '#ffd700',
  cloud: '#00ffff',
  database: '#7fffd4'
}

const CATEGORY_TO_ZONE: Record<SkillCategory, keyof typeof WORLD_ZONES> = {
  backend: 'systems-tower',
  frontend: 'interface-sanctum',
  algorithms: 'simulation-forge',
  tools: 'central-nexus',
  cloud: 'systems-tower',
  database: 'systems-tower'
}

/**
 * Places skill nodes around their themed zones.
 */
export function SkillField({ skills }: SkillFieldProps) {
  const [hovered, setHovered] = useState<HoveredSkill | null>(null)
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  if (skills.length === 0) return null

  const positioned = useMemo(() => {
    // Deterministic placement per category for stable layout
    const counts: Record<SkillCategory, number> = {
      backend: 0,
      frontend: 0,
      algorithms: 0,
      tools: 0,
      cloud: 0,
      database: 0
    }

    return skills.map((skill) => {
      const zoneKey = CATEGORY_TO_ZONE[skill.category]
      const zone = WORLD_ZONES[zoneKey]
      const localIndex = counts[skill.category]++
      const angle = (localIndex / Math.max(1, counts[skill.category])) * Math.PI * 2
      const radius = zone.radius + 2.5 + (localIndex % 2) * 0.8
      const heightOffset = (localIndex % 3) * 1.2 - 1.2

      const position = new Vector3(
        zone.position.x + Math.cos(angle) * radius,
        zone.position.y + heightOffset,
        zone.position.z + Math.sin(angle) * radius
      )

      return { skill, position }
    })
  }, [skills])

  const focusSkill = activeSkill ?? hovered?.skill.technology ?? null
  const focusedData = focusSkill ? skills.find((skill) => skill.technology === focusSkill) ?? null : null

  return (
    <group>
      <SkillDependencyLines nodes={positioned} activeSkill={focusSkill} colorMap={CATEGORY_COLORS} />

      {positioned.map(({ skill, position }) => (
        <SkillNode
          key={skill.technology}
          node={skill}
          position={[position.x, position.y, position.z]}
          color={CATEGORY_COLORS[skill.category]}
          onClick={(node) => setActiveSkill((current) => (current === node.technology ? null : node.technology))}
          onHover={(node) => setHovered(node ? { skill: node, position } : null)}
        />
      ))}

      {hovered && (
        <group position={[hovered.position.x, hovered.position.y + 1.2, hovered.position.z]}>
          {/* Tooltip is anchored above the hovered node */}
          <Text fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">
            {hovered.skill.technology} • {(hovered.skill.proficiencyLevel * 100).toFixed(0)}%
          </Text>
          <Text fontSize={0.2} color="#cfefff" anchorX="center" anchorY="top" position={[0, -0.35, 0]}>
            {hovered.skill.projectsUsed.length > 0
              ? `Projects: ${hovered.skill.projectsUsed.join(' • ')}`
              : 'Projects: None'}
          </Text>
        </group>
      )}

      {activeSkill && (
        <group position={[0, 3.6, -1.6]}>
          <SkillDeepDivePanel skill={focusedData} />
        </group>
      )}

      {focusedData && (
        <group position={[0, 9.5, 0]}>
          <Text fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle">
            {focusedData.technology} Dependencies
          </Text>
          <Text fontSize={0.22} color="#a8f9ff" anchorX="center" anchorY="top" position={[0, -0.5, 0]}>
            {focusedData.dependencies.length > 0 ? focusedData.dependencies.join(' • ') : 'None'}
          </Text>
          <Text fontSize={0.28} color="#ffffff" anchorX="center" anchorY="middle" position={[0, -1.4, 0]}>
            Projects
          </Text>
          <Text fontSize={0.22} color="#ffd6f3" anchorX="center" anchorY="top" position={[0, -1.9, 0]}>
            {focusedData.projectsUsed.length > 0 ? focusedData.projectsUsed.join(' • ') : 'None'}
          </Text>
        </group>
      )}

      <group position={[0, 12, 0]}>
        <Text fontSize={0.25} color="#ffffff" anchorX="center" anchorY="middle">
          Skills: Backend • Frontend • Algorithms
        </Text>
      </group>

      <group position={[0, 6, 0]}>
        <Text fontSize={0.4} color="#ffffff" anchorX="center" anchorY="middle">
          Skill Nodes
        </Text>
      </group>
    </group>
  )
}
