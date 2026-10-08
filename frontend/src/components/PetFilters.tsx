import type { PetFilters, PetSpecies, PetGender, PetSize, PetStatus } from '../types/pet';
import './PetFilters.css';

interface PetFiltersProps {
  filters: PetFilters;
  totalCount: number;
  filteredCount: number;
  onChange: (filters: PetFilters) => void;
}

const SPECIES_OPTIONS: { value: PetSpecies | 'all'; label: string }[] = [
  { value: 'all', label: 'All Species' },
  { value: 'dog', label: '🐕 Dogs' },
  { value: 'cat', label: '🐈 Cats' },
  { value: 'rabbit', label: '🐇 Rabbits' },
  { value: 'bird', label: '🦜 Birds' },
  { value: 'other', label: '🐾 Other' },
];

const GENDER_OPTIONS: { value: PetGender | 'all'; label: string }[] = [
  { value: 'all', label: 'Any Gender' },
  { value: 'male', label: '♂ Male' },
  { value: 'female', label: '♀ Female' },
];

const SIZE_OPTIONS: { value: PetSize | 'all'; label: string }[] = [
  { value: 'all', label: 'Any Size' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const STATUS_OPTIONS: { value: PetStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'adopted', label: 'Adopted' },
];

export default function PetFiltersBar({ filters, totalCount, filteredCount, onChange }: PetFiltersProps) {
  const set = <K extends keyof PetFilters>(key: K, value: PetFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const reset = () =>
    onChange({ species: 'all', gender: 'all', size: 'all', status: 'all', search: '' });

  const isFiltered =
    filters.species !== 'all' ||
    filters.gender !== 'all' ||
    filters.size !== 'all' ||
    filters.status !== 'all' ||
    filters.search !== '';

  return (
    <div className="pet-filters">
      {/* Search */}
      <label className="pet-filters__search-wrap" htmlFor="pet-search">
        <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <input
          id="pet-search"
          type="search"
          className="pet-filters__search"
          placeholder="Search by name or breed…"
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
        />
      </label>

      {/* Dropdowns */}
      <div className="pet-filters__selects">
        <select
          className="pet-filters__select"
          value={filters.species}
          onChange={(e) => set('species', e.target.value as PetFilters['species'])}
          aria-label="Filter by species"
        >
          {SPECIES_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          className="pet-filters__select"
          value={filters.gender}
          onChange={(e) => set('gender', e.target.value as PetFilters['gender'])}
          aria-label="Filter by gender"
        >
          {GENDER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          className="pet-filters__select"
          value={filters.size}
          onChange={(e) => set('size', e.target.value as PetFilters['size'])}
          aria-label="Filter by size"
        >
          {SIZE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          className="pet-filters__select"
          value={filters.status}
          onChange={(e) => set('status', e.target.value as PetFilters['status'])}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {isFiltered && (
          <button type="button" className="pet-filters__reset" onClick={reset}>
            Clear filters
          </button>
        )}
      </div>

      {/* Count */}
      <p className="pet-filters__count">
        Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> pets
      </p>
    </div>
  );
}

