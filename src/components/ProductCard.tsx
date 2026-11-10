import { CATEGORIES, estDisponible, prixAUnite, type Produit } from '../../shared/catalog';
import { euros } from '../../shared/config';
import { aller, lienProduit } from '../navigation';
import ProductArt from './ProductArt';

const nomCategorie = (id: string) => Object.values(CATEGORIES).flat().find((c) => c.id === id)?.nom ?? '';

interface Props {
  produit: Produit;
  onAjouter: (p: Produit) => void;
}

export default function ProductCard({ produit: p, onAjouter }: Props) {
  const lien = lienProduit(p.id);
  const dispo = estDisponible(p);
  const economie = p.contenu ? prixAUnite(p) - p.prix : 0;

  return (
    <article className="flex h-full flex-col">
      <a href={lien} onClick={(e) => aller(lien, e)} className="group block">
        <div className="relative">
          <ProductArt produit={p} className="aspect-square w-full transition-transform duration-300 group-hover:-translate-y-1" />
          {!dispo ? (
            <span className="absolute left-3 top-3 rounded-full bg-encre px-2.5 py-1 text-xs font-bold text-white">Bientôt de retour</span>
          ) : (
            p.badge && (
              <span className="absolute left-3 top-3 rounded-full border-2 border-encre bg-white px-2.5 py-0.5 text-xs font-bold text-encre">
                {p.badge}
              </span>
            )
          )}
        </div>
        <p className="mt-3 text-[13px] font-semibold text-encre-douce">{nomCategorie(p.categorie)}</p>
        <h3 className="mt-0.5 text-[17px] font-bold leading-snug text-encre group-hover:underline">{p.titre}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-encre-douce">{p.resume}</p>
      </a>
      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <div className="leading-tight">
          <span className="text-lg font-extrabold text-encre">{euros(p.prix)}</span>
          {economie > 0 && <span className="block text-xs font-semibold text-economie">{euros(economie)} de moins qu’à l’unité</span>}
        </div>
        {!dispo ? (
          <span className="rounded-full border-2 border-encre/15 px-3.5 py-1.5 text-sm font-bold text-encre-douce">Indisponible</span>
        ) : p.variantes?.length ? (
          <a
            href={lien}
            onClick={(e) => aller(lien, e)}
            className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-texte transition-transform hover:-translate-y-0.5"
          >
            Choisir
          </a>
        ) : (
          <button
            type="button"
            onClick={() => onAjouter(p)}
            className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-texte transition-transform hover:-translate-y-0.5"
          >
            Ajouter
          </button>
        )}
      </div>
    </article>
  );
}
