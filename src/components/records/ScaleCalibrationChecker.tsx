import React, { useState } from 'react';
import {
  Coins,
  Scale,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  RotateCcw,
  History,
  Trash2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react';
import {
  StandardCoinVariant,
  VERIFIED_COINS,
  SCALE_CHECKLIST,
} from '../../utils/precisionData';
import { ScaleCheck } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatDateRelative } from '../../utils/formatters';

interface ScaleCalibrationCheckerProps {
  onTransferToForm?: (grams: number, note: string) => void;
  standalone?: boolean;
}

export const ScaleCalibrationChecker: React.FC<ScaleCalibrationCheckerProps> = ({
  onTransferToForm,
  standalone = false,
}) => {
  const { scaleChecks, addScaleCheck, removeScaleCheck, showToast } = useApp();

  // Filters & Selected Coin
  const [selectedCountry, setSelectedCountry] = useState<string>('Chile');
  const [selectedCoinId, setSelectedCoinId] = useState<string>('cl_100_bimetalica');

  // Input readings: single vs 3-repeat mode
  const [isMultiReadMode, setIsMultiReadMode] = useState<boolean>(false);
  const [singleReading, setSingleReading] = useState<string>('');
  const [reading1, setReading1] = useState<string>('');
  const [reading2, setReading2] = useState<string>('');
  const [reading3, setReading3] = useState<string>('');

  // Expandable checklist & history
  const [showChecklistGuide, setShowChecklistGuide] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Available countries
  const countries = ['Chile', 'EE.UU.', 'Eurozona', 'México', 'Reino Unido', 'Todos'];

  // Filtered coins
  const filteredCoins =
    selectedCountry === 'Todos'
      ? VERIFIED_COINS
      : VERIFIED_COINS.filter((c) => c.country === selectedCountry);

  const selectedCoin: StandardCoinVariant =
    VERIFIED_COINS.find((c) => c.id === selectedCoinId) ||
    filteredCoins[0] ||
    VERIFIED_COINS[0];

  // Helper to parse numeric string
  const parseNum = (v: string): number | null => {
    if (!v) return null;
    const n = parseFloat(v.replace(',', '.'));
    return !isNaN(n) && n > 0 ? n : null;
  };

  // Readings computation
  let validReadings: number[] = [];
  if (isMultiReadMode) {
    const r1 = parseNum(reading1);
    const r2 = parseNum(reading2);
    const r3 = parseNum(reading3);
    validReadings = [r1, r2, r3].filter((x): x is number => x !== null);
  } else {
    const r = parseNum(singleReading);
    if (r !== null) validReadings = [r];
  }

  const hasReadings = validReadings.length > 0;
  const avgReading = hasReadings
    ? validReadings.reduce((a, b) => a + b, 0) / validReadings.length
    : null;

  const maxReading = hasReadings ? Math.max(...validReadings) : null;
  const minReading = hasReadings ? Math.min(...validReadings) : null;
  const dispersion =
    maxReading !== null && minReading !== null && validReadings.length > 1
      ? maxReading - minReading
      : 0;

  const deviationGrams =
    avgReading !== null ? avgReading - selectedCoin.nominalWeightGrams : null;
  const deviationPercent =
    deviationGrams !== null && selectedCoin.nominalWeightGrams > 0
      ? (deviationGrams / selectedCoin.nominalWeightGrams) * 100
      : null;

  // Metrological assessment (Prudent 3-tier diagnostic)
  const getMetrologicalDiagnostic = () => {
    if (avgReading === null || deviationGrams === null || deviationPercent === null) {
      return null;
    }

    const absDev = Math.abs(deviationGrams);
    const absPct = Math.abs(deviationPercent);

    // Level 1: Consistent within tolerance
    if (absDev <= selectedCoin.toleranceGrams || absPct <= 1.5) {
      return {
        tier: 'optimal',
        status: 'Balanza en buen estado operativo',
        badge: 'Consistente con la referencia',
        verdict: 'No requiere recalibración ni reemplazo.',
        description:
          'La lectura se encuentra dentro del margen de tolerancia oficial y del desgaste natural de la moneda. Tu balanza responde de manera adecuada para uso habitual.',
        color:
          'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        icon: CheckCircle2,
      };
    }

    // Level 2: Moderate deviation (Detectable difference)
    if (absDev <= selectedCoin.toleranceGrams * 2.5 || absPct <= 5.0) {
      return {
        tier: 'moderate',
        status: 'Diferencia detectable',
        badge: 'Verificar antes de recalibrar',
        verdict: 'Podría ser desgaste de la moneda o desvío leve.',
        description:
          'La diferencia supera la tolerancia legal de acuñación. Antes de asumir un fallo de la balanza, prueba con otra moneda diferente (preferentemente limpia y poco circulada) y verifica que la superficie esté nivelada y sin corrientes de aire.',
        color:
          'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        icon: AlertTriangle,
      };
    }

    // Level 3: Significant deviation (Requires recalibration or replacement)
    return {
      tier: 'critical',
      status: 'Desviación significativa',
      badge: 'Requiere recalibración o reemplazo',
      verdict: 'Balanza descalibrada o sensor fatigado.',
      description:
        'La desviación observada supera el 5% respecto al peso nominal. Si tu balanza cuenta con función de calibración (botón CAL), usa una pesa patrón certificada (clase M1 o F1). Si la balanza no admite calibración o la desviación persiste con varias monedas distintas, la celda de carga física puede estar dañada y se recomienda reemplazarla.',
      color:
        'text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
      icon: AlertOctagon,
    };
  };

  const diagnostic = getMetrologicalDiagnostic();

  // Save scale verification to history
  const handleSaveCheck = async () => {
    if (avgReading === null || deviationGrams === null) return;
    const check: ScaleCheck = {
      id: 'sc-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      coinId: selectedCoin.id,
      readings: validReadings,
      averageGrams: Number(avgReading.toFixed(3)),
      deviationGrams: Number(deviationGrams.toFixed(3)),
      dispersionGrams: Number(dispersion.toFixed(3)),
      createdAt: new Date().toISOString(),
    };
    await addScaleCheck(check);
    showToast('Comprobación guardada en tu historial local.', 'success');
  };

  // Reset current readings
  const handleResetInputs = () => {
    setSingleReading('');
    setReading1('');
    setReading2('');
    setReading3('');
  };

  return (
    <div className="space-y-4">
      {/* Main Verification Card */}
      <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#52796F]/15 text-[#52796F] dark:text-[#6B948A] flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">
              Verificación de Balanza con Monedas
            </h3>
            <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] mt-0.5 leading-relaxed">
              Compara el peso nominal oficial de tu moneda contra la lectura de tu balanza física para diagnosticar su estado y saber si requiere recalibración o reemplazo.
            </p>
          </div>
        </div>

        {/* Golden Rule Mandatory Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
          <span>
            <strong>Regla de oro:</strong> Una moneda circulada NO sustituye a una pesa de calibración certificada. Si tu balanza tiene función CAL, usa una pesa de masa conocida.
          </span>
        </div>

        {/* Country Filter Chips */}
        <div>
          <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1.5">
            1. País o región de la moneda
          </label>
          <div className="flex flex-wrap gap-1.5">
            {countries.map((c) => {
              const isSel = selectedCountry === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(c);
                    const matching =
                      c === 'Todos'
                        ? VERIFIED_COINS
                        : VERIFIED_COINS.filter((coin) => coin.country === c);
                    if (matching.length > 0) {
                      setSelectedCoinId(matching[0].id);
                    }
                  }}
                  className={`py-1.5 px-3 rounded-xl text-xs font-medium transition-all ${
                    isSel
                      ? 'bg-[#52796F] text-white font-bold shadow-2xs'
                      : 'bg-[#FAF8F5] dark:bg-[#141716] text-[#6C7671] dark:text-[#95A19B] border border-[#E2DAD0] dark:border-[#323936]'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Variant Selector Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
            2. Variante específica de la moneda
          </label>
          <select
            value={selectedCoinId}
            onChange={(e) => {
              setSelectedCoinId(e.target.value);
              handleResetInputs();
            }}
            className="w-full px-3 py-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-semibold text-[#262B28] dark:text-[#EDE8E1]"
          >
            {filteredCoins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.country}: {coin.name} ({coin.nominalWeightGrams.toFixed(2)} g)
              </option>
            ))}
          </select>
        </div>

        {/* Selected Variant Specification Card */}
        <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230] space-y-2 text-xs">
          <div className="flex items-baseline justify-between">
            <span className="font-bold text-[#262B28] dark:text-[#EDE8E1] text-xs">
              {selectedCoin.name}
            </span>
            <div className="text-right">
              <span className="text-[10px] text-[#717C76] block">Peso nominal oficial</span>
              <span className="text-sm font-extrabold text-[#52796F] dark:text-[#6B948A]">
                {selectedCoin.nominalWeightGrams.toFixed(2)} g
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#6C7671] dark:text-[#95A19B] pt-1 border-t border-[#ECE5DB] dark:border-[#2C3431]">
            <span>Tolerancia de acuñación conocida:</span>
            <span className="font-semibold text-[#262B28] dark:text-[#EDE8E1]">
              ±{selectedCoin.toleranceGrams.toFixed(3)} g
            </span>
          </div>

          <p className="text-[11px] text-[#4D5752] dark:text-[#BAC4BF] leading-relaxed">
            <strong>Variante física:</strong> {selectedCoin.variantNote}
          </p>

          {selectedCoin.precisionCaveat && (
            <div className="p-2.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed">
              {selectedCoin.precisionCaveat}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-[#717C76] pt-1">
            <span>Fuente oficial: {selectedCoin.source}</span>
            {selectedCoin.sourceUrl && (
              <a
                href={selectedCoin.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#52796F] dark:text-[#6B948A] hover:underline flex items-center gap-0.5"
              >
                <span>Verificar</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>

        {/* Input Mode Toggle */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB]">
              3. Ingresa la lectura de tu balanza
            </label>
            <button
              type="button"
              onClick={() => {
                setIsMultiReadMode(!isMultiReadMode);
                handleResetInputs();
              }}
              className="text-[11px] text-[#52796F] dark:text-[#6B948A] font-semibold underline"
            >
              {isMultiReadMode ? 'Cambiar a pesaje único' : 'Probar 3 pesajes sucesivos (repetibilidad)'}
            </button>
          </div>

          {/* Single Read Mode */}
          {!isMultiReadMode ? (
            <div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ej. 6.52"
                  value={singleReading}
                  onChange={(e) => setSingleReading(e.target.value)}
                  className="w-full px-3 py-3 pr-8 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-base font-bold text-[#262B28] dark:text-[#EDE8E1]"
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-[#717C76] font-bold">
                  g
                </span>
              </div>
            </div>
          ) : (
            /* Multi-Read Mode (3 readings for repeatability/dispersion) */
            <div className="space-y-2">
              <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
                Pesa la moneda, retírala y vuelve a colocarla en el centro del plato 3 veces:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-[10px] text-[#717C76] block mb-0.5">Toma 1 (g)</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="6.50"
                    value={reading1}
                    onChange={(e) => setReading1(e.target.value)}
                    className="w-full p-2.5 text-center rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border text-xs font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#717C76] block mb-0.5">Toma 2 (g)</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="6.51"
                    value={reading2}
                    onChange={(e) => setReading2(e.target.value)}
                    className="w-full p-2.5 text-center rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border text-xs font-bold"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#717C76] block mb-0.5">Toma 3 (g)</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="6.50"
                    value={reading3}
                    onChange={(e) => setReading3(e.target.value)}
                    className="w-full p-2.5 text-center rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metrological Results & Diagnostic Card */}
        {avgReading !== null && deviationGrams !== null && diagnostic && (
          <div className="space-y-3 pt-2">
            {/* Numeric Breakdown */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230] text-xs space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[#6C7671] dark:text-[#95A19B]">Lectura de tu balanza:</span>
                <span className="font-bold text-[#262B28] dark:text-[#EDE8E1] text-sm">
                  {avgReading.toFixed(3)} g
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-[#6C7671] dark:text-[#95A19B]">Desviación observada (Δ):</span>
                <span
                  className={`font-black text-sm ${
                    diagnostic.tier === 'optimal'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : diagnostic.tier === 'moderate'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {deviationGrams > 0 ? '+' : ''}
                  {deviationGrams.toFixed(3)} g ({deviationPercent?.toFixed(2)}%)
                </span>
              </div>

              {isMultiReadMode && validReadings.length > 1 && (
                <div className="flex justify-between text-[11px] text-[#717C76] pt-1 border-t border-[#ECE5DB] dark:border-[#2C3431]">
                  <span>Dispersión de lecturas (Máx − Mín):</span>
                  <span className="font-semibold">{dispersion.toFixed(3)} g</span>
                </div>
              )}
            </div>

            {/* Diagnostic Alert Box */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${diagnostic.color}`}>
              <diagnostic.icon className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{diagnostic.status}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-black/10 dark:bg-white/10">
                    {diagnostic.badge}
                  </span>
                </div>
                <div className="font-semibold">{diagnostic.verdict}</div>
                <p className="leading-relaxed opacity-95 text-[11px] pt-0.5">
                  {diagnostic.description}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveCheck}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-[#52796F] text-white text-xs font-semibold hover:bg-[#43645C] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Guardar en historial de verificaciones</span>
              </button>
              <button
                type="button"
                onClick={handleResetInputs}
                className="py-2.5 px-3 rounded-2xl bg-[#EAE5DC] dark:bg-[#2C312E] text-xs font-semibold text-[#4B5550] dark:text-[#BAC4BF]"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Pre-calibration Troubleshooting Checklist */}
        <div className="rounded-2xl border border-[#ECE5DB] dark:border-[#2C3431] p-3.5 bg-[#FAF8F5] dark:bg-[#141716] text-xs">
          <button
            type="button"
            onClick={() => setShowChecklistGuide(!showChecklistGuide)}
            className="w-full flex items-center justify-between text-left font-semibold text-[#444F4A] dark:text-[#C5D0CB]"
          >
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-[#52796F]" />
              Checklist rápido antes de decidir recalibrar
            </span>
            {showChecklistGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showChecklistGuide && (
            <div className="mt-2.5 pt-2 border-t border-[#ECE5DB] dark:border-[#2C3431] space-y-2 text-[11px] text-[#6C7671] dark:text-[#95A19B] leading-relaxed">
              <p>Revisa estos factores ambientales que suelen causar falsos desvíos:</p>
              <ul className="space-y-1.5 pl-1">
                {SCALE_CHECKLIST.map((item) => (
                  <li key={item.id} className="flex items-start gap-1.5">
                    <span className="text-[#52796F] font-bold">•</span>
                    <span>
                      <strong className="text-[#262B28] dark:text-[#EDE8E1]">{item.label}:</strong>{' '}
                      {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Verification History Section */}
        {scaleChecks.length > 0 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-[#52796F] dark:text-[#6B948A] font-semibold flex items-center gap-1"
            >
              <History className="w-3.5 h-3.5" />
              <span>
                {showHistory
                  ? 'Ocultar historial de verificaciones'
                  : `Ver historial de comprobaciones (${scaleChecks.length})`}
              </span>
            </button>

            {showHistory && (
              <div className="mt-3 divide-y divide-[#ECE5DB] dark:divide-[#2C3431] text-xs">
                {scaleChecks.map((check) => {
                  const coin = VERIFIED_COINS.find((c) => c.id === check.coinId);
                  const isWithin =
                    coin && Math.abs(check.deviationGrams) <= coin.toleranceGrams;
                  return (
                    <div key={check.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[#262B28] dark:text-[#EDE8E1]">
                          {coin?.name || check.coinId}
                        </div>
                        <div className="text-[11px] text-[#717C76]">
                          Lectura: {check.averageGrams} g | Desvío:{' '}
                          <span
                            className={
                              isWithin
                                ? 'text-emerald-600 font-bold'
                                : 'text-amber-600 font-bold'
                            }
                          >
                            {check.deviationGrams > 0 ? '+' : ''}
                            {check.deviationGrams} g
                          </span>
                        </div>
                        <span className="text-[10px] text-[#717C76]">
                          {formatDateRelative(check.createdAt)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeScaleCheck(check.id)}
                        className="text-gray-400 hover:text-rose-500 p-1"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
