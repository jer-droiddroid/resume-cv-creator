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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text">Student Organizations &amp; Leadership</h2>
          <p className="text-sm text-text-muted">
            Pick a role type and enter your numbers — we will build strong action-verb bullets automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <label htmlFor="org-currency-select" className="text-xs font-medium text-text-muted">
              Currency:
            </label>
            <select
              id="org-currency-select"
              {...register('currency')}
              className="rounded-[6px] border border-border bg-white px-2.5 py-1.5 text-xs font-medium text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="PHP">PHP (₱)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="SGD">SGD (S$)</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => append(createEmptyOrganization('marketing'))}
            className="shrink-0 rounded-[6px] bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent transition-colors cursor-pointer"
          >
            + Add Organization
          </button>
        </div>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-text-muted italic py-5 text-center border border-dashed border-border bg-page rounded-[10px]">
          No organizations added yet. Click &ldquo;+ Add Organization&rdquo; above.
        </p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => {
          const currentOrg = orgValues[index] || field
          const roleType = currentOrg.roleType || 'marketing'
          const roleTemplate = ROLE_TEMPLATES[roleType] || ROLE_TEMPLATES.marketing
          const previewBullets = generateBullets(currentOrg, currency)
          const orgName = currentOrg?.organization?.trim() || currentOrg?.title?.trim()

          return (
            <div
              key={field.id}
              className="rounded-[10px] border border-border bg-page p-4 space-y-3"
            >
              {/* Header with reorder and remove buttons */}
              <div className="flex items-center justify-between border-b border-border pb-2.5 gap-2">
                <span className="text-xs font-semibold text-text truncate">
                  Organization {index + 1}
                  {orgName ? ` — ${orgName}` : ''}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => swap(index, index - 1)}
                    aria-label={`Move organization entry ${index + 1} up`}
                    title="Move up"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-white text-text hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40 cursor-pointer transition-colors"
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
                    disabled={index === fields.length - 1}
                    onClick={() => swap(index, index + 1)}
                    aria-label={`Move organization entry ${index + 1} down`}
                    title="Move down"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-border bg-white text-text hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-40 cursor-pointer transition-colors"
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
                    onClick={() => remove(index)}
                    aria-label={`Remove organization entry ${index + 1}`}
                    className="inline-flex h-7 items-center rounded-[6px] border border-error/25 bg-white px-2.5 text-xs font-medium text-error hover:bg-error/8 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`org-role-type-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Role Template Type
                  </label>
                  <select
                    id={`org-role-type-${index}`}
                    {...register(`organizations.${index}.roleType`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
                  >
                    {Object.entries(ROLE_TEMPLATES).map(([key, tpl]) => (
                      <option key={key} value={key}>
                        {tpl.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor={`org-title-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Position / Title
                  </label>
                  <input
                    id={`org-title-${index}`}
                    type="text"
                    placeholder="e.g. Chapter President or VP for Publicity"
                    {...register(`organizations.${index}.title`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`org-name-${index}`}
                    className="block text-xs font-medium text-text mb-1"
                  >
                    Organization Name
                  </label>
                  <input
                    id={`org-name-${index}`}
                    type="text"
                    placeholder="e.g. ACM Student Chapter"
                    {...register(`organizations.${index}.organization`)}
                    className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div>
                  <span className="block text-xs font-medium text-text mb-1">
                    Start Date
                  </span>
                  <MonthYearPicker name={`organizations.${index}.startDate`} label={`Organization ${index + 1} start date`} />
                </div>

                <div>
                  <span className="block text-xs font-medium text-text mb-1">End Date</span>
                  <MonthYearPicker name={`organizations.${index}.endDate`} label={`Organization ${index + 1} end date`} allowPresent />
                </div>
              </div>

              {/* Dynamic numeric metrics based on roleType */}
              <div className="rounded-[8px] bg-white p-3.5 border border-border space-y-2.5">
                <p className="text-xs font-semibold text-text">
                  Key Metrics ({roleTemplate.label}) — Numbers only, leave blank to skip
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {roleTemplate.fields.map((metricField) => (
                    <div key={metricField.key}>
                      <label
                        htmlFor={`org-metric-${index}-${metricField.key}`}
                        className="block text-xs text-text-muted mb-1"
                      >
                        {metricField.label}
                        {metricField.isCurrency ? ` (${currency})` : ''}
                      </label>
                      <input
                        id={`org-metric-${index}-${metricField.key}`}
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
                        className="w-full rounded-[6px] border border-border bg-white px-2.5 py-1.5 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                  ))}
                </div>

                {/* Live preview of the generated bullets */}
                {previewBullets.length > 0 && (
                  <div className="pt-2.5 border-t border-border">
                    <p className="text-xs font-semibold text-accent mb-1">
                      Auto-generated bullets:
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-xs text-text">
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

