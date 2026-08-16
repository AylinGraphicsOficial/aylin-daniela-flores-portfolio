# Guía de Optimización y Rendimiento Frontend

Este documento establece las mejores prácticas de optimización de rendimiento para el portafolio.

## 1. Gestión de WebGL y Canvas 3D

- **Limpieza de Recursos (Cleanups)**:
  - En componentes como `WebGLFluidShader.tsx` e `Interactive3DViewer.tsx`, siempre limpiar buffers de WebGL, texturas, geometrías, materiales y listeners en el return de `useEffect`.
  - Cancelar siempre los bucles de renderización activos usando `cancelAnimationFrame(animationFrameId)`.
- **Throttling y Detección de Dispositivos**:
  - Desactivar o reducir la resolución de shaders pesados en dispositivos móviles o cuando `window.devicePixelRatio > 2` para evitar sobrecalentamiento de la GPU.
  - Pausar animaciones de WebGL cuando el elemento esté fuera del viewport (mediante `IntersectionObserver`).

## 2. React 19 y División de Código (Code Splitting)

- **Lazy Loading de Modales**:
  - Modales pesados (`CaseStudyModal`, `ProjectPlannerModal`, `CVViewerModal`, `Interactive3DViewer`) deben cargarse bajo demanda o mantener su renderizado condicional optimizado.
- **Evitar Re-renders Innecesarios**:
  - Usar `useCallback` y `useMemo` en manejadores de eventos y transformaciones de datos intensivas.
  - Mantener estados locales aislados en los componentes hijos cuando no afecten al resto del árbol de la aplicación.

## 3. Imágenes y Assets

- Utilizar formatos WebP o AVIF con dimensiones explícitas para evitar saltos de diseño (CLS).
- Usar `loading="lazy"` y `decoding="async"` en imágenes que no formen parte del viewport inicial.

## 4. Vite & Tailwind v4

- Mantener la configuración de build optimizada con `vite build` y tree-shaking habilitado.
- Evitar paquetes duplicados o librerías innecesarias en el bundle de producción.
