import { DEFAULT_SECTIONS } from './defaultResume.js'

export const OJT_PRESETS = [
  {
    id: 'skills-projects',
    name: 'Skills & Projects First',
    description: 'A starting point for students with limited work experience. Lead with education, skills, and projects.',
    order: ['summary', 'education', 'skills', 'projects', 'certifications', 'experience', 'organizations', 'awards', 'ojt'],
  },
  {
    id: 'experience-first',
    name: 'Experience First',
    description: 'For relevant jobs, internships, or practical training. Put your experience near the top.',
    order: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'organizations', 'awards', 'ojt'],
  },
  {
    id: 'portfolio-first',
    name: 'Portfolio First',
    description: 'For design and multimedia applications. Highlight your portfolio link and selected projects.',
    order: ['summary', 'projects', 'skills', 'education', 'experience', 'certifications', 'organizations', 'awards', 'ojt'],
  },
]

export const DEFAULT_OJT_PRESET = OJT_PRESETS[0].id

// Only reorder sections: preserve visibility, additional fields, and future sections.
export function getPresetSections(presetId, sections = DEFAULT_SECTIONS) {
  const preset = OJT_PRESETS.find((item) => item.id === presetId)
  if (!preset) return sections.map((section) => ({ ...section }))
  const existing = new Map(sections.map((section) => [section.id, section]))
  const ordered = preset.order.map((id) => ({
    id,
    visible: true,
    ...existing.get(id),
  }))
  return [...ordered, ...sections.filter((section) => !preset.order.includes(section.id)).map((section) => ({ ...section }))]
}

export function getMatchingPreset(sections = []) {
  return OJT_PRESETS.find((preset) =>
    preset.order.join(',') === sections.filter((section) => preset.order.includes(section.id)).map((section) => section.id).join(',')
  )?.id || ''
}

export function getPortfolioHighlight(data) {
  return data?.isOjtMode && data?.ojtPreset === 'portfolio-first'
    ? data.personalInfo?.portfolio?.trim() || ''
    : ''
}

// Limit clickable portfolio URLs to web protocols; plain hostnames are supported.
export function getPortfolioUrl(value) {
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`
  try {
    const url = new URL(candidate)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined
  } catch {
    return undefined
  }
}
