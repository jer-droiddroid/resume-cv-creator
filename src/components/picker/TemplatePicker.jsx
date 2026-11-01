import { useState, useEffect } from 'react'
import { sampleResumeData } from '../../data/sampleResume'
import { TEMPLATE_CATEGORIES, templates } from '../../templates/registry'

/**
 * Miniature visual thumbnail of a template using sampleResumeData.
 */
function TemplateCard({ template, isSelected, onSelect }) {
  const { theme } = template
  const isSidebar = template.id.startsWith('sidebar-')
  const isBanner = template.id.startsWith('banner-')
  const isTwoCol = template.id.startsWith('twocol-')
  const isCompact = template.id.startsWith('compact-')
  const isHarvard = template.id.startsWith('harvard-') || template.id.startsWith('reddit-')

  const fontClass =
    theme.fontFamily === 'Times-Roman'
      ? 'font-serif'
      : theme.fontFamily === 'Courier'
        ? 'font-mono'
        : 'font-sans'

  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      className={`group flex flex-col rounded-xl border text-left transition overflow-hidden cursor-pointer ${
        isSelected
          ? 'border-slate-900 ring-2 ring-slate-900 bg-slate-50'
          : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs'
      }`}
    >
      {/* Thumbnail preview area (uses sampleResumeData) */}
      <div className="relative h-48 w-full bg-slate-100 p-2.5 flex items-center justify-center overflow-hidden border-b border-slate-200">
        <div
          className={`h-full w-34 rounded bg-white shadow-xs border border-slate-200 overflow-hidden flex flex-col text-[5.5px] leading-tight select-none ${fontClass}`}
          style={{ color: theme.textColor }}
        >
          {isBanner ? (
            <div
              className="px-2 py-1.5 text-white"
              style={{ backgroundColor: theme.accentColor }}
            >
              <div className="font-bold text-[7.5px] truncate">
                {sampleResumeData.personalInfo.fullName}
              </div>
              <div className="text-[4.5px] opacity-85 truncate">
                {sampleResumeData.personalInfo.email}
              </div>
            </div>
          ) : isHarvard ? (
            <div className="px-1.5 pt-2 pb-1 text-center border-b" style={{ borderColor: theme.accentColor }}>
              <div
                className="font-bold text-[7.5px] tracking-wide uppercase truncate"
                style={{ color: theme.accentColor }}
              >
                {sampleResumeData.personalInfo.fullName}
              </div>
              <div className="text-[4px] text-slate-500 truncate">
                {sampleResumeData.personalInfo.location} • {sampleResumeData.personalInfo.email}
              </div>
            </div>
          ) : !isSidebar ? (
            <div
              className="px-2 pt-1.5 pb-1 mx-1.5 border-b"
              style={{ borderColor: theme.accentColor }}
            >
              <div
                className="font-bold text-[7.5px] truncate"
                style={{ color: theme.accentColor }}
              >
                {sampleResumeData.personalInfo.fullName}
              </div>
              <div className="text-[4.5px] text-slate-500 truncate">
                {sampleResumeData.personalInfo.email}
              </div>
            </div>
          ) : null}

          {/* Body layout preview */}
          {isSidebar ? (
            <div className="flex flex-1">
              <div
                className="w-[34%] p-1.5 border-r space-y-1"
                style={{
                  backgroundColor: theme.accentLight,
                  borderColor: theme.accentColor,
                }}
              >
                <div
                  className="font-bold text-[6.5px] leading-tight"
                  style={{ color: theme.accentColor }}
                >
                  {sampleResumeData.personalInfo.fullName}
                </div>
                <div className="text-[4px] text-slate-500 truncate">
                  {sampleResumeData.personalInfo.email}
                </div>
                <div className="pt-0.5">
                  <div
                    className="font-bold uppercase text-[4.5px]"
                    style={{ color: theme.accentColor }}
                  >
                    Education
                  </div>
                  <div className="font-semibold truncate">
                    {sampleResumeData.education[0].school}
                  </div>
                </div>
              </div>
              <div className="w-[66%] p-1.5 space-y-1">
                <div>
                  <div
                    className="font-bold uppercase text-[5px]"
                    style={{ color: theme.accentColor }}
                  >
                    Experience
                  </div>
                  <div className="font-semibold truncate">{sampleResumeData.experience[0].title}</div>
                </div>
                <div>
                  <div
                    className="font-bold uppercase text-[5px]"
                    style={{ color: theme.accentColor }}
                  >
                    Leadership
                  </div>
                  <div className="font-semibold truncate">{sampleResumeData.organizations[0].title}</div>
                </div>
              </div>
            </div>
          ) : isTwoCol ? (
            <div className="flex flex-1 p-1.5 gap-1.5">
              <div className="w-[62%] space-y-1">
                <div>
                  <div
                    className="font-bold uppercase text-[5px]"
                    style={{ color: theme.accentColor }}
                  >
                    Experience
                  </div>
                  <div className="font-semibold truncate">{sampleResumeData.experience[0].title}</div>
                </div>
                <div>
                  <div
                    className="font-bold uppercase text-[5px]"
                    style={{ color: theme.accentColor }}
                  >
                    Leadership
                  </div>
                  <div className="font-semibold truncate">{sampleResumeData.organizations[0].title}</div>
                </div>
              </div>
              <div className="w-[38%] space-y-1">
                <div>
                  <div
                    className="font-bold uppercase text-[5px]"
                    style={{ color: theme.accentColor }}
                  >
                    Education
                  </div>
                  <div className="font-semibold truncate">
                    {sampleResumeData.education[0].school}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`flex-1 px-2 py-1.5 ${isCompact ? 'space-y-1' : 'space-y-1.5'}`}>
              <div>
                <div
                  className="font-bold uppercase text-[5px] mb-0.5"
                  style={{
                    color: theme.accentColor,
                    backgroundColor:
                      theme.headingStyle === 'accent-tint' ? theme.accentLight : 'transparent',
                  }}
                >
                  Education
                </div>
                <div className="font-semibold truncate">
                  {sampleResumeData.education[0].school}
                </div>
              </div>
              <div>
                <div
                  className="font-bold uppercase text-[5px] mb-0.5"
                  style={{
                    color: theme.accentColor,
                    backgroundColor:
                      theme.headingStyle === 'accent-tint' ? theme.accentLight : 'transparent',
                  }}
                >
                  Experience
                </div>
                <div className="font-semibold truncate">{sampleResumeData.experience[0].title}</div>
              </div>
            </div>
          )}
        </div>

        {isSelected && (
          <span className="absolute top-2 right-2 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs">
            Selected
          </span>
        )}
      </div>

      {/* Card footer */}
      <div className="p-2.5 flex items-center justify-between">
        <div className="min-w-0 pr-1">
          <p className="text-xs font-semibold text-slate-900 truncate">{template.name}</p>
          <p className="text-[11px] text-slate-500">{template.category}</p>
        </div>
        <span
          className="h-3.5 w-3.5 shrink-0 rounded-full border border-slate-300"
          style={{ backgroundColor: theme.accentColor }}
          title={`Accent: ${theme.name}`}
        />
      </div>
    </button>
  )
}

/**
 * TemplatePicker Drawer:
 * Slides in from the right on desktop, from the bottom on mobile.
 * Selecting a template closes the drawer and updates the preview.
 */
export default function TemplatePicker({ isOpen, onClose, selectedTemplateId, onSelectTemplate }) {
  const [activeCategory, setActiveCategory] = useState('All')

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredTemplates =
    activeCategory === 'All'
      ? templates
      : templates.filter((t) => t.category === activeCategory)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container: slides in from right on desktop, bottom on mobile */}
      <div className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:w-[480px] md:w-[520px] max-h-[85vh] sm:max-h-full bg-white shadow-2xl flex flex-col rounded-t-2xl sm:rounded-none z-10 transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Choose a Template</h2>
            <p className="text-xs text-slate-500">
              Pick a design to instantly change your resume layout.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Thumbnail Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3.5">
            {filteredTemplates.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                isSelected={tpl.id === selectedTemplateId}
                onSelect={(id) => {
                  onSelectTemplate(id)
                  onClose()
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
