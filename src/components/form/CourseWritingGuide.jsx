import { useFormContext, useWatch } from 'react-hook-form'
import { useId } from 'react'
import { OJT_WRITING_GUIDES } from '../../data/ojtWritingGuides'

export default function CourseWritingGuide({ section }) {
  const { control, setValue } = useFormContext()
  const isOjtMode = useWatch({ control, name: 'isOjtMode' })
  const guideId = useWatch({ control, name: 'ojtInfo.writingGuide' }) || ''
  const id = useId()
  if (!isOjtMode) return null
  const guide = OJT_WRITING_GUIDES.find((item) => item.id === guideId)

  return (
    <details className="border-y border-border py-3">
      <summary className="min-h-11 cursor-pointer text-sm font-medium text-text">Optional course writing examples</summary>
      <div className="space-y-3 pt-2">
        <p className="text-xs leading-relaxed text-text-muted">Use these as ideas and describe your own experience. Examples are never added to your resume or PDF.</p>
        <label htmlFor={id} className="block text-sm font-medium text-text">Course guide</label>
        <select id={id} value={guideId} onChange={(event) => setValue('ojtInfo.writingGuide', event.target.value, { shouldDirty: true })}
          className="min-h-11 w-full rounded-input border border-border bg-white px-3 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent">
          <option value="">Choose a course guide</option>
          {OJT_WRITING_GUIDES.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        {guide && <p className="text-sm leading-relaxed text-text" aria-live="polite">{guide[section]}</p>}
      </div>
    </details>
  )
}
