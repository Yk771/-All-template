// ─────────────────────────────────────────────────────────────
//  CATALOGUE — produits été et hiver
//  Prix = TON prix de vente (prix Amazon + ta marge). À ajuster.
//  Les liens Amazon de chaque produit sont dans api/_sourcing.ts
//  (côté serveur uniquement, les clients ne les voient pas).
// ─────────────────────────────────────────────────────────────
import type { Saison } from './config';

export interface Variante {
  nom: string;
  options: string[];
}

export interface Produit {
  id: string;
  saison: Saison;
  categorie: string;
  titre: string;
  prix: number;
  resume: string;
  description: string;
  points: string[];
  variantes?: Variante[];
  /** Nom d'icône lucide utilisée pour l'illustration (src/components/ProductArt.tsx). */
  icone: string;
  /** Optionnel : chemin d'une vraie photo, ex. '/produits/parasol.jpg' (dossier public/produits). */
  image?: string;
  badge?: string;
}

export interface Categorie {
  id: string;
  nom: string;
}

export const CATEGORIES: Record<Saison, Categorie[]> = {
  ete: [
    { id: 'plage', nom: 'À la plage' },
    { id: 'chaleur', nom: 'Contre la chaleur' },
    { id: 'eau', nom: 'Dans l’eau' },
    { id: 'soleil', nom: 'Sous le soleil' },
    { id: 'soiree-ete', nom: 'Soirées dehors' },
  ],
  hiver: [
    { id: 'maison', nom: 'Au chaud chez soi' },
    { id: 'dehors', nom: 'Dehors' },
    { id: 'voiture', nom: 'En voiture' },
    { id: 'neige', nom: 'À la neige' },
    { id: 'cosy', nom: 'Soirées cosy' },
  ],
};

export const PRODUITS: Produit[] = [
  // ───────────── ÉTÉ ─────────────
  {
    id: 'ete-parasol',
    saison: 'ete',
    categorie: 'plage',
    titre: 'Parasol de plage anti-UV',
    prix: 29.9,
    resume: 'Grand parasol inclinable qui tient même quand le vent se lève.',
    description:
      'Un parasol de 2 m avec toile anti-UV et pied à visser dans le sable. Il s’incline pour suivre le soleil et se range dans sa housse de transport.',
    points: ['Toile anti-UV 50+', 'Diamètre 2 m, inclinable', 'Pied à vis pour le sable', 'Housse de transport incluse'],
    icone: 'Umbrella',
    badge: 'Le plus demandé',
  },
  {
    id: 'ete-serviette',
    saison: 'ete',
    categorie: 'plage',
    titre: 'Serviette microfibre XXL',
    prix: 19.9,
    resume: 'Sèche en un rien de temps et ne garde pas le sable.',
    description:
      'Une serviette 180 × 90 cm en microfibre, légère et compacte. Le sable glisse dessus au lieu de s’y accrocher, et elle sèche bien plus vite que le coton.',
    points: ['180 × 90 cm', 'Séchage rapide', 'Anti-sable', 'Pochette de rangement'],
    variantes: [{ nom: 'Couleur', options: ['Bleu lagon', 'Jaune soleil', 'Rayée marine'] }],
    icone: 'TreePalm',
  },
  {
    id: 'ete-tente',
    saison: 'ete',
    categorie: 'plage',
    titre: 'Tente de plage pop-up',
    prix: 39.9,
    resume: 'S’ouvre en deux secondes pour mettre les enfants à l’ombre.',
    description:
      'Une tente qui se déplie toute seule, avec protection anti-UV et poches à remplir de sable pour la stabiliser. Idéale pour la sieste des petits.',
    points: ['Ouverture instantanée', 'Protection anti-UV', '2 à 3 personnes', 'Poches lestables'],
    icone: 'Tent',
  },
  {
    id: 'ete-raquettes',
    saison: 'ete',
    categorie: 'plage',
    titre: 'Kit raquettes de plage',
    prix: 14.9,
    resume: 'Deux raquettes et des balles pour jouer sur le sable.',
    description:
      'Le classique des après-midis à la plage : deux raquettes en bois résistantes à l’eau et plusieurs balles, dans un sac filet facile à emporter.',
    points: ['2 raquettes', 'Balles incluses', 'Sac filet', 'Dès 6 ans'],
    icone: 'Volleyball',
  },
  {
    id: 'ete-ventilateur',
    saison: 'ete',
    categorie: 'chaleur',
    titre: 'Ventilateur portable rechargeable',
    prix: 19.9,
    resume: 'Un souffle frais à la main, sur le bureau ou dans le train.',
    description:
      'Petit ventilateur à main pliable avec batterie rechargeable en USB-C. Il se pose sur son socle pour rafraîchir un bureau ou une table de chevet.',
    points: ['3 vitesses', 'Batterie rechargeable USB-C', 'Pliable avec socle', 'Silencieux'],
    variantes: [{ nom: 'Couleur', options: ['Blanc', 'Bleu', 'Rose'] }],
    icone: 'Fan',
    badge: 'Spécial canicule',
  },
  {
    id: 'ete-ventilateur-cou',
    saison: 'ete',
    categorie: 'chaleur',
    titre: 'Ventilateur de cou mains libres',
    prix: 24.9,
    resume: 'Se porte autour du cou, sans hélice apparente.',
    description:
      'Un ventilateur en arceau qui se pose sur les épaules et souffle vers le visage et la nuque. Pratique en ville, en randonnée ou en cuisine.',
    points: ['Mains libres', 'Sans hélice apparente', '3 vitesses', 'Recharge USB-C'],
    icone: 'Wind',
  },
  {
    id: 'ete-glaciere',
    saison: 'ete',
    categorie: 'chaleur',
    titre: 'Glacière rigide 25 L',
    prix: 34.9,
    resume: 'Garde les boissons fraîches toute la journée.',
    description:
      'Une glacière rigide bien isolée avec poignée de transport. On y glisse des pains de glace le matin et les boissons sont encore fraîches le soir.',
    points: ['Capacité 25 L', 'Isolation renforcée', 'Poignée de transport', 'Tient des bouteilles de 1,5 L debout'],
    icone: 'Refrigerator',
  },
  {
    id: 'ete-gourde',
    saison: 'ete',
    categorie: 'chaleur',
    titre: 'Gourde isotherme inox 750 ml',
    prix: 17.9,
    resume: 'De l’eau fraîche même après une journée au soleil.',
    description:
      'Une gourde en acier inoxydable à double paroi qui garde l’eau fraîche pendant des heures. Sans BPA, elle remplace les bouteilles en plastique.',
    points: ['750 ml', 'Double paroi isotherme', 'Inox sans BPA', 'Bouchon étanche'],
    variantes: [{ nom: 'Couleur', options: ['Bleu nuit', 'Turquoise', 'Blanc'] }],
    icone: 'GlassWater',
  },
  {
    id: 'ete-pochette',
    saison: 'ete',
    categorie: 'eau',
    titre: 'Pochette étanche pour smartphone',
    prix: 9.9,
    resume: 'Ton téléphone au sec, même dans l’eau.',
    description:
      'Une pochette transparente qui protège le téléphone du sable et de l’eau. L’écran reste utilisable à travers, pour prendre des photos au bord de l’eau.',
    points: ['Étanche', 'Écran tactile utilisable', 'Cordon tour de cou', 'Compatible avec la plupart des téléphones'],
    icone: 'Smartphone',
  },
  {
    id: 'ete-enceinte',
    saison: 'ete',
    categorie: 'eau',
    titre: 'Enceinte Bluetooth étanche',
    prix: 29.9,
    resume: 'La musique à la plage ou au bord de la piscine.',
    description:
      'Une enceinte compacte résistante à l’eau et au sable, avec une bonne autonomie pour tenir toute l’après-midi.',
    points: ['Résiste aux éclaboussures', 'Bluetooth', 'Autonomie longue durée', 'Dragonne de transport'],
    icone: 'Speaker',
  },
  {
    id: 'ete-bouee',
    saison: 'ete',
    categorie: 'eau',
    titre: 'Matelas gonflable piscine',
    prix: 19.9,
    resume: 'Pour flotter tranquillement à la piscine ou à la mer.',
    description:
      'Un matelas gonflable confortable avec appui-tête intégré. Il se gonfle vite avec une pompe et se replie dans un petit sac.',
    points: ['Appui-tête intégré', 'PVC résistant', 'Valves rapides', 'Kit de réparation inclus'],
    icone: 'LifeBuoy',
  },
  {
    id: 'ete-chaussures-eau',
    saison: 'ete',
    categorie: 'eau',
    titre: 'Chaussures aquatiques',
    prix: 16.9,
    resume: 'Protègent des galets, des oursins et du sable brûlant.',
    description:
      'Des chaussures légères qui sèchent vite, avec une semelle antidérapante. Elles se portent dans l’eau comme sur les rochers.',
    points: ['Semelle antidérapante', 'Séchage rapide', 'Légères et souples', 'Mixte'],
    variantes: [{ nom: 'Pointure', options: ['36-37', '38-39', '40-41', '42-43', '44-45'] }],
    icone: 'Footprints',
  },
  {
    id: 'ete-lunettes',
    saison: 'ete',
    categorie: 'soleil',
    titre: 'Lunettes de soleil polarisées',
    prix: 19.9,
    resume: 'Moins d’éblouissement sur l’eau et sur la route.',
    description:
      'Des verres polarisés catégorie 3 qui coupent les reflets sur l’eau et le sable. Livrées avec un étui rigide et une chiffonnette.',
    points: ['Verres polarisés', 'Protection UV400', 'Catégorie 3', 'Étui rigide inclus'],
    variantes: [{ nom: 'Monture', options: ['Noire', 'Écaille', 'Transparente'] }],
    icone: 'Glasses',
  },
  {
    id: 'ete-chapeau',
    saison: 'ete',
    categorie: 'soleil',
    titre: 'Chapeau anti-UV UPF 50+',
    prix: 17.9,
    resume: 'Larges bords pour protéger le visage et la nuque.',
    description:
      'Un chapeau léger en tissu anti-UV, avec cordon de serrage pour qu’il ne s’envole pas. Il se plie dans un sac sans se déformer.',
    points: ['Indice UPF 50+', 'Larges bords', 'Cordon anti-vent', 'Pliable'],
    variantes: [{ nom: 'Taille', options: ['S/M', 'L/XL'] }],
    icone: 'Sun',
  },
  {
    id: 'ete-guirlande',
    saison: 'ete',
    categorie: 'soiree-ete',
    titre: 'Guirlande solaire guinguette',
    prix: 21.9,
    resume: 'S’allume seule à la tombée de la nuit, sans prise.',
    description:
      'Une guirlande à grosses ampoules qui se recharge au soleil la journée et s’allume automatiquement le soir. Parfaite pour une terrasse ou un balcon.',
    points: ['Recharge solaire', 'Allumage automatique', 'Résiste à la pluie', 'Environ 10 m'],
    icone: 'Lightbulb',
  },
  {
    id: 'ete-anti-moustique',
    saison: 'ete',
    categorie: 'soiree-ete',
    titre: 'Lampe anti-moustiques rechargeable',
    prix: 24.9,
    resume: 'Des soirées dehors sans se faire piquer.',
    description:
      'Une lampe à lumière UV qui attire et élimine les moustiques, sans produit chimique. Elle se recharge en USB et s’accroche ou se pose.',
    points: ['Sans produit chimique', 'Recharge USB', 'Silencieuse', 'Intérieur et extérieur'],
    icone: 'Bug',
  },

  // ───────────── HIVER ─────────────
  {
    id: 'hiver-plaid',
    saison: 'hiver',
    categorie: 'maison',
    titre: 'Plaid chauffant électrique',
    prix: 49.9,
    resume: 'Tout doux et chaud, pour chauffer la personne plutôt que la pièce.',
    description:
      'Un plaid en polaire douce avec plusieurs niveaux de chaleur et un arrêt automatique. Il se lave en machine une fois le boîtier débranché.',
    points: ['Plusieurs niveaux de chaleur', 'Arrêt automatique', 'Lavable en machine', '160 × 130 cm'],
    icone: 'Sofa',
    badge: 'Le plus demandé',
  },
  {
    id: 'hiver-bouillotte',
    saison: 'hiver',
    categorie: 'maison',
    titre: 'Bouillotte électrique rechargeable',
    prix: 19.9,
    resume: 'Chaude en quelques minutes, sans eau bouillante.',
    description:
      'Une bouillotte qui se recharge sur secteur et garde la chaleur pendant des heures. Housse en peluche amovible, idéale au lit ou sur le canapé.',
    points: ['Chauffe en quelques minutes', 'Sans eau à faire bouillir', 'Housse douce amovible', 'Garde la chaleur longtemps'],
    icone: 'Heater',
  },
  {
    id: 'hiver-chaussons',
    saison: 'hiver',
    categorie: 'maison',
    titre: 'Chaussons fourrés',
    prix: 22.9,
    resume: 'Les pieds au chaud sur le carrelage froid.',
    description:
      'Des chaussons doublés de fausse fourrure avec une semelle antidérapante, pour marcher dans toute la maison sans glisser.',
    points: ['Doublure fausse fourrure', 'Semelle antidérapante', 'Mousse à mémoire de forme', 'Mixte'],
    variantes: [{ nom: 'Pointure', options: ['36-37', '38-39', '40-41', '42-43', '44-45'] }],
    icone: 'Footprints',
  },
  {
    id: 'hiver-chaussettes',
    saison: 'hiver',
    categorie: 'maison',
    titre: 'Chaussettes en laine (lot de 3)',
    prix: 15.9,
    resume: 'Épaisses et chaudes, pour la maison ou les chaussures de rando.',
    description:
      'Un lot de trois paires de chaussettes épaisses en laine mélangée, chaudes sans être trop serrées.',
    points: ['Lot de 3 paires', 'Laine mélangée', 'Bord souple', 'Mixte'],
    variantes: [{ nom: 'Pointure', options: ['35-38', '39-42', '43-46'] }],
    icone: 'Leaf',
  },
  {
    id: 'hiver-gants',
    saison: 'hiver',
    categorie: 'dehors',
    titre: 'Gants tactiles doublés',
    prix: 14.9,
    resume: 'Répondre au téléphone sans enlever ses gants.',
    description:
      'Des gants doublés polaire avec le bout des doigts compatible écran tactile, et une paume antidérapante pour tenir le téléphone.',
    points: ['Bouts des doigts tactiles', 'Doublure polaire', 'Paume antidérapante', 'Coupe-vent'],
    variantes: [{ nom: 'Taille', options: ['S', 'M', 'L', 'XL'] }],
    icone: 'Hand',
  },
  {
    id: 'hiver-bonnet',
    saison: 'hiver',
    categorie: 'dehors',
    titre: 'Bonnet doublé polaire',
    prix: 12.9,
    resume: 'Maille épaisse dehors, polaire douce dedans.',
    description:
      'Un bonnet en maille côtelée doublé de polaire, qui garde les oreilles au chaud sans gratter.',
    points: ['Doublure polaire', 'Ne gratte pas', 'Taille unique extensible', 'Mixte'],
    variantes: [{ nom: 'Couleur', options: ['Noir', 'Marine', 'Rouge', 'Gris chiné'] }],
    icone: 'CloudSnow',
  },
  {
    id: 'hiver-chauffe-mains',
    saison: 'hiver',
    categorie: 'dehors',
    titre: 'Chauffe-mains rechargeable',
    prix: 24.9,
    resume: 'Chaleur de poche qui sert aussi de batterie de secours.',
    description:
      'Un chauffe-mains compact qui chauffe en quelques secondes, avec plusieurs niveaux. Sa batterie peut aussi recharger un téléphone.',
    points: ['Chauffe en quelques secondes', 'Plusieurs niveaux', 'Fait batterie de secours', 'Recharge USB-C'],
    icone: 'Flame',
    badge: 'Idée cadeau',
  },
  {
    id: 'hiver-tour-de-cou',
    saison: 'hiver',
    categorie: 'dehors',
    titre: 'Tour de cou polaire',
    prix: 11.9,
    resume: 'Plus pratique qu’une écharpe, il ne se défait jamais.',
    description:
      'Un tour de cou en polaire qui se remonte sur le nez quand le vent souffle. Parfait à vélo, à trottinette ou au ski.',
    points: ['Polaire douce', 'Se remonte sur le nez', 'Taille unique', 'Lavable en machine'],
    icone: 'Wind',
  },
  {
    id: 'hiver-raclette',
    saison: 'hiver',
    categorie: 'voiture',
    titre: 'Grattoir à givre avec gant',
    prix: 9.9,
    resume: 'Un pare-brise dégagé en deux minutes, la main au chaud.',
    description:
      'Un grattoir à lame robuste intégré dans un gant imperméable doublé, pour dégivrer sans se geler les doigts.',
    points: ['Lame robuste', 'Gant imperméable doublé', 'Ne raye pas le verre', 'Se range dans la portière'],
    icone: 'Snowflake',
  },
  {
    id: 'hiver-bache',
    saison: 'hiver',
    categorie: 'voiture',
    titre: 'Bâche pare-brise antigel',
    prix: 16.9,
    resume: 'Plus besoin de gratter le matin.',
    description:
      'Une bâche qui se pose le soir sur le pare-brise et se coince dans les portières. Le matin, on l’enlève et le pare-brise est propre.',
    points: ['Pose en 30 secondes', 'Protège les essuie-glaces', 'Rabats dans les portières', 'Taille universelle'],
    icone: 'CarFront',
  },
  {
    id: 'hiver-masque-ski',
    saison: 'hiver',
    categorie: 'neige',
    titre: 'Masque de ski anti-buée',
    prix: 29.9,
    resume: 'Vision claire sur les pistes, même par grand soleil.',
    description:
      'Un masque à double écran anti-buée avec protection UV, compatible avec le port d’un casque et de lunettes de vue.',
    points: ['Double écran anti-buée', 'Protection UV', 'Compatible casque', 'Compatible lunettes de vue'],
    icone: 'Glasses',
  },
  {
    id: 'hiver-crampons',
    saison: 'hiver',
    categorie: 'neige',
    titre: 'Crampons antidérapants',
    prix: 14.9,
    resume: 'S’enfilent sur les chaussures pour marcher sur le verglas.',
    description:
      'Des crampons en caoutchouc avec pointes en acier, qui s’enfilent sur n’importe quelles chaussures pour marcher en sécurité sur la neige et le verglas.',
    points: ['Pointes en acier', 'S’enfilent en quelques secondes', 'Caoutchouc souple', 'Pochette de rangement'],
    variantes: [{ nom: 'Taille', options: ['S (35-38)', 'M (39-42)', 'L (43-46)'] }],
    icone: 'MountainSnow',
  },
  {
    id: 'hiver-luge',
    saison: 'hiver',
    categorie: 'neige',
    titre: 'Luge enfant avec frein',
    prix: 24.9,
    resume: 'La sortie neige préférée des enfants.',
    description:
      'Une luge légère en plastique résistant, avec poignées de frein et cordon de traction pour la remonter facilement.',
    points: ['Poignées de frein', 'Cordon de traction', 'Plastique résistant au froid', 'Dès 3 ans'],
    icone: 'Mountain',
  },
  {
    id: 'hiver-guirlande',
    saison: 'hiver',
    categorie: 'cosy',
    titre: 'Guirlande LED blanc chaud',
    prix: 14.9,
    resume: 'Une lumière douce pour les longues soirées.',
    description:
      'Une guirlande à fil cuivré fin avec des LED blanc chaud, plusieurs modes d’éclairage et une télécommande.',
    points: ['Blanc chaud', 'Télécommande', 'Plusieurs modes', 'Environ 10 m'],
    icone: 'Sparkle',
  },
  {
    id: 'hiver-bougies',
    saison: 'hiver',
    categorie: 'cosy',
    titre: 'Bougies LED effet flamme (lot de 6)',
    prix: 17.9,
    resume: 'L’ambiance des bougies, sans risque de feu.',
    description:
      'Six bougies LED en vraie cire avec une flamme qui vacille comme une vraie. Minuteur intégré et télécommande.',
    points: ['Lot de 6', 'Vraie cire', 'Minuteur intégré', 'Télécommande incluse'],
    icone: 'Lamp',
  },
  {
    id: 'hiver-thermos',
    saison: 'hiver',
    categorie: 'cosy',
    titre: 'Thermos isotherme 1 L',
    prix: 21.9,
    resume: 'Thé ou chocolat chaud pour toute la balade.',
    description:
      'Une bouteille isotherme en inox qui garde les boissons chaudes pendant des heures, avec un bouchon qui sert de tasse.',
    points: ['1 litre', 'Garde le chaud des heures', 'Bouchon-tasse', 'Inox sans BPA'],
    icone: 'Coffee',
  },
];

export function produitsDeLaSaison(saison: Saison): Produit[] {
  return PRODUITS.filter((p) => p.saison === saison);
}

export function trouverProduit(id: string): Produit | undefined {
  return PRODUITS.find((p) => p.id === id);
}
