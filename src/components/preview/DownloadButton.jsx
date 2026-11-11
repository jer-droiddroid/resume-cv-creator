import { useState, useRef, useEffect } from 'react'
import Modal from '../Modal'
import { hasDraftContent, getReviewSuggestions } from '../../utils/draftSafety'
import { loadPdfLayout } from '../../templates/pdfLayouts'
import { useFormContext, useWatch } from 'react-hook-form'
import { getTemplateById } from '../../templates/registry'
import { getFittedTheme } from '../../utils/resumeFit'
import { buildFileName } from '../../utils/sectionHelpers'

/**
 * Generates and downloads the PDF on demand using @react-pdf/renderer's pdf().toBlob().
 * - Resume mode: uses compact fitted spacing; users review page length after export.
 * - CV mode: allows multiple pages with "Page X of Y" footer numbers.
 */
export default function DownloadButton({ selectedTemplateId }) {
  const { getValues, control } = useFormContext()
  const currentData = useWatch({ control })
  const [showReview, setShowReview] = useState(false)
  const reviewSuggestions = getReviewSuggestions(currentData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [exportError, setExportError] = useState('')
  const downloadedTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (downloadedTimeoutRef.current) {
        clearTimeout(downloadedTimeoutRef.current)
      }
    }
  }, [])

  const handleDownload = async () => {
    try {
      setIsGenerating(true)
      setIsDownloaded(false)
      setExportError('')
      const currentData = getValues()
      const template = getTemplateById(selectedTemplateId)
      const effectiveTheme = getFittedTheme(template.theme, currentData)

      // Lazy-load the PDF generator when exporting
      const [{ pdf }, LayoutComponent] = await Promise.all([
        import('@react-pdf/renderer'), loadPdfLayout(template.layout),
      ])
      const blob = await pdf(
        <LayoutComponent data={currentData} theme={effectiveTheme} />
      ).toBlob()

      // Trigger browser file download
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = buildFileName(currentData)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setShowReview(false)
      setIsDownloaded(true)
      if (downloadedTimeoutRef.current) {
        clearTimeout(downloadedTimeoutRef.current)
      }
      downloadedTimeoutRef.current = setTimeout(() => {
        setIsDownloaded(false)
      }, 2500)
    } catch (err) {
      console.error('Failed to generate PDF for download:', err)
      setExportError('Your draft is safe. The PDF could not be created. Try downloading again; if it still fails, try another template.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={() => setShowReview(true)}
        disabled={isGenerating}
        aria-live="polite"
        className="inline-flex items-center gap-1.5 rounded-[6px] bg-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-accent-hover hover:-translate-y-[0.5px] active:translate-y-[0.5px] focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 disabled:opacity-50 cursor-pointer"
      >
        {isDownloaded && !isGenerating && (
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 shrink-0"
          >
            <path d="m3.5 8.5 3 3 6-6.5" />
          </svg>
        )}
        <span>
          {isGenerating
            ? 'Preparing PDF...'
            : isDownloaded
              ? 'Downloaded PDF'
              : 'Download PDF'}
        </span>
      </button>
      {showReview && (
        <Modal labelledBy="export-review-title" onClose={isGenerating ? undefined : () => setShowReview(false)}>
          <div className="fixed inset-0 bg-text/40" onClick={isGenerating ? undefined : () => setShowReview(false)} />
          <div className="relative flex min-h-full items-center justify-center p-4 pointer-events-none">
            <div className="w-full max-w-lg rounded-panel bg-surface p-6 space-y-5 shadow-xl pointer-events-auto">
              <h2 id="export-review-title" className="text-lg font-semibold text-text">Review before you download</h2>
              <p className="text-sm leading-relaxed text-text-muted">Your PDF includes only your own details. Writing examples are never exported. Check spelling, contact details, and page length before sending it.</p>
              {!hasDraftContent(currentData) ? <p role="status" className="text-sm text-error">Your resume is empty. Add your details before downloading.</p> : reviewSuggestions.length > 0 ? (
                <div className="space-y-2 text-sm text-text">
                  <p className="font-semibold">A few things to check</p>
                  <ul className="list-disc space-y-2 pl-5">{reviewSuggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}</ul>
                  <p className="text-xs text-text-muted">These are suggestions. You can still download your draft.</p>
                </div>
              ) : <p className="text-sm text-text">Your name, contact details, and education are filled in. Give the preview a final read.</p>}
              {exportError && <p role="alert" className="text-sm text-error">{exportError}</p>}
              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" disabled={isGenerating} onClick={() => setShowReview(false)} className="rounded-input border border-border px-4 py-2 text-sm text-text">Back to resume</button>
                <button type="button" disabled={isGenerating || !hasDraftContent(currentData)} onClick={handleDownload} className="rounded-input bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                  {isGenerating ? 'Preparing PDF?' : reviewSuggestions.length ? 'Download draft' : 'Download PDF'}
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {exportError && !showReview && (
        <span role="alert" className="mt-1 text-xs text-error">
          {exportError}
        </span>
      )}
    </div>
  )
}
