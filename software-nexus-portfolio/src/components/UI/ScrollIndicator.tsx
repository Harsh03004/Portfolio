import { CAMERA_PATH } from '@/lib/constants'

interface ScrollIndicatorProps {
  scrollProgress: number
}

export default function ScrollIndicator({ scrollProgress }: ScrollIndicatorProps) {
  const totalZones = CAMERA_PATH.length
  const currentZoneIndex = Math.floor(scrollProgress * (totalZones - 1))
  
  const zoneNames = [
    'Entry Portal',
    'Central Nexus',
    'Systems Tower',
    'Interface Sanctum',
    'Simulation Forge',
    'Knowledge Core',
    'Resume Codex'
  ]

  return (
    <div style={{
      position: 'fixed',
      right: '2rem',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      zIndex: 100,
      pointerEvents: 'none'
    }}>
      {/* Progress bar */}
      <div style={{
        width: '2px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '1px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${scrollProgress * 100}%`,
          background: 'linear-gradient(to bottom, #00ffff, #ff6b9d)',
          transition: 'height 0.1s ease-out'
        }} />
      </div>

      {/* Zone indicators */}
      <div style={{
        position: 'absolute',
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {zoneNames.map((name, index) => {
          const isActive = currentZoneIndex === index
          const isPassed = scrollProgress * (totalZones - 1) > index
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: isActive ? 1 : isPassed ? 0.6 : 0.3,
                transition: 'opacity 0.3s ease'
              }}
            >
              <div style={{
                width: isActive ? '12px' : '8px',
                height: isActive ? '12px' : '8px',
                borderRadius: '50%',
                background: isActive 
                  ? 'linear-gradient(135deg, #00ffff, #ff6b9d)'
                  : isPassed 
                    ? '#00ffff' 
                    : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 0 10px rgba(0, 255, 255, 0.5)' : 'none'
              }} />
              
              {isActive && (
                <span style={{
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'
                }}>
                  {name}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Scroll hint */}
      {scrollProgress < 0.05 && (
        <div style={{
          position: 'absolute',
          bottom: '-3rem',
          right: '-1rem',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.75rem',
          textAlign: 'right',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          Scroll to explore
          <div style={{
            marginTop: '0.25rem',
            fontSize: '1.5rem',
            textAlign: 'center'
          }}>
            ↓
          </div>
        </div>
      )}
    </div>
  )
}
