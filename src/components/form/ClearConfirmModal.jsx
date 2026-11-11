import { useRef } from 'react'
import Modal from '../Modal'

export default function ClearConfirmModal({ isOpen, onClose, onConfirm, isClearing }) {
  const cancelBtnRef = useRef(null)

  if (!isOpen) return null

  return (
    <Modal labelledBy="clear-dialog-title" onClose={isClearing ? undefined : onClose} initialFocusRef={cancelBtnRef}>
      {/* Backdrop */}
      <div
        onClick={!isClearing ? onClose : undefined}
        className="fixed inset-0 bg-text/40 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-sm rounded-[10px] border border-border bg-white p-6 shadow-xl space-y-4"
        >
          <div>
            <h2 id="clear-dialog-title" className="text-base font-bold text-text">
              Clear all your details?
            </h2>
            <p className="text-xs text-text-muted mt-1">
              You can undo this while you stay in the builder.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              ref={cancelBtnRef}
              type="button"
              disabled={isClearing}
              onClick={onClose}
              className="rounded-[6px] border border-border bg-white px-3 py-1.5 text-xs font-medium text-text hover:bg-page focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isClearing}
              onClick={onConfirm}
              className="rounded-[6px] bg-error px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#A93226] focus:outline-none focus:ring-2 focus:ring-error disabled:opacity-50 cursor-pointer transition-colors"
            >
              Clear everything
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
