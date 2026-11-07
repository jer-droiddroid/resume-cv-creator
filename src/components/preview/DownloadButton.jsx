import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { getTemplateById } from '../../templates/registry'
import { getFittedTheme } from '../../utils/resumeFit'

// Build a clean filename like "Alex_Carter_Resume.pdf" or "Alex_Carter_CV.pdf"
function buildFileName(data) {
  const rawName = data?.personalInfo?.fullName?.trim() || 'Student'
  const safeName = rawName.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '')
  const suffix = data?.documentType === 'cv' ? 'CV' : 'Resume'
  return `${safeName}_${suffix}.pdf`
}

/**
 * Generates and downloads the PDF on demand using @react-pdf/renderer's pdf().toBlob().
 * - Resume mode: fits content to 1 page (`wrap={false}` + auto-fitted spacing).
 * - CV mode: allows multiple pages with "Page X of Y" footer numbers.
 */
export default function DownloadButton({ selectedTemplateId }) {
  const { getValues } = useFormContext()
  const [isGenerating, setIsGenerating] = useState(false)
  const [exportError, setExportError] = useState('')

  const handleDownload = async () => {
    try {
      setIsGenerating(true)
      setExportError('')
      const currentData = getValues()
      const template = getTemplateById(selectedTemplateId)
      const LayoutComponent = template.layout
      const effectiveTheme = getFittedTheme(template.theme, currentData)

      // Lazy-load the PDF generator when exporting
      const { pdf } = await import('@react-pdf/renderer')
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
    } catch (err) {
      console.error('Failed to generate PDF for download:', err)
      setExportError('Could not export PDF. Check your entries and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="inline-flex flex-col items-end">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
      >
        <span>{isGenerating ? 'Preparing PDF...' : 'Download PDF'}</span>
      </button>
      {exportError && (
        <span role="alert" className="mt-1 text-[11px] text-[#C0392B]">
          {exportError}
        </span>
      )}
    </div>
  )
}
