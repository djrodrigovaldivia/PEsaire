import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  Utensils,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OnboardingModal: React.FC = () => {
  const { onboardingOpen, completeOnboarding } = useApp();
  const [step, setStep] = useState(0);

  if (!onboardingOpen) return null;

  const slides = [
    {
      icon: Scale,
      title: 'Bienvenido a Peso Claro',
      subtitle: 'Estimaciones claras, registros reales',
      description:
        'Esta aplicación no afirma que tu teléfono o tu cámara pesan. Toda cifra real de gramos proviene de una balanza física externa. Aquí organizas, calculas taras y llevas tu control.',
      badge: 'Principio de honestidad',
    },
    {
      icon: Utensils,
      title: 'Comida felina y registro privado',
      subtitle: 'Herramientas orientativas y precisas',
      description:
        'Estima porciones de comida para tu gata en rangos orientativos, calcula raciones diarias (2–4% del peso corporal) y guarda pesajes de balanza en un historial completamente privado.',
      badge: 'Orientativo y Práctico',
    },
    {
      icon: ShieldCheck,
      title: 'Privado, local y offline',
      subtitle: 'Tus datos nunca salen de este dispositivo',
      description:
        'Toda la información se guarda únicamente en la memoria IndexedDB de tu navegador. Sin cuentas, sin servidores y sin telemetría. Puedes instalarla como PWA en tu pantalla de inicio.',
      badge: '100% Local',
    },
  ];

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div className="bg-[#FAF8F5] dark:bg-[#1E2321] rounded-3xl max-w-sm w-full p-6 border border-[#ECE5DB] dark:border-[#2C3431] shadow-2xl flex flex-col justify-between min-h-[420px]">
        <div className="space-y-4">
          {/* Step dots */}
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-[#52796F] dark:text-[#6B948A] uppercase tracking-wider">
              {currentSlide.badge}
            </span>
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step
                      ? 'w-6 bg-[#52796F]'
                      : 'w-1.5 bg-[#DDD5C9] dark:bg-[#38423E]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Icon */}
          <div className="w-14 h-14 rounded-3xl bg-[#52796F]/15 text-[#52796F] dark:text-[#6B948A] flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>

          {/* Texts */}
          <div>
            <h2 className="text-lg font-bold text-[#262B28] dark:text-[#EDE8E1] tracking-tight">
              {currentSlide.title}
            </h2>
            <p className="text-xs font-semibold text-[#52796F] dark:text-[#6B948A] mt-0.5">
              {currentSlide.subtitle}
            </p>
            <p className="text-xs text-[#6C7671] dark:text-[#95A19B] mt-3 leading-relaxed">
              {currentSlide.description}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-4">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3 px-4 rounded-2xl bg-[#52796F] text-white text-xs font-bold hover:bg-[#43645C] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span>{step === slides.length - 1 ? 'Comenzar a usar la app' : 'Siguiente'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {step === slides.length - 1 && (
            <button
              type="button"
              onClick={() => completeOnboarding(true)}
              className="w-full py-2 text-center text-xs text-[#52796F] dark:text-[#6B948A] font-semibold underline"
            >
              Comenzar con datos de ejemplo
            </button>
          )}

          {step < slides.length - 1 && (
            <button
              type="button"
              onClick={() => completeOnboarding(false)}
              className="w-full py-1 text-center text-[11px] text-[#717C76]"
            >
              Saltar introducción
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
