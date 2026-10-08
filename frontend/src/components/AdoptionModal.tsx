import { useState, useRef, useEffect } from 'react';
import type { Pet } from '../types/pet';
import { formatAge } from '../data/pets';
import './AdoptionModal.css';

interface AdoptionModalProps {
  pet: Pet;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

const EMPTY_FORM: FormData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  message: '',
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }
  if (!data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[0-9+\-\s()]{7,20}$/.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!data.address.trim()) {
    errors.address = 'Home address is required.';
  }
  return errors;
}

export default function AdoptionModal({ pet, onClose }: AdoptionModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Open native dialog */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);

  /* Close on backdrop click */
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { clientX, clientY } = e;
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      onClose();
    }
  }

  function handleCancel(e: React.SyntheticEvent) {
    e.preventDefault();
    onClose();
  }

  /* Field helpers */
  function setField(field: keyof FormData, value: string) {
    const next = { ...formData, [field]: value };
    setFormData(next);
    if (touched[field]) {
      setErrors(validate(next));
    }
  }

  function blur(field: keyof FormData) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(formData));
  }

  /* Submit */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched: Partial<Record<keyof FormData, boolean>> = {
      fullName: true, email: true, phone: true, address: true,
    };
    setTouched(allTouched);
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    /* Simulate async submission */
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

  const hasErrors = Object.keys(errors).length > 0;

  /* ── Success screen ───────────────────────────────────────────── */
  if (submitted) {
    return (
      <dialog
        ref={dialogRef}
        className="am"
        aria-modal="true"
        aria-label="Adoption request submitted"
        onClick={handleBackdropClick}
        onCancel={handleCancel}
      >
        <div className="am__card am__card--success">
          <div className="am__success-icon" aria-hidden="true">🎉</div>
          <h2 className="am__success-title">Request Submitted!</h2>
          <p className="am__success-msg">
            Thank you, <strong>{formData.fullName}</strong>! Your adoption request for{' '}
            <strong>{pet.name}</strong> has been received. We'll reach out to{' '}
            <strong>{formData.email}</strong> within 1–2 business days.
          </p>
          <div className="am__success-pet">
            <img src={pet.imageUrl} alt={pet.name} className="am__success-thumb" />
            <div>
              <p className="am__success-pet-name">{pet.name}</p>
              <p className="am__success-pet-breed">{pet.breed} · {formatAge(pet.age)}</p>
            </div>
          </div>
          <button type="button" className="am__submit-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </dialog>
    );
  }

  /* ── Form screen ──────────────────────────────────────────────── */
  return (
    <dialog
      ref={dialogRef}
      className="am"
      aria-modal="true"
      aria-label={`Adopt ${pet.name}`}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
    >
      <div className="am__card">
        {/* Header */}
        <div className="am__header">
          <div className="am__header-info">
            <img src={pet.imageUrl} alt={pet.name} className="am__thumb" />
            <div>
              <h2 className="am__title">Adopt {pet.name}</h2>
              <p className="am__subtitle">{pet.breed} · {formatAge(pet.age)} · {pet.location}</p>
            </div>
          </div>
          <button
            type="button"
            className="am__close"
            onClick={onClose}
            aria-label="Close adoption form"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form className="am__form" onSubmit={handleSubmit} noValidate>
          {/* Full name */}
          <div className={`am__field${errors.fullName && touched.fullName ? ' am__field--error' : ''}`}>
            <label className="am__label" htmlFor="am-name">
              Full Name <span className="am__required" aria-hidden="true">*</span>
            </label>
            <input
              id="am-name"
              type="text"
              className="am__input"
              placeholder="e.g. Maria Santos"
              value={formData.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              onBlur={() => blur('fullName')}
              autoComplete="name"
            />
            {errors.fullName && touched.fullName && (
              <span className="am__error" role="alert">{errors.fullName}</span>
            )}
          </div>

          {/* Email */}
          <div className={`am__field${errors.email && touched.email ? ' am__field--error' : ''}`}>
            <label className="am__label" htmlFor="am-email">
              Email Address <span className="am__required" aria-hidden="true">*</span>
            </label>
            <input
              id="am-email"
              type="email"
              className="am__input"
              placeholder="e.g. maria@email.com"
              value={formData.email}
              onChange={(e) => setField('email', e.target.value)}
              onBlur={() => blur('email')}
              autoComplete="email"
            />
            {errors.email && touched.email && (
              <span className="am__error" role="alert">{errors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className={`am__field${errors.phone && touched.phone ? ' am__field--error' : ''}`}>
            <label className="am__label" htmlFor="am-phone">
              Phone Number <span className="am__required" aria-hidden="true">*</span>
            </label>
            <input
              id="am-phone"
              type="tel"
              className="am__input"
              placeholder="e.g. +63 912 345 6789"
              value={formData.phone}
              onChange={(e) => setField('phone', e.target.value)}
              onBlur={() => blur('phone')}
              autoComplete="tel"
            />
            {errors.phone && touched.phone && (
              <span className="am__error" role="alert">{errors.phone}</span>
            )}
          </div>

          {/* Address */}
          <div className={`am__field${errors.address && touched.address ? ' am__field--error' : ''}`}>
            <label className="am__label" htmlFor="am-address">
              Home Address <span className="am__required" aria-hidden="true">*</span>
            </label>
            <input
              id="am-address"
              type="text"
              className="am__input"
              placeholder="e.g. 123 Sampaguita St., Quezon City"
              value={formData.address}
              onChange={(e) => setField('address', e.target.value)}
              onBlur={() => blur('address')}
              autoComplete="street-address"
            />
            {errors.address && touched.address && (
              <span className="am__error" role="alert">{errors.address}</span>
            )}
          </div>

          {/* Message (optional) */}
          <div className="am__field">
            <label className="am__label" htmlFor="am-message">
              Why do you want to adopt {pet.name}?{' '}
              <span className="am__optional">(optional)</span>
            </label>
            <textarea
              id="am-message"
              className="am__textarea"
              rows={3}
              placeholder="Tell us a bit about your home and lifestyle…"
              value={formData.message}
              onChange={(e) => setField('message', e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="am__actions">
            <button type="button" className="am__cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`am__submit-btn${loading ? ' am__submit-btn--loading' : ''}`}
              disabled={loading || (Object.keys(touched).length > 0 && hasErrors)}
            >
              {loading ? (
                <>
                  <span className="am__spinner" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                `Submit Application`
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

