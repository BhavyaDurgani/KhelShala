import type { NPCCharacter } from '../../types/algorithm';

export const NPC_CHARACTERS: Record<string, NPCCharacter> = {
  marcus: {
    id: 'marcus',
    name: 'Supervisor Marcus',
    title: 'Warehouse Logistics Director',
    role: 'SUPERVISOR',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    greeting: 'Engineer! We have a critical shipment bottleneck. Our barcode scanner takes over 8 seconds to locate package #82491!',
    dialogue: [
      'Our customer is waiting for express delivery package #82491.',
      'Our current system checks every single package one by one from Shelf 1 to Shelf 1,000,000.',
      'Access the terminal on the control room workstation and optimize the search algorithm before the truck leaves!'
    ]
  },
  sophia: {
    id: 'sophia',
    name: 'Senior Dev Sophia',
    title: 'Principal Systems Architect AI',
    role: 'SENIOR_DEV_AI',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    greeting: 'Hello Engineer! I am Sophia, your Senior Systems Architect. Need help optimizing your Big-O time complexity?',
    dialogue: [
      'Remember: Linear Search O(N) inspects every element sequentially. On 1,000,000 items, that requires 1,000,000 operations.',
      'Notice that the warehouse packages are already sorted by Package ID!',
      'When data is sorted, Binary Search O(log N) can divide the search space in half with every single comparison!'
    ]
  }
};
