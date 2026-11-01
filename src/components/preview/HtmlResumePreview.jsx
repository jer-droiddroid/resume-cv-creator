import { generateBullets } from '../../data/roleTemplates'
import { getActiveSections } from '../../utils/sectionHelpers'
import { formatDateRange, getContactItems } from '../../templates/sectionRenderer'

/**
 * Pure HTML/Tailwind Paper Resume Preview (Option A).
 * - Matches the selected template's layout (Harvard, Standard, SingleColumn, TwoColumn, SidebarLeft, HeaderBanner, Compact)
 * - Uses exact theme colors, fonts, and heading styles
 * - Displays as an authentic white sheet of paper on a soft neutral gray background with light drop shadow
 * - No iframes, no PDF viewer borders, and no browser-native scrollbars
 */
export default function HtmlResumePreview({ data, theme, templateId }) {
  const activeSections = getActiveSections(data)
  const { personalInfo = {}, currency = 'PHP' } = data || {}
  const contactItems = getContactItems(personalInfo)

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

  // Render individual sections
  const renderSection = (sectionId, overrides = {}) => {
    switch (sectionId) {
      case 'summary':
        return (
          <div key="summary" className="mb-4">
            {renderHeading('Summary', overrides)}
            <p className="text-[13px] leading-relaxed text-slate-700">{data.summary}</p>
          </div>
        )

      case 'education':
        return (
          <div key="education" className="mb-4">
            {renderHeading('Education', overrides)}
            <div className="space-y-2.5">
              {data.education
                .filter((edu) => edu.school || edu.degree)
                .map((edu, idx) => (
                  <div key={idx} className="text-[13px]">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-bold text-slate-900">{edu.school}</span>
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatDateRange(edu.startDate, edu.endDate)}
                      </span>
                    </div>
                    {edu.degree && (
                      <div className="italic text-slate-700">{edu.degree}</div>
                    )}
                    {edu.details && (
                      <div className="text-xs text-slate-600 mt-0.5">{edu.details}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )

      case 'experience':
        return (
          <div key="experience" className="mb-4">
            {renderHeading('Experience', overrides)}
            <div className="space-y-3">
              {data.experience
                .filter((exp) => exp.company || exp.title)
                .map((exp, idx) => (
                  <div key={idx} className="text-[13px]">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-bold text-slate-900">{exp.company || exp.title}</span>
                      <span className="text-xs text-slate-500 shrink-0">
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </span>
                    </div>
                    {exp.company && exp.title && (
                      <div className="italic text-slate-700">{exp.title}</div>
                    )}
                    {(exp.bullets || []).filter((b) => b && b.trim()).length > 0 && (
                      <ul className="mt-1 space-y-1 list-disc pl-4 text-xs text-slate-700 leading-normal">
                        {exp.bullets
                          .filter((b) => b && b.trim())
                          .map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )

      case 'organizations':
        return (
          <div key="organizations" className="mb-4">
            {renderHeading('Leadership & Activities', overrides)}
            <div className="space-y-3">
              {data.organizations
                .filter((org) => org.organization || org.title)
                .map((org, idx) => {
                  const bullets = generateBullets(org, currency)
                  return (
                    <div key={idx} className="text-[13px]">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-bold text-slate-900">
                          {org.organization || org.title}
                        </span>
                        <span className="text-xs text-slate-500 shrink-0">
                          {formatDateRange(org.startDate, org.endDate)}
                        </span>
                      </div>
                      {org.organization && org.title && (
                        <div className="italic text-slate-700">{org.title}</div>
                      )}
                      {bullets.length > 0 && (
                        <ul className="mt-1 space-y-1 list-disc pl-4 text-xs text-slate-700 leading-normal">
                          {bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        )

      case 'projects':
        return (
          <div key="projects" className="mb-4">
            {renderHeading('Projects', overrides)}
            <div className="space-y-2.5">
              {data.projects
                .filter((p) => p.name || p.description)
                .map((p, idx) => (
                  <div key={idx} className="text-[13px]">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="font-bold text-slate-900">{p.name}</span>
                      {p.link && (
                        <span className="text-xs text-slate-500 shrink-0">{p.link}</span>
                      )}
                    </div>
                    {p.techStack && (
                      <div className="italic text-xs text-slate-600">Tech: {p.techStack}</div>
                    )}
                    {p.description && (
                      <p className="text-xs text-slate-700 mt-0.5">{p.description}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )

      case 'skills':
        return (
          <div key="skills" className="mb-4">
            {renderHeading('Skills', overrides)}
            <p className="text-xs text-slate-700 leading-relaxed">
              {data.skills.filter((s) => s && s.trim()).join('  •  ')}
            </p>
          </div>
        )

      case 'awards':
        return (
          <div key="awards" className="mb-4">
            {renderHeading('Awards & Honors', overrides)}
            <ul className="space-y-1 list-disc pl-4 text-xs text-slate-700">
              {data.awards
                .filter((a) => a && a.trim())
                .map((award, idx) => (
                  <li key={idx}>{award}</li>
                ))}
            </ul>
          </div>
        )

      case 'certifications':
        return (
          <div key="certifications" className="mb-4">
            {renderHeading('Certifications', overrides)}
            <ul className="space-y-1 list-disc pl-4 text-xs text-slate-700">
              {data.certifications
                .filter((c) => c && c.trim())
                .map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))}
            </ul>
          </div>
        )

      default:
        return null
    }
  }

  // Sidebar Layout
  if (isSidebar) {
    const sidebarSections = activeSections.filter((id) =>
      ['education', 'skills', 'awards', 'certifications'].includes(id)
    )
    const mainSections = activeSections.filter(
      (id) => !['education', 'skills', 'awards', 'certifications'].includes(id)
    )

    return (
      <div className={`w-full min-h-[960px] bg-white flex ${fontClass}`}>
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
              className="text-lg font-bold tracking-tight mb-2"
              style={{ color: theme.accentColor }}
            >
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {contactItems.length > 0 && (
              <div className="space-y-1 text-xs text-slate-600">
                {contactItems.map((c, idx) => (
                  <div key={idx} className="break-words">
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
    const mainSections = activeSections.filter(
      (id) => !['education', 'skills', 'awards', 'certifications'].includes(id)
    )
    const sideSections = activeSections.filter((id) =>
      ['education', 'skills', 'awards', 'certifications'].includes(id)
    )

    return (
      <div className={`w-full min-h-[960px] bg-white p-7 sm:p-9 ${fontClass}`}>
        {/* Header */}
        <div
          className="pb-3 mb-5 border-b"
          style={{ borderColor: theme.accentColor }}
        >
          <h1
            className="text-xl font-bold tracking-tight mb-2"
            style={{ color: theme.accentColor }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {contactItems.length > 0 && (
            <div className="text-xs text-slate-600">
              {contactItems.join('  •  ')}
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
      <div className={`w-full min-h-[960px] bg-white ${fontClass}`}>
        {/* Colored Header Banner */}
        <div
          className="px-7 py-6 sm:px-9 text-white"
          style={{ backgroundColor: theme.accentColor }}
        >
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {contactItems.length > 0 && (
            <div className="text-xs text-slate-100/90">
              {contactItems.join('  |  ')}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-7 sm:p-9 space-y-4">
          {activeSections.map((id) => renderSection(id))}
        </div>
      </div>
    )
  }

  // Centered Harvard / Standard Layout or SingleColumn
  return (
    <div className={`w-full min-h-[960px] bg-white p-7 sm:p-9 ${fontClass}`}>
      {/* Header */}
      {isHarvard ? (
        <div className="text-center mb-6">
          <h1
            className="text-xl font-bold uppercase tracking-wide mb-2"
            style={{ color: theme.accentColor }}
          >
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>
          {contactItems.length > 0 && (
            <div className="text-xs text-slate-600">
              {contactItems.join('  •  ')}
            </div>
          )}
        </div>
      ) : isCompact ? (
        <div
          className="flex justify-between items-end pb-2 mb-4 border-b"
          style={{ borderColor: theme.accentColor }}
        >
          <h1
            className="text-lg font-bold"
            style={{ color: theme.accentColor }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {contactItems.length > 0 && (
            <div className="text-xs text-slate-600 text-right max-w-[60%]">
              {contactItems.join(' • ')}
            </div>
          )}
        </div>
      ) : (
        <div
          className="pb-3 mb-5 border-b"
          style={{ borderColor: theme.accentColor }}
        >
          <h1
            className="text-xl font-bold mb-2"
            style={{ color: theme.accentColor }}
          >
            {personalInfo.fullName || 'Your Name'}
          </h1>
          {contactItems.length > 0 && (
            <div className="text-xs text-slate-600">
              {contactItems.join('  •  ')}
            </div>
          )}
        </div>
      )}

      {/* Sections */}
      <div className={isCompact ? 'space-y-3' : 'space-y-4'}>
        {activeSections.map((id) => renderSection(id))}
      </div>
    </div>
  )
}

