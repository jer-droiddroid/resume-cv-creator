import { useId } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

export default function DocumentFormat({ disabled = false }) {
  const { control, setValue } = useFormContext()
  const format = useWatch({ control, name: 'documentType' }) || 'resume'
  const groupId = useId()
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Document format</legend>
      <div className="inline-flex rounded-input border border-border bg-page p-1">
        {[['resume', 'Resume'], ['cv', 'CV']].map(([value, label]) => (
          <label key={value} className="cursor-pointer">
            <input className="peer sr-only" type="radio" name={`document-format-${groupId}`} value={value}
              checked={format === value} disabled={disabled}
              onChange={() => setValue('documentType', value, { shouldDirty: true })} />
            <span className={`flex min-h-11 items-center rounded-input px-3 text-xs font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-disabled:opacity-50 ${format === value ? 'bg-accent text-white' : 'text-text-muted'}`}>
              {label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
