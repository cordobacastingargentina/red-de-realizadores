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
