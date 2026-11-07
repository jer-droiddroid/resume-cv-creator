import { useEffect, useState, useRef } from 'react'
import { defaultResumeData, DEFAULT_SECTIONS } from '../data/defaultResume'
import { sampleResumeData } from '../data/sampleResume'

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

    // Migrate legacy sample data ("Maria Clara Santos") to the new universal sample
    if (
      parsed?.personalInfo?.fullName === 'Maria Clara Santos' ||
      parsed?.personalInfo?.email === 'maria.santos@university.edu.ph'
    ) {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(sampleResumeData))
      return sampleResumeData
    }

    // If blank form still had legacy PHP currency default, update to USD
    if (!parsed?.personalInfo?.fullName && parsed?.currency === 'PHP') {
      parsed.currency = 'USD'
    }

    // Sanitize sections so UUIDs never overwrite real section identifiers
    const validKeys = new Set(DEFAULT_SECTIONS.map((s) => s.id))

    let sections = defaultResumeData.sections
    if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
      sections = parsed.sections.map((sec, idx) => {
        const fallback = defaultResumeData.sections[idx] || { id: 'summary', visible: true }
        const effectiveId = validKeys.has(sec.id) ? sec.id : fallback.id
        return {
          id: effectiveId,
          visible: typeof sec.visible === 'boolean' ? sec.visible : true,
        }
      })
      // Append any newly introduced sections (such as 'ojt') if missing from saved draft
      const existingIds = new Set(sections.map((s) => s.id))
      for (const defSec of DEFAULT_SECTIONS) {
        if (!existingIds.has(defSec.id)) {
          sections.push({ id: defSec.id, visible: defSec.visible })
        }
      }
    }

    return {
      ...defaultResumeData,
      ...parsed,
      ojtInfo: {
        ...defaultResumeData.ojtInfo,
        ...(parsed.ojtInfo || {}),
      },
      personalInfo: {
        ...defaultResumeData.personalInfo,
        ...(parsed.personalInfo || {}),
      },
      sections,
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
 * Returns save status: 'saved' | 'saving' | 'error'
 */
export function useLocalStorageDraft(watch) {
  const [saveStatus, setSaveStatus] = useState('saved')
  const resetTimerRef = useRef(null)

  useEffect(() => {
    const subscription = watch((formValues) => {
      try {
        // Immediately save data synchronously without delay
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formValues))
        setSaveStatus('saving')

        // Return to "Saved on this device" after ~1 second
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
        resetTimerRef.current = setTimeout(() => {
          setSaveStatus('saved')
        }, 1000)
      } catch {
        setSaveStatus('error')
      }
    })

    return () => {
      subscription.unsubscribe()
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [watch])

  return saveStatus
}
