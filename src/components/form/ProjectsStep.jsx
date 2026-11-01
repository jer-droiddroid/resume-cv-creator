import { useFieldArray, useFormContext } from 'react-hook-form'
import { createEmptyProject } from '../../data/defaultResume'

export default function ProjectsStep() {
  const { control, register } = useFormContext()
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'projects',
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Academic &amp; Personal Projects</h2>
          <p className="text-sm text-slate-500">
            Capstone projects, hackathon builds, or course projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => append(createEmptyProject())}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
        >
          + Add Project
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-slate-500 italic py-4 text-center border border-dashed border-slate-300 rounded-lg">
          No projects added yet. Click "+ Add Project" above.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Project #{index + 1}
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
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Campus Study Buddy"
                  {...register(`projects.${index}.name`)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Link / Repository
                </label>
                <input
                  type="text"
                  placeholder="e.g. github.com/mariasantos/study-buddy"
                  {...register(`projects.${index}.link`)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Tech Stack</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, PostgreSQL, Tailwind CSS"
                  {...register(`projects.${index}.techStack`)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe what you built and the problem it solved..."
                  {...register(`projects.${index}.description`)}
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

