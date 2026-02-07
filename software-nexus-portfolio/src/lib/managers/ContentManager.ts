/**
 * ContentManager - Handles portfolio content loading, validation, caching, and hot-reload
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { PortfolioContent, ProjectData, ExperienceData, ResearchData } from '@/lib/types'

// Content validation schemas
const VALIDATION_RULES = {
  personalInfo: {
    name: { type: 'string', minLength: 1, maxLength: 100 },
    title: { type: 'string', minLength: 1, maxLength: 200 },
    bio: { type: 'string', minLength: 0, maxLength: 2000 },
    email: { type: 'email' },
    linkedin: { type: 'url' },
    github: { type: 'url' }
  },
  project: {
    id: { type: 'string', pattern: '^[a-z0-9-]+$' },
    title: { type: 'string', minLength: 1, maxLength: 200 },
    domain: { type: 'enum', values: ['ecommerce', 'fintech', 'gaming', 'saas', 'ai-ml', 'blockchain'] }
  },
  skill: {
    technology: { type: 'string', minLength: 1, maxLength: 100 },
    category: { type: 'enum', values: ['backend', 'frontend', 'algorithms', 'tools', 'cloud', 'database'] },
    proficiencyLevel: { type: 'number', min: 0, max: 1 }
  }
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

/**
 * Validates content against defined rules
 */
export class ContentValidator {
  /**
   * Validate a complete portfolio content object
   */
  static validatePortfolioContent(content: Partial<PortfolioContent>): ValidationResult {
    const errors: ValidationError[] = []

    // Validate personal info
    if (content.personalInfo) {
      const personalInfoErrors = this.validatePersonalInfo(content.personalInfo)
      errors.push(...personalInfoErrors)
    }

    // Validate projects
    if (content.projects?.length) {
      content.projects.forEach((project, index) => {
        const projectErrors = this.validateProject(project)
        errors.push(...projectErrors.map(e => ({ ...e, field: `projects[${index}].${e.field}` })))
      })
    }

    // Validate skills
    if (content.skills?.length) {
      content.skills.forEach((skill, index) => {
        const skillErrors = this.validateSkill(skill)
        errors.push(...skillErrors.map(e => ({ ...e, field: `skills[${index}].${e.field}` })))
      })
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate personal information
   */
  static validatePersonalInfo(personalInfo: any): ValidationError[] {
    const errors: ValidationError[] = []
    const rules = VALIDATION_RULES.personalInfo

    // Validate name
    if (!personalInfo.name || typeof personalInfo.name !== 'string') {
      errors.push({ field: 'name', message: 'Name is required and must be a string' })
    } else if (personalInfo.name.length > rules.name.maxLength) {
      errors.push({ field: 'name', message: `Name must be less than ${rules.name.maxLength} characters` })
    }

    // Validate email format
    if (personalInfo.email && !this.isValidEmail(personalInfo.email)) {
      errors.push({ field: 'email', message: 'Invalid email format' })
    }

    // Validate URLs
    if (personalInfo.linkedin && !this.isValidUrl(personalInfo.linkedin)) {
      errors.push({ field: 'linkedin', message: 'Invalid LinkedIn URL' })
    }

    if (personalInfo.github && !this.isValidUrl(personalInfo.github)) {
      errors.push({ field: 'github', message: 'Invalid GitHub URL' })
    }

    return errors
  }

  /**
   * Validate a project
   */
  static validateProject(project: any): ValidationError[] {
    const errors: ValidationError[] = []
    const rules = VALIDATION_RULES.project

    // Validate ID format
    if (!project.id || !new RegExp(rules.id.pattern).test(project.id)) {
      errors.push({
        field: 'id',
        message: 'Project ID must be alphanumeric with hyphens only',
        value: project.id
      })
    }

    // Validate title
    if (!project.title || typeof project.title !== 'string') {
      errors.push({ field: 'title', message: 'Project title is required' })
    }

    // Validate domain
    if (!project.domain || !rules.domain.values.includes(project.domain)) {
      errors.push({
        field: 'domain',
        message: `Domain must be one of: ${rules.domain.values.join(', ')}`
      })
    }

    // Validate required nested objects
    if (!project.theme) {
      errors.push({ field: 'theme', message: 'Project theme is required' })
    }

    if (!project.engineeringStory) {
      errors.push({ field: 'engineeringStory', message: 'Engineering story is required' })
    }

    return errors
  }

  /**
   * Validate a skill node
   */
  static validateSkill(skill: any): ValidationError[] {
    const errors: ValidationError[] = []
    const rules = VALIDATION_RULES.skill

    // Validate technology name
    if (!skill.technology || typeof skill.technology !== 'string') {
      errors.push({ field: 'technology', message: 'Technology name is required' })
    }

    // Validate category
    if (!skill.category || !rules.category.values.includes(skill.category)) {
      errors.push({
        field: 'category',
        message: `Category must be one of: ${rules.category.values.join(', ')}`
      })
    }

    // Validate proficiency level
    if (typeof skill.proficiencyLevel !== 'number' || skill.proficiencyLevel < 0 || skill.proficiencyLevel > 1) {
      errors.push({
        field: 'proficiencyLevel',
        message: 'Proficiency level must be a number between 0 and 1'
      })
    }

    // Validate arrays
    if (!Array.isArray(skill.projectsUsed)) {
      errors.push({ field: 'projectsUsed', message: 'Projects used must be an array' })
    }

    if (!Array.isArray(skill.dependencies)) {
      errors.push({ field: 'dependencies', message: 'Dependencies must be an array' })
    }

    return errors
  }

  /**
   * Helper: Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Helper: Validate URL format
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Sanitizes content to prevent XSS and other injection attacks
 */
export class ContentSanitizer {
  /**
   * Sanitize a string by removing dangerous HTML tags and scripts
   */
  static sanitizeString(str: string): string {
    if (typeof str !== 'string') return ''

    // Remove script tags and their content
    let sanitized = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '')

    // Remove iframe tags
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')

    // Remove potentially dangerous tags
    const dangerousTags = ['object', 'embed', 'link', 'meta', 'style']
    dangerousTags.forEach(tag => {
      const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi')
      sanitized = sanitized.replace(regex, '')
    })

    return sanitized.trim()
  }

  /**
   * Sanitize portfolio content
   */
  static sanitizePortfolioContent(content: Partial<PortfolioContent>): Partial<PortfolioContent> {
    return {
      personalInfo: content.personalInfo ? this.sanitizePersonalInfo(content.personalInfo) : undefined,
      projects: content.projects?.map(p => this.sanitizeProject(p)),
      skills: content.skills,
      experience: content.experience?.map(e => this.sanitizeExperience(e)),
      certifications: content.certifications,
      researchShowcase: content.researchShowcase?.map(r => this.sanitizeResearch(r))
    }
  }

  /**
   * Sanitize personal info
   */
  private static sanitizePersonalInfo(info: any): any {
    return {
      name: this.sanitizeString(info.name || ''),
      title: this.sanitizeString(info.title || ''),
      bio: this.sanitizeString(info.bio || ''),
      location: this.sanitizeString(info.location || ''),
      email: this.sanitizeString(info.email || ''),
      linkedin: this.sanitizeString(info.linkedin || ''),
      github: this.sanitizeString(info.github || '')
    }
  }

  /**
   * Sanitize project
   */
  private static sanitizeProject(project: ProjectData): ProjectData {
    return {
      ...project,
      title: this.sanitizeString(project.title),
      engineeringStory: {
        ...project.engineeringStory,
        problemStatement: this.sanitizeString(project.engineeringStory.problemStatement),
        solutionApproach: this.sanitizeString(project.engineeringStory.solutionApproach),
        resultsAndImpact: this.sanitizeString(project.engineeringStory.resultsAndImpact),
        lessonsLearned: this.sanitizeString(project.engineeringStory.lessonsLearned)
      }
    }
  }

  /**
   * Sanitize experience
   */
  private static sanitizeExperience(exp: ExperienceData): ExperienceData {
    return {
      ...exp,
      company: this.sanitizeString(exp.company),
      role: this.sanitizeString(exp.role),
      achievements: exp.achievements.map(a => this.sanitizeString(a))
    }
  }

  /**
   * Sanitize research
   */
  private static sanitizeResearch(research: ResearchData): ResearchData {
    return {
      ...research,
      topic: this.sanitizeString(research.topic),
      methodology: this.sanitizeString(research.methodology),
      findings: research.findings.map(f => this.sanitizeString(f))
    }
  }
}

/**
 * Cache layer for portfolio content
 */
export interface CacheConfig {
  ttl: number // Time to live in milliseconds
  maxSize: number // Maximum number of items
}

export class ContentCache {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private config: CacheConfig

  constructor(config: CacheConfig = { ttl: 1000 * 60 * 60, maxSize: 50 }) {
    this.config = config
  }

  /**
   * Get cached item
   */
  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    // Check if expired
    const age = Date.now() - cached.timestamp
    if (age > this.config.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  /**
   * Set cache item
   */
  set(key: string, data: any): void {
    // Enforce max size
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      // Remove oldest item
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Clear specific cache item
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      items: Array.from(this.cache.keys())
    }
  }
}

/**
 * Main Content Manager class
 */
export class ContentManager {
  private cache: ContentCache
  private hotReloadCallbacks: Map<string, ((data: any) => void)[]> = new Map()
  private contentVersion = '1.0.0'

  constructor(cacheConfig?: CacheConfig) {
    this.cache = new ContentCache(cacheConfig)
  }

  /**
   * Load content with validation and caching
   */
  async loadContent(contentSource: Partial<PortfolioContent>): Promise<{
    content: Partial<PortfolioContent>;
    validation: ValidationResult
  }> {
    const cacheKey = 'portfolio-content'

    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    // Validate content
    const validation = ContentValidator.validatePortfolioContent(contentSource)

    if (!validation.valid) {
      console.warn('Content validation errors:', validation.errors)
    }

    // Sanitize content
    const sanitized = ContentSanitizer.sanitizePortfolioContent(contentSource)

    const result = {
      content: sanitized,
      validation
    }

    // Cache result
    this.cache.set(cacheKey, result)

    return result
  }

  /**
   * Load a specific project
   */
  async loadProject(projectId: string, projects: ProjectData[]): Promise<{
    project: ProjectData | null;
    validation: ValidationResult
  }> {
    const cacheKey = `project-${projectId}`

    // Check cache
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    const project = projects.find(p => p.id === projectId) || null

    if (!project) {
      return {
        project: null,
        validation: {
          valid: false,
          errors: [{ field: 'projectId', message: `Project not found: ${projectId}` }]
        }
      }
    }

    const validationErrors = ContentValidator.validateProject(project)
    const result = {
      project,
      validation: {
        valid: validationErrors.length === 0,
        errors: validationErrors
      }
    }

    this.cache.set(cacheKey, result)
    return result
  }

  /**
   * Update content and trigger hot-reload
   */
  async updateContent(
    contentKey: string,
    newData: any
  ): Promise<ValidationResult> {
    const validation = ContentValidator.validatePortfolioContent({ [contentKey]: newData })

    if (validation.valid) {
      // Clear relevant caches
      this.cache.delete('portfolio-content')

      // Trigger hot-reload callbacks
      const callbacks = this.hotReloadCallbacks.get(contentKey) || []
      callbacks.forEach(cb => cb(newData))
    }

    return validation
  }

  /**
   * Register hot-reload callback
   */
  onHotReload(contentKey: string, callback: (data: any) => void): () => void {
    if (!this.hotReloadCallbacks.has(contentKey)) {
      this.hotReloadCallbacks.set(contentKey, [])
    }

    const callbacks = this.hotReloadCallbacks.get(contentKey)!
    callbacks.push(callback)

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * Get content version
   */
  getVersion(): string {
    return this.contentVersion
  }

  /**
   * Set content version
   */
  setVersion(version: string): void {
    this.contentVersion = version
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return this.cache.getStats()
  }
}

// Export singleton instance
export const contentManager = new ContentManager()


