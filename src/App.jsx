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

export default function App() {
  // Initialize react-hook-form with any saved draft from localStorage
  const methods = useForm({
    defaultValues: loadSavedDraft(),
  })

  // Automatically save every form change to localStorage
  useLocalStorageDraft(methods.watch)

  // Selected template ID (stored separately from student data)
  const [selectedTemplateId, setSelectedTemplateId] = useState(() =>
    loadSavedTemplateId(templates[0].id)
  )
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  const handleSelectTemplate = (id) => {
    setSelectedTemplateId(id)
    saveTemplateId(id)
  }

  // Reset form back to blank default state and clear localStorage draft
  const handleStartOver = () => {
    const confirmed = window.confirm(
      'Are you sure you want to start over? This will clear all your current entries.'
    )
    if (!confirmed) return
    clearSavedDraft()
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
              <button
                type="button"
                onClick={() => setIsPickerOpen((prev) => !prev)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {isPickerOpen ? 'Hide Templates' : `Templates (${templates.length})`}
              </button>

              <button
                type="button"
                onClick={() => methods.reset(sampleResumeData)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Load Sample
              </button>

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

        <main className="mx-auto max-w-7xl p-4 sm:p-6 space-y-6">
          {/* Collapsible Template Picker Drawer */}
          {isPickerOpen && (
            <TemplatePicker
              selectedTemplateId={selectedTemplateId}
              onSelectTemplate={handleSelectTemplate}
            />
          )}

          {/* Responsive Layout: Stacked on mobile (<1024px), side-by-side split screen on desktop (lg+) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6">
              <FormWizard />
            </div>

            <div className="lg:col-span-6 lg:sticky lg:top-20">
              <LivePreview
                selectedTemplateId={selectedTemplateId}
                onOpenPicker={() => setIsPickerOpen((prev) => !prev)}
              />
            </div>
          </div>
        </main>
      </div>
    </FormProvider>
  )
}
