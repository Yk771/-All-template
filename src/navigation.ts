// Petites routes sans dépendance :
//  - en ligne : /produit/<id> (vraie adresse, partageable sur TikTok, Instagram…)
//  - dans l'aperçu Claude : #produit-<id> (l'aperçu n'accepte que des ancres)
import { trouverProduit } from '../shared/catalog';
import { PAGES_LEGALES, type PageLegale } from './pages/LegalPage';
import { APERCU } from './types';

export type Route =
  | { page: 'accueil'; ancre: string }
  | { page: 'produit'; id: string }
  | { page: 'legal'; id: PageLegale }
  | { page: 'merci' }
  | { page: 'introuvable' };

export function lireRoute(): Route {
  const chemin = window.location.pathname;
  const ancre = window.location.hash.replace('#', '');

  if (chemin.startsWith('/merci') || chemin.startsWith('/success')) return { page: 'merci' };
  if ((PAGES_LEGALES as string[]).includes(ancre)) return { page: 'legal', id: ancre as PageLegale };

  const m = APERCU ? ancre.match(/^produit-([a-z0-9-]+)$/) : chemin.match(/^\/produit\/([a-z0-9-]+)\/?$/);
  if (m) return trouverProduit(m[1]) ? { page: 'produit', id: m[1] } : { page: 'introuvable' };
  if (!APERCU && chemin !== '/' && chemin !== '/index.html') return { page: 'introuvable' };

  return { page: 'accueil', ancre };
}

export const lienProduit = (id: string) => (APERCU ? `#produit-${id}` : `/produit/${id}`);
export const lienAccueil = (ancre = '') => (APERCU ? `#${ancre}` : `/${ancre ? `#${ancre}` : ''}`);
export const lienAbsolu = (lien: string) => new URL(lien, window.location.href).href;

const ecouteurs = new Set<() => void>();
export function surNavigation(f: () => void) {
  ecouteurs.add(f);
  window.addEventListener('popstate', f);
  window.addEventListener('hashchange', f);
  return () => {
    ecouteurs.delete(f);
    window.removeEventListener('popstate', f);
    window.removeEventListener('hashchange', f);
  };
}

/** Navigation sans rechargement. À utiliser dans le onClick des liens internes. */
export function aller(lien: string, e?: { preventDefault: () => void; metaKey?: boolean; ctrlKey?: boolean }) {
  if (e?.metaKey || e?.ctrlKey) return; // ouvrir dans un nouvel onglet : on laisse faire le navigateur
  e?.preventDefault();
  if (APERCU) {
    window.location.hash = lien.replace(/^#/, '');
    return;
  }
  window.history.pushState({}, '', lien);
  ecouteurs.forEach((f) => f());
}
