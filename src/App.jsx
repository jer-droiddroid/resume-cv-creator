import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import FormWizard from './components/form/FormWizard'
import LivePreview from './components/preview/LivePreview'
import DownloadButton from './components/preview/DownloadButton'
import TemplatePicker from './components/picker/TemplatePicker'
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

// Helper to check if the current data is the sample data
const isSampleData = (data) =>
  data?.personalInfo?.fullName === sampleResumeData.personalInfo.fullName &&
  data?.personalInfo?.email === sampleResumeData.personalInfo.email

export default function App() {
  const [initialData] = useState(() => loadSavedDraft())

  const methods = useForm({
    defaultValues: initialData,
  })

  // Automatically save every form change to localStorage
  useLocalStorageDraft(methods.watch)

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
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const handleSelectTemplate = (id) => {
    setSelectedTemplateId(id)
    saveTemplateId(id)
  }

  // Watch current values to know if sample is active
  const currentValues = methods.watch()
  const isSampleActive = isSampleData(currentValues)

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

  // Reset form back to blank default state and clear localStorage draft & backup
  const handleStartOver = () => {
    const confirmed = window.confirm(
      'Are you sure you want to start blank? This will clear all current entries.'
    )
    if (!confirmed) return
    clearSavedDraft()
    localStorage.removeItem(BACKUP_STORAGE_KEY)
    setUserBackup(null)
    methods.reset(defaultResumeData)
  }

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-slate-100 text-slate-900">
        {/* Sticky Top Header */}
        <header className="border-b border-slate-200 bg-white px-4 sm:px-6 py-3.5 sticky top-0 z-20">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900">
                  Student Resume &amp; CV Creator
                </h1>
                <span className="hidden sm:inline-block rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  Auto-saved locally
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Fill in your details once — switch templates anytime without losing data.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Dynamic Sample / Restore Button */}
              {isSampleActive || userBackup ? (
                <button
                  type="button"
                  onClick={handleRestoreUserData}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <span>↩</span>
                  <span>{userBackup ? 'Restore My Data' : 'Clear Sample (Start Blank)'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Load Sample
                </button>
              )}

              <button
                type="button"
                onClick={handleStartOver}
                className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 cursor-pointer"
              >
                Start Over
              </button>

              <DownloadButton selectedTemplateId={selectedTemplateId} />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6 space-y-4">
          {/* Active Sample Data Notice Banner */}
          {isSampleActive && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">📌</span>
                <span>
                  You are currently previewing sample student data (<strong>Maria Clara Santos</strong>).
                  {userBackup
                    ? ' Your previous entries were safely saved in the background.'
                    : ' You can replace it with your own details or clear to a blank form.'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestoreUserData}
                  className="rounded bg-amber-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-800 cursor-pointer"
                >
                  {userBackup ? 'Restore My Data' : 'Clear to Blank Form'}
                </button>
              </div>
            </div>
          )}

          {/* Two-column layout: Form on left (~40%), Preview on right (~60%), stacked on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-5">
              <FormWizard />
            </div>

            <div className="lg:col-span-7 lg:sticky lg:top-20">
              <LivePreview
                selectedTemplateId={selectedTemplateId}
                onOpenPicker={() => setIsPickerOpen(true)}
              />
            </div>
          </div>
        </main>

        {/* Template Picker Drawer */}
        <TemplatePicker
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          selectedTemplateId={selectedTemplateId}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </FormProvider>
  )
}
