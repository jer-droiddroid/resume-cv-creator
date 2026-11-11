import DocumentFormat from '../form/DocumentFormat'
import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { getTemplateById } from '../../templates/registry'
import HtmlResumePreview from './HtmlResumePreview'
import DownloadButton from './DownloadButton'
import { DEFAULT_SECTIONS } from '../../data/defaultResume'
import { isSectionNonEmpty } from '../../utils/sectionHelpers'
import { hasDraftContent } from '../../utils/draftSafety'
import { getContactItems } from '../../utils/resumeFormatting'

/**
 * LivePreview:
 * Pure HTML paper preview (Option A).
 * - Soft neutral gray background with subtle padding
 * - Sheet of paper with a clean light shadow, crisp edges, and no thick black border
 * - Zero delay/lag when typing
 * - Stays sticky while the form scrolls on the left
 * - Mobile workspace navigation is owned by App
 * - Writing examples are opt-in and never included in PDF output
 */
export default function LivePreview({
  selectedTemplateId,
  onOpenPicker,
  clearingPhase = 'idle',
  isClearing = false,
}) {
  const [showExamples, setShowExamples] = useState(false)
  const { control } = useFormContext()
  const liveFormData = useWatch({ control })

  const template = getTemplateById(selectedTemplateId)

  // Determine if any visible section or contact details are currently empty (showing faded sample placeholders)
  const configuredSections =
    Array.isArray(liveFormData?.sections) && liveFormData.sections.length > 0
      ? liveFormData.sections
      : DEFAULT_SECTIONS

  const visibleSections = configuredSections.filter(
    (sec) => sec.visible !== false && (sec.id !== 'ojt' || liveFormData?.isOjtMode)
  )
  const hasEmptySection = visibleSections.some(
    (sec) => !isSectionNonEmpty(sec.id, liveFormData)
  )
  const contactItems = getContactItems(liveFormData?.personalInfo)
  const hasFadedContent = hasEmptySection || contactItems.length === 0

  // Animation style for the resume paper sheet during "Clear everything"
  const getPaperAnimationStyles = () => {
    if (clearingPhase === 'out') {
      return {
        transform: 'translateY(-24px)',
        opacity: 0,
        transition: 'transform 200ms ease-in, opacity 200ms ease-in',
      }
    }
    if (clearingPhase === 'prepare-in') {
      return {
        transform: 'translateY(16px)',
        opacity: 0,
        transition: 'none',
      }
    }
    if (clearingPhase === 'in') {
      return {
        transform: 'translateY(0)',
        opacity: 1,
        transition: 'transform 250ms ease-out, opacity 250ms ease-out',
      }
    }
    if (clearingPhase === 'reduced-out') {
      return {
        opacity: 0,
        transition: 'opacity 50ms ease-out',
      }
    }
    if (clearingPhase === 'reduced-in') {
      return {
        opacity: 1,
        transition: 'opacity 50ms ease-out',
      }
    }
    return {
      transform: 'none',
      opacity: 1,
      transition: 'none',
    }
  }

  return (
    <>
      <div className="flex flex-col rounded-[10px] border border-border bg-white p-3 sm:p-4 shadow-[0_1px_2px_rgba(16,24,40,0.06)] h-[calc(100vh-6rem)] min-h-[500px]">
        {/* Preview toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 px-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text">
              {template.name}
            </span>

            {/* Segmented Resume / CV button */}
            <DocumentFormat disabled={isClearing} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isClearing}
              onClick={onOpenPicker}
              className="rounded-[6px] border border-border bg-white px-3 py-1.5 text-xs font-medium text-text hover:bg-page hover:border-[#CBD5E1] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Change Template
            </button>

            {/* Desktop Download PDF button */}
            <div className="hidden lg:block">
              <DownloadButton selectedTemplateId={selectedTemplateId} />
            </div>
          </div>
        </div>

        {/* Stage: Soft neutral gray background with clearly visible scrollbar for the paper resume sheet */}
        <div className="flex-1 min-h-0 overflow-y-scroll preview-scrollbar rounded-[8px] bg-[#EEF2F6] p-3 sm:p-6">
          <label className="mb-4 flex min-h-11 items-center gap-2 text-sm text-text-muted">
            <input type="checkbox" checked={showExamples} onChange={(event) => setShowExamples(event.target.checked)} className="accent-accent h-4 w-4" />
            Show writing examples (not included in your PDF)
          </label>
          {showExamples && hasFadedContent && <p role="status" className="mb-3 text-xs text-text-muted">Faded text is a writing example. Only your own details are exported.</p>}
          {!hasDraftContent(liveFormData) && !showExamples && (
            <div className="bg-surface rounded-panel p-8 text-center space-y-3">
              <h2 className="text-lg font-semibold text-text">Your resume starts with you.</h2>
              <p className="text-sm text-text-muted leading-relaxed">Add your name and a way to reach you, then build on your education, projects, and activities. You can turn on writing examples for ideas.</p>
            </div>
          )}
          <div
            style={getPaperAnimationStyles()}
            className={`${!hasDraftContent(liveFormData) && !showExamples ? 'hidden' : ''} w-full max-w-[650px] shrink-0 bg-white rounded-[4px] shadow-[0_8px_24px_rgba(16,24,40,0.08)] border border-border mx-auto mb-10`}
          >
            <HtmlResumePreview
              showExamples={showExamples}
              data={liveFormData}
              theme={template.theme}
              templateId={template.id}
            />
          </div>
        </div>
      </div>

    </>
  )
}
