# Skills Components

## Purpose
Implements Task 6.1 (Skill Node Creation and Positioning). Components in this folder render interactive 3D skill nodes placed around existing world zones.

## Components
- `SkillNode`: Single skill node with proficiency rings and label.
- `SkillField`: Places skill nodes around themed zones.
- `SkillShowcase`: Small harness that renders the skill field with sample data.

## Quick Try

```powershell
cd D:\Files\Projects\Portfolio\software-nexus-portfolio
npm run dev
```

Skill nodes appear near the Systems Tower, Interface Sanctum, and Simulation Forge zones.

## Usage

```tsx
import { SkillShowcase } from '@/components/3D/Skills'

<SkillShowcase />
```
