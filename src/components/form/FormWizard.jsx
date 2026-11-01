import { useState, useRef, useEffect } from 'react'
import PersonalInfoStep from './PersonalInfoStep'
import SummaryStep from './SummaryStep'
import EducationStep from './EducationStep'
import ExperienceStep from './ExperienceStep'
import OrganizationsStep from './OrganizationsStep'
import ProjectsStep from './ProjectsStep'
import SkillsExtrasStep from './SkillsExtrasStep'
import SectionSettingsStep from './SectionSettingsStep'

const WIZARD_STEPS = [
  { id: 'personal', name: 'Personal Info', component: PersonalInfoStep },
  { id: 'summary', name: 'Summary', component: SummaryStep },
  { id: 'education', name: 'Education', component: EducationStep },
  { id: 'experience', name: 'Experience', component: ExperienceStep },
  { id: 'organizations', name: 'Organizations', component: OrganizationsStep },
  { id: 'projects', name: 'Projects', component: ProjectsStep },
  { id: 'skills', name: 'Skills & Extras', component: SkillsExtrasStep },
  { id: 'settings', name: 'Section Order', component: SectionSettingsStep },
]

export default function FormWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [visitedSteps, setVisitedSteps] = useState(() => new Set([0]))

  const menuButtonRef = useRef(null)
  const menuDropdownRef = useRef(null)
  const itemRefs = useRef([])

  const currentStep = WIZARD_STEPS[currentStepIndex]
  const CurrentStepComponent = currentStep.component
  const totalSteps = WIZARD_STEPS.length
  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100
  const isLastStep = currentStepIndex === totalSteps - 1

  // Track visited steps
  const goToStep = (index) => {
    setCurrentStepIndex(index)
    setVisitedSteps((prev) => new Set(prev).add(index))
    setIsMenuOpen(false)
    menuButtonRef.current?.focus()
  }

  const goPrev = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1)
    }
  }

  const goNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      goToStep(currentStepIndex + 1)
    }
  }

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(e.target) &&
        !menuButtonRef.current?.contains(e.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  // Handle keyboard navigation for the "All steps" dropdown
  const handleKeyDown = (e) => {
    if (!isMenuOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setIsMenuOpen(true)
      }
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      setIsMenuOpen(false)
      menuButtonRef.current?.focus()
      return
    }

    const currentIndex = itemRefs.current.findIndex((el) => el === document.activeElement)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextIndex = currentIndex < totalSteps - 1 ? currentIndex + 1 : 0
      itemRefs.current[nextIndex]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : totalSteps - 1
      itemRefs.current[prevIndex]?.focus()
    }
  }

  // Focus the current active step in the dropdown when it opens
  useEffect(() => {
    if (isMenuOpen) {
      const targetEl = itemRefs.current[currentStepIndex] || itemRefs.current[0]
      targetEl?.focus()
    }
  }, [isMenuOpen, currentStepIndex])

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Step Header with Progress Bar */}
      <div className="border-b border-slate-200 bg-white px-5 pt-4 pb-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Current Step Text */}
          <div className="text-sm font-semibold text-slate-900 truncate">
            Step {currentStepIndex + 1} of {totalSteps}: {currentStep.name}
          </div>

          {/* All Steps Dropdown Button */}
          <div className="relative shrink-0">
            <button
              ref={menuButtonRef}
              type="button"
              id="all-steps-button"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              aria-controls="all-steps-menu"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              onKeyDown={handleKeyDown}
              className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              All steps
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div
                ref={menuDropdownRef}
                id="all-steps-menu"
                role="menu"
                aria-labelledby="all-steps-button"
                onKeyDown={handleKeyDown}
                className="absolute right-0 mt-1.5 w-60 max-w-[calc(100vw-2.5rem)] rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg z-30 divide-y divide-slate-100"
              >
                <div className="space-y-0.5 pb-1">
                  {WIZARD_STEPS.map((step, idx) => {
                    const isCurrent = idx === currentStepIndex
                    const isVisited = visitedSteps.has(idx)

                    return (
                      <button
                        key={step.id}
                        ref={(el) => (itemRefs.current[idx] = el)}
                        role="menuitem"
                        type="button"
                        onClick={() => goToStep(idx)}
                        className={`w-full flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer ${
                          isCurrent
                            ? 'bg-slate-900 text-white font-medium'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate">
                          {idx + 1}. {step.name}
                        </span>

                        {/* Visited Checkmark */}
                        {isVisited && !isCurrent && (
                          <span
                            aria-label="Completed"
                            className="text-emerald-600 font-bold ml-2 shrink-0"
                          >
                            ✓
                          </span>
                        )}
                        {isCurrent && (
                          <span
                            aria-label="Current step"
                            className="text-white/80 text-[11px] ml-2 shrink-0"
                          >
                            Current
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Thin 4px Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={currentStepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${currentStepIndex + 1} of ${totalSteps}: ${currentStep.name}`}
          className="w-full h-1 bg-slate-200 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-slate-900 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Step Form Fields */}
      <div className="p-5">
        <CurrentStepComponent />
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentStepIndex === 0}
          className="rounded-md border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          Back
        </button>

        <button
          type="button"
          onClick={goNext}
          className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          {isLastStep ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
