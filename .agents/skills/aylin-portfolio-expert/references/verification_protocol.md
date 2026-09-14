# Protocolo de Investigación, Verificación y Análisis de Cambios

Este documento establece el ciclo estricto de diagnóstico, auto-reparación, despliegue y documentación para cada intervención en el proyecto **Aylin Daniela Flores — Studio Kinetic Portfolio** (Hostinger + MySQL + React/Vite).

---

## 1. El Ciclo de Auto-Reparación Autónomo

```
[1. Investigación en vivo y lectura del código]
        ↓
[2. Causa raíz documentada + plan (cambio + defensa)]
        ↓
[3. Modificación de Código]
        ↓
[npm.cmd run lint]  ──(Falla)──> [Analizar Error de Tipos / Sintaxis] ──> [Corregir] ──> (Reintentar)
        ↓ (Pasa 0 errores)
[npm.cmd run build] ──(Falla)──> [Analizar Error de Bundling / Vite]  ──> [Corregir] ──> (Reintentar)
        ↓ (Pasa 0 errores)
[4. Verificación local (visual / funcional)]
        ↓
[5. Commit semántico + Push (despliegue CI/CD)]
        ↓
[6. Verificación en producción con evidencia]
        ↓
[7. Análisis del Cambio documentado]
```

> Si en el paso 6 el resultado no es el esperado, se vuelve al paso 1. No se aplican
> parches a ciegas: siempre se busca la causa raíz con evidencia.

---

## 2. Fase 1 — Investigación (antes de tocar código)

### 2.1 Lectura obligatoria
- Leer **completos** los archivos implicados: endpoint PHP, utilidad de storage, componente React, workflow de despliegue.
- Revisar el historial: `git log --oneline -20 -- <ruta>`.

### 2.2 Evidencia en vivo (producción)
Ejecutar y anotar resultados **antes** de cambiar nada:

| Comprobación | Comando / URL |
| :--- | :--- |
| Base de datos conectada | `GET /api/init_db.php` |
| Proyectos reales | `GET /api/projects.php` |
| Disciplinas / sliders | `GET /api/disciplines.php` |
| Secciones (About/Perfil, Diplomados, Lab 3D) | `GET /api/settings.php` |
| Archivos de medios en el servidor | `GET /api/upload.php` |
| Estado del respaldo protegido | `GET /api/media.php?action=status&key=kinetic-media-2026` |
| Integridad de medios (rotos / huérfanos) | `GET /api/media.php?action=doctor&key=kinetic-media-2026` |
| Existencia real de una URL | `HEAD /uploads/<archivo>` y `HEAD /images/<archivo>` |

### 2.3 Inspección FTP (solo lectura)
- Script: `node scratch/ftp_inspect.mjs <ruta>` (usa `basic-ftp`; **jamás** usa `clearWorkingDir` ni borres archivos).
- Rutas clave: `domains/aylinflores.com/public_html/`, `domains/aylinflores.com/uploads_storage/`.

### 2.4 Preguntas que la investigación debe responder
1. ¿Qué falla exactamente (síntoma observable)?
2. ¿Dónde falla (servidor, base de datos, caché local, red)?
3. ¿Por qué falla (causa raíz, no síntoma)?
4. ¿Desde cuándo falla (qué cambio lo introdujo)?
5. ¿Qué evidencia lo demuestra?

---

## 3. Fase 2 — Plan y defensa

- **Cambio mínimo** que corrige la causa raíz.
- **Defensa**: validación en servidor + respaldo + verificación en cliente, para que no vuelva a ocurrir.
- **Migración/backfill** idempotente si hay datos afectados en producción.
- **Rollback**: cómo revertir el cambio si algo sale mal.

---

## 4. Fase 3 — Pasos de Ejecución Exactos

### Paso 1: Verificación de Tipos TypeScript
```powershell
npm.cmd run lint
```
- Debe retornar exit code 0 (`tsc --noEmit` sin errores).

### Paso 2: Compilación y Build de Producción
```powershell
npm.cmd run build
```
- Debe generar `dist/` sin fallos de bundling ni errores de sintaxis.

### Paso 3: Git Commit y Push Seguro
```powershell
git status
git add .
git commit -m "tipo(alcance): descripción precisa del cambio"
git push origin main
```

### Paso 4: Verificación en producción (obligatoria)
1. Esperar a que GitHub Actions termine el despliegue.
2. Repetir la tabla del punto 2.2 y comparar contra la evidencia inicial.
3. Ejecutar el respaldo de medios:
   ```
   GET /api/media.php?action=migrate&key=kinetic-media-2026
   ```
4. Probar el flujo completo afectado (subir un archivo de prueba, cambiar la foto de perfil, guardar un proyecto y recargar en otro dispositivo).
5. Comprobar que el archivo subido siga existiendo después de un nuevo despliegue (subir, desplegar, verificar de nuevo).

---

## 5. Fase 4 — Análisis del Cambio (obligatorio)

Cada intervención se entrega con este bloque:

```
ANÁLISIS DEL CAMBIO
- Solicitud: <qué pidió el usuario>
- Causa raíz: <por qué ocurría>
- Evidencia previa: <endpoint/archivo/HTTP que lo demuestra>
- Cambio aplicado: <archivos y lógica exacta>
- Riesgos considerados: <qué podía romperse y cómo se mitigó>
- Verificación: <lint/build + prueba remota con resultado>
- Rollback: <cómo revertir si algo falla>
```

---

## 6. Checklist de Regresión (ejecutar antes de dar por terminado)

- [ ] `npm.cmd run lint` → 0 errores.
- [ ] `npm.cmd run build` → 0 errores.
- [ ] `GET /api/init_db.php` → conectado y conteos coherentes.
- [ ] `GET /api/media.php?action=doctor&key=kinetic-media-2026` → sin archivos rotos (o con plan de reposición).
- [ ] Subida de prueba → `200` en `/uploads/<archivo>` y `backedUp: true`.
- [ ] Perfil Profesional: cambiar foto → se guarda en MySQL y se ve en la web pública.
- [ ] Proyectos: guardar/editar uno → los demás conservan sus imágenes y datos.
- [ ] Otro dispositivo/navegador ve los cambios (sincronización).
- [ ] Nuevo despliegue → los archivos subidos siguen accesibles.

---

## 7. Errores conocidos y sus defensas (histórico de incidentes)

| Incidente | Causa raíz | Defensa implementada |
| :--- | :--- | :--- |
| Imágenes de trabajos desaparecían al subir varios | `saveAllProjects` enviaba el arreglo completo y sobrescribía con datos obsoletos | Envío por diferencias + guardas `updatedAt` en `projects.php` |
| La foto de perfil no cambiaba | El archivo vivía solo en `public_html/uploads`, que Hostinger recrea en cada despliegue | Respaldo en `uploads_storage` + `api/media.php` + verificación `HEAD` |
| Archivos no permanecían tras actualizar el sitio | Despliegue/redespliegue de Hostinger borra `public_html` (clon Git) | `exclude: uploads/**` en el workflow + respaldo protegido + `migrate`/`repair` |
| Proyectos "saltaban" de sección | Fallbacks por categoría en la asignación de disciplinas | Asignación solo por `disciplineId`/`projectIds` explícitos |
| Cambios revertidos entre dispositivos | Escrituras sin marca de tiempo que pisaban datos más nuevos | `shouldApplyIncomingWrite` en PHP + `__meta` en `settings.php` |
