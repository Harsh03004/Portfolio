/**
 * RecruiterMode - Fast-loading, streamlined interface for recruiters
 * Provides quick access to resume, projects, and key information
 */

import React, { useState } from 'react'
import { PortfolioContent } from '@/lib/types'
import { downloadResumePDF, downloadResumeText } from '@/lib/utils/pdfGenerator'
import styles from './RecruiterMode.module.css'

export interface RecruiterModeProps {
  content: PortfolioContent
  onExit?: () => void
  onDownloadTracking?: (format: 'pdf' | 'text') => void
}

export const RecruiterMode: React.FC<RecruiterModeProps> = ({
  content,
  onExit,
  onDownloadTracking
}) => {
  const [downloading, setDownloading] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('overview')

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try {
      await downloadResumePDF(content, {
        fileName: `${content.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`,
        colorScheme: 'minimal'
      })
      onDownloadTracking?.('pdf')
    } catch (error) {
      console.error('PDF download failed:', error)
    } finally {
      setDownloading(false)
    }
  }

  const handleDownloadText = () => {
    try {
      downloadResumeText(content, `${content.personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`)
      onDownloadTracking?.('text')
    } catch (error) {
      console.error('Text download failed:', error)
    }
  }

  return (
    <div className={styles.recruiterMode}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <h1>{content.personalInfo.name}</h1>
            <p className={styles.title}>{content.personalInfo.title}</p>
            <div className={styles.quickContact}>
              <a href={`mailto:${content.personalInfo.email}`} className={styles.contactButton}>
                📧 Email
              </a>
              <a href={content.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactButton}>
                💼 LinkedIn
              </a>
              <a href={content.personalInfo.github} target="_blank" rel="noopener noreferrer" className={styles.contactButton}>
                🐙 GitHub
              </a>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className={styles.downloadButton}
              aria-label="Download PDF resume"
            >
              {downloading ? 'Generating...' : '⬇ Download PDF'}
            </button>
            <button
              onClick={handleDownloadText}
              className={styles.downloadButtonSecondary}
              aria-label="Download text resume"
            >
              📄 Download TXT
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className={styles.exitButton}
                aria-label="View full portfolio"
              >
                🚀 View Full Portfolio
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Quick Navigation */}
      <nav className={styles.quickNav} aria-label="Quick navigation">
        <button
          className={activeSection === 'overview' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveSection('overview')}
        >
          Overview
        </button>
        <button
          className={activeSection === 'experience' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveSection('experience')}
        >
          Experience
        </button>
        <button
          className={activeSection === 'projects' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveSection('projects')}
        >
          Projects ({content.projects.length})
        </button>
        <button
          className={activeSection === 'skills' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveSection('skills')}
        >
          Skills
        </button>
        <button
          className={activeSection === 'certifications' ? styles.navButtonActive : styles.navButton}
          onClick={() => setActiveSection('certifications')}
        >
          Certifications
        </button>
      </nav>

      {/* Content Area */}
      <main className={styles.mainContent} role="main" aria-label="Resume content">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <section className={styles.section} aria-label="Overview">
            <h2>Professional Overview</h2>
            <div className={styles.overviewGrid}>
              <div className={styles.overviewCard}>
                <h3>Summary</h3>
                <p>{content.personalInfo.bio}</p>
              </div>
              <div className={styles.overviewCard}>
                <h3>Quick Stats</h3>
                <ul className={styles.statsList}>
                  <li><strong>{content.projects.length}</strong> Featured Projects</li>
                  <li><strong>{content.skills.length}</strong> Technical Skills</li>
                  <li><strong>{content.experience.length}</strong> Positions</li>
                  <li><strong>{content.certifications.length}</strong> Certifications</li>
                </ul>
              </div>
              <div className={styles.overviewCard}>
                <h3>Top Skills</h3>
                <div className={styles.topSkills}>
                  {content.skills
                    .sort((a, b) => b.proficiencyLevel - a.proficiencyLevel)
                    .slice(0, 6)
                    .map((skill, index) => (
                      <span key={index} className={styles.skillBadge}>
                        {skill.technology}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {activeSection === 'experience' && (
          <section className={styles.section} aria-label="Experience">
            <h2>Professional Experience</h2>
            <div className={styles.experienceList}>
              {content.experience.map((exp, index) => (
                <article key={index} className={styles.experienceCard}>
                  <div className={styles.experienceHeader}>
                    <div>
                      <h3>{exp.role}</h3>
                      <p className={styles.company}>{exp.company}</p>
                    </div>
                    <span className={styles.duration}>{exp.duration}</span>
                  </div>
                  <ul className={styles.achievements}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <section className={styles.section} aria-label="Projects">
            <h2>Featured Projects</h2>
            <div className={styles.projectsGrid}>
              {content.projects.map((project) => (
                <article key={project.id} className={styles.projectCard}>
                  <h3>{project.title}</h3>
                  <span className={styles.projectDomain}>{project.domain}</span>
                  <p className={styles.projectDescription}>
                    {project.engineeringStory.problemStatement}
                  </p>
                  <div className={styles.projectTech}>
                    <strong>Tech Stack:</strong>
                    <div className={styles.techList}>
                      {project.techStack.technologies.map((tech, i) => (
                        <span key={i} className={styles.techBadge}>{tech}</span>
                      ))}
                    </div>
                  </div>
                  {project.engineeringStory.resultsAndImpact && (
                    <div className={styles.projectImpact}>
                      <strong>Impact:</strong> {project.engineeringStory.resultsAndImpact}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <section className={styles.section} aria-label="Skills">
            <h2>Technical Skills</h2>
            <div className={styles.skillsGrid}>
              {Object.entries(
                content.skills.reduce((acc, skill) => {
                  if (!acc[skill.category]) acc[skill.category] = []
                  acc[skill.category].push(skill)
                  return acc
                }, {} as Record<string, typeof content.skills>)
              ).map(([category, skills]) => (
                <div key={category} className={styles.skillCategory}>
                  <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                  <div className={styles.skillList}>
                    {skills
                      .sort((a, b) => b.proficiencyLevel - a.proficiencyLevel)
                      .map((skill, index) => (
                        <div key={index} className={styles.skillItem}>
                          <span className={styles.skillName}>{skill.technology}</span>
                          <div className={styles.skillBar}>
                            <div
                              className={styles.skillBarFill}
                              style={{ width: `${skill.proficiencyLevel * 100}%` }}
                            />
                          </div>
                          <span className={styles.skillPercent}>
                            {Math.round(skill.proficiencyLevel * 100)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {activeSection === 'certifications' && (
          <section className={styles.section} aria-label="Certifications">
            <h2>Certifications & Credentials</h2>
            <div className={styles.certsGrid}>
              {content.certifications.map((cert, index) => (
                <article key={index} className={styles.certCard}>
                  <h3>{cert.name}</h3>
                  <p className={styles.certIssuer}>{cert.issuer}</p>
                  <p className={styles.certDate}>{cert.date}</p>
                  <p className={styles.certId}>ID: {cert.credentialId}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} {content.personalInfo.name}. All rights reserved.</p>
        <p className={styles.footerNote}>
          This is a simplified recruiter-friendly view. {onExit && (
            <button onClick={onExit} className={styles.footerLink}>
              View the full 3D portfolio experience
            </button>
          )}
        </p>
      </footer>
    </div>
  )
}

export default RecruiterMode

