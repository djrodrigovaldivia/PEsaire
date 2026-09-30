export interface StandardCoinVariant {
  id: string;
  country: string;
  currency: string;
  name: string;
  variantNote: string;
  nominalWeightGrams: number;
  toleranceGrams: number;
  source: string;
  sourceUrl?: string;
  precisionCaveat?: string;
}

export const VERIFIED_COINS: StandardCoinVariant[] = [
  // ESTADOS UNIDOS
  {
    id: 'us_nickel',
    country: 'EE.UU.',
    currency: 'USD',
    name: '5¢ Nickel (Jefferson)',
    variantNote: 'Cuproníquel (1938–presente). Peso nominal legal 5,000 g.',
    nominalWeightGrams: 5.0,
    toleranceGrams: 0.194,
    source: 'United States Mint (usmint.gov)',
    sourceUrl: 'https://www.usmint.gov/learn/coin-and-medal-programs/coin-specifications',
    precisionCaveat:
      'Tolerancia legal legal de la US Mint: ±0,194 g (peso legal válido 4,806–5,194 g). Como referencia para balanzas de precisión es de baja exactitud.',
  },
  {
    id: 'us_penny_zinc',
    country: 'EE.UU.',
    currency: 'USD',
    name: '1¢ Penny (1982 o posterior, núcleo de zinc)',
    variantNote: 'Composición: 97,5% zinc recubierto de cobre. Acuñadas desde mediados de 1982.',
    nominalWeightGrams: 2.5,
    toleranceGrams: 0.1,
    source: 'United States Mint (usmint.gov)',
    sourceUrl: 'https://www.usmint.gov/learn/coin-and-medal-programs/coin-specifications',
    precisionCaveat: 'Verifica el año: si es anterior a 1982 (cobre puro), su peso es de 3,11 g.',
  },
  {
    id: 'us_penny_copper',
    country: 'EE.UU.',
    currency: 'USD',
    name: '1¢ Penny (anterior a 1982, aleación de cobre)',
    variantNote: 'Composición: 95% cobre, 5% zinc. Acuñadas antes de 1982.',
    nominalWeightGrams: 3.11,
    toleranceGrams: 0.13,
    source: 'United States Mint (usmint.gov)',
    sourceUrl: 'https://www.usmint.gov/learn/coin-and-medal-programs/coin-specifications',
  },

  // UNIÓN EUROPEA
  {
    id: 'euro_1',
    country: 'Eurozona',
    currency: 'EUR',
    name: '1 Euro (€1 bimetálica)',
    variantNote: 'Centro de cuproníquel, anillo de latón de níquel.',
    nominalWeightGrams: 7.5,
    toleranceGrams: 0.2,
    source: 'Banco Central Europeo (ecb.europa.eu)',
    sourceUrl: 'https://www.ecb.europa.eu/euro/coins/html/index.es.html',
  },
  {
    id: 'euro_2',
    country: 'Eurozona',
    currency: 'EUR',
    name: '2 Euros (€2 bimetálica)',
    variantNote: 'Centro de latón de níquel, anillo de cuproníquel.',
    nominalWeightGrams: 8.5,
    toleranceGrams: 0.2,
    source: 'Banco Central Europeo (ecb.europa.eu)',
    sourceUrl: 'https://www.ecb.europa.eu/euro/coins/html/index.es.html',
  },
  {
    id: 'euro_50c',
    country: 'Eurozona',
    currency: 'EUR',
    name: '50 céntimos de Euro',
    variantNote: 'Aleación oro nórdico (Nordic gold).',
    nominalWeightGrams: 7.8,
    toleranceGrams: 0.19,
    source: 'Banco Central Europeo (ecb.europa.eu)',
    sourceUrl: 'https://www.ecb.europa.eu/euro/coins/html/index.es.html',
  },
  {
    id: 'euro_20c',
    country: 'Eurozona',
    currency: 'EUR',
    name: '20 céntimos de Euro',
    variantNote: 'Aleación oro nórdico con muescas en el borde.',
    nominalWeightGrams: 5.74,
    toleranceGrams: 0.17,
    source: 'Banco Central Europeo (ecb.europa.eu)',
    sourceUrl: 'https://www.ecb.europa.eu/euro/coins/html/index.es.html',
  },

  // MÉXICO
  {
    id: 'mx_5_familia_c',
    country: 'México',
    currency: 'MXN',
    name: '5 Pesos (Familia C)',
    variantNote: 'Centro de bronce de aluminio y anillo perimétrico de acero inoxidable.',
    nominalWeightGrams: 7.07,
    toleranceGrams: 0.18,
    source: 'Banco de México (banxico.org.mx)',
    sourceUrl: 'https://www.banxico.org.mx',
  },

  // REINO UNIDO
  {
    id: 'uk_1p',
    country: 'Reino Unido',
    currency: 'GBP',
    name: '1 Penny (1p, post-1992)',
    variantNote: 'Acero con baño de cobre (especificación oficial: aprox. 3,564 g).',
    nominalWeightGrams: 3.56,
    toleranceGrams: 0.12,
    source: 'The Royal Mint (royalmint.com)',
    sourceUrl: 'https://www.royalmint.com',
  },

  // CHILE
  {
    id: 'cl_100_bimetalica',
    country: 'Chile',
    currency: 'CLP',
    name: '$100 Bimetálica actual',
    variantNote: 'Anillo dorado (Alpaca) y núcleo plateado. En circulación habitual desde 2001.',
    nominalWeightGrams: 6.5,
    toleranceGrams: 0.15,
    source: 'Banco Central de Chile (billetesymonedas.cl)',
    sourceUrl: 'https://www.billetesymonedas.cl/Monedas/Moneda_100',
    precisionCaveat:
      'Nota: Verifica la variante en billetesymonedas.cl del Banco Central. Las monedas circuladas pueden estar desgastadas.',
  },
  {
    id: 'cl_100_centenario',
    country: 'Chile',
    currency: 'CLP',
    name: '$100 Conmemorativa Centenario',
    variantNote: 'Edición Centenario del Banco Central con peso mayor.',
    nominalWeightGrams: 7.58,
    toleranceGrams: 0.15,
    source: 'Banco Central de Chile (billetesymonedas.cl)',
    sourceUrl: 'https://www.billetesymonedas.cl',
    precisionCaveat:
      'Nota: Verifica la variante en billetesymonedas.cl del Banco Central. Las monedas circuladas pueden estar desgastadas.',
  },
  {
    id: 'cl_100_antigua',
    country: 'Chile',
    currency: 'CLP',
    name: '$100 Antigua de cuproníquel',
    variantNote: 'Moneda grande de un solo color plateado (Cuproníquel, acuñación antigua).',
    nominalWeightGrams: 9.0,
    toleranceGrams: 0.2,
    source: 'Banco Central de Chile (billetesymonedas.cl)',
    sourceUrl: 'https://www.billetesymonedas.cl',
    precisionCaveat:
      'Nota: Verifica la variante en billetesymonedas.cl del Banco Central. Las monedas circuladas pueden estar desgastadas.',
  },
  {
    id: 'cl_500_bimetalica',
    country: 'Chile',
    currency: 'CLP',
    name: '$500 Bimetálica',
    variantNote: 'Anillo plateado (Cuproníquel) y centro dorado (Alpaca).',
    nominalWeightGrams: 7.0,
    toleranceGrams: 0.15,
    source: 'Banco Central de Chile (billetesymonedas.cl)',
    sourceUrl: 'https://www.billetesymonedas.cl/Monedas/Moneda_500',
    precisionCaveat:
      'Nota: Verifica la variante en billetesymonedas.cl del Banco Central. Las monedas circuladas pueden estar desgastadas.',
  },
];

export interface ScaleChecklistItem {
  id: string;
  label: string;
  detail: string;
}

export const SCALE_CHECKLIST: ScaleChecklistItem[] = [
  {
    id: 'surface',
    label: 'Superficie dura, nivelada y sin vibraciones',
    detail: 'Coloca la balanza sobre mesa firme. Nunca sobre mantel, cama ni alfombra.',
  },
  {
    id: 'drafts',
    label: 'Lejos de corrientes de aire',
    detail: 'Evita ventiladores encendidos, aire acondicionado o respiración directa sobre el plato.',
  },
  {
    id: 'emi',
    label: 'Lejos de fuentes electromagnéticas',
    detail: 'Mantén el teléfono celular a más de 30 cm de distancia, alejado de microondas o routers.',
  },
  {
    id: 'batteries',
    label: 'Pilas con carga suficiente',
    detail: 'El síntoma más común de desvío e inestabilidad en balanzas digitales son baterías bajas.',
  },
  {
    id: 'warmup',
    label: 'Dejar calentar 30–60 segundos',
    detail: 'Espera entre 30 y 60 segundos tras encender la balanza antes de presionar TARE.',
  },
  {
    id: 'centered',
    label: 'Carga centrada en la plataforma',
    detail: 'Coloca el peso siempre en el centro exacto del plato, no apoyado en las esquinas o bordes.',
  },
];

export const SOURCES_DOCUMENTATION = [
  {
    entity: 'Banco Central de Chile',
    resource: 'Especificaciones oficiales de monedas en circulación ($100 y $500)',
    url: 'https://www.billetesymonedas.cl',
  },
  {
    entity: 'Banco de México (Banxico)',
    resource: 'Monedas metálicas familia C (5 Pesos)',
    url: 'https://www.banxico.org.mx',
  },
  {
    entity: 'Banco Central Europeo (BCE)',
    resource: 'Monedas de euro: especificaciones técnicas (1€, 2€, 50c, 20c)',
    url: 'https://www.ecb.europa.eu',
  },
  {
    entity: 'United States Mint (US Mint)',
    resource: 'Coin Specifications: 5¢ Nickel y 1¢ Penny (pre/post 1982)',
    url: 'https://www.usmint.gov',
  },
  {
    entity: 'The Royal Mint',
    resource: 'UK Coin Design and Specifications (1 Penny post-1992)',
    url: 'https://www.royalmint.com',
  },
];
