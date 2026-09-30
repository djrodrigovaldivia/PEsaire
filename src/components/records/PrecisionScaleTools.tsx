import React, { useState } from 'react';
import {
  Scale,
  Coins,
  CheckSquare,
  Square,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { SCALE_CHECKLIST } from '../../utils/precisionData';
import { useApp } from '../../context/AppContext';
import { ScaleCalibrationChecker } from './ScaleCalibrationChecker';

interface PrecisionScaleToolsProps {
  onTransferToForm?: (grams: number, note: string) => void;
  defaultSubTab?: 'coins' | 'tare' | 'checklist' | 'curiosity';
}

export const PrecisionScaleTools: React.FC<PrecisionScaleToolsProps> = ({
  onTransferToForm,
  defaultSubTab = 'coins',
}) => {
  const { showToast } = useApp();

  // Active sub-tab in tools
  const [activeTab, setActiveTab] = useState<'coins' | 'tare' | 'checklist' | 'curiosity'>(
    defaultSubTab
  );

  // ----------------------------------------------------
  // MODULE 2: CÁLCULO DE TARA LIMPIO
  // ----------------------------------------------------
  // Solo dos campos numéricos directos:
  // 1. Peso total (con recipiente) [g]
  // 2. Tara (peso del recipiente vacío) [g]
  // Neto = Total - Tara
  const [grossInput, setGrossInput] = useState('');
  const [tareInput, setTareInput] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const parseNum = (v: string) => {
    const n = parseFloat(v.replace(',', '.'));
    return !isNaN(n) && n > 0 ? n : null;
  };

  const totalNum = parseNum(grossInput);
  const tareNum = parseNum(tareInput);

  let netGrams: number | null = null;
  let tareError: string | null = null;

  if (totalNum !== null && tareNum !== null) {
    if (totalNum <= tareNum) {
      tareError = 'El peso total con recipiente debe ser mayor que la tara.';
    } else {
      netGrams = Number((totalNum - tareNum).toFixed(2));
    }
  }

  // ----------------------------------------------------
  // MODULE 3: CHECKLIST NEUTRA DE RESOLUCIÓN DE PROBLEMAS
  // ----------------------------------------------------
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ----------------------------------------------------
  // MODULE 4: CURIOSIDAD EDUCATIVA (PALANCA)
  // ----------------------------------------------------
  const [fulcrumCoinGrams, setFulcrumCoinGrams] = useState('5.0');
  const [fulcrumCoinDist, setFulcrumCoinDist] = useState('10');
  const [fulcrumSampleDist, setFulcrumSampleDist] = useState('10');

  const wCoin = parseFloat(fulcrumCoinGrams.replace(',', '.')) || 5.0;
  const dCoin = parseFloat(fulcrumCoinDist.replace(',', '.')) || 10;
  const dSample = parseFloat(fulcrumSampleDist.replace(',', '.')) || 10;
  const fulcrumEstGrams = dSample > 0 ? (wCoin * dCoin) / dSample : 0;

  return (
    <div className="space-y-4">
      {/* Subtabs Header */}
      <div className="flex rounded-2xl bg-black/5 dark:bg-white/5 p-1 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('coins')}
          className={`flex-1 py-2 px-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'coins'
              ? 'bg-white dark:bg-[#1E2321] text-[#262B28] dark:text-[#EDE8E1] shadow-xs'
              : 'text-[#6C7671] dark:text-[#95A19B]'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Verificar balanza</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tare')}
          className={`flex-1 py-2 px-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'tare'
              ? 'bg-white dark:bg-[#1E2321] text-[#262B28] dark:text-[#EDE8E1] shadow-xs'
              : 'text-[#6C7671] dark:text-[#95A19B]'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Calculadora Tara</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`flex-1 py-2 px-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'checklist'
              ? 'bg-white dark:bg-[#1E2321] text-[#262B28] dark:text-[#EDE8E1] shadow-xs'
              : 'text-[#6C7671] dark:text-[#95A19B]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Checklist</span>
        </button>
      </div>

      {/* TAB 1: VERIFICACIÓN CON MONEDAS */}
      {activeTab === 'coins' && (
        <ScaleCalibrationChecker onTransferToForm={onTransferToForm} />
      )}

      {/* TAB 2: CÁLCULO DE TARA LIMPIO */}
      {activeTab === 'tare' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">
                Cálculo de Tara
              </h3>
              <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] mt-0.5">
                Descuenta el peso del recipiente vacío para obtener el peso neto real.
              </p>
            </div>

            {/* Guía rápida plegable obligatoria */}
            <div className="rounded-2xl border border-[#ECE5DB] dark:border-[#2C3431] p-3.5 bg-[#FAF8F5] dark:bg-[#141716] text-xs">
              <button
                type="button"
                onClick={() => setIsGuideOpen(!isGuideOpen)}
                className="w-full flex items-center justify-between text-left font-semibold text-[#444F4A] dark:text-[#C5D0CB]"
              >
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#52796F]" />
                  Guía rápida para pesar con recipiente
                </span>
                {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {isGuideOpen && (
                <div className="mt-2.5 pt-2 border-t border-[#ECE5DB] dark:border-[#2C3431] space-y-1.5 text-[11px] text-[#6C7671] dark:text-[#95A19B] leading-relaxed">
                  <p>
                    <strong>Paso 1:</strong> Coloca el recipiente vacío y presiona TARE en tu balanza, o anota su peso.
                  </p>
                  <p>
                    <strong>Paso 2:</strong> Agrega el contenido.
                  </p>
                  <p>
                    <strong>Paso 3:</strong> Si pesaste con recipiente sin tarar en la balanza, usa esta calculadora ingresando ambos valores.
                  </p>
                </div>
              )}
            </div>

            {/* Solo dos campos numéricos directos sin presets */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
                  1. Peso total (con recipiente) [g]
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 6.45"
                    value={grossInput}
                    onChange={(e) => setGrossInput(e.target.value)}
                    className="w-full px-3 py-2.5 pr-8 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]"
                  />
                  <span className="absolute right-3 top-3 text-xs text-[#717C76] font-bold">g</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
                  2. Tara (peso del recipiente vacío) [g]
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ej. 1.25"
                    value={tareInput}
                    onChange={(e) => setTareInput(e.target.value)}
                    className="w-full px-3 py-2.5 pr-8 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]"
                  />
                  <span className="absolute right-3 top-3 text-xs text-[#717C76] font-bold">g</span>
                </div>
              </div>
            </div>

            {tareError && (
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {tareError}
              </div>
            )}

            {/* Resultado calculado en vivo: Neto = Total - Tara */}
            {netGrams !== null && !tareError && (
              <div className="p-4 rounded-2xl bg-[#52796F]/10 dark:bg-[#52796F]/20 border border-[#52796F]/30 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-[#6C7671] dark:text-[#95A19B]">
                    Neto calculado (Total − Tara):
                  </span>
                  <span className="text-2xl font-black text-[#52796F] dark:text-[#6B948A]">
                    {netGrams.toFixed(2)} g
                  </span>
                </div>

                <div className="text-[11px] text-[#6C7671] dark:text-[#95A19B] font-mono">
                  {totalNum?.toFixed(2)} g − {tareNum?.toFixed(2)} g = {netGrams.toFixed(2)} g
                </div>

                {onTransferToForm && (
                  <button
                    type="button"
                    onClick={() => {
                      onTransferToForm(
                        netGrams!,
                        `Tara descontada: ${tareNum?.toFixed(2)} g | Total con recipiente: ${totalNum?.toFixed(2)} g`
                      );
                      showToast('Peso neto transferido al formulario.', 'success');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43645C] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Copiar neto al formulario de guardado</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CHECKLIST NEUTRA DE RESOLUCIÓN DE PROBLEMAS */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">
                Checklist de Resolución de Problemas
              </h3>
              <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] mt-0.5 leading-relaxed">
                Verifica estos puntos prácticos para reducir las fuentes más comunes de error en tu balanza física:
              </p>
            </div>

            <div className="space-y-2.5">
              {SCALE_CHECKLIST.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'border-[#52796F] bg-[#52796F]/10 dark:bg-[#52796F]/20'
                        : 'border-[#E5DDD2] dark:border-[#2F3734] bg-[#FAF8F5] dark:bg-[#141716]'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#52796F] dark:text-[#6B948A] shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-[#8D9B94] shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs">
                      <div
                        className={`font-semibold ${
                          isChecked
                            ? 'text-[#262B28] dark:text-white'
                            : 'text-[#4D5752] dark:text-[#BAC4BF]'
                        }`}
                      >
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#717C76] dark:text-[#8D9B94] mt-0.5 leading-snug">
                        {item.detail}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const allChecked = SCALE_CHECKLIST.every((i) => checkedItems[i.id]);
                  if (allChecked) {
                    showToast('¡Todos los puntos verificados!', 'success');
                  } else {
                    showToast('Checklist actualizada.', 'info');
                  }
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-[#52796F] text-white text-xs font-semibold hover:bg-[#43645C] transition-all"
              >
                Completar verificación
              </button>
              <button
                type="button"
                onClick={() => setCheckedItems({})}
                className="py-2.5 px-3 rounded-2xl bg-[#EAE5DC] dark:bg-[#2C312E] text-xs font-semibold text-[#4B5550] dark:text-[#BAC4BF]"
              >
                Limpiar lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEXTO OBLIGATORIO DE VOLUMEN VS PESO */}
      <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] p-3.5 border border-[#EDE7DD] dark:border-[#2C3230] text-xs text-[#55605B] dark:text-[#A7B3AD] leading-relaxed">
        <strong>Principio fundamental:</strong> El volumen no indica el peso: la densidad varía con la humedad, el curado y la molienda. Usa siempre balanza.
      </div>

      {/* APARTADO CURIOSIDAD EDUCATIVA */}
      <details className="rounded-2xl border border-[#EDE7DD] dark:border-[#2C3431] p-3.5 bg-white/60 dark:bg-[#1E2321]/60 text-xs">
        <summary className="font-semibold text-[#4D5752] dark:text-[#BAC4BF] cursor-pointer select-none flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#52796F]" />
            Curiosidad educativa: La balanza de palanca (Ley de Arquímedes)
          </span>
          <span className="text-[10px] text-[#717C76] uppercase">Ver detalle</span>
        </summary>
        <div className="mt-3 pt-3 border-t border-[#ECE5DB] dark:border-[#2C3431] space-y-3">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
            <strong>Aviso:</strong> Este experimento ilustra la ley de momentos mecánicos de la palanca. <strong>No sirve para registrar pesos</strong> debido a la fricción y falta de sensibilidad. Usa siempre balanza física.
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] text-[#717C76] block mb-0.5">Peso moneda (g)</span>
              <input
                type="number"
                step="0.01"
                value={fulcrumCoinGrams}
                onChange={(e) => setFulcrumCoinGrams(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] text-[#717C76] block mb-0.5">Dist. moneda (cm)</span>
              <input
                type="number"
                step="0.5"
                value={fulcrumCoinDist}
                onChange={(e) => setFulcrumCoinDist(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border text-xs"
              />
            </div>
            <div>
              <span className="text-[10px] text-[#717C76] block mb-0.5">Dist. muestra (cm)</span>
              <input
                type="number"
                step="0.5"
                value={fulcrumSampleDist}
                onChange={(e) => setFulcrumSampleDist(e.target.value)}
                className="w-full p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border text-xs"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-center">
            <span className="text-[10px] text-[#717C76] uppercase block">
              Resultado teórico ilustrativo:
            </span>
            <span className="text-base font-bold text-[#262B28] dark:text-[#EDE8E1]">
              ~{fulcrumEstGrams.toFixed(2)} g
            </span>
          </div>
        </div>
      </details>
    </div>
  );
};
