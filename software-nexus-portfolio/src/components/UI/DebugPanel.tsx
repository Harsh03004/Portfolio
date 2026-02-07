import { useState } from 'react'

interface DebugPanelProps {
  scrollProgress: number
  scrollVelocity: number
  scrollDirection: 'up' | 'down' | 'none'
  onTogglePathVisualizer?: (visible: boolean) => void
  onJumpToZone?: (zoneIndex: number) => void
}

export default function DebugPanel({
  scrollProgress,
  scrollVelocity,
  scrollDirection,
  onTogglePathVisualizer,
  onJumpToZone
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showPath, setShowPath] = useState(false)

  const zoneNames = [
    'Entry Portal',
    'Central Nexus',
    'Systems Tower',
    'Interface Sanctum',
    'Simulation Forge',
    'Knowledge Core',
    'Resume Codex'
  ]

  const handleTogglePath = () => {
    const newValue = !showPath
    setShowPath(newValue)
    onTogglePathVisualizer?.(newValue)
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close debug panel' : 'Open debug panel'}
        aria-expanded={isOpen}
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          padding: '0.5rem 1rem',
          background: 'rgba(0, 0, 0, 0.7)',
          color: '#00ffff',
          border: '1px solid #00ffff',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}
      >
        {isOpen ? '✕ Close Debug' : '⚙ Debug Panel'}
      </button>

      {/* Debug panel */}
      {isOpen && (
        <div
          role="region"
          aria-labelledby="debug-title"
          style={{
          position: 'fixed',
          bottom: '4rem',
          left: '1rem',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          border: '1px solid #00ffff',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          maxWidth: '300px',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ 
            margin: '0 0 1rem 0', 
            color: '#00ffff',
            fontSize: '0.875rem'
          }}
          id="debug-title"
          >
            Navigation Debug
          </h3>

          {/* Metrics */}
          <div style={{ marginBottom: '1rem' }} role="group" aria-label="Performance metrics">
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#9ca3af' }}>Progress:</span>{' '}
              <span style={{ color: '#00ffff' }}>
                {(scrollProgress * 100).toFixed(1)}%
              </span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#9ca3af' }}>Velocity:</span>{' '}
              <span style={{ color: '#ff6b9d' }}>
                {scrollVelocity.toFixed(4)}
              </span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#9ca3af' }}>Direction:</span>{' '}
              <span style={{ color: '#ffd700' }}>
                {scrollDirection}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={handleTogglePath}
              aria-label={showPath ? 'Hide camera path' : 'Show camera path'}
              aria-pressed={showPath}
              style={{
                width: '100%',
                padding: '0.5rem',
                background: showPath ? '#0891b2' : 'rgba(8, 145, 178, 0.3)',
                color: 'white',
                border: '1px solid #00ffff',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.75rem',
                marginBottom: '0.5rem'
              }}
            >
              {showPath ? '✓ Hide Camera Path' : 'Show Camera Path'}
            </button>
          </div>

          {/* Zone jumps */}
          <div>
            <div style={{ 
              marginBottom: '0.5rem', 
              color: '#9ca3af',
              fontSize: '0.75rem'
            }}
            id="zone-jump-label"
            >
              Jump to Zone:
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.25rem'
              }}
              role="group"
              aria-labelledby="zone-jump-label"
            >
              {zoneNames.map((name, index) => (
                <button
                  key={index}
                  onClick={() => onJumpToZone?.(index)}
                  aria-label={`Jump to ${name}`}
                  style={{
                    padding: '0.25rem 0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.625rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={name}
                >
                  {index + 1}. {name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
