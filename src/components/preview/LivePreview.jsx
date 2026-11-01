import { useFormContext, useWatch } from 'react-hook-form'
import { getTemplateById } from '../../templates/registry'
import HtmlResumePreview from './HtmlResumePreview'
import DownloadButton from './DownloadButton'
import { DEFAULT_SECTIONS } from '../../data/defaultResume'
import { isSectionNonEmpty } from '../../utils/sectionHelpers'
import { getContactItems } from '../../templates/sectionRenderer'

/**
 * LivePreview:
 * Pure HTML paper preview (Option A).
 * - Soft neutral gray background with subtle padding
 * - Sheet of paper with a clean light shadow, crisp edges, and no thick black border
 * - Zero delay/lag when typing
 * - Stays sticky while the form scrolls on the left
 * - Mobile sticky "Download PDF" bar docked at the bottom of the screen
 * - Shows faded sample placeholder content for empty sections with a small helper note
 */
export default function LivePreview({
  selectedTemplateId,
  onOpenPicker,
  clearingPhase = 'idle',
  isClearing = false,
}) {
  const { control, setValue } = useFormContext()
  const liveFormData = useWatch({ control })

  const template = getTemplateById(selectedTemplateId)
  const isResumeMode = (liveFormData?.documentType || 'resume') === 'resume'

  // Determine if any visible section or contact details are currently empty (showing faded sample placeholders)
  const configuredSections =
    Array.isArray(liveFormData?.sections) && liveFormData.sections.length > 0
      ? liveFormData.sections
      : DEFAULT_SECTIONS

  const visibleSections = configuredSections.filter((sec) => sec.visible !== false)
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
      <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/80 p-3 sm:p-4 shadow-xs h-[calc(100vh-6rem)] min-h-[500px]">
        {/* Preview toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 px-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-800">
              {template.name}
            </span>

            {/* Segmented Resume / CV button */}
            <div
              role="radiogroup"
              aria-label="Document format"
              className="inline-flex rounded-md bg-white border border-slate-300 p-0.5 text-xs shadow-2xs"
            >
              <button
                type="button"
                role="radio"
                disabled={isClearing}
                aria-checked={isResumeMode}
                onClick={() => setValue('documentType', 'resume', { shouldDirty: true })}
                className={`rounded px-2.5 py-1 text-xs font-medium transition cursor-pointer disabled:opacity-50 ${
                  isResumeMode
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Resume
              </button>
              <button
                type="button"
                role="radio"
                disabled={isClearing}
                aria-checked={!isResumeMode}
                onClick={() => setValue('documentType', 'cv', { shouldDirty: true })}
                className={`rounded px-2.5 py-1 text-xs font-medium transition cursor-pointer disabled:opacity-50 ${
                  !isResumeMode
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                CV
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isClearing}
              onClick={onOpenPicker}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
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
        <div className="flex-1 min-h-0 overflow-y-scroll preview-scrollbar rounded-xl bg-slate-200/50 p-3 sm:p-6">
          {hasFadedContent && (
            <p className="text-xs text-slate-500 mb-3 text-center select-none">
              Faded text is an example. It disappears as you fill in your own.
            </p>
          )}
          <div
            style={getPaperAnimationStyles()}
            className="w-full max-w-[650px] shrink-0 bg-white rounded-xs shadow-xl shadow-slate-900/10 border border-slate-200/60 mx-auto mb-10 will-change-[transform,opacity]"
          >
            <HtmlResumePreview
              data={liveFormData}
              theme={template.theme}
              templateId={template.id}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky Download PDF action bar */}
      <div className="fixed bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl flex items-center justify-between gap-2 z-30 lg:hidden">
        <div className="min-w-0">
          <div className="text-xs font-semibold text-slate-900 truncate">
            {template.name}
          </div>
          <div
            role="radiogroup"
            aria-label="Document format"
            className="inline-flex rounded-md bg-slate-100 border border-slate-200 p-0.5 text-[11px] mt-1"
          >
            <button
              type="button"
              role="radio"
              aria-checked={isResumeMode}
              onClick={() => setValue('documentType', 'resume', { shouldDirty: true })}
              className={`rounded px-2 py-0.5 font-medium transition cursor-pointer ${
                isResumeMode
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resume
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={!isResumeMode}
              onClick={() => setValue('documentType', 'cv', { shouldDirty: true })}
              className={`rounded px-2 py-0.5 font-medium transition cursor-pointer ${
                !isResumeMode
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CV
            </button>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPicker}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Change
          </button>
          <DownloadButton selectedTemplateId={selectedTemplateId} />
        </div>
      </div>
    </>
  )
}
