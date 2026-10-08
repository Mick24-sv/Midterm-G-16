import { useState, useMemo, useEffect, useCallback } from 'react';
import { MOCK_PETS } from '../data/pets';
import type { Pet, PetFilters } from '../types/pet';
import { getPets } from '../api/petApi';
import PetFiltersBar from '../components/PetFilters';
import PetList from '../components/PetList';
import PetDetailModal from '../components/PetDetailModal';
import AdoptionModal from '../components/AdoptionModal';
import './PetsPage.css';

const DEFAULT_FILTERS: PetFilters = {
  species: 'all',
  gender: 'all',
  size: 'all',
  status: 'all',
  search: '',
};

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PetFilters>(DEFAULT_FILTERS);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [adoptingPet, setAdoptingPet] = useState<Pet | null>(null);

  // Fetch pets from API (GET /api/pets), fallback to MOCK_PETS if API is unavailable
  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await getPets();
      if (Array.isArray(data) && data.length > 0) {
        setPets(data);
      } else {
        // If DB has 0 records, fall back to mock data so UI remains interactive
        setPets(MOCK_PETS);
      }
    } catch (err: unknown) {
      console.warn('Backend API connection warning, using local dataset:', err);
      // Fallback seamlessly to mock data
      setPets(MOCK_PETS);
      setApiError('Connected in offline/fallback mode (backend API unreachable).');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleStartAdopt = (pet: Pet) => {
    setSelectedPet(null);
    setAdoptingPet(pet);
  };

  const handleAdoptionSuccess = (adoptedPetId: number) => {
    // Optimistically update the pet status to 'pending'
    setPets((prev) =>
      prev.map((p) => (p.id === adoptedPetId ? { ...p, status: 'pending' as const } : p))
    );
  };

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return pets.filter((pet) => {
      if (filters.species !== 'all' && pet.species !== filters.species) return false;
      if (filters.gender !== 'all' && pet.gender !== filters.gender) return false;
      if (filters.size !== 'all' && pet.size !== filters.size) return false;
      if (filters.status !== 'all' && pet.status !== filters.status) return false;
      if (q && !pet.name.toLowerCase().includes(q) && !pet.breed.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [pets, filters]);

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

      {/* Notice if API fallback mode is active */}
      {apiError && (
        <aside className="pets-page__api-notice" role="status" aria-live="polite">
          <span>ℹ️</span> {apiError}
        </aside>
      )}

      {/* Filters */}
      <section className="pets-page__filters" aria-label="Filter pets">
        <PetFiltersBar
          filters={filters}
          allPets={pets}
          totalCount={pets.length}
          filteredCount={filtered.length}
          onChange={setFilters}
        />
      </section>

      {/* Listing */}
      <main className="pets-page__listing" aria-label="Pet listing">
        {isLoading ? (
          <div className="pets-page__loading" role="status">
            <span className="pets-page__spinner" aria-hidden="true" />
            <p>Loading pets...</p>
          </div>
        ) : (
          <PetList pets={filtered} onSelect={setSelectedPet} onAdopt={handleStartAdopt} />
        )}
      </main>

      {/* Detail modal — rendered when a pet is selected */}
      {selectedPet && (
        <PetDetailModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          onAdopt={handleStartAdopt}
        />
      )}

      {/* Adoption modal — rendered when user clicks Adopt */}
      {adoptingPet && (
        <AdoptionModal
          pet={adoptingPet}
          onClose={() => setAdoptingPet(null)}
          onSuccess={handleAdoptionSuccess}
        />
      )}
    </div>
  );
}
