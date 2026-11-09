import { useFormContext, useWatch } from 'react-hook-form'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Normalizes 3-letter ("Aug") or full ("August") to formal full month
const MONTH_MAP = {
  jan: 'January',
  january: 'January',
  feb: 'February',
  february: 'February',
  mar: 'March',
  march: 'March',
  apr: 'April',
  april: 'April',
  may: 'May',
  jun: 'June',
  june: 'June',
  jul: 'July',
  july: 'July',
  aug: 'August',
  august: 'August',
  sep: 'September',
  sept: 'September',
  september: 'September',
  oct: 'October',
  october: 'October',
  nov: 'November',
  november: 'November',
  dec: 'December',
  december: 'December',
}

// Years from 6 years in future (for expected graduations) down to 1990
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 42 }, (_, i) => String(currentYear + 6 - i))

/**
 * Formal Dropdown picker for Month (e.g. "August") and Year ("2023").
 * Stored as clean, professional formal strings: "August 2023" or "Present".
 */
export default function MonthYearPicker({ name, allowPresent = false }) {
  const { control, setValue } = useFormContext()
  const rawValue = useWatch({ control, name }) || ''

  const isPresent = allowPresent && rawValue.trim().toLowerCase() === 'present'

  // Parse existing string value like "August 2023", "Aug 2023", or "2023"
  let parsedMonth = ''
  let parsedYear = ''

  if (!isPresent && rawValue) {
    const parts = rawValue.trim().split(/\s+/)
    if (parts.length === 2) {
      const normalized = MONTH_MAP[parts[0].toLowerCase()]
      if (normalized) {
        parsedMonth = normalized
        parsedYear = parts[1]
      }
    } else if (parts.length === 1) {
      const normalized = MONTH_MAP[parts[0].toLowerCase()]
      if (normalized) {
        parsedMonth = normalized
      } else if (YEARS.includes(parts[0])) {
        parsedYear = parts[0]
      }
    }
  }

  const handleMonthChange = (e) => {
    const newMonth = e.target.value
    if (!newMonth && !parsedYear) {
      setValue(name, '')
      return
    }
    setValue(name, newMonth ? (parsedYear ? `${newMonth} ${parsedYear}` : newMonth) : parsedYear)
  }

  const handleYearChange = (e) => {
    const newYear = e.target.value
    if (!newYear && !parsedMonth) {
      setValue(name, '')
      return
    }
    setValue(name, parsedMonth ? (newYear ? `${parsedMonth} ${newYear}` : parsedMonth) : newYear)
  }

  const handleTogglePresent = (e) => {
    if (e.target.checked) {
      setValue(name, 'Present')
    } else {
      setValue(name, '')
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-2 gap-1.5">
        {/* Month Dropdown */}
        <select
          aria-label="Month"
          value={isPresent ? '' : parsedMonth}
          disabled={isPresent}
          onChange={handleMonthChange}
          className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1.5 text-xs text-[#1A2233] focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20 disabled:bg-[#EEF2F6] disabled:text-[#5B6678] cursor-pointer"
        >
          <option value="">Month</option>
          {MONTHS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Year Dropdown */}
        <select
          aria-label="Year"
          value={isPresent ? '' : parsedYear}
          disabled={isPresent}
          onChange={handleYearChange}
          className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1.5 text-xs text-[#1A2233] focus:border-[#1F4D8F] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F]/20 disabled:bg-[#EEF2F6] disabled:text-[#5B6678] cursor-pointer"
        >
          <option value="">Year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* "Present / Current" option for End Date */}
      {allowPresent && (
        <label className="flex items-center gap-1.5 text-xs text-[#5B6678] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPresent}
            onChange={handleTogglePresent}
            className="h-3.5 w-3.5 rounded border-[#E3E8EE] accent-[#1F4D8F] text-[#1F4D8F] focus:ring-2 focus:ring-[#1F4D8F] cursor-pointer"
          />
          <span>Currently here (Present)</span>
        </label>
      )}
    </div>
  )
}
