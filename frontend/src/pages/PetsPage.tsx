import { useState, useMemo } from 'react';
import { MOCK_PETS } from '../data/pets';
import type { PetFilters } from '../types/pet';
import PetFiltersBar from '../components/PetFilters';
import PetList from '../components/PetList';
import './PetsPage.css';

const DEFAULT_FILTERS: PetFilters = {
  species: 'all',
  gender: 'all',
  size: 'all',
  status: 'all',
  search: '',
};

export default function PetsPage() {
  const [filters, setFilters] = useState<PetFilters>(DEFAULT_FILTERS);

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return MOCK_PETS.filter((pet) => {
      if (filters.species !== 'all' && pet.species !== filters.species) return false;
      if (filters.gender !== 'all' && pet.gender !== filters.gender) return false;
      if (filters.size !== 'all' && pet.size !== filters.size) return false;
      if (filters.status !== 'all' && pet.status !== filters.status) return false;
      if (q && !pet.name.toLowerCase().includes(q) && !pet.breed.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="pets-page">
      {/* Hero header */}
      <header className="pets-page__hero">
        <h1 className="pets-page__title">
          Find Your Perfect <span className="pets-page__accent">Companion</span>
        </h1>
        <p className="pets-page__subtitle">
          Browse our adorable pets waiting for a loving home. Every pet deserves a second chance. 🐾
        </p>
      </header>

      {/* Filters */}
      <section className="pets-page__filters" aria-label="Filter pets">
        <PetFiltersBar
          filters={filters}
          totalCount={MOCK_PETS.length}
          filteredCount={filtered.length}
          onChange={setFilters}
        />
      </section>

      {/* Listing */}
      <main className="pets-page__listing" aria-label="Pet listing">
        <PetList pets={filtered} />
      </main>
    </div>
  );
}

