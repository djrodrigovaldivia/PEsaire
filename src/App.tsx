import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { HomeScreen } from './components/home/HomeScreen';
import { FoodScreen } from './components/food/FoodScreen';
import { PrivateRecordsScreen } from './components/records/PrivateRecordsScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

const AppContent: React.FC = () => {
  const { activeTab, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-[#141716] text-[#52796F]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-[#52796F] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold">Cargando Peso Claro...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#141716] text-[#262B28] dark:text-[#EDE8E1] flex flex-col font-sans transition-colors antialiased selection:bg-[#52796F]/20">
      <Header />

      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4 pb-24">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'food' && <FoodScreen />}
        {activeTab === 'records' && <PrivateRecordsScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>

      <BottomNav />
      <Toast />
      <OnboardingModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
