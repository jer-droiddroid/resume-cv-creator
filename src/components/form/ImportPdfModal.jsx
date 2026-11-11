import { useState, useRef, useCallback } from 'react'
import Modal from '../Modal'

export default function ImportPdfModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef(null)
  const closeBtnRef = useRef(null)
  const abortControllerRef = useRef(null)

  const handleCancelOrClose = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
    onClose()
  }, [onClose])

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf')) {
        setFile(null)
        setErrorMsg('Please select a valid PDF file.')
        return
      }
      if (selected.size > 10 * 1024 * 1024) {
        setFile(null)
        setErrorMsg('Choose a PDF smaller than 10 MB.')
        return
      }
      setFile(selected)
      setErrorMsg('')
    }
  }

  const handleStartParse = async () => {
    if (!file) {
      setErrorMsg('Please select a PDF file first.')
      return
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setIsLoading(true)
      setErrorMsg('')
      const { parsePdfResume } = await import('../../utils/aiResumeParser')
      if (controller.signal.aborted) return
      const parsedData = await parsePdfResume(file, apiKey.trim(), controller.signal)
      if (controller.signal.aborted) return
      onImportSuccess(parsedData)
      onClose()
    } catch (err) {
      if (err.message === 'CANCELLED') {
        return
      }
      if (err.message === 'NO_API_KEY') {
        setShowKeyInput(true)
        setErrorMsg(
          'AI import needs a Gemini API key. Paste your own key below, or cancel and enter your details manually.'
        )
      } else {
        setErrorMsg(err.message || 'Failed to parse resume.')
      }
    } finally {
      abortControllerRef.current = null
      setIsLoading(false)
    }
  }

  return (
    <Modal labelledBy="import-pdf-dialog-title" onClose={handleCancelOrClose} initialFocusRef={closeBtnRef}>
      {/* Backdrop */}
      <div
        onClick={handleCancelOrClose}
        className="fixed inset-0 bg-text/40 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-[10px] border border-border bg-white p-6 shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 id="import-pdf-dialog-title" className="text-base font-bold text-text">
                Import from PDF
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Upload your existing PDF resume to automatically fill out your form fields.
              </p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleCancelOrClose}
              className="rounded-[6px] border border-border bg-white px-2.5 py-1 text-xs font-medium text-text-muted hover:bg-page hover:text-text focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >
              Close
            </button>
          </div>

          <p className="text-sm text-text-muted leading-relaxed">
            AI import sends the text extracted from your PDF to Google Gemini for processing.
            Your current draft is kept as a backup before imported details replace it.
            Prefer to keep everything on this device? Cancel and enter your details manually.
          </p>
          {/* File Picker / Dropzone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Select PDF resume file"
            onClick={() => !isLoading && fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (!isLoading && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            className={`border-2 border-dashed rounded-[10px] p-6 text-center transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent ${
              file
                ? 'border-accent bg-accent/5'
                : 'border-border hover:border-[#CBD5E1] bg-page'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-text truncate max-w-xs mx-auto">
                  {file.name}
                </p>
                <p className="text-xs font-medium text-accent">
                  Ready to import (click to change file)
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-medium text-text">
                  Click to select your existing PDF resume
                </p>
                <p className="text-xs text-text-muted">PDF files only (max 10MB)</p>
              </div>
            )}
          </div>

          {/* Optional API Key Input if not yet set in Vercel environment */}
          {showKeyInput && (
            <div className="rounded-[8px] border border-border bg-page p-3 space-y-2">
              <label htmlFor="import-gemini-api-key" className="block text-xs font-medium text-text">
                Gemini API Key (Free)
              </label>
              <input
                id="import-gemini-api-key"
                type="password"
                placeholder="Paste AI Studio API key here"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-[6px] border border-border bg-white px-3 py-1.5 text-xs text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              <p className="text-xs text-text-muted">
                Get a 100% free key at{' '}
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline"
                >
                  aistudio.google.com
                </a>{' '}
                (no credit card needed).
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <p
              role="alert"
              className="text-xs text-error bg-error/8 border border-error/25 rounded-[6px] p-2.5"
            >
              {errorMsg}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={handleCancelOrClose}
              className="rounded-[6px] border border-border bg-white px-3 py-1.5 text-xs font-medium text-text hover:bg-page cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!file || isLoading}
              onClick={handleStartParse}
              className="rounded-[6px] bg-accent px-4 py-1.5 text-xs font-semibold text-white hover:bg-accent-hover disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Extracting resume...</span>
                </>
              ) : (
                <span>Auto-fill Form</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

