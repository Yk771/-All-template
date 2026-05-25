import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Load env variables from .env.local first
dotenv.config({ path: '.env.local' });
dotenv.config();

console.log("Starting full-stack dev server...");
console.log("STRIPE_SECRET_KEY is loaded:", process.env.STRIPE_SECRET_KEY ? "YES" : "NO");
console.log("SUPABASE_URL works:", process.env.SUPABASE_URL ? "YES" : "NO");

const app = express();
const PORT = 3000;

// Webhook raw body endpoint
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-04-10',
    });

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    const resend = new Resend(process.env.RESEND_API_KEY!);

    const sig = req.headers['stripe-signature']!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('Webhook signature error:', err.message);
      return res.status(400).json({ error: 'Webhook signature invalide' });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email || '';
      const productIds = session.metadata?.productIds || '';
      const templateLinks = session.metadata?.templateLinks || '';
      const paymentId = session.payment_intent as string;

      const { error: dbError } = await supabase.from('commandes').insert({
        email,
        produit: productIds,
        lien_template: templateLinks,
        stripe_payment_id: paymentId,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error('Supabase error:', dbError);
      }

      const links = templateLinks
        .split(',')
        .filter(Boolean)
        .map((link: string, i: number) => {
          const prodId = productIds.split(',')[i] || '';
          const names: Record<string, string> = {
            prod_1: 'Template Notion Business Ultime',
            prod_2: 'Template de Gestion de Budget Mensuel',
            prod_3: 'Calendrier Éditorial Réseaux Sociaux',
            prod_4: 'CRM Clients & Prospects',
            prod_5: "Tracker d'Habitudes Mensuel",
            prod_6: 'Planner de Voyage Complet',
            prod_7: 'Tracker Fitness Complet',
            prod_8: 'Planner Étudiant Ultime',
            prod_9: 'Dashboard Investissements',
            prod_10: 'Organisateur de Mariage Complet',
            prod_11: 'Dashboard Freelance Pro',
          };
          const name = names[prodId] || 'Template ALL';
          return `<li style="margin-bottom:12px;"><a href="${link}" style="color:#6ee7b7;font-weight:700;text-decoration:none;">📥 ${name}</a></li>`;
        })
        .join('');

      await resend.emails.send({
        from: 'ALL Template <noreply@all-template.vercel.app>',
        to: email,
        subject: '✅ Votre achat ALL Template — Accès immédiat à vos templates',
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"></head>
          <body style="background:#0c0c10;color:#f1f5f9;font-family:'Segoe UI',sans-serif;margin:0;padding:0;">
            <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
              <div style="text-align:center;margin-bottom:32px;">
                <h1 style="font-size:28px;font-weight:800;color:#6ee7b7;margin:0;">ALL Template</h1>
                <p style="color:#64748b;font-size:13px;margin-top:4px;">Vos outils digitaux clé en main</p>
              </div>
              
              <div style="background:#14141c;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:28px;margin-bottom:24px;">
                <h2 style="font-size:20px;font-weight:700;margin:0 0 8px;">Merci pour votre achat ! 🎉</h2>
                <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px;">
                  Voici vos liens d'accès immédiats. Cliquez pour accéder à vos templates et commencez à les utiliser dès maintenant.
                </p>
                
                <div style="background:#1c1c28;border-radius:12px;padding:20px;">
                  <p style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748b;margin:0 0 14px;">Vos templates</p>
                  <ul style="list-style:none;margin:0;padding:0;">
                    ${links}
                  </ul>
                </div>
              </div>
              
              <div style="background:#14141c;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:20px;margin-bottom:24px;">
                <p style="font-size:13px;color:#64748b;margin:0;line-height:1.6;">
                  💡 <strong style="color:#f1f5f9;">Comment utiliser votre template ?</strong><br>
                  Cliquez sur le lien ci-dessus, le fichier s'ouvrira dans votre navigateur. 
                  Vous pouvez l'utiliser directement en ligne ou le sauvegarder sur votre appareil.
                </p>
              </div>
              
              <p style="text-align:center;font-size:12px;color:#475569;margin:0;">
                Une question ? Contactez-nous à <a href="mailto:yaakoubabid77@gmail.com" style="color:#6ee7b7;">yaakoubabid77@gmail.com</a><br>
                © 2026 ALL Template. Tous droits réservés.
              </p>
            </div>
          </body>
          </html>
        `,
      });
    }

    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Webhook Error" });
  }
});

// JSON parsing for standard API routes
app.use(express.json());

// Main checkout session creation route
app.post('/api/create-checkout', async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing or invalid items parameter' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-04-10',
    });

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
  } catch (error: any) {
    console.error('Stripe error:', error.message);
    return res.status(500).json({ error: error.message || 'Erreur lors de la création du paiement' });
  }
});

// Serve frontend assets with Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
