# Developer Quick Reference Guide

## 🚀 Getting Started

### Setup
```bash
cd D:\Files\Projects\Portfolio\software-nexus-portfolio
npm install  # Already done - skip if dependencies installed
npm run dev  # Start dev server
# Navigate to http://localhost:5173
```

### Build & Test
```bash
npm run build      # Full build with TypeScript checking
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

---

## 📁 Project Structure

### Core Directories
```
src/
├── components/
│   ├── 3D/
│   │   ├── World/         (Main world geometry)
│   │   ├── Zones/         (Backend, Frontend, Algorithm zones)
│   │   ├── Effects/       (Particles, glows, animations)
│   │   ├── Portal/        (Project portals)
│   │   ├── ProjectScene/  (Project interior visualizations) ⭐
│   │   └── ...
│   └── UI/
│       ├── DebugPanel
│       └── ScrollIndicator
├── hooks/          (React custom hooks)
├── lib/            (Core logic and managers)
│   ├── managers/   (Portal, Navigation, Audio, etc.)
│   ├── controllers/ (Camera control)
│   ├── types.ts    (TypeScript definitions)
│   └── constants.ts
├── data/           (Sample data)
├── assets/         (Models, textures, audio)
└── App.tsx         (Main application)
```

### Key Files to Know
- `App.tsx` - Application entry point
- `components/3D/World/World.tsx` - Main world container
- `components/3D/ProjectScene/ProjectInterior.tsx` - Project visualization ⭐
- `hooks/useNavigationState.ts` - Navigation state management
- `lib/managers/PortalManager.ts` - Portal lifecycle
- `lib/constants.ts` - World zones and configuration

---

## 🎯 ProjectScene Components (Task 5.2-5.3)

### Component Hierarchy
```
ProjectInterior
├── ProjectSceneContainer (Lighting Setup)
├── ArchitectureDiagram (Technical Visualization)
├── DataFlowAnimation (Performance Visualization)
├── PerformanceMetrics (Metrics Display)
├── EngineeringNarrative (Story)
├── DecisionExplanation (Interactive Cards)
├── TradeoffAnalysis (Pros/Cons)
└── TechStackContext (Technologies)
```

### Quick Import Pattern
```typescript
import {
  ProjectInterior,
  ArchitectureDiagram,
  EngineeringNarrative,
  DecisionExplanation,
  TradeoffAnalysis,
  TechStackContext
} from '@/components/3D/ProjectScene'
```

### Common Props
```typescript
// All narrative components accept
interface NarrativeProps {
  project: ProjectData      // The project being displayed
  position?: [number, number, number]  // 3D position
  visible?: boolean         // Visibility toggle
}
```

---

## 🎨 Theming System

### Project Themes
```typescript
const projectTheme = {
  primaryColor: '#ff6b9d',      // Main color (e.g., pink for e-commerce)
  accentColor: '#ff8fab',       // Accent color
  ambientLight: '#ffb3c6',      // Ambient light tint
  particleColor: '#ff6b9d'      // Particle system color
}
```

### Using Theme Colors
```typescript
// In components
<meshStandardMaterial
  color={project.theme.primaryColor}
  emissive={project.theme.accentColor}
  emissiveIntensity={0.5}
/>

<Text color={project.theme.accentColor}>Title</Text>
```

---

## 🔧 Common Patterns

### Interactive Elements
```typescript
import Interactive from '@/components/3D/Interactive'

<Interactive
  onClick={() => console.log('Clicked')}
  onHoverIn={() => console.log('Hovered')}
  onHoverOut={() => console.log('Unhovered')}
  hoverScale={1.1}
  hoverColor="#ff6b9d"
>
  {/* Content */}
</Interactive>
```

### Text Rendering
```typescript
import { Text } from '@react-three/drei'

<Text
  position={[0, 0, 0]}
  fontSize={0.5}
  color="#ffffff"
  anchorX="center"
  anchorY="middle"
  maxWidth={10}
  textAlign="center"
>
  Text Content
</Text>
```

### 3D Boxes
```typescript
import { RoundedBox } from '@react-three/drei'

<RoundedBox args={[width, height, depth]} radius={0.1} smoothness={4}>
  <meshStandardMaterial
    color="#ff6b9d"
    opacity={0.2}
    transparent
  />
</RoundedBox>
```

### Animation Loop
```typescript
import { useFrame } from '@react-three/fiber'

useFrame(({ clock }) => {
  // Access elapsed time
  const time = clock.elapsedTime
  
  // Update ref-based objects
  if (meshRef.current) {
    meshRef.current.rotation.y += 0.01
  }
})
```

---

## 🎬 Animation Patterns

### Pulsing Effect
```typescript
useFrame(({ clock }) => {
  const scale = 1 + Math.sin(clock.elapsedTime * speed) * amplitude
  groupRef.current.scale.set(scale, scale, scale)
})
```

### Smooth Interpolation
```typescript
useFrame(() => {
  const targetValue = desiredValue
  const currentValue = 5.0
  currentValue += (targetValue - currentValue) * 0.1  // Smooth interpolation
})
```

### Orbital Motion
```typescript
useFrame(({ clock }) => {
  const angle = clock.elapsedTime * angularVelocity
  const radius = 5
  meshRef.current.position.x = Math.cos(angle) * radius
  meshRef.current.position.z = Math.sin(angle) * radius
})
```

---

## 📊 ProjectData Structure

```typescript
interface ProjectData {
  id: string
  title: string
  domain: ProjectDomain
  theme: ThemeConfig
  
  // Visualizations
  architecture: ArchitectureDiagram
  dataFlow: DataFlowAnimation
  performance: PerformanceMetrics
  
  // Stories
  engineeringStory: EngineeringNarrative
  designDecisions: DesignDecision[]
  tradeoffs: TradeoffAnalysis[]
  challenges: ChallengeStory[]
  techStack: TechStackContext
}

interface EngineeringNarrative {
  problemStatement: string
  solutionApproach: string
  resultsAndImpact: string
  lessonsLearned: string
}

interface DesignDecision {
  decision: string
  alternatives: string[]
  reasoning: string
}

interface TradeoffAnalysis {
  tradeoff: string
  pros: string[]
  cons: string[]
}
```

---

## 🧪 Testing Components

### Component Testing Pattern
```typescript
// In ProjectScene components, always test:
1. Renders without crashing
2. Accepts all props correctly
3. Responds to visibility toggle
4. Applies theme colors
5. Interactive elements work (click, hover)
6. Animations loop smoothly
7. Text renders properly
8. Layout positions correctly
```

### Testing Visibility
```typescript
<EngineeringNarrative
  project={projectData}
  visible={isInPortal}  // Toggles rendering
  position={[0, 3, -50]}
/>
```

---

## 🐛 Common Issues & Solutions

### Issue: Text not visible
**Solution**: Check anchoring and position
```typescript
// Wrong: text is at world origin
<Text position={[0, 0, 0]}>Text</Text>

// Correct: centered in view
<Text
  position={[0, 0, 0]}
  anchorX="center"
  anchorY="middle"
>
  Text
</Text>
```

### Issue: Interactive elements not clickable
**Solution**: Ensure Interactive wrapper is used
```typescript
// Wrap your geometry in Interactive
<Interactive onClick={handleClick}>
  <mesh>
    <boxGeometry />
  </mesh>
</Interactive>
```

### Issue: Performance lag
**Solution**: Check object count and use LOD
- Reduce particle count
- Use instanced rendering
- Implement frustum culling
- Profile with React DevTools

---

## 📚 Sample Project Data

Located in: `src/data/sampleProjects.ts`

Three projects included:
1. **E-Commerce Platform** (Pink #ff6b9d)
2. **AI Recommendation Engine** (Purple #9d4edd)
3. **Real-Time Analytics Dashboard** (Green #00ff88)

To add a new project, follow the ProjectData interface structure.

---

## 🎯 Next Task: Task 6.1 - Skill Nodes

### What to Build
1. `SkillNode.tsx` - 3D skill representations
2. `SkillCategory.tsx` - Zone-based categorization
3. `ProficiencyVisualizer.tsx` - Skill level indicators
4. `SkillDependency.tsx` - Connections between skills

### Key Concepts
- Skills positioned in world zones
- Interactive hover to show connections
- Proficiency levels shown through visual properties
- Links to projects that use the skill

### Positioning Guide
```
Central Nexus Area:
- Backend Skills (Systems Tower area)
- Frontend Skills (Interface Sanctum area)
- Algorithm Skills (Simulation Forge area)
```

---

## 🔗 Useful Links

### Documentation Files
- `progress.md` - Current progress status
- `tasks.md` - Full task breakdown
- `requirements.md` - Project requirements
- `design.md` - Design specifications
- `TASK_5_2_IMPLEMENTATION.md` - Task 5.2 details
- `TASK_5_3_IMPLEMENTATION.md` - Task 5.3 details

### Key Source Files
- `/components/3D/ProjectScene/` - All narrative components
- `/lib/types.ts` - Type definitions
- `/lib/constants.ts` - World configuration
- `/hooks/useNavigationState.ts` - Navigation logic

---

## ✅ Before Committing

- [ ] All TypeScript errors resolved
- [ ] No console errors in dev server
- [ ] Components render without crashing
- [ ] Animations are smooth
- [ ] Interactive elements respond correctly
- [ ] Theme colors applied properly
- [ ] Documentation updated
- [ ] Tasks/progress files updated

---

## 🎓 Key Concepts

### React Three Fiber Patterns
- Use `useRef` for mutable 3D objects
- Use `useFrame` for per-frame updates
- Use `useThree` for scene access
- Import from both 'react' and '@react-three/fiber'

### Drei Components
- `Text` - Renders 3D text
- `RoundedBox` - Rounded cube geometry
- `Html` - Embed HTML in 3D (use sparingly)
- `Sphere`, `Torus`, `Box` - Basic geometries

### Three.js Concepts
- `Vector3` - Position/direction vectors
- `Color` - RGB color representation
- `Material` - Surface properties
- `Geometry` - Mesh shape
- `Mesh` - Geometry + Material
- `Group` - Container for multiple objects

---

**Last Updated**: February 6, 2026
**Current Task**: Task 6.1 - Skill Node Creation
**Status**: Ready for next phase ✅

