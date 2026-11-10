import { contenuDe, estDisponible, type Produit } from '../../shared/catalog';
import { COULEUR_CATEGORIE, iconeDe } from '../theme';

interface Props {
  produit: Produit;
  taille?: 'mini' | 'carte' | 'grande';
  className?: string;
}

/** Visuel produit : la vraie photo si elle existe, sinon une illustration aux couleurs de la catégorie. */
export default function ProductArt({ produit, taille = 'carte', className = '' }: Props) {
  const rayon = taille === 'mini' ? 'rounded-xl' : 'rounded-[22px]';
  const grise = estDisponible(produit) ? '' : 'grayscale opacity-60';

  if (produit.image) {
    return (
      <div className={`relative overflow-hidden bg-lavis ${rayon} ${grise} ${className}`}>
        <img src={produit.image} alt={produit.titre} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }

  // Kit : toile rayée comme les cabines de l'accueil, avec les produits inclus
  const inclus = contenuDe(produit);
  if (inclus.length) {
    const icones = taille === 'mini' ? inclus.slice(0, 1) : inclus;
    const case_ = taille === 'mini' ? 'h-11 w-11 rounded-lg' : taille === 'grande' ? 'h-28 w-28 rounded-3xl' : 'h-[30%] w-[30%] rounded-2xl';
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${rayon} ${grise} ${className}`}
        style={{ backgroundImage: 'repeating-linear-gradient(90deg, var(--rayure-1) 0 18px, #fff 18px 36px)' }}
        role="img"
        aria-label={`${produit.titre} : ${inclus.map((c) => c.titre).join(', ')}`}
      >
        <div className={`flex w-full flex-wrap items-center justify-center ${taille === 'mini' ? '' : 'gap-[4%] px-[8%]'}`}>
          {icones.map((c) => {
            const Icone = iconeDe(c.icone);
            return (
              <span key={c.id} className={`flex aspect-square items-center justify-center border-[3px] border-encre bg-white ${case_}`}>
                <Icone className="h-[58%] w-[58%] text-encre" strokeWidth={1.6} aria-hidden />
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  const fond = COULEUR_CATEGORIE[produit.categorie] ?? 'var(--lavis)';
  const Icone = iconeDe(produit.icone);
  const icone = taille === 'mini' ? 'h-7 w-7' : taille === 'grande' ? 'h-32 w-32' : 'h-[42%] w-[42%]';
  const trait = taille === 'mini' ? 1.75 : 1.25;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${rayon} ${grise} ${className}`}
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
