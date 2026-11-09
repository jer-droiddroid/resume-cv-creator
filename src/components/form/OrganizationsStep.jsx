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
          <h2 className="text-lg font-semibold text-[#1A2233]">Student Organizations &amp; Leadership</h2>
          <p className="text-sm text-[#5B6678]">
            Pick a role type and enter your numbers — we will build strong action-verb bullets automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <label htmlFor="org-currency-select" className="text-xs font-medium text-[#5B6678]">
              Currency:
            </label>
            <select
              id="org-currency-select"
              {...register('currency')}
              className="rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1.5 text-xs font-medium text-[#1A2233] focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20 cursor-pointer"
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
            className="shrink-0 rounded-[6px] bg-[#1F4D8F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#173b6e] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] transition-colors cursor-pointer"
          >
            + Add Organization
          </button>
        </div>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-[#5B6678] italic py-5 text-center border border-dashed border-[#E3E8EE] bg-[#F6F8FA] rounded-[10px]">
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
              className="rounded-[10px] border border-[#E3E8EE] bg-[#F6F8FA] p-4 space-y-3"
            >
              {/* Header with reorder and remove buttons */}
              <div className="flex items-center justify-between border-b border-[#E3E8EE] pb-2.5 gap-2">
                <span className="text-xs font-semibold text-[#1A2233] truncate">
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
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#E3E8EE] bg-white text-[#1A2233] hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] disabled:opacity-40 cursor-pointer transition-colors"
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
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#E3E8EE] bg-white text-[#1A2233] hover:bg-[#EEF2F6] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] disabled:opacity-40 cursor-pointer transition-colors"
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
                    className="inline-flex h-7 items-center rounded-[6px] border border-[#C0392B]/25 bg-white px-2.5 text-xs font-medium text-[#C0392B] hover:bg-[#C0392B]/8 focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] cursor-pointer transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`org-role-type-${index}`}
                    className="block text-xs font-medium text-[#1A2233] mb-1"
                  >
                    Role Template Type
                  </label>
                  <select
                    id={`org-role-type-${index}`}
                    {...register(`organizations.${index}.roleType`)}
                    className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-sm text-[#1A2233] focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20 cursor-pointer"
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
                    className="block text-xs font-medium text-[#1A2233] mb-1"
                  >
                    Position / Title
                  </label>
                  <input
                    id={`org-title-${index}`}
                    type="text"
                    placeholder="e.g. Chapter President or VP for Publicity"
                    {...register(`organizations.${index}.title`)}
                    className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-sm text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`org-name-${index}`}
                    className="block text-xs font-medium text-[#1A2233] mb-1"
                  >
                    Organization Name
                  </label>
                  <input
                    id={`org-name-${index}`}
                    type="text"
                    placeholder="e.g. ACM Student Chapter"
                    {...register(`organizations.${index}.organization`)}
                    className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-sm text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
                  />
                </div>

                <div>
                  <span className="block text-xs font-medium text-[#1A2233] mb-1">
                    Start Date
                  </span>
                  <MonthYearPicker name={`organizations.${index}.startDate`} />
                </div>

                <div>
                  <span className="block text-xs font-medium text-[#1A2233] mb-1">End Date</span>
                  <MonthYearPicker name={`organizations.${index}.endDate`} allowPresent />
                </div>
              </div>

              {/* Dynamic numeric metrics based on roleType */}
              <div className="rounded-[8px] bg-white p-3.5 border border-[#E3E8EE] space-y-2.5">
                <p className="text-xs font-semibold text-[#1A2233]">
                  Key Metrics ({roleTemplate.label}) — Numbers only, leave blank to skip
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {roleTemplate.fields.map((metricField) => (
                    <div key={metricField.key}>
                      <label
                        htmlFor={`org-metric-${index}-${metricField.key}`}
                        className="block text-xs text-[#5B6678] mb-1"
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
                        className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1.5 text-sm text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
                      />
                    </div>
                  ))}
                </div>

                {/* Live preview of the generated bullets */}
                {previewBullets.length > 0 && (
                  <div className="pt-2.5 border-t border-[#E3E8EE]">
                    <p className="text-xs font-semibold text-[#1F4D8F] mb-1">
                      Auto-generated bullets:
                    </p>
                    <ul className="list-disc pl-4 space-y-0.5 text-xs text-[#1A2233]">
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

