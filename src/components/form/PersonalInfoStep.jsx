import { useFormContext } from 'react-hook-form'
import { buildFileName } from '../../utils/sectionHelpers'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function PersonalInfoStep() {
  const { register, watch, setValue } = useFormContext()
  const formValues = watch()
  const documentType = formValues?.documentType || 'resume'
  const isOjtMode = Boolean(formValues?.isOjtMode)
  const emailValue = formValues?.personalInfo?.email || ''
  const isEmailInvalid = emailValue.trim().length > 0 && !EMAIL_REGEX.test(emailValue.trim())

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
        <p className="text-sm text-slate-500">
          How employers or academic committees can reach you.
        </p>
      </div>

      {/* Document Type & Currency quick settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-slate-100 rounded-lg border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Document format
          </label>
          <div
            role="radiogroup"
            aria-label="Document format"
            className="inline-flex w-full rounded-md bg-white border border-slate-300 p-0.5 text-xs shadow-2xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={documentType === 'resume'}
              onClick={() => setValue('documentType', 'resume', { shouldDirty: true })}
              className={`flex-1 rounded py-1.5 text-center text-xs font-medium transition cursor-pointer ${
                documentType === 'resume'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Resume (1 page)
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={documentType === 'cv'}
              onClick={() => setValue('documentType', 'cv', { shouldDirty: true })}
              className={`flex-1 rounded py-1.5 text-center text-xs font-medium transition cursor-pointer ${
                documentType === 'cv'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              CV (Multi-page)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Currency (for org metrics)
          </label>
          <select
            {...register('currency')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-slate-800 focus:outline-none"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="PHP">PHP (₱)</option>
            <option value="SGD">SGD (S$)</option>
          </select>
        </div>

        {/* OJT / Practicum Mode Toggle */}
        <div className="sm:col-span-2 pt-2 border-t border-slate-200/80">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('isOjtMode')}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-900">
                OJT / Practicum Application Mode
              </span>
              <p className="text-slate-500 mt-0.5">
                Adds required OJT hours &amp; start date, renames Summary to Career Objective, and formats your PDF filename as{' '}
                <code className="text-[11px] bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-700">
                  Lastname_Firstname_Course_OJT_Resume.pdf
                </code>
              </p>
            </div>
          </label>

          {isOjtMode && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-md border border-slate-200">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. BSIT, BSBA, BSHM"
                  {...register('ojtInfo.courseCode')}
                  className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Required OJT Hours
                </label>
                <input
                  type="text"
                  placeholder="e.g. 486 hours"
                  {...register('ojtInfo.requiredHours')}
                  className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Preferred Start Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. January 15, 2026"
                  {...register('ojtInfo.preferredStartDate')}
                  className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs focus:border-slate-800 focus:outline-none"
                />
              </div>
              <div className="sm:col-span-3 text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                <span>
                  PDF filename preview: <strong className="text-slate-700">{buildFileName(formValues)}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            placeholder="e.g. Alex Carter"
            {...register('personalInfo.fullName')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            aria-invalid={isEmailInvalid}
            placeholder="alex.carter@university.edu"
            {...register('personalInfo.email')}
            className={`w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none ${
              isEmailInvalid
                ? 'border-[#C0392B] focus:border-[#C0392B]'
                : 'border-slate-300 focus:border-slate-800'
            }`}
          />
          {isEmailInvalid && (
            <p className="mt-1 text-xs text-[#C0392B]">
              Enter a valid email address like name@university.edu.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input
            type="text"
            placeholder="(555) 234-5678"
            {...register('personalInfo.phone')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input
            type="text"
            placeholder="San Francisco, CA"
            {...register('personalInfo.location')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
          <input
            type="text"
            placeholder="linkedin.com/in/alexcarter"
            {...register('personalInfo.linkedin')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            Include your profile handle, e.g. linkedin.com/in/yourname
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Portfolio / GitHub Website
          </label>
          <input
            type="text"
            placeholder="alexcarter.dev or github.com/alexcarter"
            {...register('personalInfo.portfolio')}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            Optional personal website, portfolio, or GitHub profile URL.
          </p>
        </div>
      </div>
    </div>
  )
}
