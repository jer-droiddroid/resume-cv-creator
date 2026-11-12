// Format start and end dates neatly (e.g., "Aug 2023 – Present")
export const formatDateRange = (start, end) => {
  if (start && end) return `${start} – ${end}`
  return start || end || ''
}

// Gather non-empty contact strings from personalInfo
export const getContactItems = (personalInfo = {}, { hidePortfolio = false } = {}) =>
  [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    hidePortfolio ? '' : personalInfo.portfolio,
  ].filter((item) => item && item.trim())

