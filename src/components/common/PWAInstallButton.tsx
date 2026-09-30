import React, { useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isIOS, promptInstall } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (!isInstallable) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else {
      await promptInstall();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Instalar app en iPhone o escritorio"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#52796F] text-white text-xs font-semibold shadow-xs hover:bg-[#43645C] active:scale-95 transition-all"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Instalar</span>
      </button>

      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-200"
        >
          <div className="bg-[#FAF8F5] dark:bg-[#1F2422] rounded-3xl max-w-sm w-full p-5 border border-[#ECE5DB] dark:border-[#2C3431] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECE5DB] dark:border-[#2C3431]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#52796F] text-white flex items-center justify-center text-xs font-bold">
                  PC
                </div>
                <h3 className="text-sm font-bold text-[#262B28] dark:text-[#EAE6DF]">
                  Instalar en iPhone (Safari)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#6C7671] dark:text-[#95A19B] leading-relaxed">
              Para usar <strong>Peso Claro</strong> en pantalla completa y con acceso offline rápido:
            </p>

            <ol className="space-y-3 text-xs text-[#262B28] dark:text-[#EAE6DF]">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#52796F]/15 text-[#52796F] dark:text-[#6B948A] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Toca el botón <strong>Compartir</strong> en la barra inferior de Safari{' '}
                  <Share className="w-3.5 h-3.5 inline text-[#52796F] mx-0.5" />.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#52796F]/15 text-[#52796F] dark:text-[#6B948A] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Desplázate hacia abajo y selecciona{' '}
                  <strong>«Agregar a pantalla de inicio»</strong>{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline text-[#52796F] mx-0.5" />.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#52796F]/15 text-[#52796F] dark:text-[#6B948A] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Toca <strong>«Agregar»</strong> en la esquina superior derecha.
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43645C] transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
