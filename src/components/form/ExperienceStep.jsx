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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Work &amp; Internship Experience</h2>
          <p className="text-sm text-slate-500">
            Internships, part-time jobs, research assistantships, or freelance work.
          </p>
        </div>
        <button
          type="button"
          onClick={() => append(createEmptyExperience())}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
        >
          + Add Experience
        </button>
      </div>

      {/* Tip callout */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        <strong className="font-semibold text-slate-900">Tip:</strong> Frame each accomplishment using the formula:
        <span className="font-medium text-slate-800 italic block mt-0.5">
          "Accomplished [X] as measured by [Y], by doing [Z]"
        </span>
        Start with a strong action verb (<em>developed, spearheaded, reduced, automated</em>) instead of passive phrasing like <em>"responsible for"</em> or <em>"helped with"</em>.
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-slate-500 italic py-4 text-center border border-dashed border-slate-300 rounded-lg">
          No experience entries yet. Click "+ Add Experience" to add an internship or job.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const bullets = experienceValues[index]?.bullets || ['']

          return (
            <div
              key={field.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Experience #{index + 1}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => swap(index, index - 1)}
                    className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === fields.length - 1}
                    onClick={() => swap(index, index + 1)}
                    className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded border border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Frontend Developer Intern"
                    {...register(`experience.${index}.title`)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TechStart Manila"
                    {...register(`experience.${index}.company`)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <MonthYearPicker name={`experience.${index}.startDate`} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                  <MonthYearPicker name={`experience.${index}.endDate`} allowPresent />
                </div>
              </div>

              {/* Bullet points list */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-700">
                    Accomplishment Bullets
                  </label>
                  <button
                    type="button"
                    onClick={() => addBullet(index)}
                    className="text-xs font-medium text-slate-700 hover:text-slate-900 underline cursor-pointer"
                  >
                    + Add Bullet
                  </button>
                </div>

                {bullets.map((_, bIndex) => (
                  <div key={bIndex} className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">•</span>
                    <input
                      type="text"
                      placeholder="Start with an action verb (e.g. Built responsive dashboard...)"
                      {...register(`experience.${index}.bullets.${bIndex}`)}
                      className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                    />
                    {bullets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBullet(index, bIndex)}
                        className="text-xs text-red-500 hover:text-red-700 px-1.5 cursor-pointer"
                        title="Remove bullet"
                      >
                        ✕
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

