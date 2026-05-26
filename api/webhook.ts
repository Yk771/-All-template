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
    const variants = session.metadata?.variants || '';
    const customText = session.metadata?.customText || 'Aucune description fournie';
    const paymentId = session.payment_intent as string;
    const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) + '€' : '34.99€';

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

    const productIdList = productIds.split(',').filter(Boolean);

    // Check if personalized custom template was purchased
    const hasProd12 = productIdList.includes('prod_12');

    if (hasProd12) {
      // Send admin notification to yaakoubabid77@gmail.com
      const { error: adminEmailError } = await resend.emails.send({
        from: 'ALL Template <noreply@all-tempalte.fr>',
        to: 'alltemplate33@gmail.com',
        subject: 'Nouvelle commande template personnalisé',
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; border-bottom: 2px solid #ef4444; padding-bottom: 12px; margin-top: 0;">🎨 Nouvelle commande de template personnalisé</h2>
            <p style="font-size: 14px; margin: 16px 0;">Une nouvelle commande sur mesure vient d'être payée avec succès ! Voici les détails :</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0; width: 140px; font-size: 13px;">Email Client :</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0284c7;"><a href="mailto:${email}" style="text-decoration: none; font-weight: 650;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0; font-size: 13px;">Montant Payé :</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 650; color: #10b981;">${amountPaid}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-weight: bold; border-bottom: 1px solid #e2e8f0; font-size: 13px;">Paiement ID :</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-family: monospace; color: #64748b;">${paymentId}</td>
              </tr>
            </table>
            
            <div style="background: #f1f5f9; border-left: 4px solid #6366f1; padding: 16px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #1e293b; margin-bottom: 20px;">
              <strong style="color: #4f46e5; font-size: 14px; display: block; margin-bottom: 6px;">📝 Description demandée :</strong>
              <p style="margin: 0; white-space: pre-wrap; font-style: italic;">${customText}</p>
            </div>

            <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; font-size: 13px; line-height: 1.6; color: #78350f;">
              <strong style="color: #92400e; font-size: 14px;">📅 Rappel important :</strong><br>
              Vous devez concevoir et envoyer ce template sur-mesure à l'adresse <strong>${email}</strong> sous un délai de <strong>48 heures maximum</strong>.
            </div>
          </div>
        `
      });

      if (adminEmailError) {
        console.error('Error sending admin notification email:', adminEmailError);
      }

      // Send confirmation to customer
      const { error: clientEmailError } = await resend.emails.send({
        from: 'ALL Template <noreply@all-tempalte.fr>',
        to: email,
        subject: 'Votre demande est bien reçue - ALL Template',
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"></head>
          <body style="background:#0c0c10;color:#f1f5f9;font-family:'Segoe UI',sans-serif;margin:0;padding:0;">
            <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
              <div style="text-align:center;margin-bottom:32px;">
                <h1 style="font-size:28px;font-weight:800;color:#6ee7b7;margin:0;">ALL Template</h1>
                <p style="color:#64748b;font-size:13px;margin-top:4px;">Vos outils digitaux clés en main</p>
              </div>
              
              <div style="background:#14141c;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:28px;margin-bottom:24px;">
                <h2 style="font-size:20px;font-weight:700;margin:0 0 12px;color:#6ee7b7;">Votre demande est bien reçue ! 🚀</h2>
                <p style="color:#e2e8f0;font-size:14px;line-height:1.6;margin:0 0 16px;">Bonjour,</p>
                <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 16px;">
                  Vous recevrez votre template personnalisé sous 48h maximum à cette adresse email.
                </p>
                <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 16px;">
                  Notre concepteur est déjà mobilisé pour créer votre outil selon vos besoins précis.
                </p>
                <p style="color:#64748b;font-size:13px;margin-top:20px;border-top:1px solid rgba(255,255,255,0.05);padding-top:16px;">
                  Si vous avez des précisions, documents d'exemple ou maquettes à nous partager pour votre design, n'hésitez pas à répondre directement à cet e-mail ou à nous écrire à <a href="mailto:yaakoubabid77@gmail.com" style="color:#6ee7b7;text-decoration:none;font-weight:bold;">yaakoubabid77@gmail.com</a>.
                </p>
              </div>
              
              <p style="text-align:center;font-size:12px;color:#475569;margin:0;">
                © 2026 ALL Template. Tous droits réservés.
              </p>
            </div>
          </body>
          </html>
        `
      });

      if (clientEmailError) {
        console.error('Error sending client confirmation email:', clientEmailError);
      }
    }

    const standardProductIds = productIdList.filter(id => id !== 'prod_12');

    if (standardProductIds.length > 0) {
      const WEBHOOK_TEMPLATE_LINKS: Record<string, string> = {
        prod_1: 'https://all-template.vercel.app/templates/template-business-ultime.html',
        prod_2: 'https://all-template.vercel.app/templates/template-budget-mensuel.html',
        prod_3: 'https://all-template.vercel.app/templates/template-calendrier-contenu.html',
        prod_4: 'https://all-template.vercel.app/templates/template-suivi-clients.html',
        prod_5: 'https://all-template.vercel.app/templates/template-tracker-habitudes.html',
        prod_6: 'https://all-template.vercel.app/templates/template-planner-voyage.html',
        prod_7: 'https://all-template.vercel.app/templates/template-fitness-tracker.html',
        prod_8: 'https://all-template.vercel.app/templates/template-planner-etudiant.html',
        prod_9: 'https://all-template.vercel.app/templates/template-suivi-investissements.html',
        prod_10: 'https://all-template.vercel.app/templates/template-wedding-planner.html',
        prod_11: 'https://all-template.vercel.app/templates/template-freelance-dashboard.html',
      };

      const links = standardProductIds
        .map((pId) => {
          const link = WEBHOOK_TEMPLATE_LINKS[pId];
          const name = getProdName(pId);
          if (!link) return '';
          return `<li style="margin-bottom:12px;"><a href="${link}" style="color:#6ee7b7;font-weight:700;text-decoration:none;">📥 ${name}</a></li>`;
        })
        .filter(Boolean)
        .join('');

      // Envoyer l'email standard avec Resend
      const { error: emailError } = await resend.emails.send({
        from: 'ALL Template <noreply@all-tempalte.fr>',
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
    prod_12: 'Template Personnalisé sur Mesure',
  };
  return names[prodId] || 'Template ALL';
}
