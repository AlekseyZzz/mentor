export const POT_TYPES = [
  'SRP',
  '3BP',
  '4BP',
  '5BP',
  'Cold-Call',
  'Squeeze'
];

export const POSITIONS = [
  'IP',
  'OOP',
  'SB',
  'BB',
  'BTN',
  'CO',
  'MP',
  'UTG'
];

export const STREETS = [
  'Flop',
  'Turn',
  'River',
  'Preflop'
];

export const DECISION_CATEGORIES = [
  'Value',
  'Bluff',
  'Thin Value',
  'Bluff-Catch',
  'Check-Raise',
  'Probe',
  'Donk',
  'Fold'
];

export const ERROR_TYPES = [
  'Overcall',
  'Underbluff',
  'Missed Value',
  'Spew',
  'Line Deviation',
  'Sizing Error',
  'Range Error'
];

export const TILT_TYPES = [
  'Injustice',
  'OwnError',
  'Fatigue',
  'Revenge',
  'Fear',
  'Impatience',
  'Overconfidence'
];

export const GAME_STATES = ['A', 'B', 'C'] as const;

export const ALL_TAGS = [
  ...POT_TYPES,
  ...POSITIONS,
  ...STREETS,
  ...DECISION_CATEGORIES,
  ...ERROR_TYPES
];
