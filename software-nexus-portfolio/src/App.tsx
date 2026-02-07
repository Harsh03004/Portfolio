import { useState, useEffect } from 'react'
import Scene from './components/3D/Scene'
import CameraRig from './components/3D/CameraRig'
import CameraPathVisualizer from './components/3D/CameraPathVisualizer'
import { World } from './components/3D/World'
import ScrollIndicator from './components/UI/ScrollIndicator'
import DebugPanel from './components/UI/DebugPanel'
import AccessibilityPanel from './components/UI/AccessibilityPanel'
import FallbackUI from './components/UI/FallbackUI'
import RecruiterMode from './components/UI/RecruiterMode'
import { useScrollNavigation } from './hooks/useScrollNavigation'
import { useNavigationState } from './hooks/useNavigationState'
import { usePortal } from './hooks/usePortal'
import { useAccessibility, useScreenReaderAnnounce } from './hooks/useAccessibility'
import { useRecruiterMode } from './hooks/useRecruiterMode'
import { PerformanceMode } from './lib/types'
import { getSceneAriaLabel, getSceneAriaDescription, getZoneLabel } from './lib/utils/accessibility'
import {
  checkWebGLSupport,
  shouldActivateFallback,
  getFallbackPreference,
  storeFallbackPreference,
  FallbackMode
} from './lib/utils/fallback'
import { samplePortfolioContent } from './data/samplePortfolioContent'
import './App.css'

function App() {
  const [performanceMode] = useState<PerformanceMode>('high')
  const [showPathVisualizer, setShowPathVisualizer] = useState(false)
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)
  const [useFallbackUI, setUseFallbackUI] = useState(false)
  const [fallbackMode, setFallbackMode] = useState<FallbackMode | null>(null)

  const { 
    scrollProgress, 
    scrollVelocity, 
    scrollDirection,
    jumpToZone 
  } = useScrollNavigation({
    smoothing: 0.1,
    sensitivity: 0.001,
    enabled: true
  })

  const {
    mode,
    currentZone,
    activeProject,
    isTransitioning,
    navigateToZone,
    enterProjectMode,
    goBack,
    canGoBack
  } = useNavigationState()

  const {
    portalState,
    activeProject: portalProject,
    isInPortal
  } = usePortal()

  const { shouldReduceMotion, keyboardShortcutsEnabled } = useAccessibility()
  const { announcement, announce } = useScreenReaderAnnounce()
  const { isRecruiterMode, trackDownload, disableRecruiterMode } = useRecruiterMode({
    autoDetect: true,
    trackDownloads: true
  })

  // Check for fallback requirements on mount
  useEffect(() => {
    const userPreference = getFallbackPreference()

    // If user has a stored preference, use it
    if (userPreference !== null) {
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        setUseFallbackUI(userPreference)
        if (userPreference) {
          setFallbackMode({ type: 'user-choice', reason: 'User preference' })
        }
      }, 0)
      return
    }

    // Check if fallback should be auto-activated
    const autoFallback = shouldActivateFallback()
    if (autoFallback) {
      setTimeout(() => {
        setUseFallbackUI(true)
        setFallbackMode(autoFallback)
        announce(`Using fallback mode: ${autoFallback.reason}`, 'polite')
      }, 0)
    }
  }, [announce])

  const handlePortalEnter = (projectId: string) => {
    console.log(`Entering portal: ${projectId}`)
    enterProjectMode(projectId)
    announce(`Entering project: ${projectId}`, 'polite')
  }

  const handleEnableFallback = () => {
    setUseFallbackUI(true)
    setFallbackMode({ type: 'user-choice', reason: 'User preference' })
    storeFallbackPreference(true)
    announce('Switched to text-based version', 'polite')
  }

  const enableRecruiterMode = () => {
    // This will be handled by the useRecruiterMode hook
    window.location.href = window.location.origin + '?recruiter=true'
  }

  const handleEnable3D = () => {
    const webgl = checkWebGLSupport()
    if (!webgl.supported) {
      announce('3D experience requires WebGL support', 'assertive')
      return
    }

    setUseFallbackUI(false)
    setFallbackMode(null)
    storeFallbackPreference(false)
    disableRecruiterMode()
    announce('Switched to 3D experience', 'polite')
  }

  // If recruiter mode is active, show recruiter interface
  if (isRecruiterMode) {
    return (
      <RecruiterMode
        content={samplePortfolioContent}
        onExit={handleEnable3D}
        onDownloadTracking={trackDownload}
      />
    )
  }

  // If using fallback UI, render fallback component
  if (useFallbackUI && fallbackMode) {
    return (
      <FallbackUI
        content={samplePortfolioContent}
        mode={fallbackMode}
        onEnable3D={handleEnable3D}
      />
    )
  }

  return (
    <div className="app-container">
      {/* Skip to Content Link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Screen Reader Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {announcement}
      </div>

      {/* 3D Scene */}
      <main
        id="main-content"
        role="main"
        aria-label={getSceneAriaLabel()}
        aria-describedby="scene-description"
      >
        <div
          id="scene-description"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden'
          }}
        >
          {getSceneAriaDescription()}
        </div>

        <Scene performanceMode={performanceMode} shouldReduceMotion={shouldReduceMotion}>
        {/* Camera controller */}
        <CameraRig scrollProgress={scrollProgress} enableScrollControl={keyboardShortcutsEnabled} />

        {/* Camera path visualizer (debug) */}
        <CameraPathVisualizer visible={showPathVisualizer} showTargets={true} />
        
        {/* Software Nexus World */}
        <World 
          onZoneClick={navigateToZone}
          onProjectClick={enterProjectMode}
          onPortalEnter={handlePortalEnter}
        />
      </Scene>
      </main>

      {/* UI Overlay */}
      <div className="ui-overlay">
        <div className="hero-content">
          <h1 className="hero-title">
            Software Nexus Portfolio
          </h1>
          <p className="hero-subtitle">
            Explore the Fantasy-Tech Engineering World
          </p>

          {/* Accessibility Button */}
          <button
            className="accessibility-button"
            onClick={() => setShowAccessibilityPanel(true)}
            aria-label="Open accessibility settings"
            title="Accessibility Settings"
          >
            ♿ Accessibility
          </button>

          {/* Skip 3D Button */}
          <button
            className="skip-3d-button"
            onClick={handleEnableFallback}
            aria-label="Skip 3D experience and use text-based version"
            title="Use text-based version"
          >
            Skip 3D Experience
          </button>

          {/* Recruiter Mode Button */}
          <button
            className="recruiter-mode-button"
            onClick={enableRecruiterMode}
            aria-label="Switch to recruiter-optimized view"
            title="Fast-loading recruiter view"
          >
            👔 Recruiter View
          </button>

          <div className="performance-indicator" role="status" aria-live="polite">
            Performance Mode: <span className="mode-value">{performanceMode}</span>
          </div>
          <div className="navigation-info" role="status" aria-live="polite">
            Mode: <span className="mode-value">{mode}</span>
            {currentZone && (
              <> | Zone: <span className="zone-value">{getZoneLabel(parseInt(currentZone.split('-')[0]) || 0)}</span></>
            )}
            {activeProject && (
              <> | Project: <span className="project-value">{activeProject}</span></>
            )}
            {isInPortal && portalProject && (
              <> | Portal: <span className="portal-value">{portalProject.title}</span></>
            )}
            {isTransitioning && (
              <span className="transition-indicator"> (Transitioning...)</span>
            )}
            {portalState === 'opening' && (
              <span className="transition-indicator"> (Entering Portal...)</span>
            )}
            {portalState === 'closing' && (
              <span className="transition-indicator"> (Exiting Portal...)</span>
            )}
          </div>
          {canGoBack() && (
            <button
              className="back-button"
              onClick={goBack}
              aria-label="Go back to previous view"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator scrollProgress={scrollProgress} />

      {/* Debug panel */}
      <DebugPanel
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
        scrollDirection={scrollDirection}
        onTogglePathVisualizer={setShowPathVisualizer}
        onJumpToZone={jumpToZone}
      />

      {/* Accessibility Panel */}
      <AccessibilityPanel
        isOpen={showAccessibilityPanel}
        onClose={() => setShowAccessibilityPanel(false)}
      />
    </div>
  )
}

export default App
