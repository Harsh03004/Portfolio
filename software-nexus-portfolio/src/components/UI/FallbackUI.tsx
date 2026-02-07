/**
 * FallbackUI - Text-first alternative to 3D experience
 * Provides complete portfolio content without WebGL dependency
 */

import React from 'react'
import { PortfolioContent } from '@/lib/types'
import { FallbackMode, getFallbackRecommendation } from '@/lib/utils/fallback'
import styles from './FallbackUI.module.css'

export interface FallbackUIProps {
  content: Partial<PortfolioContent>
  mode: FallbackMode
  onEnable3D?: () => void
}

export const FallbackUI: React.FC<FallbackUIProps> = ({
  content,
  mode,
  onEnable3D
}) => {
  const canEnable3D = mode.type !== 'webgl-failure'

  return (
    <div className={styles.fallbackContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {content.personalInfo?.name || 'Portfolio'}
          </h1>
          <p className={styles.subtitle}>
            {content.personalInfo?.title || 'Software Engineer'}
          </p>

          {/* Mode Info */}
          <div className={styles.modeInfo} role="status">
            <p>{getFallbackRecommendation(mode)}</p>
            {canEnable3D && onEnable3D && (
              <button
                className={styles.enable3DButton}
                onClick={onEnable3D}
                aria-label="Switch to 3D experience"
              >
                Try 3D Experience
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.navigation} aria-label="Main navigation">
        <ul className={styles.navList}>
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#certifications">Certifications</a></li>
          <li><a href="#research">Research</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* About Section */}
        {content.personalInfo && (
          <section id="about" className={styles.section}>
            <h2>About</h2>
            <p className={styles.bio}>{content.personalInfo.bio}</p>
            <div className={styles.contact} id="contact">
              <p>
                <strong>Location:</strong> {content.personalInfo.location}
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${content.personalInfo.email}`}>
                  {content.personalInfo.email}
                </a>
              </p>
              {content.personalInfo.linkedin && (
                <p>
                  <strong>LinkedIn:</strong>{' '}
                  <a
                    href={content.personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Profile
                  </a>
                </p>
              )}
              {content.personalInfo.github && (
                <p>
                  <strong>GitHub:</strong>{' '}
                  <a
                    href={content.personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Profile
                  </a>
                </p>
              )}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {content.projects && content.projects.length > 0 && (
          <section id="projects" className={styles.section}>
            <h2>Projects</h2>
            <div className={styles.projectsList}>
              {content.projects.map((project) => (
                <article key={project.id} className={styles.projectCard}>
                  <h3>{project.title}</h3>
                  <p className={styles.projectDomain}>
                    Domain: {project.domain}
                  </p>

                  {project.engineeringStory && (
                    <div className={styles.projectDetails}>
                      <h4>Problem</h4>
                      <p>{project.engineeringStory.problemStatement}</p>

                      <h4>Solution</h4>
                      <p>{project.engineeringStory.solutionApproach}</p>

                      {project.engineeringStory.resultsAndImpact && (
                        <>
                          <h4>Results</h4>
                          <p>{project.engineeringStory.resultsAndImpact}</p>
                        </>
                      )}
                    </div>
                  )}

                  {project.techStack && (
                    <div className={styles.techStack}>
                      <strong>Technologies:</strong>{' '}
                      {project.techStack.technologies.join(', ')}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {content.skills && content.skills.length > 0 && (
          <section id="skills" className={styles.section}>
            <h2>Skills</h2>
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
                  <ul className={styles.skillList}>
                    {skills.map((skill, index) => (
                      <li key={index} className={styles.skillItem}>
                        <span className={styles.skillName}>{skill.technology}</span>
                        <span className={styles.skillProficiency}>
                          {Math.round(skill.proficiencyLevel * 100)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {content.experience && content.experience.length > 0 && (
          <section id="experience" className={styles.section}>
            <h2>Professional Experience</h2>
            <div className={styles.experienceList}>
              {content.experience.map((exp, index) => (
                <article key={index} className={styles.experienceItem}>
                  <h3>{exp.role}</h3>
                  <p className={styles.company}>{exp.company}</p>
                  <p className={styles.duration}>{exp.duration}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className={styles.achievements}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {content.certifications && content.certifications.length > 0 && (
          <section id="certifications" className={styles.section}>
            <h2>Certifications</h2>
            <div className={styles.certsList}>
              {content.certifications.map((cert, index) => (
                <article key={index} className={styles.certItem}>
                  <h3>{cert.name}</h3>
                  <p className={styles.certIssuer}>{cert.issuer}</p>
                  <p className={styles.certDate}>{cert.date}</p>
                  <p className={styles.certId}>ID: {cert.credentialId}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Research Section */}
        {content.researchShowcase && content.researchShowcase.length > 0 && (
          <section id="research" className={styles.section}>
            <h2>Research & Problem Solving</h2>
            <div className={styles.researchList}>
              {content.researchShowcase.map((research, index) => (
                <article key={index} className={styles.researchItem}>
                  <h3>{research.topic}</h3>
                  <p className={styles.methodology}>
                    <strong>Methodology:</strong> {research.methodology}
                  </p>
                  <h4>Key Findings</h4>
                  <ul className={styles.findings}>
                    {research.findings.map((finding, i) => (
                      <li key={i}>{finding}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          &copy; {new Date().getFullYear()} {content.personalInfo?.name || 'Portfolio'}.
          All rights reserved.
        </p>
        {canEnable3D && onEnable3D && (
          <button
            className={styles.footerButton}
            onClick={onEnable3D}
            aria-label="Switch to 3D experience"
          >
            Try 3D Experience
          </button>
        )}
      </footer>
    </div>
  )
}

export default FallbackUI

