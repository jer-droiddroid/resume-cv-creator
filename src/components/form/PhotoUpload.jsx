import { useEffect, useRef, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { prepareResumePhoto } from '../../utils/resumePhoto'

export default function PhotoUpload() {
  const { control, setValue } = useFormContext()
  const photo = useWatch({ control, name: 'personalInfo.photo' })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const requestRef = useRef(0)

  useEffect(() => () => { requestRef.current += 1 }, [])

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const request = ++requestRef.current
    setIsProcessing(true)
    setError('')
    try {
      const nextPhoto = await prepareResumePhoto(file)
      if (request === requestRef.current) {
        setValue('personalInfo.photo', nextPhoto, { shouldDirty: true })
      }
    } catch (err) {
      if (request === requestRef.current) setError(err.message)
    } finally {
      if (request === requestRef.current) setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-2 border-t border-border pt-4">
      <label htmlFor="personal-photo" className="block text-sm font-medium text-text">
        2×2 photo <span className="font-normal text-text-muted">(optional)</span>
      </label>
      <p id="personal-photo-help" className="text-xs leading-relaxed text-text-muted">
        JPG, PNG, or WebP, up to 10 MB. Your image is center-cropped to a square and printed at 2×2 inches in your PDF. Keep your face near the center.
      </p>
      {photo && <img src={photo} alt="Your resume photo" className="h-24 w-24 object-cover" />}
      <input
        id="personal-photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={isProcessing}
        onChange={handleUpload}
        aria-describedby={`personal-photo-help${error ? ' personal-photo-error' : ''}`}
        aria-invalid={Boolean(error)}
        className="block min-h-11 w-full min-w-0 rounded-[6px] text-sm text-text file:mr-3 file:cursor-pointer file:rounded-[6px] file:border file:border-border file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-page focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
      />
      {isProcessing && <p role="status" className="text-xs text-text-muted">Preparing your photo…</p>}
      {error && <p id="personal-photo-error" role="alert" className="text-xs text-error">{error}</p>}
      {photo && (
        <button type="button" disabled={isProcessing} onClick={() => {
          setValue('personalInfo.photo', '', { shouldDirty: true })
          setError('')
        }} className="min-h-11 rounded-[6px] border border-border px-3 py-2 text-sm font-medium text-text hover:bg-page focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50 cursor-pointer">
          Remove photo
        </button>
      )}
    </div>
  )
}
