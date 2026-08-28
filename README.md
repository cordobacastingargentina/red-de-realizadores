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

## V1.0.1 — Password recovery hotfix
- Corrige el caso donde Supabase redirigía correctamente a la web pero el formulario de nueva contraseña no aparecía.
- Se detecta `type=recovery` desde el hash original antes de que Supabase lo consuma.
- El listener de Auth se registra antes de `getSession()`.
- Hay fallback después de restaurar la sesión y un segundo chequeo diferido.
- `resetPasswordForEmail` redirige a la raíz pública del proyecto; Supabase agrega su token de recuperación.
- No requiere SQL nuevo.

## V1.0.2 — Recovery query fix
- La recuperación ya no depende del hash de Supabase.
- `resetPasswordForEmail` usa `?recovery=1` como marcador persistente.
- Supabase puede consumir sus tokens del hash sin borrar la intención de recuperación.
- La web abre el formulario de nueva contraseña cuando detecta `?recovery=1` y existe sesión de recovery.
- No requiere SQL nuevo.

## V1.0.3 — Recuperación revisada a fondo
- Se elimina la dependencia principal de `PASSWORD_RECOVERY`.
- Si la URL contiene `?recovery=1`, la app espera explícitamente hasta 8 segundos a que Supabase restaure la sesión.
- `onAuthStateChange` ya no ejecuta `await` a métodos de Supabase dentro del callback; todo se difiere con `setTimeout(..., 0)`.
- `detectSessionInUrl`, `persistSession` y `autoRefreshToken` quedan explícitos en la configuración del cliente.
- Si el enlace venció o no produce sesión, aparece un error claro en lugar de volver silenciosamente a Home.
- No requiere SQL nuevo.


## V1.1.0 — Recursos administrables

Se agregó una biblioteca real de Recursos conectada a Supabase.

### Antes de subir la web
1. Abrí Supabase → SQL Editor.
2. Ejecutá `09_resources.sql` completo, una sola vez.
3. Después subí los archivos de esta versión a GitHub Pages.

### Qué puede hacer Administración → Recursos
- Crear Descargables o Guías / Tutoriales.
- Editar, publicar/ocultar y eliminar.
- Marcar recursos destacados.
- Definir categoría y orden manual.
- Descargables: link PDF, link editable o ambos.
- Tutoriales: texto largo con formato simple seguro.

### Seguridad
La UI no es la única protección. RLS impide INSERT / UPDATE / DELETE a cualquier usuario que no tenga `role='admin'` en `user_roles`. La lectura pública devuelve solo `is_visible=true`; administración puede ver también ocultos.

### Formato de tutoriales
En el editor:
- `## Título de sección`
- `### Subtítulo`
- `- elemento de lista`
- `> cita o nota`
- `**texto en negrita**`
- URLs que empiezan por `http://` o `https://` se vuelven enlaces.

No se guarda HTML arbitrario: el texto se escapa antes de renderizar para evitar inyección de código.


## V1.1.1 — Admin / búsquedas / recursos
- Los administradores son cuentas de sistema: no aparecen como realizadores ni necesitan perfil profesional.
- Las búsquedas de admin se muestran como publicadas por “Córdoba Casting”.
- Se corrige la renovación de búsquedas: hasta 10 días desde el momento de editar.
- Se elimina “Postulaciones” como pestaña global de administración; los interesados se consultan dentro de cada búsqueda.
- Recursos descargables ahora permite subir PDF y editable directamente desde Administración.
- Nuevo bucket público `resources`, con escritura exclusiva de administradores.
- Para aplicar los cambios ejecutar `10_admin_resources_fixes.sql` después de `09_resources.sql`.
