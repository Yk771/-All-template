import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES, type Produit } from '../../shared/catalog';
import { euros, type Saison } from '../../shared/config';
import ProductArt from './ProductArt';
import { COPIE } from './Sections';

interface Props {
  saison: Saison;
  produits: Produit[];
  onOuvrir: (p: Produit) => void;
  onAjouter: (p: Produit) => void;
}

const normaliser = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

export default function Catalogue({ saison, produits, onOuvrir, onAjouter }: Props) {
  const [categorie, setCategorie] = useState<string>('tout');
  const [recherche, setRecherche] = useState('');

  const categories = CATEGORIES[saison];
  const nomCategorie = (id: string) => categories.find((c) => c.id === id)?.nom ?? '';

  const visibles = useMemo(() => {
    const q = normaliser(recherche.trim());
    return produits.filter(
      (p) =>
        (categorie === 'tout' || p.categorie === categorie) &&
        (!q || normaliser(`${p.titre} ${p.resume}`).includes(q)),
    );
  }, [produits, categorie, recherche]);

  const filtres = [{ id: 'tout', nom: 'Tout' }, ...categories];

  return (
    <section id="catalogue" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-14 md:py-20">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <h2 className="font-display text-4xl leading-none text-encre md:text-5xl">{COPIE[saison].selection}</h2>
        <label className="relative block md:w-72">
          <span className="sr-only">Rechercher un article</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-encre-douce" aria-hidden />
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un article"
            className="w-full rounded-full border-2 border-encre/15 bg-white py-2.5 pl-10 pr-4 text-[15px] text-encre placeholder:text-encre-douce/70 focus:border-encre focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrer par usage">
        {filtres.map((f) => {
          const nb = f.id === 'tout' ? produits.length : produits.filter((p) => p.categorie === f.id).length;
          const actif = categorie === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={actif}
              onClick={() => setCategorie(f.id)}
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                actif ? 'border-encre bg-encre text-white' : 'border-encre/15 bg-white text-encre hover:border-encre/40'
              }`}
            >
              {f.nom} <span className={actif ? 'text-white/70' : 'text-encre-douce'}>{nb}</span>
            </button>
          );
        })}
      </div>

      {visibles.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-lavis px-6 py-12 text-center">
          <p className="text-lg font-bold text-encre">Aucun article ne correspond à « {recherche} ».</p>
          <button
            type="button"
            onClick={() => {
              setRecherche('');
              setCategorie('tout');
            }}
            className="mt-4 rounded-full bg-encre px-5 py-2.5 text-sm font-bold text-white"
          >
            Voir toute la sélection
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {visibles.map((p) => (
            <li key={p.id} className="flex flex-col">
              <button type="button" onClick={() => onOuvrir(p)} className="group text-left" aria-label={`Voir ${p.titre}`}>
                <div className="relative">
                  <ProductArt produit={p} className="aspect-square w-full transition-transform duration-300 group-hover:-translate-y-1" />
                  {p.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-encre">
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[13px] font-semibold text-encre-douce">{nomCategorie(p.categorie)}</p>
                <h3 className="mt-0.5 text-[17px] font-bold leading-snug text-encre group-hover:underline">{p.titre}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-encre-douce">{p.resume}</p>
              </button>
              <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                <span className="text-lg font-extrabold text-encre">{euros(p.prix)}</span>
                <button
                  type="button"
                  onClick={() => (p.variantes?.length ? onOuvrir(p) : onAjouter(p))}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-texte transition-transform hover:-translate-y-0.5"
                >
                  {p.variantes?.length ? 'Choisir' : 'Ajouter'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
