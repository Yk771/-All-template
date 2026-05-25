import React, { useState } from 'react';
import { 
  Star, Truck, ShieldCheck, Workflow, Mail, Search, Menu, ShoppingBag, 
  CheckCircle, ChevronRight, ChevronUp, ChevronDown, AlertCircle, 
  ArrowLeft, Sparkles, Clock, HelpCircle, X, Download, Filter, BookOpen
} from 'lucide-react';
import { ShopifySection, ThemeSettings, Product, CartItem, SelectedVariant } from '../types';
import { PRODUCTS } from '../data/initialData';
import { motion, AnimatePresence } from 'motion/react';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Truck,
  ShieldCheck,
  Workflow
};

const TEMPLATE_PREVIEWS: Record<string, string> = {
  prod_1: '/templates/template-business-ultime.html',
  prod_2: '/templates/template-budget-mensuel.html',
  prod_3: '/templates/template-calendrier-contenu.html',
  prod_4: '/templates/template-suivi-clients.html',
  prod_5: '/templates/template-tracker-habitudes.html',
  prod_6: '/templates/template-planner-voyage.html',
  prod_7: '/templates/template-fitness-tracker.html',
  prod_8: '/templates/template-planner-etudiant.html',
  prod_9: '/templates/template-suivi-investissements.html',
  prod_10: '/templates/template-wedding-planner.html',
  prod_11: '/templates/template-freelance-dashboard.html',
};

interface StorefrontPreviewProps {
  sections: ShopifySection[];
  themeSettings: ThemeSettings;
  deviceMode: 'desktop' | 'tablet' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
  onAddToCart: (product: Product, selectedVariant: SelectedVariant) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function StorefrontPreview({
  sections,
  themeSettings,
  onAddToCart,
  cartCount,
  onOpenCart,
}: StorefrontPreviewProps) {
  // Navigation & search state
  const [page, setPage] = useState<'home' | 'shop' | 'product' | 'faq'>('home');
  const [filterTag, setFilterTag] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'default' | 'rating' | 'reviews'>('default');

  // Active product for single product sheet detailed view
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [mainImageUrl, setMainImageUrl] = useState<string>(PRODUCTS[0].images[0]);
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant>({
    'Licence d’utilisation': 'Usage Personnel'
  });
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  
  // Custom interactive Accordion sections
  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({
    desc: true,
    specs: true,
    ship: false
  });

  // Newsletter subscription
  const [emailAddress, setEmailAddress] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Switch active product (for detail page)
  const handleProductSwitch = (prod: Product) => {
    setSelectedProduct(prod);
    setMainImageUrl(prod.images[0]);
    
    // Set default variant values
    const defaults: SelectedVariant = {};
    prod.variants.forEach((v) => {
      defaults[v.name] = v.values[0];
    });
    setSelectedVariants(defaults);
    setPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVariantChange = (name: string, val: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailAddress.trim()) {
      setSubscribed(true);
      setEmailAddress('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // Border utility radius helper
  const getRadiusClass = (type: 'button' | 'card') => {
    const radius = type === 'button' ? themeSettings.buttonRadius : themeSettings.cardRadius;
    if (radius === 'none') return 'rounded-none';
    if (radius === 'sm') return 'rounded-sm';
    if (radius === 'md') return 'rounded-md';
    if (radius === 'lg') return 'rounded-lg';
    if (radius === 'xl') return 'rounded-xl';
    return 'rounded-full';
  };

  const getFontFamilyStyle = () => {
    if (themeSettings.fontFamily === 'serif') return { fontFamily: '"Playfair Display", Georgia, serif' };
    if (themeSettings.fontFamily === 'mono') return { fontFamily: '"JetBrains Mono", monospace' };
    return { fontFamily: '"Inter", sans-serif' };
  };

  // Nav categories mapper
  const getFilteredProducts = () => {
    let result = [...PRODUCTS];

    if (filterTag !== 'Tous') {
      if (filterTag === 'Business & Pro') {
        result = result.filter(p => p.tags.some(t => ['Business', 'CRM', 'Ventes', 'Freelance', 'Micro-entreprise'].includes(t)));
      } else if (filterTag === 'Finances & Budget') {
        result = result.filter(p => p.tags.some(t => ['Budget', 'Finances', 'Épargne', 'Investissement', 'Bourse', 'Crypto'].includes(t)));
      } else if (filterTag === 'Routines & Organisation') {
        result = result.filter(p => p.tags.some(t => ['Habitudes', 'Routines', 'Discipline', 'Voyage', 'Fitness', 'Santé', 'Étudiant', 'Mariage', 'Marketing', 'Réseaux Sociaux'].includes(t)));
      }
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q));
    }

    if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'reviews') {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  };

  // Header and Footer custom sections
  const renderHeader = () => {
    return (
      <header
        style={{
          backgroundColor: themeSettings.backgroundColor,
          color: themeSettings.textColor,
          ...getFontFamilyStyle()
        }}
        className="py-4 px-6 border-b z-30 sticky top-0 shadow-sm bg-white border-gray-150"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => setPage('home')}
            className="font-extrabold text-sm tracking-widest uppercase text-zinc-950 cursor-pointer hover:opacity-80 flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded bg-zinc-950 flex items-center justify-center text-white font-serif text-xs font-bold shrink-0">A</div>
            <span>ALL template</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex gap-6 text-[11px] font-bold tracking-wider uppercase text-gray-550 items-center">
            <span 
              onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              className={`hover:text-black transition-colors cursor-pointer pb-0.5 ${page === 'home' ? 'text-zinc-950 border-b-2 border-zinc-900' : ''}`}
            >
              Accueil
            </span>
            <span 
              onClick={() => { setPage('shop'); setFilterTag('Tous'); }} 
              className={`hover:text-black transition-colors cursor-pointer pb-0.5 ${page === 'shop' && filterTag === 'Tous' ? 'text-zinc-950 border-b-2 border-zinc-900' : ''}`}
            >
              Boutique
            </span>
            <span 
              onClick={() => setPage('faq')} 
              className={`hover:text-black transition-colors cursor-pointer pb-0.5 ${page === 'faq' ? 'text-zinc-950 border-b-2 border-zinc-900' : ''}`}
            >
              FAQ
            </span>
          </nav>

          {/* Header Right Utilities */}
          <div className="flex items-center gap-3.5 text-gray-700">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (page !== 'shop') setPage('shop');
                }}
                className="pl-8 pr-3 py-1 text-xs border border-gray-250 bg-gray-50/50 rounded-full focus:outline-none focus:ring-1 focus:ring-zinc-900 w-40 font-sans"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
            </div>

            <button
              id="preview-open-cart-btn-main"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCart();
              }}
              className="relative p-2 flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-full transition-colors shrink-0"
              aria-label="Toggle cart"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-900" />
              <span
                style={{ backgroundColor: themeSettings.accentColor }}
                className="absolute -top-0.5 -right-0.5 text-white text-[8px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
              >
                {cartCount}
              </span>
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 cursor-pointer md:hidden hover:bg-gray-150 rounded"
              aria-label="Menu"
            >
              <Menu className="w-4 h-4 text-zinc-900" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 mt-3 pt-3 space-y-2 pb-2 text-[11px] font-semibold tracking-wider uppercase text-gray-600 flex flex-col"
            >
              <div className="px-2 pb-2">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Rechercher un template..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (page !== 'shop') setPage('shop');
                    }}
                    className="pl-8 pr-3 py-1.5 w-full text-xs border border-gray-200 bg-gray-50 rounded focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {[
                { label: 'Accueil', action: () => setPage('home') },
                { label: 'Boutique', action: () => { setPage('shop'); setFilterTag('Tous'); } },
                { label: 'FAQ', action: () => setPage('faq') }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    item.action();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left font-bold px-3 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  };

  const renderFooter = () => {
    return (
      <footer
        style={{
          backgroundColor: themeSettings.primaryColor,
          color: '#FFFFFF',
          ...getFontFamilyStyle()
        }}
        className="py-12 px-6 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-sans">
          <div className="md:col-span-5 space-y-3 pr-4">
            <span className="font-extrabold tracking-widest text-sm block">ALL template</span>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Des templates digitaux haut de gamme pour organiser votre vie, piloter votre entreprise et propulser vos projets, prêts à dupliquer en 1 clic.
            </p>
            <div className="text-[10px] text-gray-400 font-bold bg-white/5 inline-flex items-center gap-1.5 p-1.5 px-3 rounded">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Livraison 100% email gratuite immédiate post-paiement</span>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <span className="font-bold text-gray-200 tracking-wider">Boutique & Collection</span>
            <ul className="space-y-1.5 text-gray-400">
              <li onClick={() => { setPage('shop'); setFilterTag('Tous'); }} className="hover:text-white transition-colors cursor-pointer">Tous les templates Notion</li>
              <li onClick={() => { setPage('shop'); setFilterTag('Business & Pro'); }} className="hover:text-white transition-colors cursor-pointer">Espace de travail Pro & CRM</li>
              <li onClick={() => { setPage('shop'); setFilterTag('Finances & Budget'); }} className="hover:text-white transition-colors cursor-pointer">Suivis de budget mensuel</li>
              <li onClick={() => { setPage('shop'); setFilterTag('Routines & Organisation'); }} className="hover:text-white transition-colors cursor-pointer">Trackers d'habitudes & Fitness</li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2">
            <span className="font-bold text-gray-200 tracking-wider">Service Client & FAQ</span>
            <ul className="space-y-1.5 text-gray-400">
              <li onClick={() => setPage('faq')} className="hover:text-white transition-colors cursor-pointer">Comment installer mon produit ?</li>
              <li onClick={() => setPage('faq')} className="hover:text-white transition-colors cursor-pointer">Lien de téléchargement perdu ?</li>
              <li onClick={() => setPage('faq')} className="hover:text-white transition-colors cursor-pointer">Questions Fréquentes (FAQ)</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contact : yaakoubabid77@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright bar */}
        <div className="max-w-7xl mx-auto border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 font-sans gap-2">
          <span>© 2026 ALL template. Tous droits réservés. Vos outils digitaux clé en main.</span>
          <div className="flex gap-4">
            <span>Pinterest</span>
            <span>Instagram</span>
            <span>YouTube</span>
          </div>
        </div>
      </footer>
    );
  };

  const renderSection = (sec: ShopifySection) => {
    if (!sec.enabled) return null;

    switch (sec.type) {
      case 'announcement':
        return (
          <div
            id={`announcement-sec-${sec.id}`}
            style={{
              backgroundColor: sec.settings.backgroundColor || themeSettings.primaryColor,
              color: sec.settings.textColor || '#FFFFFF',
              ...getFontFamilyStyle()
            }}
            className="py-2.5 px-4 text-center text-[11px] font-semibold tracking-wider border-b border-black/5"
          >
            <div className="flex justify-center items-center gap-2 max-w-7xl mx-auto">
              <span>🚀 Offre Spéciale : Tous nos templates digitaux à 24.99€ seulement ! (Frais d'envoi gratuits par email)</span>
              <span onClick={() => { setPage('shop'); setFilterTag('Tous'); }} className="underline decoration-1 cursor-pointer hover:opacity-80">
                Parcourir
              </span>
            </div>
          </div>
        );

      case 'header':
        return renderHeader();

      case 'hero':
        const alignClass = sec.settings.alignment === 'left' ? 'text-left items-start' : sec.settings.alignment === 'right' ? 'text-right items-end' : 'text-center items-center';
        const heightClass = sec.settings.bannerHeight === 'small' ? 'py-16' : sec.settings.bannerHeight === 'large' ? 'py-32' : 'py-24';

        return (
          <section
            id={`hero-sec-${sec.id}`}
            style={{ ...getFontFamilyStyle() }}
            className="relative w-full overflow-hidden flex flex-col justify-center"
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={sec.settings.imageSrc}
                alt="Store Hero Background"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div 
                className="absolute inset-0 bg-black"
                style={{ opacity: (sec.settings.overlayOpacity || 30) / 100 }}
              />
            </div>

            {/* Content Foreground */}
            <div className={`relative z-10 max-w-4xl mx-auto px-6 w-full flex flex-col ${alignClass} ${heightClass} text-white`}>
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl leading-[1.1] mb-4 drop-shadow-sm"
              >
                Templates Notion Prêts à l'Emploi
              </motion.h2>
              <p className="text-sm sm:text-base text-gray-150 max-w-xl mb-7 font-sans leading-relaxed drop-shadow-sm">
                Optimisez vos journées, suivez vos budgets et structurez votre activité professionnelle en 1 clic. Livraison instantanée à vie par email.
              </p>
              
              <div className="flex flex-wrap gap-2.5">
                <button
                  id={`hero-cta-btn-${sec.id}`}
                  onClick={() => {
                    setPage('shop');
                    setFilterTag('Tous');
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  style={{
                    backgroundColor: themeSettings.accentColor,
                    textTransform: themeSettings.uppercaseButtons ? 'uppercase' : 'none',
                  }}
                  className={`px-5 py-2.5 text-xs font-bold tracking-wider text-white transition-all shadow-md cursor-pointer hover:scale-[1.02] ${getRadiusClass('button')}`}
                >
                  Découvrir tous les templates
                </button>
                <button
                  id={`hero-cta-sec-btn-${sec.id}`}
                  onClick={() => setPage('faq')}
                  className={`px-5 py-2.5 text-xs font-semibold tracking-wider bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 text-white cursor-pointer transition-all ${getRadiusClass('button')}`}
                >
                  Comment ça marche ?
                </button>
              </div>
            </div>
          </section>
        );

      case 'features-grid':
        const colsValue = sec.settings.cols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';
        return (
          <section
            id={`features-sec-${sec.id}`}
            style={{
              backgroundColor: themeSettings.backgroundColor,
              color: themeSettings.textColor,
              ...getFontFamilyStyle()
            }}
            className="py-12 px-6 border-b border-gray-100"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-xl mx-auto mb-10">
                <h3 className="text-xl font-bold tracking-tight mb-2">
                  Pourquoi choisir nos templates digitaux ?
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">
                  Une infrastructure numérique sans code pensée pour simplifier votre quotidien
                </p>
              </div>

              <div className={`grid gap-6 ${colsValue}`}>
                {[
                  {
                    title: "Livraison Instantanée",
                    text: "Dès validation de votre paiement, les liens d'accès sécurisés Notion / Sheets sont envoyés automatiquement sur votre adresse email.",
                    icon: Mail
                  },
                  {
                    title: "Prise en Main en 2min",
                    text: "Il vous suffit de cliquer sur le lien reçu pour dupliquer instantanément le template sur votre espace personnel 100% gratuitement.",
                    icon: ShieldCheck
                  },
                  {
                    title: "Mises à jour à vie gratuites",
                    text: "Chaque amélioration apportée au template vous est transmise gratuitement par email pour garantir un outil toujours performant.",
                    icon: Workflow
                  }
                ].map((item, i) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={i}
                      style={{ backgroundColor: themeSettings.cardBackgroundColor }}
                      className={`p-5 transition-shadow flex flex-col items-center text-center border border-neutral-100/10 ${getRadiusClass('card')}`}
                    >
                      <div 
                        style={{ backgroundColor: `${themeSettings.accentColor}12`, color: themeSettings.accentColor }}
                        className="p-3 rounded-full mb-3 shrink-0 flex items-center justify-center"
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm tracking-tight text-gray-900 mb-1.5">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-sans">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'product-showcase':
        const prod = PRODUCTS.find((p) => p.id === sec.settings.productId) || PRODUCTS[0];
        const comparePrice = prod.compareAtPrice;
        // Auto compute discount percentage
        const discountPercentage = comparePrice 
          ? Math.round(((comparePrice - prod.price) / comparePrice) * 100) 
          : 0;

        return (
          <section
            id={`showcase-sec-${sec.id}`}
            style={{
              backgroundColor: themeSettings.backgroundColor,
              color: themeSettings.textColor,
              ...getFontFamilyStyle()
            }}
            className="py-12 px-6 border-b border-gray-100"
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-xs tracking-widest font-extrabold text-amber-700 uppercase mb-1">
                  Mise en avant
                </h2>
                <p className="text-lg font-bold text-gray-800 max-w-md mx-auto line-clamp-1">
                  {prod.title}
                </p>
              </div>

              {/* Grid 2 Column for Media Gallery & Product Parameters */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. Left Column: Image Galleries */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="relative overflow-hidden aspect-square bg-gray-50 border border-gray-100 flex items-center justify-center rounded-lg">
                    {/* Badge Overlay */}
                    <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
                      <span
                        style={{ backgroundColor: themeSettings.accentColor }}
                        className="text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm tracking-wider uppercase"
                      >
                        Plus populaire
                      </span>
                      {comparePrice && (
                        <span className="bg-red-650 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded shadow-sm">
                          Réduction -{discountPercentage}%
                        </span>
                      )}
                    </div>

                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* 2. Right Column: Product Parameters */}
                <div className="lg:col-span-5 space-y-5">
                  <div>
                    {/* Star Rating Reviews */}
                    <div className="flex items-center gap-1.5 text-amber-500 mb-1.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current stroke-[1.5]" />
                        ))}
                      </div>
                      <span className="text-gray-400 font-sans text-xs font-semibold">
                        {prod.rating} ({prod.reviewCount} avis clients)
                      </span>
                    </div>

                    <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 leading-tight">
                      {prod.title}
                    </h1>

                    {/* Price with CompareAt price option */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-black font-sans text-gray-900">
                        {prod.price.toFixed(2)}€
                      </span>
                      {comparePrice && (
                        <span className="text-gray-400 line-through text-md font-sans font-semibold">
                          {comparePrice.toFixed(2)}€
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 p-1 rounded">
                        -{discountPercentage}% de réduction immédiate
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="text-xs font-sans text-gray-650 leading-relaxed border-t border-b border-gray-100 py-3">
                    {prod.summary}
                  </div>



                  {/* Interactive Button CTA */}
                  <div className="space-y-2 pt-2">
                    <button
                      id="add-to-cart-showcase-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // ensure default variant selected
                        const payload = { ...selectedVariants };
                        prod.variants.forEach(v => {
                          if (!payload[v.name]) payload[v.name] = v.values[0];
                        });
                        onAddToCart(prod, payload);
                      }}
                      style={{
                        backgroundColor: themeSettings.primaryColor,
                        textTransform: themeSettings.uppercaseButtons ? 'uppercase' : 'none',
                      }}
                      className={`w-full py-3.5 text-xs tracking-wider text-white font-bold transition-all shadow hover:shadow-md hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer ${getRadiusClass('button')}`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Ajouter au Panier — {prod.price.toFixed(2)}€
                    </button>

                    <button
                      onClick={() => handleProductSwitch(prod)}
                      className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-zinc-800 text-xs font-bold tracking-wider rounded border border-gray-200 transition-colors cursor-pointer text-center"
                    >
                      Voir la fiche technique et démo complète
                    </button>
                    
                    <div className="flex items-center gap-1.5 font-sans justify-center text-[10px] text-gray-650 mt-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Fichier digital : email de téléchargement envoyé sous 10 secondes.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'featured-collection':
        const columnsClass = sec.settings.columns === 4 ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';
        return (
          <section
            id={`collection-sec-${sec.id}`}
            style={{
              backgroundColor: themeSettings.backgroundColor,
              color: themeSettings.textColor,
              ...getFontFamilyStyle()
            }}
            className="py-12 px-6 border-b border-gray-100"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-3 border-b border-gray-150">
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight mb-1 text-gray-900 leading-none">
                    {sec.settings.title || 'Collection de Templates Notion d\'Exception'}
                  </h3>
                  <p className="text-xs text-gray-400 font-sans mt-0.5">Cliquez sur un produit pour voir sa fiche détaillée</p>
                </div>

                <div 
                  onClick={() => { setPage('shop'); setFilterTag('Tous'); }}
                  className="flex items-center text-xs font-bold text-zinc-900 cursor-pointer mt-2 md:mt-0 gap-0.5 hover:underline tracking-wider"
                >
                  Voir tous nos templates <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className={`grid gap-6 ${columnsClass}`}>
                {PRODUCTS.slice(0, 4).map((p) => {
                  const compareVal = p.compareAtPrice;
                  const discountVal = Math.round(((compareVal - p.price) / compareVal) * 100);

                  return (
                    <div
                      key={p.id}
                      style={{ backgroundColor: themeSettings.cardBackgroundColor }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductSwitch(p);
                      }}
                      className={`group hover:shadow-md border border-neutral-100 shadow-sm relative transition-all duration-200 cursor-pointer flex flex-col justify-between ${getRadiusClass('card')}`}
                    >
                      {/* Thumbnail frame with custom hover */}
                      <div className="relative aspect-square w-full overflow-hidden bg-white/40 flex items-center justify-center">
                        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1 text-[8px] uppercase font-bold tracking-wider">
                          <span style={{ backgroundColor: themeSettings.accentColor }} className="text-white px-2 py-0.5 rounded shadow shadow-zinc-900/10">
                            Plus populaire
                          </span>
                          <span className="bg-red-650 text-white px-2 py-0.5 rounded shadow">
                            -{discountVal}%
                          </span>
                        </div>

                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Info Area */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center text-amber-500 gap-1 text-[10px] mb-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 fill-current stroke-0" />
                              ))}
                            </div>
                            <span className="text-gray-400 font-sans font-bold">({p.rating})</span>
                          </div>

                          <h4 className="font-bold text-xs text-zinc-950 tracking-tight leading-snug line-clamp-1 mb-1 group-hover:text-zinc-800 transition-colors">
                            {p.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-sans line-clamp-2 mt-0.5 leading-normal">
                            {p.summary}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                          <div>
                            <span className="font-sans font-black text-xs text-gray-950">{p.price.toFixed(2)}€</span>
                            <span className="text-[10px] text-gray-400 line-through font-sans block">
                              {p.compareAtPrice.toFixed(2)}€
                            </span>
                          </div>

                          <button
                            id={`quick-add-${p.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              const defaults: SelectedVariant = {};
                              p.variants.forEach((v) => {
                                defaults[v.name] = v.values[0];
                              });
                              onAddToCart(p, defaults);
                            }}
                            className="text-[9px] uppercase font-extrabold tracking-wider bg-zinc-950 hover:bg-black text-white p-2 px-3 rounded shadow-sm cursor-pointer transition-colors"
                          >
                            Ajout Rapide
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );

      case 'rich-text':
        return (
          <section
            id={`rich-text-sec-${sec.id}`}
            style={{
              backgroundColor: themeSettings.backgroundColor,
              color: themeSettings.textColor,
              ...getFontFamilyStyle()
            }}
            className="py-12 px-6 border-b border-gray-100 text-center"
          >
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              <h3 className="text-lg font-bold tracking-tight text-gray-900 mb-3">
                Prenez le contrôle de vos finances et routines dès aujourd'hui
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed font-sans mb-5 max-w-xl">
                Tous nos outils sont développés avec rigueur afin de s'intégrer harmonieusement dans votre espace et de booster votre productivité au quotidien, sans fioritures superflues ni abonnement payant.
              </p>
              <button
                id={`rich-btn-cta-${sec.id}`}
                onClick={() => { setPage('shop'); setFilterTag('Tous'); }}
                style={{
                  backgroundColor: themeSettings.primaryColor,
                  textTransform: themeSettings.uppercaseButtons ? 'uppercase' : 'none',
                }}
                className={`px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:brightness-110 cursor-pointer ${getRadiusClass('button')}`}
              >
                Accéder à notre catalogue complet
              </button>
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section
            id={`testimonials-sec-${sec.id}`}
            style={{
              backgroundColor: themeSettings.cardBackgroundColor,
              color: themeSettings.textColor,
              ...getFontFamilyStyle()
            }}
            className="py-12 px-6 border-b border-gray-100"
          >
            <div className="max-w-7xl mx-auto">
              <h3 className="text-center font-bold text-xs tracking-widest uppercase text-gray-500 mb-10">
                L'avis de nos clients satisfaits
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {[
                  {
                    author: "Mehdi L.",
                    role: "Freelance en Tech",
                    quote: "Le template Business Ultime a changé ma façon de facturer et suivre mes projets. En moins d'un après-midi, tout était dupliqué sur mon Notion. Le système interactif de suivi de budget est top, conforme à mes attentes.",
                    rating: 5
                  },
                  {
                    author: "Assia T.",
                    role: "Créatrice de Contenu",
                    quote: "Je cherchais un outil simple pour suivre mes routines et mes dépenses mensuelles. Le tracker d'habitudes est tellement interactif et agréable à utiliser ! Reçu dans ma boîte mail 10 secondes après le paiement.",
                    rating: 5
                  }
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: themeSettings.backgroundColor }}
                    className={`p-6 border border-gray-100 flex flex-col justify-between ${getRadiusClass('card')}`}
                  >
                    <div>
                      <div className="flex opacity-85 mb-2.5">
                        {[...Array(item.rating)].map((_, iStar) => (
                          <Star key={iStar} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        ))}
                      </div>
                      <p className="text-xs text-gray-650 italic leading-relaxed font-sans">
                        "{item.quote}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-xs block text-gray-900 font-sans">{item.author}</span>
                        <span className="text-[10px] text-gray-400 font-sans block">{item.role}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-emerald-600 font-bold font-sans">Achat vérifié</span>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'newsletter':
        return (
          <section
            id={`newsletter-sec-${sec.id}`}
            style={{
              backgroundColor: themeSettings.backgroundColor,
              color: themeSettings.textColor,
              ...getFontFamilyStyle()
            }}
            className="py-12 px-4 border-b border-gray-100 text-center"
          >
            <div className="max-w-md mx-auto flex flex-col items-center">
              <Mail 
                className="w-7 h-7 mb-3 stroke-[1.2]" 
                style={{ color: themeSettings.accentColor }} 
              />
              
              <h3 className="text-lg font-bold tracking-tight text-zinc-950 mb-2">
                Restez informé(e)
              </h3>
              
              <p className="text-xs text-gray-500 leading-relaxed font-sans mb-6">
                Inscrivez-vous pour recevoir des guides Notion gratuits directement dans votre boîte email, ainsi que des offres exclusives.
              </p>

              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-emerald-50 text-emerald-950 p-2.5 rounded border border-emerald-100 text-xs font-semibold flex items-center justify-center gap-1.5 w-full"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 font-bold" />
                    Inscription validée ! Merci pour votre confiance.
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="w-full flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      id="newsletter-email-input"
                      type="email"
                      required
                      placeholder="Saisissez votre e-mail"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="flex-1 border border-gray-250 p-2 text-xs rounded focus:outline-none focus:ring-1 focus:ring-zinc-800 bg-white"
                    />
                    <button
                      id="newsletter-submit-btn"
                      type="submit"
                      style={{
                        backgroundColor: themeSettings.primaryColor,
                        textTransform: themeSettings.uppercaseButtons ? 'uppercase' : 'none',
                      }}
                      className={`p-2 px-4 text-xs font-bold text-white transition-opacity hover:opacity-90 leading-none flex items-center cursor-pointer ${getRadiusClass('button')}`}
                    >
                      S'inscrire
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </section>
        );

      case 'footer':
        return renderFooter();

      default:
        return null;
    }
  };

  // Specific virtual multipage renders
  const renderHomeView = () => {
    return (
      <div className="flex flex-col w-full animate-fade-in">
        {sections.map((sec) => {
          if (sec.type === 'announcement' || sec.type === 'header' || sec.type === 'footer') return null;
          const el = renderSection(sec);
          if (!el) return null;
          return React.cloneElement(el, { key: sec.id });
        })}
      </div>
    );
  };

  const renderShopView = () => {
    const filteredProducts = getFilteredProducts();
    const categoriesList = [
      { id: 'Tous', label: 'Tous les templates' },
      { id: 'Business & Pro', label: 'Micro-entreprise, CRM & Pro' },
      { id: 'Finances & Budget', label: 'Finances Personnelles & Budget' },
      { id: 'Routines & Organisation', label: 'S\'organiser / Routines & Bien-être' }
    ];

    return (
      <div className="flex-1 flex flex-col w-full bg-white animate-fade-in" style={getFontFamilyStyle()}>
        {/* Banner header for shop */}
        <div className="bg-gray-50 border-b border-gray-150 py-10 px-6 text-center select-none">
          <div className="max-w-4xl mx-auto space-y-2">
            <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Le Catalogue Digital</h1>
            <p className="text-xs text-gray-500 max-w-xl mx-auto leading-relaxed">
              Retrouvez l’ensemble de nos modèles digitaux Notion et Google Sheets. <b>Tous nos produits sont à 24.99€</b> au lieu de <span className="line-through">49€</span> (-49% de remise immédiate appliquée automatiquement).
            </p>
          </div>
        </div>

        {/* Filter categories segment */}
        <div className="max-w-7xl mx-auto w-full px-6 py-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-100">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterTag(cat.id)}
                className={`text-[10px] font-bold tracking-wider px-3.5 py-2 uppercase border transition-all cursor-pointer ${
                  filterTag === cat.id
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-black hover:border-gray-400'
                } rounded-full`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Utilities */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 shrink-0">
            <span>Trier par:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="border border-gray-200 p-1 px-2 rounded focus:outline-none text-zinc-800 bg-white"
            >
              <option value="default">Ordre alphabétique</option>
              <option value="rating">Meilleures évaluations</option>
              <option value="reviews">Nombre d'avis clients</option>
            </select>
          </div>
        </div>

        {/* Catalog grid */}
        <div className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">Aucun template ne correspond à votre filtre de recherche.</p>
              <button 
                onClick={() => { setFilterTag('Tous'); setSearchQuery(''); }}
                className="text-xs font-bold underline cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const discountVal = Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);

                return (
                  <div
                    key={p.id}
                    style={{ backgroundColor: themeSettings.cardBackgroundColor }}
                    onClick={() => handleProductSwitch(p)}
                    className="group border border-gray-150/80 shadow-sm rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
                  >
                    {/* Thumbnail framework */}
                    <div className="relative aspect-square w-full bg-white flex items-center justify-center overflow-hidden">
                      <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1 text-[8px] uppercase font-extrabold tracking-wider">
                        <span style={{ backgroundColor: themeSettings.accentColor }} className="text-white px-2 py-0.5 rounded shadow">
                          Plus populaire
                        </span>
                        <span className="bg-red-650 text-white px-2 py-0.5 rounded shadow">
                          -{discountVal}%
                        </span>
                      </div>

                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Meta data card */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Rating block */}
                        <div className="flex items-center text-amber-500 gap-1 text-[9px] mb-1 font-bold">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-current stroke-0" />
                            ))}
                          </div>
                          <span className="text-zinc-400 font-sans">({p.rating})</span>
                        </div>

                        <h3 className="font-extrabold text-xs text-zinc-950 tracking-tight leading-snug mb-1 line-clamp-1 group-hover:text-zinc-800 transition-colors">
                          {p.title}
                        </h3>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-sans line-clamp-2">
                          {p.summary}
                        </p>
                      </div>

                      {/* CTA grid and Price layout */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                        <div>
                          <span className="font-bold text-xs text-zinc-950 block">{p.price.toFixed(2)}€</span>
                          <span className="text-[9px] text-gray-400 line-through block">{p.compareAtPrice.toFixed(2)}€</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const defaults: SelectedVariant = {};
                            p.variants.forEach((v) => {
                              defaults[v.name] = v.values[0];
                            });
                            onAddToCart(p, defaults);
                          }}
                          className="text-[9px] font-extrabold uppercase tracking-wider bg-zinc-900 hover:bg-black text-white p-2 px-3 rounded shadow transition-all cursor-pointer"
                        >
                          Ajout Rapide
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Secure post purchase help information */}
        <div className="bg-gray-50 border-t border-gray-100 py-10 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left text-xs font-sans">
            <div className="space-y-1.5 p-4 bg-white border border-gray-150 rounded">
              <Download className="w-5 h-5 text-zinc-900 mx-auto md:mx-0 shrink-0" />
              <h4 className="font-bold text-gray-900">Téléchargement immédiat</h4>
              <p className="text-[11px] text-gray-550 leading-relaxed">
                Pas besoin de transport physique. Dès la validation Stripe de votre achat, vous recevez les fichiers Notion duplicables à vie par email sous quelques secondes.
              </p>
            </div>
            <div className="space-y-1.5 p-4 bg-white border border-gray-150 rounded">
              <CheckCircle className="w-5 h-5 text-zinc-900 mx-auto md:mx-0 shrink-0" />
              <h4 className="font-bold text-gray-900">Compatibilité Universelle</h4>
              <p className="text-[11px] text-gray-550 leading-relaxed">
                Nos modèles s'utilisent parfaitement sur n'importe quel compte standard gratuit de Notion ou Google Sheets, sur ordinateur, smartphone ou tablette.
              </p>
            </div>
            <div className="space-y-1.5 p-4 bg-white border border-gray-150 rounded">
              <Sparkles className="w-5 h-5 text-zinc-900 mx-auto md:mx-0 shrink-0" />
              <h4 className="font-bold text-gray-900">Zéro Frais Cachés</h4>
              <p className="text-[11px] text-gray-550 leading-relaxed">
                Contrairement aux services à abonnements mensuels, vous payez 24.99€ une fois seulement et conservez vos modules à vie, y compris toutes les futures améliorations.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProductView = () => {
    const prod = selectedProduct;
    const comparePrice = prod.compareAtPrice;
    const discountPercentage = comparePrice 
      ? Math.round(((comparePrice - prod.price) / comparePrice) * 100) 
      : 0;

    // Filter recommended related templates
    const relatedProducts = PRODUCTS.filter(p => p.id !== prod.id).slice(0, 3);

    return (
      <div className="flex-1 flex flex-col w-full bg-white animate-fade-in" style={getFontFamilyStyle()}>
        {/* Breadcrumb line navigation */}
        <div className="bg-gray-50 border-b border-gray-150 py-3 px-6 text-xs text-gray-400 select-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1 font-semibold">
            <span onClick={() => setPage('home')} className="hover:text-black cursor-pointer transition-colors font-bold">Accueil</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span onClick={() => { setPage('shop'); setFilterTag('Tous'); }} className="hover:text-black cursor-pointer transition-colors font-bold">Boutique</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-zinc-900 text-xs truncate max-w-[200px]">{prod.title}</span>
          </div>
        </div>

        {/* Major details layout split */}
        <div className="max-w-7xl mx-auto px-6 py-8 w-full">
          <button 
            onClick={() => { setPage('shop'); setFilterTag('Tous'); }}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black cursor-pointer mb-6 font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Retourner à la boutique
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Col: Dynamic gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative overflow-hidden aspect-square border border-gray-150 rounded-lg flex items-center justify-center bg-gray-50">
                <div className="absolute left-3 top-3 z-10 flex flex-col gap-1 text-[8px] uppercase tracking-wider font-extrabold">
                  <span style={{ backgroundColor: themeSettings.accentColor }} className="text-white px-2.5 py-1 rounded shadow">
                    Plus populaire
                  </span>
                  <span className="bg-red-650 text-white px-2.5 py-1 rounded shadow">
                    -{discountPercentage}% de réduction
                  </span>
                </div>

                <img
                  src={mainImageUrl}
                  alt={prod.title}
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Slider thumbs */}
              {prod.images.length > 1 && (
                <div className="flex gap-2">
                  {prod.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImageUrl(img)}
                      className={`w-16 h-16 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                        mainImageUrl === img ? 'border-zinc-900 shadow' : 'border-transparent hover:border-gray-350'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Parameters controls */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-2 font-bold text-xs">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current stroke-[1.5]" />
                    ))}
                  </div>
                  <span className="text-gray-400 font-sans font-bold">{prod.rating} ({prod.reviewCount} avis clients)</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight leading-tight">
                  {prod.title}
                </h1>

                {/* Pricing layout */}
                <div className="flex items-center gap-2.5 mt-3 border-b border-gray-100 pb-4">
                  <span className="text-3xl font-black text-zinc-900 font-sans">
                    {prod.price.toFixed(2)}€
                  </span>
                  <span className="text-gray-400 line-through text-md font-bold font-sans">
                    {prod.compareAtPrice.toFixed(2)}€
                  </span>
                  <span className="text-[10px] font-extrabold bg-red-50 text-red-600 px-2 py-1 rounded">
                    Remise de {discountPercentage}% incluse
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-2 text-[10px] text-gray-500 font-bold font-sans">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                  <span>Prix fixe garanti, aucun abonnement récurrent.</span>
                </div>
              </div>

              <div className="text-xs text-gray-650 leading-relaxed font-sans">
                {prod.summary}
              </div>

              {/* Add to action bar */}
              <div className="pt-2 space-y-2">
                {TEMPLATE_PREVIEWS[prod.id] && (
                  <button
                    onClick={() => setPreviewModalUrl(TEMPLATE_PREVIEWS[prod.id])}
                    className="w-full py-3.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold tracking-wider rounded border border-gray-250 transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <span>👁 Aperçu du template</span>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const payload: SelectedVariant = {};
                    prod.variants.forEach(v => {
                      payload[v.name] = v.values[0];
                    });
                    onAddToCart(prod, payload);
                  }}
                  style={{ backgroundColor: themeSettings.primaryColor }}
                  className="w-full py-4 text-xs font-bold uppercase tracking-wider text-white hover:brightness-110 shadow transition-all flex items-center justify-center gap-2 rounded cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ajouter au Panier — {prod.price.toFixed(2)}€
                </button>

                <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 pt-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Paiements hautement cryptés via Stripe et ShopPay</span>
                </div>
              </div>

              {/* Custom specs checklist accordions */}
              <div className="space-y-2 pt-3 border-t border-gray-150">
                
                {/* Accordion Description */}
                <div className="border-b border-gray-100 pb-3">
                  <button
                    onClick={() => setExpandedTabs(p => ({ ...p, desc: !p.desc }))}
                    className="w-full flex justify-between items-center font-bold text-xs text-zinc-900 tracking-tight"
                  >
                    <span>Présentation du template</span>
                    {expandedTabs.desc ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>

                  <AnimatePresence>
                    {expandedTabs.desc && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-[11px] leading-relaxed text-gray-500 mt-2 font-sans"
                      >
                        {prod.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Accordion Specs */}
                <div className="border-b border-gray-100 pb-3">
                  <button
                    onClick={() => setExpandedTabs(p => ({ ...p, specs: !p.specs }))}
                    className="w-full flex justify-between items-center font-bold text-xs text-zinc-900 tracking-tight"
                  >
                    <span>Fiche technique Notion</span>
                    {expandedTabs.specs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>

                  <AnimatePresence>
                    {expandedTabs.specs && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 space-y-1 font-sans"
                      >
                        {prod.specs.map((s, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] py-1 border-b border-gray-50">
                            <span className="text-gray-400 font-medium">{s.label}</span>
                            <span className="font-semibold text-gray-800">{s.value}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Accordion Delivery */}
                <div className="border-b border-gray-100 pb-3">
                  <button
                    onClick={() => setExpandedTabs(p => ({ ...p, ship: !p.ship }))}
                    className="w-full flex justify-between items-center font-bold text-xs text-zinc-900 tracking-tight"
                  >
                    <span>Livraison Numérique & Accès immédiat</span>
                    {expandedTabs.ship ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>

                  <AnimatePresence>
                    {expandedTabs.ship && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="text-[11px] leading-relaxed text-gray-500 mt-2 font-sans space-y-1"
                      >
                        <p>Dès la confirmation de commande par Stripe, vous recevrez :</p>
                        <ul className="list-disc list-inside space-y-1 pl-1">
                          <li>Un courriel automatique contenant les liens de duplication.</li>
                          <li>Le pack d'assistance avec tutoriels (en français).</li>
                          <li>L'accès au support client par email réactif sous 24h.</li>
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </div>

          {/* Related products showcase */}
          <div className="mt-16 border-t border-gray-150 pt-10">
            <h3 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-6 text-center">Vous aimerez aussi</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => {
                const discount = Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100);
                return (
                  <div
                    key={p.id}
                    onClick={() => handleProductSwitch(p)}
                    className="border border-gray-150 rounded bg-[#F9FAFB] p-4 cursor-pointer hover:shadow transition-all text-center flex flex-col justify-between overflow-hidden"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-white mb-3 rounded flex items-center justify-center relative">
                      <span className="absolute bg-zinc-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded left-2 top-2">-{discount}% Off</span>
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900 line-clamp-1">{p.title}</h4>
                      <div className="flex justify-center items-center gap-2 mt-1.5">
                        <span className="text-xs font-black text-zinc-950">{p.price.toFixed(2)}€</span>
                        <span className="text-[10px] text-gray-400 line-through">{p.compareAtPrice.toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFAQView = () => {
    return (
      <div className="flex-1 flex flex-col w-full bg-white animate-fade-in" style={getFontFamilyStyle()}>
        <div className="bg-gray-50 border-b border-gray-150 py-12 px-6 text-center select-none">
          <div className="max-w-4xl mx-auto space-y-2">
            <HelpCircle className="w-8 h-8 text-neutral-800 mx-auto" />
            <h1 className="text-3xl font-black text-zinc-950 tracking-tight">Espace Assistance & FAQ</h1>
            <p className="text-xs text-gray-500 max-w-lg mx-auto leading-relaxed">
              Une question sur la livraison des templates ou leur configuration sur Notion ? Retrouvez toutes les explications pas-à-pas ici.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10 w-full font-sans space-y-6">
          <div className="space-y-4">
            {[
              {
                q: "Qu’est-ce qu’un template digital Notion ?",
                a: "Un template Notion est un espace de travail virtuel préconçu. Plutôt que de bâtir votre tableau de bord, votre calendrier ou votre suivi financier à partir d’une page blanche, vous recevez un modèle professionnel prêt à l'emploi. Vous pouvez tout personnaliser à votre image en quelques clics."
              },
              {
                q: "Quels sont les frais de livraison ?",
                a: "Les frais de port sont entièrement GRATUITS. S'agissant d'un produit 100% digital, vous ne recevrez pas de colis physique à la maison. La livraison se fait par email de façon automatisée en quelques secondes après l'achat."
              },
              {
                q: "Comment puis-je dupliquer mon template ?",
                a: "C'est extrêmement simple ! L'e-mail automatique contient un lien de partage sécurisé. Cliquez sur ce lien, puis cliquez sur le terme 'Dupliquer' (Duplicate) en haut à droite. Le modèle est immédiatement collé sur votre espace personnel Notion, prêt à l'emploi !"
              },
              {
                q: "Ai-je besoin d'un forfait payant Notion ?",
                a: "Non ! Tous nos modèles ont été optimisés minutieusement pour s'intégrer harmonieusement et fonctionner de manière autonome sur n'importe quel compte Notion gratuit. Vous n'avez aucun abonnement Notion à payer."
              },
              {
                q: "Toutes mes informations personnelles restent-elles privées ?",
                a: "Oui, à 100%. Une fois le modèle dupliqué sur votre compte Notion personnel, nous n’avons plus aucun accès de lecture ni d'écriture. Vos données financières, vos tâches, vos contacts et vos routines résident de manière exclusive et hautement confidentielle sur vos propres serveurs de compte Notion."
              },
              {
                q: "Quel est le délai de réponse pour l'assistance client par email ?",
                a: "Nous répondons à l'ensemble de vos messages sous 24 heures ouvrées. Vous pouvez nous écrire à tout moment à l'adresse yaakoubabid77@gmail.com pour n'importe quelle question d'installation."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-5 border border-gray-150 bg-gray-50 rounded-lg space-y-1.5 selection:bg-amber-100">
                <h3 className="font-extrabold text-sm text-gray-950 flex items-center gap-1.5 leading-snug">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  {item.q}
                </h3>
                <p className="text-xs text-gray-650 leading-relaxed font-sans pl-5">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-zinc-950 text-white rounded-lg text-center space-y-3.5">
            <h3 className="font-extrabold text-sm tracking-wide">Vous avez une demande sur mesure ou besoin d'aide ?</h3>
            <p className="text-[11px] text-gray-300 max-w-md mx-auto leading-relaxed">
              Toutes nos équipes se tiennent disponibles pour vous aiguiller dans votre installation au yaakoubabid77@gmail.com.
            </p>
            <button 
              onClick={() => { setPage('shop'); setFilterTag('Tous'); }}
              className="px-5 py-2 text-xs font-bold bg-white text-zinc-950 hover:bg-gray-100 rounded cursor-pointer transition-colors"
            >
              Parcourir les templates (24.99€ l'unité)
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getActiveView = () => {
    switch (page) {
      case 'home':
        return renderHomeView();
      case 'shop':
        return renderShopView();
      case 'product':
        return renderProductView();
      case 'faq':
        return renderFAQView();
      default:
        return renderHomeView();
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col w-full" id="storefront-canvas-column">
      {/* Absolute Header announcement bar to keep UX matching standard Shopify themes */}
      {sections.find(s => s.type === 'announcement' && s.enabled) && (
        renderSection(sections.find(s => s.type === 'announcement')!)
      )}

      {/* Main sticky header rendered always for high fidelity routing */}
      {renderHeader()}

      {/* Active page Router */}
      <div className="flex-1 flex flex-col bg-white">
        {getActiveView()}
      </div>

      {/* Main standard footer rendered on all views */}
      {renderFooter()}

      <AnimatePresence>
        {previewModalUrl && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden w-[90vw] h-[90vh] flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-150 shrink-0">
                <span className="font-bold text-xs text-zinc-800 tracking-wider font-sans uppercase">
                  Aperçu du template
                </span>
                <button
                  onClick={() => setPreviewModalUrl(null)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Iframe content */}
              <div className="flex-1 bg-gray-50 relative">
                <iframe
                  src={previewModalUrl}
                  className="w-full h-full border-0"
                  title="Template Preview"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
