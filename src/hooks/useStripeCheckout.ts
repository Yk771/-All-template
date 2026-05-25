import { useState } from 'react';
import type { CartItem } from '../types';
import { getItemPrice } from '../utils/cartHelper';

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (cart: CartItem[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const items = cart.map((item) => {
        const variantDesc = Object.values(item.selectedVariant).join(' / ');
        const fullTitle = variantDesc ? `${item.product.title} (${variantDesc})` : item.product.title;
        return {
          productId: item.id.split('-')[0], // ex: prod_1 depuis prod_1-variant
          title: fullTitle,
          price: getItemPrice(item),
          quantity: item.quantity,
          selectedVariant: item.selectedVariant,
          customText: item.customText || '',
        };
      });

      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement');
      }

      const { url } = await response.json();
      
      // Rediriger vers Stripe Checkout
      window.location.href = url;
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { checkout, isLoading, error };
}
