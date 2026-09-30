import React from 'react';
import { ShieldCheck, HardDrive } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 dark:bg-[#141716]/90 backdrop-blur-md border-b border-[#ECE5DB] dark:border-[#262D2A] pt-safe transition-colors">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#52796F] text-white flex items-center justify-center font-bold text-base shadow-sm">
            PC
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[#262B28] dark:text-[#EAE6DF] leading-tight">
              Peso Claro
            </h1>
            <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] font-medium leading-none mt-0.5">
              Estimaciones claras, registros reales.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            title="Datos guardados exclusivamente en tu dispositivo"
            className="flex items-center gap-1 text-[11px] font-medium text-[#52796F] dark:text-[#6B948A] bg-[#52796F]/10 dark:bg-[#52796F]/20 px-2 py-1 rounded-xl"
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Local</span>
          </div>
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
