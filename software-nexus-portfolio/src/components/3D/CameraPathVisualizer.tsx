import { useMemo } from 'react'
import { CatmullRomCurve3 } from 'three'
import { Line } from '@react-three/drei'
import { CAMERA_PATH, FANTASY_TECH_THEME } from '@/lib/constants'

interface CameraPathVisualizerProps {
  visible?: boolean
  showTargets?: boolean
}

export default function CameraPathVisualizer({ 
  visible = false, 
  showTargets = false 
}: CameraPathVisualizerProps) {
  // Create smooth curve through camera positions
  const cameraPositions = useMemo(() => {
    return CAMERA_PATH.map(path => path.position)
  }, [])

  const targetPositions = useMemo(() => {
    return CAMERA_PATH.map(path => path.target)
  }, [])

  // Create smooth curve
  const curve = useMemo(() => {
    return new CatmullRomCurve3(cameraPositions, false, 'catmullrom', 0.5)
  }, [cameraPositions])

  const curvePoints = useMemo(() => {
    return curve.getPoints(100)
  }, [curve])

  if (!visible) return null

  return (
    <group>
      {/* Camera path line */}
      <Line
        points={curvePoints}
        color={FANTASY_TECH_THEME.colors.primary}
        lineWidth={2}
        transparent
        opacity={0.5}
      />

      {/* Camera position markers */}
      {cameraPositions.map((position, index) => (
        <mesh key={`cam-${index}`} position={position}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial 
            color={FANTASY_TECH_THEME.colors.primary}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Target position markers and lines */}
      {showTargets && targetPositions.map((target, index) => (
        <group key={`target-${index}`}>
          {/* Target marker */}
          <mesh position={target}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial 
              color={FANTASY_TECH_THEME.colors.accent}
              transparent
              opacity={0.6}
            />
          </mesh>
          
          {/* Line from camera to target */}
          <Line
            points={[cameraPositions[index], target]}
            color={FANTASY_TECH_THEME.colors.accent}
            lineWidth={1}
            transparent
            opacity={0.3}
            dashed
            dashSize={0.5}
            gapSize={0.3}
          />
        </group>
      ))}
    </group>
  )
}
