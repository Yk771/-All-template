import { Lock, RotateCcw, Truck } from 'lucide-react';
import { BOUTIQUE, euros, type Saison } from '../../shared/config';
import HeroScene from './HeroScene';

export const COPIE: Record<Saison, { titre: string; texte: string; selection: string }> = {
  ete: {
    titre: 'Ton été commence ici.',
    texte:
      'Plage, chaleur, piscine : les indispensables pour profiter du soleil, que tu partes au chaud cet hiver ou que tu prépares juillet en avance.',
    selection: 'La sélection d’été',
  },
  hiver: {
    titre: 'Prêt pour le premier froid.',
    texte:
      'Plaids, gants, ski, voiture : tout pour passer l’hiver au chaud, que tu partes à la montagne ou que tu t’équipes avant tout le monde.',
    selection: 'La sélection d’hiver',
  },
};

export function Hero({ saison, nb }: { saison: Saison; nb: number }) {
  const c = COPIE[saison];
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-10 pt-10 md:grid-cols-[1.05fr_1fr] md:pt-16">
      <div>
        <h1 className="font-display text-[3.25rem] leading-[0.95] text-encre sm:text-7xl">{c.titre}</h1>
        <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-encre-douce">{c.texte}</p>
        <p className="mt-3 text-lg font-semibold text-encre">{BOUTIQUE.delai}, chez toi.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#catalogue"
            className="rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-accent-texte transition-transform hover:-translate-y-0.5"
          >
            Voir les {nb} articles
          </a>
          <a
            href="#comment"
            className="rounded-full border-2 border-encre px-6 py-3 text-[15px] font-bold text-encre hover:bg-lavis"
          >
            Comment on livre
          </a>
        </div>
      </div>
      <HeroScene saison={saison} />
    </section>
  );
}

export function Garanties() {
  const items = [
    { Icone: Truck, titre: BOUTIQUE.delai, texte: `Offerte dès ${euros(BOUTIQUE.livraisonOfferteDes)}` },
    { Icone: Lock, titre: 'Paiement sécurisé', texte: 'Carte bancaire via Stripe' },
    { Icone: RotateCcw, titre: '14 jours pour changer d’avis', texte: 'Retour simple par e-mail' },
  ];
  return (
    <section className="border-y border-encre/10 bg-lavis">
      <ul className="mx-auto grid max-w-6xl gap-5 px-5 py-6 sm:grid-cols-3">
        {items.map(({ Icone, titre, texte }) => (
          <li key={titre} className="flex items-center gap-3.5">
            <Icone className="h-6 w-6 shrink-0 text-encre" strokeWidth={1.75} aria-hidden />
            <div>
              <p className="font-bold text-encre">{titre}</p>
              <p className="text-sm text-encre-douce">{texte}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Etapes() {
  const etapes = [
    { titre: 'Tu commandes', texte: 'Tu choisis tes articles et tu paies par carte, en toute sécurité avec Stripe.' },
    { titre: 'On expédie', texte: 'Ta commande part dans la journée depuis les entrepôts de nos partenaires logistiques.' },
    { titre: 'Tu reçois', texte: `${BOUTIQUE.delai} chez toi, avec le suivi du colis envoyé par e-mail.` },
  ];
  return (
    <section id="comment" className="scroll-mt-20 bg-encre text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <h2 className="font-display text-4xl leading-none md:text-5xl">Livré en un éclair</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {etapes.map((e, i) => (
            <li key={e.titre} className="border-t-2 border-white/25 pt-5">
              <span className="font-display text-3xl text-accent">{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{e.titre}</h3>
              <p className="mt-2 max-w-xs leading-relaxed text-white/75">{e.texte}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FAQ({ contreSaison }: { contreSaison: boolean }) {
  const questions = [
    {
      q: 'Quels sont les délais de livraison ?',
      r: `${BOUTIQUE.delai} ouvrés en France métropolitaine, à partir de la confirmation de ton paiement.`,
    },
    {
      q: 'Combien coûte la livraison ?',
      r: `${euros(BOUTIQUE.fraisPort)} par commande, et elle est offerte dès ${euros(BOUTIQUE.livraisonOfferteDes)} d’achat.`,
    },
    {
      q: 'Mon colis arrive dans un carton Amazon, c’est normal ?',
      r: 'Oui. Nos articles sont expédiés par le réseau logistique d’Amazon, c’est ce qui nous permet de livrer aussi vite.',
    },
    {
      q: 'Je peux retourner un article ?',
      r: `Oui, tu as 14 jours après réception pour changer d’avis. Écris-nous à ${BOUTIQUE.email} et on t’explique la marche à suivre.`,
    },
    {
      q: 'Le paiement est-il sécurisé ?',
      r: 'Le paiement passe par Stripe, une des plateformes de paiement les plus utilisées au monde. Nous ne voyons jamais ton numéro de carte.',
    },
    ...(contreSaison
      ? [
          {
            q: 'Pourquoi des articles d’été en hiver (et l’inverse) ?',
            r: 'On vend à contre-saison : l’été quand il fait froid, l’hiver quand il fait chaud. Pratique pour préparer un voyage ou s’équiper avant tout le monde.',
          },
        ]
      : []),
  ];

  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-16 md:py-20">
      <h2 className="font-display text-4xl leading-none text-encre md:text-5xl">Tes questions</h2>
      <div className="mt-8 divide-y divide-encre/15 border-y border-encre/15">
        {questions.map(({ q, r }) => (
          <details key={q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-encre [&::-webkit-details-marker]:hidden">
              {q}
              <span className="text-2xl leading-none text-encre-douce transition-transform group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-3 max-w-2xl leading-relaxed text-encre-douce">{r}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-encre/10 bg-lavis">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl text-encre">{BOUTIQUE.nom}</p>
          <p className="mt-2 text-sm text-encre-douce">
            Une question ? <a className="font-semibold text-encre underline" href={`mailto:${BOUTIQUE.email}`}>{BOUTIQUE.email}</a>
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-encre-douce" aria-label="Informations légales">
          <a href="#cgv" className="hover:text-encre">Conditions de vente</a>
          <a href="#retours" className="hover:text-encre">Retours</a>
          <a href="#mentions" className="hover:text-encre">Mentions légales</a>
          <span>© {new Date().getFullYear()} {BOUTIQUE.nom}</span>
        </nav>
      </div>
    </footer>
  );
}
