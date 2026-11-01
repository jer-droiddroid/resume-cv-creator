import { useMemo } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { BlobProvider } from '@react-pdf/renderer'
import { useDebounce } from '../../hooks/useDebounce'
import { getTemplateById } from '../../templates/registry'
import { estimateContentScore, getFittedTheme } from '../../utils/resumeFit'
import DownloadButton from './DownloadButton'

/**
 * Renders the live PDF preview on the right half of the screen (or stacked below on mobile).
 * Uses a 500ms debounce on form values so typing stays fast and smooth,
 * while switching templates updates immediately.
 */
export default function LivePreview({ selectedTemplateId, onOpenPicker }) {
  const { control } = useFormContext()
  const liveFormData = useWatch({ control })
  const debouncedData = useDebounce(liveFormData, 500)

  const template = getTemplateById(selectedTemplateId)
  const LayoutComponent = template.layout

  // Apply 1-page auto-fit scaling when in "resume" mode
  const effectiveTheme = useMemo(
    () => getFittedTheme(template.theme, debouncedData),
    [template.theme, debouncedData]
  )

  const isResumeMode = (debouncedData?.documentType || 'resume') === 'resume'
  const contentScore = estimateContentScore(debouncedData)

  // Memoize the PDF document element so BlobProvider only re-generates when
  // debounced form data or the selected template changes.
  const pdfDocument = useMemo(
    () => <LayoutComponent data={debouncedData} theme={effectiveTheme} />,
    [LayoutComponent, debouncedData, effectiveTheme]
  )

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/70 p-3 sm:p-4 shadow-xs h-[600px] sm:h-[720px] lg:h-[calc(100vh-6.5rem)]">
      {/* Preview toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-800">
            {template.name}
          </span>
          <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {isResumeMode ? '1-Page Resume' : 'Multi-Page CV'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPicker}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Change Template
          </button>
          <DownloadButton selectedTemplateId={selectedTemplateId} />
        </div>
      </div>

      {/* Helpful notice if Resume mode is getting very dense */}
      {isResumeMode && contentScore > 26 && (
        <div className="mb-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-[11px] text-amber-800">
          Tip: Content is dense for 1 page. Spacing was tightened automatically.
        </div>
      )}

      {/* Paper Container: Soft gray stage with floating white paper sheet */}
      <div className="flex-1 rounded-xl bg-slate-200/50 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
        <div className="h-full w-full bg-white rounded-sm shadow-xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden relative">
          <BlobProvider document={pdfDocument}>
            {({ url, loading, error }) => {
              if (error) {
                return (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm text-red-600">
                    Failed to render PDF preview: {error.message}
                  </div>
                )
              }

              if (loading || !url) {
                return (
                  <div className="flex h-full items-center justify-center text-xs text-slate-500">
                    Updating PDF preview...
                  </div>
                )
              }

              return (
                <iframe
                  src={`${url}#toolbar=0&navpanes=0&view=FitH`}
                  title="Live Resume PDF Preview"
                  className="h-full w-full border-0"
                />
              )
            }}
          </BlobProvider>
        </div>
      </div>
    </div>
  )
}
