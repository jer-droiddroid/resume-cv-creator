import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { DEFAULT_OJT_PRESET, OJT_PRESETS, getMatchingPreset, getPresetSections } from '../../data/ojtPresets'
import { buildFileName } from '../../utils/sectionHelpers'

export default function OjtSettings() {
  const { register, control, getValues, setValue } = useFormContext()
  const data = useWatch({ control })
  const [notice, setNotice] = useState('')
  const isOjtMode = Boolean(data?.isOjtMode)
  const matchingPreset = getMatchingPreset(data?.sections)
  const selectedPreset = OJT_PRESETS.find((item) => item.id === matchingPreset)

  const applyPreset = (id) => {
    setValue('sections', getPresetSections(id, getValues('sections')), { shouldDirty: true })
    setValue('ojtPreset', id, { shouldDirty: true })
    setNotice(`${OJT_PRESETS.find((item) => item.id === id).name} applied. Your details and section visibility are kept.`)
  }

  return (
    <section aria-label="OJT application settings" className="space-y-3 border-y border-border py-4">
      <label className="flex min-h-11 cursor-pointer items-start gap-3">
        <input type="checkbox" checked={isOjtMode} onChange={(event) => {
          setValue('isOjtMode', event.target.checked, { shouldDirty: true })
          setNotice('')
          if (event.target.checked && !getValues('ojtPreset')) applyPreset(DEFAULT_OJT_PRESET)
        }} className="mt-1 h-4 w-4 shrink-0 accent-accent focus-visible:outline-2 focus-visible:outline-accent" />
        <span>
          <span className="block text-sm font-semibold text-text">OJT / Practicum Application Mode</span>
          <span className="mt-1 block text-xs leading-relaxed text-text-muted">Use a Career Objective, add training availability, and name your PDF for an OJT application.</span>
        </span>
      </label>
      {isOjtMode && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="ojt-preset" className="block text-sm font-medium text-text">OJT starting structure</label>
            <select id="ojt-preset" value={matchingPreset} onChange={(event) => applyPreset(event.target.value)} aria-describedby="ojt-preset-help"
              className="min-h-11 w-full rounded-input border border-border bg-white px-3 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent">
              {!matchingPreset && <option value="" disabled>Custom section order</option>}
              {OJT_PRESETS.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}{preset.id === DEFAULT_OJT_PRESET ? ' (recommended)' : ''}</option>)}
            </select>
            <p id="ojt-preset-help" className="text-xs leading-relaxed text-text-muted">{selectedPreset?.description || 'Your section order is customized.'} Change the order anytime in Section Settings. Empty sections stay hidden; split and sidebar designs order sections within each column.</p>
            <p className="text-xs leading-relaxed text-text-muted">Standard is the suggested design for a simple, one-page application. Change Template lets you choose any design.</p>
            {notice && <p role="status" className="text-xs text-text-muted">{notice}</p>}
          </div>
          {data?.ojtPreset === 'portfolio-first' && (
            <p className="text-xs leading-relaxed text-text-muted">Add your Portfolio / GitHub Website below. Its link will be highlighted in your header.</p>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              ['courseCode', 'Course Code', 'e.g. BSIT, BSBA, BSHM'],
              ['requiredHours', 'Required OJT Hours', 'e.g. 486 hours'],
              ['preferredStartDate', 'Preferred Start Date', 'e.g. January 15, 2027'],
            ].map(([field, label, placeholder]) => (
              <div key={field}>
                <label htmlFor={`ojt-${field}`} className="mb-1 block text-xs font-medium text-text">{label}</label>
                <input id={`ojt-${field}`} type="text" placeholder={placeholder} {...register(`ojtInfo.${field}`)}
                  className="min-h-11 w-full rounded-input border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-accent" />
              </div>
            ))}
          </div>
          <p className="break-words text-xs leading-relaxed text-text-muted">PDF filename: <strong className="text-text">{buildFileName(data)}</strong></p>
        </div>
      )}
    </section>
  )
}
