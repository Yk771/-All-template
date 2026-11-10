// ─────────────────────────────────────────────────────────────
//  SOURCING AMAZON — côté serveur uniquement (jamais envoyé au navigateur)
//
//  Pour chaque produit, remplace la recherche par le lien EXACT du produit
//  Amazon que tu achètes, par exemple :
//    'ete-parasol': 'https://www.amazon.fr/dp/B0XXXXXXXX',
//  Ce lien apparaît dans l'e-mail « Nouvelle commande » que tu reçois,
//  avec un bouton pour aller commander directement.
//  Le nom du fichier commence par _ : Vercel n'en fait pas une route d'API.
// ─────────────────────────────────────────────────────────────

const recherche = (mots: string) => `https://www.amazon.fr/s?k=${encodeURIComponent(mots)}`;

export const LIENS_AMAZON: Record<string, string> = {
  // Été
  'ete-parasol': recherche('parasol plage anti uv inclinable'),
  'ete-serviette': recherche('serviette plage microfibre XXL anti sable'),
  'ete-tente': recherche('tente plage pop up anti uv'),
  'ete-raquettes': recherche('raquettes de plage bois kit'),
  'ete-ventilateur': recherche('ventilateur portable rechargeable pliable usb c'),
  'ete-ventilateur-cou': recherche('ventilateur de cou sans hélice'),
  'ete-glaciere': recherche('glacière rigide 25 litres'),
  'ete-gourde': recherche('gourde isotherme inox 750 ml'),
  'ete-pochette': recherche('pochette étanche smartphone'),
  'ete-enceinte': recherche('enceinte bluetooth étanche'),
  'ete-bouee': recherche('matelas gonflable piscine appui tête'),
  'ete-chaussures-eau': recherche('chaussures aquatiques adulte'),
  'ete-lunettes': recherche('lunettes de soleil polarisées uv400'),
  'ete-chapeau': recherche('chapeau anti uv upf 50'),
  'ete-guirlande': recherche('guirlande solaire guinguette extérieur'),
  'ete-anti-moustique': recherche('lampe anti moustique rechargeable'),

  // Hiver
  'hiver-plaid': recherche('plaid chauffant électrique'),
  'hiver-bouillotte': recherche('bouillotte électrique rechargeable'),
  'hiver-chaussons': recherche('chaussons fourrés antidérapants'),
  'hiver-chaussettes': recherche('chaussettes laine épaisses lot de 3'),
  'hiver-gants': recherche('gants tactiles doublés polaire'),
  'hiver-bonnet': recherche('bonnet doublé polaire'),
  'hiver-chauffe-mains': recherche('chauffe mains rechargeable'),
  'hiver-tour-de-cou': recherche('tour de cou polaire'),
  'hiver-raclette': recherche('grattoir givre avec gant'),
  'hiver-bache': recherche('bâche pare brise antigel'),
  'hiver-masque-ski': recherche('masque de ski anti buée'),
  'hiver-crampons': recherche('crampons antidérapants chaussures'),
  'hiver-luge': recherche('luge enfant avec frein'),
  'hiver-guirlande': recherche('guirlande led blanc chaud fil cuivre'),
  'hiver-bougies': recherche('bougies led effet flamme cire'),
  'hiver-thermos': recherche('thermos isotherme 1 litre inox'),
};
