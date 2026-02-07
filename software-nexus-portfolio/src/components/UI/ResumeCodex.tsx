/**
 * ResumeCodex - Interactive Resume and Credentials Display
 * Displays resume, experience, and certifications in an interactive 3D/2D interface
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import React, { useState, useMemo } from 'react'
import { ExperienceData, CertificationData } from '@/lib/types'
import styles from './ResumeCodex.module.css'

export interface ResumeCodexProps {
  personalName: string
  personalTitle: string
  personalLocation: string
  email: string
  linkedin: string
  github: string
  experience: ExperienceData[]
  certifications: CertificationData[]
  onDownloadPDF?: () => Promise<void>
}

/**
 * Experience Timeline Item
 */
export const ExperienceTimeline: React.FC<{ experience: ExperienceData[] }> = ({ experience }) => {
  return (
    <div className={styles.timeline}>
      <h2>Professional Experience</h2>
      <div className={styles.timelineItems}>
        {experience.map((exp, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timelineMarker}></div>
            <div className={styles.timelineContent}>
              <h3>{exp.role}</h3>
              <p className={styles.company}>{exp.company}</p>
              <p className={styles.duration}>{exp.duration}</p>
              {exp.achievements && (
                <ul className={styles.achievements}>
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Certification Card Component
 */
const CertificationCard: React.FC<{
  cert: CertificationData
  isSelected: boolean
  onSelect: () => void
}> = ({ cert, isSelected, onSelect }) => {
  return (
    <div
      className={`${styles.certCard} ${isSelected ? styles.certCardSelected : ''}`}
      onClick={onSelect}
    >
      <div className={styles.certBadge}>
        <div className={styles.certIcon}>✓</div>
      </div>
      <h4>{cert.name}</h4>
      <p className={styles.certIssuer}>{cert.issuer}</p>
      <p className={styles.certDate}>{cert.date}</p>
      {isSelected && (
        <div className={styles.certDetails}>
          <p className={styles.credentialId}>ID: {cert.credentialId}</p>
        </div>
      )}
    </div>
  )
}

/**
 * Certifications Grid Component
 */
const CertificationsGrid: React.FC<{ certifications: CertificationData[] }> = ({ certifications }) => {
  const [selectedCert, setSelectedCert] = useState<number | null>(null)

  const certsByCategory = useMemo(() => {
    const categories: { [key: string]: CertificationData[] } = {}

    certifications.forEach(cert => {
      let category = 'Other'
      if (cert.issuer.includes('AWS')) category = 'AWS'
      if (cert.issuer.includes('Google')) category = 'Google Cloud'
      if (cert.issuer.includes('Cloud Native')) category = 'CNCF'
      if (cert.issuer.includes('Oracle')) category = 'Oracle'

      if (!categories[category]) categories[category] = []
      categories[category].push(cert)
    })

    return categories
  }, [certifications])

  return (
    <div className={styles.certificationsSection}>
      <h2>Certifications & Credentials</h2>
      {Object.entries(certsByCategory).map(([category, certs]) => (
        <div key={category} className={styles.certCategory}>
          <h3>{category}</h3>
          <div className={styles.certGrid}>
            {certs.map((cert, index) => (
              <CertificationCard
                key={`${cert.name}-${index}`}
                cert={cert}
                isSelected={selectedCert === index}
                onSelect={() => setSelectedCert(selectedCert === index ? null : index)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Contact Information Component
 */
const ContactInfo: React.FC<{
  name: string
  title: string
  location: string
  email: string
  linkedin: string
  github: string
}> = ({ name, title, location, email, linkedin, github }) => {
  return (
    <div className={styles.contactSection}>
      <div className={styles.header}>
        <h1>{name}</h1>
        <p className={styles.title}>{title}</p>
        <p className={styles.location}>{location}</p>
      </div>

      <div className={styles.contactLinks}>
        <a href={`mailto:${email}`} className={styles.contactLink} title="Email">
          <span className={styles.icon}>✉</span>
          {email}
        </a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactLink} title="LinkedIn">
          <span className={styles.icon}>💼</span>
          LinkedIn
        </a>
        <a href={github} target="_blank" rel="noopener noreferrer" className={styles.contactLink} title="GitHub">
          <span className={styles.icon}>🐙</span>
          GitHub
        </a>
      </div>
    </div>
  )
}

/**
 * Main ResumeCodex Component
 */
export const ResumeCodex: React.FC<ResumeCodexProps> = ({
  personalName,
  personalTitle,
  personalLocation,
  email,
  linkedin,
  github,
  experience,
  certifications,
  onDownloadPDF
}) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadPDF = async () => {
    if (!onDownloadPDF) return

    setIsDownloading(true)
    try {
      await onDownloadPDF()
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className={styles.resumeCodex}>
      <div className={styles.container}>
        <ContactInfo
          name={personalName}
          title={personalTitle}
          location={personalLocation}
          email={email}
          linkedin={linkedin}
          github={github}
        />

        {experience.length > 0 && (
          <ExperienceTimeline experience={experience} />
        )}

        {certifications.length > 0 && (
          <CertificationsGrid certifications={certifications} />
        )}

        {onDownloadPDF && (
          <div className={styles.downloadSection}>
            <button
              className={styles.downloadButton}
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? 'Generating PDF...' : 'Download PDF Resume'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeCodex

