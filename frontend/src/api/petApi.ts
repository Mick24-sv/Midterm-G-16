import type { Pet } from '../types/pet';
import { MOCK_PETS } from '../data/pets';

// Configurable base URL for API (can be overridden via VITE_API_URL or defaults to /api)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface BackendPet {
  id: number;
  name: string;
  species: string;
  breed?: string | null;
  age?: number | null;
  owner_id?: number | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface AdoptionRequestPayload {
  pet_id: number;
  adopter_id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  adoption_date?: string;
}

// Fallback image map based on species
const SPECIES_IMAGE_MAP: Record<string, string> = {
  dog: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
  cat: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400&h=300&fit=crop',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop',
  bird: 'https://images.unsplash.com/photo-1567608285969-48e4bbe0d399?w=400&h=300&fit=crop',
  other: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop',
};

/**
 * Normalizes backend pet data to frontend Pet interface.
 * Matches with mock pet details (images, tags, description) if available,
 * or generates sensible defaults.
 */
export function normalizePet(backendPet: BackendPet): Pet {
  const match = MOCK_PETS.find((p) => p.id === backendPet.id || p.name.toLowerCase() === backendPet.name.toLowerCase());
  const speciesKey = (backendPet.species || 'other').toLowerCase();

  return {
    id: backendPet.id,
    name: backendPet.name,
    species: (['dog', 'cat', 'rabbit', 'bird', 'other'].includes(speciesKey) ? speciesKey : 'other') as Pet['species'],
    breed: backendPet.breed || match?.breed || 'Mixed Breed',
    age: backendPet.age != null ? backendPet.age : (match?.age ?? 12),
    gender: match?.gender ?? 'male',
    size: match?.size ?? 'medium',
    status: (['available', 'pending', 'adopted'].includes(backendPet.status) ? backendPet.status : 'available') as Pet['status'],
    description: match?.description || `${backendPet.name} is looking for a loving forever home!`,
    imageUrl: match?.imageUrl || SPECIES_IMAGE_MAP[speciesKey] || SPECIES_IMAGE_MAP.other,
    location: match?.location || 'Manila',
    tags: match?.tags || ['friendly', 'adoptable'],
  };
}

/**
 * Fetch all pets from GET /api/pets with optional filters
 */
export async function getPets(filters?: { name?: string; species?: string; breed?: string }): Promise<Pet[]> {
  const params = new URLSearchParams();
  if (filters?.name) params.append('name', filters.name);
  if (filters?.species && filters.species !== 'all') params.append('species', filters.species);
  if (filters?.breed) params.append('breed', filters.breed);

  const url = `${API_BASE_URL}/pets${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch pets: ${response.status} ${response.statusText}`);
  }

  const data: BackendPet[] = await response.json();
  return data.map(normalizePet);
}

/**
 * Fetch single pet by ID from GET /api/pets/:id
 */
export async function getPetById(id: number): Promise<Pet> {
  const response = await fetch(`${API_BASE_URL}/pets/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch pet #${id}: ${response.status} ${response.statusText}`);
  }
  const data: BackendPet = await response.json();
  return normalizePet(data);
}

/**
 * Update pet status via PATCH /api/pets/:id/status
 */
export async function updatePetStatus(id: number, status: 'available' | 'pending' | 'adopted'): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/pets/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to update pet status: ${response.statusText}`);
  }
}

/**
 * Submit adoption request to POST /api/adoptions
 */
export async function submitAdoptionRequest(payload: AdoptionRequestPayload): Promise<unknown> {
  // If no adopter_id is provided, default to 1 (or prompt user/guest adopter id)
  const body = {
    pet_id: payload.pet_id,
    adopter_id: payload.adopter_id || 1,
    notes: payload.notes || `Applicant: ${payload.fullName || 'Anonymous'} | Phone: ${payload.phone || 'N/A'} | Address: ${payload.address || 'N/A'}`,
    adoption_date: payload.adoption_date || new Date().toISOString().split('T')[0],
  };

  const response = await fetch(`${API_BASE_URL}/adoptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to submit adoption: ${response.statusText}`);
  }

  return response.json();
}

