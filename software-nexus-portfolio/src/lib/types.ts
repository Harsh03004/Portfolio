import { Vector3 } from 'three';

// Core World Types
export interface WorldState {
  currentZone: WorldZone;
  cameraPosition: Vector3;
  cameraTarget: Vector3;
  scrollProgress: number;
  activeProject: ProjectData | null;
  userPreferences: UserPreferences;
  performanceMode: PerformanceMode;
}

export type WorldZone = 
  | 'entry-portal'
  | 'central-nexus'
  | 'systems-tower'
  | 'interface-sanctum'
  | 'simulation-forge'
  | 'knowledge-core'
  | 'resume-codex';

export type PerformanceMode = 'high' | 'medium' | 'low';

export interface UserPreferences {
  reducedMotion: boolean;
  audioEnabled: boolean;
  performanceMode: PerformanceMode;
  accessibilityMode: boolean;
}

// Project Data Types
export interface ProjectData {
  id: string;
  title: string;
  domain: ProjectDomain;
  theme: ThemeConfig;
  portalModel: string;
  architecture: ArchitectureDiagram;
  dataFlow: DataFlowAnimation;
  performance: PerformanceMetrics;
  challenges: ChallengeStory[];
  techStack: TechStackContext;
  engineeringStory: EngineeringNarrative;
  designDecisions: DesignDecision[];
  tradeoffs: TradeoffAnalysis[];
}

export type ProjectDomain = 'ecommerce' | 'fintech' | 'gaming' | 'saas' | 'ai-ml' | 'blockchain';

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  ambientLight: string;
  particleColor: string;
}

// Skills and Technology Types
export interface SkillNode {
  technology: string;
  category: SkillCategory;
  proficiencyLevel: number;
  projectsUsed: string[];
  dependencies: string[];
  visualRepresentation: SkillVisual;
  labelColor?: string;
  usageHighlights?: string[];
  progression?: SkillProgressionStep[];
}

export interface SkillProgressionStep {
  label: string;
  level: number;
  year?: string;
}

export type SkillCategory = 'backend' | 'frontend' | 'algorithms' | 'tools' | 'cloud' | 'database';

export interface SkillVisual {
  model: string;
  position: Vector3;
  connections: ConnectionLine[];
  interactionBehavior: InteractionConfig;
}

// Content Types
export interface PortfolioContent {
  personalInfo: PersonalInfo;
  projects: ProjectData[];
  skills: SkillNode[];
  experience: ExperienceData[];
  certifications: CertificationData[];
  researchShowcase: ResearchData[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
}

export interface EngineeringNarrative {
  problemStatement: string;
  solutionApproach: string;
  technicalChallenges: Challenge[];
  designDecisions: DesignDecision[];
  resultsAndImpact: string;
  lessonsLearned: string;
}

// Placeholder interfaces for complex types
export interface ArchitectureDiagram {
  components: any[];
  connections: any[];
}

export interface DataFlowAnimation {
  nodes: any[];
  flows: any[];
}

export interface PerformanceMetrics {
  loadTime: number;
  throughput: number;
  errorRate: number;
}

export interface ChallengeStory {
  challenge: string;
  solution: string;
  impact: string;
}

export interface TechStackContext {
  technologies: string[];
  reasoning: string;
}

export interface DesignDecision {
  decision: string;
  alternatives: string[];
  reasoning: string;
}

export interface TradeoffAnalysis {
  tradeoff: string;
  pros: string[];
  cons: string[];
}

export interface ExperienceData {
  company: string;
  role: string;
  duration: string;
  achievements: string[];
}

export interface CertificationData {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

export interface ResearchData {
  topic: string;
  methodology: string;
  findings: string[];
}

export interface Challenge {
  description: string;
  solution: string;
}

export interface ConnectionLine {
  target: string;
  strength: number;
}

export interface InteractionConfig {
  hoverEffect: string;
  clickAction: string;
}