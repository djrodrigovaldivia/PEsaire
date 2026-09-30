export const GRAMS_PER_OUNCE = 28.349523125;

export function formatWeight(
  grams: number,
  showOunces = false,
  decimalPlaces = 2
): string {
  if (isNaN(grams)) return '--';
  const gStr = Number(grams.toFixed(decimalPlaces)).toLocaleString('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
  });

  if (showOunces) {
    const oz = (grams / GRAMS_PER_OUNCE).toFixed(2);
    return `${gStr} g (${oz} oz)`;
  }
  return `${gStr} g`;
}

export function formatRange(
  min: number,
  max: number,
  showOunces = false
): string {
  const minG = Math.round(min);
  const maxG = Math.round(max);

  if (!showOunces) {
    return `${minG}–${maxG} g`;
  }

  const minOz = (min / GRAMS_PER_OUNCE).toFixed(1);
  const maxOz = (max / GRAMS_PER_OUNCE).toFixed(1);
  return `${minG}–${maxG} g (${minOz}–${maxOz} oz)`;
}

export function formatDisplayDate(isoString: string): string {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const timeStr = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (isToday) return `Hoy, ${timeStr}`;
    if (isYesterday) return `Ayer, ${timeStr}`;

    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export const formatDateRelative = formatDisplayDate;

export function toLocalDatetimeInput(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
}

export function fromLocalDatetimeInput(localDatetimeStr: string): string {
  try {
    const d = new Date(localDatetimeStr);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  } catch {
    return new Date().toISOString();
  }
}
