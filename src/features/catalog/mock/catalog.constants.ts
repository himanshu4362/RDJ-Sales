import type { SelectOption } from '../domain/catalog.types';

export const MOCK_BRANDS: SelectOption[] = [
  { id: 'brand_ati', name: 'ATI Pro' },
  { id: 'brand_ahuja', name: 'Ahuja' },
  { id: 'brand_jbl', name: 'JBL' },
  { id: 'brand_yamaha', name: 'Yamaha' },
  { id: 'brand_custom', name: 'Custom RDJ' },
];

export const MOCK_CATEGORIES: SelectOption[] = [
  { id: 'cat_amps', name: 'Amplifiers' },
  { id: 'cat_speakers', name: 'Speakers' },
  { id: 'cat_mixers', name: 'Mixers' },
  { id: 'cat_monitors', name: 'Stage Monitors' },
  { id: 'cat_cabinets', name: 'Cabinets' },
];