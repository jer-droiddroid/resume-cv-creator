import { useEffect, useState } from 'react'

/**
 * Delays updating a value until the user stops typing for `delay` ms.
 * Prevents the PDF renderer from re-running on every single keystroke.
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

