import type { Produit } from '../shared/catalog';

export interface ArticlePanier {
  cle: string; // produit + options choisies
  produit: Produit;
  variante: Record<string, string>;
  quantite: number;
}

/** Vrai dans l'aperçu publié : pas de serveur, donc pas de paiement. */
export const APERCU = import.meta.env.VITE_APERCU === '1';

export const CLE_PANIER = 'all-saison-panier';
