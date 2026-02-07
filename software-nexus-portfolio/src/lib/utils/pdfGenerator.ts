/**
 * PDF Resume Generator
 * Generates downloadable PDF resume from portfolio content
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

import { PortfolioContent } from '@/lib/types'

/**
 * PDF Generation configuration
 */
export interface PDFGenerationConfig {
  fileName?: string
  title?: string
  subject?: string
  author?: string
  includePhoto?: boolean
  colorScheme?: 'default' | 'minimal' | 'colorful'
}

/**
 * HTML to PDF converter using a library approach
 * Note: This is a template for using html2pdf, jsPDF, or similar libraries
 */

/**
 * Generate HTML content for PDF resume
 */
export function generateResumeHTML(content: PortfolioContent, config: PDFGenerationConfig = {}): string {
  const { colorScheme = 'default' } = config

  const colors = {
    default: {
      primary: '#00ffff',
      secondary: '#ff6b9d',
      accent: '#9d4edd',
      background: '#ffffff',
      text: '#333333',
      light: '#f5f5f5'
    },
    minimal: {
      primary: '#000000',
      secondary: '#666666',
      accent: '#999999',
      background: '#ffffff',
      text: '#333333',
      light: '#f5f5f5'
    },
    colorful: {
      primary: '#0066cc',
      secondary: '#ff6600',
      accent: '#00cc99',
      background: '#ffffff',
      text: '#333333',
      light: '#f5f5f5'
    }
  }

  const theme = colors[colorScheme]

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${content.personalInfo.name} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: ${theme.text};
      background: ${theme.background};
      line-height: 1.6;
      padding: 2rem;
    }

    .resume {
      max-width: 8.5in;
      height: 11in;
      margin: 0 auto;
      background: white;
      padding: 0.5in;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    .header {
      text-align: center;
      border-bottom: 3px solid ${theme.primary};
      padding-bottom: 1rem;
      margin-bottom: 1.5rem;
    }

    .header h1 {
      font-size: 2.5rem;
      color: ${theme.primary};
      margin-bottom: 0.25rem;
    }

    .header p {
      color: ${theme.secondary};
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .contact-info {
      text-align: center;
      font-size: 0.9rem;
      color: ${theme.text};
      margin-bottom: 0.5rem;
    }

    .contact-info a {
      color: ${theme.primary};
      text-decoration: none;
      margin: 0 1rem;
    }

    section {
      margin-bottom: 1.5rem;
    }

    section h2 {
      font-size: 1.2rem;
      color: ${theme.primary};
      border-bottom: 2px solid ${theme.accent};
      padding-bottom: 0.5rem;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .experience-item {
      margin-bottom: 1.25rem;
    }

    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .experience-header h3 {
      font-size: 1rem;
      color: ${theme.text};
      margin-bottom: 0.25rem;
    }

    .company {
      color: ${theme.secondary};
      font-weight: 600;
    }

    .duration {
      color: ${theme.accent};
      font-size: 0.9rem;
      font-style: italic;
    }

    .achievements {
      list-style-type: none;
      padding-left: 0.5rem;
      margin-top: 0.5rem;
    }

    .achievements li {
      margin: 0.25rem 0;
      padding-left: 1rem;
      position: relative;
      font-size: 0.9rem;
    }

    .achievements li::before {
      content: '▪';
      position: absolute;
      left: 0;
      color: ${theme.primary};
    }

    .cert-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    .cert-item {
      border-left: 3px solid ${theme.primary};
      padding-left: 0.75rem;
      font-size: 0.9rem;
    }

    .cert-name {
      font-weight: 600;
      color: ${theme.text};
    }

    .cert-issuer {
      color: ${theme.secondary};
      font-size: 0.85rem;
    }

    .cert-date {
      color: ${theme.accent};
      font-size: 0.8rem;
    }

    .skill-category {
      margin-bottom: 1rem;
    }

    .skill-category h3 {
      font-size: 0.95rem;
      color: ${theme.secondary};
      margin-bottom: 0.5rem;
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-tag {
      background: ${theme.light};
      color: ${theme.text};
      padding: 0.25rem 0.75rem;
      border-radius: 3px;
      font-size: 0.85rem;
      border-left: 3px solid ${theme.accent};
    }

    @media print {
      body {
        padding: 0;
      }
      .resume {
        max-width: 100%;
        height: auto;
        box-shadow: none;
        padding: 0.5in;
      }
    }
  </style>
</head>
<body>
  <div class="resume">
    <!-- Header -->
    <div class="header">
      <h1>${content.personalInfo.name}</h1>
      <p>${content.personalInfo.title}</p>
      <div class="contact-info">
        <span>${content.personalInfo.location}</span>
        <a href="mailto:${content.personalInfo.email}">${content.personalInfo.email}</a>
      </div>
    </div>

    <!-- Experience -->
    <section>
      <h2>Professional Experience</h2>
      ${content.experience.map(exp => `
        <div class="experience-item">
          <div class="experience-header">
            <div>
              <h3>${exp.role}</h3>
              <p class="company">${exp.company}</p>
            </div>
            <span class="duration">${exp.duration}</span>
          </div>
          ${exp.achievements ? `
            <ul class="achievements">
              ${exp.achievements.map(ach => `<li>${ach}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </section>

    <!-- Certifications -->
    ${content.certifications && content.certifications.length > 0 ? `
      <section>
        <h2>Certifications</h2>
        <div class="cert-grid">
          ${content.certifications.map(cert => `
            <div class="cert-item">
              <div class="cert-name">${cert.name}</div>
              <div class="cert-issuer">${cert.issuer}</div>
              <div class="cert-date">${cert.date}</div>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <!-- Skills Summary (from top skills) -->
    ${content.skills && content.skills.length > 0 ? `
      <section>
        <h2>Technical Skills</h2>
        ${(() => {
          const categories: { [key: string]: string[] } = {}
          content.skills.forEach(skill => {
            if (!categories[skill.category]) categories[skill.category] = []
            categories[skill.category].push(skill.technology)
          })
          return Object.entries(categories).map(([cat, techs]) => `
            <div class="skill-category">
              <h3>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
              <div class="skills-list">
                ${techs.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}
              </div>
            </div>
          `).join('')
        })()}
      </section>
    ` : ''}
  </div>
</body>
</html>
  `

  return html
}

/**
 * Generate PDF and trigger download
 * Uses html2pdf library if available
 */
export async function downloadResumePDF(
  content: PortfolioContent,
  config: PDFGenerationConfig = {}
): Promise<void> {
  const { fileName = 'resume.pdf' } = config

  // Generate HTML content
  const html = generateResumeHTML(content, config)

  // Try to use html2pdf if available
  if (typeof window !== 'undefined' && (window as any).html2pdf) {
    const element = document.createElement('div')
    element.innerHTML = html

    const opt = {
      margin: 10,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    }

    return new Promise((resolve, reject) => {
      try {
        ;(window as any).html2pdf().set(opt).from(element).save()
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  // Fallback: Create blob and download
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName.replace('.pdf', '.html')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate resume as plain text
 */
export function generateResumeText(content: PortfolioContent): string {
  const lines: string[] = []

  // Header
  lines.push(content.personalInfo.name.toUpperCase())
  lines.push('='.repeat(content.personalInfo.name.length))
  lines.push('')
  lines.push(content.personalInfo.title)
  lines.push(`${content.personalInfo.location} | ${content.personalInfo.email}`)
  lines.push(`LinkedIn: ${content.personalInfo.linkedin} | GitHub: ${content.personalInfo.github}`)
  lines.push('')

  // Experience
  if (content.experience.length > 0) {
    lines.push('PROFESSIONAL EXPERIENCE')
    lines.push('-'.repeat(21))
    content.experience.forEach(exp => {
      lines.push(``)
      lines.push(`${exp.role}`)
      lines.push(`${exp.company} | ${exp.duration}`)
      if (exp.achievements) {
        exp.achievements.forEach(ach => {
          lines.push(`  • ${ach}`)
        })
      }
    })
    lines.push('')
  }

  // Certifications
  if (content.certifications && content.certifications.length > 0) {
    lines.push('')
    lines.push('CERTIFICATIONS')
    lines.push('-'.repeat(14))
    content.certifications.forEach(cert => {
      lines.push(`${cert.name}`)
      lines.push(`  ${cert.issuer}, ${cert.date}`)
    })
    lines.push('')
  }

  // Skills
  if (content.skills && content.skills.length > 0) {
    lines.push('')
    lines.push('TECHNICAL SKILLS')
    lines.push('-'.repeat(16))
    const categories: { [key: string]: string[] } = {}
    content.skills.forEach(skill => {
      if (!categories[skill.category]) categories[skill.category] = []
      categories[skill.category].push(skill.technology)
    })
    Object.entries(categories).forEach(([cat, techs]) => {
      lines.push(`${cat.charAt(0).toUpperCase() + cat.slice(1)}: ${techs.join(', ')}`)
    })
  }

  return lines.join('\n')
}

/**
 * Download resume as text file
 */
export function downloadResumeText(content: PortfolioContent, fileName = 'resume.txt'): void {
  const text = generateResumeText(content)
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

