import { useState, useRef, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import FormWizard from './components/form/FormWizard'
import LivePreview from './components/preview/LivePreview'
import TemplatePicker from './components/picker/TemplatePicker'
import ImportPdfModal from './components/form/ImportPdfModal'
import ClearConfirmModal from './components/form/ClearConfirmModal'
import LandingPage from './components/landing/LandingPage'
import { defaultResumeData } from './data/defaultResume'
import { sampleResumeData } from './data/sampleResume'
import { templates } from './templates/registry'
import {
  clearSavedDraft,
  loadSavedDraft,
  loadSavedTemplateId,
  saveTemplateId,
  useLocalStorageDraft,
} from './hooks/useLocalStorageDraft'

const BACKUP_STORAGE_KEY = 'student_resume_user_backup'
const DISMISSED_NOTE_KEY = 'resume_storage_notice_dismissed'

// Helper to check if the current data is the sample data
const isSampleData = (data) =>
  data?.personalInfo?.fullName === sampleResumeData.personalInfo.fullName &&
  data?.personalInfo?.email === sampleResumeData.personalInfo.email

export default function App() {
  const [initialData] = useState(() => loadSavedDraft())

  const methods = useForm({
    defaultValues: initialData,
  })

  // Automatically save every form change to localStorage with save status indicator
  const saveStatus = useLocalStorageDraft(methods.watch)

  // One-time dismissible note about browser storage
  const [showStorageNotice, setShowStorageNotice] = useState(() => {
    try {
      return localStorage.getItem(DISMISSED_NOTE_KEY) !== 'true'
    } catch {
      return false
    }
  })

  const handleDismissNotice = () => {
    setShowStorageNotice(false)
    try {
      localStorage.setItem(DISMISSED_NOTE_KEY, 'true')
    } catch {
      // Ignore quota errors
    }
  }

  // Track backup of the user's real data before loading sample
  const [userBackup, setUserBackup] = useState(() => {
    try {
      const raw = localStorage.getItem(BACKUP_STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  // Selected template ID (stored separately from student data)
  const [selectedTemplateId, setSelectedTemplateId] = useState(() =>
    loadSavedTemplateId(templates[0].id)
  )
  const [showLanding, setShowLanding] = useState(true)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  const handleSelectTemplate = (id) => {
    setSelectedTemplateId(id)
    saveTemplateId(id)
  }

  const handleStartBuilder = () => {
    setShowLanding(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectTemplateAndStart = (id) => {
    handleSelectTemplate(id)
    setShowLanding(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenImportFromLanding = () => {
    setShowLanding(false)
    setIsImportModalOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle successful AI PDF extraction and populate form
  const handleImportSuccess = (parsedData) => {
    const current = methods.getValues()
    if (current?.personalInfo?.fullName) {
      try {
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(current))
        setUserBackup(current)
      } catch {
        // Ignore quota errors
      }
    }
    methods.reset(parsedData)
  }

  // Watch current values to know if sample is active
  const currentValues = methods.watch()
  const isSampleActive = isSampleData(currentValues)
  const hasSavedDraft = Boolean(
    currentValues?.personalInfo?.fullName && !isSampleActive
  )

  // Load sample data while automatically saving a backup of user's work
  const handleLoadSample = () => {
    const current = methods.getValues()
    const hasTypedData =
      current?.personalInfo?.fullName && !isSampleData(current)

    if (hasTypedData) {
      // Save user's work into backup so they can restore it anytime
      try {
        localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(current))
        setUserBackup(current)
      } catch {
        // Ignore quota errors
      }
    }

    methods.reset(sampleResumeData)
  }

  const handleLoadSampleAndStart = () => {
    handleLoadSample()
    setShowLanding(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Restore the user's previously typed resume
  const handleRestoreUserData = () => {
    let backupToRestore = userBackup
    if (!backupToRestore) {
      try {
        const raw = localStorage.getItem(BACKUP_STORAGE_KEY)
        if (raw) backupToRestore = JSON.parse(raw)
      } catch {
        backupToRestore = null
      }
    }

    if (backupToRestore) {
      methods.reset(backupToRestore)
      localStorage.removeItem(BACKUP_STORAGE_KEY)
      setUserBackup(null)
    } else {
      // If no backup existed, start with a fresh blank resume
      methods.reset(defaultResumeData)
    }
  }

  // Clear everything & animation states
  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [clearingPhase, setClearingPhase] = useState('idle') // 'idle' | 'out' | 'prepare-in' | 'in' | 'reduced-out' | 'reduced-in'
  const [showUndoNotice, setShowUndoNotice] = useState(false)
  const [wizardKey, setWizardKey] = useState(0)

  const undoDataRef = useRef(null)
  const undoTimeoutRef = useRef(null)
  const moreMenuRef = useRef(null)

  // Close "More" dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target)) {
        setIsMoreMenuOpen(false)
      }
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMoreMenuOpen(false)
      }
    }
    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMoreMenuOpen])

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current)
      }
    }
  }, [])

  const triggerUndoNotice = () => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current)
    }
    setShowUndoNotice(true)
    undoTimeoutRef.current = setTimeout(() => {
      setShowUndoNotice(false)
      undoDataRef.current = null
    }, 5000)
  }

  // Clear animation sequence (about 450ms total):
  // 1. Close dialog first
  // 2. Resume page slides up 24px and fades out (200ms, ease-in); form fades to 0.4
  // 3. At midpoint: actually clear data, reset to step 1
  // 4. Fresh resume page fades in from slightly below (250ms, ease-out); form fades back to 1
  // 5. Show 3s feedback message with Undo button
  const handleConfirmClear = () => {
    setIsClearModalOpen(false)
    setIsClearing(true)

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setClearingPhase('reduced-out')
      setTimeout(() => {
        undoDataRef.current = methods.getValues()
        clearSavedDraft()
        localStorage.removeItem(BACKUP_STORAGE_KEY)
        setUserBackup(null)
        methods.reset(defaultResumeData)
        setWizardKey((prev) => prev + 1)

        setClearingPhase('reduced-in')
        setTimeout(() => {
          setClearingPhase('idle')
          setIsClearing(false)
          triggerUndoNotice()
        }, 50)
      }, 50)
      return
    }

    setClearingPhase('out')

    setTimeout(() => {
      // Midpoint at 200ms: clear data and return to step 1
      undoDataRef.current = methods.getValues()
      clearSavedDraft()
      localStorage.removeItem(BACKUP_STORAGE_KEY)
      setUserBackup(null)
      methods.reset(defaultResumeData)
      setWizardKey((prev) => prev + 1)

      // Position fresh resume page slightly below
      setClearingPhase('prepare-in')

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setClearingPhase('in')

          setTimeout(() => {
            setClearingPhase('idle')
            setIsClearing(false)
            triggerUndoNotice()
          }, 250)
        })
      })
    }, 200)
  }

  const handleUndoClear = () => {
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current)
    }
    if (undoDataRef.current) {
      methods.reset(undoDataRef.current)
      undoDataRef.current = null
    }
    setShowUndoNotice(false)
  }

  return (
    <FormProvider {...methods}>
      {showLanding ? (
        <LandingPage
          hasSavedDraft={hasSavedDraft}
          selectedTemplateId={selectedTemplateId}
          onStartBuilder={handleStartBuilder}
          onSelectTemplateAndStart={handleSelectTemplateAndStart}
          onOpenImportFromLanding={handleOpenImportFromLanding}
          onLoadSampleAndStart={handleLoadSampleAndStart}
        />
      ) : (
        <div className="min-h-screen bg-[#F6F8FA] text-[#1A2233] animate-page-enter">
          {/* Sticky Top Header */}
          <header className="border-b border-[#E3E8EE] bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3.5 sticky top-0 z-20">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="leading-none">
                  <a
                    href="#top"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowLanding(true)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    title="Back to Papel home"
                    className="group inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F4D8F] focus-visible:ring-offset-2 rounded-xs"
                  >
                    <img
                      src="/papel-logo.png"
                      alt=""
                      aria-hidden="true"
                      className="h-6 w-auto sm:h-7 shrink-0 object-contain"
                    />
                    <span className="font-brand font-bold text-lg sm:text-2xl text-[#1A2233] tracking-[-0.02em] group-hover:opacity-85 transition-opacity">
                      Papel
                    </span>
                  </a>
                </h1>
                <p className="text-xs text-[#5B6678] mt-1">
                  Fill in your details once, then switch templates anytime.
                </p>
                <p
                  aria-live="polite"
                  className={`text-[11px] sm:text-xs mt-0.5 ${
                    saveStatus === 'error'
                      ? 'text-[#C0392B] font-medium'
                      : 'text-[#5B6678]'
                  }`}
                >
                  {saveStatus === 'saving'
                    ? 'Saving...'
                    : saveStatus === 'error'
                      ? "Couldn't save. Download your PDF so you don't lose your work."
                      : 'Saved on this device'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Back to Landing Page Button */}
                <button
                  type="button"
                  disabled={isClearing}
                  onClick={() => {
                    setShowLanding(true)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-xs font-medium text-[#1A2233] hover:bg-[#F6F8FA] hover:border-[#CBD5E1] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Home
                </button>

                {/* Import PDF Button */}
                <button
                  type="button"
                  disabled={isClearing}
                  onClick={() => setIsImportModalOpen(true)}
                  className="rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-xs font-medium text-[#1A2233] hover:bg-[#F6F8FA] hover:border-[#CBD5E1] transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Import PDF</span>
                </button>

                {/* Dynamic Sample / Restore Button */}
                {isSampleActive || userBackup ? (
                  <button
                    type="button"
                    disabled={isClearing}
                    onClick={handleRestoreUserData}
                    className="rounded-[6px] bg-[#1F4D8F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#173b6e] transition-colors disabled:opacity-50 shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <span>↩</span>
                    <span>{userBackup ? 'Restore My Data' : 'Clear Sample (Start Blank)'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isClearing}
                    onClick={handleLoadSample}
                    className="rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-xs font-medium text-[#1A2233] hover:bg-[#F6F8FA] hover:border-[#CBD5E1] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    Load Sample
                  </button>
                )}

                {/* "More" Menu Dropdown */}
                <div className="relative" ref={moreMenuRef}>
                  <button
                    type="button"
                    disabled={isClearing}
                    id="more-menu-button"
                    aria-haspopup="menu"
                    aria-expanded={isMoreMenuOpen}
                    onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                    className="rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1.5 text-xs font-medium text-[#1A2233] hover:bg-[#F6F8FA] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    <span>More</span>
                    <span className="text-[10px] text-[#5B6678]">▾</span>
                  </button>

                  {isMoreMenuOpen && (
                    <div
                      role="menu"
                      aria-labelledby="more-menu-button"
                      className="absolute right-0 mt-1.5 w-40 rounded-[10px] border border-[#E3E8EE] bg-white p-1 shadow-lg z-30"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setIsMoreMenuOpen(false)
                          setIsClearModalOpen(true)
                        }}
                        className="w-full text-left rounded-[6px] px-3 py-1.5 text-xs font-medium text-[#C0392B] hover:bg-[#C0392B]/10 cursor-pointer"
                      >
                        Start over
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-[1440px] px-4 sm:px-6 pt-6 pb-24 lg:pb-6 space-y-4">
            {/* Post-clear 3-second feedback notice with Undo */}
            {showUndoNotice && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-[10px] border border-[#E3E8EE] bg-white px-4 py-2.5 text-xs text-[#1A2233] shadow-2xs flex items-center justify-between gap-3 animate-fade-in"
              >
                <span>Cleared. You&apos;re starting fresh.</span>
                <button
                  type="button"
                  onClick={handleUndoClear}
                  className="font-semibold text-[#1F4D8F] underline hover:text-[#173b6e] cursor-pointer px-1.5 py-0.5 rounded focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]"
                >
                  Undo
                </button>
              </div>
            )}

            {/* One-time browser storage note */}
            {showStorageNotice && (
              <div className="rounded-[10px] border border-[#E3E8EE] bg-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5B6678]">
                <span>
                  Your work is saved in this browser only. Clearing your browser data will delete it.
                </span>
                <button
                  type="button"
                  onClick={handleDismissNotice}
                  className="rounded-[6px] border border-[#E3E8EE] bg-[#F6F8FA] px-3 py-1 text-xs font-medium text-[#1A2233] hover:bg-[#EEF2F6] shrink-0 focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] cursor-pointer"
                >
                  Got it
                </button>
              </div>
            )}

          {/* Active Sample Data Notice Banner */}
          {isSampleActive && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span>
                  You are currently previewing sample student data (<strong>{sampleResumeData.personalInfo.fullName}</strong>).
                  {userBackup
                    ? ' Your previous entries were safely saved in the background.'
                    : ' You can replace it with your own details or clear to a blank form.'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isClearing}
                  onClick={handleRestoreUserData}
                  className="rounded bg-amber-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-800 disabled:opacity-50 cursor-pointer"
                >
                  {userBackup ? 'Restore My Data' : 'Clear to Blank Form'}
                </button>
              </div>
            </div>
          )}

          {/* Two-column layout: Form on left (~40%), Preview on right (~60%), stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div
              style={{
                opacity: clearingPhase === 'out' ? 0.4 : 1,
                transition:
                  clearingPhase === 'out'
                    ? 'opacity 200ms ease-in'
                    : clearingPhase === 'in'
                      ? 'opacity 250ms ease-out'
                      : 'none',
              }}
              className="lg:col-span-5 will-change-[opacity]"
            >
              <FormWizard key={wizardKey} disabled={isClearing} />
            </div>

            <div className="lg:col-span-7 lg:sticky lg:top-20">
              <LivePreview
                selectedTemplateId={selectedTemplateId}
                onOpenPicker={() => setIsPickerOpen(true)}
                clearingPhase={clearingPhase}
                isClearing={isClearing}
              />
            </div>
          </div>
        </main>

        {/* Clear Confirmation Modal */}
        <ClearConfirmModal
          isOpen={isClearModalOpen}
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleConfirmClear}
          isClearing={isClearing}
        />

        {/* Template Picker Drawer */}
        <TemplatePicker
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={handleSelectTemplate}
        />

          {/* AI PDF Import Modal */}
          <ImportPdfModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onImportSuccess={handleImportSuccess}
          />
        </div>
      )}
    </FormProvider>
  )
}
