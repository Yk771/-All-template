-- Table des commandes de la boutique (déjà créée dans le projet Supabase « all-saison »).
-- À réexécuter seulement si tu recrées le projet : Supabase → SQL Editor.

create table if not exists public.commandes (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  email text,
  telephone text,
  produit text,
  articles jsonb,               -- détail : kits, produits à acheter, liens Amazon
  adresse_livraison jsonb,
  montant numeric(10, 2),
  statut text not null default 'a_commander'
    check (statut in ('a_commander', 'commandee_amazon', 'expediee', 'livree', 'annulee')),
  stripe_payment_id text unique -- évite d'enregistrer deux fois la même commande
);

-- Les adresses des clients ne doivent jamais être lisibles avec la clé publique :
-- RLS activé sans aucune politique = accès réservé à la clé secrète du serveur.
alter table public.commandes enable row level security;

create index if not exists commandes_statut_idx on public.commandes (statut, created_at desc);
