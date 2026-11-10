// Après `vite build` : crée dist/produit/<id>/index.html pour chaque produit, avec son titre
// et sa description dans les balises de partage. Quand tu colles le lien d'un produit sur
// WhatsApp, Instagram ou Facebook, l'aperçu affiche le bon produit au lieu de la page d'accueil.
// Génère aussi dist/sitemap.xml pour Google (si APP_URL est défini).
import fs from 'node:fs';
import path from 'node:path';
import { PRODUITS } from '../shared/catalog.js';
import { BOUTIQUE, euros } from '../shared/config.js';

const dist = path.resolve('dist');
const modele = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const site = (process.env.APP_URL || '').replace(/\/$/, '');
const echapper = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

for (const p of PRODUITS) {
  const titre = `${p.titre} | ${BOUTIQUE.nom}`;
  const description = `${p.resume} ${euros(p.prix)}, ${BOUTIQUE.delai.toLowerCase()}.`;
  const url = site ? `${site}/produit/${p.id}` : '';
  const balises = [
    `<meta property="og:type" content="product" />`,
    `<meta property="og:site_name" content="${echapper(BOUTIQUE.nom)}" />`,
    `<meta property="og:title" content="${echapper(p.titre)}" />`,
    `<meta property="og:description" content="${echapper(description)}" />`,
    url && `<meta property="og:url" content="${url}" />`,
    url && `<link rel="canonical" href="${url}" />`,
    p.image && site && `<meta property="og:image" content="${site}${p.image}" />`,
    `<meta name="twitter:card" content="summary" />`,
  ]
    .filter(Boolean)
    .join('\n    ');

  const html = modele
    .replace(/<title>.*?<\/title>/, `<title>${echapper(titre)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${echapper(description)}" />\n    ${balises}`);

  const dossier = path.join(dist, 'produit', p.id);
  fs.mkdirSync(dossier, { recursive: true });
  fs.writeFileSync(path.join(dossier, 'index.html'), html);
}

if (site) {
  const urls = ['', ...PRODUITS.map((p) => `/produit/${p.id}`)].map((u) => `  <url><loc>${site}${u}</loc></url>`).join('\n');
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}

console.log(`${PRODUITS.length} pages produit générées${site ? ' + sitemap.xml' : ''}.`);
