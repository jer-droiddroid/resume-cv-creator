import { defaultResumeData } from '../data/defaultResume.js'

const hasValue = (value) => {
  if (typeof value === 'string') return value.trim().length > 0
  if (typeof value === 'number') return Number.isFinite(value)
  if (Array.isArray(value)) return value.some(hasValue)
  return value && typeof value === 'object' ? Object.values(value).some(hasValue) : false
}

export function hasDraftContent(data) {
  if (!data) return false
  return ['personalInfo', 'summary', 'education', 'experience', 'organizations', 'projects', 'skills', 'awards', 'certifications', 'ojtInfo']
    .some((key) => JSON.stringify(data[key]) !== JSON.stringify(defaultResumeData[key]) && hasValue(data[key]))
}

export function getReviewSuggestions(data) {
  const suggestions = []
  if (!data?.personalInfo?.fullName?.trim()) suggestions.push('Add your name so employers know whose resume this is.')
  const email = data?.personalInfo?.email?.trim()
  if (!email && !data?.personalInfo?.phone?.trim()) suggestions.push('Add an email address or phone number so employers can reach you.')
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) suggestions.push('Check your email address before sharing your resume.')
  if (!data?.education?.some((item) => item.school?.trim() || item.degree?.trim())) suggestions.push('Consider adding your education, including a course still in progress.')
  return suggestions
}
