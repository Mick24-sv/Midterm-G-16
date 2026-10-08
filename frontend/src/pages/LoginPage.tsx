import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import './LoginPage.css'

interface LoginForm {
  email: string
  password: string
}

interface FormStatus {
  type: 'idle' | 'loading' | 'error'
  message: string
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })
  const [status, setStatus] = useState<FormStatus>({ type: 'idle', message: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: '' })

    // Offline guard
    if (!navigator.onLine) {
      setStatus({ type: 'error', message: 'You are offline. Please check your connection.' })
      return
    }

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Invalid credentials.' }))
        throw new Error(err.message ?? 'Login failed.')
      }

      // Handle successful login (e.g. save token, redirect)
      const data = await response.json()
      console.log('Logged in:', data)
      // TODO: save token and redirect to dashboard
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setStatus({ type: 'error', message })
    }
  }

  return (
    <div className="lp-wrapper">
      <div className="lp-card">
        {/* Header */}
        <div className="lp-header">
          <span className="lp-paw" aria-hidden="true">🐾</span>
          <h1 className="lp-title">Welcome Back</h1>
          <p className="lp-subtitle">Sign in to your account to continue.</p>
        </div>

        {/* Form */}
        <form className="lp-form" onSubmit={handleSubmit} noValidate>
          <div className="lp-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="juan@email.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="lp-field">
            <div className="lp-label-row">
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="lp-forgot"
                tabIndex={-1}
              >
                Forgot password?
              </button>
            </div>
            <div className="lp-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="lp-eye"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {status.type === 'error' && (
            <AlertMessage
              type="error"
              message={status.message}
              onDismiss={() => setStatus({ type: 'idle', message: '' })}
            />
          )}

          <button
            type="submit"
            className="lp-submit"
            disabled={status.type === 'loading'}
          >
            {status.type === 'loading' ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="lp-footer">
          Don't have an account?{' '}
          <Link to="/register" className="lp-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

