import {
  AppSettings,
  CatProfile,
  ContainerType,
  EstimationTable,
  FoodType,
  PortionSize,
} from '../types';

export const DEFAULT_CAT_PROFILE: CatProfile = {
  name: 'Mi Gata',
  weightKg: 4.0,
  activityFactor: 1.2,
  activityDescription: 'Adulta esterilizada / poca actividad',
  mealsPerDay: 2,
  foodKcalPer100g: 380,
  dietNotes: '',
};

export const DEFAULT_ESTIMATION_TABLE: EstimationTable = {
  kibble: {
    tiny: { min: 10, max: 15 },
    small: { min: 15, max: 25 },
    medium: { min: 25, max: 35 },
    large: { min: 35, max: 50 },
    xlarge: { min: 50, max: 70 },
  },
  wet: {
    tiny: { min: 15, max: 25 },
    small: { min: 25, max: 45 },
    medium: { min: 45, max: 70 },
    large: { min: 70, max: 100 },
    xlarge: { min: 100, max: 140 },
  },
  meat: {
    tiny: { min: 10, max: 20 },
    small: { min: 20, max: 35 },
    medium: { min: 35, max: 55 },
    large: { min: 55, max: 85 },
    xlarge: { min: 85, max: 120 },
  },
  treat: {
    tiny: { min: 1, max: 3 },
    small: { min: 3, max: 6 },
    medium: { min: 6, max: 10 },
    large: { min: 10, max: 15 },
    xlarge: { min: 15, max: 25 },
  },
  other: {
    tiny: { min: 5, max: 10 },
    small: { min: 10, max: 20 },
    medium: { min: 20, max: 35 },
    large: { min: 35, max: 55 },
    xlarge: { min: 55, max: 80 },
  },
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  showOunces: false,
  estimationTable: DEFAULT_ESTIMATION_TABLE,
  onboardingCompleted: false,
  catProfile: DEFAULT_CAT_PROFILE,
};

export const FOOD_TYPE_CONFIG: Record<
  FoodType,
  { label: string; icon: string; description: string }
> = {
  kibble: {
    label: 'Croquetas',
    icon: 'cookie',
    description: 'Pienso seco extrusionado',
  },
  wet: {
    label: 'Comida húmeda',
    icon: 'soup',
    description: 'Latas, sobres o paté',
  },
  meat: {
    label: 'Pollo / Carne',
    icon: 'beef',
    description: 'Proteína cocida o magra desmenuzada',
  },
  treat: {
    label: 'Snack / Premio',
    icon: 'sparkles',
    description: 'Premios y golosinas secas o semihúmedas',
  },
  other: {
    label: 'Otro',
    icon: 'circle-dot',
    description: 'Otros alimentos o complementos',
  },
};

export const PORTION_SIZE_CONFIG: Record<
  PortionSize,
  { label: string; hint: string }
> = {
  tiny: { label: 'Muy pequeña', hint: 'Apenas una muestra o fondo' },
  small: { label: 'Pequeña', hint: 'Menos de medio cuenco' },
  medium: { label: 'Media', hint: 'Ración estándar habitual' },
  large: { label: 'Grande', hint: 'Ración generosa' },
  xlarge: { label: 'Muy grande', hint: 'Cuenco rebosante' },
};

export const CONTAINER_TYPE_CONFIG: Record<
  ContainerType,
  { label: string }
> = {
  small_plate: { label: 'Plato pequeño' },
  normal_plate: { label: 'Plato normal' },
  spoon: { label: 'Cuchara' },
  other: { label: 'Sin recipiente / otro' },
};
