// ─────────────────────────────────────────────────────────────
//  RÉGLAGES DE LA BOUTIQUE — tout se change ici
// ─────────────────────────────────────────────────────────────

export type Saison = 'ete' | 'hiver';

/**
 * Quelle collection afficher :
 *  - 'contre-saison' : été pendant l'hiver (oct → mars), hiver pendant l'été (avr → sept)
 *  - 'saison'        : été pendant l'été, hiver pendant l'hiver
 *  - 'ete' / 'hiver' : collection forcée, quelle que soit la date
 */
export type ModeSaison = 'contre-saison' | 'saison' | Saison;

export const BOUTIQUE = {
  nom: 'ALL Saison',
  email: 'contact@all-tempalte.fr',
  modeSaison: 'contre-saison' as ModeSaison,

  // Livraison (affichée sur le site et appliquée au paiement Stripe)
  delai: 'Livré en 24 à 48 h',
  fraisPort: 4.9, // en euros
  livraisonOfferteDes: 39, // panier minimum pour la livraison offerte
  paysLivres: ['FR'] as const, // France métropolitaine

  // Mentions légales (obligatoires pour vendre en France)
  raisonSociale: '[Ton nom ou ta société]',
  siret: '[Ton numéro SIRET]',
  adresse: '[Ton adresse]',
};

/** Saison « réelle » selon le mois : avril → septembre = été. */
export function saisonCalendaire(date = new Date()): Saison {
  const mois = date.getMonth() + 1;
  return mois >= 4 && mois <= 9 ? 'ete' : 'hiver';
}

/** Collection à afficher aujourd'hui selon le mode choisi. */
export function saisonActive(mode: ModeSaison = BOUTIQUE.modeSaison, date = new Date()): Saison {
  if (mode === 'ete' || mode === 'hiver') return mode;
  const cal = saisonCalendaire(date);
  if (mode === 'saison') return cal;
  return cal === 'ete' ? 'hiver' : 'ete';
}

export function fraisDePort(sousTotal: number): number {
  return sousTotal >= BOUTIQUE.livraisonOfferteDes || sousTotal === 0 ? 0 : BOUTIQUE.fraisPort;
}

export function euros(n: number): string {
  const rond = Number.isInteger(n);
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: rond ? 0 : 2, maximumFractionDigits: 2 });
}
