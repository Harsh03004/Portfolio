import { useMemo, useRef } from 'react'
import { Color, Mesh, Vector3 } from 'three'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { SkillCategory, SkillNode as SkillNodeType } from '@/lib/types'

interface PositionedSkill {
  skill: SkillNodeType
  position: Vector3
}

interface DependencyEdge {
  id: string
  from: PositionedSkill
  to: PositionedSkill
  color: string
  strength: number
}

interface SkillDependencyLinesProps {
  nodes: PositionedSkill[]
  activeSkill?: string | null
  colorMap: Record<SkillCategory, string>
}

const colorA = new Color()
const colorB = new Color()

const blendColors = (from: string, to: string) => {
  colorA.set(from)
  colorB.set(to)
  return colorA.lerp(colorB, 0.5).getStyle()
}

function DependencyFlow({ start, end, color, speed, visible }: {
  start: Vector3
  end: Vector3
  color: string
  speed: number
  visible: boolean
}) {
  const meshRef = useRef<Mesh>(null)
  const progress = useRef(Math.random())
  const temp = useMemo(() => new Vector3(), [])

  useFrame((_, delta) => {
    if (!meshRef.current || !visible) return
    progress.current = (progress.current + delta * speed) % 1
    temp.lerpVectors(start, end, progress.current)
    meshRef.current.position.copy(temp)
  })

  return (
    <mesh ref={meshRef} visible={visible}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

/**
 * Renders animated dependency lines between related skill nodes.
 */
export function SkillDependencyLines({ nodes, activeSkill, colorMap }: SkillDependencyLinesProps) {
  const edges = useMemo<DependencyEdge[]>(() => {
    const nodeByTech = new Map(nodes.map((node) => [node.skill.technology, node]))
    const seen = new Set<string>()

    const results: DependencyEdge[] = []

    nodes.forEach((node) => {
      node.skill.dependencies.forEach((dependency) => {
        const target = nodeByTech.get(dependency)
        if (!target) return

        const key = [node.skill.technology, target.skill.technology].sort().join('::')
        if (seen.has(key)) return
        seen.add(key)

        const fromColor = colorMap[node.skill.category]
        const toColor = colorMap[target.skill.category]

        results.push({
          id: key,
          from: node,
          to: target,
          color: blendColors(fromColor, toColor),
          strength: (node.skill.proficiencyLevel + target.skill.proficiencyLevel) / 2
        })
      })
    })

    return results
  }, [nodes, colorMap])

  if (edges.length === 0) return null

  return (
    <group>
      {edges.map((edge) => {
        const isActive =
          !activeSkill ||
          edge.from.skill.technology === activeSkill ||
          edge.to.skill.technology === activeSkill

        return (
          <group key={edge.id}>
            <Line
              points={[edge.from.position, edge.to.position]}
              color={edge.color}
              lineWidth={isActive ? 1.4 : 0.6}
              transparent
              opacity={isActive ? 0.55 : 0.12}
            />
            <DependencyFlow
              start={edge.from.position}
              end={edge.to.position}
              color={edge.color}
              speed={0.4 + edge.strength * 0.6}
              visible={isActive}
            />
          </group>
        )
      })}
    </group>
  )
}

