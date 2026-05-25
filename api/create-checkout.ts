import Stripe from 'stripe';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

// Liens des templates par produit ID
const TEMPLATE_LINKS: Record<string, string> = {
  prod_1: 'https://all-template.vercel.app/templates/business-ultime',
  prod_2: 'https://all-template.vercel.app/templates/budget-mensuel',
  prod_3: 'https://all-template.vercel.app/templates/calendrier-contenu',
  prod_4: 'https://all-template.vercel.app/templates/crm-clients',
  prod_5: 'https://all-template.vercel.app/templates/tracker-habitudes',
  prod_6: 'https://all-template.vercel.app/templates/planner-voyage',
  prod_7: 'https://all-template.vercel.app/templates/fitness-tracker',
  prod_8: 'https://all-template.vercel.app/templates/planner-etudiant',
  prod_9: 'https://all-template.vercel.app/templates/suivi-investissements',
  prod_10: 'https://all-template.vercel.app/templates/wedding-planner',
  prod_11: 'https://all-template.vercel.app/templates/freelance-dashboard',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body;

    const lineItems = items.map((item: { productId: string; title: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          metadata: { productId: item.productId },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Metadata pour le webhook
    const productIds = items.map((i: { productId: string }) => i.productId).join(',');
    const templateLinks = items
      .map((i: { productId: string }) => TEMPLATE_LINKS[i.productId] || '')
      .filter(Boolean)
      .join(',');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}`,
      metadata: {
        productIds,
        templateLinks,
      },
      billing_address_collection: 'auto',
      locale: 'fr',
    });

    return res.status(200).json({ url: session.url });
  } catch (error: unknown) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: 'Erreur lors de la création du paiement' });
  }
}
