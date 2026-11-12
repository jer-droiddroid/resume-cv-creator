import test from 'node:test'
import assert from 'node:assert/strict'
import { defaultResumeData, DEFAULT_SECTIONS } from '../src/data/defaultResume.js'
import { DEFAULT_OJT_PRESET, OJT_PRESETS, getMatchingPreset, getPortfolioHighlight, getPortfolioUrl, getPresetSections } from '../src/data/ojtPresets.js'
import { getContactItems } from '../src/utils/resumeFormatting.js'
import { hasDraftContent } from '../src/utils/draftSafety.js'

test('OJT presets include all sections once and keep visibility and future sections', () => {
  const original = [...defaultResumeData.sections.map((section) => ({ ...section, visible: section.id !== 'experience' })), { id: 'future-section', visible: false }]
  const before = structuredClone(original)
  for (const preset of OJT_PRESETS) {
    const sections = getPresetSections(preset.id, original)
    assert.equal(sections.length, DEFAULT_SECTIONS.length + 1)
    assert.equal(new Set(sections.map((section) => section.id)).size, sections.length)
    assert.equal(sections.find((section) => section.id === 'experience').visible, false)
    assert.deepEqual(sections.at(-1), { id: 'future-section', visible: false })
    assert.equal(getMatchingPreset(sections), preset.id)
  }
  assert.deepEqual(original, before)
})

test('recommended order emphasizes student qualifications and detects customization', () => {
  const sections = getPresetSections(DEFAULT_OJT_PRESET)
  assert.deepEqual(sections.slice(0, 5).map((section) => section.id), ['summary', 'education', 'skills', 'projects', 'certifications'])
  ;[sections[0], sections[1]] = [sections[1], sections[0]]
  assert.equal(getMatchingPreset(sections), '')
  assert.deepEqual(getPresetSections('unknown', sections), sections)
})

test('portfolio emphasis is limited to the active Portfolio First OJT preset', () => {
  const data = { isOjtMode: true, ojtPreset: 'portfolio-first', personalInfo: { email: 'name@example.com', portfolio: ' mysite.test/work ' } }
  assert.equal(getPortfolioHighlight(data), 'mysite.test/work')
  assert.equal(getPortfolioHighlight({ ...data, isOjtMode: false }), '')
  assert.equal(getPortfolioHighlight({ ...data, ojtPreset: 'experience-first' }), '')
  assert.deepEqual(getContactItems(data.personalInfo, { hidePortfolio: true }), ['name@example.com'])
  assert.equal(getContactItems(data.personalInfo).length, 2)
})

test('portfolio links accept web URLs and reject executable protocols', () => {
  assert.equal(getPortfolioUrl('behance.net/student'), 'https://behance.net/student')
  assert.equal(getPortfolioUrl('https://example.com/work'), 'https://example.com/work')
  assert.equal(getPortfolioUrl('javascript:alert(1)'), undefined)
  assert.equal(getPortfolioUrl('data:text/html,hello'), undefined)
})

test('preset and course-guide preferences alone do not become resume content', () => {
  const data = { ...defaultResumeData, isOjtMode: true, ojtPreset: DEFAULT_OJT_PRESET, sections: getPresetSections(DEFAULT_OJT_PRESET), ojtInfo: { ...defaultResumeData.ojtInfo, writingGuide: 'multimedia' } }
  assert.equal(hasDraftContent(data), false)
  assert.equal(hasDraftContent({ ...data, ojtInfo: { ...data.ojtInfo, requiredHours: '486' } }), true)
})
