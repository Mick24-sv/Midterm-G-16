import type { Pet } from '../types/pet';

export const MOCK_PETS: Pet[] = [
  {
    id: 1,
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age: 24,
    gender: 'male',
    size: 'large',
    status: 'available',
    description:
      'Buddy is a friendly and energetic Golden Retriever who loves to play fetch and cuddle. He is great with kids and other dogs.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
    location: 'Manila',
    tags: ['friendly', 'playful', 'good with kids'],
  },
  {
    id: 2,
    name: 'Luna',
    species: 'cat',
    breed: 'Siamese',
    age: 18,
    gender: 'female',
    size: 'small',
    status: 'available',
    description:
      'Luna is an elegant Siamese cat who enjoys lounging in sunny spots and gentle play. She is calm and affectionate.',
    imageUrl: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400&h=300&fit=crop',
    location: 'Quezon City',
    tags: ['calm', 'affectionate', 'indoor'],
  },
  {
    id: 3,
    name: 'Max',
    species: 'dog',
    breed: 'Beagle',
    age: 8,
    gender: 'male',
    size: 'medium',
    status: 'available',
    description:
      'Max is a curious and adventurous Beagle puppy. He loves exploring outdoors and is very sociable with everyone he meets.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    location: 'Cebu',
    tags: ['curious', 'puppy', 'sociable'],
  },
  {
    id: 4,
    name: 'Coco',
    species: 'rabbit',
    breed: 'Holland Lop',
    age: 6,
    gender: 'female',
    size: 'small',
    status: 'available',
    description:
      'Coco is an adorable Holland Lop rabbit with floppy ears. She is gentle and loves being held and petted.',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop',
    location: 'Davao',
    tags: ['gentle', 'quiet', 'apartment-friendly'],
  },
  {
    id: 5,
    name: 'Mochi',
    species: 'cat',
    breed: 'Persian',
    age: 36,
    gender: 'female',
    size: 'medium',
    status: 'pending',
    description:
      'Mochi is a fluffy Persian cat with a sweet temperament. She prefers a quiet home and loves to be brushed.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop',
    location: 'Manila',
    tags: ['fluffy', 'calm', 'loves grooming'],
  },
  {
    id: 6,
    name: 'Rio',
    species: 'bird',
    breed: 'Cockatiel',
    age: 12,
    gender: 'male',
    size: 'small',
    status: 'available',
    description:
      'Rio is a cheerful Cockatiel who loves to whistle and mimic sounds. He is very social and enjoys human company.',
    imageUrl: 'https://images.unsplash.com/photo-1567608285969-48e4bbe0d399?w=400&h=300&fit=crop',
    location: 'Cebu',
    tags: ['talkative', 'social', 'trained'],
  },
  {
    id: 7,
    name: 'Rocky',
    species: 'dog',
    breed: 'Labrador Mix',
    age: 48,
    gender: 'male',
    size: 'large',
    status: 'available',
    description:
      'Rocky is a loyal and gentle Labrador mix. He is house-trained, knows basic commands, and is great with adults and older kids.',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop',
    location: 'Quezon City',
    tags: ['house-trained', 'loyal', 'obedient'],
  },
  {
    id: 8,
    name: 'Nala',
    species: 'cat',
    breed: 'Domestic Shorthair',
    age: 10,
    gender: 'female',
    size: 'small',
    status: 'available',
    description:
      'Nala is a playful young cat who loves toys and chasing things around. She adapts quickly to new environments.',
    imageUrl: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=300&fit=crop',
    location: 'Davao',
    tags: ['playful', 'adaptable', 'kitten'],
  },
  {
    id: 9,
    name: 'Charlie',
    species: 'dog',
    breed: 'Shih Tzu',
    age: 30,
    gender: 'male',
    size: 'small',
    status: 'adopted',
    description:
      'Charlie is a charming Shih Tzu who loves to be pampered. He enjoys indoor activities and is perfect for apartment living.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    location: 'Manila',
    tags: ['pampered', 'indoor', 'apartment-friendly'],
  },
];

export function formatAge(months: number): string {
  if (months < 12) return `${months} month${months === 1 ? '' : 's'}`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} year${years === 1 ? '' : 's'}`;
  return `${years}y ${rem}m`;
}

