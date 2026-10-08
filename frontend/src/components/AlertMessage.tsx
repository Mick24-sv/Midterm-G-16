import './AlertMessage.css'

type AlertType = 'success' | 'error' | 'warning' | 'info'

interface AlertMessageProps {
  type: AlertType
  message: string
  onDismiss?: () => void
}

const icons: Record<AlertType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
}

export default function AlertMessage({ type, message, onDismiss }: AlertMessageProps) {
  return (
    <div className={`alert alert--${type}`} role="alert">
      <span className="alert__icon" aria-hidden="true">{icons[type]}</span>
      <span className="alert__text">{message}</span>
      {onDismiss && (
        <button
          className="alert__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  )
}

