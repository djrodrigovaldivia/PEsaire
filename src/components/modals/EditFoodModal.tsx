import React, { useState, useEffect } from 'react';
import { X, Scale, Utensils, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoodRecord, FoodType } from '../../types';
import { FOOD_TYPE_CONFIG } from '../../utils/constants';
import { fromLocalDatetimeInput, toLocalDatetimeInput } from '../../utils/formatters';
import { ImageUploadPreview } from '../common/ImageUploadPreview';

export const EditFoodModal: React.FC = () => {
  const { editingFoodRecord, setEditingFoodRecord, addOrUpdateFood, showToast } = useApp();

  const [foodType, setFoodType] = useState<FoodType>('kibble');
  const [actualGrams, setActualGrams] = useState('');
  const [minGrams, setMinGrams] = useState('');
  const [maxGrams, setMaxGrams] = useState('');
  const [datetime, setDatetime] = useState(toLocalDatetimeInput());
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (editingFoodRecord) {
      setFoodType(editingFoodRecord.foodType);
      setActualGrams(
        editingFoodRecord.actualGrams !== undefined
          ? String(editingFoodRecord.actualGrams)
          : ''
      );
      setMinGrams(
        editingFoodRecord.estimatedMinGrams !== undefined
          ? String(editingFoodRecord.estimatedMinGrams)
          : ''
      );
      setMaxGrams(
        editingFoodRecord.estimatedMaxGrams !== undefined
          ? String(editingFoodRecord.estimatedMaxGrams)
          : ''
      );
      setDatetime(toLocalDatetimeInput(new Date(editingFoodRecord.createdAt)));
      setNote(editingFoodRecord.note || '');
      setPhoto(editingFoodRecord.imageDataUrl);
    }
  }, [editingFoodRecord]);

  if (!editingFoodRecord) return null;

  const isActual = editingFoodRecord.kind === 'actual';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let updatedActual: number | undefined = undefined;
    let updatedMin: number | undefined = undefined;
    let updatedMax: number | undefined = undefined;

    if (isActual) {
      const g = parseFloat(actualGrams.replace(',', '.'));
      if (isNaN(g) || g <= 0) {
        showToast('Ingresa un peso válido mayor a 0 g.', 'error');
        return;
      }
      updatedActual = Number(g.toFixed(2));
    } else {
      const min = parseInt(minGrams);
      const max = parseInt(maxGrams);
      if (isNaN(min) || isNaN(max) || min < 0 || max < min) {
        showToast('Verifica los rangos mínimo y máximo.', 'error');
        return;
      }
      updatedMin = min;
      updatedMax = max;
    }

    const updated: FoodRecord = {
      ...editingFoodRecord,
      foodType,
      actualGrams: updatedActual,
      estimatedMinGrams: updatedMin,
      estimatedMaxGrams: updatedMax,
      note: note.trim() || undefined,
      imageDataUrl: photo,
      createdAt: fromLocalDatetimeInput(datetime),
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdateFood(updated);
    showToast('Registro de comida actualizado.', 'success');
    setEditingFoodRecord(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF8F5] dark:bg-[#1E2220] p-6 text-[#262B28] dark:text-[#EDE8E1] shadow-2xl border border-[#ECE5DB] dark:border-[#323936] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#ECE5DB] dark:border-[#2C3330]">
          <h3 className="text-sm font-bold">
            Editar registro de comida ({isActual ? 'Peso real' : 'Estimación'})
          </h3>
          <button
            type="button"
            onClick={() => setEditingFoodRecord(null)}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold mb-1">Tipo de alimento</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value as FoodType)}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-[#252B28] border border-[#DDD5C9] dark:border-[#333C38]"
            >
              {(Object.keys(FOOD_TYPE_CONFIG) as FoodType[]).map((t) => (
                <option key={t} value={t}>
                  {FOOD_TYPE_CONFIG[t].label}
                </option>
              ))}
            </select>
          </div>

          {isActual ? (
            <div>
              <label className="block font-semibold mb-1">Peso real en gramos *</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                max="5000"
                required
                value={actualGrams}
                onChange={(e) => setActualGrams(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-[#252B28] border border-[#DDD5C9] dark:border-[#333C38] font-bold text-sm"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold mb-1">Mínimo (g)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={minGrams}
                  onChange={(e) => setMinGrams(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-[#252B28] border border-[#DDD5C9] dark:border-[#333C38] font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Máximo (g)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={maxGrams}
                  onChange={(e) => setMaxGrams(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white dark:bg-[#252B28] border border-[#DDD5C9] dark:border-[#333C38] font-bold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-medium mb-1">Fecha y hora</label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full p-2 rounded-xl bg-white dark:bg-[#252B28] border border-[#DDD5C9] dark:border-[#333C38]"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Nota</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 rounded-xl bg-white dark:bg-[#252B28] border border-[#DDD5C9] dark:border-[#333C38]"
            />
          </div>

          <ImageUploadPreview
            imageDataUrl={photo}
            onChange={setPhoto}
            label="Foto de referencia"
          />

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#52796F] text-white font-bold"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={() => setEditingFoodRecord(null)}
              className="py-2.5 px-4 rounded-xl bg-[#EAE5DC] dark:bg-[#2B322F]"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
