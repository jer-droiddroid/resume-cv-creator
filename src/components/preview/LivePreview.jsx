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
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden h-[520px] sm:h-[680px] lg:h-[780px]">
      {/* Preview toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-slate-800">
            {template.name}
          </span>
          <span className="rounded bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
            {isResumeMode ? '1-Page Resume' : 'Multi-Page CV'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPicker}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Change Template
          </button>
          <DownloadButton selectedTemplateId={selectedTemplateId} />
        </div>
      </div>

      {/* Helpful notice if Resume mode is getting very dense */}
      {isResumeMode && contentScore > 26 && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-[11px] text-amber-800">
          Tip: You have a lot of entries for a 1-page resume. Spacing was tightened automatically — or try a <strong>Compact</strong> template or switch to <strong>CV mode</strong>.
        </div>
      )}

      {/* PDF Viewer area */}
      <div className="flex-1 bg-slate-200/70 relative">
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
                src={`${url}#toolbar=0&navpanes=0`}
                title="Live Resume PDF Preview"
                className="h-full w-full border-0"
              />
            )
          }}
        </BlobProvider>
      </div>
    </div>
  )
}
