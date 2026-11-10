-- À exécuter une fois dans Supabase → SQL Editor.
-- Crée la table des commandes, ou ajoute les colonnes manquantes si elle existe déjà
-- (ton ancien template utilisait déjà une table « commandes »).

create table if not exists commandes (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now()
);

alter table commandes add column if not exists email text;
alter table commandes add column if not exists telephone text;
alter table commandes add column if not exists produit text;
alter table commandes add column if not exists articles jsonb;
alter table commandes add column if not exists adresse_livraison jsonb;
alter table commandes add column if not exists montant numeric(10, 2);
alter table commandes add column if not exists statut text default 'a_commander';
alter table commandes add column if not exists stripe_payment_id text;

-- Statuts conseillés : a_commander → commande_amazon → expediee → livree
