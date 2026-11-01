import { useEffect } from 'react'
import { defaultResumeData } from '../data/defaultResume'

const DRAFT_STORAGE_KEY = 'student_resume_cv_draft_v1'
const TEMPLATE_STORAGE_KEY = 'student_resume_cv_template_v1'

/**
 * Reads the saved student draft from localStorage on startup.
 * Falls back to defaultResumeData if nothing is saved yet or if JSON is invalid.
 */
export function loadSavedDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (!raw) return defaultResumeData
    const parsed = JSON.parse(raw)
    return {
      ...defaultResumeData,
      ...parsed,
      personalInfo: {
        ...defaultResumeData.personalInfo,
        ...(parsed.personalInfo || {}),
      },
      sections:
        Array.isArray(parsed.sections) && parsed.sections.length > 0
          ? parsed.sections
          : defaultResumeData.sections,
    }
  } catch {
    return defaultResumeData
  }
}

/**
 * Reads the saved template ID from localStorage.
 */
export function loadSavedTemplateId(fallbackId) {
  try {
    return localStorage.getItem(TEMPLATE_STORAGE_KEY) || fallbackId
  } catch {
    return fallbackId
  }
}

/**
 * Saves the selected template ID to localStorage.
 */
export function saveTemplateId(templateId) {
  try {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, templateId)
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Clears the saved draft from localStorage when the student clicks "Start Over".
 */
export function clearSavedDraft() {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
  } catch {
    // Ignore errors
  }
}

/**
 * Hook that subscribes to react-hook-form changes and automatically saves
 * the draft to localStorage.
 */
export function useLocalStorageDraft(watch) {
  useEffect(() => {
    const subscription = watch((formValues) => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formValues))
      } catch {
        // Ignore storage quota errors
      }
    })

    return () => subscription.unsubscribe()
  }, [watch])
}

