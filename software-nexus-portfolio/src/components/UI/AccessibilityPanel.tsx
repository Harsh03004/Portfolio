/**
 * AccessibilityPanel - Control panel for accessibility features
 * Provides toggles for reduced motion, keyboard shortcuts, and screen reader mode
 */

import React from 'react'
import { useAccessibility } from '@/hooks/useAccessibility'
import styles from './AccessibilityPanel.module.css'

export interface AccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose
}) => {
  const {
    prefersReducedMotion,
    keyboardShortcutsEnabled,
    screenReaderMode,
    shouldReduceMotion,
    shortcuts,
    toggleReducedMotion,
    toggleKeyboardShortcuts,
    toggleScreenReaderMode
  } = useAccessibility()

  if (!isOpen) return null

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-labelledby="accessibility-title"
      aria-modal="true"
    >
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="accessibility-title" className={styles.title}>
            Accessibility Settings
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close accessibility panel"
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {/* Reduced Motion */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Motion Settings</h3>
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <label htmlFor="reduced-motion" className={styles.settingLabel}>
                  Reduce Motion
                </label>
                <p className={styles.settingDescription}>
                  Minimize animations and transitions
                  {prefersReducedMotion && ' (System preference detected)'}
                </p>
              </div>
              <button
                id="reduced-motion"
                className={`${styles.toggle} ${shouldReduceMotion ? styles.toggleActive : ''}`}
                onClick={toggleReducedMotion}
                role="switch"
                aria-checked={shouldReduceMotion}
              >
                <span className={styles.toggleSlider}></span>
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Keyboard Navigation</h3>
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <label htmlFor="keyboard-shortcuts" className={styles.settingLabel}>
                  Enable Keyboard Shortcuts
                </label>
                <p className={styles.settingDescription}>
                  Use arrow keys and shortcuts to navigate
                </p>
              </div>
              <button
                id="keyboard-shortcuts"
                className={`${styles.toggle} ${keyboardShortcutsEnabled ? styles.toggleActive : ''}`}
                onClick={toggleKeyboardShortcuts}
                role="switch"
                aria-checked={keyboardShortcutsEnabled}
              >
                <span className={styles.toggleSlider}></span>
              </button>
            </div>

            {keyboardShortcutsEnabled && (
              <div className={styles.shortcuts}>
                <h4 className={styles.shortcutsTitle}>Available Shortcuts:</h4>
                <ul className={styles.shortcutsList}>
                  {shortcuts.map((shortcut, index) => (
                    <li key={index} className={styles.shortcutItem}>
                      <kbd className={styles.shortcutKey}>{shortcut.key}</kbd>
                      <span className={styles.shortcutDescription}>
                        {shortcut.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Screen Reader Mode */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Screen Reader</h3>
            <div className={styles.setting}>
              <div className={styles.settingInfo}>
                <label htmlFor="screen-reader" className={styles.settingLabel}>
                  Screen Reader Mode
                </label>
                <p className={styles.settingDescription}>
                  Enhanced descriptions and announcements
                </p>
              </div>
              <button
                id="screen-reader"
                className={`${styles.toggle} ${screenReaderMode ? styles.toggleActive : ''}`}
                onClick={toggleScreenReaderMode}
                role="switch"
                aria-checked={screenReaderMode}
              >
                <span className={styles.toggleSlider}></span>
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className={styles.helpText}>
            <p>
              These settings help make the 3D experience more accessible.
              If you prefer a text-only version, use the "Skip 3D" option on the main page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityPanel

