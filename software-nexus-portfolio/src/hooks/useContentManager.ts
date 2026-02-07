/**
 * useContentManager - React hook for portfolio content management
 * Provides content loading, validation, caching, and hot-reload capabilities
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { PortfolioContent, ProjectData } from '@/lib/types'
import {
  ContentManager,
  ValidationResult,
  ContentValidator,
  ContentSanitizer
} from '@/lib/managers/ContentManager'

export interface UseContentManagerOptions {
  autoLoad?: boolean
  cacheEnabled?: boolean
  ttl?: number
}

export interface ContentState {
  content: Partial<PortfolioContent> | null
  loading: boolean
  error: string | null
  validation: ValidationResult | null
  isDirty: boolean
}

/**
 * Hook for managing portfolio content
 */
export function useContentManager(
  initialContent?: Partial<PortfolioContent>,
  options: UseContentManagerOptions = {}
) {
  const { autoLoad = true, cacheEnabled: _cacheEnabled = true, ttl = 1000 * 60 * 60 } = options

  const managerRef = useRef(new ContentManager({ ttl, maxSize: 50 }))
  const [state, setState] = useState<ContentState>({
    content: initialContent || null,
    loading: initialContent ? false : autoLoad,
    error: null,
    validation: null,
    isDirty: false
  })

  /**
   * Load content
   */
  const loadContent = useCallback(
    async (source: Partial<PortfolioContent>) => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const { content, validation } = await managerRef.current.loadContent(source)

        setState(prev => ({
          ...prev,
          content,
          validation,
          loading: false,
          isDirty: false
        }))

        return { content, validation }
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to load content'
        setState(prev => ({
          ...prev,
          error,
          loading: false
        }))

        throw err
      }
    },
    []
  )

  /**
   * Load a specific project
   */
  const loadProject = useCallback(
    async (projectId: string) => {
      if (!state.content?.projects) {
        throw new Error('Projects not loaded')
      }

      try {
        const { project, validation } = await managerRef.current.loadProject(
          projectId,
          state.content.projects
        )

        if (!project) {
          throw new Error(`Project not found: ${projectId}`)
        }

        return { project, validation }
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to load project'
        throw new Error(error)
      }
    },
    [state.content?.projects]
  )

  /**
   * Update content
   */
  const updateContent = useCallback(
    async (key: string, data: any) => {
      setState(prev => ({ ...prev, isDirty: true }))

      try {
        const validation = await managerRef.current.updateContent(key, data)

        setState(prev => ({
          ...prev,
          content: {
            ...prev.content,
            [key]: data
          },
          validation,
          isDirty: !validation.valid
        }))

        return validation
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Failed to update content'
        setState(prev => ({ ...prev, error }))
        throw err
      }
    },
    []
  )

  /**
   * Validate content
   */
  const validateContent = useCallback(
    (content: Partial<PortfolioContent>) => {
      const validation = ContentValidator.validatePortfolioContent(content)
      setState(prev => ({ ...prev, validation }))
      return validation
    },
    []
  )

  /**
   * Sanitize content
   */
  const sanitizeContent = useCallback(
    (content: Partial<PortfolioContent>) => {
      return ContentSanitizer.sanitizePortfolioContent(content)
    },
    []
  )

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    managerRef.current.clearCache()
  }, [])

  /**
   * Get cache stats
   */
  const getCacheStats = useCallback(() => {
    return managerRef.current.getCacheStats()
  }, [])

  /**
   * Register hot-reload callback
   */
  const onHotReload = useCallback(
    (key: string, callback: (data: any) => void) => {
      return managerRef.current.onHotReload(key, callback)
    },
    []
  )

  // Auto-load initial content if provided
  useEffect(() => {
    if (autoLoad && initialContent && !state.content) {
      loadContent(initialContent)
    }
  }, [autoLoad, initialContent, state.content, loadContent])

  return {
    // State
    content: state.content,
    loading: state.loading,
    error: state.error,
    validation: state.validation,
    isDirty: state.isDirty,

    // Methods
    loadContent,
    loadProject,
    updateContent,
    validateContent,
    sanitizeContent,
    clearCache,
    getCacheStats,
    onHotReload
  }
}

/**
 * Hook for project content specifically
 */
export function useProjectContent(projects: ProjectData[] | undefined) {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProject = useCallback(
    async (projectId: string) => {
      if (!projects) {
        setError('Projects not loaded')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const project = projects.find(p => p.id === projectId)

        if (!project) {
          throw new Error(`Project not found: ${projectId}`)
        }

        // Validate project
        const validationErrors = ContentValidator.validateProject(project)
        if (validationErrors.length > 0) {
          console.warn('Project validation errors:', validationErrors)
        }

        setSelectedProject(project)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load project'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [projects]
  )

  return {
    selectedProject,
    loading,
    error,
    loadProject,
    clearSelection: () => setSelectedProject(null)
  }
}

/**
 * Hook for validating content before submission/update
 */
export function useContentValidation(content: Partial<PortfolioContent> | null) {
  const [validation, setValidation] = useState<ValidationResult>({
    valid: true,
    errors: []
  })

  const validate = useCallback(
    (contentToValidate?: Partial<PortfolioContent>) => {
      const toValidate = contentToValidate || content
      if (!toValidate) {
        return { valid: false, errors: [] }
      }

      const result = ContentValidator.validatePortfolioContent(toValidate)
      setValidation(result)
      return result
    },
    [content]
  )

  useEffect(() => {
    if (content) {
      validate(content)
    }
  }, [content, validate])

  return {
    validation,
    isValid: validation.valid,
    errors: validation.errors,
    validate
  }
}

