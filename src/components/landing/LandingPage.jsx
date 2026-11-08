import { useState, useEffect, useRef } from 'react'
import { sampleResumeData } from '../../data/sampleResume'
import { templates, TEMPLATE_CATEGORIES } from '../../templates/registry'

const FEATURED_TEMPLATE_IDS = [
  'harvard-classic',
  'twocol-emerald-modern',
  'banner-classic-slate',
]

const ORG_ROLE_DEMOS = {
  president: {
    label: 'President',
    metrics: '45 members • 6 events',
    bullet:
      'Led a 45-member student chapter and organized 6 technical workshops, increasing active semester participation by 35%.',
  },
  treasurer: {
    label: 'Treasurer',
    metrics: '$4,500 budget • 12 sponsors',
    bullet:
      'Managed a $4,500 annual chapter budget and secured 12 corporate sponsorships with 100% on-time financial reporting.',
  },
  events: {
    label: 'Events Lead',
    metrics: '220 attendees • 8 speakers',
    bullet:
      'Coordinated logistics and speaker outreach for a 220-attendee campus symposium featuring 8 industry engineers.',
  },
}

function HeroPaperPreview({ template, onUseTemplate }) {
  const { theme } = template
  const isHarvard = template.id.startsWith('harvard-') || template.id.startsWith('reddit-')
  const isBanner = template.id.startsWith('banner-')
  const isTwoCol = template.id.startsWith('twocol-')

  const fontClass =
    theme.fontFamily === 'Times-Roman'
      ? 'font-serif'
      : theme.fontFamily === 'Courier'
        ? 'font-mono'
        : 'font-sans'

  return (
    <div className="rounded-[10px] border border-[#E3E8EE] bg-white p-4 sm:p-6 shadow-[0_4px_20px_rgba(16,24,40,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(16,24,40,0.09)]">
      {/* Mini preview toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E3E8EE]">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-[#5B6678] mr-1">Try layout:</span>
          {FEATURED_TEMPLATE_IDS.map((id) => {
            const tpl = templates.find((t) => t.id === id) || templates[0]
            const active = tpl.id === template.id
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onUseTemplate(tpl.id, false)}
                className={`rounded-[6px] px-2.5 py-1 text-xs font-medium transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#1F4D8F] text-white font-semibold shadow-2xs scale-[1.02]'
                    : 'bg-[#F6F8FA] text-[#5B6678] hover:text-[#1A2233] hover:bg-[#EEF2F6] border border-[#E3E8EE]'
                }`}
              >
                {tpl.name}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => onUseTemplate(template.id, true)}
          className="rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1 text-xs font-medium text-[#1A2233] hover:bg-[#F6F8FA] hover:border-[#CBD5E1] transition-all duration-200 cursor-pointer"
        >
          Use template
        </button>
      </div>

      {/* Paper stage */}
      <div className="mt-4 rounded-[8px] bg-[#EEF2F6] p-4 sm:p-6 overflow-hidden">
        <div
          key={template.id}
          className={`animate-paper-morph mx-auto w-full max-w-[460px] rounded-[4px] bg-white border border-[#E3E8EE] shadow-sm overflow-hidden text-[10px] leading-relaxed select-none transition-colors duration-300 ${fontClass}`}
          style={{ color: theme.textColor }}
        >
          {/* Header */}
          {isBanner ? (
            <div
              className="px-5 py-4 text-white"
              style={{ backgroundColor: theme.accentColor }}
            >
              <div className="text-sm font-bold tracking-tight">
                {sampleResumeData.personalInfo.fullName}
              </div>
              <div className="text-[9px] opacity-90 mt-0.5">
                {sampleResumeData.personalInfo.email} • {sampleResumeData.personalInfo.phone} •{' '}
                {sampleResumeData.personalInfo.location}
              </div>
            </div>
          ) : isHarvard ? (
            <div className="px-5 pt-5 pb-3 text-center">
              <div
                className="text-sm font-bold uppercase tracking-wide"
                style={{ color: theme.accentColor }}
              >
                {sampleResumeData.personalInfo.fullName}
              </div>
              <div className="text-[9px] text-[#5B6678] mt-0.5">
                {sampleResumeData.personalInfo.email} • {sampleResumeData.personalInfo.phone} •{' '}
                {sampleResumeData.personalInfo.location}
              </div>
            </div>
          ) : (
            <div
              className="mx-5 pt-5 pb-2.5 border-b"
              style={{ borderColor: theme.accentColor }}
            >
              <div
                className="text-sm font-bold"
                style={{ color: theme.accentColor }}
              >
                {sampleResumeData.personalInfo.fullName}
              </div>
              <div className="text-[9px] text-[#5B6678] mt-0.5">
                {sampleResumeData.personalInfo.email} • {sampleResumeData.personalInfo.phone} •{' '}
                {sampleResumeData.personalInfo.location}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="p-5 pt-3 space-y-3">
            {isTwoCol ? (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-8 space-y-3">
                  <div>
                    <div
                      className="text-[9px] font-bold uppercase tracking-wider pb-0.5 mb-1 border-b"
                      style={{
                        color: theme.accentColor,
                        borderColor: theme.accentColor,
                      }}
                    >
                      Experience
                    </div>
                    <div className="flex justify-between font-bold text-[10px]">
                      <span>{sampleResumeData.experience[0].title}</span>
                      <span className="text-[9px] font-normal text-[#5B6678]">
                        Jun 2025 – Aug 2025
                      </span>
                    </div>
                    <div className="italic text-[9.5px] text-[#5B6678]">
                      {sampleResumeData.experience[0].company}
                    </div>
                    <ul className="list-disc pl-3.5 mt-1 space-y-0.5 text-[9.5px]">
                      <li>{sampleResumeData.experience[0].bullets[0]}</li>
                    </ul>
                  </div>

                  <div>
                    <div
                      className="text-[9px] font-bold uppercase tracking-wider pb-0.5 mb-1 border-b"
                      style={{
                        color: theme.accentColor,
                        borderColor: theme.accentColor,
                      }}
                    >
                      Leadership &amp; Activities
                    </div>
                    <div className="flex justify-between font-bold text-[10px]">
                      <span>Chapter President</span>
                      <span className="text-[9px] font-normal text-[#5B6678]">
                        Sep 2024 – Present
                      </span>
                    </div>
                    <div className="italic text-[9.5px] text-[#5B6678]">
                      Computer Science Student Society
                    </div>
                  </div>
                </div>

                <div className="col-span-4 space-y-3">
                  <div>
                    <div
                      className="text-[9px] font-bold uppercase tracking-wider pb-0.5 mb-1 border-b"
                      style={{
                        color: theme.accentColor,
                        borderColor: theme.accentColor,
                      }}
                    >
                      Education
                    </div>
                    <div className="font-bold text-[9.5px]">
                      {sampleResumeData.education[0].school}
                    </div>
                    <div className="italic text-[9px] text-[#5B6678]">
                      {sampleResumeData.education[0].degree}
                    </div>
                  </div>

                  <div>
                    <div
                      className="text-[9px] font-bold uppercase tracking-wider pb-0.5 mb-1 border-b"
                      style={{
                        color: theme.accentColor,
                        borderColor: theme.accentColor,
                      }}
                    >
                      Skills
                    </div>
                    <div className="text-[9px] text-[#5B6678]">
                      {sampleResumeData.skills.join(' • ')}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div
                    className="text-[9px] font-bold uppercase tracking-wider pb-0.5 mb-1 border-b"
                    style={{
                      color: theme.accentColor,
                      borderColor: theme.accentColor,
                    }}
                  >
                    Education
                  </div>
                  <div className="flex justify-between font-bold text-[10px]">
                    <span>{sampleResumeData.education[0].school}</span>
                    <span className="text-[9px] font-normal text-[#5B6678]">
                      Sep 2022 – May 2026
                    </span>
                  </div>
                  <div className="italic text-[9.5px] text-[#5B6678]">
                    {sampleResumeData.education[0].degree}
                  </div>
                  <div className="text-[9px] text-[#5B6678]">
                    {sampleResumeData.education[0].details}
                  </div>
                </div>

                <div>
                  <div
                    className="text-[9px] font-bold uppercase tracking-wider pb-0.5 mb-1 border-b"
                    style={{
                      color: theme.accentColor,
                      borderColor: theme.accentColor,
                    }}
                  >
                    Experience
                  </div>
                  <div className="flex justify-between font-bold text-[10px]">
                    <span>{sampleResumeData.experience[0].company}</span>
                    <span className="text-[9px] font-normal text-[#5B6678]">
                      Jun 2025 – Aug 2025
                    </span>
                  </div>
                  <div className="italic text-[9.5px] text-[#5B6678]">
                    {sampleResumeData.experience[0].title}
                  </div>
                  <ul className="list-disc pl-3.5 mt-1 space-y-0.5 text-[9.5px]">
                    <li>{sampleResumeData.experience[0].bullets[0]}</li>
                    <li>{sampleResumeData.experience[0].bullets[1]}</li>
                  </ul>
                </div>

                <div>
                  <div
                    className="text-[9px] font-bold uppercase tracking-wider pb-0.5 mb-1 border-b"
                    style={{
                      color: theme.accentColor,
                      borderColor: theme.accentColor,
                    }}
                  >
                    Skills
                  </div>
                  <div className="text-[9.5px]">
                    {sampleResumeData.skills.join(' • ')}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage({
  hasSavedDraft,
  selectedTemplateId,
  onStartBuilder,
  onSelectTemplateAndStart,
  onOpenImportFromLanding,
  onLoadSampleAndStart,
}) {
  const [heroTemplateId, setHeroTemplateId] = useState(
    FEATURED_TEMPLATE_IDS.includes(selectedTemplateId)
      ? selectedTemplateId
      : 'harvard-classic'
  )
  const [activeCategory, setActiveCategory] = useState('All')
  const [demoOjtMode, setDemoOjtMode] = useState(true)
  const [demoOrgRole, setDemoOrgRole] = useState('president')
  const pageRef = useRef(null)

  useEffect(() => {
    const root = pageRef.current
    if (!root) return

    const elements = root.querySelectorAll('.reveal-item')
    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const heroTemplate =
    templates.find((t) => t.id === heroTemplateId) || templates[0]

  const filteredTemplates =
    activeCategory === 'All'
      ? templates.slice(0, 6)
      : templates.filter((t) => t.category === activeCategory).slice(0, 6)

  const handleHeroTemplateInteraction = (templateId, launchBuilder) => {
    setHeroTemplateId(templateId)
    if (launchBuilder) {
      onSelectTemplateAndStart(templateId)
    }
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#F6F8FA] text-[#1A2233] animate-page-enter"
    >
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#E3E8EE] bg-white/95 backdrop-blur-xs transition-colors">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6 py-3.5">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 text-xl sm:text-2xl font-brand font-bold tracking-[-0.02em] text-[#1A2233] hover:opacity-85 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] rounded-sm"
          >
            <img
              src="/papel-logo.png"
              alt=""
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0"
            />
            <span>Papel</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#5B6678]">
            <a href="#features" className="hover:text-[#1A2233] transition-colors duration-200">
              Features
            </a>
            <a href="#templates" className="hover:text-[#1A2233] transition-colors duration-200">
              Templates
            </a>
            <a href="#how-it-works" className="hover:text-[#1A2233] transition-colors duration-200">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {hasSavedDraft && (
              <button
                type="button"
                onClick={onStartBuilder}
                className="hidden sm:inline-flex items-center justify-center h-10 px-3.5 rounded-[6px] border border-[#E3E8EE] bg-white text-sm font-medium text-[#1A2233] hover:bg-[#F6F8FA] hover:border-[#CBD5E1] transition-all duration-200 cursor-pointer"
              >
                Continue saved draft
              </button>
            )}
            <button
              type="button"
              onClick={onStartBuilder}
              className="inline-flex items-center justify-center h-10 px-4 rounded-[6px] bg-[#1F4D8F] text-sm font-semibold text-white hover:bg-[#173b6e] hover:-translate-y-[1px] active:translate-y-[0.5px] transition-all duration-200 cursor-pointer"
            >
              {hasSavedDraft ? 'Open builder' : 'Build your resume'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main id="top" className="mx-auto max-w-[1280px] px-4 sm:px-6 pt-12 pb-20 space-y-20">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div
              style={{ animationDelay: '0ms' }}
              className="animate-fade-up inline-flex items-center gap-2 rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1 text-xs font-medium text-[#5B6678] shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
            >
              <span>Free student resume &amp; CV maker</span>
              <span className="text-[#E3E8EE]">•</span>
              <span>No sign-up required</span>
            </div>

            <h1
              style={{ animationDelay: '70ms' }}
              className="animate-fade-up text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-[#1A2233] leading-[1.18] max-w-[22ch]"
            >
              Fill in your details once. Switch templates anytime.
            </h1>

            <p
              style={{ animationDelay: '140ms' }}
              className="animate-fade-up text-base text-[#5B6678] leading-relaxed max-w-[60ch]"
            >
              Build a clean, one-page student resume, OJT practicum application, or multi-page academic CV. Your data stays separated from the design so you can change layouts in one click, and your work stays privately in your browser.
            </p>

            <div
              style={{ animationDelay: '210ms' }}
              className="animate-fade-up flex flex-wrap items-center gap-3 pt-1"
            >
              <button
                type="button"
                onClick={onStartBuilder}
                className="inline-flex items-center justify-center h-11 px-5 rounded-[6px] bg-[#1F4D8F] text-sm font-semibold text-white hover:bg-[#173b6e] hover:-translate-y-[1px] active:translate-y-[0.5px] transition-all duration-200 cursor-pointer"
              >
                {hasSavedDraft ? 'Continue your resume' : 'Start building for free'}
              </button>

              <button
                type="button"
                onClick={onOpenImportFromLanding}
                className="inline-flex items-center justify-center h-11 px-4 rounded-[6px] border border-[#E3E8EE] bg-white text-sm font-medium text-[#1A2233] hover:bg-[#F6F8FA] hover:border-[#CBD5E1] hover:-translate-y-[1px] active:translate-y-[0.5px] transition-all duration-200 cursor-pointer"
              >
                Import existing PDF
              </button>

              <button
                type="button"
                onClick={onLoadSampleAndStart}
                className="inline-flex items-center justify-center h-11 px-3 text-sm font-medium text-[#5B6678] hover:text-[#1A2233] underline underline-offset-4 transition-colors duration-200 cursor-pointer"
              >
                Try with sample data
              </button>
            </div>

            {/* Key guarantees */}
            <div
              style={{ animationDelay: '280ms' }}
              className="animate-fade-up pt-4 border-t border-[#E3E8EE] grid grid-cols-3 gap-4 max-w-[520px]"
            >
              <div>
                <div className="text-sm font-bold text-[#1A2233]">15 Templates</div>
                <div className="text-xs text-[#5B6678] mt-0.5">
                  Harvard, ATS, two-column, and sidebar
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-[#1A2233]">OJT Ready</div>
                <div className="text-xs text-[#5B6678] mt-0.5">
                  Hours, coursework, &amp; standard file naming
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-[#1A2233]">100% Local</div>
                <div className="text-xs text-[#5B6678] mt-0.5">
                  Saved in your browser with zero watermarks
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Hero Preview */}
          <div
            style={{ animationDelay: '160ms' }}
            className="animate-fade-up lg:col-span-6"
          >
            <HeroPaperPreview
              template={heroTemplate}
              onUseTemplate={handleHeroTemplateInteraction}
            />
          </div>
        </section>

        {/* Features Asymmetric Bento Grid (Stitch taste-design) */}
        <section id="features" className="space-y-6 scroll-mt-20">
          <div className="reveal-item max-w-[65ch]">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A2233]">
              Designed for students, interns, and first-time applicants
            </h2>
            <p className="text-sm text-[#5B6678] mt-1">
              Everything you need to turn your coursework, student organizations, and academic projects into a clean, credible application.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 7-column card: Interactive OJT & Practicum Mode Preview */}
            <div
              style={{ transitionDelay: '0ms' }}
              className="reveal-item papel-card-hover lg:col-span-7 rounded-[10px] border border-[#E3E8EE] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col justify-between gap-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1.5 max-w-[46ch]">
                  <div className="text-xs font-semibold text-[#1F4D8F]">
                    OJT &amp; Practicum Mode
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1A2233]">
                    One toggle for internship &amp; practicum requirements
                  </h3>
                  <p className="text-sm text-[#5B6678] leading-relaxed">
                    Flip on OJT Mode to switch your summary heading to Career Objective, display required training hours and start date, and format your PDF filename automatically.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={demoOjtMode}
                  onClick={() => setDemoOjtMode((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-[6px] border px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    demoOjtMode
                      ? 'border-[#1F4D8F] bg-[#1F4D8F] text-white'
                      : 'border-[#E3E8EE] bg-[#F6F8FA] text-[#5B6678] hover:text-[#1A2233]'
                  }`}
                >
                  <span>OJT Mode: {demoOjtMode ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Interactive miniature paper diff */}
              <div className="rounded-[8px] border border-[#E3E8EE] bg-[#F6F8FA] p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-[#5B6678]">Exported file name:</span>
                  <code className="rounded-[4px] border border-[#E3E8EE] bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-[#1A2233]">
                    {demoOjtMode
                      ? 'Carter_Alex_BSCS_OJT_Resume.pdf'
                      : 'Alex_Carter_Resume.pdf'}
                  </code>
                </div>

                <div
                  key={demoOjtMode ? 'ojt-on' : 'ojt-off'}
                  className="animate-paper-morph rounded-[6px] border border-[#E3E8EE] bg-white p-3.5 text-xs space-y-2.5"
                >
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#1F4D8F] border-b border-[#E3E8EE] pb-0.5 mb-1">
                      {demoOjtMode ? 'Career Objective' : 'Summary'}
                    </div>
                    <p className="text-[11px] text-[#5B6678] leading-relaxed">
                      {demoOjtMode
                        ? 'Fourth-year Computer Science student seeking an On-the-Job Training (OJT) software engineering internship...'
                        : 'Computer Science undergraduate with experience in full-stack web development and student leadership...'}
                    </p>
                  </div>

                  {demoOjtMode && (
                    <div className="pt-1 border-t border-[#E3E8EE] flex flex-wrap gap-x-6 gap-y-1 text-[11px]">
                      <div>
                        <span className="font-semibold text-[#1A2233]">Required OJT Hours:</span>{' '}
                        <span className="text-[#5B6678]">486 hours</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#1A2233]">Preferred Start:</span>{' '}
                        <span className="text-[#5B6678]">February 2027</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5-column card: Interactive Student Organization Builder */}
            <div
              style={{ transitionDelay: '90ms' }}
              className="reveal-item papel-card-hover lg:col-span-5 rounded-[10px] border border-[#E3E8EE] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col justify-between gap-5"
            >
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[#1F4D8F]">
                  Student Organization Builder
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1A2233]">
                  Turn club roles into action bullets
                </h3>
                <p className="text-sm text-[#5B6678] leading-relaxed">
                  Select your student organization role and plug in your numbers to generate quantified bullets.
                </p>
              </div>

              <div className="rounded-[8px] border border-[#E3E8EE] bg-[#F6F8FA] p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(ORG_ROLE_DEMOS).map(([key, item]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setDemoOrgRole(key)}
                        className={`rounded-[5px] px-2.5 py-1 text-[11px] font-medium transition-all duration-200 cursor-pointer ${
                          demoOrgRole === key
                            ? 'bg-[#1F4D8F] text-white font-semibold'
                            : 'bg-white text-[#5B6678] border border-[#E3E8EE] hover:text-[#1A2233]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] font-mono text-[#5B6678]">
                    {ORG_ROLE_DEMOS[demoOrgRole].metrics}
                  </span>
                </div>

                <div
                  key={demoOrgRole}
                  className="animate-paper-morph rounded-[6px] border border-[#E3E8EE] bg-white p-3 text-xs text-[#1A2233] leading-relaxed"
                >
                  <span className="font-bold text-[#1F4D8F] mr-1.5">•</span>
                  {ORG_ROLE_DEMOS[demoOrgRole].bullet}
                </div>
              </div>
            </div>

            {/* 5-column card: Decoupled Data & Design */}
            <div
              style={{ transitionDelay: '140ms' }}
              className="reveal-item papel-card-hover lg:col-span-5 rounded-[10px] border border-[#E3E8EE] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[#1F4D8F]">
                  Decoupled Data &amp; Design
                </div>
                <h3 className="text-base font-bold text-[#1A2233]">
                  Switch templates without re-typing
                </h3>
                <p className="text-sm text-[#5B6678] leading-relaxed">
                  Your content is stored independently from the layout engine. Switch between 1-page Resume mode and multi-page Academic CV mode or test all 15 templates in one click.
                </p>
              </div>

              <div className="pt-2 border-t border-[#E3E8EE] flex flex-wrap gap-1.5 text-[11px] font-medium text-[#5B6678]">
                <span className="rounded-[5px] bg-[#F6F8FA] border border-[#E3E8EE] px-2.5 py-1 text-[#1A2233]">
                  1-Page Auto-Fit Resume
                </span>
                <span className="rounded-[5px] bg-[#F6F8FA] border border-[#E3E8EE] px-2.5 py-1 text-[#1A2233]">
                  Multi-Page Academic CV
                </span>
                <span className="rounded-[5px] bg-[#F6F8FA] border border-[#E3E8EE] px-2.5 py-1 text-[#1A2233]">
                  Custom Section Order
                </span>
              </div>
            </div>

            {/* 7-column card: Local Browser Privacy & Vector PDF */}
            <div
              style={{ transitionDelay: '200ms' }}
              className="reveal-item papel-card-hover lg:col-span-7 rounded-[10px] border border-[#E3E8EE] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[#1F4D8F]">
                  Local-First Architecture
                </div>
                <h3 className="text-base font-bold text-[#1A2233]">
                  Saved in your browser with crisp A4 vector PDF export
                </h3>
                <p className="text-sm text-[#5B6678] leading-relaxed">
                  Papel autosaves every keystroke directly in your browser&apos;s local storage and generates selectable, ATS-parseable vector PDFs on your device—with zero watermarks, zero sign-up walls, and zero database tracking.
                </p>
              </div>

              <div className="pt-2 border-t border-[#E3E8EE] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-[6px] bg-[#F6F8FA] border border-[#E3E8EE] px-3 py-2">
                  <div className="font-bold text-[#1A2233]">Selectable Text</div>
                  <div className="text-[11px] text-[#5B6678]">True vector PDF output</div>
                </div>
                <div className="rounded-[6px] bg-[#F6F8FA] border border-[#E3E8EE] px-3 py-2">
                  <div className="font-bold text-[#1A2233]">Orphan Protection</div>
                  <div className="text-[11px] text-[#5B6678]">Clean page break rules</div>
                </div>
                <div className="rounded-[6px] bg-[#F6F8FA] border border-[#E3E8EE] px-3 py-2">
                  <div className="font-bold text-[#1A2233]">AI PDF Import</div>
                  <div className="text-[11px] text-[#5B6678]">Pre-fill from old resumes</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Template Showcase */}
        <section id="templates" className="space-y-6 scroll-mt-20">
          <div className="reveal-item flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[65ch]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A2233]">
                Start with a clean template
              </h2>
              <p className="text-sm text-[#5B6678] mt-1">
                Pick any layout below to jump into the editor. You can switch templates at any time while editing.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TEMPLATE_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-[6px] px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    activeCategory === category
                      ? 'bg-[#1F4D8F] text-white font-semibold shadow-2xs scale-[1.02]'
                      : 'bg-white text-[#5B6678] border border-[#E3E8EE] hover:text-[#1A2233] hover:bg-[#F6F8FA]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="reveal-item grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl, index) => {
              const { theme } = tpl
              const isHarvard = tpl.id.startsWith('harvard-') || tpl.id.startsWith('reddit-')
              const isBanner = tpl.id.startsWith('banner-')
              const isSidebar = tpl.id.startsWith('sidebar-')

              return (
                <div
                  key={`${activeCategory}-${tpl.id}`}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className="group animate-paper-morph papel-card-hover rounded-[10px] border border-[#E3E8EE] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col justify-between gap-4"
                >
                  <div className="rounded-[6px] bg-[#EEF2F6] p-4 flex items-center justify-center overflow-hidden">
                    <div
                      className="w-full max-w-[220px] h-48 rounded-[3px] bg-white border border-[#E3E8EE] shadow-2xs overflow-hidden flex flex-col text-[6px] leading-tight select-none transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-md"
                      style={{ color: theme.textColor }}
                    >
                      {isBanner ? (
                        <div
                          className="px-2.5 py-2 text-white"
                          style={{ backgroundColor: theme.accentColor }}
                        >
                          <div className="font-bold text-[8px]">
                            {sampleResumeData.personalInfo.fullName}
                          </div>
                          <div className="text-[5px] opacity-85 truncate">
                            {sampleResumeData.personalInfo.email}
                          </div>
                        </div>
                      ) : isHarvard ? (
                        <div
                          className="px-2 pt-2.5 pb-1.5 text-center border-b"
                          style={{ borderColor: theme.accentColor }}
                        >
                          <div
                            className="font-bold text-[8px] uppercase tracking-wide"
                            style={{ color: theme.accentColor }}
                          >
                            {sampleResumeData.personalInfo.fullName}
                          </div>
                          <div className="text-[5px] text-[#5B6678] truncate">
                            {sampleResumeData.personalInfo.location} •{' '}
                            {sampleResumeData.personalInfo.email}
                          </div>
                        </div>
                      ) : !isSidebar ? (
                        <div
                          className="px-2.5 pt-2.5 pb-1.5 mx-2 border-b"
                          style={{ borderColor: theme.accentColor }}
                        >
                          <div
                            className="font-bold text-[8px]"
                            style={{ color: theme.accentColor }}
                          >
                            {sampleResumeData.personalInfo.fullName}
                          </div>
                          <div className="text-[5px] text-[#5B6678] truncate">
                            {sampleResumeData.personalInfo.email}
                          </div>
                        </div>
                      ) : null}

                      {isSidebar ? (
                        <div className="flex flex-1">
                          <div
                            className="w-[35%] p-2 border-r space-y-1.5"
                            style={{
                              backgroundColor: theme.accentLight,
                              borderColor: theme.accentColor,
                            }}
                          >
                            <div
                              className="font-bold text-[7.5px]"
                              style={{ color: theme.accentColor }}
                            >
                              {sampleResumeData.personalInfo.fullName}
                            </div>
                            <div className="text-[5px] text-[#5B6678] truncate">
                              {sampleResumeData.personalInfo.email}
                            </div>
                            <div className="pt-1 space-y-1">
                              <div
                                className="font-bold uppercase text-[5px]"
                                style={{ color: theme.accentColor }}
                              >
                                Education
                              </div>
                              <div className="font-semibold">
                                {sampleResumeData.education[0].school}
                              </div>
                            </div>
                          </div>
                          <div className="w-[65%] p-2 space-y-1.5">
                            <div
                              className="font-bold uppercase text-[5.5px] border-b pb-0.5"
                              style={{
                                color: theme.accentColor,
                                borderColor: theme.accentColor,
                              }}
                            >
                              Experience
                            </div>
                            <div className="font-semibold">
                              {sampleResumeData.experience[0].title}
                            </div>
                            <div className="text-[#5B6678]">
                              {sampleResumeData.experience[0].company}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 space-y-2 flex-1">
                          <div>
                            <div
                              className="font-bold uppercase text-[5.5px] border-b pb-0.5 mb-1"
                              style={{
                                color: theme.accentColor,
                                borderColor: theme.accentColor,
                              }}
                            >
                              Education
                            </div>
                            <div className="font-semibold">
                              {sampleResumeData.education[0].school}
                            </div>
                            <div className="text-[#5B6678]">
                              {sampleResumeData.education[0].degree}
                            </div>
                          </div>
                          <div>
                            <div
                              className="font-bold uppercase text-[5.5px] border-b pb-0.5 mb-1"
                              style={{
                                color: theme.accentColor,
                                borderColor: theme.accentColor,
                              }}
                            >
                              Experience
                            </div>
                            <div className="font-semibold">
                              {sampleResumeData.experience[0].title}
                            </div>
                            <div className="text-[#5B6678]">
                              {sampleResumeData.experience[0].company}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-[#1A2233]">{tpl.name}</div>
                      <div className="text-xs text-[#5B6678]">{tpl.category}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectTemplateAndStart(tpl.id)}
                      className="rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-xs font-semibold text-[#1A2233] group-hover:bg-[#1F4D8F] group-hover:text-white group-hover:border-[#1F4D8F] transition-colors duration-200 cursor-pointer"
                    >
                      Use template
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* How It Works (Asymmetric Editorial Split) */}
        <section
          id="how-it-works"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-20"
        >
          <div className="reveal-item lg:col-span-4 space-y-3">
            <div className="text-xs font-semibold text-[#1F4D8F]">
              Workflow
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A2233]">
              How Papel works
            </h2>
            <p className="text-sm text-[#5B6678] leading-relaxed">
              From a blank page or an older resume PDF to a ready-to-submit A4 application in three focused steps.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onStartBuilder}
                className="inline-flex items-center justify-center h-9 px-3.5 rounded-[6px] border border-[#E3E8EE] bg-white text-xs font-semibold text-[#1A2233] hover:bg-[#F6F8FA] hover:border-[#CBD5E1] transition-all duration-200 cursor-pointer"
              >
                Jump into Step 1
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div
              style={{ transitionDelay: '0ms' }}
              className="reveal-item papel-card-hover rounded-[10px] border border-[#E3E8EE] bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] bg-[#F6F8FA] border border-[#E3E8EE] font-mono text-xs font-bold text-[#1F4D8F] shrink-0 mt-0.5">
                  01
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#1A2233]">
                    Enter your details or import an existing PDF
                  </h3>
                  <p className="text-sm text-[#5B6678] leading-relaxed max-w-[56ch]">
                    Fill in the 8-step guided form for education, coursework, internships, and projects—or upload an old PDF resume to pre-fill every section automatically.
                  </p>
                </div>
              </div>
              <span className="self-start rounded-[5px] bg-[#F6F8FA] border border-[#E3E8EE] px-2.5 py-1 font-mono text-[11px] text-[#5B6678] shrink-0">
                8 guided steps
              </span>
            </div>

            <div
              style={{ transitionDelay: '80ms' }}
              className="reveal-item papel-card-hover rounded-[10px] border border-[#E3E8EE] bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] bg-[#F6F8FA] border border-[#E3E8EE] font-mono text-xs font-bold text-[#1F4D8F] shrink-0 mt-0.5">
                  02
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#1A2233]">
                    Customize section order, OJT mode, &amp; templates
                  </h3>
                  <p className="text-sm text-[#5B6678] leading-relaxed max-w-[56ch]">
                    Reorder or hide sections, toggle between 1-page Resume mode and multi-page CV mode, or enable OJT Mode while watching the live A4 sheet update side-by-side.
                  </p>
                </div>
              </div>
              <span className="self-start rounded-[5px] bg-[#F6F8FA] border border-[#E3E8EE] px-2.5 py-1 font-mono text-[11px] text-[#5B6678] shrink-0">
                Live A4 preview
              </span>
            </div>

            <div
              style={{ transitionDelay: '160ms' }}
              className="reveal-item papel-card-hover rounded-[10px] border border-[#E3E8EE] bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-[6px] bg-[#F6F8FA] border border-[#E3E8EE] font-mono text-xs font-bold text-[#1F4D8F] shrink-0 mt-0.5">
                  03
                </span>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#1A2233]">
                    Download a crisp, ATS-readable vector PDF
                  </h3>
                  <p className="text-sm text-[#5B6678] leading-relaxed max-w-[56ch]">
                    Export a true vector A4 PDF immediately. No account creation, no watermarks, and your draft stays saved locally in your browser.
                  </p>
                </div>
              </div>
              <span className="self-start rounded-[5px] bg-[#F6F8FA] border border-[#E3E8EE] px-2.5 py-1 font-mono text-[11px] text-[#5B6678] shrink-0">
                Vector A4 PDF
              </span>
            </div>
          </div>
        </section>

        {/* Bottom CTA Panel */}
        <section className="reveal-item papel-card-hover rounded-[10px] border border-[#E3E8EE] bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1 max-w-[60ch]">
            <h2 className="text-xl font-bold text-[#1A2233]">
              Ready to build your student resume?
            </h2>
            <p className="text-sm text-[#5B6678]">
              Free, private, and saved right in your browser so you can pick up where you left off anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onStartBuilder}
              className="inline-flex items-center justify-center h-11 px-5 rounded-[6px] bg-[#1F4D8F] text-sm font-semibold text-white hover:bg-[#173b6e] hover:-translate-y-[1px] active:translate-y-[0.5px] transition-all duration-200 cursor-pointer"
            >
              {hasSavedDraft ? 'Continue your resume' : 'Open resume builder'}
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E3E8EE] bg-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-[#5B6678]">
          <div className="flex items-center gap-2">
            <img
              src="/papel-logo.png"
              alt=""
              className="w-4 h-4 object-contain"
            />
            <span className="font-brand font-bold text-[#1A2233] tracking-[-0.02em]">
              Papel
            </span>
            <span>— Student resume and CV maker</span>
          </div>
          <div>
            Your work is saved locally in your browser and never uploaded to a server.
          </div>
        </div>
      </footer>
    </div>
  )
}

