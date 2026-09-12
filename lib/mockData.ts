export type WasteType = 
  | 'Food Waste' 
  | 'Crop Residue' 
  | 'Spent Brewery Grain' 
  | 'Forestry Byproducts' 
  | 'Municipal Organic';

export type BatchStatus = 
  | 'created' 
  | 'in_transit' 
  | 'arrived_geofence' 
  | 'scaled' 
  | 'processing' 
  | 'pending_audit' 
  | 'minted';

export interface WasteBatch {
  id: string;
  supplierName: string;
  supplierLocation: string;
  wasteType: WasteType;
  declaredWeightKg: number;
  moisturePercentage: number;
  binPhotoUrl: string;
  timestamp: string;
  
  // Driver & Logistics
  driverId?: string;
  driverName?: string;
  driverVerifiedWeightKg?: number;
  geofenceVerified?: boolean;
  geofenceTimestamp?: string;
  waybillHash?: string;
  
  // Recycler Processing
  recyclerFacility?: string;
  conversionMethod?: 'Biochar Pyrolysis' | 'Anaerobic Biogas' | 'Industrial Composting';
  energyConsumedKwh?: number;
  yieldKg?: number;
  carbonPurityPercent?: number;
  calculatedCarbonTonne?: number;
  
  // Audit & Mint
  status: BatchStatus;
  auditorRemarks?: string;
  auditPassed?: boolean;
  mintTxHash?: string;
  tokenCertificateId?: string;
}

export interface CarbonToken {
  id: string;
  batchId: string;
  supplierName: string;
  projectName: string;
  vintage: string;
  method: string;
  location: string;
  pricePerTonne: number;
  availableTonnes: number;
  permanenceYears: number;
  coBenefits: string[];
  registryId: string;
  carbonSavedTonnes: number;
  createdAt: string;
}

export interface LeaderboardCompany {
  id: string;
  name: string;
  category: string;
  batchesCount: number;
  totalWasteTonne: number;
  carbonOffsetTonne: number;
  ecoScore: number;
  rank: number;
  badge: string;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  type: 'waste_logged' | 'geofence_verified' | 'weight_scaled' | 'conversion_done' | 'credit_minted' | 'credit_purchased';
  title: string;
  description: string;
  badge: string;
}

export const INITIAL_BATCHES: WasteBatch[] = [
  {
    id: 'WST-1048',
    supplierName: 'Hotel Green Leaf (Eco Resort)',
    supplierLocation: 'Aerocity Sector 4, Bayfront',
    wasteType: 'Food Waste',
    declaredWeightKg: 120,
    moisturePercentage: 42,
    binPhotoUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Today, 09:15 AM',
    driverId: 'TRK-08',
    driverName: 'Rajesh Sharma (EcoHaul Fleet)',
    driverVerifiedWeightKg: 118.4,
    geofenceVerified: true,
    geofenceTimestamp: 'Today, 10:42 AM',
    waybillHash: '0x8b3a7...d419e',
    recyclerFacility: 'BioChar Circular Hub #1',
    conversionMethod: 'Biochar Pyrolysis',
    energyConsumedKwh: 38.5,
    yieldKg: 35.5,
    carbonPurityPercent: 82,
    calculatedCarbonTonne: 0.088,
    status: 'pending_audit',
  },
  {
    id: 'WST-1047',
    supplierName: 'AgriCorp Punjab Green Belt',
    supplierLocation: 'Farmland Cluster #7, Ludhiana',
    wasteType: 'Crop Residue',
    declaredWeightKg: 450,
    moisturePercentage: 18,
    binPhotoUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Yesterday, 04:30 PM',
    driverId: 'TRK-04',
    driverName: 'Harpreet Singh',
    driverVerifiedWeightKg: 446.8,
    geofenceVerified: true,
    geofenceTimestamp: 'Yesterday, 06:10 PM',
    waybillHash: '0x3c99a...e901f',
    recyclerFacility: 'BioChar Circular Hub #1',
    conversionMethod: 'Biochar Pyrolysis',
    energyConsumedKwh: 64.0,
    yieldKg: 162.0,
    carbonPurityPercent: 86,
    calculatedCarbonTonne: 0.412,
    status: 'minted',
    auditPassed: true,
    mintTxHash: '0x71e9...b84f2',
    tokenCertificateId: 'CRT-2026-0094',
  },
  {
    id: 'WST-1049',
    supplierName: 'BrewCraft Microbrewery',
    supplierLocation: 'Indiranagar Industrial Estate',
    wasteType: 'Spent Brewery Grain',
    declaredWeightKg: 280,
    moisturePercentage: 65,
    binPhotoUrl: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Today, 11:30 AM',
    driverId: 'TRK-12',
    driverName: 'Vikram Mehta',
    driverVerifiedWeightKg: 277.5,
    geofenceVerified: true,
    geofenceTimestamp: 'Today, 12:20 PM',
    waybillHash: '0x99a1f...cc882',
    recyclerFacility: 'BioChar Circular Hub #1',
    status: 'scaled',
  },
  {
    id: 'WST-1050',
    supplierName: 'Metro Fresh Supermarket Hub',
    supplierLocation: 'West End Logistics Yard',
    wasteType: 'Food Waste',
    declaredWeightKg: 310,
    moisturePercentage: 55,
    binPhotoUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Today, 01:10 PM',
    driverId: 'TRK-08',
    driverName: 'Rajesh Sharma (EcoHaul Fleet)',
    status: 'in_transit',
  },
  {
    id: 'WST-1051',
    supplierName: 'Evergreen Timber Mill',
    supplierLocation: 'North Ridge Forest Sector',
    wasteType: 'Forestry Byproducts',
    declaredWeightKg: 620,
    moisturePercentage: 14,
    binPhotoUrl: 'https://images.unsplash.com/photo-1520116468418-887952dc64ec?auto=format&fit=crop&w=600&q=80',
    timestamp: 'Today, 02:00 PM',
    status: 'created',
  }
];

export const INITIAL_CARBON_TOKENS: CarbonToken[] = [
  {
    id: 'CRT-2026-0094',
    batchId: 'WST-1047',
    supplierName: 'AgriCorp Punjab Green Belt',
    projectName: 'Punjab Biochar Soil Sequestration Project',
    vintage: '2026 Q1',
    method: 'Biochar Pyrolysis (High-Permanence)',
    location: 'Ludhiana, IN',
    pricePerTonne: 80,
    availableTonnes: 4.8,
    permanenceYears: 100,
    coBenefits: ['Avoided Stubble Burning', 'Soil Water Retention +30%', 'Crop Yield Boost'],
    registryId: 'REG-DMRV-88219',
    carbonSavedTonnes: 0.412,
    createdAt: 'Yesterday, 06:45 PM',
  },
  {
    id: 'CRT-2026-0091',
    batchId: 'WST-1038',
    supplierName: 'Deccan Agro Cooperative',
    projectName: 'Deccan Agricultural Biomass Valorization',
    vintage: '2026 Q1',
    method: 'Biochar Pyrolysis',
    location: 'Maharashtra, IN',
    pricePerTonne: 80,
    availableTonnes: 12.5,
    permanenceYears: 100,
    coBenefits: ['Heavy Metal Chelation', 'Groundwater Protection'],
    registryId: 'REG-DMRV-87994',
    carbonSavedTonnes: 1.25,
    createdAt: '3 days ago',
  },
  {
    id: 'CRT-2026-0089',
    batchId: 'WST-1025',
    supplierName: 'Highland Timber & Millworks',
    projectName: 'Evergreen Sawdust Carbon Sink',
    vintage: '2026 Q1',
    method: 'Biochar Pyrolysis',
    location: 'Himachal, IN',
    pricePerTonne: 85,
    availableTonnes: 8.2,
    permanenceYears: 120,
    coBenefits: ['Forest Fire Hazard Mitigation', 'Peatland Restoration'],
    registryId: 'REG-DMRV-87401',
    carbonSavedTonnes: 2.18,
    createdAt: '5 days ago',
  }
];

export const LEADERBOARD_COMPANIES: LeaderboardCompany[] = [
  {
    id: 'comp-1',
    name: 'AgriCorp Punjab Farms',
    category: 'Agricultural Agro-Enterprise',
    batchesCount: 142,
    totalWasteTonne: 124.8,
    carbonOffsetTonne: 108.4,
    ecoScore: 99,
    rank: 1,
    badge: '🏆 Top Carbon Sequestrator'
  },
  {
    id: 'comp-2',
    name: 'Metro Supermarkets Chain',
    category: 'Commercial Retail & Groceries',
    batchesCount: 215,
    totalWasteTonne: 89.2,
    carbonOffsetTonne: 72.6,
    ecoScore: 96,
    rank: 2,
    badge: '🌿 Zero-Food-Waste Champion'
  },
  {
    id: 'comp-3',
    name: 'Hotel Green Leaf Group',
    category: 'Hospitality & Luxury Resorts',
    batchesCount: 98,
    totalWasteTonne: 45.6,
    carbonOffsetTonne: 39.8,
    ecoScore: 94,
    rank: 3,
    badge: '⭐ Eco-Tourism Pioneer'
  },
  {
    id: 'comp-4',
    name: 'BrewCraft Craft Breweries',
    category: 'Beverage Manufacturing',
    batchesCount: 64,
    totalWasteTonne: 38.1,
    carbonOffsetTonne: 31.4,
    ecoScore: 92,
    rank: 4,
    badge: '🍺 Circular Grain Star'
  },
  {
    id: 'comp-5',
    name: 'North Ridge Forestry Mills',
    category: 'Woodworking & Forestry',
    batchesCount: 51,
    totalWasteTonne: 52.4,
    carbonOffsetTonne: 46.2,
    ecoScore: 90,
    rank: 5,
    badge: '🌲 Biomass Hero'
  }
];

export const INITIAL_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: 'act-1',
    timestamp: '3 mins ago',
    type: 'geofence_verified',
    title: 'Geofence Arrival Confirmed',
    description: 'Driver TRK-08 verified within 50m radius of BioChar Circular Hub #1',
    badge: 'GPS dMRV'
  },
  {
    id: 'act-2',
    timestamp: '18 mins ago',
    type: 'weight_scaled',
    title: 'Scale Calibration Verified',
    description: '118.4 kg logged for Batch #WST-1048 (Delta: -1.3% normal moisture delta)',
    badge: 'IoT Scale'
  },
  {
    id: 'act-3',
    timestamp: '42 mins ago',
    type: 'conversion_done',
    title: 'Pyrolysis Run Completed',
    description: 'Batch #WST-1047 converted to 162.0 kg biochar (86% fixed carbon purity)',
    badge: 'Pyrolysis'
  },
  {
    id: 'act-4',
    timestamp: '1 hour ago',
    type: 'credit_minted',
    title: '0.412 Carbon Credits Minted',
    description: 'Auditor approved Batch #WST-1047; ERC-1155 Token #CRT-2026-0094 minted',
    badge: 'On-Chain'
  },
  {
    id: 'act-5',
    timestamp: '2 hours ago',
    type: 'waste_logged',
    title: 'New Organic Waste Batch Added',
    description: 'Metro Fresh Supermarket logged 310 kg of organic waste for pickup',
    badge: 'Supplier'
  }
];
