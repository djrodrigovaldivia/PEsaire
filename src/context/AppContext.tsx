import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  clearAllData,
  deleteCatWeight,
  deleteFoodRecord,
  deletePrivateRecord,
  deleteScaleCheck,
  deleteTareProfile,
  exportBackup,
  getAllCatWeights,
  getAllFoodRecords,
  getAllPrivateRecords,
  getAllScaleChecks,
  getAllTareProfiles,
  getSettings,
  importBackup,
  saveCatWeight,
  saveFoodRecord,
  savePrivateRecord,
  saveScaleCheck,
  saveSettings,
  saveTareProfile,
  seedDemoData,
} from '../services/db';
import {
  AppSettings,
  BackupPayload,
  CatWeightEntry,
  FoodRecord,
  PrivateRecord,
  ScaleCheck,
  TareProfile,
} from '../types';
import { DEFAULT_ESTIMATION_TABLE, DEFAULT_SETTINGS } from '../utils/constants';

export type TabType = 'home' | 'food' | 'records' | 'settings';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextValue {
  foodRecords: FoodRecord[];
  privateRecords: PrivateRecord[];
  tareProfiles: TareProfile[];
  scaleChecks: ScaleCheck[];
  catWeights: CatWeightEntry[];
  settings: AppSettings;
  loading: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  foodSubTab: 'estimate' | 'actual' | 'cat_planner';
  setFoodSubTab: (subTab: 'estimate' | 'actual' | 'cat_planner') => void;
  recordsSubTab: 'records' | 'tools';
  setRecordsSubTab: (subTab: 'records' | 'tools') => void;
  showPrivateAmounts: boolean;
  setShowPrivateAmounts: React.Dispatch<React.SetStateAction<boolean>>;
  toggleShowPrivateAmounts: () => void;

  // Modals & Editing
  editingFoodRecord: FoodRecord | null;
  setEditingFoodRecord: (rec: FoodRecord | null) => void;
  editingPrivateRecord: PrivateRecord | null;
  setEditingPrivateRecord: (rec: PrivateRecord | null) => void;
  isQuickActionModalOpen: boolean;
  setIsQuickActionModalOpen: (open: boolean) => void;

  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Actions
  addOrUpdateFood: (record: FoodRecord) => Promise<void>;
  removeFood: (id: string) => Promise<void>;
  addOrUpdatePrivate: (record: PrivateRecord) => Promise<void>;
  removePrivate: (id: string) => Promise<void>;
  addOrUpdateTareProfile: (profile: TareProfile) => Promise<void>;
  removeTareProfile: (id: string) => Promise<void>;
  addScaleCheck: (check: ScaleCheck) => Promise<void>;
  removeScaleCheck: (id: string) => Promise<void>;
  addCatWeight: (entry: CatWeightEntry) => Promise<void>;
  removeCatWeight: (id: string) => Promise<void>;
  updateSettings: (partial: Partial<AppSettings>) => Promise<void>;
  restoreDefaultEstimationTable: () => Promise<void>;

  // Backup
  exportDataBackup: () => Promise<BackupPayload>;
  importDataBackup: (
    payload: BackupPayload,
    mode: 'merge' | 'replace'
  ) => Promise<{ importedCount: number }>;
  resetAllAppData: () => Promise<void>;

  // Onboarding
  onboardingOpen: boolean;
  completeOnboarding: (seedDemo: boolean) => Promise<void>;
  openOnboardingAgain: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [foodRecords, setFoodRecords] = useState<FoodRecord[]>([]);
  const [privateRecords, setPrivateRecords] = useState<PrivateRecord[]>([]);
  const [tareProfiles, setTareProfiles] = useState<TareProfile[]>([]);
  const [scaleChecks, setScaleChecks] = useState<ScaleCheck[]>([]);
  const [catWeights, setCatWeights] = useState<CatWeightEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [foodSubTab, setFoodSubTab] = useState<'estimate' | 'actual' | 'cat_planner'>('estimate');
  const [recordsSubTab, setRecordsSubTab] = useState<'records' | 'tools'>('records');
  const [showPrivateAmounts, setShowPrivateAmounts] = useState(false);

  const [editingFoodRecord, setEditingFoodRecord] = useState<FoodRecord | null>(null);
  const [editingPrivateRecord, setEditingPrivateRecord] = useState<PrivateRecord | null>(null);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState(false);

  const [toast, setToast] = useState<ToastState | null>(null);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'error' = 'success') => {
      const id = Math.random().toString(36).slice(2);
      setToast({ id, message, type });
      setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, 3500);
    },
    []
  );

  const reloadData = useCallback(async () => {
    try {
      const [foods, privs, tares, checks, weights, sets] = await Promise.all([
        getAllFoodRecords(),
        getAllPrivateRecords(),
        getAllTareProfiles(),
        getAllScaleChecks(),
        getAllCatWeights(),
        getSettings(),
      ]);
      setFoodRecords(foods);
      setPrivateRecords(privs);
      setTareProfiles(tares);
      setScaleChecks(checks);
      setCatWeights(weights);
      setSettings(sets);

      if (!sets.onboardingCompleted && foods.length === 0 && privs.length === 0) {
        setOnboardingOpen(true);
      }
    } catch (err) {
      console.error('Error cargando base de datos:', err);
      showToast('Error cargando datos locales.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Apply theme to html root
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (settings.theme === 'dark') {
        root.classList.add('dark');
      } else if (settings.theme === 'light') {
        root.classList.remove('dark');
      } else {
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [settings.theme]);

  const toggleShowPrivateAmounts = useCallback(() => {
    setShowPrivateAmounts((prev) => !prev);
  }, []);

  const addOrUpdateFood = async (record: FoodRecord) => {
    await saveFoodRecord(record);
    const updated = await getAllFoodRecords();
    setFoodRecords(updated);
  };

  const removeFood = async (id: string) => {
    await deleteFoodRecord(id);
    const updated = await getAllFoodRecords();
    setFoodRecords(updated);
  };

  const addOrUpdatePrivate = async (record: PrivateRecord) => {
    await savePrivateRecord(record);
    const updated = await getAllPrivateRecords();
    setPrivateRecords(updated);
  };

  const removePrivate = async (id: string) => {
    await deletePrivateRecord(id);
    const updated = await getAllPrivateRecords();
    setPrivateRecords(updated);
  };

  const addOrUpdateTareProfile = async (profile: TareProfile) => {
    await saveTareProfile(profile);
    const updated = await getAllTareProfiles();
    setTareProfiles(updated);
  };

  const removeTareProfile = async (id: string) => {
    await deleteTareProfile(id);
    const updated = await getAllTareProfiles();
    setTareProfiles(updated);
  };

  const addScaleCheck = async (check: ScaleCheck) => {
    await saveScaleCheck(check);
    const updated = await getAllScaleChecks();
    setScaleChecks(updated);
  };

  const removeScaleCheck = async (id: string) => {
    await deleteScaleCheck(id);
    const updated = await getAllScaleChecks();
    setScaleChecks(updated);
  };

  const addCatWeight = async (entry: CatWeightEntry) => {
    await saveCatWeight(entry);
    const updated = await getAllCatWeights();
    setCatWeights(updated);
  };

  const removeCatWeight = async (id: string) => {
    await deleteCatWeight(id);
    const updated = await getAllCatWeights();
    setCatWeights(updated);
  };

  const updateSettings = async (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    await saveSettings(updated);
    setSettings(updated);
  };

  const restoreDefaultEstimationTable = async () => {
    const updated = {
      ...settings,
      estimationTable: DEFAULT_ESTIMATION_TABLE,
    };
    await saveSettings(updated);
    setSettings(updated);
  };

  const exportDataBackup = async (): Promise<BackupPayload> => {
    const payload = await exportBackup();
    setSettings((prev) => ({
      ...prev,
      lastBackupDate: payload.settings.lastBackupDate,
    }));
    return payload;
  };

  const importDataBackup = async (
    payload: BackupPayload,
    mode: 'merge' | 'replace'
  ) => {
    const result = await importBackup(payload, mode);
    await reloadData();
    return result;
  };

  const resetAllAppData = async () => {
    await clearAllData();
    await reloadData();
  };

  const completeOnboarding = async (seedDemo: boolean) => {
    if (seedDemo) {
      await seedDemoData();
    }
    const updated = {
      ...settings,
      onboardingCompleted: true,
    };
    await saveSettings(updated);
    setSettings(updated);
    setOnboardingOpen(false);
    await reloadData();
  };

  const openOnboardingAgain = () => {
    setOnboardingOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        foodRecords,
        privateRecords,
        tareProfiles,
        scaleChecks,
        catWeights,
        settings,
        loading,
        activeTab,
        setActiveTab,
        foodSubTab,
        setFoodSubTab,
        recordsSubTab,
        setRecordsSubTab,
        showPrivateAmounts,
        setShowPrivateAmounts,
        toggleShowPrivateAmounts,
        editingFoodRecord,
        setEditingFoodRecord,
        editingPrivateRecord,
        setEditingPrivateRecord,
        isQuickActionModalOpen,
        setIsQuickActionModalOpen,
        toast,
        showToast,
        addOrUpdateFood,
        removeFood,
        addOrUpdatePrivate,
        removePrivate,
        addOrUpdateTareProfile,
        removeTareProfile,
        addScaleCheck,
        removeScaleCheck,
        addCatWeight,
        removeCatWeight,
        updateSettings,
        restoreDefaultEstimationTable,
        exportDataBackup,
        importDataBackup,
        resetAllAppData,
        onboardingOpen,
        completeOnboarding,
        openOnboardingAgain,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
