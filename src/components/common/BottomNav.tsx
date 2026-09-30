import React from 'react';
import { Home, Utensils, Scale, Settings } from 'lucide-react';
import { useApp, TabType } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'food', label: 'Comida', icon: Utensils },
    { id: 'records', label: 'Registro', icon: Scale },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 dark:bg-[#141716]/95 backdrop-blur-md border-t border-[#ECE5DB] dark:border-[#262D2A] pb-safe transition-colors"
    >
      <div className="max-w-md mx-auto px-3 py-1 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 min-h-[48px] py-1.5 px-1 flex flex-col items-center justify-center gap-1 rounded-2xl transition-all ${
                isActive
                  ? 'text-[#52796F] dark:text-[#6B948A] font-bold'
                  : 'text-[#6C7671] dark:text-[#95A19B] font-medium hover:text-[#262B28] dark:hover:text-white'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#52796F]/12 dark:bg-[#52796F]/20 scale-105'
                    : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] leading-tight tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
