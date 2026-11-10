import { useCallback, useEffect, useMemo, useState } from 'react';
import { produitsDeLaSaison, trouverProduit, type Produit } from '../shared/catalog';
import { BOUTIQUE, saisonActive, type Saison } from '../shared/config';
import Header from './components/Header';
import { Etapes, FAQ, Footer, Garanties, Hero } from './components/Sections';
import Catalogue from './components/Catalogue';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import SuccessPage from './pages/SuccessPage';
import LegalPage, { PAGES_LEGALES, type PageLegale } from './pages/LegalPage';
import { APERCU, CLE_PANIER, type ArticlePanier } from './types';

const cleDe = (id: string, variante: Record<string, string>) => `${id}|${JSON.stringify(variante)}`;

function lirePanier(): ArticlePanier[] {
  try {
    const brut = JSON.parse(localStorage.getItem(CLE_PANIER) || '[]') as { id: string; variante: Record<string, string>; quantite: number }[];
    return brut.flatMap((a) => {
      const produit = trouverProduit(a.id);
      return produit ? [{ cle: cleDe(a.id, a.variante), produit, variante: a.variante, quantite: a.quantite }] : [];
    });
  } catch {
    return [];
  }
}

const lireHash = () => window.location.hash.replace('#', '');

export default function App() {
  const surPageMerci = window.location.pathname.startsWith('/merci') || window.location.pathname.startsWith('/success');

  const [saison, setSaison] = useState<Saison>(() => saisonActive());
  const [hash, setHash] = useState(lireHash);
  const [panier, setPanier] = useState<ArticlePanier[]>(lirePanier);
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [fiche, setFiche] = useState<Produit | null>(null);

  const produits = useMemo(() => produitsDeLaSaison(saison), [saison]);
  const pageLegale = (PAGES_LEGALES as string[]).includes(hash) ? (hash as PageLegale) : null;

  useEffect(() => {
    document.documentElement.dataset.saison = saison;
    document.title = `${BOUTIQUE.nom} : ${saison === 'ete' ? 'tout pour l’été' : 'tout pour l’hiver'}`;
  }, [saison]);

  // Navigation par ancres (#catalogue, #faq…) et pages légales (#cgv, #retours, #mentions)
  useEffect(() => {
    const surChangement = () => setHash(lireHash());
    window.addEventListener('hashchange', surChangement);
    return () => window.removeEventListener('hashchange', surChangement);
  }, []);
  useEffect(() => {
    if (pageLegale) {
      window.scrollTo({ top: 0 });
      return;
    }
    const cible = hash && document.getElementById(hash);
    if (cible) cible.scrollIntoView();
  }, [hash, pageLegale]);

  useEffect(() => {
    try {
      localStorage.setItem(
        CLE_PANIER,
        JSON.stringify(panier.map((a) => ({ id: a.produit.id, variante: a.variante, quantite: a.quantite }))),
      );
    } catch {
      /* stockage indisponible : le panier reste en mémoire */
    }
  }, [panier]);

  const ajouter = useCallback((produit: Produit, variante: Record<string, string> = {}, quantite = 1) => {
    const cle = cleDe(produit.id, variante);
    setPanier((prev) => {
      const existe = prev.find((a) => a.cle === cle);
      if (existe) return prev.map((a) => (a.cle === cle ? { ...a, quantite: Math.min(10, a.quantite + quantite) } : a));
      return [...prev, { cle, produit, variante, quantite }];
    });
    setFiche(null);
    setPanierOuvert(true);
  }, []);

  const changerQuantite = useCallback((cle: string, quantite: number) => {
    setPanier((prev) =>
      quantite <= 0 ? prev.filter((a) => a.cle !== cle) : prev.map((a) => (a.cle === cle ? { ...a, quantite: Math.min(10, quantite) } : a)),
    );
  }, []);
  const retirer = useCallback((cle: string) => setPanier((prev) => prev.filter((a) => a.cle !== cle)), []);
  const fermerFiche = useCallback(() => setFiche(null), []);
  const fermerPanier = useCallback(() => setPanierOuvert(false), []);

  if (surPageMerci) return <SuccessPage />;

  const nbArticles = panier.reduce((s, a) => s + a.quantite, 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Header nbArticles={nbArticles} onPanier={() => setPanierOuvert(true)} />

      {pageLegale ? (
        <LegalPage page={pageLegale} />
      ) : (
        <main>
          <Hero saison={saison} nb={produits.length} />
          <Garanties />
          <Catalogue key={saison} saison={saison} produits={produits} onOuvrir={setFiche} onAjouter={(p) => ajouter(p)} />
          <Etapes />
          <FAQ contreSaison={BOUTIQUE.modeSaison === 'contre-saison'} />
        </main>
      )}

      <Footer />

      <ProductModal produit={fiche} onFermer={fermerFiche} onAjouter={ajouter} />
      <CartDrawer ouvert={panierOuvert} onFermer={fermerPanier} panier={panier} changerQuantite={changerQuantite} retirer={retirer} />

      {APERCU && (
        <div className="fixed bottom-4 left-4 z-30 flex items-center gap-1 rounded-full border-2 border-encre bg-white p-1 pl-4 text-sm font-bold text-encre shadow-lg">
          <span className="mr-1">Aperçu</span>
          {(['ete', 'hiver'] as Saison[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={saison === s}
              onClick={() => {
                setSaison(s);
                window.scrollTo({ top: 0 });
              }}
              className={`rounded-full px-3.5 py-1.5 ${saison === s ? 'bg-encre text-white' : 'hover:bg-lavis'}`}
            >
              {s === 'ete' ? 'Été' : 'Hiver'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
