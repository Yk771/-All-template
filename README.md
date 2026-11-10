# ALL Saison : boutique été / hiver

Boutique en ligne à contre-saison, construite à partir de ton template « ALL template » (React + Tailwind + Stripe + Vercel).

- **2 collections** de 16 articles : été et hiver.
- **Contre-saison automatique** : la collection été s'affiche d'octobre à mars, la collection hiver d'avril à septembre.
- **Panier et paiement Stripe**, avec l'adresse de livraison demandée par Stripe.
- **À chaque commande**, tu reçois un e-mail avec les articles, un bouton « Commander sur Amazon » pour chacun et l'adresse du client à recopier. Le client reçoit une confirmation.

## Ce qu'il faut remplir avant d'ouvrir

| Fichier | Quoi |
|---|---|
| `shared/config.ts` | Nom de la boutique, e-mail de contact, délai, frais de port, **SIRET, nom, adresse** |
| `shared/catalog.ts` | Titres, descriptions et **prix de vente** (prix Amazon + ta marge). Vérifie que les caractéristiques correspondent au produit que tu achètes. |
| `api/_sourcing.ts` | Le **lien Amazon exact** de chaque produit (`https://www.amazon.fr/dp/...`). Pour l'instant, ce sont des liens de recherche. Ces liens restent côté serveur : les clients ne les voient pas. |
| `src/pages/LegalPage.tsx` | Les passages entre [crochets] des CGV (TVA, frais de retour, médiateur) |

### Changer de saison
Dans `shared/config.ts`, le réglage `modeSaison` accepte :
- `'contre-saison'` (par défaut) : l'été en hiver, l'hiver en été
- `'saison'` : l'été en été, l'hiver en hiver
- `'ete'` ou `'hiver'` : une collection fixe

### Ajouter de vraies photos
Mets les images dans `public/produits/` puis ajoute `image: '/produits/parasol.jpg'` au produit dans `shared/catalog.ts`. Sans photo, une illustration s'affiche. Utilise tes propres photos ou des images que tu as le droit d'utiliser.

## Lancer en local
```bash
npm install
cp .env.example .env.local   # puis remplis les clés
npm run dev                  # http://localhost:3000
```

## Mettre en ligne sur Vercel
1. Pousse ce dossier sur GitHub et importe le dépôt dans Vercel.
2. Ajoute les variables de `.env.example` dans Vercel.
3. Dans Stripe → Webhooks, crée un endpoint `https://ton-site/api/webhook` pour l'événement `checkout.session.completed`, puis copie le secret dans `STRIPE_WEBHOOK_SECRET`.
4. (Optionnel) Exécute `supabase/commandes.sql` dans Supabase pour garder l'historique des commandes.

## Sécurité
Le navigateur envoie seulement l'identifiant, l'option et la quantité. Le prix est toujours recalculé par le serveur à partir du catalogue. L'ancien template faisait confiance au prix envoyé par le navigateur, ce qui permettait de payer n'importe quel montant.
