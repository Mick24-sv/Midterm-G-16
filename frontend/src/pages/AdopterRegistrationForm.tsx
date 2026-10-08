import { useState, type FormEvent, type ChangeEvent } from 'react'
import './AdopterRegistrationForm.css'

interface AdopterFormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

const initialForm: AdopterFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
}

export default function AdopterRegistrationForm() {
  const [form, setForm] = useState<AdopterFormData>(initialForm)
  const [status, setStatus] = useState<FormStatus>({ type: 'idle', message: '' })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: '' })

    try {
      const response = await fetch('http://localhost:3000/adopters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'An error occurred.' }))
        throw new Error(err.message ?? 'Registration failed.')
      }

      setStatus({ type: 'success', message: 'Registration successful! Welcome aboard.' })
      setForm(initialForm)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setStatus({ type: 'error', message })
    }
  }

  return (
    <div className="af-wrapper">
      <div className="af-card">
        <div className="af-header">
          <span className="af-paw" aria-hidden="true">🐾</span>
          <h1 className="af-title">Adopter Registration</h1>
          <p className="af-subtitle">Fill in your details to begin your adoption journey.</p>
        </div>

        <form className="af-form" onSubmit={handleSubmit} noValidate>
          <div className="af-row">
            <div className="af-field">
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Juan"
                value={form.first_name}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
            </div>

            <div className="af-field">
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="dela Cruz"
                value={form.last_name}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="af-field">
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
            />
          </div>

          <div className="af-field">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+63 9XX XXX XXXX"
              value={form.phone}
              onChange={handleChange}
              required
              autoComplete="tel"
            />
          </div>

          <div className="af-field">
            <label htmlFor="address">Home Address</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Street, Barangay, City, Province"
              value={form.address}
              onChange={handleChange}
              required
              autoComplete="street-address"
            />
          </div>

          {status.type !== 'idle' && status.message && (
            <div className={`af-alert af-alert--${status.type}`} role="alert">
              {status.message}
            </div>
          )}

          <button
            type="submit"
            className="af-submit"
            disabled={status.type === 'loading'}
          >
            {status.type === 'loading' ? 'Submitting…' : 'Register as Adopter'}
          </button>
        </form>
      </div>
    </div>
  )
}

