import { Vector3 } from 'three';
import { WorldZone } from './types';

// World Layout Constants
export const WORLD_ZONES: Record<WorldZone, { position: Vector3; radius: number }> = {
  'entry-portal': { position: new Vector3(0, 0, 10), radius: 5 },
  'central-nexus': { position: new Vector3(0, 0, 0), radius: 8 },
  'systems-tower': { position: new Vector3(-15, 5, -10), radius: 6 },
  'interface-sanctum': { position: new Vector3(15, 0, -10), radius: 6 },
  'simulation-forge': { position: new Vector3(0, 8, -20), radius: 6 },
  'knowledge-core': { position: new Vector3(-10, -5, -30), radius: 5 },
  'resume-codex': { position: new Vector3(10, -5, -30), radius: 5 },
};

// Camera Path Constants
export const CAMERA_PATH = [
  { position: new Vector3(0, 2, 15), target: new Vector3(0, 0, 10) }, // Entry
  { position: new Vector3(0, 5, 8), target: new Vector3(0, 0, 0) },   // Central Nexus
  { position: new Vector3(-8, 8, 5), target: new Vector3(-15, 5, -10) }, // Systems Tower
  { position: new Vector3(8, 3, 5), target: new Vector3(15, 0, -10) },   // Interface Sanctum
  { position: new Vector3(0, 12, -5), target: new Vector3(0, 8, -20) },  // Simulation Forge
  { position: new Vector3(-5, 0, -15), target: new Vector3(-10, -5, -30) }, // Knowledge Core
  { position: new Vector3(5, 0, -15), target: new Vector3(10, -5, -30) },   // Resume Codex
];

// Performance Constants
export const PERFORMANCE_SETTINGS = {
  high: {
    shadowMapSize: 2048,
    antialias: true,
    pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1,
    maxLights: 8,
  },
  medium: {
    shadowMapSize: 1024,
    antialias: true,
    pixelRatio: 1,
    maxLights: 4,
  },
  low: {
    shadowMapSize: 512,
    antialias: false,
    pixelRatio: 1,
    maxLights: 2,
  },
};

// Theme Constants
export const FANTASY_TECH_THEME = {
  colors: {
    primary: '#00ffff',      // Cyan tech glow
    secondary: '#ff6b9d',    // Magical pink
    accent: '#ffd700',       // Golden runes
    background: '#0a0a0f',   // Deep space
    surface: '#1a1a2e',      // Dark surface
  },
  materials: {
    hologram: {
      transparent: true,
      opacity: 0.7,
      emissive: '#00ffff',
      emissiveIntensity: 0.3,
    },
    rune: {
      emissive: '#ffd700',
      emissiveIntensity: 0.5,
    },
    crystal: {
      transparent: true,
      opacity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
    },
  },
};

// Animation Constants
export const ANIMATION_DURATIONS = {
  cameraTransition: 2.0,
  portalEntry: 1.5,
  portalExit: 1.2,
  hoverEffect: 0.3,
  zoneTransition: 1.8,
};

// Interaction Constants
export const INTERACTION_SETTINGS = {
  hoverDistance: 2,
  clickDistance: 1.5,
  scrollSensitivity: 0.001,
  touchSensitivity: 0.002,
};