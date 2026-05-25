import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buffer } from 'micro';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature error:', err);
    return res.status(400).json({ error: 'Webhook signature invalide' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || '';
    const productIds = session.metadata?.productIds || '';
    const templateLinks = session.metadata?.templateLinks || '';
    const paymentId = session.payment_intent as string;

    // Enregistrer dans Supabase
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

    // Construire les liens pour l'email
    const links = templateLinks
      .split(',')
      .filter(Boolean)
      .map((link: string, i: number) => {
        const prodId = productIds.split(',')[i] || '';
        const name = getProdName(prodId);
        return `<li style="margin-bottom:12px;"><a href="${link}" style="color:#6ee7b7;font-weight:700;text-decoration:none;">📥 ${name}</a></li>`;
      })
      .join('');

    // Envoyer l'email avec Resend
    const { error: emailError } = await resend.emails.send({
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

    if (emailError) {
      console.error('Resend error:', emailError);
    }
  }

  return res.status(200).json({ received: true });
}

function getProdName(prodId: string): string {
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
  return names[prodId] || 'Template ALL';
}