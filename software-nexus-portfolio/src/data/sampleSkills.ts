import { Vector3 } from 'three'
import { SkillNode } from '@/lib/types'

const baseInteraction = {
  hoverEffect: 'glow',
  clickAction: 'inspect'
}

export const sampleSkills: SkillNode[] = [
  {
    technology: 'Node.js',
    category: 'backend',
    proficiencyLevel: 0.85,
    projectsUsed: ['ecommerce-platform', 'realtime-analytics-dashboard'],
    dependencies: ['TypeScript', 'PostgreSQL'],
    usageHighlights: ['API orchestration', 'Streaming ingest pipelines'],
    progression: [
      { label: 'Start', level: 0.35, year: '2019' },
      { label: 'Scale', level: 0.6, year: '2021' },
      { label: 'Now', level: 0.85, year: '2024' }
    ],
    visualRepresentation: {
      model: 'skill-crystal',
      position: new Vector3(0, 0, 0),
      connections: [],
      interactionBehavior: baseInteraction
    }
  },
  {
    technology: 'PostgreSQL',
    category: 'database',
    proficiencyLevel: 0.8,
    projectsUsed: ['ecommerce-platform'],
    dependencies: ['SQL'],
    usageHighlights: ['Schema design', 'Query tuning for analytics'],
    progression: [
      { label: 'Start', level: 0.3, year: '2018' },
      { label: 'Apply', level: 0.55, year: '2020' },
      { label: 'Now', level: 0.8, year: '2024' }
    ],
    visualRepresentation: {
      model: 'skill-crystal',
      position: new Vector3(0, 0, 0),
      connections: [],
      interactionBehavior: baseInteraction
    }
  },
  {
    technology: 'React',
    category: 'frontend',
    proficiencyLevel: 0.9,
    projectsUsed: ['ecommerce-platform', 'realtime-analytics-dashboard'],
    dependencies: ['TypeScript'],
    labelColor: '#ffffff',
    usageHighlights: ['Component systems', 'Realtime dashboard UX'],
    progression: [
      { label: 'Start', level: 0.4, year: '2019' },
      { label: 'Scale', level: 0.7, year: '2022' },
      { label: 'Now', level: 0.9, year: '2024' }
    ],
    visualRepresentation: {
      model: 'skill-crystal',
      position: new Vector3(0, 0, 0),
      connections: [],
      interactionBehavior: baseInteraction
    }
  },
  {
    technology: 'TypeScript',
    category: 'frontend',
    proficiencyLevel: 0.9,
    projectsUsed: ['ecommerce-platform', 'realtime-analytics-dashboard'],
    dependencies: ['JavaScript'],
    labelColor: '#ffffff',
    usageHighlights: ['Type-safe APIs', 'Shared domain models'],
    progression: [
      { label: 'Start', level: 0.35, year: '2020' },
      { label: 'Apply', level: 0.7, year: '2022' },
      { label: 'Now', level: 0.9, year: '2024' }
    ],
    visualRepresentation: {
      model: 'skill-crystal',
      position: new Vector3(0, 0, 0),
      connections: [],
      interactionBehavior: baseInteraction
    }
  },
  {
    technology: 'Python',
    category: 'algorithms',
    proficiencyLevel: 0.8,
    projectsUsed: ['ai-recommendation-engine'],
    dependencies: ['NumPy'],
    usageHighlights: ['Model experimentation', 'Feature pipelines'],
    progression: [
      { label: 'Start', level: 0.35, year: '2017' },
      { label: 'Apply', level: 0.6, year: '2020' },
      { label: 'Now', level: 0.8, year: '2024' }
    ],
    visualRepresentation: {
      model: 'skill-crystal',
      position: new Vector3(0, 0, 0),
      connections: [],
      interactionBehavior: baseInteraction
    }
  },
  {
    technology: 'TensorFlow',
    category: 'algorithms',
    proficiencyLevel: 0.7,
    projectsUsed: ['ai-recommendation-engine'],
    dependencies: ['Python'],
    usageHighlights: ['Model training', 'Deployment pipelines'],
    progression: [
      { label: 'Start', level: 0.25, year: '2019' },
      { label: 'Apply', level: 0.55, year: '2022' },
      { label: 'Now', level: 0.7, year: '2024' }
    ],
    visualRepresentation: {
      model: 'skill-crystal',
      position: new Vector3(0, 0, 0),
      connections: [],
      interactionBehavior: baseInteraction
    }
  },
  {
    technology: 'Docker',
    category: 'tools',
    proficiencyLevel: 0.75,
    projectsUsed: ['ai-recommendation-engine'],
    dependencies: ['Linux'],
    usageHighlights: ['Local dev stacks', 'Service isolation'],
    progression: [
      { label: 'Start', level: 0.3, year: '2019' },
      { label: 'Apply', level: 0.6, year: '2022' },
      { label: 'Now', level: 0.75, year: '2024' }
    ],
    visualRepresentation: {
      model: 'skill-crystal',
      position: new Vector3(0, 0, 0),
      connections: [],
      interactionBehavior: baseInteraction
    }
  },
  {
    technology: 'AWS',
    category: 'cloud',
    proficiencyLevel: 0.7,
    projectsUsed: ['ecommerce-platform'],
    dependencies: ['Networking'],
    usageHighlights: ['Compute scaling', 'Edge delivery'],
    progression: [
      { label: 'Start', level: 0.25, year: '2020' },
      { label: 'Apply', level: 0.5, year: '2022' },
      { label: 'Now', level: 0.7, year: '2024' }
    ],
    visualRepresentation: {
      model: 'skill-crystal',
      position: new Vector3(0, 0, 0),
      connections: [],
      interactionBehavior: baseInteraction
    }
  }
]
