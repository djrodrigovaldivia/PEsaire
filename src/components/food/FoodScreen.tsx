import React, { useState } from 'react';
import {
  Utensils,
  Scale,
  Sparkles,
  Info,
  Calendar,
  Trash2,
  CheckCircle2,
  ChevronRight,
  Cat,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  FOOD_TYPE_CONFIG,
  PORTION_SIZE_CONFIG,
  CONTAINER_TYPE_CONFIG,
} from '../../utils/constants';
import { FoodRecord, FoodType, PortionSize, ContainerType } from '../../types';
import { formatWeight, formatDateRelative } from '../../utils/formatters';
import { ImageUploadPreview } from '../common/ImageUploadPreview';
import { CatPortionPlanner } from './CatPortionPlanner';

export const FoodScreen: React.FC = () => {
  const {
    foodRecords,
    settings,
    foodSubTab,
    setFoodSubTab,
    addOrUpdateFood,
    removeFood,
    showToast,
  } = useApp();

  // Mode: estimate vs actual vs planner
  const [selectedFoodType, setSelectedFoodType] = useState<FoodType>('kibble');
  const [selectedPortionSize, setSelectedPortionSize] = useState<PortionSize>('medium');
  const [selectedContainer, setSelectedContainer] = useState<ContainerType>('normal_plate');
  const [actualWeightInput, setActualWeightInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);

  // Estimation range from settings
  const range =
    settings.estimationTable?.[selectedFoodType]?.[selectedPortionSize] || {
      min: 25,
      max: 35,
    };

  // Submit Estimation
  const handleSaveEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    const record: FoodRecord = {
      id: 'f-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      kind: 'estimate',
      foodType: selectedFoodType,
      portionSize: selectedPortionSize,
      containerType: selectedContainer,
      estimatedMinGrams: range.min,
      estimatedMaxGrams: range.max,
      note: noteInput.trim() || undefined,
      imageDataUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await addOrUpdateFood(record);
    setNoteInput('');
    setImageDataUrl(undefined);
    showToast('Estimación guardada en tu historial.', 'success');
  };

  // Submit Actual Scale weight
  const handleSaveActual = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(actualWeightInput.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      showToast('Ingresa un peso válido medido con tu balanza.', 'error');
      return;
    }
    const record: FoodRecord = {
      id: 'f-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      kind: 'actual',
      foodType: selectedFoodType,
      actualGrams: Number(val.toFixed(1)),
      note: noteInput.trim() || undefined,
      imageDataUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await addOrUpdateFood(record);
    setActualWeightInput('');
    setNoteInput('');
    setImageDataUrl(undefined);
    showToast('Peso real de balanza guardado.', 'success');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Subtab selector */}
      <div className="flex rounded-2xl bg-black/5 dark:bg-white/5 p-1 text-xs">
        <button
          type="button"
          onClick={() => setFoodSubTab('estimate')}
          className={`flex-1 py-2 px-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
            foodSubTab === 'estimate'
              ? 'bg-white dark:bg-[#1E2321] text-[#262B28] dark:text-[#EDE8E1] shadow-xs'
              : 'text-[#6C7671] dark:text-[#95A19B]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Estimar porción</span>
        </button>

        <button
          type="button"
          onClick={() => setFoodSubTab('actual')}
          className={`flex-1 py-2 px-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
            foodSubTab === 'actual'
              ? 'bg-white dark:bg-[#1E2321] text-[#262B28] dark:text-[#EDE8E1] shadow-xs'
              : 'text-[#6C7671] dark:text-[#95A19B]'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Peso real balanza</span>
        </button>

        <button
          type="button"
          onClick={() => setFoodSubTab('cat_planner')}
          className={`flex-1 py-2 px-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
            foodSubTab === 'cat_planner'
              ? 'bg-white dark:bg-[#1E2321] text-[#262B28] dark:text-[#EDE8E1] shadow-xs'
              : 'text-[#6C7671] dark:text-[#95A19B]'
          }`}
        >
          <Cat className="w-3.5 h-3.5" />
          <span>Ración felina</span>
        </button>
      </div>

      {/* MODE 1: ESTIMATE PORTION */}
      {foodSubTab === 'estimate' && (
        <form
          onSubmit={handleSaveEstimate}
          className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-4"
        >
          <div>
            <h3 className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">
              Estimación Orientativa Visual
            </h3>
            <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] mt-0.5 leading-relaxed">
              Basada en tipo de alimento y tamaño visual. Las estimaciones son orientativas y se muestran en rangos.
            </p>
          </div>

          {/* Food Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1.5">
              Tipo de alimento
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(FOOD_TYPE_CONFIG) as FoodType[]).map((key) => {
                const isSel = selectedFoodType === key;
                const conf = FOOD_TYPE_CONFIG[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedFoodType(key)}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      isSel
                        ? 'border-[#52796F] bg-[#52796F]/10 dark:bg-[#52796F]/20 text-[#262B28] dark:text-[#EDE8E1] font-bold'
                        : 'border-[#E5DDD2] dark:border-[#2F3734] bg-[#FAF8F5] dark:bg-[#141716] text-[#4D5752] dark:text-[#BAC4BF]'
                    }`}
                  >
                    <div className="text-xs">{conf.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Portion Size Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1.5">
              Tamaño visual de la porción
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {(Object.keys(PORTION_SIZE_CONFIG) as PortionSize[]).map((sizeKey) => {
                const isSel = selectedPortionSize === sizeKey;
                const conf = PORTION_SIZE_CONFIG[sizeKey];
                return (
                  <button
                    key={sizeKey}
                    type="button"
                    onClick={() => setSelectedPortionSize(sizeKey)}
                    className={`py-2 px-1 rounded-xl border text-center text-xs transition-all ${
                      isSel
                        ? 'border-[#52796F] bg-[#52796F] text-white font-bold'
                        : 'border-[#E5DDD2] dark:border-[#2F3734] bg-[#FAF8F5] dark:bg-[#141716] text-[#4D5752] dark:text-[#BAC4BF]'
                    }`}
                  >
                    {conf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Container Type */}
          <div>
            <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1.5">
              Recipiente de referencia
            </label>
            <select
              value={selectedContainer}
              onChange={(e) => setSelectedContainer(e.target.value as ContainerType)}
              className="w-full px-3 py-2 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-medium text-[#262B28] dark:text-[#EDE8E1]"
            >
              {Object.entries(CONTAINER_TYPE_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mandatory Honest Estimation Output Card */}
          <div className="p-4 rounded-2xl bg-[#52796F]/10 dark:bg-[#52796F]/20 border border-[#52796F]/30 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-[#52796F] dark:text-[#6B948A] uppercase tracking-wider">
                Estimación:
              </span>
              <span className="text-2xl font-black text-[#262B28] dark:text-[#EDE8E1]">
                {range.min}–{range.max} g
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-[#6C7671] dark:text-[#95A19B] pt-1 border-t border-[#52796F]/20">
              <span>Confianza:</span>
              <span className="font-semibold text-amber-700 dark:text-amber-400">Baja</span>
            </div>

            <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] leading-relaxed italic">
              Confirma el peso con una balanza física antes de tomar decisiones importantes.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setFoodSubTab('actual')}
                className="text-xs text-[#52796F] dark:text-[#6B948A] font-semibold underline"
              >
                Tengo el peso real de balanza →
              </button>
            </div>
          </div>

          {/* Optional Note & Image */}
          <div>
            <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
              Notas u observaciones (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Desayuno, plato hondo..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-medium text-[#262B28] dark:text-[#EDE8E1]"
            />
          </div>

          <ImageUploadPreview
            imageDataUrl={imageDataUrl}
            onChange={setImageDataUrl}
            label="Foto del plato (opcional)"
            disclaimer="La cámara sirve solo para guardar una referencia visual en este dispositivo. No pesa."
          />

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43645C] transition-all shadow-xs"
          >
            Guardar estimación en historial
          </button>
        </form>
      )}

      {/* MODE 2: ACTUAL SCALE WEIGHT */}
      {foodSubTab === 'actual' && (
        <form
          onSubmit={handleSaveActual}
          className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-4"
        >
          <div>
            <h3 className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">
              Registrar Peso Real de Balanza
            </h3>
            <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] mt-0.5">
              Ingresa el peso exacto que marca tu balanza de cocina física tras descontar la tara.
            </p>
          </div>

          {/* Food Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1.5">
              Tipo de alimento
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(FOOD_TYPE_CONFIG) as FoodType[]).map((key) => {
                const isSel = selectedFoodType === key;
                const conf = FOOD_TYPE_CONFIG[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedFoodType(key)}
                    className={`p-2.5 rounded-2xl border text-left transition-all ${
                      isSel
                        ? 'border-[#52796F] bg-[#52796F]/10 dark:bg-[#52796F]/20 text-[#262B28] dark:text-[#EDE8E1] font-bold'
                        : 'border-[#E5DDD2] dark:border-[#2F3734] bg-[#FAF8F5] dark:bg-[#141716] text-[#4D5752] dark:text-[#BAC4BF]'
                    }`}
                  >
                    <div className="text-xs">{conf.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real weight input */}
          <div>
            <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
              Peso en balanza (g) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                required
                placeholder="Ej. 35.0"
                value={actualWeightInput}
                onChange={(e) => setActualWeightInput(e.target.value)}
                className="w-full px-3 py-2.5 pr-8 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-base font-bold text-[#262B28] dark:text-[#EDE8E1]"
              />
              <span className="absolute right-3 top-3 text-xs text-[#717C76] font-bold">g</span>
            </div>
          </div>

          {/* Note & Image */}
          <div>
            <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
              Notas u observaciones (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Desayuno pesado con balanza"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-medium text-[#262B28] dark:text-[#EDE8E1]"
            />
          </div>

          <ImageUploadPreview
            imageDataUrl={imageDataUrl}
            onChange={setImageDataUrl}
            label="Foto de referencia (opcional)"
            disclaimer="Guarda una foto del pesaje solo en este dispositivo."
          />

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43645C] transition-all shadow-xs"
          >
            Guardar peso real de balanza
          </button>
        </form>
      )}

      {/* MODE 3: CAT PORTION PLANNER */}
      {foodSubTab === 'cat_planner' && <CatPortionPlanner />}

      {/* FOOD HISTORY LIST */}
      <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#262B28] dark:text-[#EDE8E1]">
          Historial de comidas ({foodRecords.length})
        </h4>

        {foodRecords.length > 0 ? (
          <div className="divide-y divide-[#ECE5DB] dark:divide-[#2C3431] text-xs">
            {foodRecords.map((rec) => (
              <div key={rec.id} className="py-3 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#262B28] dark:text-[#EDE8E1]">
                      {FOOD_TYPE_CONFIG[rec.foodType]?.label || 'Comida'}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        rec.kind === 'actual'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {rec.kind === 'actual' ? 'Balanza' : 'Estimado'}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#52796F] dark:text-[#6B948A]">
                    {rec.kind === 'actual' && rec.actualGrams !== undefined
                      ? `${rec.actualGrams} g`
                      : `${rec.estimatedMinGrams}–${rec.estimatedMaxGrams} g`}
                  </div>

                  {rec.note && (
                    <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] leading-tight">
                      {rec.note}
                    </p>
                  )}

                  <span className="text-[10px] text-[#717C76] block">
                    {formatDateRelative(rec.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {rec.imageDataUrl && (
                    <img
                      src={rec.imageDataUrl}
                      alt="Foto de referencia"
                      className="w-10 h-10 rounded-xl object-cover border border-[#ECE5DB] dark:border-[#2C3431]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFood(rec.id)}
                    aria-label="Eliminar entrada"
                    className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-[#6C7671] dark:text-[#95A19B]">
            Aún no hay registros de comida. Guarda una estimación o peso real arriba.
          </div>
        )}
      </div>
    </div>
  );
};
