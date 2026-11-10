# ALL Saison : boutique été / hiver

Boutique en ligne à contre-saison, construite à partir de ton template « ALL template » (React + Tailwind + Stripe + Vercel).

- **2 collections** de 16 articles : été et hiver.
- **Contre-saison automatique** : la collection été s'affiche d'octobre à mars, la collection hiver d'avril à septembre.
- **Panier et paiement Stripe**, avec l'adresse de livraison demandée par Stripe.
- **Une page par produit** (`/produit/parasol…`) à partager sur TikTok, Instagram ou WhatsApp, avec le bon titre dans l'aperçu du lien.
- **Des kits à prix réduit** (kit plage, kit canicule, kit cocooning…) pour faire grimper le panier.
- **Rupture de stock** : un produit indisponible s'affiche « Bientôt de retour » et ne peut plus être payé.
- **À chaque commande**, tu reçois un e-mail avec les articles, un bouton « Commander sur Amazon » par produit à acheter (3 boutons pour un kit de 3) et l'adresse du client à recopier. Le client reçoit une confirmation.
- **Suivi des commandes** dans Supabase (projet « all-saison », table `commandes`), avec un statut : à commander, commandée sur Amazon, expédiée, livrée.

## Ce qu'il faut remplir avant d'ouvrir

| Fichier | Quoi |
|---|---|
| `shared/config.ts` | Nom de la boutique, e-mail de contact, délai, frais de port, **SIRET, nom, adresse** |
| `shared/catalog.ts` | Titres, descriptions et **prix de vente** (prix Amazon + ta marge). Vérifie que les caractéristiques correspondent au produit que tu achètes. |
| `api/_sourcing.ts` | Le **lien Amazon exact** de chaque produit (`https://www.amazon.fr/dp/...`). Pour l'instant, ce sont des liens de recherche. Ces liens restent côté serveur : les clients ne les voient pas. |
| `src/pages/LegalPage.tsx` | Les passages entre [crochets] des CGV (TVA, frais de retour, médiateur) |

### Mettre un produit en rupture
Dans `shared/catalog.ts`, ajoute `disponible: false,` au produit. Les kits qui le contiennent passent aussi en rupture. Enlève la ligne quand il est de retour.

### Créer ou modifier un kit
En bas de `shared/catalog.ts`, section « KITS » : un titre, un prix et la liste des produits inclus (`contenu`). La réduction affichée est calculée toute seule.

### Suivre tes commandes
Supabase → projet « all-saison » → Table Editor → `commandes`. Change la colonne `statut` au fur et à mesure (`commandee_amazon`, `expediee`, `livree`).

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
4. Dans Vercel, ajoute `SUPABASE_URL` et `SUPABASE_SECRET_KEY` du projet Supabase « all-saison » (la table est déjà créée).

## Sécurité
Le navigateur envoie seulement l'identifiant, l'option et la quantité. Le prix est toujours recalculé par le serveur à partir du catalogue. L'ancien template faisait confiance au prix envoyé par le navigateur, ce qui permettait de payer n'importe quel montant.
