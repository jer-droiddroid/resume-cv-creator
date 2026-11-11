import test from 'node:test'
import assert from 'node:assert/strict'
import { hasDraftContent, getReviewSuggestions } from '../src/utils/draftSafety.js'
import { defaultResumeData } from '../src/data/defaultResume.js'

test('blank defaults and whitespace do not count as a draft', () => {
  assert.equal(hasDraftContent(defaultResumeData), false)
  assert.equal(hasDraftContent({ ...defaultResumeData, summary: '  ' }), false)
})

test('partial drafts count even when the user has not entered a name', () => {
  for (const partial of [
    { personalInfo: { email: 'student@example.com' } },
    { education: [{ details: 'Dean’s list' }] },
    { projects: [{ description: 'Built a campus directory' }] },
    { skills: ['JavaScript'] },
    { ojtInfo: { requiredHours: '486' } },
  ]) {
    assert.equal(hasDraftContent({ ...defaultResumeData, ...partial }), true)
  }
})

test('review calls out missing contact details and malformed email', () => {
  assert.ok(getReviewSuggestions(defaultResumeData).some((message) => message.includes('name')))
  assert.ok(getReviewSuggestions({ personalInfo: { fullName: 'Alex', email: 'broken' } })
    .some((message) => message.includes('Check your email')))
  assert.deepEqual(getReviewSuggestions({
    personalInfo: { fullName: 'Alex', email: 'alex@example.com' },
    education: [{ school: 'State University' }],
  }), [])
})
