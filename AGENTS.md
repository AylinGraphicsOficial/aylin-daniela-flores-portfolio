# Directivas y Protocolo Permanente de Agentes — Aylin Portfolio Expert

Este documento establece las instrucciones operativas obligatorias para cualquier modelo o agente de IA que interactúe con este repositorio. Estas reglas aplican de forma inmediata y automática en cada solicitud del usuario, sin requerir recordatorios manuales.

---

## 1. Regla Primaria: Lectura Obligatoria de la Skill

Al iniciar cualquier conversación o abordar cualquier cambio en este sitio web, el agente debe:
1. **Consultar y aplicar rigurosamente la Skill especializada**:
   - Ruta: [.agents/skills/aylin-portfolio-expert/SKILL.md](file:///c:/Users/Jovas-Motion/Documents/aylin-daniela-flores---studio-kinetic-portfolio/.agents/skills/aylin-portfolio-expert/SKILL.md)
   - Esta Skill contiene el perfil técnico, estándares de calidad, sistema de diseño, manejo de almacenamiento protegido y flujos de despliegue.

---

## 2. Protocolo de Diagnóstico e Inspección Previa en Vivo

Antes de modificar cualquier archivo de código (frontend o backend):
1. **Verificar el estado real en producción en Hostinger**:
   - `GET /api/init_db.php` — Conectividad MySQL.
   - `GET /api/projects.php` — Listado y estado de proyectos.
   - `GET /api/disciplines.php` — Listado de disciplinas y sliders.
   - `GET /api/settings.php` — Configuración de secciones (About, Perfil, Diplomados, Lab 3D, Socials).
   - `GET /api/media.php?action=status&key=kinetic-media-2026` — Salud del almacenamiento protegido de medios.
   - `GET /api/media.php?action=doctor&key=kinetic-media-2026` — Detección de enlaces rotos o archivos faltantes.
2. **Inspección FTP (solo lectura) cuando se requiera**:
   - Raíz web: `domains/aylinflores.com/public_html/`
   - Almacenamiento protegido: `domains/aylinflores.com/uploads_storage/`
   - NUNCA ejecutar borrados masivos o flags destructivos sobre el servidor.

---

## 3. Principio de Autoridad: Hostinger MySQL es la Única Fuente de Verdad

1. **Anti-Resurrección de Proyectos**:
   - La base de datos MySQL en Hostinger es la única fuente de verdad autoritativa para el contenido.
   - La caché local (`localStorage`) es solo un espejo temporal para navegación fluida.
   - Un cliente o navegador NUNCA debe re-subir a MySQL proyectos o elementos eliminados simplemente porque falten en el servidor remoto.
2. **Persistencia Garantizada de Medios**:
   - Todo medio subido desde el Dashboard se persiste obligatoriamente en `uploads_storage` (fuera de `public_html`).
   - Las llamadas a `/uploads/*` son rescatadas automáticamente hacia `api/media.php` en caso de faltar en `public_html`.

---

## 4. Gestión Total en el Dashboard de Administración

1. **Cobertura 100% Interactiva**:
   - Todo elemento que se muestre en el sitio web (Proyectos, Sliders de Disciplinas, Sección Sobre Mí, Perfil Profesional, Experiencia Laboral, Diplomados, Laboratorio 3D, Redes Sociales, Comentarios) DEBE contar con su panel de edición y soporte de carga multimedia en el **Dashboard de Administración** (`src/components/dashboard/`).
   - Se debe poder **SUBIR**, **QUITAR**, **MODIFICAR** y **REORDENAR** libremente cualquier elemento.

---

## 5. Protocolo de Calidad y Git Pre-Push Obligatorio

NUNCA realizar un commit o `git push` sin haber superado con 0 errores:
1. `npm.cmd run lint` (validación estricta de TypeScript con `tsc --noEmit`).
2. `npm.cmd run build` (compilación de producción de Vite exitosa).
3. Confirmación de endpoints y persistencia en Hostinger tras el despliegue.
