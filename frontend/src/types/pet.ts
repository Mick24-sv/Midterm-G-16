export type PetSpecies = 'dog' | 'cat' | 'rabbit' | 'bird' | 'other';
export type PetGender = 'male' | 'female';
export type PetStatus = 'available' | 'pending' | 'adopted';
export type PetSize = 'small' | 'medium' | 'large';

export interface Pet {
  id: number;
  name: string;
  species: PetSpecies;
  breed: string;
  age: number; // in months
  gender: PetGender;
  size: PetSize;
  status: PetStatus;
  description: string;
  imageUrl: string;
  location: string;
  tags: string[];
}

export interface PetFilters {
  species: PetSpecies | 'all';
  gender: PetGender | 'all';
  size: PetSize | 'all';
  status: PetStatus | 'all';
  search: string;
}

