import { useState } from 'react';
import type { CartItem } from '../types';

export function useStripeCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (cart: CartItem[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const items = cart.map((item) => ({
        productId: item.id.split('-')[0], // ex: prod_1 depuis prod_1-variant
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
      }));

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
