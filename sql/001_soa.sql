-- ============================================================
-- Module SoA : tables, liaisons et sécurité
-- Projet APSI-NE B14, créé le 2026-10-09
-- ============================================================

-- 1. Référentiel des mesures de l'Annexe A (lecture seule pour les utilisateurs)
create table if not exists iso_controls (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,                 -- ex. 'A.5.1'
  theme text not null check (theme in
    ('organisationnel','personnes','physique','technologique')),
  intitule text not null,
  explication text,                          -- rédigée par toi, avec tes mots
  explication_validee boolean not null default false,
  created_at timestamptz default now()
);

alter table iso_controls enable row level security;
create policy "Lecture du référentiel pour les utilisateurs connectés"
  on iso_controls for select to authenticated using (true);

-- 2. Déclaration d'applicabilité : une ligne par mesure et par contexte
create table if not exists soa_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  contexte_id uuid not null references contexte(id) on delete cascade,
  control_id uuid not null references iso_controls(id),
  applicable boolean,                        -- null = pas encore évalué
  justification text,
  etat_mise_en_oeuvre text not null default 'non_evalue' check (etat_mise_en_oeuvre in
    ('non_evalue','non_commence','partiel','en_place')),
  ecart text,
  responsable text,
  preuve text,
  updated_at timestamptz default now(),
  unique (contexte_id, control_id)
);

-- 3. Liaison risque <-> mesure (la traçabilité)
create table if not exists risk_controls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  risque_id uuid not null references risques(id) on delete cascade,
  control_id uuid not null references iso_controls(id),
  commentaire text,
  created_at timestamptz default now(),
  unique (risque_id, control_id)
);

create index if not exists idx_soa_contexte on soa_entries(contexte_id);
create index if not exists idx_rc_risque on risk_controls(risque_id);

-- 4. Sécurité : chaque utilisateur ne voit que ses lignes
alter table soa_entries enable row level security;
alter table risk_controls enable row level security;

create policy "Les utilisateurs gèrent leur SoA" on soa_entries
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Les utilisateurs gèrent leurs liaisons" on risk_controls
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);