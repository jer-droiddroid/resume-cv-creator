import { useEffect, useRef } from 'react'

export default function ClearConfirmModal({ isOpen, onClose, onConfirm, isClearing }) {
  const modalRef = useRef(null)
  const cancelBtnRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      cancelBtnRef.current?.focus()

      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && !isClearing) {
          onClose()
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isClearing, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-dialog-title"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={!isClearing ? onClose : undefined}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 shadow-xl space-y-4"
        >
          <div>
            <h2 id="clear-dialog-title" className="text-base font-bold text-slate-900">
              Clear everything?
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              This will remove all your entered details and reset to a fresh blank resume. You will have 3 seconds to undo.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              ref={cancelBtnRef}
              type="button"
              disabled={isClearing}
              onClick={onClose}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isClearing}
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
            >
              Clear everything
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
