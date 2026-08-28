-- =========================================================
-- RED DE REALIZADORES
-- 09_resources.sql
-- Biblioteca pública de descargables y mini tutoriales.
-- SOLO administradores pueden crear, modificar u eliminar.
-- =========================================================

create table if not exists public.resources (
  id bigint generated always as identity primary key,
  resource_type text not null default 'download',
  title varchar(140) not null,
  excerpt varchar(320) not null,
  category varchar(60) not null default 'Otros',
  cover_url text,
  content text,
  pdf_url text,
  editable_url text,
  is_visible boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint resources_type_check check (resource_type in ('download','article')),
  constraint resources_title_check check (char_length(trim(title)) between 2 and 140),
  constraint resources_excerpt_check check (char_length(trim(excerpt)) between 1 and 320),
  constraint resources_category_check check (char_length(trim(category)) between 1 and 60),
  constraint resources_sort_check check (sort_order between 0 and 9999),
  constraint resources_cover_url_check check (cover_url is null or cover_url ~* '^https?://'),
  constraint resources_pdf_url_check check (pdf_url is null or pdf_url ~* '^https?://'),
  constraint resources_editable_url_check check (editable_url is null or editable_url ~* '^https?://'),
  constraint resources_type_content_check check (
    (resource_type='download' and (pdf_url is not null or editable_url is not null))
    or
    (resource_type='article' and content is not null and char_length(trim(content)) > 0)
  )
);

create index if not exists resources_public_order_idx
  on public.resources(is_visible,is_featured,sort_order,created_at desc);
create index if not exists resources_type_idx
  on public.resources(resource_type);

-- Reutiliza la función global ya existente en el proyecto.
drop trigger if exists resources_updated_at on public.resources;
create trigger resources_updated_at
before update on public.resources
for each row execute function public.set_updated_at();

alter table public.resources enable row level security;

-- Lectura pública: solamente publicaciones visibles.
-- Admin puede leer también borradores/ocultos.
drop policy if exists "public_read_visible_resources" on public.resources;
create policy "public_read_visible_resources"
on public.resources
for select
to anon, authenticated
using (is_visible = true or public.is_admin());

-- Escritura: exclusivamente administradores, incluso si alguien intenta
-- llamar la API directamente desde fuera del frontend.
drop policy if exists "admin_insert_resources" on public.resources;
create policy "admin_insert_resources"
on public.resources
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admin_update_resources" on public.resources;
create policy "admin_update_resources"
on public.resources
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admin_delete_resources" on public.resources;
create policy "admin_delete_resources"
on public.resources
for delete
to authenticated
using (public.is_admin());

-- Data API
grant select on public.resources to anon, authenticated;
grant insert, update, delete on public.resources to authenticated;
grant usage, select on sequence public.resources_id_seq to authenticated;

-- Nadie recibe permisos de escritura como anon.
revoke insert, update, delete on public.resources from anon;

-- =========================================================
-- FIN 09_resources.sql
-- =========================================================
