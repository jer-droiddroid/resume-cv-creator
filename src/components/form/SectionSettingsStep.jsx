import { useFieldArray, useFormContext } from 'react-hook-form'
import { DEFAULT_SECTIONS } from '../../data/defaultResume'

// Map section IDs to friendly display names
const SECTION_LABELS = Object.fromEntries(
  DEFAULT_SECTIONS.map((sec) => [sec.id, sec.label])
)

export default function SectionSettingsStep() {
  const { control, register } = useFormContext()
  const { fields, swap } = useFieldArray({
    control,
    name: 'sections',
  })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Section Order &amp; Visibility</h2>
        <p className="text-sm text-slate-500">
          Reorder how sections appear on your PDF, or uncheck a section to hide it completely.
          (Empty sections are hidden automatically.)
        </p>
      </div>

      <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
          >
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                {...register(`sections.${index}.visible`)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-sm font-medium text-slate-800">
                {SECTION_LABELS[field.id] || field.id}
              </span>
            </label>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => swap(index, index - 1)}
                className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                title="Move section up"
              >
                ↑ Up
              </button>
              <button
                type="button"
                disabled={index === fields.length - 1}
                onClick={() => swap(index, index + 1)}
                className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                title="Move section down"
              >
                ↓ Down
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

