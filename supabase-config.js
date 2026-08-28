// Configuración pública de Supabase.
// Esta publishable key puede vivir en el frontend porque el acceso real se protege con RLS.
const SUPABASE_URL = "https://rrxqbbiznxkuejktsbwr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_7j5nxSXr-1soHDTtRtgqOQ_GgY2Y8i9";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true
  }
});
