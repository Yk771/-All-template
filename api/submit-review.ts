import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { author, role, rating, quote } = req.body;

    if (!author || !role || !rating || !quote) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    if (quote.trim().length < 20) {
      return res.status(400).json({ error: 'L\'avis doit contenir au moins 20 caractères.' });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'La note doit être comprise entre 1 et 5.' });
    }

    // Send email to contact@all-tempalte.fr via Resend
    await resend.emails.send({
      from: 'ALL Template <noreply@all-tempalte.fr>',
      to: 'contact@all-tempalte.fr',
      subject: '⭐ Nouvel avis client',
      headers: {
        'X-Entity-Ref-ID': `review-${Date.now()}`,
      },
      tags: [
        { name: 'category', value: 'notification' }
      ],
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 24px; color: #1e293b; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; border-bottom: 2px solid #fbbf24; padding-bottom: 12px; margin-top: 0;">⭐ Nouvel avis client reçu</h2>
          <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 16px;">
            <p style="margin: 0 0 10px 0;"><strong>Auteur :</strong> ${author}</p>
            <p style="margin: 0 0 10px 0;"><strong>Profession / Activité :</strong> ${role}</p>
            <p style="margin: 0 0 10px 0;"><strong>Note :</strong> ${ratingNum} / 5 ⭐</p>
            <p style="margin: 0 0 10px 0;"><strong>Avis :</strong></p>
            <blockquote style="margin: 0; padding: 12px; background: #f1f5f9; border-left: 4px solid #cbd5e1; font-style: italic; color: #475569;">
              "${quote}"
            </blockquote>
          </div>
          <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 20px; margin-bottom: 0;">
            Cet avis a été enregistré localement sous la clé "pending_reviews" en attendant validation.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: 'Review submitted successfully.' });
  } catch (error: unknown) {
    console.error('Submit review error:', error);
    return res.status(500).json({ error: 'Erreur lors de la soumission de l\'avis.' });
  }
}
