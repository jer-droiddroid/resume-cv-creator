import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// All modal surfaces live outside the animated app and share one focus lifecycle.
export default function Modal({ children, labelledBy, onClose, initialFocusRef, className = '' }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose }, [onClose])

  useEffect(() => {
    const invoker = document.activeElement
    const root = document.getElementById('root')
    const wasInert = root?.inert
    const previousOverflow = document.body.style.overflow
    if (root) root.inert = true
    document.body.style.overflow = 'hidden'
    const dialog = dialogRef.current
    const focusable = () => [...dialog.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')]
      .filter((element) => element.getClientRects().length > 0)
    ;(initialFocusRef?.current || focusable()[0] || dialog).focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current?.()
      }
      if (event.key === 'Tab') {
        const items = focusable()
        const first = items[0]
        const last = items.at(-1)
        if (!first) { event.preventDefault(); dialog.focus(); return }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
          event.preventDefault(); last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus()
        }
      }
    }
    dialog.addEventListener('keydown', handleKeyDown)
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown)
      if (root) root.inert = wasInert
      document.body.style.overflow = previousOverflow
      if (invoker?.isConnected) invoker.focus({ preventScroll: true })
    }
  }, [initialFocusRef])

  return createPortal(
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={labelledBy}
      tabIndex={-1} className={`fixed inset-0 z-50 overflow-y-auto ${className}`}>
      {children}
    </div>, document.body,
  )
}
