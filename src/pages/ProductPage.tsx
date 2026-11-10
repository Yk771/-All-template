import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Link2, Minus, Plus, Truck } from 'lucide-react';
import { CATEGORIES, PRODUITS, contenuDe, estDisponible, prixAUnite, type Produit } from '../../shared/catalog';
import { BOUTIQUE, euros } from '../../shared/config';
import ProductArt from '../components/ProductArt';
import ProductCard from '../components/ProductCard';
import { aller, lienAbsolu, lienAccueil, lienProduit } from '../navigation';

interface Props {
  produit: Produit;
  onAjouter: (p: Produit, variante?: Record<string, string>, quantite?: number) => void;
}

export default function ProductPage({ produit, onAjouter }: Props) {
  const [variante, setVariante] = useState<Record<string, string>>({});
  const [quantite, setQuantite] = useState(1);
  const [manque, setManque] = useState<string | null>(null);
  const [copie, setCopie] = useState<'ok' | 'erreur' | null>(null);

  const dispo = estDisponible(produit);
  const inclus = contenuDe(produit);
  const aUnite = prixAUnite(produit);
  const categorie = Object.values(CATEGORIES).flat().find((c) => c.id === produit.categorie)?.nom;

  // Kits qui contiennent ce produit, puis produits de la même saison (même catégorie d'abord)
  const kits = PRODUITS.filter((k) => k.contenu?.includes(produit.id) && estDisponible(k));
  const suggestions = [
    ...kits,
    ...PRODUITS.filter((p) => p.saison === produit.saison && p.id !== produit.id && !p.contenu && estDisponible(p)).sort(
      (a, b) => Number(b.categorie === produit.categorie) - Number(a.categorie === produit.categorie),
    ),
  ]
    .filter((p) => !inclus.some((c) => c.id === p.id))
    .slice(0, 4);

  useEffect(() => {
    setVariante({});
    setQuantite(1);
    setManque(null);
    setCopie(null);
  }, [produit.id]);

  const ajouter = () => {
    const absent = produit.variantes?.find((v) => !variante[v.nom]);
    if (absent) {
      setManque(absent.nom);
      document.getElementById(`option-${absent.nom}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    onAjouter(produit, variante, quantite);
  };

  const copierLien = async () => {
    try {
      await navigator.clipboard.writeText(lienAbsolu(lienProduit(produit.id)));
      setCopie('ok');
    } catch {
      setCopie('erreur');
    }
  };

  const retour = lienAccueil('catalogue');

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-6 md:pb-16 md:pt-8">
      <a href={retour} onClick={(e) => aller(retour, e)} className="inline-flex items-center gap-2 text-sm font-bold text-encre hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {produit.saison === 'ete' ? 'La sélection d’été' : 'La sélection d’hiver'}
      </a>

      <div className="mt-5 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="md:sticky md:top-24 md:self-start">
          <ProductArt produit={produit} taille="grande" className="aspect-[4/3] w-full md:aspect-square" />
        </div>

        <div>
          <p className="text-sm font-semibold text-encre-douce">{categorie}</p>
          <h1 className="mt-1 font-display text-4xl leading-[1.05] text-encre md:text-5xl">{produit.titre}</h1>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-3xl font-extrabold text-encre">{euros(produit.prix)}</p>
            {inclus.length > 0 && aUnite > produit.prix && (
              <p className="text-[15px] font-semibold text-economie">
                {euros(aUnite - produit.prix)} de moins qu’en achetant les {inclus.length} articles à l’unité ({euros(aUnite)})
              </p>
            )}
          </div>

          {!dispo && (
            <p className="mt-4 rounded-2xl bg-lavis px-4 py-3 font-semibold text-encre" role="status">
              Bientôt de retour : cet article n’est plus disponible pour le moment.
            </p>
          )}

          <p className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-encre-douce">{produit.description}</p>

          {inclus.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-sm font-bold text-encre">Dans ce kit</h2>
              <ul className="mt-3 space-y-2.5">
                {inclus.map((c) => {
                  const lien = lienProduit(c.id);
                  return (
                    <li key={c.id}>
                      <a href={lien} onClick={(e) => aller(lien, e)} className="group flex items-center gap-3">
                        <ProductArt produit={c} taille="mini" className="h-12 w-12 shrink-0" />
                        <span className="flex-1 font-semibold text-encre group-hover:underline">{c.titre}</span>
                        <span className="text-sm text-encre-douce">{euros(c.prix)}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <ul className="mt-6 space-y-2">
              {produit.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-[15px] text-encre">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" strokeWidth={3} aria-hidden />
                  {pt}
                </li>
              ))}
            </ul>
          )}

          {dispo &&
            produit.variantes?.map((v) => (
              <fieldset key={v.nom} id={`option-${v.nom}`} className="mt-7 scroll-mt-24">
                <legend className={`text-sm font-bold ${manque === v.nom ? 'text-red-700' : 'text-encre'}`}>
                  {v.nom}
                  {manque === v.nom && ' : choisis une option'}
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {v.options.map((o) => {
                    const actif = variante[v.nom] === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        aria-pressed={actif}
                        onClick={() => {
                          setVariante((prev) => ({ ...prev, [v.nom]: o }));
                          if (manque === v.nom) setManque(null);
                        }}
                        className={`rounded-full border-2 px-4 py-2 text-sm font-semibold ${
                          actif ? 'border-encre bg-encre text-white' : 'border-encre/15 text-encre hover:border-encre/40'
                        }`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

          {dispo && (
            <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-encre/10 bg-white px-5 py-3 md:static md:mt-8 md:border-0 md:p-0">
              <div className="flex items-center rounded-full border-2 border-encre/15">
                <button
                  type="button"
                  onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                  className="p-3 text-encre disabled:opacity-30"
                  disabled={quantite <= 1}
                  aria-label="Retirer un"
                >
                  <Minus className="h-4 w-4" aria-hidden />
                </button>
                <span className="w-6 text-center font-bold text-encre" aria-live="polite">{quantite}</span>
                <button
                  type="button"
                  onClick={() => setQuantite((q) => Math.min(10, q + 1))}
                  className="p-3 text-encre disabled:opacity-30"
                  disabled={quantite >= 10}
                  aria-label="Ajouter un"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <button
                type="button"
                onClick={ajouter}
                className="flex-1 rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-accent-texte transition-transform hover:-translate-y-0.5 md:flex-none md:px-10"
              >
                Ajouter pour {euros(produit.prix * quantite)}
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-encre-douce">
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4" aria-hidden />
              {BOUTIQUE.delai}, offerte dès {euros(BOUTIQUE.livraisonOfferteDes)}
            </span>
            <button type="button" onClick={copierLien} className="inline-flex items-center gap-2 font-semibold text-encre hover:underline">
              <Link2 className="h-4 w-4" aria-hidden />
              {copie === 'ok' ? 'Lien copié' : 'Copier le lien'}
            </button>
            {copie === 'erreur' && <span className="w-full text-encre">Copie impossible ici : {lienAbsolu(lienProduit(produit.id))}</span>}
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-16 md:mt-20">
          <h2 className="font-display text-3xl leading-none text-encre md:text-4xl">Avec ça, on te conseille</h2>
          <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {suggestions.map((p) => (
              <li key={p.id}>
                <ProductCard produit={p} onAjouter={(x) => onAjouter(x)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
