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
    <div className="rounded-[10px] border border-border bg-white p-4 sm:p-6 shadow-[0_4px_20px_rgba(16,24,40,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(16,24,40,0.09)]">
      {/* Mini preview toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-text-muted mr-1">Try layout:</span>
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
                    ? 'bg-accent text-white font-semibold shadow-2xs scale-[1.02]'
                    : 'bg-page text-text-muted hover:text-text hover:bg-[#EEF2F6] border border-border'
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
          className="rounded-[6px] border border-border bg-white px-3 py-1 text-xs font-medium text-text hover:bg-page hover:border-[#CBD5E1] transition-all duration-200 cursor-pointer"
        >
          Use template
        </button>
      </div>

      {/* Paper stage */}
      <div className="mt-4 rounded-[8px] bg-[#EEF2F6] p-4 sm:p-6 overflow-hidden">
        <div
          key={template.id}
          className={`animate-paper-morph mx-auto w-full max-w-[460px] rounded-[4px] bg-white border border-border shadow-sm overflow-hidden text-[10px] leading-relaxed select-none transition-colors duration-300 ${fontClass}`}
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
              <div className="text-[9px] text-text-muted mt-0.5">
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
              <div className="text-[9px] text-text-muted mt-0.5">
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
                      <span className="text-[9px] font-normal text-text-muted">
                        Jun 2025 – Aug 2025
                      </span>
                    </div>
                    <div className="italic text-[9.5px] text-text-muted">
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
                      <span className="text-[9px] font-normal text-text-muted">
                        Sep 2024 – Present
                      </span>
                    </div>
                    <div className="italic text-[9.5px] text-text-muted">
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
                    <div className="italic text-[9px] text-text-muted">
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
                    <div className="text-[9px] text-text-muted">
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
                    <span className="text-[9px] font-normal text-text-muted">
                      Sep 2022 – May 2026
                    </span>
                  </div>
                  <div className="italic text-[9.5px] text-text-muted">
                    {sampleResumeData.education[0].degree}
                  </div>
                  <div className="text-[9px] text-text-muted">
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
                    <span className="text-[9px] font-normal text-text-muted">
                      Jun 2025 – Aug 2025
                    </span>
                  </div>
                  <div className="italic text-[9.5px] text-text-muted">
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
      className="min-h-screen bg-page text-text animate-page-enter"
    >
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-white/95 backdrop-blur-xs transition-colors">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 sm:px-6 py-3.5">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 text-xl sm:text-2xl font-brand font-bold tracking-[-0.02em] text-text hover:opacity-85 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
          >
            <img
              src="/papel-logo.png"
              alt=""
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0"
            />
            <span>Papel</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
            <a href="#features" className="hover:text-text transition-colors duration-200">
              Features
            </a>
            <a href="#templates" className="hover:text-text transition-colors duration-200">
              Templates
            </a>
            <a href="#how-it-works" className="hover:text-text transition-colors duration-200">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {hasSavedDraft && (
              <button
                type="button"
                onClick={onStartBuilder}
                className="hidden sm:inline-flex items-center justify-center h-10 px-3.5 rounded-[6px] border border-border bg-white text-sm font-medium text-text hover:bg-page hover:border-[#CBD5E1] transition-all duration-200 cursor-pointer"
              >
                Continue saved draft
              </button>
            )}
            <button
              type="button"
              onClick={onStartBuilder}
              className="inline-flex items-center justify-center h-10 px-4 rounded-[6px] bg-accent text-sm font-semibold text-white hover:bg-accent-hover hover:-translate-y-[1px] active:translate-y-[0.5px] transition-all duration-200 cursor-pointer"
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
              className="animate-fade-up inline-flex items-center gap-2 rounded-[6px] border border-border bg-white px-3 py-1 text-xs font-medium text-text-muted shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
            >
              <span>Free student resume &amp; CV maker</span>
              <span className="text-border">•</span>
              <span>No sign-up required</span>
            </div>

            <h1
              style={{ animationDelay: '70ms' }}
              className="animate-fade-up text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-text leading-[1.18] max-w-[22ch] text-balance"
            >
              Turn your student experience into a resume.
            </h1>

            <p
              style={{ animationDelay: '140ms' }}
              className="animate-fade-up text-base text-text-muted leading-relaxed max-w-[60ch] text-pretty"
            >
              Build a clean, one-page student resume, OJT practicum application, or multi-page academic CV. Make your coursework, projects, and student activities count. Switch layouts without retyping; your draft is saved in this browser.
            </p>

            <div
              style={{ animationDelay: '210ms' }}
              className="animate-fade-up flex flex-wrap items-center gap-3 pt-1"
            >
              <button
                type="button"
                onClick={onStartBuilder}
                className="inline-flex items-center justify-center h-11 px-5 rounded-[6px] bg-accent text-sm font-semibold text-white hover:bg-accent-hover hover:-translate-y-[1px] active:translate-y-[0.5px] transition-all duration-200 cursor-pointer"
              >
                {hasSavedDraft ? 'Continue your resume' : 'Start building for free'}
              </button>

              <button
                type="button"
                onClick={onOpenImportFromLanding}
                className="inline-flex items-center justify-center h-11 px-4 rounded-[6px] border border-border bg-white text-sm font-medium text-text hover:bg-page hover:border-[#CBD5E1] hover:-translate-y-[1px] active:translate-y-[0.5px] transition-all duration-200 cursor-pointer"
              >
                Import existing PDF
              </button>

              <button
                type="button"
                onClick={onLoadSampleAndStart}
                className="inline-flex items-center justify-center h-11 px-3 text-sm font-medium text-text-muted hover:text-text underline underline-offset-4 transition-colors duration-200 cursor-pointer"
              >
                Try with sample data
              </button>
            </div>

            {/* Key guarantees */}
            <div
              style={{ animationDelay: '280ms' }}
              className="animate-fade-up pt-4 border-t border-border grid grid-cols-3 gap-4 max-w-[520px]"
            >
              <div>
                <div className="text-sm font-bold text-text">15 Templates</div>
                <div className="text-xs text-text-muted mt-0.5">
                  Harvard, ATS, two-column, and sidebar
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-text">OJT Ready</div>
                <div className="text-xs text-text-muted mt-0.5">
                  Hours, coursework, &amp; standard file naming
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-text">Local drafts</div>
                <div className="text-xs text-text-muted mt-0.5">
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
            <h2 className="text-xl sm:text-2xl font-bold text-text text-balance">
              Designed for students, interns, and first-time applicants
            </h2>
            <p className="text-sm text-text-muted mt-1 text-pretty">
              Everything you need to turn your coursework, student organizations, and academic projects into a clean, credible application.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* 7-column card: Interactive OJT & Practicum Mode Preview */}
            <div
              style={{ transitionDelay: '0ms' }}
              className="reveal-item papel-card-hover lg:col-span-7 rounded-[10px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col justify-between gap-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1.5 max-w-[46ch]">
                  <h3 className="text-base sm:text-lg font-bold text-text text-balance">
                    One toggle for OJT &amp; practicum requirements
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed text-pretty">
                    Flip on OJT Mode to switch your summary heading to Career Objective, display required training hours and start date, and format your PDF filename automatically.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={demoOjtMode}
                  onClick={() => setDemoOjtMode((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-[6px] border px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent ${
                    demoOjtMode
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-page text-text-muted hover:text-text'
                  }`}
                >
                  <span>OJT Mode: {demoOjtMode ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Interactive miniature paper diff (single inner stage, no triple nesting) */}
              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-text-muted">Exported file name:</span>
                  <code className="rounded-[4px] border border-border bg-page px-2 py-0.5 font-mono text-xs font-semibold text-text">
                    {demoOjtMode
                      ? 'Carter_Alex_BSCS_OJT_Resume.pdf'
                      : 'Alex_Carter_Resume.pdf'}
                  </code>
                </div>

                <div
                  key={demoOjtMode ? 'ojt-on' : 'ojt-off'}
                  className="animate-paper-morph rounded-[6px] border border-border bg-page p-3.5 text-xs space-y-2.5"
                >
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-accent border-b border-border pb-0.5 mb-1">
                      {demoOjtMode ? 'Career Objective' : 'Summary'}
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed text-pretty">
                      {demoOjtMode
                        ? 'Fourth-year Computer Science student seeking an On-the-Job Training (OJT) software engineering internship...'
                        : 'Computer Science undergraduate with experience in full-stack web development and student leadership...'}
                    </p>
                  </div>

                  {demoOjtMode && (
                    <div className="pt-1.5 border-t border-border flex flex-wrap gap-x-6 gap-y-1 text-xs">
                      <div>
                        <span className="font-semibold text-text">Required OJT Hours:</span>{' '}
                        <span className="text-text-muted">486 hours</span>
                      </div>
                      <div>
                        <span className="font-semibold text-text">Preferred Start:</span>{' '}
                        <span className="text-text-muted">January 2026</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 5-column card: Interactive Student Organization Builder */}
            <div
              style={{ transitionDelay: '90ms' }}
              className="reveal-item papel-card-hover lg:col-span-5 rounded-[10px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col justify-between gap-5"
            >
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-text text-balance">
                  Turn student club roles into quantified action bullets
                </h3>
                <p className="text-sm text-text-muted leading-relaxed text-pretty">
                  Select your student organization role and plug in your numbers to generate quantified bullets.
                </p>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(ORG_ROLE_DEMOS).map(([key, item]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setDemoOrgRole(key)}
                        className={`rounded-[6px] px-2.5 py-1 text-xs font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent ${
                          demoOrgRole === key
                            ? 'bg-accent text-white font-semibold'
                            : 'bg-page text-text-muted border border-border hover:text-text'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-text-muted">
                    {ORG_ROLE_DEMOS[demoOrgRole].metrics}
                  </span>
                </div>

                <div
                  key={demoOrgRole}
                  className="animate-paper-morph rounded-[6px] border border-border bg-page p-3 text-xs text-text leading-relaxed text-pretty"
                >
                  <span className="font-bold text-accent mr-1.5">•</span>
                  {ORG_ROLE_DEMOS[demoOrgRole].bullet}
                </div>
              </div>
            </div>

            {/* 5-column card: Decoupled Data & Design */}
            <div
              style={{ transitionDelay: '140ms' }}
              className="reveal-item papel-card-hover lg:col-span-5 rounded-[10px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col justify-between gap-4"
            >
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-text text-balance">
                  Switch templates without re-typing
                </h3>
                <p className="text-sm text-text-muted leading-relaxed text-pretty">
                  Change the design without retyping your details. Switch between 1-page Resume mode and multi-page Academic CV mode or test all 15 templates in one click.
                </p>
              </div>

              <div className="pt-3 border-t border-border flex flex-wrap gap-1.5 text-xs font-medium text-text-muted">
                <span className="rounded-[5px] bg-page border border-border px-2.5 py-1 text-text">
                  1-Page Auto-Fit Resume
                </span>
                <span className="rounded-[5px] bg-page border border-border px-2.5 py-1 text-text">
                  Multi-Page Academic CV
                </span>
                <span className="rounded-[5px] bg-page border border-border px-2.5 py-1 text-text">
                  Custom Section Order
                </span>
              </div>
            </div>

            {/* 7-column card: Local Browser Privacy & Vector PDF */}
            <div
              style={{ transitionDelay: '200ms' }}
              className="reveal-item papel-card-hover lg:col-span-7 rounded-[10px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-[62ch]">
                <h3 className="text-base font-bold text-text text-balance">
                  Saved in your browser with crisp A4 vector PDF export
                </h3>
                <p className="text-sm text-text-muted leading-relaxed text-pretty">
                  Papel autosaves every keystroke directly in your browser&apos;s local storage and generates selectable, ATS-parseable vector PDFs on your device—with zero watermarks, zero sign-up walls, and zero database tracking.
                </p>
              </div>

              <div className="pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-bold text-text">Selectable Text</div>
                  <div className="text-xs text-text-muted mt-0.5">True vector PDF output</div>
                </div>
                <div>
                  <div className="font-bold text-text">Keep sections together</div>
                  <div className="text-xs text-text-muted mt-0.5">Clean page break rules</div>
                </div>
                <div>
                  <div className="font-bold text-text">AI PDF Import</div>
                  <div className="text-xs text-text-muted mt-0.5">Pre-fill from old resumes</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Template Showcase */}
        <section id="templates" className="space-y-6 scroll-mt-20">
          <div className="reveal-item flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-[65ch]">
              <h2 className="text-xl sm:text-2xl font-bold text-text text-balance">
                Start with a clean template
              </h2>
              <p className="text-sm text-text-muted mt-1 text-pretty">
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
                      ? 'bg-accent text-white font-semibold shadow-2xs scale-[1.02]'
                      : 'bg-white text-text-muted border border-border hover:text-text hover:bg-page'
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
                  className="group animate-paper-morph papel-card-hover rounded-[10px] border border-border bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col justify-between gap-4"
                >
                  <div className="rounded-[6px] bg-[#EEF2F6] p-4 flex items-center justify-center overflow-hidden">
                    <div
                      className="w-full max-w-[220px] h-48 rounded-[3px] bg-white border border-border shadow-2xs overflow-hidden flex flex-col text-[6px] leading-tight select-none transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:shadow-md"
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
                          <div className="text-[5px] text-text-muted truncate">
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
                          <div className="text-[5px] text-text-muted truncate">
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
                            <div className="text-[5px] text-text-muted truncate">
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
                            <div className="text-text-muted">
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
                            <div className="text-text-muted">
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
                            <div className="text-text-muted">
                              {sampleResumeData.experience[0].company}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-text">{tpl.name}</div>
                      <div className="text-xs text-text-muted">{tpl.category}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectTemplateAndStart(tpl.id)}
                      className="rounded-[6px] border border-border bg-white px-3 py-1.5 text-xs font-semibold text-text group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-colors duration-200 cursor-pointer"
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
            <h2 className="text-xl sm:text-2xl font-bold text-text text-balance">
              How Papel works
            </h2>
            <p className="text-sm text-text-muted leading-relaxed text-pretty">
              From a blank page or an older resume PDF to a ready-to-submit A4 application in three focused steps.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onStartBuilder}
                className="inline-flex items-center justify-center h-9 px-3.5 rounded-[6px] border border-border bg-white text-xs font-semibold text-text hover:bg-page hover:border-[#CBD5E1] transition-all duration-200 cursor-pointer"
              >
                Jump into Step 1
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div
              style={{ transitionDelay: '0ms' }}
              className="reveal-item papel-card-hover rounded-[10px] border border-border bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text text-balance">
                  Enter your details or import an existing PDF
                </h3>
                <p className="text-sm text-text-muted leading-relaxed max-w-[56ch] text-pretty">
                  Fill in the 8-step guided form for education, coursework, internships, and projects—or upload an old PDF resume to pre-fill every section automatically.
                </p>
              </div>
              <span className="self-start rounded-[5px] bg-page border border-border px-2.5 py-1 font-mono text-xs text-text-muted shrink-0">
                8 guided steps
              </span>
            </div>

            <div
              style={{ transitionDelay: '80ms' }}
              className="reveal-item papel-card-hover rounded-[10px] border border-border bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text text-balance">
                  Customize section order, OJT mode, &amp; templates
                </h3>
                <p className="text-sm text-text-muted leading-relaxed max-w-[56ch] text-pretty">
                  Reorder or hide sections, toggle between 1-page Resume mode and multi-page CV mode, or enable OJT Mode while watching the live A4 sheet update side-by-side.
                </p>
              </div>
              <span className="self-start rounded-[5px] bg-page border border-border px-2.5 py-1 font-mono text-xs text-text-muted shrink-0">
                Live A4 preview
              </span>
            </div>

            <div
              style={{ transitionDelay: '160ms' }}
              className="reveal-item papel-card-hover rounded-[10px] border border-border bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text text-balance">
                  Download a crisp, ATS-readable vector PDF
                </h3>
                <p className="text-sm text-text-muted leading-relaxed max-w-[56ch] text-pretty">
                  Export a true vector A4 PDF immediately. No account creation, no watermarks, and your draft stays saved locally in your browser.
                </p>
              </div>
              <span className="self-start rounded-[5px] bg-page border border-border px-2.5 py-1 font-mono text-xs text-text-muted shrink-0">
                Vector A4 PDF
              </span>
            </div>
          </div>
        </section>

        {/* Bottom CTA Panel */}
        <section className="reveal-item papel-card-hover rounded-[10px] border border-border bg-white p-6 sm:p-8 shadow-[0_1px_2px_rgba(16,24,40,0.06)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1 max-w-[60ch]">
            <h2 className="text-xl font-bold text-text text-balance">
              Ready to build your student resume?
            </h2>
            <p className="text-sm text-text-muted text-pretty">
              Free to use, with drafts saved in this browser so you can return to your work.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onStartBuilder}
              className="inline-flex items-center justify-center h-11 px-5 rounded-[6px] bg-accent text-sm font-semibold text-white hover:bg-accent-hover hover:-translate-y-[1px] active:translate-y-[0.5px] transition-all duration-200 cursor-pointer"
            >
              {hasSavedDraft ? 'Continue your resume' : 'Open resume builder'}
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <img
              src="/papel-logo.png"
              alt=""
              className="w-4 h-4 object-contain"
            />
            <span className="font-brand font-bold text-text tracking-[-0.02em]">
              Papel
            </span>
            <span>— Student resume and CV maker</span>
          </div>
          <div>
            Your draft is saved in this browser. Optional AI import sends extracted resume text to Google Gemini.
          </div>
        </div>
      </footer>
    </div>
  )
}

