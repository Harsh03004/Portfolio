import { ProjectData } from '@/lib/types'

/**
 * Sample project data for testing portal system
 */
export const sampleProjects: ProjectData[] = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    domain: 'ecommerce',
    theme: {
      primaryColor: '#ff6b9d',
      accentColor: '#ff8fab',
      ambientLight: '#ffb3c6',
      particleColor: '#ff6b9d'
    },
    portalModel: '',
    architecture: {
      components: [],
      connections: []
    },
    dataFlow: {
      nodes: [],
      flows: []
    },
    performance: {
      loadTime: 1.2,
      throughput: 10000,
      errorRate: 0.01
    },
    challenges: [
      {
        challenge: 'Handling high traffic during sales',
        solution: 'Implemented Redis caching and load balancing',
        impact: 'Reduced response time by 60%'
      }
    ],
    techStack: {
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS'],
      reasoning: 'Chosen for scalability and real-time performance'
    },
    engineeringStory: {
      problemStatement: 'Build a scalable e-commerce platform',
      solutionApproach: 'Microservices architecture with event-driven design',
      technicalChallenges: [],
      designDecisions: [],
      resultsAndImpact: 'Successfully handled 100k+ concurrent users',
      lessonsLearned: 'Importance of caching and database optimization'
    },
    designDecisions: [
      {
        decision: 'Use microservices architecture',
        alternatives: ['Monolithic', 'Serverless'],
        reasoning: 'Better scalability and team autonomy'
      }
    ],
    tradeoffs: [
      {
        tradeoff: 'Microservices vs Monolithic',
        pros: ['Scalability', 'Independent deployment'],
        cons: ['Complexity', 'Network overhead']
      }
    ]
  },
  {
    id: 'ai-recommendation-engine',
    title: 'AI Recommendation Engine',
    domain: 'ai-ml',
    theme: {
      primaryColor: '#9d4edd',
      accentColor: '#c77dff',
      ambientLight: '#e0aaff',
      particleColor: '#9d4edd'
    },
    portalModel: '',
    architecture: {
      components: [],
      connections: []
    },
    dataFlow: {
      nodes: [],
      flows: []
    },
    performance: {
      loadTime: 0.8,
      throughput: 50000,
      errorRate: 0.005
    },
    challenges: [
      {
        challenge: 'Cold start problem for new users',
        solution: 'Hybrid recommendation system with content-based fallback',
        impact: 'Improved new user engagement by 45%'
      }
    ],
    techStack: {
      technologies: ['Python', 'TensorFlow', 'FastAPI', 'MongoDB', 'Docker'],
      reasoning: 'Optimized for ML workloads and real-time inference'
    },
    engineeringStory: {
      problemStatement: 'Create personalized recommendations at scale',
      solutionApproach: 'Collaborative filtering with deep learning',
      technicalChallenges: [],
      designDecisions: [],
      resultsAndImpact: 'Increased user engagement by 35%',
      lessonsLearned: 'Balance between model complexity and latency'
    },
    designDecisions: [
      {
        decision: 'Use hybrid recommendation approach',
        alternatives: ['Pure collaborative filtering', 'Content-based only'],
        reasoning: 'Better handles cold start and provides diverse recommendations'
      }
    ],
    tradeoffs: [
      {
        tradeoff: 'Model complexity vs Latency',
        pros: ['Better accuracy', 'More personalized'],
        cons: ['Higher latency', 'More compute resources']
      }
    ]
  },
  {
    id: 'realtime-analytics-dashboard',
    title: 'Real-Time Analytics Dashboard',
    domain: 'saas',
    theme: {
      primaryColor: '#00ff88',
      accentColor: '#00ffaa',
      ambientLight: '#7fffd4',
      particleColor: '#00ff88'
    },
    portalModel: '',
    architecture: {
      components: [],
      connections: []
    },
    dataFlow: {
      nodes: [],
      flows: []
    },
    performance: {
      loadTime: 0.5,
      throughput: 100000,
      errorRate: 0.001
    },
    challenges: [
      {
        challenge: 'Processing millions of events per second',
        solution: 'Apache Kafka with stream processing',
        impact: 'Achieved sub-second latency for real-time insights'
      }
    ],
    techStack: {
      technologies: ['React', 'TypeScript', 'Kafka', 'ClickHouse', 'Kubernetes'],
      reasoning: 'Built for high-throughput real-time data processing'
    },
    engineeringStory: {
      problemStatement: 'Provide real-time insights from massive data streams',
      solutionApproach: 'Event-driven architecture with stream processing',
      technicalChallenges: [],
      designDecisions: [],
      resultsAndImpact: 'Enabled real-time decision making for 1000+ customers',
      lessonsLearned: 'Importance of data pipeline optimization'
    },
    designDecisions: [
      {
        decision: 'Use ClickHouse for analytics',
        alternatives: ['PostgreSQL', 'Elasticsearch'],
        reasoning: 'Superior performance for analytical queries'
      }
    ],
    tradeoffs: [
      {
        tradeoff: 'Real-time vs Batch processing',
        pros: ['Immediate insights', 'Better UX'],
        cons: ['Higher infrastructure cost', 'More complex']
      }
    ]
  }
]
