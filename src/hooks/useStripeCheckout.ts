import { useState } from 'react';
import { APERCU, type ArticlePanier } from '../types';

export function useStripeCheckout() {
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const payer = async (panier: ArticlePanier[]) => {
    setErreur(null);
    if (APERCU) {
      setErreur('Ceci est un aperçu : le paiement Stripe fonctionnera une fois le site déployé avec ta clé Stripe.');
      return;
    }
    setChargement(true);
    try {
      // On n'envoie que l'identifiant, les options et la quantité : le serveur fixe le prix.
      const articles = panier.map((a) => ({ id: a.produit.id, variante: a.variante, quantite: a.quantite }));
      const reponse = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles }),
      });
      const data = await reponse.json().catch(() => ({}));
      if (!reponse.ok || !data.url) {
        throw new Error(data.error || 'Le paiement n’a pas pu démarrer.');
      }
      window.location.href = data.url;
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Le paiement n’a pas pu démarrer. Réessaie dans un instant.');
      setChargement(false);
    }
  };

  return { payer, chargement, erreur };
}
