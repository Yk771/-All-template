import { ShoppingBag } from 'lucide-react';
import { BOUTIQUE, euros } from '../../shared/config';
import { lienAccueil } from '../navigation';

interface Props {
  nbArticles: number;
  onPanier: () => void;
}

export default function Header({ nbArticles, onPanier }: Props) {
  return (
    <>
      <div className="bg-encre px-4 py-2 text-center text-[13px] font-medium text-white">
        Livraison offerte dès {euros(BOUTIQUE.livraisonOfferteDes)}, {BOUTIQUE.delai.toLowerCase()}<span className="hidden sm:inline"> en France métropolitaine</span>
      </div>
      <header className="sticky top-0 z-30 border-b border-encre/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href={lienAccueil()} className="font-display text-2xl leading-none text-encre" aria-label={`${BOUTIQUE.nom}, accueil`}>
            {BOUTIQUE.nom}
          </a>
          <nav className="hidden items-center gap-7 text-[15px] font-semibold text-encre-douce md:flex" aria-label="Navigation principale">
            <a href={lienAccueil('catalogue')} className="hover:text-encre">La sélection</a>
            <a href={lienAccueil('comment')} className="hover:text-encre">Livraison</a>
            <a href={lienAccueil('faq')} className="hover:text-encre">Questions</a>
          </nav>
          <button
            type="button"
            onClick={onPanier}
            className="relative inline-flex items-center gap-2 rounded-full border-2 border-encre px-4 py-2 text-sm font-bold text-encre transition-colors hover:bg-encre hover:text-white"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            Panier
            <span className="min-w-5 rounded-full bg-accent px-1.5 text-center text-xs leading-5 text-accent-texte" aria-label={`${nbArticles} article${nbArticles > 1 ? 's' : ''}`}>
              {nbArticles}
            </span>
          </button>
        </div>
      </header>
    </>
  );
}
