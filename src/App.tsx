import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { produitsDeLaSaison, trouverProduit, type Produit } from '../shared/catalog';
import { BOUTIQUE, saisonActive, type Saison } from '../shared/config';
import Header from './components/Header';
import { Etapes, FAQ, Footer, Garanties, Hero } from './components/Sections';
import Catalogue from './components/Catalogue';
import CartDrawer from './components/CartDrawer';
import SuccessPage from './pages/SuccessPage';
import LegalPage from './pages/LegalPage';
import ProductPage from './pages/ProductPage';
import { aller, lienAccueil, lireRoute, surNavigation, type Route } from './navigation';
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

function majMeta(titre: string, description: string) {
  document.title = titre;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
}

export default function App() {
  const [route, setRoute] = useState<Route>(lireRoute);
  const [saison, setSaison] = useState<Saison>(() => saisonActive());
  const [panier, setPanier] = useState<ArticlePanier[]>(lirePanier);
  const [panierOuvert, setPanierOuvert] = useState(false);
  const scrollAccueil = useRef(0);
  const routePrecedente = useRef<Route>(route);

  const produits = useMemo(() => produitsDeLaSaison(saison), [saison]);

  useEffect(() => surNavigation(() => setRoute(lireRoute())), []);

  useEffect(() => {
    document.documentElement.dataset.saison = route.page === 'produit' ? trouverProduit(route.id)!.saison : saison;
  }, [saison, route]);

  // Défilement : haut de page pour un produit, ancre ou position mémorisée pour l'accueil
  useLayoutEffect(() => {
    const avant = routePrecedente.current;
    routePrecedente.current = route;
    if (route.page === 'accueil') {
      const cible = route.ancre && document.getElementById(route.ancre);
      if (cible) cible.scrollIntoView();
      else if (avant.page === 'produit') window.scrollTo({ top: scrollAccueil.current });
    } else if (avant.page !== route.page || (route.page === 'produit' && avant.page === 'produit' && avant.id !== route.id)) {
      window.scrollTo({ top: 0 });
    }
  }, [route]);
  useEffect(() => {
    if (route.page !== 'accueil') return;
    const memoriser = () => (scrollAccueil.current = window.scrollY);
    window.addEventListener('scroll', memoriser, { passive: true });
    return () => window.removeEventListener('scroll', memoriser);
  }, [route.page]);

  useEffect(() => {
    if (route.page === 'produit') {
      const p = trouverProduit(route.id)!;
      majMeta(`${p.titre} | ${BOUTIQUE.nom}`, p.resume);
    } else {
      majMeta(`${BOUTIQUE.nom} : ${saison === 'ete' ? 'tout pour l’été' : 'tout pour l’hiver'}`, `Les indispensables de la saison, ${BOUTIQUE.delai.toLowerCase()}.`);
    }
  }, [route, saison]);

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
    setPanierOuvert(true);
  }, []);

  const changerQuantite = useCallback((cle: string, quantite: number) => {
    setPanier((prev) =>
      quantite <= 0 ? prev.filter((a) => a.cle !== cle) : prev.map((a) => (a.cle === cle ? { ...a, quantite: Math.min(10, quantite) } : a)),
    );
  }, []);
  const retirer = useCallback((cle: string) => setPanier((prev) => prev.filter((a) => a.cle !== cle)), []);
  const fermerPanier = useCallback(() => setPanierOuvert(false), []);

  if (route.page === 'merci') return <SuccessPage />;

  const nbArticles = panier.reduce((s, a) => s + a.quantite, 0);
  const accueil = lienAccueil();

  return (
    <div className="flex min-h-screen flex-col">
      <Header nbArticles={nbArticles} onPanier={() => setPanierOuvert(true)} />

      <div className="flex-1">
        {route.page === 'legal' && <LegalPage page={route.id} />}
        {route.page === 'produit' && <ProductPage produit={trouverProduit(route.id)!} onAjouter={ajouter} />}
        {route.page === 'introuvable' && (
          <main className="mx-auto max-w-xl px-5 py-24 text-center">
            <h1 className="font-display text-4xl text-encre">Cette page n’existe plus.</h1>
            <p className="mt-3 text-encre-douce">L’article a peut-être quitté la sélection.</p>
            <a href={accueil} onClick={(e) => aller(accueil, e)} className="mt-6 inline-block rounded-full bg-encre px-6 py-3 font-bold text-white">
              Voir la sélection
            </a>
          </main>
        )}
        {route.page === 'accueil' && (
          <main>
            <Hero saison={saison} nb={produits.length} />
            <Garanties />
            <Catalogue key={saison} saison={saison} produits={produits} onAjouter={(p) => ajouter(p)} />
            <Etapes />
            <FAQ contreSaison={BOUTIQUE.modeSaison === 'contre-saison'} />
          </main>
        )}
      </div>

      <Footer />
      {route.page === 'produit' && <div className="h-20 md:hidden" aria-hidden />}

      <CartDrawer ouvert={panierOuvert} onFermer={fermerPanier} panier={panier} changerQuantite={changerQuantite} retirer={retirer} />

      {APERCU && route.page === 'accueil' && (
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
