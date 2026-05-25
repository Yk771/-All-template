import { useStripeCheckout } from '../hooks/useStripeCheckout';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Sparkles, Shield, RefreshCcw } from 'lucide-react';
import { CartItem, ThemeSettings } from '../types';
import { useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  themeSettings: ThemeSettings;
  onCheckoutSuccess: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeItem,
  themeSettings,
  onCheckoutSuccess,
}: CartDrawerProps) {
  const { checkout, isLoading: stripeLoading } = useStripeCheckout();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment'>('cart');
  
  // Shipping details state
  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('contact@exemple.com');
  const [address, setAddress] = useState('100% Digital Download');
  const [city, setCity] = useState('Instant Email Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 0;
  const isFreeShipping = true;
  const shippingCost = 0;
  
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const grandTotal = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.toUpperCase().trim();
    if (code === 'WELCOME10') {
      setAppliedDiscount({ code: 'WELCOME10', percent: 10 });
      setPromoCode('');
    } else if (code === 'CRAFT20') {
      setAppliedDiscount({ code: 'CRAFT20', percent: 20 });
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code. Try "WELCOME10" or "CRAFT20"');
    }
  };

  const handleCheckout = () => {
    if (checkoutStep === 'cart') {
      setCheckoutStep('shipping');
    } else if (checkoutStep === 'shipping') {
      setCheckoutStep('payment');
    } else {
      // Stripe paiement réel
      checkout(cart);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 pointer-events-auto"
            onClick={() => {
              setCheckoutStep('cart');
              onClose();
            }}
          />

          {/* Drawer container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            id="shopify-cart-drawer"
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white text-gray-900 shadow-2xl z-50 flex flex-col pointer-events-auto"
            style={{
              fontFamily: themeSettings.fontFamily === 'serif' ? '"Playfair Display", Georgia, serif' : themeSettings.fontFamily === 'mono' ? '"JetBrains Mono", monospace' : 'inherit',
            }}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" style={{ color: themeSettings.primaryColor }} />
                <span className="font-semibold text-lg tracking-tight">Votre Panier</span>
                <span className="bg-gray-100 text-xs px-2 py-0.5 rounded-full font-medium">
                  {cart.length}
                </span>
              </div>
              
              <button
                id="close-cart-btn"
                onClick={() => {
                  setCheckoutStep('cart');
                  onClose();
                }}
                className="p-1 px-2 text-gray-400 hover:text-gray-900 transition-colors text-sm flex items-center gap-1"
              >
                Fermer <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shopify Shipping Progress Bar */}
            {cart.length > 0 && checkoutStep === 'cart' && (
              <div className="bg-emerald-50/80 p-4 border-b border-emerald-100/30 text-[11px] text-emerald-950 font-medium">
                <div className="flex justify-between items-center mb-1 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    Livraison instantanée 100% digitale par e-mail • GRATUIT 📩
                  </span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-emerald-200/40 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            )}

            {/* Checkout Progress Breadcrumbs */}
            {cart.length > 0 && (
              <div className="grid grid-cols-3 text-center border-b border-gray-100 bg-gray-50/50 text-[10px] font-semibold tracking-wider uppercase text-gray-500 py-2.5">
                <span className={checkoutStep === 'cart' ? 'text-black font-extrabold font-sans' : 'font-sans'}>1. Panier</span>
                <span className={checkoutStep === 'shipping' ? 'text-black font-extrabold font-sans' : 'font-sans'}>2. Coordonnées</span>
                <span className={checkoutStep === 'payment' ? 'text-black font-extrabold font-sans' : 'font-sans'}>3. Paiement</span>
              </div>
            )}

            {/* Empty State */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <ShoppingBag className="w-12 h-12 text-gray-300 stroke-[1.2] mb-3" />
                <h3 className="font-medium text-lg text-gray-800 mb-1">Votre panier est vide</h3>
                <p className="text-sm text-gray-400 max-w-xs mb-6 font-sans">
                  Parcourez nos templates Notion, personnalisez vos options et testez la validation de commande.
                </p>
                <button
                  id="checkout-continue-shopping-btn"
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-semibold tracking-wider uppercase text-white transition-all shadow-sm"
                  style={{
                    backgroundColor: themeSettings.primaryColor,
                    borderRadius: themeSettings.buttonRadius === 'none' ? '0' : themeSettings.buttonRadius === 'sm' ? '0.125rem' : themeSettings.buttonRadius === 'md' ? '0.375rem' : themeSettings.buttonRadius === 'lg' ? '0.5rem' : '9999px',
                  }}
                >
                  Continuer les achats
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto flex flex-col">
                <AnimatePresence mode="wait">
                  {checkoutStep === 'cart' && (
                    <motion.div
                      key="step-cart"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      className="p-4 space-y-4 flex-1"
                    >
                      {cart.map((item) => {
                        const variantText = Object.entries(item.selectedVariant)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(' / ');

                        return (
                          <motion.div
                            key={item.id}
                            layout
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
                          >
                            <img
                              src={item.product.images[0]}
                              alt={item.product.title}
                              className="w-16 h-16 object-cover bg-gray-50 border border-gray-100 shrink-0"
                              style={{
                                borderRadius: themeSettings.cardRadius === 'none' ? '0' : themeSettings.cardRadius === 'sm' ? '0.125rem' : themeSettings.cardRadius === 'md' ? '0.375rem' : themeSettings.cardRadius === 'lg' ? '0.5rem' : '0.75rem',
                              }}
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-semibold text-sm leading-tight text-gray-900">{item.product.title}</h4>
                                {variantText && (
                                  <p className="text-[11px] font-sans text-gray-500 font-medium mt-0.5">{variantText}</p>
                                )}
                              </div>
                              
                              <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center border border-gray-200 rounded">
                                  <button
                                    id={`qty-minus-${item.id}`}
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 px-1.5 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-xs font-semibold font-sans min-w-[20px] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    id={`qty-plus-${item.id}`}
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 px-1.5 text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-xs font-sans">
                                    {(item.product.price * item.quantity).toFixed(2)}€
                                  </span>
                                  <button
                                    id={`remove-item-${item.id}`}
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                                    title="Supprimer l'article"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}

                  {checkoutStep === 'shipping' && (
                    <motion.div
                      key="step-shipping"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="p-4 space-y-3 flex-1 font-sans"
                    >
                      <h3 className="font-semibold font-serif text-sm text-gray-900 tracking-tight">Coordonnées de réception numérique</h3>
                      
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Nom Complet</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 p-2.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Adresse Email (Pour l'envoi immédiat)</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 p-2.5 rounded-sm focus:outline-none focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800 bg-white text-gray-900"
                            placeholder="votre-email@exemple.com"
                            required
                          />
                        </div>

                        <div className="bg-emerald-50 text-emerald-950 p-3 rounded border border-emerald-100 flex items-start gap-2 text-[11px] leading-relaxed mt-2 font-medium">
                          <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block mb-0.5">Envoi garanti sous 10 secondes</span>
                            Tous nos templates d'organisation sont 100% digitaux. Indiquez votre adresse e-mail pour recevoir vos liens de duplication Notion instantanément.
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {checkoutStep === 'payment' && (
                    <motion.div
                      key="step-payment"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="p-4 space-y-4 flex-1 font-sans"
                    >
                      <h3 className="font-semibold font-serif text-sm text-gray-900 tracking-tight">Aperçu du Paiement Sécurisé</h3>
                      
                      <div className="border border-gray-100 bg-gray-50/50 p-3 rounded space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Destinataire :</span>
                          <span className="font-semibold text-right">{name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">E-mail d'envoi :</span>
                          <span className="font-semibold text-right max-w-[200px] truncate">{email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Livraison :</span>
                          <span className="font-semibold text-emerald-700 text-right">Instantanée (Gratuit) 📩</span>
                        </div>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Numéro de Carte</label>
                          <div className="relative">
                            <input
                              type="text"
                              disabled
                              value="•••• •••• •••• 4242"
                              className="w-full border border-gray-200 p-2.5 rounded-sm bg-gray-50 text-gray-400 focus:outline-none"
                            />
                            <CreditCard className="w-4 h-4 text-gray-400 absolute right-3 top-3.5" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Date d'Expiration</label>
                            <input
                              type="text"
                              disabled
                              value="12/28"
                              className="w-full border border-gray-200 p-2.5 rounded-sm bg-gray-50 text-gray-400 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Code de Sécurité (CVV)</label>
                            <input
                              type="text"
                              disabled
                              value="***"
                              className="w-full border border-gray-200 p-2.5 rounded-sm bg-gray-50 text-gray-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border border-amber-100 bg-amber-50/40 p-2.5 rounded text-[11px] text-amber-900 flex items-center gap-2">
                        <RefreshCcw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                        <span>Mode de démonstration actif. Aucune transaction financière réelle.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sticky Summary & Action Footer */}
                <div className="mt-auto border-t border-gray-100 p-4 bg-gray-50/80 space-y-3 font-sans">
                  {/* Promo Input Only Shown on Review Bag step */}
                  {checkoutStep === 'cart' && (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          id="promo-code-input"
                          type="text"
                          placeholder="Code promo (WELCOME10, CRAFT20)"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value);
                            setPromoError('');
                          }}
                          className="w-full border border-gray-200 bg-white placeholder-gray-400 p-2 text-xs rounded-sm focus:ring-1 focus:ring-zinc-800 focus:border-zinc-800"
                        />
                      </div>
                      <button
                        id="apply-promo-btn"
                        onClick={handleApplyPromo}
                        className="p-2 px-4 bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-semibold rounded-sm transition-colors"
                      >
                        Appliquer
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <p className="text-[10px] text-red-600 font-semibold">{promoError}</p>
                  )}

                  {appliedDiscount && checkoutStep === 'cart' && (
                    <div className="bg-emerald-50 text-emerald-950 p-2 rounded text-[11px] flex justify-between items-center">
                      <span className="flex items-center gap-1 font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        Code Appliqué : {appliedDiscount.code} (-{appliedDiscount.percent}%)
                      </span>
                      <button
                        id="remove-discount-btn"
                        className="text-red-700 hover:text-red-900 text-[10px] underline font-semibold"
                        onClick={() => setAppliedDiscount(null)}
                      >
                        Retirer
                      </button>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Sous-total Panier</span>
                      <span className="text-gray-900 font-bold">{subtotal.toFixed(2)}€</span>
                    </div>

                    {appliedDiscount && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Réduction ({appliedDiscount.code})</span>
                        <span>-{discountAmount.toFixed(2)}€</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Frais de livraison</span>
                      <span className="text-gray-900 font-semibold">
                        GRATUIT
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100/80 pt-1.5 mt-1.5">
                      <span className="font-semibold">Montant Total</span>
                      <span className="text-base">{grandTotal.toFixed(2)}€</span>
                    </div>
                  </div>

                  {/* Dynamic checkout labels */}
                  <div className="flex gap-2 pt-2">
                    {checkoutStep !== 'cart' && (
                      <button
                        id="checkout-back-btn"
                        onClick={() => {
                          if (checkoutStep === 'shipping') setCheckoutStep('cart');
                          if (checkoutStep === 'payment') setCheckoutStep('shipping');
                        }}
                        className="flex-1 py-3 text-xs tracking-wider uppercase bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-sm transition-all"
                      >
                        Retour
                      </button>
                    )}
                    
                    <button
                      id="checkout-action-btn"
                      onClick={handleCheckout}
                      disabled={isSubmitting}
                      className="flex-[2] py-3 text-xs tracking-wider uppercase text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 hover:shadow-lg hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: themeSettings.primaryColor,
                        borderRadius: themeSettings.buttonRadius === 'none' ? '0' : themeSettings.buttonRadius === 'sm' ? '0.125rem' : themeSettings.buttonRadius === 'md' ? '0.375rem' : themeSettings.buttonRadius === 'lg' ? '0.5rem' : '9999px',
                        textTransform: themeSettings.uppercaseButtons ? 'uppercase' : 'none',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                          Traitement en cours...
                        </>
                      ) : checkoutStep === 'cart' ? (
                        <>
                          <CreditCard className="w-3.5 h-3.5" />
                          Valider la commande
                        </>
                      ) : checkoutStep === 'shipping' ? (
                        'Continuer vers le paiement'
                      ) : (
                        `Payer & Finaliser (${grandTotal.toFixed(2)}€)`
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
