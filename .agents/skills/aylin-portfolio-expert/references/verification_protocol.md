# Protocolo de Verificación Rigurosa y Git Push

Este documento establece el ciclo estricto de diagnóstico, auto-reparación y actualización en Git para cada intervención en el proyecto.

## 1. El Ciclo de Auto-Reparación Autónomo

```
[Modificación de Código]
        ↓
[npm.cmd run lint]  ──(Falla)──> [Analizar Error de Tipos / Sintaxis] ──> [Corregir] ──> (Reintentar)
        ↓ (Pasa 0 errores)
[npm.cmd run build] ──(Falla)──> [Analizar Error de Bundling / Vite]  ──> [Corregir] ──> (Reintentar)
        ↓ (Pasa 0 errores)
[Verificación Visual / Funcional]
        ↓
[Git Stage, Commit & Push]
```

## 2. Pasos de Ejecución Exactos

### Paso 1: Verificación de Tipos TypeScript
```powershell
npm.cmd run lint
```
- Debe retornar exit code 0 (`tsc --noEmit` sin errores).
- Si hay errores de tipado en interfaces, props o imports, corregirlos inmediatamente antes de proseguir.

### Paso 2: Compilación y Build de Producción
```powershell
npm.cmd run build
```
- Debe generar el directorio `dist/` sin fallos de bundling ni errores de sintaxis CSS/JS.

### Paso 3: Git Commit y Push Seguro
Únicamente tras haber validado los pasos 1 y 2 con éxito:
```powershell
git status
git add .
git commit -m "tipo(alcance): descripción precisa del cambio"
git push origin main
```

> **NOTA IMPORTANTE**:
> Si `git push` o alguna prueba detecta anomalías, se debe investigar la causa raíz, aplicar la solución correspondiente y volver a ejecutar la suite completa de verificación antes de finalizar.
