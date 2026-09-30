import React, { useState, useEffect } from 'react';
import { X, Scale, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrivateRecord } from '../../types';
import { fromLocalDatetimeInput, toLocalDatetimeInput } from '../../utils/formatters';
import { ImageUploadPreview } from '../common/ImageUploadPreview';

export const EditPrivateModal: React.FC = () => {
  const { editingPrivateRecord, setEditingPrivateRecord, addOrUpdatePrivate, showToast } =
    useApp();

  const [category, setCategory] = useState<'private' | 'other'>('private');
  const [grams, setGrams] = useState('');
  const [datetime, setDatetime] = useState(toLocalDatetimeInput());
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [hideAmountOnHome, setHideAmountOnHome] = useState(true);

  useEffect(() => {
    if (editingPrivateRecord) {
      setCategory(editingPrivateRecord.category);
      setGrams(String(editingPrivateRecord.grams));
      setDatetime(toLocalDatetimeInput(new Date(editingPrivateRecord.createdAt)));
      setNote(editingPrivateRecord.note || '');
      setPhoto(editingPrivateRecord.imageDataUrl);
      setHideAmountOnHome(editingPrivateRecord.hideAmountOnHome);
    }
  }, [editingPrivateRecord]);

  if (!editingPrivateRecord) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const g = parseFloat(grams.replace(',', '.'));

    if (isNaN(g) || g <= 0) {
      showToast('Ingresa un peso válido mayor a 0 g.', 'error');
      return;
    }

    const updated: PrivateRecord = {
      ...editingPrivateRecord,
      category,
      grams: Number(g.toFixed(2)),
      note: note.trim() || undefined,
      imageDataUrl: photo,
      hideAmountOnHome,
      createdAt: fromLocalDatetimeInput(datetime),
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdatePrivate(updated);
    showToast('Medición de balanza actualizada.', 'success');
    setEditingPrivateRecord(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
    >
      <div className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF8F5] dark:bg-[#1E2220] p-6 text-[#262B28] dark:text-[#EDE8E1] shadow-2xl border border-[#ECE5DB] dark:border-[#323936] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#ECE5DB] dark:border-[#2C3330]">
          <h3 className="text-sm font-bold">Editar pesaje en balanza</h3>
          <button
            type="button"
            onClick={() => setEditingPrivateRecord(null)}
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold mb-1">Categoría</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('private')}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  category === 'private'
                    ? 'border-[#52796F] bg-[#52796F]/10 dark:bg-[#52796F]/20 text-[#52796F] font-bold'
                    : 'border-[#DDD5C9] dark:border-[#333C38]'
                }`}
              >
                Registro privado
              </button>
              <button
                type="button"
                onClick={() => setCategory('other')}
                className={`py-2 px-3 rounded-xl border text-center transition-all ${
                  category === 'other'
                    ? 'border-[#52796F] bg-[#52796F]/10 dark:bg-[#52796F]/20 text-[#52796F] font-bold'
                    : 'border-[#DDD5C9] dark:border-[#333C38]'
                }`}
              >
                Otro pesaje
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Peso en gramos (g) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="10000"
              required
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white dark:bg-[#252B28] border border-[#DDD5C9] dark:border-[#333C38] font-bold text-sm"
            />
          </div>

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
            <label className="block font-medium mb-1">Nota privada</label>
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

          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#252B28] border border-[#DDD5C9] dark:border-[#333C38]">
            <span className="font-semibold text-[11px]">Ocultar cantidad en Inicio</span>
            <button
              type="button"
              role="switch"
              aria-checked={hideAmountOnHome}
              onClick={() => setHideAmountOnHome((prev) => !prev)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                hideAmountOnHome ? 'bg-[#52796F]' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                  hideAmountOnHome ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#52796F] text-white font-bold"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              onClick={() => setEditingPrivateRecord(null)}
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
