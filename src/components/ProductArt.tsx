import type { Produit } from '../../shared/catalog';
import { COULEUR_CATEGORIE, iconeDe } from '../theme';

interface Props {
  produit: Produit;
  taille?: 'mini' | 'carte' | 'grande';
  className?: string;
}

/** Visuel produit : la vraie photo si elle existe, sinon une illustration aux couleurs de la catégorie. */
export default function ProductArt({ produit, taille = 'carte', className = '' }: Props) {
  const fond = COULEUR_CATEGORIE[produit.categorie] ?? 'var(--lavis)';
  const rayon = taille === 'mini' ? 'rounded-xl' : 'rounded-[22px]';

  if (produit.image) {
    return (
      <div className={`relative overflow-hidden ${rayon} ${className}`} style={{ background: fond }}>
        <img src={produit.image} alt={produit.titre} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }

  const Icone = iconeDe(produit.icone);
  const icone = taille === 'mini' ? 'h-7 w-7' : taille === 'grande' ? 'h-32 w-32' : 'h-[42%] w-[42%]';
  const trait = taille === 'mini' ? 1.75 : 1.25;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${rayon} ${className}`}
      style={{ background: fond }}
      role="img"
      aria-label={produit.titre}
    >
      {taille !== 'mini' && (
        <>
          {/* Bandes de toile de transat, très légères */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(255,255,255,.55) 0 14px, transparent 14px 28px)',
            }}
          />
          <div aria-hidden className="absolute -right-[12%] -top-[12%] h-[46%] w-[46%] rounded-full bg-white/45" />
        </>
      )}
      <Icone className={`relative text-encre ${icone}`} strokeWidth={trait} aria-hidden />
    </div>
  );
}
