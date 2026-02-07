import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import { SkillNode as SkillNodeType } from '@/lib/types'

interface SkillDeepDivePanelProps {
  skill: SkillNodeType | null
}

interface ProgressStep {
  label: string
  level: number
  year?: string
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function SkillProgressionBars({ steps }: { steps: ProgressStep[] }) {
  const normalized = useMemo(
    () => steps.map((step) => ({ ...step, level: clamp01(step.level) })),
    [steps]
  )

  return (
    <group position={[0, -1.35, 0]}>
      {normalized.map((step, index) => {
        const height = 0.15 + step.level * 0.7
        const x = (index - (normalized.length - 1) / 2) * 0.6

        return (
          <group key={`${step.label}-${index}`} position={[x, 0, 0]}>
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[0.25, height, 0.08]} />
              <meshStandardMaterial color="#55f5ff" emissive="#2bb3ff" emissiveIntensity={0.35} />
            </mesh>
            <Text position={[0, -0.18, 0]} fontSize={0.14} color="#ffffff" anchorX="center" anchorY="top">
              {step.label}
            </Text>
            {step.year && (
              <Text position={[0, -0.36, 0]} fontSize={0.11} color="#b8f4ff" anchorX="center" anchorY="top">
                {step.year}
              </Text>
            )}
          </group>
        )
      })}
    </group>
  )
}

/**
 * Floating deep dive panel for the active skill node.
 */
export function SkillDeepDivePanel({ skill }: SkillDeepDivePanelProps) {
  const usage = skill?.usageHighlights?.length ? skill.usageHighlights : ['Contextual usage summary pending.']

  const progression = useMemo<ProgressStep[]>(() => {
    if (!skill) return []

    if (skill.progression?.length) {
      return skill.progression.map((step) => ({
        label: step.label,
        level: step.level,
        year: step.year
      }))
    }

    const base = clamp01(skill.proficiencyLevel)
    return [
      { label: 'Start', level: Math.min(0.35, base) },
      { label: 'Applied', level: Math.min(0.7, base) },
      { label: 'Now', level: base }
    ]
  }, [skill])

  if (!skill) return null

  return (
    <group>
      <mesh position={[0, -0.1, -0.05]}>
        <planeGeometry args={[5.2, 3.1]} />
        <meshStandardMaterial color="#081b2b" transparent opacity={0.6} />
      </mesh>

      <Text fontSize={0.32} color="#ffffff" anchorX="center" anchorY="middle">
        {skill.technology} Deep Dive
      </Text>

      <Text position={[0, -0.55, 0]} fontSize={0.2} color="#c9f8ff" anchorX="center" anchorY="middle">
        Contextual Usage
      </Text>

      <group position={[0, -0.9, 0]}>
        {usage.map((line, index) => (
          <Text
            key={`${skill.technology}-usage-${index}`}
            position={[0, -index * 0.25, 0]}
            fontSize={0.18}
            color="#e6f9ff"
            anchorX="center"
            anchorY="top"
          >
            {line}
          </Text>
        ))}
      </group>

      <Text position={[0, -1.1, 0]} fontSize={0.2} color="#c9f8ff" anchorX="center" anchorY="middle">
        Proficiency Progression
      </Text>

      <SkillProgressionBars steps={progression} />
    </group>
  )
}

