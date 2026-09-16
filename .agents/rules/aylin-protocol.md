# Regla Permanente: Protocolo Obligatorio Aylin Portfolio

Al atender cualquier requerimiento sobre el proyecto **Aylin Daniela Flores — Studio Kinetic Portfolio**:

1. **Revisión de Skill**:
   - Consultar y apegarse a [.agents/skills/aylin-portfolio-expert/SKILL.md](file:///c:/Users/Jovas-Motion/Documents/aylin-daniela-flores---studio-kinetic-portfolio/.agents/skills/aylin-portfolio-expert/SKILL.md).

2. **Diagnóstico previo en vivo**:
   - Comprobar el estado real de la API de producción en Hostinger (`/api/init_db.php`, `/api/projects.php`, `/api/settings.php`, `/api/media.php?action=status`) antes de implementar cambios.

3. **MySQL como Autoridad Central**:
   - Prohibido re-subir automáticamente desde `localStorage` al servidor registros que hayan sido borrados en MySQL.
   - Toda creación o edición en el Dashboard se sincroniza directamente con los endpoints PHP de Hostinger.

4. **Persistencia de Medios**:
   - Los archivos subidos residen en `/domains/aylinflores.com/uploads_storage/` para sobrevivir a cualquier despliegue.

5. **Verificación Estricta**:
   - `npm.cmd run lint` y `npm.cmd run build` deben ejecutarse y reportar 0 errores antes de hacer git commit o push.
