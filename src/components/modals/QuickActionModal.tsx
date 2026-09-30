import React from 'react';
import { Sparkles, Scale, ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionModalOpen,
    setIsQuickActionModalOpen,
    setActiveTab,
    setFoodSubTab,
  } = useApp();

  if (!isQuickActionModalOpen) return null;

  const handleSelect = (action: 'food_estimate' | 'food_actual' | 'private') => {
    setIsQuickActionModalOpen(false);
    if (action === 'food_estimate') {
      setFoodSubTab('estimate');
      setActiveTab('food');
    } else if (action === 'food_actual') {
      setFoodSubTab('actual');
      setActiveTab('food');
    } else if (action === 'private') {
      setActiveTab('records');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs p-3 transition-all"
    >
      <div className="w-full max-w-sm rounded-3xl bg-[#FAF8F5] dark:bg-[#1E2220] p-5 shadow-2xl border border-[#ECE5DB] dark:border-[#323936] text-[#262B28] dark:text-[#EDE8E1] space-y-4 animate-in fade-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D7] dark:border-[#2C3330]">
          <h3 className="text-sm font-bold">¿Qué deseas registrar hoy?</h3>
          <button
            type="button"
            onClick={() => setIsQuickActionModalOpen(false)}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {/* Action 1: Estimar porción gata */}
          <button
            type="button"
            onClick={() => handleSelect('food_estimate')}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#252B28] border border-[#ECE5DB] dark:border-[#303834] text-left hover:border-[#52796F] active:scale-98 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#52796F]/12 text-[#52796F] dark:text-[#88B2A7] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block text-[#262B28] dark:text-white">
                Estimar porción de comida
              </span>
              <span className="text-[11px] text-[#717C76] dark:text-[#9AA5A0] leading-tight block">
                Cálculo de rango orientativo según alimento y cuenco
              </span>
            </div>
          </button>

          {/* Action 2: Peso real comida */}
          <button
            type="button"
            onClick={() => handleSelect('food_actual')}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#252B28] border border-[#ECE5DB] dark:border-[#303834] text-left hover:border-[#52796F] active:scale-98 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#52796F]/12 text-[#52796F] dark:text-[#88B2A7] flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block text-[#262B28] dark:text-white">
                Registrar peso real de comida
              </span>
              <span className="text-[11px] text-[#717C76] dark:text-[#9AA5A0] leading-tight block">
                Gramos exactos medidos con balanza física
              </span>
            </div>
          </button>

          {/* Action 3: Pesaje privado balanza */}
          <button
            type="button"
            onClick={() => handleSelect('private')}
            className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-[#252B28] border border-[#ECE5DB] dark:border-[#303834] text-left hover:border-[#E07A5F] active:scale-98 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/12 text-[#E07A5F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold block text-[#262B28] dark:text-white">
                Registro privado en balanza
              </span>
              <span className="text-[11px] text-[#717C76] dark:text-[#9AA5A0] leading-tight block">
                Pesaje personal de control con balanza física
              </span>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsQuickActionModalOpen(false)}
          className="w-full py-2.5 rounded-xl bg-[#EAE5DC] dark:bg-[#2B322F] text-xs font-medium text-[#55635D] dark:text-[#BAC4BF]"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
