import { useState, useRef } from 'react'
import { parsePdfResume } from '../../utils/aiResumeParser'

export default function ImportPdfModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef(null)
  const abortControllerRef = useRef(null)

  if (!isOpen) return null

  const handleCancelOrClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsLoading(false)
    onClose()
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (selected.type !== 'application/pdf' && !selected.name.endsWith('.pdf')) {
        setErrorMsg('Please select a valid PDF file.')
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
      const parsedData = await parsePdfResume(file, apiKey.trim(), controller.signal)
      onImportSuccess(parsedData)
      onClose()
    } catch (err) {
      if (err.message === 'CANCELLED') {
        return
      }
      if (err.message === 'NO_API_KEY') {
        setShowKeyInput(true)
        setErrorMsg(
          'A free Gemini API key is needed. You can add GEMINI_API_KEY to your Vercel project settings, or paste your free key below.'
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleCancelOrClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-[10px] border border-[#E3E8EE] bg-white p-6 shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1A2233]">Import from PDF</h2>
              <p className="text-xs text-[#5B6678] mt-0.5">
                Upload your existing PDF resume to automatically fill out your form fields.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancelOrClose}
              className="rounded-[6px] border border-[#E3E8EE] bg-white px-2.5 py-1 text-xs font-medium text-[#5B6678] hover:bg-[#F6F8FA] hover:text-[#1A2233] cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* File Picker / Dropzone */}
          <div
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[10px] p-6 text-center transition cursor-pointer ${
              file
                ? 'border-[#1F4D8F] bg-[#1F4D8F]/5'
                : 'border-[#E3E8EE] hover:border-[#CBD5E1] bg-[#F6F8FA]'
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
                <p className="text-xs font-semibold text-[#1A2233] truncate max-w-xs mx-auto">
                  {file.name}
                </p>
                <p className="text-[11px] font-medium text-[#1F4D8F]">
                  Ready to import (click to change file)
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#1A2233]">
                  Click to select your existing PDF resume
                </p>
                <p className="text-[11px] text-[#5B6678]">PDF files only (max 10MB)</p>
              </div>
            )}
          </div>

          {/* Optional API Key Input if not yet set in Vercel environment */}
          {showKeyInput && (
            <div className="rounded-[8px] border border-[#E3E8EE] bg-[#F6F8FA] p-3 space-y-2">
              <label className="block text-xs font-medium text-[#1A2233]">
                Gemini API Key (Free)
              </label>
              <input
                type="password"
                placeholder="Paste AI Studio API key here"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-xs text-[#1A2233] focus:border-[#1F4D8F] focus:outline-none"
              />
              <p className="text-[11px] text-[#5B6678]">
                Get a 100% free key at{' '}
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1F4D8F] underline"
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
              className="text-xs text-[#C0392B] bg-[#C0392B]/8 border border-[#C0392B]/25 rounded-[6px] p-2.5"
            >
              {errorMsg}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E3E8EE]">
            <button
              type="button"
              onClick={handleCancelOrClose}
              className="rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-xs font-medium text-[#1A2233] hover:bg-[#F6F8FA] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!file || isLoading}
              onClick={handleStartParse}
              className="rounded-[6px] bg-[#1F4D8F] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#173b6e] disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
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
    </div>
  )
}

