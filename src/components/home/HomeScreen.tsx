import React from 'react';
import {
  Utensils,
  Scale,
  Coins,
  Eye,
  EyeOff,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatWeight, formatDateRelative } from '../../utils/formatters';
import { FOOD_TYPE_CONFIG } from '../../utils/constants';

export const HomeScreen: React.FC = () => {
  const {
    foodRecords,
    privateRecords,
    settings,
    setActiveTab,
    setFoodSubTab,
    setRecordsSubTab,
    showPrivateAmounts,
    toggleShowPrivateAmounts,
    setIsQuickActionModalOpen,
  } = useApp();

  // Last food record
  const lastFood = foodRecords[0];

  // Last private record
  const lastPrivate = privateRecords[0];

  // Records past 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentFoods = foodRecords.filter((r) => new Date(r.createdAt) >= sevenDaysAgo);
  const recentPrivates = privateRecords.filter((r) => new Date(r.createdAt) >= sevenDaysAgo);

  const actualFoodsWithWeight = recentFoods.filter(
    (r) => r.kind === 'actual' && typeof r.actualGrams === 'number'
  );
  const avgFoodGrams =
    actualFoodsWithWeight.length > 0
      ? actualFoodsWithWeight.reduce((acc, curr) => acc + (curr.actualGrams || 0), 0) /
        actualFoodsWithWeight.length
      : null;

  return (
    <div className="space-y-4 pb-20">
      {/* Welcome & Context Banner */}
      <div className="p-4 rounded-3xl bg-linear-to-br from-[#52796F]/15 via-[#52796F]/5 to-transparent border border-[#52796F]/20 dark:border-[#52796F]/30 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#52796F] dark:text-[#6B948A] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Privado y Offline
          </span>
          <span className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
            Almacenamiento local
          </span>
        </div>
        <h2 className="text-lg font-bold text-[#262B28] dark:text-[#EAE6DF] tracking-tight">
          Estimaciones claras, registros reales
        </h2>
        <p className="text-xs text-[#6C7671] dark:text-[#95A19B] leading-relaxed">
          Toda cifra real proviene de tu balanza física. Usa esta app para calcular taras, verificar la balanza y organizar tu historial privado.
        </p>
      </div>

      {/* Quick Action Trigger */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => {
            setFoodSubTab('estimate');
            setActiveTab('food');
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2321] border border-[#ECE5DB] dark:border-[#2C3431] shadow-2xs hover:border-[#52796F] transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#52796F]/10 text-[#52796F] dark:text-[#6B948A] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#262B28] dark:text-[#EDE8E1] block">
              Comida de gato
            </span>
            <span className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
              Estimar o ración diaria
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setRecordsSubTab('records');
            setActiveTab('records');
          }}
          className="p-3.5 rounded-2xl bg-white dark:bg-[#1E2321] border border-[#ECE5DB] dark:border-[#2C3431] shadow-2xs hover:border-[#52796F] transition-all text-left flex flex-col justify-between group"
        >
          <div className="w-8 h-8 rounded-xl bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#262B28] dark:text-[#EDE8E1] block">
              Registro privado
            </span>
            <span className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
              Balanza, tara y control
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setRecordsSubTab('tools');
            setActiveTab('records');
          }}
          className="col-span-2 p-3.5 rounded-2xl bg-white dark:bg-[#1E2321] border border-[#ECE5DB] dark:border-[#2C3431] shadow-2xs hover:border-[#52796F] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-[#262B28] dark:text-[#EDE8E1] block">
                Verificar balanza con monedas
              </span>
              <span className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
                Comprueba si tu balanza requiere recalibración ($100, $500, US...)
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#6C7671] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Card 1: Comida de mi Gata */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E2321] border border-[#ECE5DB] dark:border-[#2C3431] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#52796F]/10 text-[#52796F] dark:text-[#6B948A] flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#262B28] dark:text-[#EDE8E1]">
                Comida de {settings.catProfile?.name || 'mi gata'}
              </h3>
              <span className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
                Última porción anotada
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('food')}
            className="text-xs text-[#52796F] dark:text-[#6B948A] font-semibold flex items-center gap-0.5"
          >
            Ver más <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {lastFood ? (
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230] space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-[#262B28] dark:text-[#EDE8E1]">
                {FOOD_TYPE_CONFIG[lastFood.foodType]?.label || 'Alimento'}
              </span>
              <span className="text-xs font-bold text-[#52796F] dark:text-[#6B948A]">
                {lastFood.kind === 'actual' && lastFood.actualGrams
                  ? `${lastFood.actualGrams} g (balanza)`
                  : `${lastFood.estimatedMinGrams}–${lastFood.estimatedMaxGrams} g (estimado)`}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-[#6C7671] dark:text-[#95A19B]">
              <span>{formatDateRelative(lastFood.createdAt)}</span>
              {lastFood.note && <span className="truncate max-w-[160px]">{lastFood.note}</span>}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] text-center text-xs text-[#6C7671] dark:text-[#95A19B]">
            No hay registros de comida recientes. Pulsa «Comida» para estimar o registrar una porción.
          </div>
        )}
      </div>

      {/* Card 2: Registro Privado */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#1E2321] border border-[#ECE5DB] dark:border-[#2C3431] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#262B28] dark:text-[#EDE8E1]">
                Registro privado
              </h3>
              <span className="text-[11px] text-[#6C7671] dark:text-[#95A19B]">
                Pesajes reales de balanza
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleShowPrivateAmounts}
              aria-label={showPrivateAmounts ? 'Ocultar cantidades' : 'Mostrar cantidades'}
              className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5 text-[#6C7671] dark:text-[#95A19B] hover:text-[#262B28] transition-colors"
            >
              {showPrivateAmounts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('records')}
              className="text-xs text-[#52796F] dark:text-[#6B948A] font-semibold flex items-center gap-0.5"
            >
              Abrir <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {lastPrivate ? (
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] border border-[#EDE7DD] dark:border-[#2C3230] space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-[#262B28] dark:text-[#EDE8E1]">
                Entrada reciente
              </span>
              <span className="text-xs font-bold text-[#E07A5F]">
                {showPrivateAmounts ? `${lastPrivate.grams.toFixed(2)} g` : '•••• g'}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-[#6C7671] dark:text-[#95A19B]">
              <span>{formatDateRelative(lastPrivate.createdAt)}</span>
              {lastPrivate.note && showPrivateAmounts && (
                <span className="truncate max-w-[160px]">{lastPrivate.note}</span>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716] text-center text-xs text-[#6C7671] dark:text-[#95A19B]">
            No hay registros de balanza guardados aún.
          </div>
        )}
      </div>

      {/* Resumen semanal */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1E2321] border border-[#ECE5DB] dark:border-[#2C3431] shadow-xs space-y-2.5">
        <h4 className="text-xs font-bold text-[#262B28] dark:text-[#EDE8E1] uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#52796F]" />
          Actividad en los últimos 7 días
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716]">
            <span className="text-[10px] text-[#717C76] block">Comidas</span>
            <span className="font-bold text-[#262B28] dark:text-[#EDE8E1]">
              {recentFoods.length}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716]">
            <span className="text-[10px] text-[#717C76] block">Prom. porción</span>
            <span className="font-bold text-[#262B28] dark:text-[#EDE8E1]">
              {avgFoodGrams !== null ? `${Math.round(avgFoodGrams)} g` : '—'}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#FAF8F5] dark:bg-[#141716]">
            <span className="text-[10px] text-[#717C76] block">Reg. privados</span>
            <span className="font-bold text-[#262B28] dark:text-[#EDE8E1]">
              {recentPrivates.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
