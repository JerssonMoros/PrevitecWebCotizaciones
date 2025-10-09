import { Phase } from '../models/phase.interface';

export const MOCK_PHASES: Phase[] = [
  {
    id: 'phase1',
    name: 'Base Machine Type',
    options: [
      { id: 'auto', name: 'Automatic', cost: 10000, compatibleWith: [], isOptional: false },
      { id: 'semi', name: 'Semi-Automatic', cost: 8000, compatibleWith: [], isOptional: false }
    ]
  },
  {
    id: 'phase2',
    name: 'Operation Type',
    options: [
      { id: 'mill', name: 'Milling', cost: 5000, compatibleWith: ['auto', 'semi'], isOptional: false },
      { id: 'drill', name: 'Drilling', cost: 3000, compatibleWith: ['auto', 'semi'], isOptional: false },
      { id: 'turn', name: 'Turning', cost: 4000, compatibleWith: ['semi'], isOptional: false } // Only semi
    ]
  },
  {
    id: 'phase3',
    name: 'Capacity',
    options: [
      { id: 'single', name: 'Single-Assisted', cost: 2000, compatibleWith: ['mill', 'drill', 'turn'], isOptional: false },
      { id: 'multi', name: 'Multi-Assisted', cost: 4000, compatibleWith: ['mill', 'drill'], isOptional: false } // Not turn
    ]
  },
  {
    id: 'phase4',
    name: 'Add-ons',
    options: [
      { id: 'sensor', name: 'Advanced Sensors', cost: 1500, compatibleWith: ['single', 'multi'], isOptional: true },
      { id: 'cool', name: 'Cooling System', cost: 1000, compatibleWith: ['single', 'multi'], isOptional: true }
    ]
  },
  {
    id: 'phase5',
    name: 'Customizations',
    options: [
      { id: 'paint', name: 'Custom Paint', cost: 500, compatibleWith: ['sensor', 'cool'], isOptional: true },
      { id: 'warranty', name: 'Extended Warranty', cost: 800, compatibleWith: ['sensor', 'cool'], isOptional: true }
    ]
  }
];