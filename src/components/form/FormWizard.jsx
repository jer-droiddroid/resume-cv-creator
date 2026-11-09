import { useState, useRef, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { isSectionNonEmpty } from '../../utils/sectionHelpers'
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

export default function FormWizard({ disabled = false }) {
  const { watch } = useFormContext()
  const formValues = watch()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [visitedSteps, setVisitedSteps] = useState(() => new Set([0]))

  const menuButtonRef = useRef(null)
  const menuDropdownRef = useRef(null)
  const itemRefs = useRef([])

  const currentStep = WIZARD_STEPS[currentStepIndex]
  const CurrentStepComponent = currentStep.component
  const totalSteps = WIZARD_STEPS.length
  const isLastStep = currentStepIndex === totalSteps - 1

  const isStepCompleted = (stepId, idx) => {
    if (stepId === 'personal') {
      const fullName = formValues?.personalInfo?.fullName?.trim() || ''
      const email = formValues?.personalInfo?.email?.trim() || ''
      return fullName.length > 0 || email.length > 0
    }
    if (stepId === 'skills') {
      return (
        isSectionNonEmpty('skills', formValues) ||
        isSectionNonEmpty('awards', formValues) ||
        isSectionNonEmpty('certifications', formValues)
      )
    }
    if (stepId === 'settings') {
      return visitedSteps.has(idx) && idx !== currentStepIndex
    }
    return isSectionNonEmpty(stepId, formValues)
  }

  // Track visited steps
  const goToStep = (index) => {
    setCurrentStepIndex(index)
    setVisitedSteps((prev) => new Set(prev).add(index))
    setIsMenuOpen(false)
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
    <div className="rounded-[10px] border border-[#E3E8EE] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] overflow-hidden">
      {/* Step Header with Progress Bar */}
      <div className="border-b border-[#E3E8EE] bg-white px-5 pt-4 pb-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Current Step Text */}
          <div className="text-sm font-semibold text-[#1A2233] truncate">
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
              disabled={disabled}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              onKeyDown={handleKeyDown}
              className="rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1 text-xs font-medium text-[#1A2233] hover:bg-[#F6F8FA] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
                className="absolute right-0 mt-1.5 w-60 max-w-[calc(100vw-2.5rem)] rounded-[10px] border border-[#E3E8EE] bg-white p-1.5 shadow-lg z-30 divide-y divide-[#E3E8EE]"
              >
                <div className="space-y-0.5 pb-1">
                  {WIZARD_STEPS.map((step, idx) => {
                    const isCurrent = idx === currentStepIndex
                    const isCompleted = isStepCompleted(step.id, idx)

                    return (
                      <button
                        key={step.id}
                        ref={(el) => (itemRefs.current[idx] = el)}
                        role="menuitem"
                        type="button"
                        onClick={() => {
                          goToStep(idx)
                          menuButtonRef.current?.focus()
                        }}
                        className={`w-full flex items-center justify-between rounded-[6px] px-2.5 py-1.5 text-xs text-left transition focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] cursor-pointer ${
                          isCurrent
                            ? 'bg-[#1F4D8F] text-white font-semibold'
                            : 'text-[#1A2233] hover:bg-[#F6F8FA]'
                        }`}
                      >
                        <span className="truncate">
                          {idx + 1}. {step.name}
                        </span>

                        {/* Completed Content Checkmark */}
                        {isCompleted && !isCurrent && (
                          <span
                            aria-label="Completed"
                            className="inline-flex items-center text-[#1F4D8F] ml-2 shrink-0"
                          >
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-3.5 w-3.5"
                            >
                              <path d="m3.5 8.5 3 3 6-6.5" />
                            </svg>
                          </span>
                        )}
                        {isCurrent && (
                          <span
                            aria-label="Current step"
                            className="text-white/90 text-xs ml-2 shrink-0"
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

        {/* Interactive 8-Step Segmented Progress Strip */}
        <div
          role="group"
          aria-label="Resume builder steps"
          className="grid grid-cols-8 gap-1.5"
        >
          {WIZARD_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIndex
            const isCompleted = isStepCompleted(step.id, idx)

            return (
              <button
                key={step.id}
                type="button"
                disabled={disabled}
                onClick={() => goToStep(idx)}
                title={`Step ${idx + 1}: ${step.name}`}
                aria-label={`Step ${idx + 1}: ${step.name}${isCurrent ? ' (current)' : isCompleted ? ' (completed)' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                className="group py-1 focus:outline-none cursor-pointer disabled:cursor-not-allowed"
              >
                <span
                  className={`block h-1.5 w-full rounded-full transition-all duration-200 group-focus-visible:ring-2 group-focus-visible:ring-[#1F4D8F] group-focus-visible:ring-offset-1 ${
                    isCurrent
                      ? 'bg-[#1F4D8F]'
                      : isCompleted
                        ? 'bg-[#1F4D8F]/45 group-hover:bg-[#1F4D8F]/70'
                        : 'bg-[#EEF2F6] group-hover:bg-[#CBD5E1]'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Step Form Fields */}
      <div className="p-5">
        <CurrentStepComponent />
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-[#E3E8EE] bg-[#F6F8FA] px-5 py-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={disabled || currentStepIndex === 0}
          className="rounded-[6px] border border-[#E3E8EE] bg-white px-4 py-1.5 text-sm font-medium text-[#1A2233] hover:bg-[#F6F8FA] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] transition-colors"
        >
          Back
        </button>

        {isLastStep ? (
          <span className="text-xs font-medium text-[#5B6678]">
            All steps complete — ready to download PDF
          </span>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={disabled}
            className="rounded-[6px] bg-[#1F4D8F] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#173b6e] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
