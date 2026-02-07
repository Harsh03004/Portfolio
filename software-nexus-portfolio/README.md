# Software Nexus Portfolio

A 3D interactive portfolio showcasing software engineering skills through a fantasy-futuristic world interface built with React, Vite, and Three.js.

## 🌟 Features

- **3D Interactive World**: Explore skills and projects in a persistent 3D environment with 7 themed zones
- **Scroll-Driven Navigation**: Cinematic camera movement controlled by scroll, keyboard, and touch
- **Project Portals**: Deep dive into engineering decisions and architecture through interactive portals
- **Micro-Interactions**: Hover glows, breathing animations, and audio feedback for polished UX
- **Navigation State Machine**: Smooth transitions between exploration, project, and transition modes
- **Performance Optimized**: Adaptive quality settings and efficient 3D rendering
- **Accessibility First**: Fallback modes and screen reader support
- **Lightning Fast**: Vite for instant dev server and optimized builds

## ✨ Current Implementation (31% Complete)

### Completed Features:
- ✅ Scroll-driven camera navigation through 7 zones
- ✅ Interactive zone markers with hover effects
- ✅ 3 detailed zones: Systems Tower, Interface Sanctum, Simulation Forge
- ✅ Central Nexus hub with rotating rings and pulsing core
- ✅ 330+ flowing data particles in 3 layers
- ✅ 4 magical runes representing technologies (React, Vite, TypeScript, Three.js)
- ✅ 3 project portals with unique themes and animations
- ✅ Raycasting-based interaction system
- ✅ Audio feedback with Web Audio API
- ✅ Navigation history with back button
- ✅ Breathing animations on ambient objects
- ✅ Hover glow effects on interactive elements
- ✅ Debug panel with zone jumping and metrics

### In Progress:
- 🚧 Project interior scenes
- 🚧 Engineering narrative displays
- 🚧 Skills visualization system

## 🛠 Tech Stack

- **React 18** with TypeScript for type-safe component development
- **Vite** for blazing fast development and optimized builds
- **Three.js** with React Three Fiber for declarative 3D graphics
- **GSAP** for smooth, cinematic animations
- **React Three Drei** for helpful 3D utilities and helpers
- **Web Audio API** for spatial audio and sound feedback

## 📁 Project Structure

```
src/
├── components/
│   ├── 3D/                # 3D scene components
│   │   ├── World/        # World structure and zones
│   │   ├── Zones/        # Zone-specific geometry
│   │   ├── Effects/      # Visual effects and animations
│   │   ├── Portal/       # Project portal system
│   │   └── ...           # Scene, camera, lighting
│   └── UI/                # UI overlay components
├── lib/
│   ├── controllers/       # Camera and interaction controllers
│   ├── managers/          # System managers (Portal, Audio, Navigation, etc.)
│   ├── utils/            # Utility functions
│   ├── constants.ts      # Configuration constants
│   └── types.ts          # TypeScript type definitions
├── hooks/                # Custom React hooks
├── data/                 # Portfolio content data
└── assets/               # 3D models, textures, audio
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Controls

- **Mouse Wheel**: Scroll through zones
- **Arrow Keys**: Navigate up/down
- **Page Up/Down**: Quick zone jumps
- **Home/End**: Jump to first/last zone
- **Mouse Click**: Interact with zones and portals
- **Mouse Hover**: See interactive feedback
- **Touch/Swipe**: Mobile navigation support

## 🎨 Customization

### Adding Projects

Edit `src/data/sampleProjects.ts` to add your projects with:
- Engineering narratives and problem statements
- Architecture diagrams and data flows
- Technical challenges and solutions
- Design decisions and tradeoffs
- Performance metrics and impact

### Modifying the World

Update world zones in `src/lib/constants.ts` to customize:
- Zone positions and camera paths
- Theme colors and lighting
- Animation durations and easing
- Performance settings

## 📊 Performance

The portfolio includes several performance optimizations:

- **Level of Detail (LOD)**: Automatic quality adjustment
- **Instanced Rendering**: Efficient rendering of repeated elements
- **Progressive Loading**: Assets load based on priority
- **Adaptive Quality**: Automatic performance mode detection

## ♿ Accessibility

- **Fallback Mode**: 2D interface when 3D is unavailable
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML and ARIA labels
- **Reduced Motion**: Respects user motion preferences

## 🚢 Deployment

Build the static site:

```bash
npm run build
```

Deploy the `dist/` folder to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions
- **Any static host**: Upload the `dist` folder

## 📄 License

MIT License - feel free to use this for your own portfolio!
