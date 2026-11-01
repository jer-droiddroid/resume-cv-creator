import { useFormContext, useWatch } from 'react-hook-form'

// Reusable string-list editor for skills, awards, and certifications
function StringArraySection({ name, title, subtitle, placeholder }) {
  const { control, register, setValue } = useFormContext()
  const items = useWatch({ control, name }) || []

  const addItem = () => {
    setValue(name, [...items, ''])
  }

  const removeItem = (idx) => {
    setValue(
      name,
      items.filter((_, i) => i !== idx)
    )
  }

  const moveItem = (idx, direction) => {
    const target = idx + direction
    if (target < 0 || target >= items.length) return
    const next = [...items]
    const temp = next[idx]
    next[idx] = next[target]
    next[target] = temp
    setValue(name, next)
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
        >
          + Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-400 italic">None added yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((_, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder={placeholder}
                {...register(`${name}.${index}`)}
                className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
              />
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
                className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
                className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SkillsExtrasStep() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Skills, Awards &amp; Certifications</h2>
        <p className="text-sm text-slate-500">
          Add technical skills, academic honors, and relevant certificates.
        </p>
      </div>

      {/* Tip callout */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        <strong className="font-semibold text-slate-900">Tip:</strong> Stick to concrete hard skills (languages, software, developer tools, hardware). Avoid subjective soft skills like <em>"punctual"</em>, <em>"hard worker"</em>, or <em>"team player"</em>—demonstrate those traits through your experience accomplishments instead.
      </div>

      <StringArraySection
        name="skills"
        title="Skills"
        subtitle="Programming languages, tools, laboratory techniques, or languages"
        placeholder="e.g. React, Python, Figma, Public Speaking"
      />

      <StringArraySection
        name="awards"
        title="Awards & Honors"
        subtitle="Hackathons, scholarships, academic distinctions"
        placeholder="e.g. 1st Place, Inter-University Hackathon 2025"
      />

      <StringArraySection
        name="certifications"
        title="Certifications"
        subtitle="Online courses, industry certifications, licenses"
        placeholder="e.g. AWS Certified Cloud Practitioner (2025)"
      />
    </div>
  )
}

