import { useState } from 'react'
import PersonalInfoStep from './PersonalInfoStep'
import SummaryStep from './SummaryStep'
import EducationStep from './EducationStep'
import ExperienceStep from './ExperienceStep'
import OrganizationsStep from './OrganizationsStep'
import ProjectsStep from './ProjectsStep'
import SkillsExtrasStep from './SkillsExtrasStep'
import SectionSettingsStep from './SectionSettingsStep'

const WIZARD_STEPS = [
  { id: 'personal', label: '1. Personal Info', component: PersonalInfoStep },
  { id: 'summary', label: '2. Summary', component: SummaryStep },
  { id: 'education', label: '3. Education', component: EducationStep },
  { id: 'experience', label: '4. Experience', component: ExperienceStep },
  { id: 'organizations', label: '5. Organizations', component: OrganizationsStep },
  { id: 'projects', label: '6. Projects', component: ProjectsStep },
  { id: 'skills', label: '7. Skills & Extras', component: SkillsExtrasStep },
  { id: 'settings', label: '8. Section Order', component: SectionSettingsStep },
]

export default function FormWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const CurrentStepComponent = WIZARD_STEPS[currentStepIndex].component

  const goPrev = () => setCurrentStepIndex((i) => Math.max(0, i - 1))
  const goNext = () => setCurrentStepIndex((i) => Math.min(WIZARD_STEPS.length - 1, i + 1))

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Step tabs bar */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 p-2 gap-1.5">
        {WIZARD_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStepIndex(index)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {step.label}
            </button>
          )
        })}
      </div>

      {/* Active step form fields */}
      <div className="p-5">
        <CurrentStepComponent />
      </div>

      {/* Previous / Next footer navigation */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentStepIndex === 0}
          className="rounded-md border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
        >
          ← Previous
        </button>

        <span className="text-xs text-slate-500">
          Step {currentStepIndex + 1} of {WIZARD_STEPS.length}
        </span>

        <button
          type="button"
          onClick={goNext}
          disabled={currentStepIndex === WIZARD_STEPS.length - 1}
          className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

