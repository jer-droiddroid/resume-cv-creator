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

