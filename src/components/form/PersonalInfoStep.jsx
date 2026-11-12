import DocumentFormat from './DocumentFormat'
import PhotoUpload from './PhotoUpload'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { buildFileName } from '../../utils/sectionHelpers'
import {
  INTERNATIONAL_COUNTRIES,
  formatLocation,
  parseLocation,
} from '../../data/internationalLocations'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function PersonalInfoStep() {
  const { register, watch, setValue } = useFormContext()
  const formValues = watch()
  const isOjtMode = Boolean(formValues?.isOjtMode)
  const emailValue = formValues?.personalInfo?.email || ''
  const isEmailInvalid = emailValue.trim().length > 0 && !EMAIL_REGEX.test(emailValue.trim())

  const locationValue = formValues?.personalInfo?.location || ''
  const [prevLocationValue, setPrevLocationValue] = useState(locationValue)
  const initialParsed = parseLocation(locationValue)
  const [selectedCountry, setSelectedCountry] = useState(initialParsed.country || '')
  const [cityInput, setCityInput] = useState(initialParsed.city || '')

  // Sync state if formValues.personalInfo.location was changed externally (e.g. sample loaded or reset)
  if (locationValue !== prevLocationValue) {
    setPrevLocationValue(locationValue)
    const parsed = parseLocation(locationValue)
    setSelectedCountry(parsed.country || '')
    setCityInput(parsed.city || '')
  }

  const handleCountryChange = (e) => {
    const nextCountry = e.target.value
    setSelectedCountry(nextCountry)
    const formatted = formatLocation(nextCountry, cityInput)
    setPrevLocationValue(formatted)
    setValue('personalInfo.location', formatted, { shouldDirty: true })
  }

  const handleCityChange = (e) => {
    const text = e.target.value
    setCityInput(text)
    const formatted = formatLocation(selectedCountry, text)
    setPrevLocationValue(formatted)
    setValue('personalInfo.location', formatted, { shouldDirty: true })
  }

  const handleCityBlur = () => {
    const trimmed = cityInput.trim()
    if (trimmed !== cityInput) {
      setCityInput(trimmed)
      const formatted = formatLocation(selectedCountry, trimmed)
      setPrevLocationValue(formatted)
      setValue('personalInfo.location', formatted, { shouldDirty: true })
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text">Personal Information</h2>
        <p className="text-sm text-text-muted">
          How employers or academic committees can reach you.
        </p>
      </div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="personal-full-name" className="block text-sm font-medium text-text mb-1">
            Full Name
          </label>
          <input
            id="personal-full-name"
            autoComplete="name"
            type="text"
            placeholder="e.g. Alex Carter"
            {...register('personalInfo.fullName')}
            className="w-full rounded-[6px] border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        <div>
          <label htmlFor="personal-email" className="block text-sm font-medium text-text mb-1">
            Email
          </label>
          <input
            id="personal-email"
            type="email"
            aria-invalid={isEmailInvalid}
            aria-describedby={isEmailInvalid ? 'personal-email-error' : undefined}
            autoComplete="email"
            placeholder="alex.carter@university.edu"
            {...register('personalInfo.email')}
            className={`w-full rounded-[6px] border bg-white px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 ${
              isEmailInvalid
                ? 'border-error focus:border-error focus:ring-error/20'
                : 'border-border focus:border-accent focus:ring-accent/20'
            }`}
          />
          {isEmailInvalid && (
            <p id="personal-email-error" role="alert" className="mt-1 text-xs text-error">
              Enter a valid email address like name@university.edu.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="personal-phone" className="block text-sm font-medium text-text mb-1">
            Phone
          </label>
          <input
            id="personal-phone"
            autoComplete="tel"
            type="tel"
            placeholder="(555) 234-5678"
            {...register('personalInfo.phone')}
            className="w-full rounded-[6px] border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Location: International Country Dropdown & City Input */}
        <div className="sm:col-span-2 space-y-1.5">
          <input type="hidden" {...register('personalInfo.location')} />
          <span className="block text-sm font-medium text-text">
            Location
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="personal-country" className="block text-xs font-medium text-text-muted mb-1">
                Country
              </label>
              <select
                id="personal-country"
                aria-label="Country"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full rounded-[6px] border border-border bg-white px-3 py-2 text-sm text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer"
              >
                <option value="">Select country...</option>
                {INTERNATIONAL_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="personal-city" className="block text-xs font-medium text-text-muted mb-1">
                City / Municipality
              </label>
              <input
                id="personal-city"
                type="text"
                aria-label="City or Municipality"
                value={cityInput}
                onChange={handleCityChange}
                onBlur={handleCityBlur}
                placeholder={
                  selectedCountry
                    ? `e.g. City in ${selectedCountry}`
                    : 'e.g. Manila, San Francisco, CA'
                }
                className="w-full rounded-[6px] border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {locationValue && (
            <p className="text-xs text-text-muted pt-0.5">
              Saved format: <span className="font-semibold text-text">{locationValue}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="personal-linkedin" className="block text-sm font-medium text-text mb-1">
            LinkedIn
          </label>
          <input
            id="personal-linkedin"
            type="text"
            placeholder="linkedin.com/in/alexcarter"
            {...register('personalInfo.linkedin')}
            className="w-full rounded-[6px] border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <p className="mt-1 text-xs text-text-muted">
            Include your profile handle, e.g. linkedin.com/in/yourname
          </p>
        </div>

        <div>
          <label htmlFor="personal-portfolio" className="block text-sm font-medium text-text mb-1">
            Portfolio / GitHub Website
          </label>
          <input
            id="personal-portfolio"
            type="text"
            placeholder="alexcarter.dev or github.com/alexcarter"
            {...register('personalInfo.portfolio')}
            className="w-full rounded-[6px] border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <p className="mt-1 text-xs text-text-muted">
            Optional personal website, portfolio, or GitHub profile URL.
          </p>
        </div>
      </div>
      <PhotoUpload />
      <details className="border-t border-border pt-4">
        <summary className="cursor-pointer min-h-11 text-sm font-semibold text-text">Document format &amp; OJT settings</summary>
      {/* Document Type & OJT Mode quick settings */}
      <div className="space-y-3.5 p-3.5 bg-page rounded-[10px] border border-border">
        <div>
          <span
            id="personal-doc-format-label"
            className="block text-xs font-semibold text-text mb-1.5"
          >
            Document format
          </span>
          <DocumentFormat />
          <p className="mt-2 text-xs text-text-muted">Resume: aim for one page. CV: include a fuller academic history.</p>
        </div>

        {/* OJT / Practicum Mode Toggle */}
        <div className="pt-3 border-t border-border">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('isOjtMode')}
              className="mt-0.5 h-4 w-4 rounded border-border accent-accent text-accent focus:ring-2 focus:ring-accent cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-text">
                OJT / Practicum Application Mode
              </span>
              <p className="text-text-muted mt-0.5 leading-relaxed">
                Adds required OJT hours &amp; start date, renames Summary to Career Objective, and formats your PDF filename as{' '}
                <code className="text-xs bg-white px-1.5 py-0.5 rounded-[4px] border border-border text-text">
                  Lastname_Firstname_Course_OJT_Resume.pdf
                </code>
              </p>
            </div>
          </label>

          {isOjtMode && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-[8px] border border-border">
              <div>
                <label
                  htmlFor="ojt-course-code"
                  className="block text-xs font-medium text-text mb-1"
                >
                  Course Code
                </label>
                <input
                  id="ojt-course-code"
                  type="text"
                  placeholder="e.g. BSIT, BSBA, BSHM"
                  {...register('ojtInfo.courseCode')}
                  className="w-full rounded-[6px] border border-border bg-white px-2.5 py-1.5 text-xs text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label
                  htmlFor="ojt-required-hours"
                  className="block text-xs font-medium text-text mb-1"
                >
                  Required OJT Hours
                </label>
                <input
                  id="ojt-required-hours"
                  type="text"
                  placeholder="e.g. 486 hours"
                  {...register('ojtInfo.requiredHours')}
                  className="w-full rounded-[6px] border border-border bg-white px-2.5 py-1.5 text-xs text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label
                  htmlFor="ojt-start-date"
                  className="block text-xs font-medium text-text mb-1"
                >
                  Preferred Start Date
                </label>
                <input
                  id="ojt-start-date"
                  type="text"
                  placeholder="e.g. January 15, 2026"
                  {...register('ojtInfo.preferredStartDate')}
                  className="w-full rounded-[6px] border border-border bg-white px-2.5 py-1.5 text-xs text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="sm:col-span-3 text-xs text-text-muted flex items-center justify-between pt-2 border-t border-border">
                <span>
                  PDF filename preview: <strong className="text-text">{buildFileName(formValues)}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      </details>
    </div>
  )
}
