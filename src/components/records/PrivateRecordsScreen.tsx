import React, { useState } from 'react';
import {
  Scale,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  Lock,
  Plus,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PrivateRecord } from '../../types';
import { formatDateRelative } from '../../utils/formatters';
import { ImageUploadPreview } from '../common/ImageUploadPreview';
import { PrecisionScaleTools } from './PrecisionScaleTools';

export const PrivateRecordsScreen: React.FC = () => {
  const {
    privateRecords,
    showPrivateAmounts,
    toggleShowPrivateAmounts,
    recordsSubTab,
    setRecordsSubTab,
    addOrUpdatePrivate,
    removePrivate,
    showToast,
  } = useApp();

  // Form State
  const [category, setCategory] = useState<'private' | 'other'>('private');
  const [gramsInput, setGramsInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [hideOnHome, setHideOnHome] = useState(true);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>(undefined);

  // Transfer from Tare Calculator
  const handleTransferToForm = (grams: number, note: string) => {
    setGramsInput(grams.toString());
    setNoteInput((prev) => (prev ? `${prev} | ${note}` : note));
    setRecordsSubTab('records');
    showToast('Peso copiado al formulario.', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(gramsInput.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      showToast('Ingresa un peso válido obtenido de tu balanza.', 'error');
      return;
    }

    const record: PrivateRecord = {
      id: 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      category,
      grams: Number(val.toFixed(2)),
      note: noteInput.trim() || undefined,
      imageDataUrl,
      hideAmountOnHome: hideOnHome,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addOrUpdatePrivate(record);
    setGramsInput('');
    setNoteInput('');
    setImageDataUrl(undefined);
    showToast('Registro de balanza guardado localmente.', 'success');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Subtab selector */}
      <div className="flex rounded-2xl bg-black/5 dark:bg-white/5 p-1 text-xs">
        <button
          type="button"
          onClick={() => setRecordsSubTab('records')}
          className={`flex-1 py-2 px-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
            recordsSubTab === 'records'
              ? 'bg-white dark:bg-[#1E2321] text-[#262B28] dark:text-[#EDE8E1] shadow-xs'
              : 'text-[#6C7671] dark:text-[#95A19B]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Registros</span>
        </button>

        <button
          type="button"
          onClick={() => setRecordsSubTab('tools')}
          className={`flex-1 py-2 px-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5 ${
            recordsSubTab === 'tools'
              ? 'bg-white dark:bg-[#1E2321] text-[#262B28] dark:text-[#EDE8E1] shadow-xs'
              : 'text-[#6C7671] dark:text-[#95A19B]'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Herramientas de balanza</span>
        </button>
      </div>

      {/* TAB 1: FORM & HISTORY */}
      {recordsSubTab === 'records' && (
        <div className="space-y-4">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-4"
          >
            <div>
              <h3 className="text-sm font-bold text-[#262B28] dark:text-[#EDE8E1]">
                Nuevo Registro Privado
              </h3>
              <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] mt-0.5 leading-relaxed">
                Ingresa el peso neto medido con tu balanza física externa. Los datos se almacenan exclusivamente en este dispositivo.
              </p>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1.5">
                Categoría
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('private')}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    category === 'private'
                      ? 'border-[#52796F] bg-[#52796F]/10 dark:bg-[#52796F]/20 text-[#262B28] dark:text-[#EDE8E1] font-bold'
                      : 'border-[#E5DDD2] dark:border-[#2F3734] bg-[#FAF8F5] dark:bg-[#141716] text-[#4D5752] dark:text-[#BAC4BF]'
                  }`}
                >
                  <span className="text-xs">Registro privado</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('other')}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    category === 'other'
                      ? 'border-[#52796F] bg-[#52796F]/10 dark:bg-[#52796F]/20 text-[#262B28] dark:text-[#EDE8E1] font-bold'
                      : 'border-[#E5DDD2] dark:border-[#2F3734] bg-[#FAF8F5] dark:bg-[#141716] text-[#4D5752] dark:text-[#BAC4BF]'
                  }`}
                >
                  <span className="text-xs">Otro pesaje</span>
                </button>
              </div>
            </div>

            {/* Numeric grams input */}
            <div>
              <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
                Peso neto marcado por la balanza (g) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={gramsInput}
                  onChange={(e) => setGramsInput(e.target.value)}
                  className="w-full px-3 py-2.5 pr-8 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-base font-bold text-[#262B28] dark:text-[#EDE8E1]"
                />
                <span className="absolute right-3 top-3 text-xs text-[#717C76] font-bold">g</span>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB] mb-1">
                Nota u observación privada (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Balanza calibrada, tara descontada..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#E2DAD0] dark:border-[#323936] text-xs font-medium text-[#262B28] dark:text-[#EDE8E1]"
              />
            </div>

            {/* Image upload */}
            <ImageUploadPreview
              imageDataUrl={imageDataUrl}
              onChange={setImageDataUrl}
              label="Foto del pesaje (opcional)"
              disclaimer="Se almacena únicamente de forma local en la memoria de este navegador."
            />

            {/* Privacy toggle */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={hideOnHome}
                onChange={(e) => setHideOnHome(e.target.checked)}
                className="rounded text-[#52796F] focus:ring-[#52796F] w-4 h-4"
              />
              <span className="text-xs text-[#444F4A] dark:text-[#C5D0CB]">
                Ocultar la cantidad en la pantalla de Inicio
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43645C] transition-all shadow-xs"
            >
              Guardar registro en historial
            </button>
          </form>

          {/* HISTORY SECTION */}
          <div className="rounded-3xl bg-white dark:bg-[#1E2321] p-5 shadow-xs border border-[#ECE5DB] dark:border-[#2C3431] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#262B28] dark:text-[#EDE8E1]">
                Historial privado ({privateRecords.length})
              </h4>
              <button
                type="button"
                onClick={toggleShowPrivateAmounts}
                aria-label={showPrivateAmounts ? 'Ocultar cantidades' : 'Mostrar cantidades'}
                className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5 text-[#6C7671] dark:text-[#95A19B] hover:text-[#262B28] flex items-center gap-1 text-xs"
              >
                {showPrivateAmounts ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPrivateAmounts ? 'Ocultar' : 'Mostrar'}</span>
              </button>
            </div>

            {privateRecords.length > 0 ? (
              <div className="divide-y divide-[#ECE5DB] dark:divide-[#2C3431] text-xs">
                {privateRecords.map((rec) => (
                  <div key={rec.id} className="py-3 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#262B28] dark:text-[#EDE8E1]">
                          {rec.category === 'private' ? 'Registro privado' : 'Otro pesaje'}
                        </span>
                      </div>

                      <div className="text-sm font-black text-[#E07A5F]">
                        {showPrivateAmounts ? `${rec.grams.toFixed(2)} g` : '•••• g'}
                      </div>

                      {rec.note && showPrivateAmounts && (
                        <p className="text-[11px] text-[#6C7671] dark:text-[#95A19B] leading-tight">
                          {rec.note}
                        </p>
                      )}

                      <span className="text-[10px] text-[#717C76] block">
                        {formatDateRelative(rec.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {rec.imageDataUrl && showPrivateAmounts && (
                        <img
                          src={rec.imageDataUrl}
                          alt="Referencia"
                          className="w-10 h-10 rounded-xl object-cover border border-[#ECE5DB] dark:border-[#2C3431]"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removePrivate(rec.id)}
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
                Aún no tienes registros guardados. Ingresa un pesaje arriba.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRECISION SCALE TOOLS */}
      {recordsSubTab === 'tools' && (
        <PrecisionScaleTools onTransferToForm={handleTransferToForm} />
      )}
    </div>
  );
};
