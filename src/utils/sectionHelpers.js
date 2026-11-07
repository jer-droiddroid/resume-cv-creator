import { DEFAULT_SECTIONS } from '../data/defaultResume'

// Helper to check if a string has real text
const hasText = (str) => typeof str === 'string' && str.trim().length > 0

/**
 * Checks whether a section has actual content entered by the student.
 * Empty items inside arrays (like a blank education row) are ignored.
 */
export function isSectionNonEmpty(sectionId, data) {
  if (!data) return false

  switch (sectionId) {
    case 'summary':
      return hasText(data.summary)

    case 'education':
      return (
        Array.isArray(data.education) &&
        data.education.some((item) => hasText(item.school) || hasText(item.degree))
      )

    case 'experience':
      return (
        Array.isArray(data.experience) &&
        data.experience.some((item) => hasText(item.company) || hasText(item.title))
      )

    case 'organizations':
      return (
        Array.isArray(data.organizations) &&
        data.organizations.some((item) => hasText(item.organization) || hasText(item.title))
      )

    case 'projects':
      return (
        Array.isArray(data.projects) &&
        data.projects.some((item) => hasText(item.name) || hasText(item.description))
      )

    case 'skills':
      return Array.isArray(data.skills) && data.skills.some(hasText)

    case 'awards':
      return Array.isArray(data.awards) && data.awards.some(hasText)

    case 'certifications':
      return Array.isArray(data.certifications) && data.certifications.some(hasText)

    case 'ojt':
      return (
        hasText(data.ojtInfo?.requiredHours) ||
        hasText(data.ojtInfo?.preferredStartDate)
      )

    default:
      return false
  }
}

/**
 * Returns the ordered list of section IDs that are BOTH:
 * 1. Marked visible in data.sections
 * 2. Non-empty in data
 */
export function getActiveSections(data) {
  const configuredSections =
    Array.isArray(data?.sections) && data.sections.length > 0
      ? data.sections
      : DEFAULT_SECTIONS

  return configuredSections
    .filter((sec) => sec.visible && isSectionNonEmpty(sec.id, data))
    .map((sec) => sec.id)
}

const SUFFIX_TOKENS = new Set(['JR', 'JR.', 'SR', 'SR.', 'II', 'III', 'IV', 'V'])

/**
 * Formats a clean PDF filename.
 * - Standard mode: "Alex_Carter_Resume.pdf" or "Alex_Carter_CV.pdf"
 * - OJT mode: "Lastname_Firstname_BSIT_OJT_Resume.pdf"
 */
export function buildFileName(data) {
  const rawName = data?.personalInfo?.fullName?.trim() || ''
  const suffix = data?.documentType === 'cv' ? 'CV' : 'Resume'
  const isOjt =
    Boolean(data?.isOjtMode) ||
    Boolean(data?.ojtInfo?.courseCode?.trim()) ||
    Boolean(data?.ojtInfo?.requiredHours?.trim())

  const sanitize = (str) =>
    (str || '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')

  if (isOjt) {
    let lastName = 'Lastname'
    let firstName = 'Firstname'

    if (rawName) {
      if (rawName.includes(',')) {
        const [lastPart, ...restParts] = rawName.split(',')
        lastName = sanitize(lastPart) || 'Lastname'
        firstName = sanitize(restParts.join(' ')) || 'Firstname'
      } else {
        const parts = rawName.split(/\s+/).filter(Boolean)
        if (parts.length === 1) {
          lastName = sanitize(parts[0])
          firstName = ''
        } else {
          let endIdx = parts.length - 1
          if (parts.length > 2 && SUFFIX_TOKENS.has(parts[endIdx].toUpperCase())) {
            endIdx -= 1
          }
          lastName = sanitize(parts[endIdx])
          firstName = sanitize(parts.slice(0, endIdx).join('_'))
        }
      }
    }

    const courseCode = sanitize(data?.ojtInfo?.courseCode?.trim().toUpperCase())
    const segments = [lastName, firstName, courseCode, 'OJT', suffix].filter(Boolean)
    return `${segments.join('_')}.pdf`
  }

  const safeName = sanitize(rawName) || 'Student'
  return `${safeName}_${suffix}.pdf`
}
