import { Product, ShopifySection, ShopifyTheme } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    title: 'Template Notion Business',
    handle: 'template-notion-business-ultime',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.9,
    reviewCount: 124,
    summary: 'Gérez votre activité de A à Z avec rigueur. Inclus : dashboard global, gestion de projets, CRM clients et suivi financier complet.',
    description: 'Le système complet pour piloter votre entreprise en toute sérénité. Ce template haut de gamme regroupe un tableau de bord décisionnel, un suivi complet des revenus et dépenses, un gestionnaire de projet avancé, un CRM clients complet pour suivre vos prospects et contrats, ainsi qu’une zone d’objectifs et tâches quotidiennes.',
    images: [
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Licence d’utilisation', values: ['Usage Personnel', 'Usage Commercial / Licence Agence'] }
    ],
    badges: ['Plus populaire'],
    specs: [
      { label: 'Format', value: 'Espace de travail Notion (Lien duplicable)' },
      { label: 'Compatibilité', value: 'Notion (Compte gratuit suffisant)' },
      { label: 'Livraison', value: 'Téléchargement immédiat par e-mail' },
      { label: 'Accès', value: 'Lien de duplication immédiate et accès à vie' }
    ],
    tags: ['Notion', 'Business', 'Comptabilité', 'CRM', 'Projets'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_2',
    title: 'Template de Gestion de Budget Mensuel',
    handle: 'template-gestion-budget-mensuel',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.8,
    reviewCount: 93,
    summary: 'Prenez le contrôle optimal de vos finances personnelles avec ce système interactif d\'enveloppes budgétaires, revenus et d’épargne.',
    description: 'Dites adieu au stress des fins de mois. Ce template hautement interactif rassemble tous les modules indispensables pour maîtriser votre argent au quotidien : suivi millimétré des revenus et dépenses par catégories, gestionnaire d\'enveloppes d\'épargne virtuelles, projections financières automatiques et simulateur d\'objectifs d\'épargne pour vos futurs projets.',
    images: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Plateforme', values: ['Notion Épuré', 'Google Sheets Intelligent'] }
    ],
    badges: ['Plus populaire'],
    specs: [
      { label: 'Compatibilité', value: 'Notion ou Google Sheets' },
      { label: 'Langue', value: 'Français complet' },
      { label: 'Type', value: 'Calculateur budgétaire interactif' },
      { label: 'Livraison', value: 'Lien sécurisé immédiat à vie' }
    ],
    tags: ['Budget', 'Finances', 'Épargne', 'Notion', 'Google Sheets'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_3',
    title: 'Calendrier Éditorial Réseaux Sociaux',
    handle: 'calendrier-editorial-reseaux-sociaux',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.7,
    reviewCount: 78,
    summary: 'Planifiez, rédigez et suivez tout votre contenu Instagram, TikTok, YouTube et Facebook sur un seul écran unifié.',
    description: 'Ne manquez plus jamais d’inspiration pour votre audience. Ce calendrier éditorial ultra-complet vous permet de structurer votre stratégie de contenu de A à Z : banque à idées thématique, vue d\'avancement de rédaction, scripts prêts à l\'emploi pour vidéos courtes (Reels, Shorts, TikTok) et tableaux de bord pour analyser la performance de vos publications.',
    images: [
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Format de Planification', values: ['Notion Social-Hub', 'Google Calendar Sync'] }
    ],
    badges: ['Plus populaire'],
    specs: [
      { label: 'Plateformes', value: 'Instagram, TikTok, YouTube, Facebook, LinkedIn' },
      { label: 'Inclus', value: '10 trames de scripts à fort taux d\'engagement' },
      { label: 'Format', value: 'Template Notion interactif' },
      { label: 'Bonus', value: 'Espace d\'archivage des visuels Canva' }
    ],
    tags: ['Marketing', 'Réseaux Sociaux', 'Productivité', 'Notion'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_4',
    title: 'CRM Clients & Prospects',
    handle: 'crm-clients-prospects',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.8,
    reviewCount: 62,
    summary: 'Optimisez vos ventes et votre prospection. Visualisez votre pipeline de vente, centralisez vos fiches et organisez vos relances.',
    description: 'Ne perdez plus aucune affaire commerciale. Ce CRM puissant mais extrêmement simple d’utilisation centralise l\'historique de vos relations clients. Il vous donne une visibilité complète de vos affaires en cours sous forme de pipeline Kanban intuitif, avec un gestionnaire d\'alertes automatisé pour programmer vos relances cruciales sans jamais oublier un prospect.',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1552581230-c01bc0d48403?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Volume de contacts', values: ['Version Solo Freelance', 'Version Équipe / Partagé'] }
    ],
    badges: ['Plus populaire'],
    specs: [
      { label: 'Usage principal', value: 'Suivi commercial et négociation' },
      { label: 'Fichier requis', value: 'Compte Notion (gratuit)' },
      { label: 'Avantage', value: 'Sans abonnement récurrent' },
      { label: 'Tutoriel', value: 'Inclus pas-à-pas' }
    ],
    tags: ['CRM', 'Prospects', 'Ventes', 'Freelance', 'Notion'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_5',
    title: 'Tracker d’Habitudes Mensuel',
    handle: 'tracker-habitudes-mensuel',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.9,
    reviewCount: 112,
    summary: 'Développez une discipline de fer, suivez vos routines au quotidien et visualisez vos statistiques de réussite en temps réel.',
    description: 'Transformez vos journées grâce au pouvoir des micro-habitudes. Le Tracker d’Habitudes Mensuel combine un calendrier esthétique et des automatisations de pourcentages pour vous aider à enregistrer vos rituels matinaux, séances sportives, lectures et heures de repos. Idéal pour conserver une motivation sans faille et mesurer précisément votre progression.',
    images: [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Thème Visuel', values: ['Minimalist Noir & Blanc', 'Style Éco-Teal', 'Teinte Pastel Douce'] }
    ],
    badges: ['Plus populaire'],
    specs: [
      { label: 'Indicateur', value: 'Calculateur de taux de régularité annuel' },
      { label: 'Format', value: 'Template Notion digital' },
      { label: 'Prise en main', value: 'Immédiate (moins de 2 minutes)' },
      { label: 'Utilité', value: 'Duplication infinie et utilisation à vie' }
    ],
    tags: ['Habitudes', 'Routines', 'Discipline', 'Organisation', 'Notion'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_6',
    title: 'Planner de Voyage Complet',
    handle: 'planner-voyage-complet',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.7,
    reviewCount: 41,
    summary: 'Planifiez vos voyages sans stress : itinéraires détaillés jour par jour, gestion du budget de vacances et checklists centralisées.',
    description: 'Voyagez l’esprit entièrement serein. Ce planner numérique d’exception rassemble l\'intégralité des informations de vos aventures au même endroit : planification quotidienne des activités, comparateur d\'hébergements et de transports, module de budget automatisé et checklists de bagages personnalisables pour ne plus rien oublier.',
    images: [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Fichiers', values: ['Version Notion seule', 'Version Notion + Packs d’itinéraires types'] }
    ],
    badges: ['Plus populaire'],
    specs: [
      { label: 'Appareils compatibles', value: 'Mobiles, Tablettes et Ordinateurs' },
      { label: 'Inclus', value: 'Checklists bagages thématiques (séjours été / montagne)' },
      { label: 'Outil de base', value: 'Notion' },
      { label: 'Langue', value: 'Français' }
    ],
    tags: ['Voyage', 'Planificateur', 'Checklists', 'Notion', 'Organisation'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_7',
    title: 'Tracker Fitness Complet',
    handle: 'tracker-fitness-complet',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.8,
    reviewCount: 54,
    summary: 'Suivez vos entraînements physiques, pilotez votre nutrition et observez vos progrès sur un dashboard moderne et motivant.',
    description: 'Sculptez votre quotidien et atteignez vos sommets physiques. Ce Tracker Fitness réunit un carnet d’entraînement virtuel complet (exercices, séries, répétitions, historique de charges), un planificateur alimentaire quotidien avec comptage de macronutriments, et un tableau de suivi des progressions corporelles et photos.',
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Modèle de Suivi', values: ['Musculation & Fitness', 'Running & Endurance', 'Hybride Multisports'] }
    ],
    badges: ['Plus populaire'],
      specs: [
        { label: 'Contenu', value: 'Base de données de plus de 60 exercices types' },
        { label: 'Prise en main', value: 'Lien immédiat suite à validation' },
        { label: 'Format', value: 'Notion Template' },
        { label: 'Accès', value: 'Illimité à vie' }
      ],
    tags: ['Fitness', 'Santé', 'Muscle', 'Nutrition', 'Notion'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_8',
    title: 'Planner Étudiant Ultime',
    handle: 'planner-etudiant-ultime',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.9,
    reviewCount: 88,
    summary: 'Organisez vos études intelligemment : matières, devoirs, examens, révisions avec fiches Active Recall et minuteur Pomodoro.',
    description: 'Le compagnon parfait pour valider votre année sans stresser. Spécialement optimisé pour l\'apprentissage, ce dashboard réunit un planning de cours interconnecté with les devoirs, un gestionnaire de notes pour simuler vos moyennes continues, des fiches de mémorisation basées sur la répétition espacée, ainsi qu\'un outil Pomodoro intégré pour stimuler votre attention.',
    images: [
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Niveau d\'études', values: ['Lycée & Classes Préparatoires', 'Université / Études Supérieures'] }
    ],
    badges: ['Plus populaire'],
    specs: [
      { label: 'Méthodologies intégrées', value: 'Active Recall, Spaced Repetition, Kanban' },
      { label: 'Accès requis', value: 'Notion (Entièrement géré sur le forfait gratuit)' },
      { label: 'Documentation', value: 'Tutoriel vidéo explicatif inclus' },
      { label: 'Langue', value: 'Français' }
    ],
    tags: ['Étudiant', 'Études', 'Révisions', 'Examens', 'Notion'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_9',
    title: 'Dashboard Investissements',
    handle: 'dashboard-investissements',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.8,
    reviewCount: 47,
    summary: 'Pilotez votre portefeuille global (bourse, actions, crypto, ETF, or) depuis un tableau d\'indicateurs unique.',
    description: 'Suivez la croissance nette de votre patrimoine en temps réel. Saisissez confidentiellement vos lignes d\'actifs pour obtenir une répartition graphique automatisée de votre allocation. Calculez vos dividendes prévus, gérez vos intérêts composés et suivez vos performances financières globales sans feuille de calcul complexe.',
    images: [
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Devise de référence', values: ['Euros (€)', 'Dollars ($)'] }
    ],
    badges: ['Plus populaire'],
    specs: [
      { label: 'Actifs gérés', value: 'Bourse, ETF, Crypto-monnaies, Immobilier, SCPI, Or' },
      { label: 'Formules', value: 'Calculateurs de plus-values latentes intégrés' },
      { label: 'Sécurité', value: 'Données 100% privées stockées sur votre eigen Notion' },
      { label: 'Format', value: 'Notion Advanced Template' }
    ],
    tags: ['Investissement', 'Bourse', 'Crypto', 'Patrimoine', 'Notion'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_10',
    title: 'Organisateur de Mariage Complet',
    handle: 'organisateur-mariage-complet',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.9,
    reviewCount: 33,
    summary: 'Préparez votre mariage sereinement de A à Z : gestion du budget, liste des invités (RSVP), plan de table et prestataires.',
    description: 'Parce que les préparatifs de votre mariage doivent être synonymes de magie plutôt que d’anxiété, cette plateforme de planification d\'exception structure chaque étape clé : rétroplanning mensuel intelligent, suivi financier global, fiches d\'évaluation des prestataires logistiques et outil interactif pour attribuer et équilibrer vos plans de table.',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Type d\'édition', values: ['Édition Spécifique Moderne', 'Édition Traditionnelle Épurée'] }
    ],
    badges: ['Plus populaire'],
    specs: [
      { label: 'Destiné à', value: 'Futurs mariés & Event Planners' },
      { label: 'Format d’envoi', value: 'Lien instantané sécurisé Notion' },
      { label: 'Langue', value: 'Français complet' },
      { label: 'Utilisation', value: 'Sur smartphone, tablette et PC' }
    ],
    tags: ['Mariage', 'Organisation', 'Planificateur', 'Prestataires', 'Notion'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_11',
    title: 'Dashboard Freelance Pro',
    handle: 'dashboard-freelance-pro',
    price: 24.99,
    compareAtPrice: 49.0,
    rating: 4.9,
    reviewCount: 82,
    summary: 'Le centre névralgique pour gérer votre micro-entreprise : devis, suivi des factures, projets clients et déclarations.',
    description: 'Prenez soin de votre activité d’indépendant. Ce dashboard intelligent rassemble l’ensemble de votre gestion administrative et opérationnelle : suivi de projets (format Kanban/Gantt), chronométrage en direct pour calculer votre taux horaire facturable, générateur automatique de fiches de facturation et base de suivi mensuelle de votre chiffre d’affaires net.',
    images: [
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000'
    ],
    variants: [
      { name: 'Régime Fiscal', values: ['Micro-Entreprise (France)', 'Régime standard International'] }
    ],
    badges: ['Plus populaire'],
    specs: [
      { label: 'Modules clés', value: 'Time tracker, devis, facturation, CA' },
      { label: 'Compatibilité', value: 'Notion gratuit ou payant' },
      { label: 'Livraison', value: 'Par e-mail instantanément à vie' },
      { label: 'Assistance', value: 'Inclus' }
    ],
    tags: ['Freelance', 'Micro-entreprise', 'Business', 'Notion', 'Productivité'],
    inStock: true,
    inventoryCount: 999,
  },
  {
    id: 'prod_12',
    title: 'Template Personnalisé sur Mesure',
    handle: 'template-personnalise-sur-mesure',
    price: 34.99,
    compareAtPrice: 69.0,
    rating: 5.0,
    reviewCount: 0,
    summary: 'Tu as une idée précise de l\'outil dont tu as besoin ? Je crée ton template sur mesure selon tes besoins exacts.',
    description: 'Décris-moi exactement ce que tu veux : organisation, business, finances, suivi, planning... Je conçois ton template 100% personnalisé. Délai de livraison : 24 à 48h après ta commande. Prix unique : 34.99€.',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000'],
    variants: [],
    badges: ['Sur mesure'],
    specs: [
      { label: 'Délai', value: '24 à 48h après commande' },
      { label: 'Livraison', value: 'Par email' },
      { label: 'Révisions', value: '1 révision incluse' },
      { label: 'Contact', value: 'yaakoubabid77@gmail.com' }
    ],
    tags: ['Personnalisé', 'Sur mesure', 'Custom'],
    inStock: true,
    inventoryCount: 999,
    customField: true,
  },
  {
    id: 'prod_test',
    title: 'Template Test Gratuit',
    handle: 'template-test-gratuit',
    price: 0.00,
    compareAtPrice: null,
    rating: 5.0,
    reviewCount: 0,
    summary: 'Produit de test uniquement.',
    description: 'Produit de test pour vérifier le système de paiement.',
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000'],
    variants: [],
    badges: ['Test'],
    specs: [],
    tags: ['test'],
    inStock: true,
    inventoryCount: 999,
  }
];

export const THEME_PRESETS: Record<string, ShopifyTheme> = {
  dawn: {
    id: 'dawn',
    name: 'Dawn (Modern)',
    description: 'Minimalist, crisp, with high-contrast text and sleek light grids. Excellent for general retail and bold imagery.',
    settings: {
      primaryColor: '#121212',
      backgroundColor: '#FFFFFF',
      cardBackgroundColor: '#F9FAFB',
      textColor: '#121212',
      textColorSecondary: '#4B5563',
      accentColor: '#10B981', // Emerald primary for digital trust
      buttonRadius: 'sm',
      cardRadius: 'md',
      fontFamily: 'sans',
      uppercaseButtons: false,
      showBorders: true,
      borderWidth: 1,
    },
  },
  prestige: {
    id: 'prestige',
    name: 'Prestige (Luxury)',
    description: 'Designed for high-end boutique stores. Uses luxury serif headings, no borders, clean letter-spacing, and warm sand/gold accents.',
    settings: {
      primaryColor: '#1A1A1A',
      backgroundColor: '#FCFCF9',
      cardBackgroundColor: '#FFFFFF',
      textColor: '#1A1A1A',
      textColorSecondary: '#767676',
      accentColor: '#BF9A62', // Warm gold
      buttonRadius: 'none',
      cardRadius: 'none',
      fontFamily: 'serif',
      uppercaseButtons: true,
      showBorders: false,
      borderWidth: 0,
    },
  },
  sense: {
    id: 'sense',
    name: 'Sense (Vibrant)',
    description: 'Pill-shaped containers, friendly rounded lines, soft vibrant backgrounds. Ideal for holistic health, self-care, and lifestyle items.',
    settings: {
      primaryColor: '#004B49', // Deep dark teal
      backgroundColor: '#FEFDF9',
      cardBackgroundColor: '#F4F9F8',
      textColor: '#0B2C24',
      textColorSecondary: '#3F6212',
      accentColor: '#14B8A6', // Teal bright
      buttonRadius: 'full',
      cardRadius: 'xl',
      fontFamily: 'sans',
      uppercaseButtons: false,
      showBorders: false,
      borderWidth: 0,
    },
  },
  craft: {
    id: 'craft',
    name: 'Craft (Artisanal)',
    description: 'Warm sandy paper tones, dark charcoal typography, elegant borders. Celebrates hand-drawn, sustainable, and handmade craft items.',
    settings: {
      primaryColor: '#2B2927',
      backgroundColor: '#F5F2EC', // Sandy beige
      cardBackgroundColor: '#EBE7DF',
      textColor: '#2B2927',
      textColorSecondary: '#666159',
      accentColor: '#D97706', // Warm amber
      buttonRadius: 'sm',
      cardRadius: 'sm',
      fontFamily: 'serif',
      uppercaseButtons: true,
      showBorders: true,
      borderWidth: 1,
    },
  },
};

export const DEFAULT_SECTIONS: ShopifySection[] = [
  {
    id: 'announcement',
    type: 'announcement',
    enabled: true,
    name: 'Announcement Bar',
    settings: {
      text: '✨ ALL template • Tous nos templates digitaux à 24.99€ seulement • Livraison instantanée par email 📩',
      backgroundColor: '#121212',
      textColor: '#FFFFFF',
      closable: false,
      linkText: 'Accéder au catalogue',
    },
  },
  {
    id: 'header',
    type: 'header',
    enabled: true,
    name: 'Header Navigation',
    settings: {
      logoText: 'ALL template',
      transparentHeader: false,
      sticky: true,
      showSearch: true,
      menuLinks: ['Notre Catalogue', 'Business', 'Finance Personnel', 'Bien-être & Routines', 'FAQ'],
    },
  },
  {
    id: 'hero',
    type: 'hero',
    enabled: true,
    name: 'Hero Banner',
    settings: {
      heading: "S'organiser n'a jamais été aussi simple",
      subheading: "Des templates professionnels, interactifs et prêts à l'emploi sur Notion pour piloter votre quotidien, votre business et vos investissements. Tarif unique de 24.99€, livraison instantanée par e-mail.",
      buttonText: 'Parcourir nos templates',
      secondaryButtonText: 'Pourquoi nos outils ?',
      overlayOpacity: 45,
      imageSrc: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1800',
      alignment: 'center', // 'left' | 'center' | 'right'
      bannerHeight: 'medium', // 'small' | 'medium' | 'large'
    },
  },
  {
    id: 'features',
    type: 'features-grid',
    enabled: true,
    name: 'Features & Values',
    settings: {
      title: 'L\'excellence de l\'organisation digitale',
      subtitle: 'Toutes nos solutions d\'organisation sont construites pour être esthétiques, fluides et duplicables en 1 clic.',
      cols: 3,
      items: [
        {
          icon: 'Truck',
          title: 'Livraison Instantanée',
          text: 'Accédez à vos templates immédiatement après validation de votre achat par email.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Sûreté & Mises à Jour',
          text: 'Entièrement sécurisé. Nos templates sont mis à jour continuellement pour intégrer les dernières versions Notion.',
        },
        {
          icon: 'Workflow',
          title: 'Zéro Abonnement requis',
          text: 'Payez une seule fois votre outil d’organisation à 24.99€ et profitez-en de manière illimitée à vie.',
        },
      ],
    },
  },
  {
    id: 'product_showcase_1',
    type: 'product-showcase',
    enabled: true,
    name: 'Featured Product Detail',
    settings: {
      heading: 'L\'outil Phare',
      subheading: 'Le Template Notion Business Ultime — Le système complet et performant pour structurer votre aventure entrepreneuriale.',
      productId: 'prod_1',
      showSpecs: true,
      showTags: true,
      enableInstallments: true,
    },
  },
  {
    id: 'rich_text_1',
    type: 'rich-text',
    enabled: true,
    name: 'Rich Text Paragraph',
    settings: {
      title: 'La clarté d\'esprit commence par des outils épurés',
      text: 'Notre collection d\'outils est conçue pour éliminer le superflu. Finies les multiples applications et les notes disséminées : regroupez tous vos processus pro et perso au sein d’environnements magnifiquement pensés pour rester serein et rigoureux.',
      buttonText: 'Notre philosophie produit',
      align: 'center',
    },
  },
  {
    id: 'collection_1',
    type: 'featured-collection',
    enabled: true,
    name: 'Featured Collection Grid',
    settings: {
      title: 'Explorez l’ensemble de notre catalogue',
      subtitle: 'Retrouvez nos 12 templates phares d’organisation digitale. Choisissez ceux adaptés à vos projets.',
      limit: 12,
      columns: 3,
      showRating: true,
      showCompareValue: true,
    },
  },
  {
    id: 'testimonials_1',
    type: 'testimonials',
    enabled: true,
    name: 'Customer Testimonials',
    settings: {
      title: 'Notre communauté s\'organise avec succès',
      items: [
        {
          quote: 'Le template Notion Business Ultime a complètement changé ma rigueur de travail. La gestion des finances est claire et le CRM intégré me fait gagner plusieurs heures chaque semaine.',
          author: 'Farah K.',
          role: 'E-commerçante & Freelance',
          rating: 5,
        },
        {
          quote: 'Tracker d’habitudes et budget au top ! Une finesse de design remarquable sur Notion et une installation rapide. Tout ça pour 24.99€, c’est imbattable.',
          author: 'Sébastien L.',
          role: 'Rédacteur Web',
          rating: 5,
        },
      ],
    },
  },
  {
    id: 'newsletter_1',
    type: 'newsletter',
    enabled: true,
    name: 'Newsletter Sign-Up',
    settings: {
      title: 'Restez informé des nouveaux templates',
      description: 'Inscrivez-vous gratuitement pour recevoir nos guides exclusifs d\'organisation Notion et nos nouveaux mini-outils offerts.',
      placeholder: 'Indiquez votre email',
      buttonText: 'S\'abonner',
      privacyNote: 'Pas de spam, désinscription possible en un clic.',
    },
  },
  {
    id: 'footer_1',
    type: 'footer',
    enabled: true,
    name: 'Multi-Column Footer',
    settings: {
      brandDesc: 'ALL template — Des espaces Notion et classeurs de gestion innovants pour optimiser chaque pilier de votre vie et de vos projets.',
      copyright: '© 2026 ALL template. Tous droits réservés. Boutique de templates 100% digitaux.',
    },
  },
];
