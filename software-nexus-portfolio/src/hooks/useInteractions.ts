import { useEffect, useRef, useCallback } from 'react'
import { useThree } from '@react-three/fiber'
import { Object3D } from 'three'
import { InteractionManager, InteractionEvent, InteractionCallbacks } from '@/lib/managers/InteractionManager'

export function useInteractions() {
  const { camera, scene } = useThree()
  const managerRef = useRef<InteractionManager | null>(null)

  // Initialize interaction manager
  useEffect(() => {
    const manager = new InteractionManager(camera, scene)
    managerRef.current = manager

    return () => {
      manager.dispose()
    }
  }, [camera, scene])

  // Add interactive object
  const addInteractive = useCallback((object: Object3D, callbacks?: InteractionCallbacks) => {
    managerRef.current?.addInteractiveObject(object, callbacks)
  }, [])

  // Remove interactive object
  const removeInteractive = useCallback((object: Object3D) => {
    managerRef.current?.removeInteractiveObject(object)
  }, [])

  // Set global callbacks
  const setGlobalCallbacks = useCallback((callbacks: {
    onHover?: (event: InteractionEvent) => void
    onClick?: (event: InteractionEvent) => void
    onScroll?: (event: InteractionEvent) => void
  }) => {
    managerRef.current?.setGlobalCallbacks(callbacks)
  }, [])

  // Enable/disable interactions
  const setEnabled = useCallback((enabled: boolean) => {
    managerRef.current?.setEnabled(enabled)
  }, [])

  // Get hovered object
  const getHoveredObject = useCallback(() => {
    return managerRef.current?.getHoveredObject() || null
  }, [])

  return {
    addInteractive,
    removeInteractive,
    setGlobalCallbacks,
    setEnabled,
    getHoveredObject,
  }
}
