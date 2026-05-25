import { useState } from 'react';
import SuccessPage from './pages/SuccessPage';
import { CheckCircle } from 'lucide-react';
import { ShopifySection, ThemeSettings, Product, CartItem, SelectedVariant } from './types';
import { DEFAULT_SECTIONS, THEME_PRESETS } from './data/initialData';
import StorefrontPreview from './components/StorefrontPreview';
import CartDrawer from './components/CartDrawer';
import { motion, AnimatePresence } from 'motion/react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export default function App() {
  // Route page succès après paiement
  if (window.location.pathname === '/success') {
    return <SuccessPage />;
  }

  const [sections] = useState<ShopifySection[]>(DEFAULT_SECTIONS);
  const [themeSettings] = useState<ThemeSettings>(THEME_PRESETS.dawn.settings);

  // Cart & checkout states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // UI Notifications Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto clear
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleAddToCart = (product: Product, selectedVariant: SelectedVariant, customText?: string) => {
    // Unique ID combining product + variant combination details and customText
    const uniqueCombinationId = `${product.id}-${JSON.stringify(selectedVariant)}-${customText || ''}`;

    const existing = cart.find((item) => item.id === uniqueCombinationId);

    setCart((prev) => {
      const alreadyInCart = prev.find((item) => item.id === uniqueCombinationId);
      if (alreadyInCart) {
        return prev.map((item) =>
          item.id === uniqueCombinationId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: uniqueCombinationId, product, selectedVariant, quantity: 1, customText }];
    });

    if (existing) {
      addToast(`Quantité mise à jour pour ${product.title} dans votre panier`, 'info');
    } else {
      const variantDesc = Object.values(selectedVariant).join(' / ');
      const displayTitle = variantDesc ? `${product.title} (${variantDesc})` : product.title;
      addToast(`${displayTitle} a été ajouté à votre panier !`);
    }

    // Auto trigger slide drawer open
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    const itemToRemove = cart.find((i) => i.id === id);

    setCart((prev) => prev.filter((i) => i.id !== id));

    if (itemToRemove) {
      addToast(`${itemToRemove.product.title} retiré du panier`, 'info');
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleCheckoutSuccess = () => {
    setIsCartOpen(false);
    handleClearCart();
    
    // Push custom success toast
    addToast('🎉 Votre commande a été enregistrée avec succès !', 'success');
  };

  const activeCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-neutral-800 antialiased font-sans flex flex-col relative">
      
      {/* Real storefront scrollable viewport */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <StorefrontPreview
          sections={sections}
          themeSettings={themeSettings}
          deviceMode="desktop"
          setDeviceMode={() => {}}
          activeSectionId={null}
          setActiveSectionId={() => {}}
          onAddToCart={handleAddToCart}
          cartCount={activeCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          addToast={addToast}
        />
      </div>

      {/* Sliding checkout / shopping bag side-drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQuantity={handleUpdateQuantity}
        removeItem={handleRemoveItem}
        themeSettings={themeSettings}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Beautiful standard notifications toast system */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              layout
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className={`p-3.5 rounded-lg shadow-xl border text-xs font-semibold flex items-center gap-2.5 pointer-events-auto transition-transform ${
                toast.type === 'success' 
                  ? 'bg-emerald-900 border-emerald-800 text-white shadow-emerald-950/20' 
                  : 'bg-red-950 border-red-900 text-red-100 shadow-red-950/20'
              }`}
            >
              <CheckCircle className={`w-4 h-4 shrink-0 ${toast.type === 'success' ? 'text-amber-400' : 'text-red-400'}`} />
              <div className="flex-1 pr-1">{toast.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
