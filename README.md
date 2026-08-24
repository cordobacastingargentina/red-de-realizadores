# Red de Realizadores — V1.0 Beta

Plataforma profesional de realizadores audiovisuales de Córdoba, una iniciativa de Córdoba Casting.

## Arquitectura
- Frontend estático: HTML + CSS + JavaScript.
- Hosting previsto: GitHub Pages.
- Backend: Supabase Auth, PostgreSQL, RLS, Storage y Realtime.
- Videos: embeds de YouTube/Vimeo.

## Funciones reales
- Registro, login, sesión persistente y logout.
- Cambio y recuperación de contraseña.
- Perfil editable con foto, rol principal, tags, bio, disponibilidad, estudiantiles y material profesional.
- Reel YouTube/Vimeo o PDF privado para Guion.
- Moderación: draft / pending / approved / rejected.
- Directorio, búsqueda, filtros y perfiles verificados.
- Perfil profesional público con URL compartible `#perfil/<uuid>`.
- Recomendaciones reales y notificaciones.
- Búsquedas laborales, postulaciones y administración.
- Panel admin exclusivo.

## Limpieza V1.0
Se eliminaron datos seed, usuarios demo, búsquedas demo, paneles demo y el estado local antiguo de autenticación. Supabase es la única fuente de sesión y permisos. También se consolidaron estilos históricos del hero para evitar cascadas contradictorias.

## Recuperación de contraseña
La web usa `supabase.auth.resetPasswordForEmail()` y luego `updateUser()`.

Antes de probarla en producción, agregar la URL pública real de la web en:

`Supabase > Authentication > URL Configuration > Redirect URLs`

Debe autorizarse la URL del sitio publicada en GitHub Pages. El frontend genera automáticamente el redirect usando `window.location.origin + window.location.pathname`.

## Contacto
El formulario de contacto conserva el flujo visual, pero el envío externo por email/WhatsApp sigue pendiente de definición. No expone los datos privados del destinatario.

## Archivos importantes
- `index.html` — shell de la aplicación.
- `styles.css` — UI responsive.
- `app.js` — lógica de frontend y Supabase.
- `supabase-config.js` — Project URL + publishable key pública.
- `assets/` — identidad e imágenes.
