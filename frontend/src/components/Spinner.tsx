import './Spinner.css'

interface SpinnerProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Spinner({ label = 'Loading…', size = 'md' }: SpinnerProps) {
  return (
    <div className={`spinner spinner--${size}`} role="status" aria-label={label}>
      <div className="spinner__ring" />
      <span className="spinner__label">{label}</span>
    </div>
  )
}

