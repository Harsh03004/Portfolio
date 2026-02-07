/**
 * Knowledge Core - Research and Problem-Solving Showcase
 * Displays research methodology, problem-solving approach, and learning journey
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import React, { useState } from 'react'
import { ResearchData } from '@/lib/types'
import styles from './KnowledgeCore.module.css'

export interface KnowledgeCoreProps {
  researchShowcase: ResearchData[]
  onSelectTopic?: (topic: string) => void
}

/**
 * Research Card Component
 */
const ResearchCard: React.FC<{
  research: ResearchData
  isSelected: boolean
  onSelect: () => void
  index: number
}> = ({ research, isSelected, onSelect, index }) => {
  return (
    <div
      className={`${styles.researchCard} ${isSelected ? styles.researchCardSelected : ''}`}
      onClick={onSelect}
      style={{
        animation: `slideIn 0.6s ease-out ${index * 0.1}s both`
      }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</div>
        <h3>{research.topic}</h3>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.methodology}>
          <span className={styles.methodologyLabel}>Methodology</span>
          <p>{research.methodology}</p>
        </div>

        {isSelected && (
          <div className={styles.cardExpanded}>
            <h4>Key Findings</h4>
            <ul className={styles.findingsList}>
              {research.findings.map((finding, i) => (
                <li key={i} className={styles.findingItem}>
                  <span className={styles.findingNumber}>{i + 1}</span>
                  <span className={styles.findingText}>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.findingsCount}>
          {research.findings.length} Findings
        </span>
        <span className={styles.expandIndicator}>
          {isSelected ? '▼' : '▶'}
        </span>
      </div>
    </div>
  )
}

/**
 * Problem-Solving Approach Timeline
 */
const ProblemSolvingApproach: React.FC = () => {
  const approaches = [
    {
      step: 'Problem Analysis',
      description: 'Deep dive into root causes, constraints, and desired outcomes',
      icon: '🔍'
    },
    {
      step: 'Research & Learning',
      description: 'Investigate existing solutions, industry patterns, and best practices',
      icon: '📚'
    },
    {
      step: 'Solution Design',
      description: 'Architect solution considering trade-offs, scalability, and maintainability',
      icon: '🏗️'
    },
    {
      step: 'Implementation',
      description: 'Build solution with attention to code quality and testing',
      icon: '⚙️'
    },
    {
      step: 'Validation & Iteration',
      description: 'Measure results, gather feedback, optimize and refine',
      icon: '✔️'
    }
  ]

  return (
    <div className={styles.approachSection}>
      <h2>Problem-Solving Methodology</h2>
      <div className={styles.approachTimeline}>
        {approaches.map((approach, index) => (
          <div key={index} className={styles.approachStep}>
            <div className={styles.stepIcon}>{approach.icon}</div>
            <div className={styles.stepContent}>
              <h4>{approach.step}</h4>
              <p>{approach.description}</p>
            </div>
            {index < approaches.length - 1 && (
              <div className={styles.stepConnector}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Learning Journey Component
 */
const LearningJourney: React.FC = () => {
  const journey = [
    {
      year: '2017',
      milestone: 'Started journey with Python and data structures',
      technologies: ['Python', 'Data Structures', 'Algorithms']
    },
    {
      year: '2018',
      milestone: 'Mastered backend development and database optimization',
      technologies: ['Node.js', 'PostgreSQL', 'SQL']
    },
    {
      year: '2019',
      milestone: 'Specialized in full-stack development and API design',
      technologies: ['React', 'TypeScript', 'REST APIs', 'GraphQL']
    },
    {
      year: '2020',
      milestone: 'Focused on system design and cloud infrastructure',
      technologies: ['AWS', 'Kubernetes', 'Docker', 'Microservices']
    },
    {
      year: '2021',
      milestone: 'Advanced expertise in performance optimization',
      technologies: ['Performance Tuning', 'Caching', 'CDN']
    },
    {
      year: '2022-2024',
      milestone: 'Architecting scalable systems and mentoring teams',
      technologies: ['System Architecture', 'ML/AI', 'DevOps']
    }
  ]

  return (
    <div className={styles.journeySection}>
      <h2>Learning Journey & Specialization</h2>
      <div className={styles.journeyTimeline}>
        {journey.map((entry, index) => (
          <div
            key={index}
            className={styles.journeyEntry}
            style={{
              animation: `slideIn 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <div className={styles.journeyYear}>{entry.year}</div>
            <div className={styles.journeyContent}>
              <p className={styles.journeyMilestone}>{entry.milestone}</p>
              <div className={styles.journeyTechs}>
                {entry.technologies.map((tech, i) => (
                  <span key={i} className={styles.techTag}>{tech}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Main Knowledge Core Component
 */
export const KnowledgeCore: React.FC<KnowledgeCoreProps> = ({
  researchShowcase,
  onSelectTopic
}) => {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number | null>(null)

  const handleSelectTopic = (index: number) => {
    setSelectedTopicIndex(selectedTopicIndex === index ? null : index)
    onSelectTopic?.(researchShowcase[index].topic)
  }

  return (
    <div className={styles.knowledgeCore}>
      <div className={styles.container}>
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <h1>Knowledge Core</h1>
          <p>Research, Problem-Solving, and Learning Journey</p>
          <div className={styles.heroSubtitle}>
            Demonstrating technical thinking, methodology, and continuous learning
          </div>
        </div>

        {/* Problem-Solving Approach */}
        <ProblemSolvingApproach />

        {/* Research Showcase */}
        {researchShowcase.length > 0 && (
          <div className={styles.researchSection}>
            <h2>Research & Discoveries</h2>
            <p className={styles.researchIntro}>
              Deep dives into technical topics with empirical findings and practical applications
            </p>
            <div className={styles.researchGrid}>
              {researchShowcase.map((research, index) => (
                <ResearchCard
                  key={`${research.topic}-${index}`}
                  research={research}
                  isSelected={selectedTopicIndex === index}
                  onSelect={() => handleSelectTopic(index)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Learning Journey */}
        <LearningJourney />

        {/* Key Insights Section */}
        <div className={styles.insightsSection}>
          <h2>Core Insights</h2>
          <div className={styles.insightsGrid}>
            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>🧠</div>
              <h3>Systems Thinking</h3>
              <p>Approaching problems holistically, understanding interactions and trade-offs</p>
            </div>
            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>📊</div>
              <h3>Data-Driven Decisions</h3>
              <p>Making architectural choices based on measurements, benchmarks, and empirical results</p>
            </div>
            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>🔄</div>
              <h3>Iterative Learning</h3>
              <p>Continuously refining approach, learning from failures, and adapting to new challenges</p>
            </div>
            <div className={styles.insightCard}>
              <div className={styles.insightIcon}>🎯</div>
              <h3>Practical Application</h3>
              <p>Focusing on real-world problems and solutions that deliver measurable impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KnowledgeCore

