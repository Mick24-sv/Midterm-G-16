import type { Pet } from '../types/pet';
import { formatAge } from '../data/pets';
import './PetCard.css';

interface PetCardProps {
  pet: Pet;
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

export default function PetCard({ pet }: PetCardProps) {
  return (
    <article className={`pet-card pet-card--${pet.status}`}>
      <div className="pet-card__image-wrap">
        <img
          src={pet.imageUrl}
          alt={`Photo of ${pet.name}`}
          className="pet-card__image"
          loading="lazy"
        />
        <span className={`pet-card__status pet-card__status--${pet.status}`}>
          {STATUS_LABEL[pet.status]}
        </span>
      </div>

      <div className="pet-card__body">
        <div className="pet-card__header">
          <h3 className="pet-card__name">
            {SPECIES_EMOJI[pet.species]} {pet.name}
          </h3>
          <span className="pet-card__gender">
            {pet.gender === 'male' ? '♂' : '♀'}
          </span>
        </div>

        <p className="pet-card__breed">{pet.breed}</p>

        <div className="pet-card__meta">
          <span className="pet-card__meta-item">
            <svg className="meta-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M10 2a6 6 0 100 12A6 6 0 0010 2zm0 1.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM10 5a.75.75 0 01.75.75v3.75l2.25 1.125a.75.75 0 01-.67 1.34l-2.58-1.29A.75.75 0 019.25 10V5.75A.75.75 0 0110 5z" />
            </svg>
            {formatAge(pet.age)}
          </span>
          <span className="pet-card__meta-item">
            <svg className="meta-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {pet.location}
          </span>
          <span className="pet-card__meta-item pet-card__size">
            {pet.size}
          </span>
        </div>

        <p className="pet-card__description">{pet.description}</p>

        <div className="pet-card__tags">
          {pet.tags.map((tag) => (
            <span key={tag} className="pet-card__tag">
              {tag}
            </span>
          ))}
        </div>

        <button
          type="button"
          className="pet-card__cta"
          disabled={pet.status !== 'available'}
          aria-label={`Adopt ${pet.name}`}
        >
          {pet.status === 'available' ? 'Adopt Me' : pet.status === 'pending' ? 'Pending' : 'Adopted'}
        </button>
      </div>
    </article>
  );
}

