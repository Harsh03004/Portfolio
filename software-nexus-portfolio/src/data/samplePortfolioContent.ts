/**
 * Sample Portfolio Content
 * Complete portfolio data structure with all required content
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { PortfolioContent } from '@/lib/types'
import { sampleProjects } from './sampleProjects'
import { sampleSkills } from './sampleSkills'

export const samplePortfolioContent: PortfolioContent = {
  personalInfo: {
    name: 'Alex Chen',
    title: 'Senior Software Engineer | Systems Architect',
    bio: 'Full-stack engineer specialized in building scalable systems with focus on performance, reliability, and architectural excellence. Passionate about solving complex technical problems and mentoring other engineers.',
    location: 'San Francisco, CA',
    email: 'alex@example.com',
    linkedin: 'https://linkedin.com/in/alexchen',
    github: 'https://github.com/alexchen'
  },

  projects: sampleProjects,

  skills: sampleSkills,

  experience: [
    {
      company: 'TechCorp Industries',
      role: 'Senior Software Engineer',
      duration: '2022 - Present',
      achievements: [
        'Led architecture redesign of core payment system, reducing transaction latency by 40%',
        'Mentored team of 5 junior engineers, with 2 promoted to senior roles',
        'Designed and implemented microservices infrastructure using Kubernetes and Docker',
        'Established coding standards and best practices across 50+ person engineering team'
      ]
    },
    {
      company: 'StartupXYZ',
      role: 'Full-Stack Engineer',
      duration: '2020 - 2022',
      achievements: [
        'Built real-time analytics dashboard used by 10k+ users daily',
        'Reduced API response time from 800ms to 150ms through database optimization',
        'Implemented CI/CD pipeline using GitHub Actions, reducing deploy time from 30min to 5min',
        'Developed recommendation engine using TensorFlow, improving user engagement by 25%'
      ]
    },
    {
      company: 'CloudSoft Solutions',
      role: 'Backend Developer',
      duration: '2018 - 2020',
      achievements: [
        'Developed REST API handling 1M+ requests daily',
        'Implemented distributed caching strategy using Redis',
        'Designed PostgreSQL schema for complex e-commerce transactions',
        'Collaborated with DevOps to set up monitoring and alerting systems'
      ]
    },
    {
      company: 'DataFlow Inc.',
      role: 'Junior Software Engineer (Internship)',
      duration: '2017 - 2018',
      achievements: [
        'Built data processing pipeline for real-time ETL operations',
        'Contributed to open-source data libraries used by 100k+ developers',
        'Implemented unit and integration tests improving code coverage to 85%',
        'Presented findings on performance optimization at internal tech talks'
      ]
    }
  ],

  certifications: [
    {
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      date: '2023-06',
      credentialId: 'AWS-SAA-2023-06'
    },
    {
      name: 'Google Cloud Professional Cloud Architect',
      issuer: 'Google Cloud',
      date: '2023-03',
      credentialId: 'GCP-PCA-2023-03'
    },
    {
      name: 'Kubernetes Application Developer (CKAD)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022-09',
      credentialId: 'CKAD-2022-09'
    },
    {
      name: 'Oracle Cloud Infrastructure Developer Associate',
      issuer: 'Oracle',
      date: '2022-01',
      credentialId: 'OCI-DAS-2022-01'
    },
    {
      name: 'AWS Certified Developer - Associate',
      issuer: 'Amazon Web Services',
      date: '2021-05',
      credentialId: 'AWS-DAA-2021-05'
    }
  ],

  researchShowcase: [
    {
      topic: 'Optimization Techniques for Distributed Cache Systems',
      methodology: 'Empirical analysis with benchmarking on production workloads',
      findings: [
        'Implemented bloom filters reducing cache eviction overhead by 35%',
        'Developed predictive prefetching algorithm improving hit ratio by 22%',
        'Analyzed cache coherence strategies for multi-region deployments',
        'Published findings showing consistent improvements across 5 different cache backends'
      ]
    },
    {
      topic: 'Real-Time Data Processing at Scale',
      methodology: 'Architecture design with proof-of-concept implementation',
      findings: [
        'Designed streaming architecture handling 100k events per second',
        'Implemented late-binding event processing reducing memory by 40%',
        'Created comprehensive benchmarking suite for comparing frameworks',
        'Identified optimal partitioning strategy for geographically distributed data'
      ]
    },
    {
      topic: 'Building Fault-Tolerant Microservices',
      methodology: 'Literature review combined with system design experiments',
      findings: [
        'Documented patterns for circuit breaker implementation across languages',
        'Designed testing framework for chaos engineering scenarios',
        'Analyzed trade-offs between consistency models in distributed systems',
        'Created decision matrix for choosing appropriate failure recovery strategies'
      ]
    },
    {
      topic: 'Cost Optimization in Cloud Infrastructure',
      methodology: 'Financial analysis with infrastructure profiling',
      findings: [
        'Reduced cloud infrastructure costs by $200k annually through optimization',
        'Identified underutilized resources through automated analysis tools',
        'Implemented dynamic scaling policies matching traffic patterns',
        'Developed cost allocation model for internal chargebacks'
      ]
    }
  ]
}

/**
 * Content metadata for tracking and versioning
 */
export const contentMetadata = {
  version: '1.0.0',
  lastUpdated: '2026-02-07',
  createdAt: '2026-01-15',
  author: 'Alex Chen',
  contentHash: 'abc123def456', // Used for change detection
  sections: {
    personalInfo: true,
    projects: true,
    skills: true,
    experience: true,
    certifications: true,
    researchShowcase: true
  }
}

/**
 * Content schema for validation
 */
export const contentSchema = {
  personalInfo: {
    required: ['name', 'title', 'email'],
    optional: ['bio', 'location', 'linkedin', 'github']
  },
  projects: {
    required: ['id', 'title', 'domain', 'engineeringStory'],
    optional: ['challenges', 'designDecisions', 'tradeoffs']
  },
  skills: {
    required: ['technology', 'category', 'proficiencyLevel'],
    optional: ['labelColor', 'usageHighlights', 'progression']
  },
  experience: {
    required: ['company', 'role', 'duration'],
    optional: ['achievements']
  },
  certifications: {
    required: ['name', 'issuer', 'date', 'credentialId'],
    optional: []
  },
  researchShowcase: {
    required: ['topic', 'methodology', 'findings'],
    optional: []
  }
}

