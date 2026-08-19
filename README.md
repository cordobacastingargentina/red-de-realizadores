# Red de Realizadores V0.8 — Supabase Fase 1

Esta versión conecta el frontend al proyecto real de Supabase.

## Ya es real
- Registro por email y contraseña.
- Login / sesión persistente / logout.
- Cambio de contraseña.
- Perfil profesional en `profiles`.
- Contacto privado en `profile_private`.
- Tags reales en `profile_tags`.
- Reel YouTube/Vimeo.
- PDF de Guion a Storage `scripts`.
- Enviar perfil a revisión mediante RPC.
- Detección real de admin desde `user_roles`.
- Panel admin real: pendientes, aprobados, rechazados, aprobar, aprobar+verificar, rechazar, verificar y ocultar/mostrar.

## Sigue demo
- Directorio público visible en portada.
- Recomendaciones.
- Búsquedas y postulaciones.
- Contacto entre perfiles.

Es intencional: primero se prueba Auth + perfiles + moderación antes de conectar las capas sociales.

## Configuración
`supabase-config.js` contiene Project URL y publishable key públicas.

## Para probar admin
La cuenta cuyo UUID convertiste a `admin` en `public.user_roles` debe iniciar sesión con su email/password real de Supabase.

## V0.8.1 hotfix
- Corregido el botón “Ingresar”: ahora abre el flujo real de Supabase.
- Corregido “Crear mi perfil” para abrir el registro real.
- Eliminadas referencias rotas a funciones demo antiguas que podían producir errores JavaScript.

## V0.8.3
Corrección de integración:
- Se vuelve a tomar V0.8.1 como base visual.
- No se reemplaza el diseño del directorio.
- Las mismas cards, proporciones, secciones, navegación y estilos ahora reciben datos de Supabase.
- Solo perfiles approved + visible alimentan la grilla.
- Perfil público mantiene el diseño previo y carga datos reales.
- “Muy recomendado” usa la regla real de Supabase.

## V0.8.4
- Eliminado el UUID técnico de la interfaz pública.
- Corregido abrir perfiles reales con IDs UUID.
- Corregido “Crear / editar mi perfil”.
- Corregido “Publicar búsqueda” para reconocer la sesión real de Supabase.
- Corregida la participación demo con usuarios UUID.
- No se modifica el diseño de V0.8.3.

## V0.8.5
- Recomendaciones conectadas a Supabase real.
- Ya no vuelve a pedir login si la sesión real está activa.
- Una recomendación por usuario y realizador, garantizada también por la base.
- Si ya recomendaste a alguien, el botón pasa a “Editar mi recomendación”.
- Se puede editar o eliminar la recomendación real.
- El perfil público carga autor, proyecto y comentario desde Supabase.
- El mensaje de rechazo sigue guardándose en `profile_moderation.rejection_reason`; todavía NO se envía por email.

## V0.8.6
- Si un usuario rechazado vuelve a entrar, ve una pantalla grande e inequívoca de “Tu perfil fue rechazado”.
- Se muestra el motivo exacto guardado por administración.
- Se explica claramente qué debe corregir y que el perfil no está publicado.
- Botón directo “Corregir mi perfil”.
- Para perfiles rechazados, Guardar cambios vuelve a enviar automáticamente el perfil a revisión.
- Después de guardar, el estado pasa a `pending` y aparece una confirmación “Perfil reenviado”.
- Se elimina el segundo paso manual “Enviar a revisión” para perfiles rechazados.
- Los borradores nuevos siguen necesitando “Enviar a revisión” la primera vez.
