import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Minus, Plus, Truck, X } from 'lucide-react';
import { CATEGORIES, type Produit } from '../../shared/catalog';
import { BOUTIQUE, euros } from '../../shared/config';
import ProductArt from './ProductArt';

interface Props {
  produit: Produit | null;
  onFermer: () => void;
  onAjouter: (p: Produit, variante: Record<string, string>, quantite: number) => void;
}

export default function ProductModal({ produit, onFermer, onAjouter }: Props) {
  return (
    <AnimatePresence>
      {produit && <Fiche key={produit.id} produit={produit} onFermer={onFermer} onAjouter={onAjouter} />}
    </AnimatePresence>
  );
}

function Fiche({ produit, onFermer, onAjouter }: { produit: Produit } & Omit<Props, 'produit'>) {
  const [variante, setVariante] = useState<Record<string, string>>({});
  const [quantite, setQuantite] = useState(1);
  const [manque, setManque] = useState<string | null>(null);
  const fermerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fermerRef.current?.focus();
    const touche = (e: KeyboardEvent) => e.key === 'Escape' && onFermer();
    document.addEventListener('keydown', touche);
    const ancien = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', touche);
      document.body.style.overflow = ancien;
    };
  }, [onFermer]);

  const categorie = Object.values(CATEGORIES).flat().find((c) => c.id === produit.categorie)?.nom;

  const ajouter = () => {
    const absent = produit.variantes?.find((v) => !variante[v.nom]);
    if (absent) {
      setManque(absent.nom);
      return;
    }
    onAjouter(produit, variante, quantite);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-encre/50 p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onFermer}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="fiche-titre"
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[28px] bg-white sm:rounded-[28px]"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={fermerRef}
          type="button"
          onClick={onFermer}
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 text-encre shadow-sm hover:bg-lavis"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="p-4 md:p-6">
            <ProductArt produit={produit} taille="grande" className="aspect-[16/10] w-full md:aspect-square" />
          </div>

          <div className="px-6 pb-8 md:py-10 md:pl-2 md:pr-10">
            <p className="text-sm font-semibold text-encre-douce">{categorie}</p>
            <h2 id="fiche-titre" className="mt-1 font-display text-3xl leading-tight text-encre">{produit.titre}</h2>
            <p className="mt-3 text-2xl font-extrabold text-encre">{euros(produit.prix)}</p>
            <p className="mt-4 leading-relaxed text-encre-douce">{produit.description}</p>

            <ul className="mt-5 space-y-2">
              {produit.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-[15px] text-encre">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" strokeWidth={3} aria-hidden />
                  {pt}
                </li>
              ))}
            </ul>

            {produit.variantes?.map((v) => (
              <fieldset key={v.nom} className="mt-6">
                <legend className={`text-sm font-bold ${manque === v.nom ? 'text-red-600' : 'text-encre'}`}>
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

            <div className="sticky bottom-0 -mx-6 mt-7 flex items-center gap-3 border-t border-encre/10 bg-white px-6 py-3 md:static md:mx-0 md:border-0 md:p-0">
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
                className="flex-1 rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-accent-texte transition-transform hover:-translate-y-0.5"
              >
                Ajouter pour {euros(produit.prix * quantite)}
              </button>
            </div>

            <p className="mt-4 flex items-center gap-2 text-sm text-encre-douce">
              <Truck className="h-4 w-4" aria-hidden />
              {BOUTIQUE.delai}, offerte dès {euros(BOUTIQUE.livraisonOfferteDes)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
