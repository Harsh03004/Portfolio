import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import Interactive from '../Interactive'
import { SkillNode as SkillNodeType } from '@/lib/types'

interface SkillNodeProps {
  node: SkillNodeType
  position: [number, number, number]
  color: string
  onClick?: (node: SkillNodeType) => void
  onHover?: (node: SkillNodeType | null) => void
}

/**
 * 3D skill node with proficiency rings and label.
 */
export function SkillNode({ node, position, color, onClick, onHover }: SkillNodeProps) {
  const proficiency = Math.max(0, Math.min(node.proficiencyLevel, 1))
  const ringCount = Math.max(1, Math.round(proficiency * 3))

  const rings = useMemo(() => Array.from({ length: ringCount }, (_, i) => {
    const scale = 0.8 + i * 0.25
    return { scale }
  }), [ringCount])

  return (
    <Interactive
      onClick={() => onClick?.(node)}
      onHoverIn={() => onHover?.(node)}
      onHoverOut={() => onHover?.(null)}
      hoverScale={1.08}
      hoverColor={color}
    >
      <group position={position}>
        {/* Core */}
        <mesh>
          <icosahedronGeometry args={[0.45, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>

        {/* Proficiency rings */}
        {rings.map((ring, index) => (
          <mesh key={index} rotation={[Math.PI / 2, 0, 0]} scale={ring.scale}>
            <torusGeometry args={[0.6, 0.04, 10, 32]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.35}
              emissive={color}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}

        {/* Glow effect */}
        <mesh scale={1.35}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.15}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Label */}
        <Text
          position={[0, 0.9, 0]}
          fontSize={0.22}
          color={node.labelColor ?? '#ffffff'}
          anchorX="center"
          anchorY="bottom"
        >
          {node.technology}
        </Text>
      </group>
    </Interactive>
  )
}
