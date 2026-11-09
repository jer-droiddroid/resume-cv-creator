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
  const documentType = formValues?.documentType || 'resume'
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
        <h2 className="text-lg font-semibold text-[#1A2233]">Personal Information</h2>
        <p className="text-sm text-[#5B6678]">
          How employers or academic committees can reach you.
        </p>
      </div>

      {/* Document Type & OJT Mode quick settings */}
      <div className="space-y-3.5 p-3.5 bg-[#F6F8FA] rounded-[10px] border border-[#E3E8EE]">
        <div>
          <span
            id="personal-doc-format-label"
            className="block text-xs font-semibold text-[#1A2233] mb-1.5"
          >
            Document format
          </span>
          <div
            role="radiogroup"
            aria-labelledby="personal-doc-format-label"
            className="inline-flex w-full rounded-[6px] bg-white border border-[#E3E8EE] p-0.5 text-xs shadow-2xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={documentType === 'resume'}
              onClick={() => setValue('documentType', 'resume', { shouldDirty: true })}
              className={`flex-1 rounded-[5px] py-1.5 text-center text-xs font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] ${
                documentType === 'resume'
                  ? 'bg-[#1F4D8F] text-white font-semibold shadow-2xs'
                  : 'text-[#5B6678] hover:text-[#1A2233] hover:bg-[#F6F8FA]'
              }`}
            >
              Resume (1 page)
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={documentType === 'cv'}
              onClick={() => setValue('documentType', 'cv', { shouldDirty: true })}
              className={`flex-1 rounded-[5px] py-1.5 text-center text-xs font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] ${
                documentType === 'cv'
                  ? 'bg-[#1F4D8F] text-white font-semibold shadow-2xs'
                  : 'text-[#5B6678] hover:text-[#1A2233] hover:bg-[#F6F8FA]'
              }`}
            >
              CV (Multi-page)
            </button>
          </div>
        </div>

        {/* OJT / Practicum Mode Toggle */}
        <div className="pt-3 border-t border-[#E3E8EE]">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              {...register('isOjtMode')}
              className="mt-0.5 h-4 w-4 rounded border-[#E3E8EE] accent-[#1F4D8F] text-[#1F4D8F] focus:ring-2 focus:ring-[#1F4D8F] cursor-pointer"
            />
            <div className="text-xs">
              <span className="font-semibold text-[#1A2233]">
                OJT / Practicum Application Mode
              </span>
              <p className="text-[#5B6678] mt-0.5 leading-relaxed">
                Adds required OJT hours &amp; start date, renames Summary to Career Objective, and formats your PDF filename as{' '}
                <code className="text-xs bg-white px-1.5 py-0.5 rounded-[4px] border border-[#E3E8EE] text-[#1A2233]">
                  Lastname_Firstname_Course_OJT_Resume.pdf
                </code>
              </p>
            </div>
          </label>

          {isOjtMode && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-[8px] border border-[#E3E8EE]">
              <div>
                <label
                  htmlFor="ojt-course-code"
                  className="block text-xs font-medium text-[#1A2233] mb-1"
                >
                  Course Code
                </label>
                <input
                  id="ojt-course-code"
                  type="text"
                  placeholder="e.g. BSIT, BSBA, BSHM"
                  {...register('ojtInfo.courseCode')}
                  className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1.5 text-xs text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
                />
              </div>
              <div>
                <label
                  htmlFor="ojt-required-hours"
                  className="block text-xs font-medium text-[#1A2233] mb-1"
                >
                  Required OJT Hours
                </label>
                <input
                  id="ojt-required-hours"
                  type="text"
                  placeholder="e.g. 486 hours"
                  {...register('ojtInfo.requiredHours')}
                  className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1.5 text-xs text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
                />
              </div>
              <div>
                <label
                  htmlFor="ojt-start-date"
                  className="block text-xs font-medium text-[#1A2233] mb-1"
                >
                  Preferred Start Date
                </label>
                <input
                  id="ojt-start-date"
                  type="text"
                  placeholder="e.g. January 15, 2026"
                  {...register('ojtInfo.preferredStartDate')}
                  className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1.5 text-xs text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
                />
              </div>
              <div className="sm:col-span-3 text-xs text-[#5B6678] flex items-center justify-between pt-2 border-t border-[#E3E8EE]">
                <span>
                  PDF filename preview: <strong className="text-[#1A2233]">{buildFileName(formValues)}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="personal-full-name" className="block text-sm font-medium text-[#1A2233] mb-1">
            Full Name
          </label>
          <input
            id="personal-full-name"
            type="text"
            placeholder="e.g. Alex Carter"
            {...register('personalInfo.fullName')}
            className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-2 text-sm text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
          />
        </div>

        <div>
          <label htmlFor="personal-email" className="block text-sm font-medium text-[#1A2233] mb-1">
            Email
          </label>
          <input
            id="personal-email"
            type="email"
            aria-invalid={isEmailInvalid}
            placeholder="alex.carter@university.edu"
            {...register('personalInfo.email')}
            className={`w-full rounded-[6px] border bg-white px-3 py-2 text-sm text-[#1A2233] placeholder:text-[#5B6678]/60 focus:outline-none focus:ring-2 ${
              isEmailInvalid
                ? 'border-[#C0392B] focus:border-[#C0392B] focus:ring-[#C0392B]/20'
                : 'border-[#E3E8EE] focus:border-[#1F4D8F] focus:ring-[#1F4D8F]/20'
            }`}
          />
          {isEmailInvalid && (
            <p className="mt-1 text-xs text-[#C0392B]">
              Enter a valid email address like name@university.edu.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="personal-phone" className="block text-sm font-medium text-[#1A2233] mb-1">
            Phone
          </label>
          <input
            id="personal-phone"
            type="text"
            placeholder="(555) 234-5678"
            {...register('personalInfo.phone')}
            className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-2 text-sm text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
          />
        </div>

        {/* Location: International Country Dropdown & City Input */}
        <div className="sm:col-span-2 space-y-1.5">
          <input type="hidden" {...register('personalInfo.location')} />
          <span className="block text-sm font-medium text-[#1A2233]">
            Location
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="personal-country" className="block text-xs font-medium text-[#5B6678] mb-1">
                Country
              </label>
              <select
                id="personal-country"
                aria-label="Country"
                value={selectedCountry}
                onChange={handleCountryChange}
                className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-2 text-sm text-[#1A2233] focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20 cursor-pointer"
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
              <label htmlFor="personal-city" className="block text-xs font-medium text-[#5B6678] mb-1">
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
                className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-2 text-sm text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
              />
            </div>
          </div>

          {locationValue && (
            <p className="text-xs text-[#5B6678] pt-0.5">
              Saved format: <span className="font-semibold text-[#1A2233]">{locationValue}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="personal-linkedin" className="block text-sm font-medium text-[#1A2233] mb-1">
            LinkedIn
          </label>
          <input
            id="personal-linkedin"
            type="text"
            placeholder="linkedin.com/in/alexcarter"
            {...register('personalInfo.linkedin')}
            className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-2 text-sm text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
          />
          <p className="mt-1 text-xs text-[#5B6678]">
            Include your profile handle, e.g. linkedin.com/in/yourname
          </p>
        </div>

        <div>
          <label htmlFor="personal-portfolio" className="block text-sm font-medium text-[#1A2233] mb-1">
            Portfolio / GitHub Website
          </label>
          <input
            id="personal-portfolio"
            type="text"
            placeholder="alexcarter.dev or github.com/alexcarter"
            {...register('personalInfo.portfolio')}
            className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-2 text-sm text-[#1A2233] placeholder:text-[#5B6678]/60 focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20"
          />
          <p className="mt-1 text-xs text-[#5B6678]">
            Optional personal website, portfolio, or GitHub profile URL.
          </p>
        </div>
      </div>
    </div>
  )
}
