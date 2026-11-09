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
        className="fixed inset-0 bg-[#1A2233]/40 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-sm rounded-[10px] border border-[#E3E8EE] bg-white p-6 shadow-xl space-y-4"
        >
          <div>
            <h2 id="clear-dialog-title" className="text-base font-bold text-[#1A2233]">
              Clear all your details?
            </h2>
            <p className="text-xs text-[#5B6678] mt-1">
              You&apos;ll have a few seconds to undo.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E3E8EE]">
            <button
              ref={cancelBtnRef}
              type="button"
              disabled={isClearing}
              onClick={onClose}
              className="rounded-[6px] border border-[#E3E8EE] bg-white px-3 py-1.5 text-xs font-medium text-[#1A2233] hover:bg-[#F6F8FA] focus:outline-none focus:ring-2 focus:ring-[#1F4D8F] disabled:opacity-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isClearing}
              onClick={onConfirm}
              className="rounded-[6px] bg-[#C0392B] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#A93226] focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:opacity-50 cursor-pointer transition-colors"
            >
              Clear everything
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
