import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { buffer } from 'micro';
import { LIENS_AMAZON } from './_sourcing.js';
import { BOUTIQUE, euros } from '../shared/config.js';

export const config = {
  api: { bodyParser: false },
};

const EMAIL_FROM = process.env.EMAIL_FROM || `${BOUTIQUE.nom} <noreply@all-tempalte.fr>`;
const EMAIL_PROPRIO = process.env.ORDER_NOTIFY_EMAIL || 'alltemplate33@gmail.com';

interface LigneCommande {
  produitId: string;
  titre: string;
  variante: string;
  quantite: number;
  total: number;
  lienAmazon: string;
}

const echapper = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });

  let event: Stripe.Event;
  try {
    const brut = await buffer(req);
    event = stripe.webhooks.constructEvent(brut, req.headers['stripe-signature']!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Signature webhook invalide :', err);
    return res.status(400).json({ error: 'Signature invalide' });
  }

  if (event.type !== 'checkout.session.completed') {
    return res.status(200).json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_details?.email || '';
  const telephone = session.customer_details?.phone || '';
  const livraison = session.shipping_details;
  const montant = (session.amount_total ?? 0) / 100;
  const paiementId = String(session.payment_intent || session.id);

  // Récupère les articles achetés (avec l'identifiant produit stocké dans Stripe)
  const items = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ['data.price.product'],
  });
  const lignes: LigneCommande[] = items.data.map((li) => {
    const produit = li.price?.product as Stripe.Product | undefined;
    const produitId = produit?.metadata?.produitId || '';
    return {
      produitId,
      titre: li.description || produit?.name || 'Article',
      variante: produit?.metadata?.variante || '',
      quantite: li.quantity ?? 1,
      total: (li.amount_total ?? 0) / 100,
      lienAmazon: LIENS_AMAZON[produitId] || '',
    };
  });

  const adresse = livraison?.address;
  const adresseTexte = [
    livraison?.name,
    adresse?.line1,
    adresse?.line2,
    [adresse?.postal_code, adresse?.city].filter(Boolean).join(' '),
    adresse?.country,
  ]
    .filter(Boolean)
    .join('\n');

  // 1) Enregistrement de la commande (si Supabase est configuré)
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
    const { error } = await supabase.from('commandes').insert({
      email,
      telephone,
      produit: lignes.map((l) => l.produitId).join(','),
      articles: lignes,
      adresse_livraison: livraison ?? null,
      montant,
      statut: 'a_commander',
      stripe_payment_id: paiementId,
      created_at: new Date().toISOString(),
    });
    if (error) console.error('Erreur Supabase :', error);
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY absente : aucun e-mail envoyé.');
    return res.status(200).json({ received: true });
  }
  const resend = new Resend(process.env.RESEND_API_KEY);

  // 2) E-mail pour toi : ce qu'il faut commander sur Amazon et où le livrer
  const lignesProprio = lignes
    .map(
      (l) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;font-size:14px;">
          <strong>${l.quantite} × ${echapper(l.titre)}</strong><br>
          <span style="color:#64748b;font-size:12px;">Réf. ${echapper(l.produitId)} · payé ${euros(l.total)}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;text-align:right;">
          ${
            l.lienAmazon
              ? `<a href="${l.lienAmazon}" style="background:#102A56;color:#fff;padding:8px 14px;border-radius:999px;text-decoration:none;font-size:13px;font-weight:700;">Commander sur Amazon</a>`
              : '<span style="color:#dc2626;font-size:12px;">Lien Amazon manquant</span>'
          }
        </td>
      </tr>`,
    )
    .join('');

  const { error: errProprio } = await resend.emails.send({
    from: EMAIL_FROM,
    to: EMAIL_PROPRIO,
    subject: `🛒 Nouvelle commande ${euros(montant)} — à passer sur Amazon`,
    html: `
      <div style="font-family:Segoe UI,Arial,sans-serif;max-width:620px;margin:0 auto;padding:24px;color:#102A56;">
        <h2 style="margin:0 0 4px;">Nouvelle commande payée</h2>
        <p style="margin:0 0 20px;color:#475569;">Commande les articles ci-dessous sur Amazon et fais-les livrer à l'adresse du client.</p>
        <table style="width:100%;border-collapse:collapse;">${lignesProprio}</table>
        <h3 style="margin:24px 0 8px;">Adresse de livraison</h3>
        <pre style="background:#f1f5f9;padding:14px;border-radius:10px;font-family:inherit;font-size:14px;white-space:pre-wrap;margin:0;">${echapper(adresseTexte)}</pre>
        <p style="font-size:13px;color:#475569;margin:12px 0 0;">
          Client : <a href="mailto:${echapper(email)}">${echapper(email)}</a>${telephone ? ` · ${echapper(telephone)}` : ''}<br>
          Total payé : <strong>${euros(montant)}</strong> · Paiement ${echapper(paiementId)}
        </p>
      </div>`,
  });
  if (errProprio) console.error('E-mail propriétaire :', errProprio);

  // 3) E-mail de confirmation pour le client
  if (email) {
    const lignesClient = lignes
      .map(
        (l) =>
          `<li style="margin:0 0 6px;">${l.quantite} × ${echapper(l.titre)} — <strong>${euros(l.total)}</strong></li>`,
      )
      .join('');

    const { error: errClient } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: `Ta commande ${BOUTIQUE.nom} est confirmée`,
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px;color:#102A56;">
          <h1 style="font-size:24px;margin:0 0 8px;">Merci pour ta commande !</h1>
          <p style="color:#475569;line-height:1.6;margin:0 0 18px;">
            Ton paiement est bien reçu. On prépare l'expédition : ${BOUTIQUE.delai.toLowerCase()} en France métropolitaine.
            Tu recevras le suivi du colis par e-mail.
          </p>
          <ul style="padding-left:18px;margin:0 0 18px;font-size:14px;">${lignesClient}</ul>
          <p style="font-size:14px;margin:0 0 18px;">Total payé : <strong>${euros(montant)}</strong></p>
          <p style="font-size:13px;color:#64748b;line-height:1.6;margin:0;">
            Livraison à : ${echapper(adresseTexte).replace(/\n/g, ', ')}<br>
            Une question ? Réponds simplement à cet e-mail ou écris à ${BOUTIQUE.email}.
          </p>
        </div>`,
    });
    if (errClient) console.error('E-mail client :', errClient);
  }

  return res.status(200).json({ received: true });
}
