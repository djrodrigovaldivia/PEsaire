export type FoodType = 'kibble' | 'wet' | 'meat' | 'treat' | 'other';

export type PortionSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';

export type ContainerType = 'small_plate' | 'normal_plate' | 'spoon' | 'other';

export interface EstimationRange {
  min: number;
  max: number;
}

export type EstimationTable = Record<FoodType, Record<PortionSize, EstimationRange>>;

export interface FoodRecord {
  id: string;
  kind: 'estimate' | 'actual';
  foodType: FoodType;
  portionSize?: PortionSize;
  containerType?: ContainerType;
  estimatedMinGrams?: number;
  estimatedMaxGrams?: number;
  actualGrams?: number;
  note?: string;
  imageDataUrl?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface PrivateRecord {
  id: string;
  category: 'private' | 'other';
  grams: number; // Peso neto real
  grossGrams?: number; // Peso bruto opcional
  tareGrams?: number; // Tara descontada opcional
  tareProfileName?: string; // Nombre del contenedor si se usó uno guardado
  note?: string;
  imageDataUrl?: string;
  hideAmountOnHome: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface TareProfile {
  id: string;
  name: string;
  grams: number;
  createdAt: string;
}

export interface ScaleCheck {
  id: string;
  coinId: string;
  readings: number[];
  averageGrams: number;
  deviationGrams: number;
  dispersionGrams: number; // max - min
  createdAt: string;
}

export interface CatWeightEntry {
  id: string;
  weightKg: number;
  createdAt: string;
  note?: string;
}

export interface CatProfile {
  name: string;
  weightKg: number;
  activityFactor: number; // e.g. 1.2
  activityDescription?: string;
  mealsPerDay: number; // 2, 3, 4
  foodKcalPer100g?: number; // kcal/100g de la etiqueta
  dietNotes?: string;
}

export interface AppSettings {
  theme: 'system' | 'light' | 'dark';
  showOunces: boolean;
  estimationTable: EstimationTable;
  onboardingCompleted: boolean;
  lastBackupDate?: string;
  lastScaleChecklistDate?: string;
  catProfile?: CatProfile;
}

export interface BackupPayload {
  version: 2 | 1;
  exportedAt: string;
  foodRecords: FoodRecord[];
  privateRecords: PrivateRecord[];
  tareProfiles?: TareProfile[];
  scaleChecks?: ScaleCheck[];
  catWeights?: CatWeightEntry[];
  settings: AppSettings;
}
