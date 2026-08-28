-- =========================================================
-- RED DE REALIZADORES
-- 10_admin_resources_fixes.sql
-- V1.1.1
-- =========================================================

-- 1) ADMINISTRADORES COMO CUENTAS DE SISTEMA, NO PERFILES PÚBLICOS
alter table public.profiles
  add column if not exists is_system_account boolean not null default false;

update public.profiles p
set is_system_account = true,
    is_visible = false
from public.user_roles ur
where ur.user_id = p.id
  and ur.role = 'admin';

create or replace function public.sync_system_account_from_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set is_system_account = (new.role = 'admin'),
      is_visible = case when new.role = 'admin' then false else is_visible end
  where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists sync_system_account_from_role_trigger on public.user_roles;
create trigger sync_system_account_from_role_trigger
after insert or update of role on public.user_roles
for each row execute function public.sync_system_account_from_role();

-- 2) BÚSQUEDAS PUBLICADAS POR ADMIN = CÓRDOBA CASTING
alter table public.job_posts
  add column if not exists published_by_admin boolean not null default false;

update public.job_posts j
set published_by_admin = true
from public.user_roles ur
where ur.user_id = j.author_id
  and ur.role = 'admin';

create or replace function public.set_job_publisher_type()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.published_by_admin := exists (
    select 1 from public.user_roles
    where user_id = new.author_id and role = 'admin'
  );
  return new;
end;
$$;

drop trigger if exists set_job_publisher_type_trigger on public.job_posts;
create trigger set_job_publisher_type_trigger
before insert or update of author_id on public.job_posts
for each row execute function public.set_job_publisher_type();

-- 3) PERMITIR RENOVAR / ALARGAR BÚSQUEDAS DESDE HOY
-- La regla vieja medía 10 días desde created_at y por eso una renovación posterior fallaba.
alter table public.job_posts
  drop constraint if exists job_posts_valid_expiration;

alter table public.job_posts
  drop constraint if exists job_posts_expiration_after_creation;

alter table public.job_posts
  add constraint job_posts_expiration_after_creation
  check (expires_at > created_at);

-- La función validate_job_post() existente sigue imponiendo el máximo de
-- 10 días DESDE EL MOMENTO DE GUARDAR, que es la regla deseada.

-- 4) STORAGE PARA RECURSOS DESCARGABLES
alter table public.resources add column if not exists pdf_path text;
alter table public.resources add column if not exists editable_path text;

insert into storage.buckets (id, name, public, file_size_limit)
values ('resources', 'resources', true, 26214400)
on conflict (id) do update
set public = true,
    file_size_limit = 26214400;

drop policy if exists "resources_public_read" on storage.objects;
create policy "resources_public_read"
on storage.objects for select
to public
using (bucket_id = 'resources');

drop policy if exists "resources_admin_insert" on storage.objects;
create policy "resources_admin_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'resources' and public.is_admin());

drop policy if exists "resources_admin_update" on storage.objects;
create policy "resources_admin_update"
on storage.objects for update
to authenticated
using (bucket_id = 'resources' and public.is_admin())
with check (bucket_id = 'resources' and public.is_admin());

drop policy if exists "resources_admin_delete" on storage.objects;
create policy "resources_admin_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'resources' and public.is_admin());

-- =========================================================
-- PARA CONVERTIR OTRA CUENTA EN ADMIN:
-- 1. Crearla en Authentication > Users con su mail y contraseña.
-- 2. Reemplazar el mail de abajo y ejecutar SOLO este UPDATE:
--
-- update public.user_roles ur
-- set role = 'admin'
-- from auth.users au
-- where ur.user_id = au.id
--   and lower(au.email) = lower('nuevoadmin@correo.com');
--
-- El trigger de arriba la convierte automáticamente en cuenta de sistema
-- y la excluye de los perfiles públicos.
-- =========================================================
