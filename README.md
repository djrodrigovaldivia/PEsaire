# Peso Claro 🐾⚖️

> **«Estimaciones claras, registros reales.»**  
> Aplicación web progresiva (PWA), personal, privada y offline-first diseñada para iPhone y navegadores modernos.

---

## 🎯 Propósito y Filosofía de Honestidad

**Peso Claro** está construida sobre un principio de transparencia absoluta:
1. **La cámara no pesa:** La app jamás afirma que la cámara del teléfono actúa como balanza digital. Solo guarda fotos de referencia visual local.
2. **Estimaciones con rango:** El reconocimiento visual ofrece rangos orientativos (ej. `25–35 g`) con confianza baja explícita.
3. **Medición con balanza física:** Para decisiones nutricionales o control de sustancias prescritas, la app invita siempre a registrar los gramos exactos usando una balanza física.
4. **Sin recomendaciones médicas:** No calcula dosis, no sugiere tratamientos ni reemplaza a un profesional o veterinario.
5. **100% Privado y Offline:** Los datos se guardan únicamente en el almacenamiento local del dispositivo (IndexedDB). No hay servidores externos, no requiere backend ni claves de API.

---

## 📱 Características Principales

- **Pantalla de Inicio:** Resumen diario, última porción de la gata, último pesaje registrado en balanza (con modo discreto), métricas semanales y acceso rápido.
- **Comida de mi gata:**
  - *Modo A (Estimar porción):* Selecciona tipo de comida, tamaño visual (muy pequeña a muy grande) y recipiente. Rango inmediato configurable.
  - *Modo B (Peso real):* Registro numérico directo con balanza física, fecha/hora, foto y notas.
  - *Historial filtrable:* Filtra por hoy, 7 días, mes o todo, con opciones de edición y borrado.
- **Registro de pesajes:**
  - Historial discreto para mediciones manuales con balanza física.
  - Botón de privacidad para ocultar/mostrar cantidades con ícono de ojo.
  - Interruptor para ocultar cantidad en el inicio por defecto.
- **Ajustes:**
  - Exportación e importación de respaldo completo en formato JSON (con opciones de fusión o reemplazo).
  - Selector de unidades (gramos como base, opción de mostrar equivalencia en onzas).
  - Editor interactivo de la tabla de rangos de estimación con botón de restauración.
  - Selector de apariencia (Sistema, Claro, Oscuro con paleta cálida).
- **PWA móvil para iPhone:**
  - Optimizada para Safari en iOS con safe areas (`env(safe-area-inset-top)` y `env(safe-area-inset-bottom)`).
  - Guía visual interactiva paso a paso para añadir a pantalla de inicio en iOS.
  - Botón de instalación nativa para navegadores Chromium / Android / Escritorio.
  - Service worker completo con almacenamiento en caché offline.

---

## 🛠️ Stack Tecnológico

- **React 19 + TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (iconos minimalistas)
- **IndexedDB (`idb`)** para persistencia local y offline
- **vite-plugin-pwa** para Service Worker, Web App Manifest y precaching
- **Sharp** para generación de activos PWA optimizados

---

## 🚀 Instalación y Desarrollo Local

1. Clonar el repositorio o abrir en el entorno de desarrollo.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir `http://localhost:3000` en tu navegador.

---

## 📦 Compilación para Producción

Generar los archivos estáticos en la carpeta `dist/`:

```bash
npm run build
```

---

## 🌐 Despliegue en Netlify

El proyecto ya está 100% configurado para desplegarse como sitio estático en Netlify:

### Opción 1: Mediante Netlify CLI
```bash
npx netlify deploy --prod --dir=dist
```

### Opción 2: Conectar repositorio en app.netlify.com
1. Crea un nuevo sitio desde Git en Netlify.
2. La configuración se detectará automáticamente gracias a `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. El archivo `public/_redirects` (`/* /index.html 200`) asegura que la navegación SPA funcione sin errores 404 al recargar páginas.
4. Despliega y listo.

---

## 📲 Cómo Instalar en iPhone (Safari)

1. Abre la URL en Safari.
2. Presiona el botón de **Compartir** en la barra inferior (cuadrado con flecha hacia arriba).
3. Desplázate hacia abajo y selecciona **«Agregar a pantalla de inicio»** (Add to Home Screen).
4. La app se abrirá a pantalla completa sin barra de navegación del navegador, lista para funcionar sin conexión.
