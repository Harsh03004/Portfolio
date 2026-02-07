/**
 * ContentManager Tests
 * Tests for content validation, sanitization, caching, and hot-reload functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  ContentValidator,
  ContentSanitizer,
  ContentCache,
  ContentManager
} from '@/lib/managers/ContentManager'
import { PortfolioContent, ProjectData, SkillNode } from '@/lib/types'

// ============================================================================
// ContentValidator Tests
// ============================================================================

describe('ContentValidator', () => {
  describe('validatePortfolioContent', () => {
    it('should validate valid portfolio content', () => {
      const validContent: Partial<PortfolioContent> = {
        personalInfo: {
          name: 'John Doe',
          title: 'Software Engineer',
          bio: 'A talented developer',
          location: 'San Francisco',
          email: 'john@example.com',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe'
        },
        projects: [],
        skills: []
      }

      const result = ContentValidator.validatePortfolioContent(validContent)
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect missing required fields', () => {
      const invalidContent: Partial<PortfolioContent> = {
        personalInfo: {
          name: '',
          title: 'Software Engineer',
          bio: '',
          location: '',
          email: '',
          linkedin: '',
          github: ''
        }
      }

      const result = ContentValidator.validatePortfolioContent(invalidContent)
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should validate multiple projects', () => {
      const projects: ProjectData[] = [
        {
          id: 'project-one',
          title: 'E-Commerce Platform',
          domain: 'ecommerce',
          theme: { primaryColor: '#fff', accentColor: '#fff', ambientLight: '#fff', particleColor: '#fff' },
          portalModel: '',
          architecture: { components: [], connections: [] },
          dataFlow: { nodes: [], flows: [] },
          performance: { loadTime: 0, throughput: 0, errorRate: 0 },
          challenges: [],
          techStack: { technologies: [], reasoning: '' },
          engineeringStory: {
            problemStatement: 'Test',
            solutionApproach: 'Test',
            technicalChallenges: [],
            designDecisions: [],
            resultsAndImpact: '',
            lessonsLearned: ''
          },
          designDecisions: [],
          tradeoffs: []
        }
      ]

      const content: Partial<PortfolioContent> = {
        projects,
        personalInfo: {
          name: 'Test User',
          title: '',
          bio: '',
          location: '',
          email: '',
          linkedin: '',
          github: ''
        }
      }

      const result = ContentValidator.validatePortfolioContent(content)
      expect(result.valid).toBe(true)
    })

    it('should validate skills with correct categories', () => {
      const skills: SkillNode[] = [
        {
          technology: 'React',
          category: 'frontend',
          proficiencyLevel: 0.9,
          projectsUsed: [],
          dependencies: [],
          visualRepresentation: {
            model: 'test',
            position: { x: 0, y: 0, z: 0 } as any,
            connections: [],
            interactionBehavior: { hoverEffect: 'glow', clickAction: 'inspect' }
          }
        }
      ]

      const content: Partial<PortfolioContent> = {
        skills,
        personalInfo: {
          name: 'Test',
          title: '',
          bio: '',
          location: '',
          email: '',
          linkedin: '',
          github: ''
        }
      }

      const result = ContentValidator.validatePortfolioContent(content)
      expect(result.valid).toBe(true)
    })
  })

  describe('validatePersonalInfo', () => {
    it('should validate correct email format', () => {
      const personalInfo = {
        name: 'John Doe',
        title: 'Engineer',
        bio: '',
        location: '',
        email: 'john@example.com',
        linkedin: '',
        github: ''
      }

      const errors = ContentValidator.validatePersonalInfo(personalInfo)
      const emailErrors = errors.filter(e => e.field === 'email')
      expect(emailErrors).toHaveLength(0)
    })

    it('should reject invalid email format', () => {
      const personalInfo = {
        name: 'John Doe',
        title: '',
        bio: '',
        location: '',
        email: 'invalid-email',
        linkedin: '',
        github: ''
      }

      const errors = ContentValidator.validatePersonalInfo(personalInfo)
      expect(errors.some(e => e.field === 'email')).toBe(true)
    })

    it('should validate URLs correctly', () => {
      const personalInfo = {
        name: 'John Doe',
        title: '',
        bio: '',
        location: '',
        email: '',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe'
      }

      const errors = ContentValidator.validatePersonalInfo(personalInfo)
      const urlErrors = errors.filter(e => ['linkedin', 'github'].includes(e.field))
      expect(urlErrors).toHaveLength(0)
    })

    it('should reject invalid URLs', () => {
      const personalInfo = {
        name: 'John Doe',
        title: '',
        bio: '',
        location: '',
        email: '',
        linkedin: 'not a url',
        github: ''
      }

      const errors = ContentValidator.validatePersonalInfo(personalInfo)
      expect(errors.some(e => e.field === 'linkedin')).toBe(true)
    })
  })

  describe('validateProject', () => {
    it('should validate project ID format', () => {
      const project = {
        id: 'valid-project-id',
        title: 'Test Project',
        domain: 'ecommerce',
        theme: {},
        engineeringStory: {}
      }

      const errors = ContentValidator.validateProject(project)
      const idErrors = errors.filter(e => e.field === 'id')
      expect(idErrors).toHaveLength(0)
    })

    it('should reject invalid project ID format', () => {
      const project = {
        id: 'Invalid Project ID',
        title: 'Test Project',
        domain: 'ecommerce',
        theme: {},
        engineeringStory: {}
      }

      const errors = ContentValidator.validateProject(project)
      expect(errors.some(e => e.field === 'id')).toBe(true)
    })

    it('should validate project domain', () => {
      const project = {
        id: 'test-project',
        title: 'Test',
        domain: 'ecommerce',
        theme: {},
        engineeringStory: {}
      }

      const errors = ContentValidator.validateProject(project)
      const domainErrors = errors.filter(e => e.field === 'domain')
      expect(domainErrors).toHaveLength(0)
    })

    it('should reject invalid project domain', () => {
      const project = {
        id: 'test-project',
        title: 'Test',
        domain: 'invalid-domain',
        theme: {},
        engineeringStory: {}
      }

      const errors = ContentValidator.validateProject(project)
      expect(errors.some(e => e.field === 'domain')).toBe(true)
    })
  })

  describe('validateSkill', () => {
    it('should validate skill with valid proficiency level', () => {
      const skill = {
        technology: 'React',
        category: 'frontend',
        proficiencyLevel: 0.85,
        projectsUsed: [],
        dependencies: []
      }

      const errors = ContentValidator.validateSkill(skill)
      const profErrors = errors.filter(e => e.field === 'proficiencyLevel')
      expect(profErrors).toHaveLength(0)
    })

    it('should reject skill with invalid proficiency level', () => {
      const skill = {
        technology: 'React',
        category: 'frontend',
        proficiencyLevel: 1.5,
        projectsUsed: [],
        dependencies: []
      }

      const errors = ContentValidator.validateSkill(skill)
      expect(errors.some(e => e.field === 'proficiencyLevel')).toBe(true)
    })

    it('should validate skill category', () => {
      const validCategories = ['backend', 'frontend', 'algorithms', 'tools', 'cloud', 'database']

      validCategories.forEach(category => {
        const skill = {
          technology: 'Test',
          category: category as any,
          proficiencyLevel: 0.5,
          projectsUsed: [],
          dependencies: []
        }

        const errors = ContentValidator.validateSkill(skill)
        const categoryErrors = errors.filter(e => e.field === 'category')
        expect(categoryErrors).toHaveLength(0)
      })
    })
  })
})

// ============================================================================
// ContentSanitizer Tests
// ============================================================================

describe('ContentSanitizer', () => {
  describe('sanitizeString', () => {
    it('should remove script tags', () => {
      const dirty = 'Hello <script>alert("xss")</script> World'
      const clean = ContentSanitizer.sanitizeString(dirty)
      expect(clean).not.toContain('<script>')
      expect(clean).not.toContain('alert')
    })

    it('should remove event handlers', () => {
      const dirty = '<div onclick="alert(\'xss\')">Click me</div>'
      const clean = ContentSanitizer.sanitizeString(dirty)
      expect(clean).not.toContain('onclick')
    })

    it('should remove iframe tags', () => {
      const dirty = 'Check this out <iframe src="http://evil.com"></iframe>'
      const clean = ContentSanitizer.sanitizeString(dirty)
      expect(clean).not.toContain('iframe')
    })

    it('should preserve safe content', () => {
      const safe = 'This is a <strong>safe</strong> message'
      const clean = ContentSanitizer.sanitizeString(safe)
      expect(clean).toContain('safe')
    })

    it('should handle multiple dangerous elements', () => {
      const dirty = '<script>bad</script><img onerror="alert()"><iframe></iframe>'
      const clean = ContentSanitizer.sanitizeString(dirty)
      expect(clean).not.toContain('script')
      expect(clean).not.toContain('onerror')
      expect(clean).not.toContain('iframe')
    })
  })

  describe('sanitizePortfolioContent', () => {
    it('should sanitize personal info', () => {
      const dirty: Partial<PortfolioContent> = {
        personalInfo: {
          name: 'John<script>alert("xss")</script>Doe',
          title: 'Engineer',
          bio: 'Check <iframe src="evil"></iframe>',
          location: '',
          email: 'test@test.com',
          linkedin: '',
          github: ''
        }
      }

      const clean = ContentSanitizer.sanitizePortfolioContent(dirty)
      expect(clean.personalInfo?.name).not.toContain('<script>')
      expect(clean.personalInfo?.bio).not.toContain('iframe')
    })

    it('should sanitize project content', () => {
      const dirty: Partial<PortfolioContent> = {
        projects: [
          {
            id: 'test',
            title: 'Test<script>hack</script>',
            domain: 'ecommerce',
            theme: { primaryColor: '#fff', accentColor: '#fff', ambientLight: '#fff', particleColor: '#fff' },
            portalModel: '',
            architecture: { components: [], connections: [] },
            dataFlow: { nodes: [], flows: [] },
            performance: { loadTime: 0, throughput: 0, errorRate: 0 },
            challenges: [],
            techStack: { technologies: [], reasoning: '' },
            engineeringStory: {
              problemStatement: 'Test<iframe>evil</iframe>',
              solutionApproach: 'Test',
              technicalChallenges: [],
              designDecisions: [],
              resultsAndImpact: '',
              lessonsLearned: ''
            },
            designDecisions: [],
            tradeoffs: []
          }
        ]
      }

      const clean = ContentSanitizer.sanitizePortfolioContent(dirty)
      expect(clean.projects?.[0].title).not.toContain('<script>')
      expect(clean.projects?.[0].engineeringStory.problemStatement).not.toContain('iframe')
    })
  })
})

// ============================================================================
// ContentCache Tests
// ============================================================================

describe('ContentCache', () => {
  let cache: ContentCache

  beforeEach(() => {
    cache = new ContentCache({ ttl: 1000, maxSize: 5 })
  })

  afterEach(() => {
    cache.clear()
  })

  it('should store and retrieve cached items', () => {
    const data = { test: 'data' }
    cache.set('key1', data)

    expect(cache.get('key1')).toEqual(data)
  })

  it('should return null for expired items', () => {
    cache = new ContentCache({ ttl: 100, maxSize: 5 })
    cache.set('key1', { test: 'data' })

    setTimeout(() => {
      expect(cache.get('key1')).toBeNull()
    }, 150)
  })

  it('should enforce max size', () => {
    for (let i = 0; i < 6; i++) {
      cache.set(`key${i}`, { id: i })
    }

    const stats = cache.getStats()
    expect(stats.size).toBeLessThanOrEqual(5)
  })

  it('should delete specific cache items', () => {
    cache.set('key1', { test: 'data' })
    cache.delete('key1')

    expect(cache.get('key1')).toBeNull()
  })

  it('should clear all cache', () => {
    cache.set('key1', { test: 'data' })
    cache.set('key2', { test: 'data' })
    cache.clear()

    expect(cache.get('key1')).toBeNull()
    expect(cache.get('key2')).toBeNull()
  })

  it('should provide cache stats', () => {
    cache.set('key1', { test: 'data' })
    cache.set('key2', { test: 'data' })

    const stats = cache.getStats()
    expect(stats.size).toBe(2)
    expect(stats.items).toContain('key1')
    expect(stats.items).toContain('key2')
  })
})

// ============================================================================
// ContentManager Tests
// ============================================================================

describe('ContentManager', () => {
  let manager: ContentManager

  beforeEach(() => {
    manager = new ContentManager({ ttl: 1000, maxSize: 10 })
  })

  afterEach(() => {
    manager.clearCache()
  })

  it('should load and cache content', async () => {
    const content: Partial<PortfolioContent> = {
      personalInfo: {
        name: 'Test User',
        title: 'Engineer',
        bio: '',
        location: '',
        email: 'test@test.com',
        linkedin: '',
        github: ''
      }
    }

    const result = await manager.loadContent(content)
    expect(result.content.personalInfo?.name).toBe('Test User')
  })

  it('should validate content during loading', async () => {
    const content: Partial<PortfolioContent> = {
      personalInfo: {
        name: 'Test',
        title: '',
        bio: '',
        location: '',
        email: 'invalid-email',
        linkedin: '',
        github: ''
      }
    }

    const result = await manager.loadContent(content)
    expect(result.validation.errors.some(e => e.field === 'email')).toBe(true)
  })

  it('should load specific projects', async () => {
    const projects: ProjectData[] = [
      {
        id: 'test-project',
        title: 'Test Project',
        domain: 'ecommerce',
        theme: { primaryColor: '#fff', accentColor: '#fff', ambientLight: '#fff', particleColor: '#fff' },
        portalModel: '',
        architecture: { components: [], connections: [] },
        dataFlow: { nodes: [], flows: [] },
        performance: { loadTime: 0, throughput: 0, errorRate: 0 },
        challenges: [],
        techStack: { technologies: [], reasoning: '' },
        engineeringStory: {
          problemStatement: 'Test',
          solutionApproach: 'Test',
          technicalChallenges: [],
          designDecisions: [],
          resultsAndImpact: '',
          lessonsLearned: ''
        },
        designDecisions: [],
        tradeoffs: []
      }
    ]

    const result = await manager.loadProject('test-project', projects)
    expect(result.project?.id).toBe('test-project')
  })

  it('should handle missing projects', async () => {
    const result = await manager.loadProject('nonexistent', [])
    expect(result.project).toBeNull()
    expect(result.validation.valid).toBe(false)
  })

  it('should update content and trigger hot-reload', async () => {
    let hotReloadCalled = false
    const unsubscribe = manager.onHotReload('projects', () => {
      hotReloadCalled = true
    })

    const newProjects: ProjectData[] = []
    await manager.updateContent('projects', newProjects)

    expect(hotReloadCalled).toBe(true)
    unsubscribe()
  })

  it('should register and unregister hot-reload callbacks', () => {
    const callback = () => {}
    const unsubscribe = manager.onHotReload('projects', callback)

    expect(typeof unsubscribe).toBe('function')
    unsubscribe()
  })

  it('should track content version', () => {
    const version = manager.getVersion()
    expect(typeof version).toBe('string')

    manager.setVersion('2.0.0')
    expect(manager.getVersion()).toBe('2.0.0')
  })

  it('should provide cache statistics', () => {
    const stats = manager.getCacheStats()
    expect(stats).toHaveProperty('size')
    expect(stats).toHaveProperty('items')
  })
})

