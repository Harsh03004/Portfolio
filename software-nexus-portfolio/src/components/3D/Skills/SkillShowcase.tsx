import { SkillField } from './SkillField'
import { sampleSkills } from '@/data/sampleSkills'

/**
 * Small harness component to render skill nodes in the main world.
 * Use this as a simple visual test for Task 6.1.
 */
export function SkillShowcase() {
  // Using sampleSkills for Task 6.1 validation
  return <SkillField skills={sampleSkills} />
}
