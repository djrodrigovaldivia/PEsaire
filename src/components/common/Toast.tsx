import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-[#52796F] dark:text-[#6B948A] shrink-0" />,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90%] pointer-events-none animate-in fade-in slide-in-from-top-3 duration-200"
    >
      <div className="bg-white/95 dark:bg-[#1F2422]/95 backdrop-blur-md border border-[#ECE5DB] dark:border-[#2C3431] shadow-lg rounded-2xl p-3.5 flex items-center gap-2.5 text-xs font-semibold text-[#262B28] dark:text-[#EAE6DF]">
        {icons[toast.type]}
        <span className="flex-1 leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};
