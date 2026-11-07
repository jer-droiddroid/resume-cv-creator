import { generateBullets } from '../../data/roleTemplates'
import { isSectionNonEmpty } from '../../utils/sectionHelpers'
import { formatDateRange, getContactItems } from '../../templates/sectionRenderer'
import { sampleResumeData } from '../../data/sampleResume'
import { DEFAULT_SECTIONS } from '../../data/defaultResume'

/**
 * Pure HTML/Tailwind Paper Resume Preview.
 * - Matches the selected template's layout (Harvard, Standard, SingleColumn, TwoColumn, SidebarLeft, HeaderBanner, Compact)
 * - Uses exact theme colors, fonts, and heading styles
 * - Displays as an authentic white sheet of paper on a soft neutral gray background with light drop shadow
 * - FIX 2: Shows faded sample placeholder content from sampleResume.js for any section that is empty
 * - As the student types their own data, faded text disappears and real data takes its place
 * - Downloaded PDF only uses real data; sample content never appears in downloaded PDF
 * - break-words and [overflow-wrap:anywhere] ensure long words, URLs, and test text wrap cleanly
 */
export default function HtmlResumePreview({ data, theme, templateId }) {
  const configuredSections =
    Array.isArray(data?.sections) && data.sections.length > 0
      ? data.sections
      : DEFAULT_SECTIONS

  const visibleSectionIds = configuredSections
    .filter((sec) => sec.visible !== false)
    .map((sec) => sec.id)

  const { personalInfo = {}, currency = 'USD' } = data || {}
  const realName = personalInfo?.fullName?.trim()
  const displayName = realName || 'Your Name'
  const isNameSample = !realName

  const realContactItems = getContactItems(personalInfo)
  const hasRealContact = realContactItems.length > 0
  const displayContactItems = hasRealContact
    ? realContactItems
    : getContactItems(sampleResumeData.personalInfo)

  const isHarvard = templateId.startsWith('harvard-') || templateId.startsWith('reddit-')
  const isBanner = templateId.startsWith('banner-')
  const isSidebar = templateId.startsWith('sidebar-')
  const isTwoCol = templateId.startsWith('twocol-')
  const isCompact = templateId.startsWith('compact-')

  const fontClass =
    theme.fontFamily === 'Times-Roman'
      ? 'font-serif'
      : theme.fontFamily === 'Courier'
        ? 'font-mono'
        : 'font-sans'

  // Heading style helper
  const renderHeading = (title, overrides = {}) => {
    if (theme.headingStyle === 'accent-tint' && !overrides.invert) {
      return (
        <h2
          className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-sm mb-2"
          style={{
            backgroundColor: theme.accentLight || '#f1f5f9',
            color: theme.accentColor,
          }}
        >
          {title}
        </h2>
      )
    }

    return (
      <h2
        className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5"
        style={{
          borderBottomWidth: '1px',
          borderBottomColor: overrides.color || theme.accentColor,
          color: overrides.color || theme.accentColor,
        }}
      >
        {title}
      </h2>
    )
  }

  // Render individual sections (real data if provided, or faded sample placeholder if empty)
  const renderSection = (sectionId, overrides = {}) => {
    switch (sectionId) {
      case 'summary': {
        const isReal = isSectionNonEmpty('summary', data)
        const summaryText = isReal ? data.summary : sampleResumeData.summary
        const summaryHeading = data?.isOjtMode ? 'Career Objective' : 'Summary'

        return (
          <div key="summary" className="mb-4">
            {renderHeading(summaryHeading, overrides)}
            <p
              className={`text-[13px] leading-relaxed break-words [overflow-wrap:anywhere] ${
                isReal
                  ? 'text-slate-700'
                  : 'text-slate-500 opacity-40 select-none italic'
              }`}
            >
              {summaryText}
            </p>
          </div>
        )
      }

      case 'education': {
        const isReal = isSectionNonEmpty('education', data)
        const educationList = isReal
          ? (data.education || []).filter((edu) => edu.school || edu.degree)
          : sampleResumeData.education

        return (
          <div key="education" className="mb-4">
            {renderHeading('Education', overrides)}
            <div
              className={`space-y-2.5 ${
                !isReal ? 'opacity-40 select-none italic' : ''
              }`}
            >
              {educationList.map((edu, idx) => (
                <div key={idx} className="text-[13px]">
                  <div className="flex justify-between items-baseline gap-2">
                    <span
                      className={`font-bold break-words [overflow-wrap:anywhere] ${
                        isReal ? 'text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      {edu.school}
                    </span>
                    <span className="text-xs text-slate-500 shrink-0">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </span>
                  </div>
                  {edu.degree && (
                    <div
                      className={`break-words [overflow-wrap:anywhere] ${
                        isReal ? 'italic text-slate-700' : 'text-slate-600'
                      }`}
                    >
                      {edu.degree}
                    </div>
                  )}
                  {edu.details && (
                    <div className="text-xs text-slate-600 mt-0.5 break-words [overflow-wrap:anywhere]">
                      {edu.details}
                    </div>
                  )}
                  {edu.coursework && (
                    <div className="text-xs text-slate-600 mt-0.5 break-words [overflow-wrap:anywhere]">
                      <span className="font-semibold">Relevant Coursework:</span> {edu.coursework}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'experience': {
        const isReal = isSectionNonEmpty('experience', data)
        const experienceList = isReal
          ? (data.experience || []).filter((exp) => exp.company || exp.title)
          : sampleResumeData.experience

        return (
          <div key="experience" className="mb-4">
            {renderHeading('Experience', overrides)}
            <div
              className={`space-y-3 ${
                !isReal ? 'opacity-40 select-none italic' : ''
              }`}
            >
              {experienceList.map((exp, idx) => (
                <div key={idx} className="text-[13px]">
                  <div className="flex justify-between items-baseline gap-2">
                    <span
                      className={`font-bold break-words [overflow-wrap:anywhere] ${
                        isReal ? 'text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      {exp.company || exp.title}
                    </span>
                    <span className="text-xs text-slate-500 shrink-0">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  {exp.company && exp.title && (
                    <div
                      className={`break-words [overflow-wrap:anywhere] ${
                        isReal ? 'italic text-slate-700' : 'text-slate-600'
                      }`}
                    >
                      {exp.title}
                    </div>
                  )}
                  {(exp.bullets || []).filter((b) => b && b.trim()).length > 0 && (
                    <ul className="mt-1 space-y-1 list-disc pl-4 text-xs text-slate-700 leading-normal">
                      {exp.bullets
                        .filter((b) => b && b.trim())
                        .map((b, bIdx) => (
                          <li
                            key={bIdx}
                            className="break-words [overflow-wrap:anywhere]"
                          >
                            {b}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'organizations': {
        const isReal = isSectionNonEmpty('organizations', data)
        const orgList = isReal
          ? (data.organizations || []).filter((org) => org.organization || org.title)
          : sampleResumeData.organizations

        return (
          <div key="organizations" className="mb-4">
            {renderHeading('Leadership & Activities', overrides)}
            <div
              className={`space-y-3 ${
                !isReal ? 'opacity-40 select-none italic' : ''
              }`}
            >
              {orgList.map((org, idx) => {
                const bullets = generateBullets(org, currency)
                return (
                  <div key={idx} className="text-[13px]">
                    <div className="flex justify-between items-baseline gap-2">
                      <span
                        className={`font-bold break-words [overflow-wrap:anywhere] ${
                          isReal ? 'text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {org.organization || org.title}
                      </span>
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatDateRange(org.startDate, org.endDate)}
                      </span>
                    </div>
                    {org.organization && org.title && (
                      <div
                        className={`break-words [overflow-wrap:anywhere] ${
                          isReal ? 'italic text-slate-700' : 'text-slate-600'
                        }`}
                      >
                        {org.title}
                      </div>
                    )}
                    {bullets.length > 0 && (
                      <ul className="mt-1 space-y-1 list-disc pl-4 text-xs text-slate-700 leading-normal">
                        {bullets.map((b, bIdx) => (
                          <li
                            key={bIdx}
                            className="break-words [overflow-wrap:anywhere]"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      }

      case 'projects': {
        const isReal = isSectionNonEmpty('projects', data)
        const projectList = isReal
          ? (data.projects || []).filter((p) => p.name || p.description)
          : sampleResumeData.projects

        return (
          <div key="projects" className="mb-4">
            {renderHeading('Projects', overrides)}
            <div
              className={`space-y-2.5 ${
                !isReal ? 'opacity-40 select-none italic' : ''
              }`}
            >
              {projectList.map((p, idx) => (
                <div key={idx} className="text-[13px]">
                  <div className="flex justify-between items-baseline gap-2">
                    <span
                      className={`font-bold break-words [overflow-wrap:anywhere] ${
                        isReal ? 'text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      {p.name}
                    </span>
                    {p.link && (
                      <span className="text-xs text-slate-500 shrink-0 break-words [overflow-wrap:anywhere]">
                        {p.link}
                      </span>
                    )}
                  </div>
                  {p.techStack && (
                    <div className="italic text-xs text-slate-600 break-words [overflow-wrap:anywhere]">
                      Tech: {p.techStack}
                    </div>
                  )}
                  {p.description && (
                    <p className="text-xs text-slate-700 mt-0.5 break-words [overflow-wrap:anywhere]">
                      {p.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      }

      case 'skills': {
        const isReal = isSectionNonEmpty('skills', data)
        const skillList = isReal
          ? (data.skills || []).filter((s) => s && s.trim())
          : sampleResumeData.skills

        return (
          <div key="skills" className="mb-4">
            {renderHeading('Skills', overrides)}
            <p
              className={`text-xs leading-relaxed break-words [overflow-wrap:anywhere] ${
                isReal
                  ? 'text-slate-700'
                  : 'text-slate-500 opacity-40 select-none italic'
              }`}
            >
              {skillList.join('  •  ')}
            </p>
          </div>
        )
      }

      case 'awards': {
        const isReal = isSectionNonEmpty('awards', data)
        const awardList = isReal
          ? (data.awards || []).filter((a) => a && a.trim())
          : sampleResumeData.awards

        return (
          <div key="awards" className="mb-4">
            {renderHeading('Awards & Honors', overrides)}
            <ul
              className={`space-y-1 list-disc pl-4 text-xs ${
                isReal
                  ? 'text-slate-700'
                  : 'text-slate-500 opacity-40 select-none italic'
              }`}
            >
              {awardList.map((award, idx) => (
                <li key={idx} className="break-words [overflow-wrap:anywhere]">
                  {award}
                </li>
              ))}
            </ul>
          </div>
        )
      }

      case 'certifications': {
        const isReal = isSectionNonEmpty('certifications', data)
        const certList = isReal
          ? (data.certifications || []).filter((c) => c && c.trim())
          : sampleResumeData.certifications

        return (
          <div key="certifications" className="mb-4">
            {renderHeading('Certifications', overrides)}
            <ul
              className={`space-y-1 list-disc pl-4 text-xs ${
                isReal
                  ? 'text-slate-700'
                  : 'text-slate-500 opacity-40 select-none italic'
              }`}
            >
              {certList.map((cert, idx) => (
                <li key={idx} className="break-words [overflow-wrap:anywhere]">
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        )
      }

      case 'ojt': {
        if (!data?.isOjtMode) return null
        const isReal = isSectionNonEmpty('ojt', data)
        const ojtSource = isReal ? data.ojtInfo : sampleResumeData.ojtInfo

        return (
          <div key="ojt" className="mb-4">
            {renderHeading('OJT Availability', overrides)}
            <div
              className={`text-xs space-y-1 ${
                isReal
                  ? 'text-slate-700'
                  : 'text-slate-500 opacity-40 select-none italic'
              }`}
            >
              {ojtSource?.requiredHours && (
                <div>
                  <span className="font-semibold">Required OJT Hours:</span>{' '}
                  {ojtSource.requiredHours}
                </div>
              )}
              {ojtSource?.preferredStartDate && (
                <div>
                  <span className="font-semibold">Preferred Start Date:</span>{' '}
                  {ojtSource.preferredStartDate}
                </div>
              )}
            </div>
          </div>
        )
      }

      default:
        return null
    }
  }

  // Sidebar Layout
  if (isSidebar) {
    const sidebarSections = visibleSectionIds.filter((id) =>
      ['education', 'skills', 'awards', 'certifications', 'ojt'].includes(id)
    )
    const mainSections = visibleSectionIds.filter(
      (id) => !['education', 'skills', 'awards', 'certifications', 'ojt'].includes(id)
    )

    return (
      <div
        className={`w-full min-h-[919px] bg-white flex break-words [overflow-wrap:anywhere] ${fontClass}`}
      >
        {/* Tinted Left Sidebar */}
        <div
          className="w-[34%] p-6 sm:p-7 border-r space-y-5"
          style={{
            backgroundColor: theme.accentLight || '#f8fafc',
            borderColor: theme.accentColor,
          }}
        >
          <div>
            <h1
              className={`text-lg font-bold tracking-tight mb-2 break-words [overflow-wrap:anywhere] ${
                isNameSample ? 'text-slate-400 opacity-60 italic' : ''
              }`}
              style={{ color: isNameSample ? undefined : theme.accentColor }}
            >
              {displayName}
            </h1>
            {displayContactItems.length > 0 && (
              <div
                className={`space-y-1 text-xs ${
                  hasRealContact
                    ? 'text-slate-600'
                    : 'text-slate-400 opacity-50 select-none italic'
                }`}
              >
                {displayContactItems.map((c, idx) => (
                  <div key={idx} className="break-words [overflow-wrap:anywhere]">
                    {c}
                  </div>
                ))}
              </div>
            )}
          </div>
          {sidebarSections.map((id) => renderSection(id, { invert: true }))}
        </div>

        {/* Right Main Column */}
        <div className="w-[66%] p-6 sm:p-7 space-y-4">
          {mainSections.map((id) => renderSection(id))}
        </div>
      </div>
    )
  }

  // Two Column Layout
  if (isTwoCol) {
    const mainSections = visibleSectionIds.filter(
      (id) => !['education', 'skills', 'awards', 'certifications', 'ojt'].includes(id)
    )
    const sideSections = visibleSectionIds.filter((id) =>
      ['education', 'skills', 'awards', 'certifications', 'ojt'].includes(id)
    )

    return (
      <div
        className={`w-full min-h-[919px] bg-white p-7 sm:p-9 break-words [overflow-wrap:anywhere] ${fontClass}`}
      >
        {/* Header */}
        <div
          className="pb-3 mb-5 border-b"
          style={{ borderColor: theme.accentColor }}
        >
          <h1
            className={`text-xl font-bold tracking-tight mb-2 break-words [overflow-wrap:anywhere] ${
              isNameSample ? 'text-slate-400 opacity-60 italic' : ''
            }`}
            style={{ color: isNameSample ? undefined : theme.accentColor }}
          >
            {displayName}
          </h1>
          {displayContactItems.length > 0 && (
            <div
              className={`text-xs break-words [overflow-wrap:anywhere] ${
                hasRealContact
                  ? 'text-slate-600'
                  : 'text-slate-400 opacity-50 select-none italic'
              }`}
            >
              {displayContactItems.join('  •  ')}
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 space-y-4">
            {mainSections.map((id) => renderSection(id))}
          </div>
          <div className="col-span-4 space-y-4">
            {sideSections.map((id) => renderSection(id))}
          </div>
        </div>
      </div>
    )
  }

  // Header Banner Layout
  if (isBanner) {
    return (
      <div
        className={`w-full min-h-[919px] bg-white break-words [overflow-wrap:anywhere] ${fontClass}`}
      >
        {/* Colored Header Banner */}
        <div
          className="px-7 py-6 sm:px-9 text-white"
          style={{ backgroundColor: theme.accentColor }}
        >
          <h1 className="text-2xl font-bold tracking-tight mb-2 break-words [overflow-wrap:anywhere]">
            {displayName}
          </h1>
          {displayContactItems.length > 0 && (
            <div
              className={`text-xs break-words [overflow-wrap:anywhere] ${
                hasRealContact
                  ? 'text-slate-100/90'
                  : 'text-white/60 select-none italic'
              }`}
            >
              {displayContactItems.join('  |  ')}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-7 sm:p-9 space-y-4">
          {visibleSectionIds.map((id) => renderSection(id))}
        </div>
      </div>
    )
  }

  // Centered Harvard / Standard Layout or SingleColumn
  return (
    <div
      className={`w-full min-h-[919px] bg-white p-7 sm:p-9 break-words [overflow-wrap:anywhere] ${fontClass}`}
    >
      {/* Header */}
      {isHarvard ? (
        <div className="text-center mb-6">
          <h1
            className={`text-xl font-bold uppercase tracking-wide mb-2 break-words [overflow-wrap:anywhere] ${
              isNameSample ? 'text-slate-400 opacity-60 italic' : ''
            }`}
            style={{ color: isNameSample ? undefined : theme.accentColor }}
          >
            {displayName.toUpperCase()}
          </h1>
          {displayContactItems.length > 0 && (
            <div
              className={`text-xs break-words [overflow-wrap:anywhere] ${
                hasRealContact
                  ? 'text-slate-600'
                  : 'text-slate-400 opacity-50 select-none italic'
              }`}
            >
              {displayContactItems.join('  •  ')}
            </div>
          )}
        </div>
      ) : isCompact ? (
        <div
          className="flex justify-between items-end pb-2 mb-4 border-b"
          style={{ borderColor: theme.accentColor }}
        >
          <h1
            className={`text-lg font-bold break-words [overflow-wrap:anywhere] ${
              isNameSample ? 'text-slate-400 opacity-60 italic' : ''
            }`}
            style={{ color: isNameSample ? undefined : theme.accentColor }}
          >
            {displayName}
          </h1>
          {displayContactItems.length > 0 && (
            <div
              className={`text-xs text-right max-w-[60%] break-words [overflow-wrap:anywhere] ${
                hasRealContact
                  ? 'text-slate-600'
                  : 'text-slate-400 opacity-50 select-none italic'
              }`}
            >
              {displayContactItems.join(' • ')}
            </div>
          )}
        </div>
      ) : (
        <div
          className="pb-3 mb-5 border-b"
          style={{ borderColor: theme.accentColor }}
        >
          <h1
            className={`text-xl font-bold mb-2 break-words [overflow-wrap:anywhere] ${
              isNameSample ? 'text-slate-400 opacity-60 italic' : ''
            }`}
            style={{ color: isNameSample ? undefined : theme.accentColor }}
          >
            {displayName}
          </h1>
          {displayContactItems.length > 0 && (
            <div
              className={`text-xs break-words [overflow-wrap:anywhere] ${
                hasRealContact
                  ? 'text-slate-600'
                  : 'text-slate-400 opacity-50 select-none italic'
              }`}
            >
              {displayContactItems.join('  •  ')}
            </div>
          )}
        </div>
      )}

      {/* Sections */}
      <div className={isCompact ? 'space-y-3' : 'space-y-4'}>
        {visibleSectionIds.map((id) => renderSection(id))}
      </div>
    </div>
  )
}
