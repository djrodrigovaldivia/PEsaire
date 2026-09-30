import React, { useState } from 'react';
import {
  Cat,
  Scale,
  Droplets,
  TrendingUp,
  Trash2,
  AlertTriangle,
  Info,
  PlusCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CatProfile, CatWeightEntry, FoodRecord } from '../../types';

export const CatPortionPlanner: React.FC = () => {
  const {
    settings,
    catWeights,
    updateSettings,
    addOrUpdateFood,
    addCatWeight,
    removeCatWeight,
    showToast,
  } = useApp();

  const profile: CatProfile = settings.catProfile || {
    name: 'Mi Gata',
    weightKg: 4.0,
    activityFactor: 1.2,
    mealsPerDay: 2,
    dietNotes: '',
  };

  const [name, setName] = useState(profile.name);
  const [weightKg, setWeightKg] = useState(profile.weightKg.toString());
  const [mealsPerDay, setMealsPerDay] = useState(profile.mealsPerDay || 2);
  const [dietNotes, setDietNotes] = useState(profile.dietNotes || '');

  // Subsections
  const [showWeightLog, setShowWeightLog] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState('');
  const [newWeightNote, setNewWeightNote] = useState('');

  // Water check
  const [showWaterCheck, setShowWaterCheck] = useState(false);
  const [waterVolumeMl, setWaterVolumeMl] = useState('50');
  const [waterScaleReadingGrams, setWaterScaleReadingGrams] = useState('');

  // Educational breakdown open/close
  const [showBreakdown, setShowBreakdown] = useState(false);

  // ----------------------------------------------------
  // CALCULATIONS: 2% to 4% Body Weight (Adult Healthy Cat)
  // ----------------------------------------------------
  const numWeight = parseFloat(weightKg.replace(',', '.')) || 4.0;
  const safeWeight = Math.max(0.5, Math.min(25, numWeight));

  const minDailyGrams = Math.round(safeWeight * 20); // 2%
  const maxDailyGrams = Math.round(safeWeight * 40); // 4%

  const safeMeals = Math.max(1, Math.min(6, mealsPerDay));
  const minPerMealGrams = Math.round(minDailyGrams / safeMeals);
  const maxPerMealGrams = Math.round(maxDailyGrams / safeMeals);

  // Educational breakdown references based on middle of range
  const midDailyGrams = Math.round((minDailyGrams + maxDailyGrams) / 2);
  const muscleGrams = Math.round(midDailyGrams * 0.8);
  const boneGrams = Math.round(midDailyGrams * 0.1);
  const organGrams = Math.round(midDailyGrams * 0.1);

  // Save profile
  const handleSaveProfile = async () => {
    const updated: CatProfile = {
      name: name.trim() || 'Mi Gata',
      weightKg: safeWeight,
      activityFactor: 1.2,
      mealsPerDay: safeMeals,
      dietNotes: dietNotes.trim(),
    };
    await updateSettings({ catProfile: updated });
    showToast(`Perfil de ${updated.name} guardado.`, 'success');
  };

  // Quick log meal
  const handleLogMeal = async (grams: number) => {
    const record: FoodRecord = {
      id: 'f-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      kind: 'actual',
      foodType: 'meat',
      actualGrams: grams,
      note: `Ración para ${name} (${safeMeals} tomas/día)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await addOrUpdateFood(record);
    showToast(`Ración de ${grams} g registrada en el historial.`, 'success');
  };

  // Add cat weight entry
  const handleAddWeightEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newWeightInput.replace(',', '.'));
    if (isNaN(w) || w <= 0 || w > 30) {
      showToast('Ingresa un peso corporal válido en kg.', 'error');
      return;
    }
    const entry: CatWeightEntry = {
      id: 'cw-' + Date.now().toString(36),
      weightKg: Number(w.toFixed(2)),
      note: newWeightNote.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    await addCatWeight(entry);
    setWeightKg(w.toFixed(2));
    setNewWeightInput('');
    setNewWeightNote('');
    showToast(`Peso corporal de ${w.toFixed(2)} kg guardado.`, 'success');
  };

  // Water check evaluation
  const targetWater = parseFloat(waterVolumeMl.replace(',', '.')) || 0;
  const readWater = parseFloat(waterScaleReadingGrams.replace(',', '.'));
  const hasWaterReading = !isNaN(readWater) && targetWater > 0;
  const waterDiff = hasWaterReading ? readWater - targetWater : null;

  return (
    <div className="space-y-4">
      {/* Cat Profile & Orientative Daily Range */}
      <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#52796F]/15 text-[#52796F] dark:text-[#6B948A] flex items-center justify-center shrink-0">
            <Cat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">
              Ración Diaria Orientativa para Gatos
            </h3>
            <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] mt-0.5 leading-relaxed">
              En gatos adultos sanos, la ración diaria orientativa suele situarse entre el{' '}
              <strong>2% y el 4%</strong> de su peso corporal, repartida en varias tomas.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
              Nombre de tu gata
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Luna"
              className="w-full px-3 py-2 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-medium text-[#262B28] dark:text-[#EDE8E1]"
            />
          </div>

          {/* Weight */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB]">
                Peso de tu gata (kg)
              </label>
              <button
                type="button"
                onClick={() => setShowWeightLog(!showWeightLog)}
                className="text-[10px] text-[#52796F] dark:text-[#6B948A] font-semibold underline flex items-center gap-1"
              >
                <TrendingUp className="w-3 h-3" />
                Historial
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="25"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="4.0"
                className="w-full px-3 py-2 pr-8 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-bold text-[#262B28] dark:text-[#EDE8E1]"
              />
              <span className="absolute right-3 top-2 text-xs text-[#717C76]">kg</span>
            </div>
          </div>

          {/* Meals per day */}
          <div>
            <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
              Tomas al día
            </label>
            <select
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-medium text-[#262B28] dark:text-[#EDE8E1]"
            >
              <option value={1}>1 toma diaria</option>
              <option value={2}>2 tomas diarias (habitual)</option>
              <option value={3}>3 tomas diarias</option>
              <option value={4}>4 tomas diarias</option>
            </select>
          </div>
        </div>

        {/* Calculated Result Card */}
        <div className="p-4 rounded-2xl bg-[#52796F]/10 dark:bg-[#52796F]/20 border border-[#52796F]/25 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-bold text-[#52796F] dark:text-[#6B948A] uppercase tracking-wider">
              Rango diario orientativo (2–4%):
            </span>
            <span className="text-lg font-extrabold text-[#262B28] dark:text-[#EDE8E1]">
              {minDailyGrams}–{maxDailyGrams} g/día
            </span>
          </div>

          <div className="flex items-baseline justify-between text-xs pt-1 border-t border-[#52796F]/20">
            <span className="text-[#6C7671] dark:text-[#95A19B]">
              Por toma ({safeMeals} {safeMeals === 1 ? 'toma' : 'tomas'}):
            </span>
            <span className="font-bold text-[#262B28] dark:text-[#EDE8E1]">
              {minPerMealGrams}–{maxPerMealGrams} g por toma
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleSaveProfile}
              className="flex-1 py-2 px-3 rounded-xl bg-[#52796F] text-white text-xs font-semibold hover:bg-[#43645C] transition-all"
            >
              Guardar perfil
            </button>
            <button
              type="button"
              onClick={() => handleLogMeal(Math.round((minPerMealGrams + maxPerMealGrams) / 2))}
              className="py-2 px-3 rounded-xl bg-white dark:bg-[#202523] border border-[#DDD5C9] dark:border-[#38423E] text-xs font-semibold text-[#262B28] dark:text-[#EDE8E1] hover:bg-black/5 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#52796F]" />
              <span>Pesar y registrar ración</span>
            </button>
          </div>
        </div>
      </div>

      {/* Standard Educational Breakdown (Non-prescriptive) */}
      <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#52796F]" />
            <h4 className="text-xs font-bold text-[#262B28] dark:text-[#EDE8E1]">
              Desglose Orientativo Estándar
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs text-[#52796F] dark:text-[#6B948A] font-semibold flex items-center gap-1"
          >
            {showBreakdown ? 'Ocultar' : 'Ver proporciones'}
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Mandatory warning text required by specifications */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>Aviso importante:</strong> Esta distribución es orientativa. Consulta con un veterinario o nutricionista felino antes de cambiar la dieta de tu gata. No formules dietas caseras sin asesoría profesional: las deficiencias de taurina, calcio y vitaminas son graves en gatos.
        </div>

        {showBreakdown && (
          <div className="pt-2 space-y-2 text-xs">
            <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
              Proporciones habituales de referencia educativa en modelos de alimentación cárnica (ejemplo para ~{midDailyGrams} g/día en gato de {safeWeight} kg):
            </p>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230]">
                <span className="text-[10px] text-[#717C76] block">Carne muscular</span>
                <span className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">~80%</span>
                <span className="text-[10px] text-[#52796F] block mt-0.5">~{muscleGrams} g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230]">
                <span className="text-[10px] text-[#717C76] block">Hueso carnoso</span>
                <span className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">~10%</span>
                <span className="text-[10px] text-[#52796F] block mt-0.5">~{boneGrams} g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230]">
                <span className="text-[10px] text-[#717C76] block">Vísceras</span>
                <span className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">~10%</span>
                <span className="text-[10px] text-[#52796F] block mt-0.5">~{organGrams} g</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Water verification for kitchen scale */}
      <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#262B28] dark:text-[#EDE8E1]">
                Verificación con Agua para Balanza de Cocina
              </h4>
              <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
                1 ml de agua a temperatura ambiente equivale aproximadamente a 1 g
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowWaterCheck(!showWaterCheck)}
            className="text-xs text-[#52796F] dark:text-[#6B948A] font-semibold"
          >
            {showWaterCheck ? 'Ocultar' : 'Comprobar'}
          </button>
        </div>

        <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] leading-relaxed">
          1 ml de agua a temperatura ambiente equivale aproximadamente a 1 g. Puedes usar una jeringa o vaso medidor para verificar la linealidad de tu balanza de cocina.
        </p>

        {showWaterCheck && (
          <div className="mt-3 pt-3 border-t border-[#ECE5DB] dark:border-[#2C3431] space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
                  Volumen medido (ml)
                </label>
                <input
                  type="number"
                  step="1"
                  value={waterVolumeMl}
                  onChange={(e) => setWaterVolumeMl(e.target.value)}
                  placeholder="50"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-bold text-[#262B28] dark:text-[#EDE8E1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
                  Peso en balanza (g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={waterScaleReadingGrams}
                  onChange={(e) => setWaterScaleReadingGrams(e.target.value)}
                  placeholder="Ej. 50.1"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-bold text-[#262B28] dark:text-[#EDE8E1]"
                />
              </div>
            </div>

            {hasWaterReading && waterDiff !== null && (
              <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230] space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-[#6C7671]">Diferencia con el valor teórico (1 ml = 1 g):</span>
                  <span className={`font-bold ${Math.abs(waterDiff) <= 1 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {waterDiff > 0 ? '+' : ''}{waterDiff.toFixed(1)} g
                  </span>
                </div>
                <p className="text-[10px] text-[#717C76] leading-snug">
                  {Math.abs(waterDiff) <= 1
                    ? 'Lectura consistente con la referencia de agua dentro de la incertidumbre del vaso medidor.'
                    : 'Diferencia detectable. Recuerda que la tensión superficial y las marcas de vasos graduados tienen su propio margen de error.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CAT BODY WEIGHT LOG */}
      {showWeightLog && (
        <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#ECE5DB] dark:border-[#2C3431]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#262B28] dark:text-[#EDE8E1] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#52796F]" />
              Evolución del Peso Corporal de {name}
            </h4>
            <button
              type="button"
              onClick={() => setShowWeightLog(false)}
              className="text-xs text-[#717C76]"
            >
              Cerrar
            </button>
          </div>

          <form onSubmit={handleAddWeightEntry} className="flex gap-2">
            <input
              type="number"
              step="0.05"
              min="0.5"
              max="25"
              required
              placeholder="Peso kg (ej. 4.10)"
              value={newWeightInput}
              onChange={(e) => setNewWeightInput(e.target.value)}
              className="w-28 px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border text-xs font-bold"
            />
            <input
              type="text"
              placeholder="Nota (opcional)"
              value={newWeightNote}
              onChange={(e) => setNewWeightNote(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[#FAF8F5] dark:bg-[#141716] border text-xs"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43645C]"
            >
              Añadir
            </button>
          </form>

          {catWeights.length > 0 && (
            <div className="divide-y divide-[#ECE5DB] dark:divide-[#2C3431] text-xs">
              {catWeights.map((w) => (
                <div key={w.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#262B28] dark:text-[#EDE8E1] mr-2">
                      {w.weightKg.toFixed(2)} kg
                    </span>
                    <span className="text-[11px] text-[#717C76]">
                      {new Date(w.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {w.note && (
                      <span className="text-[11px] text-[#6C7671] block">{w.note}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCatWeight(w.id)}
                    className="text-gray-400 hover:text-rose-500 p-1"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
