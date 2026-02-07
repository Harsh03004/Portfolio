# Quick Start Checklist

## 🚀 Getting Started

### Initial Setup (One-time)
- [ ] Clone/open project directory
- [ ] Verify Node.js is installed: `node --version`
- [ ] Install dependencies: `npm install`
- [ ] Create `.env` file if needed
- [ ] Verify build: `npm run build`

### Daily Workflow
- [ ] Open terminal in project directory
- [ ] Start dev server: `npm run dev`
- [ ] Open browser: `http://localhost:5173`
- [ ] Open VSCode or IDE
- [ ] Check `DEVELOPER_GUIDE.md` for reference
- [ ] Open DevTools (F12) for debugging

---

## 📚 Documentation to Read

### First Time
- [ ] `README.md` - Project overview
- [ ] `requirements.md` - What needs to be built
- [ ] `design.md` - How it should work

### Before Each Task
- [ ] `tasks.md` - Task breakdown
- [ ] Relevant implementation doc (e.g., `TASK_5_2_IMPLEMENTATION.md`)
- [ ] `DEVELOPER_GUIDE.md` - Code patterns

### Progress Tracking
- [ ] `progress.md` - Current status
- [ ] `PROJECT_STATUS.md` - Full project state
- [ ] `CHANGELOG.md` - Version history

---

## 💻 Development Commands

### Regular Workflow
```bash
npm run dev       # Start development server
npm run build     # Full production build
npm run lint      # Check code style
npm run preview   # Preview production build
```

### Debugging
```bash
# Use React DevTools extension
# Use Three.js Inspector (in DebugPanel)
# Check console.log output
# Use browser DevTools (F12)
```

---

## 📂 Key Directories

### Source Code
- `src/components/3D/ProjectScene/` - Latest work (Task 5.2-5.3)
- `src/components/3D/World/` - Main world
- `src/hooks/` - Custom React hooks
- `src/lib/managers/` - Business logic
- `src/data/` - Project data

### Configuration
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Vite config
- `eslint.config.js` - Linter config
- `package.json` - Dependencies

### Documentation
- `.kiro/specs/` - All documentation
- Root `*.md` files - Project docs

---

## 🎯 Current Task Status

### Completed ✅
- [x] Task 1: Project Foundation
- [x] Tasks 2.1-2.3: Core 3D Scene
- [x] Tasks 3.1-3.3: World Geometry
- [x] Tasks 4.1-4.3: Interaction & Navigation
- [x] Task 5.1: Portal Framework
- [x] Task 5.2: Project Interior Scene System ✨
- [x] Task 5.3: Engineering Narrative Display ✨

### Next ⏳
- [ ] Task 6.1: Skill Node Creation
- [ ] Task 6.2: Dependency Visualization
- [ ] Task 6.3: Interactive Skill Demonstrations

---

## 🔍 Code Review Checklist

Before committing code:
- [ ] No TypeScript errors: `npm run build`
- [ ] No ESLint warnings: `npm run lint`
- [ ] Components render without crashing
- [ ] Interactive elements work correctly
- [ ] Animations are smooth (60fps)
- [ ] Theme colors applied correctly
- [ ] No console errors
- [ ] Documentation updated
- [ ] Tasks/Progress files updated

---

## 🧪 Testing Your Work

### Manual Testing
1. Start dev server: `npm run dev`
2. Open http://localhost:5173
3. Test scroll navigation
4. Click zone markers
5. Enter project portals
6. Explore all visualizations
7. Check animations smooth
8. Verify theme colors

### Quick Validation
```bash
npm run build  # Should complete without errors
npm run lint   # Should have no errors
```

---

## 🐛 Troubleshooting

### Dev Server Won't Start
```bash
# Kill existing process
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Try again
npm run dev
```

### Build Fails
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run build
```

### Components Not Rendering
- Check console for errors (F12)
- Verify project data structure
- Check theme colors are valid
- Ensure components are exported in index.ts

---

## 📋 Component Template

When creating new components:

```typescript
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Text } from '@react-three/drei'
import { ProjectData } from '@/lib/types'

interface ComponentProps {
  project: ProjectData
  position?: [number, number, number]
  visible?: boolean
}

export function MyComponent({
  project,
  position = [0, 0, 0],
  visible = true
}: ComponentProps) {
  const groupRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Animation logic
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={position}>
      {/* Your 3D content */}
    </group>
  )
}
```

---

## 🎨 Common UI Patterns

### Interactive Element
```typescript
import Interactive from '@/components/3D/Interactive'

<Interactive
  onClick={() => {}}
  onHoverIn={() => {}}
  onHoverOut={() => {}}
>
  {/* Content */}
</Interactive>
```

### Text Overlay
```typescript
<Text
  position={[0, 0, 0]}
  fontSize={0.5}
  color={project.theme.accentColor}
  anchorX="center"
  anchorY="middle"
>
  Text Content
</Text>
```

### Card Background
```typescript
import { RoundedBox } from '@react-three/drei'

<RoundedBox args={[width, height, depth]} radius={0.1} smoothness={4}>
  <meshStandardMaterial
    color={project.theme.primaryColor}
    opacity={0.2}
    transparent
  />
</RoundedBox>
```

---

## 🎬 Animation Patterns

### Pulsing
```typescript
const scale = 1 + Math.sin(clock.elapsedTime * 0.5) * 0.02
```

### Rotating
```typescript
meshRef.current.rotation.y += 0.01
```

### Smooth Interpolation
```typescript
value += (target - value) * 0.1
```

---

## 📊 File Statistics

### Code Metrics
```
Total Components: 45+
Total Lines: 7,500+
Files: 80+
Hooks: 7
Managers: 6
```

### Latest Session
```
New Components: 9
New Lines: ~1,500
Build Errors: 0
Type Errors: 0
```

---

## ✅ Pre-Commit Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Code is formatted
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Build is clean

---

## 🚀 Deploy Checklist

- [ ] All tests passing
- [ ] Production build successful
- [ ] No warnings in build
- [ ] Performance optimized
- [ ] Documentation complete
- [ ] Version bumped in package.json
- [ ] CHANGELOG updated

---

## 📞 Quick Reference Links

### Project Files
- Main App: `src/App.tsx`
- World: `src/components/3D/World/World.tsx`
- Project Scene: `src/components/3D/ProjectScene/ProjectInterior.tsx`
- Types: `src/lib/types.ts`
- Data: `src/data/sampleProjects.ts`

### Documentation
- Tasks: `.kiro/specs/tasks.md`
- Progress: `.kiro/specs/progress.md`
- Status: `.kiro/specs/PROJECT_STATUS.md`
- Guide: `.kiro/specs/DEVELOPER_GUIDE.md`

---

## 🎯 Common Tasks

### Add New Project
1. Update `src/data/sampleProjects.ts`
2. Add theme colors to project object
3. Fill engineering story and decisions
4. Add to `sampleProjects` array

### Modify Theme
1. Edit `project.theme` in `sampleProjects.ts`
2. Components automatically use theme colors
3. Test with dev server
4. Update CHANGELOG

### Fix Bug
1. Locate error in console
2. Find component source
3. Fix and save
4. Dev server auto-reloads
5. Verify fix works

---

## 🏃 Speed Tips

### Faster Development
- Use `npm run dev` for live reload
- Keep VSCode and browser side-by-side
- Use React DevTools extension
- Check console frequently
- Commit small, focused changes

### Performance
- Build takes ~30 seconds
- Dev reload takes ~2 seconds
- Hot module reload works great
- CSS changes reload instantly

---

## 🎓 Learning Resources

### Three.js / React Three Fiber
- Official docs: threejs.org, docs.pmnd.rs
- Common patterns in `DEVELOPER_GUIDE.md`
- Examples in existing components

### TypeScript
- Type definitions: `src/lib/types.ts`
- Interface examples throughout codebase
- VSCode IntelliSense helps

### React
- Hooks: `useFrame`, `useRef`, `useThree`
- Components: Functional with hooks
- State: useFrame for animations

---

**Last Updated**: February 6, 2026
**Status**: ✅ Ready to work
**Next Task**: Task 6.1 - Skill Node Creation

Happy coding! 🚀

