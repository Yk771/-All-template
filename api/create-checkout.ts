import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { trouverProduit } from '../shared/catalog.js';
import { BOUTIQUE, fraisDePort } from '../shared/config.js';

interface ArticleDemande {
  id: string;
  variante?: Record<string, string>;
  quantite: number;
}

const QUANTITE_MAX = 10;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY manquante dans les variables d’environnement.' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' });

  try {
    const articles: ArticleDemande[] = Array.isArray(req.body?.articles) ? req.body.articles : [];
    if (articles.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide.' });
    }

    // Le prix vient TOUJOURS du catalogue côté serveur, jamais du navigateur.
    let sousTotal = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const a of articles) {
      const produit = trouverProduit(String(a.id));
      if (!produit) {
        return res.status(400).json({ error: `Produit inconnu : ${a.id}` });
      }
      const quantite = Math.floor(Number(a.quantite));
      if (!Number.isFinite(quantite) || quantite < 1 || quantite > QUANTITE_MAX) {
        return res.status(400).json({ error: `Quantité invalide pour ${produit.titre}.` });
      }

      // Vérifie que chaque option choisie existe bien
      const variante: Record<string, string> = {};
      for (const v of produit.variantes ?? []) {
        const choix = a.variante?.[v.nom];
        if (!choix || !v.options.includes(choix)) {
          return res.status(400).json({ error: `Choisis ${v.nom.toLowerCase()} pour ${produit.titre}.` });
        }
        variante[v.nom] = choix;
      }
      const varianteTexte = Object.values(variante).join(' / ');

      sousTotal += produit.prix * quantite;
      lineItems.push({
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(produit.prix * 100),
          product_data: {
            name: varianteTexte ? `${produit.titre} (${varianteTexte})` : produit.titre,
            metadata: { produitId: produit.id, variante: varianteTexte },
          },
        },
        quantity: quantite,
      });
    }

    const port = fraisDePort(sousTotal);
    const origine = process.env.APP_URL || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      locale: 'fr',
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: [...BOUTIQUE.paysLivres] },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: port === 0 ? 'Livraison express offerte' : 'Livraison express',
            fixed_amount: { amount: Math.round(port * 100), currency: 'eur' },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ],
      success_url: `${origine}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origine}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: unknown) {
    console.error('Erreur Stripe :', error);
    return res.status(500).json({ error: 'Impossible de créer le paiement. Réessaie dans un instant.' });
  }
}
