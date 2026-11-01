import { generateBullets } from '../data/roleTemplates'
import { getActiveSections } from './sectionHelpers'

/**
 * Estimates the content density of the student's resume so Resume mode
 * can automatically tighten spacing/fonts slightly to keep everything on 1 page.
 */
export function estimateContentScore(data) {
  if (!data) return 0
  const active = getActiveSections(data)
  let score = 0

  if (active.includes('summary') && data.summary) {
    score += Math.ceil(data.summary.length / 100)
  }

  if (active.includes('education')) {
    score += (data.education || []).filter((e) => e.school || e.degree).length * 2
  }

  if (active.includes('experience')) {
    for (const exp of data.experience || []) {
      if (exp.company || exp.title) {
        score += 2 + (exp.bullets || []).filter((b) => b && b.trim()).length
      }
    }
  }

  if (active.includes('organizations')) {
    for (const org of data.organizations || []) {
      if (org.organization || org.title) {
        score += 2 + generateBullets(org, data.currency).length
      }
    }
  }

  if (active.includes('projects')) {
    score += (data.projects || []).filter((p) => p.name || p.description).length * 2.5
  }

  if (active.includes('skills')) score += 1.5
  if (active.includes('awards')) score += (data.awards || []).filter(Boolean).length
  if (active.includes('certifications')) {
    score += (data.certifications || []).filter(Boolean).length
  }

  return score
}

/**
 * In "resume" mode, if the student has a lot of entries, gently scale down
 * spacing and font sizes so the layout fits cleanly onto a single page.
 * In "cv" mode, return the original theme untouched for multi-page output.
 */
export function getFittedTheme(theme, data) {
  if (!data || data.documentType === 'cv') {
    return theme
  }

  const score = estimateContentScore(data)
  if (score <= 18) {
    return theme
  }

  // Scale factor between 0.85 and 0.94 depending on how packed the resume is
  const scale = score > 26 ? 0.85 : 0.91

  return {
    ...theme,
    fontSize: {
      name: Math.round(theme.fontSize.name * scale * 10) / 10,
      sectionHeading: Math.round(theme.fontSize.sectionHeading * scale * 10) / 10,
      itemTitle: Math.round(theme.fontSize.itemTitle * scale * 10) / 10,
      body: Math.round(theme.fontSize.body * scale * 10) / 10,
      small: Math.round(theme.fontSize.small * scale * 10) / 10,
    },
    spacing: {
      pagePadding: Math.max(22, Math.round(theme.spacing.pagePadding * scale)),
      sectionGap: Math.max(6, Math.round(theme.spacing.sectionGap * scale)),
      itemGap: Math.max(4, Math.round(theme.spacing.itemGap * scale)),
      lineHeight: Math.max(1.2, Math.round(theme.spacing.lineHeight * 0.95 * 100) / 100),
    },
  }
}

