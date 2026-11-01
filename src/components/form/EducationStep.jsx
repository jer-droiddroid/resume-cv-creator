import { useFieldArray, useFormContext } from 'react-hook-form'
import { createEmptyEducation } from '../../data/defaultResume'

export default function EducationStep() {
  const { control, register } = useFormContext()
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'education',
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Education</h2>
          <p className="text-sm text-slate-500">
            Add your university, degree, honours, or relevant coursework.
          </p>
        </div>
        <button
          type="button"
          onClick={() => append(createEmptyEducation())}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
        >
          + Add Education
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-slate-500 italic py-4 text-center border border-dashed border-slate-300 rounded-lg">
          No education entries yet. Click "+ Add Education" above.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3"
          >
            {/* Card header with reorder & delete controls */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Education #{index + 1}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => swap(index, index - 1)}
                  className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  title="Move Up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={index === fields.length - 1}
                  onClick={() => swap(index, index + 1)}
                  className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                  title="Move Down"
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
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  School / University
                </label>
                <input
                  type="text"
                  placeholder="e.g. University of the Philippines Diliman"
                  {...register(`education.${index}.school`)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Degree / Program
                </label>
                <input
                  type="text"
                  placeholder="e.g. BS Computer Science"
                  {...register(`education.${index}.degree`)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  type="text"
                  placeholder="e.g. Aug 2023"
                  {...register(`education.${index}.startDate`)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  End Date (or Expected)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Present or Jun 2027"
                  {...register(`education.${index}.endDate`)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Honors, GWA/GPA, or Highlights
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dean's Lister (GWA: 1.35), DOST Merit Scholar"
                  {...register(`education.${index}.details`)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

