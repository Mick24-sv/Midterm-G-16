import { useEffect, useRef } from 'react';
import type { Pet } from '../types/pet';
import { formatAge } from '../data/pets';
import './PetDetailModal.css';

interface PetDetailModalProps {
  pet: Pet;
  onClose: () => void;
  onAdopt: (pet: Pet) => void;
}

const SPECIES_EMOJI: Record<string, string> = {
  dog: '🐕',
  cat: '🐈',
  rabbit: '🐇',
  bird: '🦜',
  other: '🐾',
};

const STATUS_LABEL: Record<string, string> = {
  available: 'Available',
  pending: 'Pending',
  adopted: 'Adopted',
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="pdm__detail-row">
      <span className="pdm__detail-icon" aria-hidden="true">{icon}</span>
      <span className="pdm__detail-label">{label}</span>
      <span className="pdm__detail-value">{value}</span>
    </div>
  );
}

export default function PetDetailModal({ pet, onClose, onAdopt }: PetDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  /* Open the native <dialog> and focus it */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  /* Close on backdrop click */
  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { clientX, clientY } = e;
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      onClose();
    }
  }

  /* Close on Escape (native dialog already does this, but we call onClose too) */
  function handleCancel(e: React.SyntheticEvent) {
    e.preventDefault();
    onClose();
  }

  const ageLabel = formatAge(pet.age);
  const genderLabel = pet.gender === 'male' ? '♂ Male' : '♀ Female';
  const sizeLabel = pet.size.charAt(0).toUpperCase() + pet.size.slice(1);
  const speciesLabel = pet.species.charAt(0).toUpperCase() + pet.species.slice(1);

  return (
    <dialog
      ref={dialogRef}
      className="pdm"
      aria-modal="true"
      aria-label={`Details for ${pet.name}`}
      onClick={handleBackdropClick}
      onCancel={handleCancel}
    >
      <article className="pdm__card">
        {/* ── Close button ──────────────────────── */}
        <button
          type="button"
          className="pdm__close"
          onClick={onClose}
          aria-label="Close details"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>

        {/* ── Two-column layout ─────────────────── */}
        <div className="pdm__layout">

          {/* Left — image + status */}
          <div className="pdm__image-col">
            <div className="pdm__image-wrap">
              <img
                src={pet.imageUrl}
                alt={`Photo of ${pet.name}`}
                className="pdm__image"
              />
              <span className={`pdm__status-badge pdm__status-badge--${pet.status}`}>
                {STATUS_LABEL[pet.status]}
              </span>
            </div>

            {/* Tags under image */}
            <div className="pdm__tags">
              {pet.tags.map((tag) => (
                <span key={tag} className="pdm__tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Right — details */}
          <div className="pdm__info-col">
            {/* Name + emoji */}
            <header className="pdm__header">
              <h2 className="pdm__name">
                {SPECIES_EMOJI[pet.species]} {pet.name}
              </h2>
              <span className="pdm__gender-badge">
                {pet.gender === 'male' ? '♂' : '♀'}
              </span>
            </header>

            <p className="pdm__breed">{pet.breed}</p>

            {/* Detail grid */}
            <div className="pdm__details">
              <DetailRow
                icon="🐾"
                label="Species"
                value={speciesLabel}
              />
              <DetailRow
                icon="📏"
                label="Size"
                value={sizeLabel}
              />
              <DetailRow
                icon="⏱"
                label="Age"
                value={ageLabel}
              />
              <DetailRow
                icon={pet.gender === 'male' ? '♂' : '♀'}
                label="Gender"
                value={genderLabel}
              />
              <DetailRow
                icon="📍"
                label="Location"
                value={pet.location}
              />
              <DetailRow
                icon="✅"
                label="Status"
                value={STATUS_LABEL[pet.status]}
              />
            </div>

            {/* Full description */}
            <div className="pdm__section">
              <h3 className="pdm__section-title">About {pet.name}</h3>
              <p className="pdm__description">{pet.description}</p>
            </div>

            {/* CTA */}
            <div className="pdm__actions">
              <button
                type="button"
                className="pdm__adopt-btn"
                disabled={pet.status !== 'available'}
                onClick={() => onAdopt(pet)}
                aria-label={`Adopt ${pet.name}`}
              >
                {pet.status === 'available'
                  ? `Adopt ${pet.name}`
                  : pet.status === 'pending'
                  ? 'Adoption Pending'
                  : 'Already Adopted'}
              </button>
              <button
                type="button"
                className="pdm__close-btn"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </article>
    </dialog>
  );
}

