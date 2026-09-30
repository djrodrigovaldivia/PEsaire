import React, { useState, useRef } from 'react';
import {
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Laptop,
  RotateCcw,
  ShieldCheck,
  HardDrive,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FOOD_TYPE_CONFIG, PORTION_SIZE_CONFIG } from '../../utils/constants';
import { FoodType, PortionSize, BackupPayload } from '../../types';

export const SettingsScreen: React.FC = () => {
  const {
    settings,
    foodRecords,
    privateRecords,
    scaleChecks,
    updateSettings,
    restoreDefaultEstimationTable,
    exportDataBackup,
    importDataBackup,
    resetAllAppData,
    openOnboardingAgain,
    showToast,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importModeModalOpen, setImportModeModalOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<BackupPayload | null>(null);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Handle Export
  const handleExport = async () => {
    try {
      const payload = await exportDataBackup();
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `peso-claro-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Respaldo JSON descargado con éxito.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al exportar datos.', 'error');
    }
  };

  // Handle File Selection for Import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as BackupPayload;
        if (!parsed.version || !parsed.foodRecords || !parsed.privateRecords) {
          throw new Error('Formato de respaldo incompatible.');
        }
        setPendingPayload(parsed);
        setImportModeModalOpen(true);
      } catch (err) {
        showToast('El archivo seleccionado no es un respaldo válido de Peso Claro.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmImport = async (mode: 'merge' | 'replace') => {
    if (!pendingPayload) return;
    try {
      const { importedCount } = await importDataBackup(pendingPayload, mode);
      setImportModeModalOpen(false);
      setPendingPayload(null);
      showToast(`Se importaron ${importedCount} registros exitosamente.`, 'success');
    } catch (err) {
      showToast('Error importando datos.', 'error');
    }
  };

  const handleConfirmReset = async () => {
    try {
      await resetAllAppData();
      setResetModalOpen(false);
      showToast('Todos los datos locales han sido borrados.', 'info');
    } catch (err) {
      showToast('Error al reiniciar datos.', 'error');
    }
  };

  // Range editor helpers
  const handleUpdateRange = (
    foodType: FoodType,
    size: PortionSize,
    field: 'min' | 'max',
    val: number
  ) => {
    const currentTable = { ...settings.estimationTable };
    const currentEntry = { ...currentTable[foodType][size], [field]: val };
    currentTable[foodType] = {
      ...currentTable[foodType],
      [size]: currentEntry,
    };
    updateSettings({ estimationTable: currentTable });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Datos y Privacidad */}
      <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-[#52796F]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#262B28] dark:text-[#EDE8E1]">
            Datos y Privacidad
          </h3>
        </div>

        <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] leading-relaxed">
          Tus datos se guardan exclusivamente en el almacenamiento IndexedDB de este navegador. No hay servidores, cuentas ni rastreo de información.
        </p>

        {/* Counters */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230]">
            <span className="text-[10px] text-[#717C76] block">Comidas</span>
            <span className="font-bold text-[#262B28] dark:text-[#EDE8E1] text-sm">
              {foodRecords.length}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230]">
            <span className="text-[10px] text-[#717C76] block">Reg. Privados</span>
            <span className="font-bold text-[#262B28] dark:text-[#EDE8E1] text-sm">
              {privateRecords.length}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230]">
            <span className="text-[10px] text-[#717C76] block">Comprobaciones</span>
            <span className="font-bold text-[#262B28] dark:text-[#EDE8E1] text-sm">
              {scaleChecks.length}
            </span>
          </div>
        </div>

        {/* Backup buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleExport}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-semibold text-[#262B28] dark:text-[#EDE8E1] hover:bg-black/5 flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-[#52796F]" />
            <span>Descargar respaldo local (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-semibold text-[#262B28] dark:text-[#EDE8E1] hover:bg-black/5 flex items-center justify-center gap-2"
          >
            <Upload className="w-3.5 h-3.5 text-[#52796F]" />
            <span>Restaurar desde archivo JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Borrar todos los datos locales</span>
          </button>
        </div>
      </div>

      {/* Visual Preferences */}
      <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#262B28] dark:text-[#EDE8E1]">
          Preferencia de Visualización
        </h3>

        {/* Theme */}
        <div>
          <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-2">
            Tema de la aplicación
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'system' })}
              className={`py-2 px-2 rounded-xl border flex items-center justify-center gap-1.5 ${
                settings.theme === 'system'
                  ? 'border-[#52796F] bg-[#52796F]/10 dark:bg-[#52796F]/20 font-bold'
                  : 'border-[#E5DDD2] dark:border-[#2F3734] bg-[#FAF8F5] dark:bg-[#141716]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Sistema</span>
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'light' })}
              className={`py-2 px-2 rounded-xl border flex items-center justify-center gap-1.5 ${
                settings.theme === 'light'
                  ? 'border-[#52796F] bg-[#52796F]/10 font-bold'
                  : 'border-[#E5DDD2] dark:border-[#2F3734] bg-[#FAF8F5] dark:bg-[#141716]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Claro</span>
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`py-2 px-2 rounded-xl border flex items-center justify-center gap-1.5 ${
                settings.theme === 'dark'
                  ? 'border-[#52796F] bg-[#52796F]/20 font-bold'
                  : 'border-[#E5DDD2] dark:border-[#2F3734] bg-[#FAF8F5] dark:bg-[#141716]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Oscuro</span>
            </button>
          </div>
        </div>

        {/* Show Ounces */}
        <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-[#ECE5DB] dark:border-[#2C3431]">
          <div>
            <span className="text-xs font-semibold text-[#262B28] dark:text-[#EDE8E1] block">
              Mostrar onzas secundarias (oz)
            </span>
            <span className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
              Los gramos (g) se conservan como unidad principal
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings.showOunces}
            onChange={(e) => updateSettings({ showOunces: e.target.checked })}
            className="rounded text-[#52796F] focus:ring-[#52796F] w-4 h-4"
          />
        </label>
      </div>

      {/* Estimation Table Customizer */}
      <details className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431]">
        <summary className="text-xs font-bold uppercase tracking-wider text-[#262B28] dark:text-[#EDE8E1] cursor-pointer select-none flex items-center justify-between">
          <span>Personalizar Rangos de Estimación</span>
          <span className="text-[10px] text-[#52796F] font-semibold">Editar</span>
        </summary>
        <div className="mt-4 pt-3 border-t border-[#ECE5DB] dark:border-[#2C3431] space-y-4 text-xs">
          <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
            Ajusta los rangos orientativos en gramos según tu experiencia con las porciones:
          </p>

          {(Object.keys(FOOD_TYPE_CONFIG) as FoodType[]).map((fType) => (
            <div
              key={fType}
              className="p-3 bg-[#FAF8F5] dark:bg-[#141716] rounded-2xl border border-[#EDE7DD] dark:border-[#2C3230] space-y-2"
            >
              <span className="font-bold text-[#262B28] dark:text-[#EDE8E1] block">
                {FOOD_TYPE_CONFIG[fType].label}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(PORTION_SIZE_CONFIG) as PortionSize[]).map((size) => {
                  const range = settings.estimationTable?.[fType]?.[size] || { min: 10, max: 20 };
                  return (
                    <div key={size} className="flex items-center justify-between text-[11px]">
                      <span className="text-[#6C7671] dark:text-[#95A19B]">
                        {PORTION_SIZE_CONFIG[size].label}:
                      </span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={range.min}
                          onChange={(e) =>
                            handleUpdateRange(fType, size, 'min', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-12 px-1.5 py-1 text-center bg-white dark:bg-[#202523] border rounded-lg text-xs font-bold"
                        />
                        <span>–</span>
                        <input
                          type="number"
                          value={range.max}
                          onChange={(e) =>
                            handleUpdateRange(fType, size, 'max', parseInt(e.target.value, 10) || 0)
                          }
                          className="w-12 px-1.5 py-1 text-center bg-white dark:bg-[#202523] border rounded-lg text-xs font-bold"
                        />
                        <span>g</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={restoreDefaultEstimationTable}
            className="w-full py-2 px-3 rounded-xl bg-[#EAE5DC] dark:bg-[#2C312E] text-xs font-semibold text-[#4B5550] dark:text-[#BAC4BF] flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar rangos por defecto</span>
          </button>
        </div>
      </details>

      {/* About & Principles */}
      <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#262B28] dark:text-[#EDE8E1]">
          Acerca de Peso Claro
        </h3>
        <p className="text-xs text-[#6C7671] dark:text-[#95A19B] leading-relaxed">
          <strong>Principio fundamental:</strong> La app no mide peso. El teléfono no tiene celda de carga. La única fuente de gramos reales es una balanza física; la app registra, verifica y reduce errores de tara, cálculo e historial.
        </p>

        <div className="pt-2 flex justify-between items-center text-xs text-[#717C76]">
          <span>Versión 1.0.0 (PWA Offline)</span>
          <button
            type="button"
            onClick={openOnboardingAgain}
            className="text-[#52796F] dark:text-[#6B948A] font-semibold underline"
          >
            Ver bienvenida de nuevo
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {importModeModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-[#FAF8F5] dark:bg-[#1E2321] rounded-3xl max-w-sm w-full p-5 border border-[#ECE5DB] dark:border-[#2C3431] shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">
              ¿Cómo deseas importar el respaldo?
            </h3>
            <p className="text-xs text-[#6C7671] dark:text-[#95A19B] leading-relaxed">
              Elige si deseas combinar los datos con los actuales o reemplazar la base de datos completa.
            </p>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmImport('merge')}
                className="w-full py-2.5 px-3 rounded-2xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43645C]"
              >
                Combinar (Conservar actuales y añadir nuevos)
              </button>
              <button
                type="button"
                onClick={() => handleConfirmImport('replace')}
                className="w-full py-2.5 px-3 rounded-2xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700"
              >
                Reemplazar (Borrar datos actuales)
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportModeModalOpen(false);
                  setPendingPayload(null);
                }}
                className="w-full py-2 px-3 rounded-2xl bg-[#EAE5DC] dark:bg-[#2C312E] text-xs font-semibold text-[#4B5550] dark:text-[#BAC4BF]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset confirmation modal */}
      {resetModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-[#FAF8F5] dark:bg-[#1E2321] rounded-3xl max-w-sm w-full p-5 border border-rose-300 dark:border-rose-900 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold">¿Borrar todos los datos locales?</h3>
            </div>
            <p className="text-xs text-[#6C7671] dark:text-[#95A19B] leading-relaxed">
              Esta acción no se puede deshacer. Todos tus registros de comida, historial privado y configuraciones se eliminarán de este navegador.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="flex-1 py-2 px-3 rounded-2xl bg-[#EAE5DC] dark:bg-[#2C312E] text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-2 px-3 rounded-2xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Sí, borrar todo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
