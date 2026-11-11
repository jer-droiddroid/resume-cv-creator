import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { createEmptyExperience } from '../../data/defaultResume'
import MonthYearPicker from './MonthYearPicker'

export default function ExperienceStep() {
  const { control, register, setValue } = useFormContext()
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'experience',
  })

  // Watch experience array so we can add/remove individual bullet strings inside each entry
  const experienceValues = useWatch({ control, name: 'experience' }) || []

  const addBullet = (expIndex) => {
    const currentBullets = experienceValues[expIndex]?.bullets || []
    setValue(`experience.${expIndex}.bullets`, [...currentBullets, ''])
  }

  const removeBullet = (expIndex, bulletIndex) => {
    const currentBullets = experienceValues[expIndex]?.bullets || []
    setValue(
      `experience.${expIndex}.bullets`,
      currentBullets.filter((_, idx) => idx !== bulletIndex)
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-text">Work &amp; Internship Experience</h2>
          <p className="text-sm text-text-muted">
            Internships, part-time jobs, research assistantships, or freelance work.
          </p>
        </div>
        <button
          type="button"
          onClick={() => append(createEmptyExperience())}
          className="shrink-0 rounded-[6px] bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent transition-colors cursor-pointer"
        >
          + Add Experience
        </button>
      </div>

      {/* Tip callout */}
      <div className="rounded-[10px] border border-border bg-page p-3.5 text-xs text-text-muted leading-relaxed">
        <strong className="font-semibold text-text">Tip:</strong> Frame each accomplishment using the formula:
        <span className="font-medium text-text italic block mt-0.5">
          &ldquo;Accomplished [X] as measured by [Y], by doing [Z]&rdquo;
        </span>
        Start with a strong action verb (<em>developed, spearheaded, reduced, automated</em>) instead of passive phrasing like <em>&ldquo;responsible for&rdquo;</em> or <em>&ldquo;helped with&rdquo;</em>.
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-text-muted italic py-5 text-center border border-dashed border-border bg-page rounded-[10px]">
          No experience entries yet. Click &ldquo;+ Add Experience&rdquo; to add an internship or job.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const bullets = experienceValues[index]?.bullets || ['']
          const roleTitle = experienceValues[index]?.title?.trim()

          return (
            <div
              key={field.id}
              className="rounded-[10px] border border-border bg-page p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-border pb-2.5 gap-2">
                <span className="text-xs font-semibold text-text truncate">
                  Experience {index + 1}
                  {roleTitle ? ` — ${roleTitle}` : ''}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => swap(index, index - 1)}
                    aria-label={`Move experience entry ${index + 1} up`}
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
                    aria-label={`Move experience entry ${index + 1} down`}
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
                    aria-label={`Remove experience entry ${index + 1}`}
                    className="inline-flex h-7 items-center rounded-[6px] border border-error/25 bg-white px-2.5 text-xs font-medium text-error hover:bg-error/8 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`exp-title-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Role / Title
                  </label>
                  <input
                    id={`exp-title-${index}`}
                    type="text"
                    placeholder="e.g. Software Engineering Intern"
                    {...register(`experience.${index}.title`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`exp-company-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Company / Organization
                  </label>
                  <input
                    id={`exp-company-${index}`}
                    type="text"
                    placeholder="e.g. Acme Technologies"
                    {...register(`experience.${index}.company`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div>
                  <span className="block text-xs font-medium text-text mb-1">
                    Start Date
                  </span>
                  <MonthYearPicker name={`experience.${index}.startDate`} label={`Experience ${index + 1} start date`} />
                </div>

                <div>
                  <span className="block text-xs font-medium text-text mb-1">End Date</span>
                  <MonthYearPicker name={`experience.${index}.endDate`} label={`Experience ${index + 1} end date`} allowPresent />
                </div>
              </div>

              {/* Bullet points list */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="block text-xs font-medium text-text">
                    Accomplishment Bullets
                  </span>
                  <button
                    type="button"
                    onClick={() => addBullet(index)}
                    className="text-xs font-semibold text-accent hover:text-accent-hover underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-accent rounded-xs cursor-pointer"
                  >
                    + Add Bullet
                  </button>
                </div>

                {bullets.map((_, bIndex) => (
                  <div key={bIndex} className="flex items-center gap-2">
                    <span className="text-text-muted text-sm select-none" aria-hidden="true">
                      •
                    </span>
                    <input
                      type="text"
                      aria-label={`Experience ${index + 1} accomplishment bullet ${bIndex + 1}`}
                      placeholder="Start with an action verb (e.g. Built responsive dashboard...)"
                      {...register(`experience.${index}.bullets.${bIndex}`)}
                      className="flex-1 rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    />
                    {bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBullet(index, bIndex)}
                        aria-label={`Remove bullet ${bIndex + 1} from experience ${index + 1}`}
                        title="Remove bullet"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-white text-error hover:bg-error/8 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer transition-colors"
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
                          <path d="M4.5 4.5 11.5 11.5" />
                          <path d="M11.5 4.5 4.5 11.5" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

