import type { PetFilters, PetSpecies, PetGender, PetSize, PetStatus } from '../types/pet';
import type { Pet } from '../types/pet';
import './PetFilters.css';

interface PetFiltersProps {
  filters: PetFilters;
  allPets: Pet[];          // needed to compute per-species counts
  totalCount: number;
  filteredCount: number;
  onChange: (filters: PetFilters) => void;
}

/* ── Species pill data ──────────────────────────────────────────── */
const SPECIES_PILLS: { value: PetSpecies | 'all'; emoji: string; label: string }[] = [
  { value: 'all',    emoji: '🐾', label: 'All'     },
  { value: 'dog',    emoji: '🐕', label: 'Dogs'    },
  { value: 'cat',    emoji: '🐈', label: 'Cats'    },
  { value: 'rabbit', emoji: '🐇', label: 'Rabbits' },
  { value: 'bird',   emoji: '🦜', label: 'Birds'   },
  { value: 'other',  emoji: '🐾', label: 'Other'   },
];

/* ── Other filter options ───────────────────────────────────────── */
const GENDER_OPTIONS: { value: PetGender | 'all'; label: string }[] = [
  { value: 'all',    label: 'Any Gender' },
  { value: 'male',   label: '♂ Male'    },
  { value: 'female', label: '♀ Female'  },
];

const SIZE_OPTIONS: { value: PetSize | 'all'; label: string }[] = [
  { value: 'all',    label: 'Any Size' },
  { value: 'small',  label: 'Small'   },
  { value: 'medium', label: 'Medium'  },
  { value: 'large',  label: 'Large'   },
];

const STATUS_OPTIONS: { value: PetStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All Status' },
  { value: 'available', label: 'Available'  },
  { value: 'pending',   label: 'Pending'    },
  { value: 'adopted',   label: 'Adopted'    },
];

export default function PetFiltersBar({
  filters,
  allPets,
  totalCount,
  filteredCount,
  onChange,
}: PetFiltersProps) {
  const set = <K extends keyof PetFilters>(key: K, value: PetFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const reset = () =>
    onChange({ species: 'all', gender: 'all', size: 'all', status: 'all', search: '' });

  const isFiltered =
    filters.species !== 'all' ||
    filters.gender  !== 'all' ||
    filters.size    !== 'all' ||
    filters.status  !== 'all' ||
    filters.search  !== '';

  /* Count pets per species (ignoring the current species filter so counts are stable) */
  function countFor(species: PetSpecies | 'all'): number {
    if (species === 'all') return allPets.length;
    return allPets.filter((p) => p.species === species).length;
  }

  return (
    <div className="pet-filters">

      {/* ── Species pill bar ──────────────────────────────────────── */}
      <div className="pet-filters__species" role="group" aria-label="Filter by species">
        {SPECIES_PILLS.map(({ value, emoji, label }) => {
          const count = countFor(value);
          const isActive = filters.species === value;
          return (
            <button
              key={value}
              type="button"
              className={`species-pill${isActive ? ' species-pill--active' : ''}`}
              onClick={() => set('species', value)}
              aria-pressed={isActive}
              aria-label={`${label} (${count})`}
            >
              <span className="species-pill__emoji" aria-hidden="true">{emoji}</span>
              <span className="species-pill__label">{label}</span>
              <span className="species-pill__count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Search input ──────────────────────────────────────────── */}
      <label className="pet-filters__search-wrap" htmlFor="pet-search">
        <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
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

      {/* ── Secondary dropdowns (gender, size, status) ────────────── */}
      <div className="pet-filters__selects">
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

      {/* ── Result count ──────────────────────────────────────────── */}
      <p className="pet-filters__count">
        Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> pets
      </p>
    </div>
  );
}
