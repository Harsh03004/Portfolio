import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { CameraController } from '@/lib/controllers/CameraController'

interface CameraRigProps {
  scrollProgress: number
  enableScrollControl?: boolean
}

export default function CameraRig({ scrollProgress, enableScrollControl = true }: CameraRigProps) {
  const { camera } = useThree()
  const controllerRef = useRef<CameraController | null>(null)

  // Initialize camera controller
  useEffect(() => {
    controllerRef.current = new CameraController(camera)
    console.log('Camera controller initialized')
  }, [camera])

  // Update camera based on scroll progress
  useFrame(() => {
    if (controllerRef.current && enableScrollControl) {
      controllerRef.current.updateCameraFromScroll(scrollProgress)
    }
  })

  return null
}
