import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { DEFAULT_SECTIONS } from '../../data/defaultResume'

// Friendly human-readable names for each section
const SECTION_LABELS = {
  summary: 'Professional Summary / Career Objective',
  education: 'Education',
  experience: 'Work & Internship Experience',
  organizations: 'Leadership & Student Organizations',
  projects: 'Academic & Personal Projects',
  skills: 'Skills',
  awards: 'Awards & Honors',
  certifications: 'Certifications',
  ojt: 'OJT Availability',
}

export default function SectionSettingsStep() {
  const { control, register } = useFormContext()
  const { fields, swap } = useFieldArray({
    control,
    name: 'sections',
  })

  // Watch the actual form values in state (useFieldArray's field.id is an internal React key UUID)
  const sectionsData = useWatch({ control, name: 'sections' }) || []
  const isOjtMode = Boolean(useWatch({ control, name: 'isOjtMode' }))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[#1A2233]">Section Order &amp; Visibility</h2>
        <p className="text-sm text-[#5B6678]">
          Reorder how sections appear on your PDF, or uncheck a section to hide it completely.
          (Empty sections are hidden automatically.)
        </p>
      </div>

      <div className="divide-y divide-[#E3E8EE] rounded-[10px] border border-[#E3E8EE] bg-white overflow-hidden">
        {fields.map((field, index) => {
          // Resolve the human-readable section ID from the form data
          const actualItem = sectionsData[index] || {}
          const sectionKey =
            actualItem.id ||
            actualItem.sectionId ||
            DEFAULT_SECTIONS[index]?.id ||
            'section'

          const label =
            SECTION_LABELS[sectionKey] ||
            actualItem.label ||
            DEFAULT_SECTIONS[index]?.label ||
            sectionKey

          if (sectionKey === 'ojt' && !isOjtMode) {
            return null
          }

          return (
            <div
              key={field.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-[#F6F8FA] transition-colors gap-2"
            >
              <label className="flex items-center gap-3 cursor-pointer select-none min-w-0">
                <input
                  type="checkbox"
                  {...register(`sections.${index}.visible`)}
                  className="h-4 w-4 shrink-0 rounded border-[#E3E8EE] accent-[#1F4D8F] text-[#1F4D8F] focus:ring-2 focus:ring-[#1F4D8F] cursor-pointer"
                />
                <span className="text-sm font-medium text-[#1A2233] truncate">{label}</span>
              </label>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => swap(index, index - 1)}
                  aria-label={`Move ${label} section up`}
                  className="inline-flex items-center gap-1 rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1 text-xs font-medium text-[#1A2233] hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] disabled:opacity-40 cursor-pointer transition-colors"
                  title="Move section up"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="M8 12.5v-9" />
                    <path d="M4.5 7 8 3.5 11.5 7" />
                  </svg>
                  <span>Up</span>
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  onClick={() => swap(index, index + 1)}
                  aria-label={`Move ${label} section down`}
                  className="inline-flex items-center gap-1 rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1 text-xs font-medium text-[#1A2233] hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] disabled:opacity-40 cursor-pointer transition-colors"
                  title="Move section down"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                  >
                    <path d="M8 3.5v9" />
                    <path d="M4.5 9 8 12.5 11.5 9" />
                  </svg>
                  <span>Down</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
