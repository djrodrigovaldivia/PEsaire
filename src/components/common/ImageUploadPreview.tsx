import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadPreviewProps {
  imageDataUrl?: string;
  onChange: (dataUrl: string | undefined) => void;
  label?: string;
  disclaimer?: string;
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  imageDataUrl,
  onChange,
  label = 'Foto de referencia local (opcional)',
  disclaimer = 'La imagen se guarda exclusivamente en la memoria de este dispositivo.',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader and downscale via canvas to keep IndexedDB compact
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.75);
          onChange(compressed);
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#444F4A] dark:text-[#C5D0CB]">
        {label}
      </label>

      {imageDataUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-[#ECE5DB] dark:border-[#2C3431] bg-black/5 aspect-video max-h-48 flex items-center justify-center">
          <img
            src={imageDataUrl}
            alt="Referencia local"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label="Eliminar foto"
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-3 px-3 rounded-2xl border border-dashed border-[#DDD5C9] dark:border-[#38423E] hover:border-[#52796F] dark:hover:border-[#6B948A] bg-white/40 dark:bg-[#1A1F1D] flex items-center justify-center gap-2 text-xs font-medium text-[#6C7671] dark:text-[#95A19B] transition-all"
          >
            <Camera className="w-4 h-4 text-[#52796F] dark:text-[#6B948A]" />
            <span>Adjuntar o tomar foto</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {disclaimer && (
        <p className="text-[10px] text-[#717C76] dark:text-[#8D9B94] leading-tight">
          {disclaimer}
        </p>
      )}
    </div>
  );
};
