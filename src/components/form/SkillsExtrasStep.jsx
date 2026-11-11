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
    <div className="rounded-[10px] border border-border bg-page p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          <p className="text-xs text-text-muted">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="shrink-0 rounded-[6px] bg-accent px-2.5 py-1 text-xs font-semibold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent transition-colors cursor-pointer"
        >
          + Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-text-muted italic">None added yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((_, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <input
                type="text"
                aria-label={`${title} item ${index + 1}`}
                placeholder={placeholder}
                {...register(`${name}.${index}`)}
                className="flex-1 rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
                aria-label={`Move ${title} item ${index + 1} up`}
                title="Move up"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-border bg-white text-text hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40 cursor-pointer transition-colors"
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
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
                aria-label={`Move ${title} item ${index + 1} down`}
                title="Move down"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-border bg-white text-text hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40 cursor-pointer transition-colors"
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
                onClick={() => removeItem(index)}
                aria-label={`Remove ${title} item ${index + 1}`}
                title="Remove"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-error/25 bg-white text-error hover:bg-error/8 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer transition-colors"
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
        <h2 className="text-lg font-semibold text-text">Skills, Awards &amp; Certifications</h2>
        <p className="text-sm text-text-muted">
          Add technical skills, academic honors, and relevant certificates.
        </p>
      </div>

      {/* Tip callout */}
      <div className="rounded-[10px] border border-border bg-page p-3.5 text-xs text-text-muted leading-relaxed">
        <strong className="font-semibold text-text">Tip:</strong> Stick to concrete hard skills (languages, software, developer tools, hardware). Avoid subjective soft skills like <em>&ldquo;punctual&rdquo;</em>, <em>&ldquo;hard worker&rdquo;</em>, or <em>&ldquo;team player&rdquo;</em>—demonstrate those traits through your experience accomplishments instead.
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

