import type { Pet } from '../types/pet';
import PetCard from './PetCard';
import './PetList.css';

interface PetListProps {
  pets: Pet[];
  onSelect: (pet: Pet) => void;
}

export default function PetList({ pets, onSelect }: PetListProps) {
  if (pets.length === 0) {
    return (
      <div className="pet-list__empty">
        <span className="pet-list__empty-icon" role="img" aria-label="paw print">🐾</span>
        <h3>No pets found</h3>
        <p>Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <ul className="pet-list" role="list" aria-label="Available pets">
      {pets.map((pet) => (
        <li key={pet.id} className="pet-list__item">
          <PetCard pet={pet} onSelect={onSelect} />
        </li>
      ))}
    </ul>
  );
}

