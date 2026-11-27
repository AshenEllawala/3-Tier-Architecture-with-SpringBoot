import { useEffect, useRef } from 'react'

function Popup({ type, message, onClose }) {
  const closeBtnRef = useRef(null)

  // move focus to the close button when the popup opens
  useEffect(() => {
    closeBtnRef.current?.focus()
  }, [])

  // close with the Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div
        className={`popup-box ${type}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // clicks inside the box must not close it
      >
        <p>{message}</p>
        <button ref={closeBtnRef} className="popup-close" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  )
}

export default Popup