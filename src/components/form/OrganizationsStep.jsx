import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { createEmptyOrganization } from '../../data/defaultResume'
import { ROLE_TEMPLATES, generateBullets } from '../../data/roleTemplates'
import MonthYearPicker from './MonthYearPicker'

export default function OrganizationsStep() {
  const { control, register } = useFormContext()
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'organizations',
  })

  // Watch organizations & currency so we can show dynamic metric inputs and live bullet previews
  const orgValues = useWatch({ control, name: 'organizations' }) || []
  const currency = useWatch({ control, name: 'currency' }) || 'USD'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Student Organizations &amp; Leadership</h2>
          <p className="text-sm text-slate-500">
            Pick a role type and enter your numbers — we will build strong action-verb bullets automatically.
          </p>
        </div>
        <button
          type="button"
          onClick={() => append(createEmptyOrganization('marketing'))}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 cursor-pointer"
        >
          + Add Organization
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-slate-500 italic py-4 text-center border border-dashed border-slate-300 rounded-lg">
          No organizations added yet. Click "+ Add Organization" above.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const currentOrg = orgValues[index] || field
          const roleType = currentOrg.roleType || 'marketing'
          const roleTemplate = ROLE_TEMPLATES[roleType] || ROLE_TEMPLATES.marketing
          const previewBullets = generateBullets(currentOrg, currency)

          return (
            <div
              key={field.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3"
            >
              {/* Header with reorder and remove buttons */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Organization #{index + 1}
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
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Role Template Type
                  </label>
                  <select
                    {...register(`organizations.${index}.roleType`)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                  >
                    {Object.entries(ROLE_TEMPLATES).map(([key, tpl]) => (
                      <option key={key} value={key}>
                        {tpl.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Position / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chapter President or VP for Publicity"
                    {...register(`organizations.${index}.title`)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ACM Student Chapter"
                    {...register(`organizations.${index}.organization`)}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Start Date
                  </label>
                  <MonthYearPicker name={`organizations.${index}.startDate`} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                  <MonthYearPicker name={`organizations.${index}.endDate`} allowPresent />
                </div>
              </div>

              {/* Dynamic numeric metrics based on roleType */}
              <div className="rounded-md bg-white p-3 border border-slate-200 space-y-2">
                <p className="text-xs font-semibold text-slate-700">
                  Key Metrics ({roleTemplate.label}) — Numbers only, leave blank to skip
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {roleTemplate.fields.map((metricField) => (
                    <div key={metricField.key}>
                      <label className="block text-xs text-slate-600 mb-1">
                        {metricField.label}
                        {metricField.isCurrency ? ` (${currency})` : ''}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder={metricField.placeholder}
                        {...register(`organizations.${index}.metrics.${metricField.key}`, {
                          setValueAs: (val) =>
                            val === '' || val === null || val === undefined
                              ? undefined
                              : Number(val),
                        })}
                        className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm focus:border-slate-800 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* Live preview of the generated bullets */}
                {previewBullets.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-medium text-emerald-700 mb-1">
                      Auto-generated bullets:
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-xs text-slate-600">
                      {previewBullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

