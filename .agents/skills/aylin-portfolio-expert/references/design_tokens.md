# Guía de Tokens y Diseño UX/UI — Studio Kinetic

Este documento contiene los estándares y especificaciones de diseño para mantener la coherencia visual del portafolio.

## Paleta de Colores

| Variable / Token | Hex | Uso |
| :--- | :--- | :--- |
| `--deep-black` | `#050B05` | Fondo primario, contenedores oscuros profundos |
| `--electric-lime` | `#76FF03` | Color acento principal, llamadas a la acción, bordes activos, highlights |
| `--kinetic-green` | `#38B000` | Verde secundario de transición, gradientes, estados secundarios |
| `--stark-white` | `#FFFFFF` | Textos titulares, iconos destacados |
| `Muted Text` | `#9CA3AF` / `#6B7280` | Subtítulos, descripciones secundarias |
| `Glass Dark` | `rgba(5, 11, 5, 0.85)` | Modales y barras de navegación fijas |
| `Glass Light` | `rgba(255, 255, 255, 0.02)`| Cards bento, paneles secundarios |

## Clases de Utilidad y Efectos

- **`.glass-panel`**: Fondo translúcido con desenfoque de fondo de 20px y borde lime sutil (`rgba(118, 255, 3, 0.12)`).
- **`.glass-panel-heavy`**: Contenedores densos con 85% de opacidad y desenfoque de 24px.
- **`.kinetic-hover`**: Transición cubic-bezier suave con elevación de -4px, escala a 1.015 y sombra de resplandor lime.
- **`.glow-lime`**: Sombra difusa de resplandor lime (`box-shadow: 0 0 25px rgba(118, 255, 3, 0.4)`).
- **`.glow-text`**: Resplandor tipográfico (`text-shadow: 0 0 15px rgba(118, 255, 3, 0.5)`).

## Principios UX/UI

1. **Jerarquía Visual Inmersiva**: Cada sección debe contar con un titular fuerte, tipografía Montserrat y espaciado generoso.
2. **Microinteracciones Dinámicas**: Efectos hover con `kinetic-hover` en todas las cards y botones interactivos.
3. **Accesibilidad**: Mantener contraste de texto con `#FFFFFF` y `#76FF03` sobre fondos oscuros `#050B05`.
4. **Adaptabilidad Móvil**: Asegurar que en pantallas menores a 768px no existan desbordamientos horizontales (`overflow-x: hidden`), los modales se abran en pantalla completa fluida y las interacciones complejas tengan soporte touch.
