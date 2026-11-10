import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Lock, Minus, Plus, Trash2, X } from 'lucide-react';
import { contenuDe, estDisponible } from '../../shared/catalog';
import { BOUTIQUE, euros, fraisDePort } from '../../shared/config';
import { useStripeCheckout } from '../hooks/useStripeCheckout';
import { APERCU, type ArticlePanier } from '../types';
import ProductArt from './ProductArt';
import { aller, lienAccueil } from '../navigation';

interface Props {
  ouvert: boolean;
  onFermer: () => void;
  panier: ArticlePanier[];
  changerQuantite: (cle: string, quantite: number) => void;
  retirer: (cle: string) => void;
}

export default function CartDrawer({ ouvert, onFermer, panier, changerQuantite, retirer }: Props) {
  const { payer, chargement, erreur } = useStripeCheckout();
  const fermerRef = useRef<HTMLButtonElement>(null);

  const sousTotal = panier.reduce((s, a) => s + a.produit.prix * a.quantite, 0);
  const port = fraisDePort(sousTotal);
  const total = sousTotal + port;
  const reste = Math.max(0, BOUTIQUE.livraisonOfferteDes - sousTotal);
  const progression = Math.min(100, (sousTotal / BOUTIQUE.livraisonOfferteDes) * 100);
  const indisponibles = panier.filter((a) => !estDisponible(a.produit));

  useEffect(() => {
    if (!ouvert) return;
    fermerRef.current?.focus();
    const touche = (e: KeyboardEvent) => e.key === 'Escape' && onFermer();
    document.addEventListener('keydown', touche);
    return () => document.removeEventListener('keydown', touche);
  }, [ouvert, onFermer]);

  return (
    <AnimatePresence>
      {ouvert && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-encre/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onFermer}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="panier-titre"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-encre/10 px-6 py-5">
              <h2 id="panier-titre" className="font-display text-2xl text-encre">Ton panier</h2>
              <button ref={fermerRef} type="button" onClick={onFermer} className="rounded-full p-2 text-encre hover:bg-lavis" aria-label="Fermer le panier">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            {panier.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <p className="text-lg font-bold text-encre">Ton panier est vide.</p>
                <p className="mt-1 text-encre-douce">Ajoute un article pour le retrouver ici.</p>
                <a
                  href={lienAccueil('catalogue')}
                  onClick={(e) => {
                    onFermer();
                    aller(lienAccueil('catalogue'), e);
                  }}
                  className="mt-5 rounded-full bg-encre px-5 py-2.5 text-sm font-bold text-white"
                >
                  Voir la sélection
                </a>
              </div>
            ) : (
              <>
                <div className="border-b border-encre/10 px-6 py-4">
                  <p className="text-sm font-semibold text-encre">
                    {reste > 0 ? `Plus que ${euros(reste)} pour la livraison offerte` : 'Livraison offerte'}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-lavis" aria-hidden>
                    <div className="h-full rounded-full bg-accent-2 transition-[width] duration-500" style={{ width: `${progression}%` }} />
                  </div>
                </div>

                <ul className="flex-1 divide-y divide-encre/10 overflow-y-auto px-6">
                  {panier.map((a) => {
                    const options = Object.values(a.variante).join(', ');
                    const inclus = contenuDe(a.produit).map((c) => c.titre).join(', ');
                    const dispo = estDisponible(a.produit);
                    return (
                      <li key={a.cle} className="flex gap-4 py-5">
                        <ProductArt produit={a.produit} taille="mini" className="h-20 w-20 shrink-0" />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-bold leading-snug text-encre">{a.produit.titre}</p>
                              {options && <p className="text-sm text-encre-douce">{options}</p>}
                              {inclus && <p className="text-sm text-encre-douce">{inclus}</p>}
                              {!dispo && <p className="text-sm font-semibold text-red-700">Plus disponible : retire-le pour payer</p>}
                            </div>
                            <p className="shrink-0 font-bold text-encre">{euros(a.produit.prix * a.quantite)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border-2 border-encre/15">
                              <button type="button" onClick={() => changerQuantite(a.cle, a.quantite - 1)} className="p-1.5 text-encre" aria-label={`Retirer un ${a.produit.titre}`}>
                                <Minus className="h-3.5 w-3.5" aria-hidden />
                              </button>
                              <span className="w-6 text-center text-sm font-bold text-encre">{a.quantite}</span>
                              <button
                                type="button"
                                onClick={() => changerQuantite(a.cle, a.quantite + 1)}
                                disabled={a.quantite >= 10}
                                className="p-1.5 text-encre disabled:opacity-30"
                                aria-label={`Ajouter un ${a.produit.titre}`}
                              >
                                <Plus className="h-3.5 w-3.5" aria-hidden />
                              </button>
                            </div>
                            <button type="button" onClick={() => retirer(a.cle)} className="inline-flex items-center gap-1 text-sm text-encre-douce hover:text-encre">
                              <Trash2 className="h-3.5 w-3.5" aria-hidden />
                              Retirer
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t border-encre/10 bg-lavis px-6 py-5">
                  <dl className="space-y-1.5 text-[15px]">
                    <div className="flex justify-between text-encre-douce">
                      <dt>Sous-total</dt>
                      <dd>{euros(sousTotal)}</dd>
                    </div>
                    <div className="flex justify-between text-encre-douce">
                      <dt>Livraison ({BOUTIQUE.delai.toLowerCase()})</dt>
                      <dd>{port === 0 ? 'Offerte' : euros(port)}</dd>
                    </div>
                    <div className="flex justify-between pt-1 text-lg font-extrabold text-encre">
                      <dt>Total</dt>
                      <dd>{euros(total)}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => payer(panier)}
                    disabled={chargement || indisponibles.length > 0}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-encre px-6 py-4 text-[15px] font-bold text-white disabled:opacity-60"
                  >
                    <Lock className="h-4 w-4" aria-hidden />
                    {chargement ? 'Redirection vers le paiement…' : `Payer ${euros(total)}`}
                  </button>
                  {erreur && <p className="mt-3 text-center text-sm font-semibold text-red-700" role="alert">{erreur}</p>}
                  {!erreur && (
                    <p className="mt-3 text-center text-xs text-encre-douce">
                      {APERCU ? 'Aperçu : le paiement s’active une fois le site en ligne.' : 'Adresse de livraison et carte demandées sur la page sécurisée Stripe.'}
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
