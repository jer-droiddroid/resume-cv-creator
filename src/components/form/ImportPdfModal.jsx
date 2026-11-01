import { useState, useRef } from 'react'
import { parsePdfResume } from '../../utils/aiResumeParser'

export default function ImportPdfModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null)
  const [apiKey, setApiKey] = useState('')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef(null)

  if (!isOpen) return null

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

    try {
      setIsLoading(true)
      setErrorMsg('')
      const parsedData = await parsePdfResume(file, apiKey.trim())
      onImportSuccess(parsedData)
      onClose()
    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setShowKeyInput(true)
        setErrorMsg(
          'A free Gemini API key is needed. You can add GEMINI_API_KEY to your Vercel project settings, or paste your free key below.'
        )
      } else {
        setErrorMsg(err.message || 'Failed to parse resume.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={!isLoading ? onClose : undefined}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Import from PDF</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your existing PDF resume to automatically fill out your form fields.
              </p>
            </div>
            {!isLoading && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
            )}
          </div>

          {/* File Picker / Dropzone */}
          <div
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
              file
                ? 'border-emerald-400 bg-emerald-50/40'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50'
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
                <span className="text-xl">📄</span>
                <p className="text-xs font-semibold text-slate-800 truncate max-w-xs mx-auto">
                  {file.name}
                </p>
                <p className="text-[11px] text-emerald-700">Ready to import (click to change)</p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-xl">📥</span>
                <p className="text-xs font-medium text-slate-700">
                  Click to select your existing PDF resume
                </p>
                <p className="text-[11px] text-slate-400">PDF files only (max 10MB)</p>
              </div>
            )}
          </div>

          {/* Optional API Key Input if not yet set in Vercel environment */}
          {showKeyInput && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
              <label className="block text-xs font-medium text-slate-700">
                Gemini API Key (Free)
              </label>
              <input
                type="password"
                placeholder="Paste AI Studio API key here"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500">
                Get a 100% free key at{' '}
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  aistudio.google.com
                </a>{' '}
                (no credit card needed).
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
              {errorMsg}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!file || isLoading}
              onClick={handleStartParse}
              className="rounded-md bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
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
