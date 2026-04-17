// ── Wem Brand Constants ────────────────────────────────────────────────────

export const Colors = {
  // Primary brand
  brand:       '#0077CC',
  brandDark:   '#0055AA',
  brandLight:  '#00C2FF',
  brandGlow:   'rgba(0, 119, 204, 0.15)',

  // Rider app (light mode)
  riderBg:        '#F4F9FF',
  riderCard:      '#FFFFFF',
  riderBorder:    '#D0E8F8',
  riderText:      '#07122B',
  riderSubtext:   '#6B88A8',
  riderMuted:     '#8899BB',

  // Driver app (dark mode)
  driverBg:       '#07122B',
  driverCard:     '#0F1E35',
  driverBorder:   '#0F2A45',
  driverText:     '#E0EAF5',
  driverSubtext:  '#4A7A9B',
  driverMuted:    '#2A5070',
  driverCyan:     '#00C2FF',

  // Status colors
  green:   '#00A876',
  red:     '#E53935',
  amber:   '#F59E0B',
  purple:  '#7C3AED',

  // Pass badge
  passBg:     '#EBF5FF',
  passText:   '#0055AA',
  passBorder: '#0077CC',

  // Female Driver Preference
  certBg:   '#FFF0F8',
  certText: '#AA0066',

  // Noir tier
  noirBg:     '#07122B',
  noirAccent: '#00C2FF',

  // Transparent overlays
  overlay:     'rgba(7, 18, 43, 0.7)',
  overlayLight:'rgba(244, 249, 255, 0.95)',

  white: '#FFFFFF',
  black: '#000000',
};

export const Typography = {
  // Font families — using system fonts for Expo compatibility
  // Replace with custom font once loaded
  heading: 'System',
  body:    'System',

  // Sizes
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   20,
  xl:   24,
  xxl:  28,
  xxxl: 34,
  huge: 42,
};

export const Spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  xxxl:32,
};

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  full: 100,
};

export const Shadow = {
  sm: {
    shadowColor: '#07122B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#07122B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0077CC',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// ── DFW Simulation Data ───────────────────────────────────────────────────
// Hardcoded GPS coordinates for the demo ride simulation
// Route: Uptown Dallas → Love Field Airport

export const DEMO_ROUTE = [
  { latitude: 32.8022, longitude: -96.8006 }, // Uptown Dallas (pickup)
  { latitude: 32.8031, longitude: -96.8080 },
  { latitude: 32.8055, longitude: -96.8120 },
  { latitude: 32.8090, longitude: -96.8180 },
  { latitude: 32.8120, longitude: -96.8250 },
  { latitude: 32.8145, longitude: -96.8310 },
  { latitude: 32.8160, longitude: -96.8390 },
  { latitude: 32.8180, longitude: -96.8420 },
  { latitude: 32.8195, longitude: -96.8455 },
  { latitude: 32.8472, longitude: -96.8517 }, // Love Field Airport (dropoff)
];

export const DEMO_PICKUP = {
  latitude: 32.8022,
  longitude: -96.8006,
  name: 'Uptown Dallas',
  address: '2847 Maple Ave, Dallas TX',
};

export const DEMO_DROPOFF = {
  latitude: 32.8472,
  longitude: -96.8517,
  name: 'Love Field Airport',
  address: 'DAL · Dallas Love Field',
};

export const DEMO_DRIVER = {
  id: 'driver_001',
  name: 'Maria S.',
  rating: 4.98,
  trips: 1847,
  make:             'toyota',
  model:            'camry',
  vehicleYear:      '2022',
  colorName:        'white',
  colorHex:         '#F2F2F0',
  carType:          'sedan' as const,
  isFemaleDriverPref: true,
  features:         'Nexar dash cam on windshield · Wem sticker rear window · No Uber/Lyft decals',
  vehicle: '2022 Toyota Camry',
  color: 'Pearl White',
  plate: 'WEM-2024',
  eta: 3,
  avatar: null, // Will use initials fallback
};

export const DEMO_RIDER = {
  id: 'rider_001',
  name: 'Jessica',
  lastName: 'T.',
  hasPass: true,
  rating: 4.95,
  savedPlaces: {
    home: { name: 'Home', address: '2847 Maple Ave, Dallas TX', latitude: 32.8022, longitude: -96.8006 },
    office: { name: 'Office', address: '350 N St Paul St, Dallas TX', latitude: 32.7798, longitude: -96.7980 },
  },
  preferences: {
    driverGender: 'Female Driver Preference',
    music: 'Hip Hop',
    temperature: 'Cool',
    quietRide: false,
  },
};

// ── Fare calculation ───────────────────────────────────────────────────────

export const FARE_CONFIG = {
  baseFare:        1.50,   // Base charge per ride
  perMile:         1.80,   // Per mile rate
  perMinute:       0.30,   // Per minute rate
  gasAdjPerMile:   0.15,   // $0.15/mi — 100% to driver, updated weekly via EIA // Updated weekly via EIA
  pickupBaselineM: 1.0,  // Free pickup within 1 mile
  pickupRate1:     0.10, // Per mile 1.0–2.5
  pickupRate2:     0.15, // Per mile 2.5+
  surgeCapNonPass: 1.5,    // Max 1.5x surge for non-Pass riders
  commissionY1:    0.25,   // 25% Y1 → drops to 22% Y2+
  passPrice:       14.99,  // Confirmed $14.99/mo
  tiers: {
    standard: { multiplier: 1.0,  label: 'Wem',        maxPassengers: 3 },
    xl:       { multiplier: 1.4,  label: 'Wem XL',     maxPassengers: 6 },
    noir:     { multiplier: 2.2,  label: 'Wem Noir',   maxPassengers: 4 },
    noirXL:   { multiplier: 2.8,  label: 'Wem Noir XL',maxPassengers: 6 },
  },
};

export function calculateFare(miles, minutes, tier = 'standard', isPass = false, pickupMiles = 0.8) {
  const t = FARE_CONFIG.tiers[tier];
  const base = (FARE_CONFIG.baseFare + FARE_CONFIG.perMile * miles + FARE_CONFIG.perMinute * minutes) * t.multiplier;
  const gas  = isPass ? 0 : FARE_CONFIG.gasAdjPerMile * miles;
  const pickup = isPass ? 0 : calculatePickupFee(pickupMiles, tier);
  const surge  = isPass ? 0 : 0; // Pass always waived; non-pass add surge separately
  return {
    base:     parseFloat(base.toFixed(2)),
    gas:      parseFloat(gas.toFixed(2)),
    pickup:   parseFloat(pickup.toFixed(2)),
    total:    parseFloat((base + gas + pickup + surge).toFixed(2)),
    passRate: parseFloat(base.toFixed(2)), // Pass pays only base
    driverEarnings: parseFloat((base * (1 - FARE_CONFIG.commissionY1) + FARE_CONFIG.gasAdjPerMile * miles + pickup).toFixed(2)),
  };
}

function calculatePickupFee(pickupMiles, tier = 'standard') {
  const multipliers = { standard: 1.0, xl: 1.2, noir: 1.5, noirXL: 1.8 };
  const m = multipliers[tier] || 1.0;
  if (pickupMiles <= FARE_CONFIG.pickupBaselineM) return 0;
  let fee = 0;
  const above = pickupMiles - FARE_CONFIG.pickupBaselineM;
  if (above <= 1.5) {
    fee = above * FARE_CONFIG.pickupRate1;
  } else {
    fee = 1.5 * FARE_CONFIG.pickupRate1 + (above - 1.5) * FARE_CONFIG.pickupRate2;
  }
  return parseFloat((fee * m).toFixed(2));
}
