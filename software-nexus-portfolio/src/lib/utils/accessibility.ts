/**
 * Accessibility utilities and labels for the Software Nexus Portfolio.
 */

export type AccessibilityShortcut = {
  key: string
  description: string
}

export const ZONE_LABELS: Record<number, string> = {
  0: 'Entry Portal',
  1: 'Central Nexus',
  2: 'Systems Tower',
  3: 'Interface Sanctum',
  4: 'Simulation Forge',
  5: 'Knowledge Core',
  6: 'Resume Codex'
}

export function getZoneLabel(index: number): string {
  return ZONE_LABELS[index] || `Zone ${index + 1}`
}

export function getSceneAriaLabel(): string {
  return 'Software Nexus 3D scene. Use keyboard or controls to navigate the world.'
}

export function getSceneAriaDescription(): string {
  return [
    'This is an interactive 3D environment with multiple zones.',
    'Use arrow keys or Page Up/Down to move between zones.',
    'Use Home or End to jump to the start or end of the journey.',
    'Use the on-screen navigation controls for accessible navigation.'
  ].join(' ')
}

export function getKeyboardShortcuts(): AccessibilityShortcut[] {
  return [
    { key: 'Arrow Up / Page Up', description: 'Move to previous zone' },
    { key: 'Arrow Down / Page Down', description: 'Move to next zone' },
    { key: 'Home', description: 'Jump to the first zone' },
    { key: 'End', description: 'Jump to the last zone' }
  ]
}

export function formatShortcutList(shortcuts: AccessibilityShortcut[]): string {
  return shortcuts.map((shortcut) => `${shortcut.key}: ${shortcut.description}`).join('; ')
}

export function normalizeReducedMotionPreference(
  prefersReducedMotion: boolean,
  override: boolean | null
): boolean {
  if (override === null) return prefersReducedMotion
  return override
}

