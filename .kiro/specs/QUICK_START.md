# Quick Start Guide - Software Nexus Portfolio

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern browser with WebGL support
- Git for version control

### First-Time Setup

```bash
# Clone or navigate to project
cd D:\Files\Projects\Portfolio\software-nexus-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# Navigate to http://localhost:5173
```

### Development Commands

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Run tests
npm run test
```

## 📊 Current Status

- **Overall Progress**: 78.6% (33/42 tasks)
- **Current Version**: 0.8.0
- **Last Updated**: February 7, 2026

### Completed Phases
- ✅ Phase 1-2: Foundation & Core 3D
- ✅ Phase 3-4: World Geometry & Interaction
- ✅ Phase 5-6: Project Portals & Skills
- ✅ Phase 7-8: Content Management & Performance

### Next Priorities
- 🔄 Phase 9: Accessibility & Fallback Systems
- ⏳ Phase 10: Engineering Mode & Debug Tools
- ⏳ Phase 11-14: Audio, Testing, Deployment

## 📁 Key Files and Directories

### Main App Files
- `src/App.tsx` - Main app component
- `src/main.tsx` - App entry point
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration

### Core Systems
- `src/lib/managers/` - State and data management
  - `NavigationStateManager.ts` - Navigation state machine
  - `ScrollManager.ts` - Scroll handling
  - `InteractionManager.ts` - Click/hover interactions
  - `PortalManager.ts` - Project portal system
  - `AudioManager.ts` - Sound effects
  - `ContentManager.ts` - Content validation & caching
  - `AssetManager.ts` - Asset loading & caching

- `src/lib/utils/` - Utility functions
  - `performance.ts` - Performance monitoring
  - `renderingOptimization.ts` - LOD, culling, instancing
  - `pdfGenerator.ts` - PDF resume generation

### Components
- `src/components/3D/` - 3D scene components
  - `World.tsx` - Main world scene
  - `CameraRig.tsx` - Camera control
  - `Zones/` - Zone-specific geometries

- `src/components/UI/` - 2D UI components
  - `ResumeCodex.tsx` - Resume display
  - `KnowledgeCore.tsx` - Research showcase
  - `DebugPanel.tsx` - Developer tools

### Hooks
- `src/hooks/` - Custom React hooks
  - `useSceneSetup.ts` - 3D scene setup
  - `useNavigationState.ts` - Navigation state
  - `useContentManager.ts` - Content management
  - `usePerformanceMonitor.ts` - Performance tracking

### Data
- `src/data/` - Sample data
  - `samplePortfolioContent.ts` - Complete portfolio data
  - `sampleProjects.ts` - 3 sample projects
  - `sampleSkills.ts` - 12+ sample skills

## 🎯 Task: Continue with Task 9.1 (Accessibility)

### What Needs to Be Done

Task 9.1 requires implementing accessibility infrastructure:

1. **Semantic HTML Structure**
   - Use proper HTML elements (nav, main, section, article)
   - Logical heading hierarchy (h1, h2, h3)
   - Form elements with labels

2. **ARIA Labels and Descriptions**
   - aria-label for interactive 3D elements
   - aria-describedby for complex descriptions
   - role attributes for non-semantic elements
   - aria-live regions for dynamic updates

3. **Keyboard Navigation**
   - Tab order for all interactive elements
   - Enter/Space to activate buttons
   - Arrow keys for navigation
   - Escape to close modals/dialogs

4. **Reduced Motion Support**
   - prefers-reduced-motion CSS media query
   - Conditional animation state
   - Accessible alternatives for animations

### Files to Create/Modify

**New Files:**
- `src/components/UI/AccessibilityPanel.tsx` - Accessibility controls
- `src/lib/utils/accessibility.ts` - Accessibility utilities
- `src/hooks/useAccessibility.ts` - Accessibility hook

**Modified Files:**
- `src/App.tsx` - Add accessibility wrapper
- `src/components/3D/Scene.tsx` - Add ARIA labels
- `src/components/UI/DebugPanel.tsx` - Add accessibility toggle
- `src/index.css` - Add reduced motion queries

### References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

## 🔍 Code Style Guidelines

### TypeScript
- Use strict mode (`strict: true` in tsconfig)
- Type all function parameters and returns
- Use interfaces over types for public APIs
- Organize files by feature, not by type

### React Components
- Functional components with hooks
- Props interface defined above component
- JSX formatting with proper indentation
- Extract components when logic exceeds 200 lines

### Styling
- CSS Modules for component styles
- BEM naming convention within components
- Consistent spacing and color variables
- Mobile-first responsive design

### Testing
- Test file co-located with source
- .test.ts or .test.tsx suffix
- Arrange-Act-Assert pattern
- Test behavior, not implementation

## 🐛 Debugging Tips

### Performance Issues
1. Open DevTools Performance tab
2. Record interaction
3. Check for long tasks (red sections)
4. Use Performance Monitor hook in app
5. Check renderingOptimization utilities

### 3D Rendering Issues
1. Check WebGL capabilities with `checkWebGLCapabilities()`
2. Review browser console for WebGL errors
3. Toggle quality with `QualityAdjuster`
4. Use debug panel to inspect scene

### State Issues
1. Use React DevTools to inspect component tree
2. Check NavigationStateManager logs
3. Verify state transitions match machine definition
4. Review action dispatches in dev tools

### Content Issues
1. Use ContentValidator to check data
2. Review ContentSanitizer output
3. Check cache stats with `AssetManager`
4. Verify TypeScript types match data

## 📚 Documentation References

- Design Document: `.kiro/specs/software-nexus-portfolio/design.md`
- Requirements: `.kiro/specs/software-nexus-portfolio/requirements.md`
- Tasks: `.kiro/specs/software-nexus-portfolio/tasks.md`
- Progress: `.kiro/specs/software-nexus-portfolio/progress.md`
- Implementation Summary: `IMPLEMENTATION_SUMMARY.md`

## ✅ Pre-Commit Checklist

Before committing code:
- [ ] Run `npm run type-check` - no errors
- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run test` - all tests pass
- [ ] Code follows style guidelines
- [ ] New features have test coverage
- [ ] No console errors in dev mode
- [ ] Commit message is descriptive

## 🤝 Questions or Issues?

Refer to:
1. Progress document for current status
2. Tasks document for requirements
3. Code comments for implementation details
4. Test files for usage examples
5. Component props interfaces for API

## 🎉 Good Luck!

You're taking over a well-structured, 78% complete project. The foundation is solid,
the architecture is clean, and the remaining work is straightforward. Focus on:
- Following established patterns
- Writing tests for new features
- Maintaining code quality
- Documenting changes in progress.md

Happy coding! 🚀

