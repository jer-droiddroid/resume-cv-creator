import { useFormContext, useWatch } from 'react-hook-form'
import { getTemplateById } from '../../templates/registry'
import HtmlResumePreview from './HtmlResumePreview'
import DownloadButton from './DownloadButton'

/**
 * LivePreview:
 * Pure HTML paper preview (Option A).
 * - Soft neutral gray background with subtle padding
 * - Sheet of paper with a clean light shadow, crisp edges, and no thick black border
 * - Zero delay/lag when typing
 * - Stays sticky while the form scrolls on the left
 */
export default function LivePreview({ selectedTemplateId, onOpenPicker }) {
  const { control } = useFormContext()
  const liveFormData = useWatch({ control })

  const template = getTemplateById(selectedTemplateId)
  const isResumeMode = (liveFormData?.documentType || 'resume') === 'resume'

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/80 p-3 sm:p-4 shadow-xs lg:h-[calc(100vh-6rem)]">
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

      {/* Stage: Soft neutral gray background with floating paper resume sheet */}
      <div className="flex-1 overflow-y-auto rounded-xl bg-slate-200/50 p-3 sm:p-6 flex justify-center">
        <div className="w-full max-w-[650px] bg-white rounded-xs shadow-xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden self-start">
          <HtmlResumePreview
            data={liveFormData}
            theme={template.theme}
            templateId={template.id}
          />
        </div>
      </div>
    </div>
  )
}
