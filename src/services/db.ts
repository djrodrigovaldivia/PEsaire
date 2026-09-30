import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  AppSettings,
  BackupPayload,
  CatWeightEntry,
  FoodRecord,
  PrivateRecord,
  ScaleCheck,
  TareProfile,
} from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';

interface PesoClaroDBSchema extends DBSchema {
  food_records: {
    key: string;
    value: FoodRecord;
    indexes: {
      'by-created': string;
      'by-kind': string;
      'by-food-type': string;
    };
  };
  private_records: {
    key: string;
    value: PrivateRecord;
    indexes: {
      'by-created': string;
      'by-category': string;
    };
  };
  app_settings: {
    key: string;
    value: { id: string; settings: AppSettings };
  };
  tare_profiles: {
    key: string;
    value: TareProfile;
    indexes: {
      'by-created': string;
    };
  };
  scale_checks: {
    key: string;
    value: ScaleCheck;
    indexes: {
      'by-created': string;
    };
  };
  cat_weights: {
    key: string;
    value: CatWeightEntry;
    indexes: {
      'by-created': string;
    };
  };
}

const DB_NAME = 'peso_claro_db';
const DB_VERSION = 2;
const SETTINGS_KEY = 'global_settings';

let dbPromise: Promise<IDBPDatabase<PesoClaroDBSchema>> | null = null;

export async function getDB(): Promise<IDBPDatabase<PesoClaroDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<PesoClaroDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        // v1 Stores
        if (!db.objectStoreNames.contains('food_records')) {
          const foodStore = db.createObjectStore('food_records', { keyPath: 'id' });
          foodStore.createIndex('by-created', 'createdAt');
          foodStore.createIndex('by-kind', 'kind');
          foodStore.createIndex('by-food-type', 'foodType');
        }

        if (!db.objectStoreNames.contains('private_records')) {
          const privStore = db.createObjectStore('private_records', { keyPath: 'id' });
          privStore.createIndex('by-created', 'createdAt');
          privStore.createIndex('by-category', 'category');
        }

        if (!db.objectStoreNames.contains('app_settings')) {
          db.createObjectStore('app_settings', { keyPath: 'id' });
        }

        // v2 Stores
        if (!db.objectStoreNames.contains('tare_profiles')) {
          const tareStore = db.createObjectStore('tare_profiles', { keyPath: 'id' });
          tareStore.createIndex('by-created', 'createdAt');
        }

        if (!db.objectStoreNames.contains('scale_checks')) {
          const checkStore = db.createObjectStore('scale_checks', { keyPath: 'id' });
          checkStore.createIndex('by-created', 'createdAt');
        }

        if (!db.objectStoreNames.contains('cat_weights')) {
          const weightStore = db.createObjectStore('cat_weights', { keyPath: 'id' });
          weightStore.createIndex('by-created', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

// FOOD RECORDS API
export async function getAllFoodRecords(): Promise<FoodRecord[]> {
  const db = await getDB();
  const records = await db.getAllFromIndex('food_records', 'by-created');
  return records.reverse();
}

export async function saveFoodRecord(record: FoodRecord): Promise<void> {
  const db = await getDB();
  await db.put('food_records', record);
}

export async function deleteFoodRecord(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('food_records', id);
}

// PRIVATE RECORDS API
export async function getAllPrivateRecords(): Promise<PrivateRecord[]> {
  const db = await getDB();
  const records = await db.getAllFromIndex('private_records', 'by-created');
  return records.reverse();
}

export async function savePrivateRecord(record: PrivateRecord): Promise<void> {
  const db = await getDB();
  await db.put('private_records', record);
}

export async function deletePrivateRecord(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('private_records', id);
}

// TARE PROFILES API
export async function getAllTareProfiles(): Promise<TareProfile[]> {
  const db = await getDB();
  const profiles = await db.getAllFromIndex('tare_profiles', 'by-created');
  return profiles.reverse();
}

export async function saveTareProfile(profile: TareProfile): Promise<void> {
  const db = await getDB();
  await db.put('tare_profiles', profile);
}

export async function deleteTareProfile(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('tare_profiles', id);
}

// SCALE CHECKS API
export async function getAllScaleChecks(): Promise<ScaleCheck[]> {
  const db = await getDB();
  const checks = await db.getAllFromIndex('scale_checks', 'by-created');
  return checks.reverse();
}

export async function saveScaleCheck(check: ScaleCheck): Promise<void> {
  const db = await getDB();
  await db.put('scale_checks', check);
}

export async function deleteScaleCheck(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('scale_checks', id);
}

// CAT WEIGHT ENTRIES API
export async function getAllCatWeights(): Promise<CatWeightEntry[]> {
  const db = await getDB();
  const weights = await db.getAllFromIndex('cat_weights', 'by-created');
  // Sort chronological ascending for charts, but we can return by date
  return weights.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export async function saveCatWeight(entry: CatWeightEntry): Promise<void> {
  const db = await getDB();
  await db.put('cat_weights', entry);
}

export async function deleteCatWeight(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('cat_weights', id);
}

// SETTINGS API
export async function getSettings(): Promise<AppSettings> {
  const db = await getDB();
  const item = await db.get('app_settings', SETTINGS_KEY);
  if (!item || !item.settings) {
    return { ...DEFAULT_SETTINGS };
  }
  return {
    ...DEFAULT_SETTINGS,
    ...item.settings,
    estimationTable: {
      ...DEFAULT_SETTINGS.estimationTable,
      ...(item.settings.estimationTable || {}),
    },
  };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDB();
  await db.put('app_settings', {
    id: SETTINGS_KEY,
    settings,
  });
}

// BACKUP & RESTORE
export async function exportBackup(): Promise<BackupPayload> {
  const foodRecords = await getAllFoodRecords();
  const privateRecords = await getAllPrivateRecords();
  const tareProfiles = await getAllTareProfiles();
  const scaleChecks = await getAllScaleChecks();
  const catWeights = await getAllCatWeights();
  const settings = await getSettings();

  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    foodRecords,
    privateRecords,
    tareProfiles,
    scaleChecks,
    catWeights,
    settings: {
      ...settings,
      lastBackupDate: new Date().toISOString(),
    },
  };
}

export async function importBackup(
  payload: BackupPayload,
  mode: 'merge' | 'replace'
): Promise<{ importedCount: number }> {
  if (!payload || typeof payload !== 'object') {
    throw new Error('El archivo no contiene un formato JSON válido.');
  }

  if (
    !Array.isArray(payload.foodRecords) ||
    !Array.isArray(payload.privateRecords)
  ) {
    throw new Error('Estructura de respaldo incompatible o dañada.');
  }

  const db = await getDB();
  const tx = db.transaction(
    [
      'food_records',
      'private_records',
      'app_settings',
      'tare_profiles',
      'scale_checks',
      'cat_weights',
    ],
    'readwrite'
  );

  if (mode === 'replace') {
    await tx.objectStore('food_records').clear();
    await tx.objectStore('private_records').clear();
    await tx.objectStore('tare_profiles').clear();
    await tx.objectStore('scale_checks').clear();
    await tx.objectStore('cat_weights').clear();
  }

  let count = 0;

  for (const record of payload.foodRecords) {
    if (record && record.id && record.kind && record.foodType) {
      await tx.objectStore('food_records').put(record);
      count++;
    }
  }

  for (const record of payload.privateRecords) {
    if (
      record &&
      record.id &&
      typeof record.grams === 'number' &&
      !isNaN(record.grams)
    ) {
      await tx.objectStore('private_records').put(record);
      count++;
    }
  }

  if (Array.isArray(payload.tareProfiles)) {
    for (const profile of payload.tareProfiles) {
      if (profile && profile.id && typeof profile.grams === 'number') {
        await tx.objectStore('tare_profiles').put(profile);
        count++;
      }
    }
  }

  if (Array.isArray(payload.scaleChecks)) {
    for (const check of payload.scaleChecks) {
      if (check && check.id) {
        await tx.objectStore('scale_checks').put(check);
        count++;
      }
    }
  }

  if (Array.isArray(payload.catWeights)) {
    for (const entry of payload.catWeights) {
      if (entry && entry.id && typeof entry.weightKg === 'number') {
        await tx.objectStore('cat_weights').put(entry);
        count++;
      }
    }
  }

  if (payload.settings && typeof payload.settings === 'object') {
    await tx.objectStore('app_settings').put({
      id: SETTINGS_KEY,
      settings: {
        ...DEFAULT_SETTINGS,
        ...payload.settings,
        lastBackupDate: new Date().toISOString(),
      },
    });
  }

  await tx.done;
  return { importedCount: count };
}

// SEED DEMO DATA
export async function seedDemoData(): Promise<void> {
  const now = new Date();
  const h2Ago = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const demoFood: FoodRecord[] = [
    {
      id: 'demo-f-1',
      kind: 'actual',
      foodType: 'kibble',
      actualGrams: 30,
      note: 'Porción matutina pesada en balanza de cocina',
      createdAt: h2Ago,
      updatedAt: h2Ago,
    },
    {
      id: 'demo-f-2',
      kind: 'estimate',
      foodType: 'wet',
      portionSize: 'medium',
      containerType: 'normal_plate',
      estimatedMinGrams: 45,
      estimatedMaxGrams: 70,
      note: 'Media lata de comida húmeda',
      createdAt: yesterday,
      updatedAt: yesterday,
    },
  ];

  const demoPrivate: PrivateRecord[] = [
    {
      id: 'demo-p-1',
      category: 'private',
      grams: 1.5,
      grossGrams: 2.35,
      tareGrams: 0.85,
      tareProfileName: 'Bolsita de muestra',
      note: 'Pesaje con tara descontada en balanza física',
      hideAmountOnHome: true,
      createdAt: twoDaysAgo,
      updatedAt: twoDaysAgo,
    },
  ];

  const demoTare: TareProfile = {
    id: 'demo-tare-1',
    name: 'Bolsita pequeña de muestra',
    grams: 0.85,
    createdAt: twoDaysAgo,
  };

  const demoCatWeight: CatWeightEntry[] = [
    {
      id: 'demo-cw-1',
      weightKg: 4.1,
      createdAt: weekAgo,
      note: 'Control veterinario',
    },
    {
      id: 'demo-cw-2',
      weightKg: 4.0,
      createdAt: h2Ago,
      note: 'Pesaje en casa',
    },
  ];

  const db = await getDB();
  const tx = db.transaction(
    ['food_records', 'private_records', 'tare_profiles', 'cat_weights'],
    'readwrite'
  );
  for (const f of demoFood) {
    await tx.objectStore('food_records').put(f);
  }
  for (const p of demoPrivate) {
    await tx.objectStore('private_records').put(p);
  }
  await tx.objectStore('tare_profiles').put(demoTare);
  for (const w of demoCatWeight) {
    await tx.objectStore('cat_weights').put(w);
  }
  await tx.done;
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(
    [
      'food_records',
      'private_records',
      'app_settings',
      'tare_profiles',
      'scale_checks',
      'cat_weights',
    ],
    'readwrite'
  );
  await tx.objectStore('food_records').clear();
  await tx.objectStore('private_records').clear();
  await tx.objectStore('app_settings').clear();
  await tx.objectStore('tare_profiles').clear();
  await tx.objectStore('scale_checks').clear();
  await tx.objectStore('cat_weights').clear();
  await tx.done;
}
