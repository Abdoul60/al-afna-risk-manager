-- ============================================================
-- Administration : statistiques par compte, réservées à l'administrateur
-- Aucun contenu des comptes n'est exposé : uniquement des compteurs.
-- ============================================================

-- 1. Liste des administrateurs. RLS activée SANS règle : l'application ne peut pas la lire ni la modifier.
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table admins enable row level security;

-- 2. Test d'appartenance (côté serveur)
create or replace function is_admin()
returns boolean
language sql security definer set search_path = public stable
as $$ select exists (select 1 from admins a where a.user_id = auth.uid()); $$;

-- 3. Statistiques : refusées à toute personne qui n'est pas dans la table admins
create or replace function admin_stats()
returns table (uid uuid, email text, cree_le timestamptz, derniere_connexion timestamptz,
               nb_contextes bigint, nb_actifs bigint, nb_risques bigint,
               nb_traitements bigint, nb_mesures_soa bigint)
language plpgsql security definer set search_path = public, auth
as $$
begin
  if not exists (select 1 from admins a where a.user_id = auth.uid()) then
    raise exception 'Accès refusé' using errcode = '42501';
  end if;
  return query
  select u.id, u.email::text, u.created_at, u.last_sign_in_at,
    (select count(*) from contexte c where c.user_id = u.id),
    (select count(*) from actifs x where x.user_id = u.id),
    (select count(*) from risques r where r.user_id = u.id),
    (select count(*) from traitements t where t.user_id = u.id),
    (select count(*) from soa_entries s where s.user_id = u.id and s.applicable is not null)
  from auth.users u
  order by u.created_at desc;
end $$;

-- 4. Droits : jamais pour les anonymes
revoke all on function is_admin() from public, anon;
revoke all on function admin_stats() from public, anon;
grant execute on function is_admin() to authenticated;
grant execute on function admin_stats() to authenticated;

-- 5. Ton compte administrateur (crée-le d'abord via inscription.html)
insert into admins (user_id)
select id from auth.users where email = 'abdoulazizadamou99@gmail.com'
on conflict do nothing;
