import { useState, useEffect, useRef, useCallback } from 'react'
import { Vector3 } from 'three'
import { getPortalManager, PortalManager, PortalState, PortalConfig } from '@/lib/managers/PortalManager'
import { ProjectData } from '@/lib/types'

/**
 * React hook for portal management
 * Provides portal entry/exit functionality and state tracking
 */
export function usePortal() {
  const managerRef = useRef<PortalManager | null>(null)
  const [portalState, setPortalState] = useState<PortalState>('closed')
  const [activePortalId, setActivePortalId] = useState<string | null>(null)
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null)

  useEffect(() => {
    // Get singleton instance
    managerRef.current = getPortalManager()

    // Subscribe to state changes
    const unsubscribe = managerRef.current.subscribe((state, portalId) => {
      setPortalState(state)
      setActivePortalId(portalId)

      // Update active project
      if (portalId && state === 'open') {
        const portal = managerRef.current?.getPortal(portalId)
        setActiveProject(portal?.project || null)
      } else if (state === 'closed') {
        setActiveProject(null)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const registerPortal = useCallback((config: PortalConfig) => {
    managerRef.current?.registerPortal(config)
  }, [])

  const unregisterPortal = useCallback((id: string) => {
    managerRef.current?.unregisterPortal(id)
  }, [])

  const enterPortal = useCallback(
    async (
      portalId: string,
      cameraPosition: Vector3,
      cameraTarget: Vector3,
      onUpdate: (position: Vector3, target: Vector3) => void
    ) => {
      await managerRef.current?.enterPortal(portalId, cameraPosition, cameraTarget, onUpdate)
    },
    []
  )

  const exitPortal = useCallback(
    async (
      returnPosition: Vector3,
      returnTarget: Vector3,
      onUpdate: (position: Vector3, target: Vector3) => void
    ) => {
      await managerRef.current?.exitPortal(returnPosition, returnTarget, onUpdate)
    },
    []
  )

  const isPortalActive = useCallback((id: string) => {
    return managerRef.current?.isPortalActive(id) ?? false
  }, [])

  const isNearPortal = useCallback((position: Vector3, portalId: string, threshold?: number) => {
    return managerRef.current?.isNearPortal(position, portalId, threshold) ?? false
  }, [])

  const getAllPortals = useCallback(() => {
    return managerRef.current?.getAllPortals() ?? []
  }, [])

  return {
    portalState,
    activePortalId,
    activeProject,
    registerPortal,
    unregisterPortal,
    enterPortal,
    exitPortal,
    isPortalActive,
    isNearPortal,
    getAllPortals,
    isInPortal: portalState === 'open',
    isTransitioning: portalState === 'opening' || portalState === 'closing'
  }
}
