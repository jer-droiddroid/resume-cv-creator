import CourseWritingGuide from './CourseWritingGuide'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { createEmptyEducation } from '../../data/defaultResume'
import MonthYearPicker from './MonthYearPicker'

export default function EducationStep() {
  const { control, register } = useFormContext()
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'education',
  })
  const educationValues = useWatch({ control, name: 'education' }) || []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-text">Education</h2>
          <p className="text-sm text-text-muted">
            Add your university, degree, honors, or relevant coursework.
          </p>
        </div>
        <button
          type="button"
          onClick={() => append(createEmptyEducation())}
          className="shrink-0 rounded-[6px] bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent transition-colors cursor-pointer"
        >
          + Add Education
        </button>
      </div>

      <CourseWritingGuide section="education" />

      {fields.length === 0 && (
        <p className="text-sm text-text-muted italic py-5 text-center border border-dashed border-border bg-page rounded-[10px]">
          No education entries yet. Click &ldquo;+ Add Education&rdquo; above.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const schoolName = educationValues[index]?.school?.trim()

          return (
            <div
              key={field.id}
              className="rounded-[10px] border border-border bg-page p-4 space-y-3"
            >
              {/* Card header with reorder & delete controls */}
              <div className="flex items-center justify-between border-b border-border pb-2.5 gap-2">
                <span className="text-xs font-semibold text-text truncate">
                  Education {index + 1}
                  {schoolName ? ` — ${schoolName}` : ''}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => swap(index, index - 1)}
                    aria-label={`Move education entry ${index + 1} up`}
                    title="Move up"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-white text-text hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M8 12.5v-9" />
                      <path d="M4.5 7 8 3.5 11.5 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    disabled={index === fields.length - 1}
                    onClick={() => swap(index, index + 1)}
                    aria-label={`Move education entry ${index + 1} down`}
                    title="Move down"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-white text-text hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40 cursor-pointer transition-colors"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M8 3.5v9" />
                      <path d="M4.5 9 8 12.5 11.5 9" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove education entry ${index + 1}`}
                    className="inline-flex h-7 items-center rounded-[6px] border border-error/25 bg-white px-2.5 text-xs font-medium text-error hover:bg-error/8 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`edu-school-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    School / University
                  </label>
                  <input
                    id={`edu-school-${index}`}
                    type="text"
                    placeholder="e.g. State University"
                    {...register(`education.${index}.school`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`edu-degree-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Degree / Program
                  </label>
                  <input
                    id={`edu-degree-${index}`}
                    type="text"
                    placeholder="e.g. B.S. in Computer Science"
                    {...register(`education.${index}.degree`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div>
                  <span className="block text-xs font-medium text-text mb-1">Start Date</span>
                  <MonthYearPicker name={`education.${index}.startDate`} label={`Education ${index + 1} start date`} />
                </div>

                <div>
                  <span className="block text-xs font-medium text-text mb-1">
                    End Date (or Expected)
                  </span>
                  <MonthYearPicker name={`education.${index}.endDate`} label={`Education ${index + 1} end date`} allowPresent />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`edu-details-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Honors, GPA, or Highlights
                  </label>
                  <input
                    id={`edu-details-${index}`}
                    type="text"
                    placeholder="e.g. Dean's List (GPA: 3.85/4.0), Academic Excellence Scholarship"
                    {...register(`education.${index}.details`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`edu-coursework-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Relevant Coursework (Optional)
                  </label>
                  <input
                    id={`edu-coursework-${index}`}
                    type="text"
                    placeholder="e.g. Database Management Systems, Systems Analysis and Design, Web Development"
                    {...register(`education.${index}.coursework`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

