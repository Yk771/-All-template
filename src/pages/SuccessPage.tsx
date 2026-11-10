import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { BOUTIQUE } from '../../shared/config';
import { CLE_PANIER } from '../types';

export default function SuccessPage() {
  useEffect(() => {
    try {
      localStorage.removeItem(CLE_PANIER);
    } catch {
      /* stockage indisponible : rien à vider */
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-lavis px-5">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 text-center md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
          <Check className="h-8 w-8 text-accent-texte" strokeWidth={3} aria-hidden />
        </div>
        <h1 className="mt-6 font-display text-4xl leading-tight text-encre">Merci, c’est commandé !</h1>
        <p className="mt-4 leading-relaxed text-encre-douce">
          Ton paiement est confirmé. Tu vas recevoir un e-mail récapitulatif, puis le suivi du colis.
          {' '}{BOUTIQUE.delai} chez toi.
        </p>
        <a href="/" className="mt-8 inline-block rounded-full bg-encre px-6 py-3.5 text-[15px] font-bold text-white">
          Retour à la boutique
        </a>
        <p className="mt-6 text-sm text-encre-douce">
          Une question ? <a className="font-semibold text-encre underline" href={`mailto:${BOUTIQUE.email}`}>{BOUTIQUE.email}</a>
        </p>
      </div>
    </main>
  );
}
