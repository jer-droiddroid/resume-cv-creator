import { useState } from 'react'
import { BlobProvider } from '@react-pdf/renderer'
import { sampleResumeData } from '../../data/sampleResume'
import { TEMPLATE_CATEGORIES, templates } from '../../templates/registry'

/**
 * Miniature visual thumbnail of a template using sampleResumeData (never the student's data).
 * Includes an optional "Live PDF Thumbnail" toggle for rendering the actual @react-pdf/renderer
 * sample document inside the card, plus an instant scaled mini-sheet preview.
 */
function TemplateCard({ template, isSelected, onSelect, showPdfThumbnails }) {
  const { theme } = template
  const LayoutComponent = template.layout
  const isSidebar = template.id.startsWith('sidebar-')
  const isBanner = template.id.startsWith('banner-')
  const isTwoCol = template.id.startsWith('twocol-')
  const isCompact = template.id.startsWith('compact-')

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
          : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm'
      }`}
    >
      {/* Thumbnail preview area (uses sampleResumeData) */}
      <div className="relative h-56 w-full bg-slate-100 p-3 flex items-center justify-center overflow-hidden border-b border-slate-200">
        {showPdfThumbnails ? (
          <BlobProvider document={<LayoutComponent data={sampleResumeData} theme={theme} />}>
            {({ url, loading }) =>
              loading || !url ? (
                <span className="text-[11px] text-slate-400">Rendering sample PDF...</span>
              ) : (
                <iframe
                  src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  title={template.name}
                  className="h-full w-full border-0 pointer-events-none rounded shadow-xs bg-white"
                />
              )
            }
          </BlobProvider>
        ) : (
          /* Fast mini-sheet representation built from sampleResumeData + template's layout & theme */
          <div
            className={`h-full w-38 rounded bg-white shadow-xs border border-slate-200 overflow-hidden flex flex-col text-[6px] leading-tight select-none ${fontClass}`}
            style={{ color: theme.textColor }}
          >
            {isBanner ? (
              <div
                className="px-2.5 py-2 text-white"
                style={{ backgroundColor: theme.accentColor }}
              >
                <div className="font-bold text-[8px] truncate">
                  {sampleResumeData.personalInfo.fullName}
                </div>
                <div className="text-[5px] opacity-85 truncate">
                  {sampleResumeData.personalInfo.email} • {sampleResumeData.personalInfo.location}
                </div>
              </div>
            ) : !isSidebar ? (
              <div
                className="px-2.5 pt-2 pb-1 mx-2 border-b"
                style={{ borderColor: theme.accentColor }}
              >
                <div
                  className="font-bold text-[8px] truncate"
                  style={{ color: theme.accentColor }}
                >
                  {sampleResumeData.personalInfo.fullName}
                </div>
                <div className="text-[5px] text-slate-500 truncate">
                  {sampleResumeData.personalInfo.email} • {sampleResumeData.personalInfo.phone}
                </div>
              </div>
            ) : null}

            {/* Body layout preview */}
            {isSidebar ? (
              <div className="flex flex-1">
                <div
                  className="w-[34%] p-1.5 border-r space-y-1.5"
                  style={{
                    backgroundColor: theme.accentLight,
                    borderColor: theme.accentColor,
                  }}
                >
                  <div
                    className="font-bold text-[7px] leading-tight"
                    style={{ color: theme.accentColor }}
                  >
                    {sampleResumeData.personalInfo.fullName}
                  </div>
                  <div className="text-[4.5px] text-slate-500 truncate">
                    {sampleResumeData.personalInfo.email}
                  </div>
                  <div className="pt-1">
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
                  <div>
                    <div
                      className="font-bold uppercase text-[5px]"
                      style={{ color: theme.accentColor }}
                    >
                      Skills
                    </div>
                    <div className="text-[5px]">{sampleResumeData.skills.slice(0, 4).join(', ')}</div>
                  </div>
                </div>
                <div className="w-[66%] p-2 space-y-1.5">
                  <div>
                    <div
                      className="font-bold uppercase text-[5.5px]"
                      style={{ color: theme.accentColor }}
                    >
                      Summary
                    </div>
                    <div className="line-clamp-2 text-[5px] text-slate-600">
                      {sampleResumeData.summary}
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-bold uppercase text-[5.5px]"
                      style={{ color: theme.accentColor }}
                    >
                      Experience
                    </div>
                    <div className="font-semibold">{sampleResumeData.experience[0].title}</div>
                    <div className="text-[5px] text-slate-500">
                      {sampleResumeData.experience[0].company}
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-bold uppercase text-[5.5px]"
                      style={{ color: theme.accentColor }}
                    >
                      Leadership
                    </div>
                    <div className="font-semibold">{sampleResumeData.organizations[0].title}</div>
                  </div>
                </div>
              </div>
            ) : isTwoCol ? (
              <div className="flex flex-1 p-2 gap-2">
                <div className="w-[64%] space-y-1.5">
                  <div>
                    <div
                      className="font-bold uppercase text-[5.5px]"
                      style={{ color: theme.accentColor }}
                    >
                      Experience
                    </div>
                    <div className="font-semibold">{sampleResumeData.experience[0].title}</div>
                    <div className="text-[5px] text-slate-500">
                      • {sampleResumeData.experience[0].bullets[0]}
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-bold uppercase text-[5.5px]"
                      style={{ color: theme.accentColor }}
                    >
                      Leadership
                    </div>
                    <div className="font-semibold">{sampleResumeData.organizations[0].title}</div>
                  </div>
                </div>
                <div className="w-[36%] space-y-1.5">
                  <div>
                    <div
                      className="font-bold uppercase text-[5.5px]"
                      style={{ color: theme.accentColor }}
                    >
                      Education
                    </div>
                    <div className="font-semibold truncate">
                      {sampleResumeData.education[0].school}
                    </div>
                    <div className="text-[5px]">{sampleResumeData.education[0].degree}</div>
                  </div>
                  <div>
                    <div
                      className="font-bold uppercase text-[5.5px]"
                      style={{ color: theme.accentColor }}
                    >
                      Skills
                    </div>
                    <div className="text-[5px]">{sampleResumeData.skills.join(' • ')}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`flex-1 px-2.5 py-1.5 ${isCompact ? 'space-y-1' : 'space-y-1.5'}`}>
                <div>
                  <div
                    className="font-bold uppercase text-[5.5px] mb-0.5"
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
                  <div className="text-[5px] text-slate-500">
                    {sampleResumeData.education[0].degree}
                  </div>
                </div>
                <div>
                  <div
                    className="font-bold uppercase text-[5.5px] mb-0.5"
                    style={{
                      color: theme.accentColor,
                      backgroundColor:
                        theme.headingStyle === 'accent-tint' ? theme.accentLight : 'transparent',
                    }}
                  >
                    Experience
                  </div>
                  <div className="font-semibold">{sampleResumeData.experience[0].title}</div>
                  <div className="text-[5px] text-slate-600 line-clamp-2">
                    • {sampleResumeData.experience[0].bullets[0]}
                  </div>
                </div>
                <div>
                  <div
                    className="font-bold uppercase text-[5.5px] mb-0.5"
                    style={{
                      color: theme.accentColor,
                      backgroundColor:
                        theme.headingStyle === 'accent-tint' ? theme.accentLight : 'transparent',
                    }}
                  >
                    Organizations
                  </div>
                  <div className="font-semibold">{sampleResumeData.organizations[0].title}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {isSelected && (
          <span className="absolute top-2 right-2 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs">
            Selected
          </span>
        )}
      </div>

      {/* Card footer */}
      <div className="p-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{template.name}</p>
          <p className="text-xs text-slate-500">{template.category}</p>
        </div>
        <span
          className="h-4 w-4 rounded-full border border-slate-300"
          style={{ backgroundColor: theme.accentColor }}
          title={`Accent: ${theme.name}`}
        />
      </div>
    </button>
  )
}

/**
 * TemplatePicker: Grid of template thumbnails with category filtering.
 * Uses sampleResume.js so thumbnails always look full and never alter student data.
 */
export default function TemplatePicker({ selectedTemplateId, onSelectTemplate }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [showPdfThumbnails, setShowPdfThumbnails] = useState(false)

  const filteredTemplates =
    activeCategory === 'All'
      ? templates
      : templates.filter((t) => t.category === activeCategory)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Choose a Template</h2>
          <p className="text-xs text-slate-500">
            Thumbnails preview Maria Clara Santos (sample data). Clicking any template switches your live PDF immediately.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {TEMPLATE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
                activeCategory === category
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Optional toggle to render real @react-pdf/renderer iframes inside every thumbnail */}
      <div className="flex items-center justify-end">
        <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showPdfThumbnails}
            onChange={(e) => setShowPdfThumbnails(e.target.checked)}
            className="rounded border-slate-300"
          />
          Render full PDF iframes in thumbnails
        </label>
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
        {filteredTemplates.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            isSelected={tpl.id === selectedTemplateId}
            onSelect={onSelectTemplate}
            showPdfThumbnails={showPdfThumbnails}
          />
        ))}
      </div>
    </div>
  )
}

