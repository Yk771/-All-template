import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BOUTIQUE, euros } from '../../shared/config';
import { lienAccueil } from '../navigation';

export type PageLegale = 'cgv' | 'retours' | 'mentions';
export const PAGES_LEGALES: PageLegale[] = ['cgv', 'retours', 'mentions'];

// Modèles à compléter (les crochets [ ]) et à faire relire avant l'ouverture de la boutique.
const PAGES: Record<PageLegale, { titre: string; blocs: { h: string; p: ReactNode }[] }> = {
  mentions: {
    titre: 'Mentions légales',
    blocs: [
      {
        h: 'Éditeur du site',
        p: (
          <>
            {BOUTIQUE.raisonSociale}, entreprise individuelle (micro-entreprise).<br />
            SIRET : {BOUTIQUE.siret}<br />
            Adresse : {BOUTIQUE.adresse}<br />
            Contact : {BOUTIQUE.email}<br />
            Directeur de la publication : {BOUTIQUE.raisonSociale}
          </>
        ),
      },
      {
        h: 'Hébergement',
        p: 'Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.',
      },
      {
        h: 'Données personnelles',
        p: `Les informations demandées lors d’une commande (nom, adresse, e-mail, téléphone) servent uniquement à traiter et livrer ta commande. Le paiement est géré par Stripe : nous n’avons jamais accès à ton numéro de carte. Tu peux demander l’accès, la correction ou la suppression de tes données en écrivant à ${BOUTIQUE.email}.`,
      },
    ],
  },
  cgv: {
    titre: 'Conditions générales de vente',
    blocs: [
      { h: 'Vendeur', p: `${BOUTIQUE.raisonSociale}, SIRET ${BOUTIQUE.siret}, ${BOUTIQUE.adresse}. Contact : ${BOUTIQUE.email}.` },
      {
        h: 'Prix',
        p: 'Les prix sont indiqués en euros, toutes taxes comprises. [Si tu es en franchise de TVA : « TVA non applicable, article 293 B du CGI ».]',
      },
      { h: 'Commande et paiement', p: 'La commande est ferme après le paiement par carte bancaire sur la page sécurisée Stripe. Un e-mail de confirmation est envoyé.' },
      {
        h: 'Livraison',
        p: `Livraison en France métropolitaine, ${BOUTIQUE.delai.toLowerCase()} ouvrés après le paiement (délai indicatif). Frais : ${euros(BOUTIQUE.fraisPort)}, offerts dès ${euros(BOUTIQUE.livraisonOfferteDes)} d’achat.`,
      },
      {
        h: 'Droit de rétractation',
        p: 'Tu disposes de 14 jours à compter de la réception pour te rétracter, sans avoir à te justifier (article L221-18 du Code de la consommation). Le remboursement est effectué sous 14 jours après réception du retour. [Précise ici qui paie les frais de retour.]',
      },
      {
        h: 'Garanties',
        p: 'Les articles bénéficient de la garantie légale de conformité (2 ans, articles L217-3 et suivants du Code de la consommation) et de la garantie des vices cachés (articles 1641 et suivants du Code civil).',
      },
      { h: 'Médiation', p: 'En cas de litige, tu peux recourir gratuitement au médiateur de la consommation : [nom et site du médiateur].' },
    ],
  },
  retours: {
    titre: 'Retours et remboursements',
    blocs: [
      { h: '1. Préviens-nous', p: `Écris à ${BOUTIQUE.email} dans les 14 jours après réception, avec ton numéro de commande et l’article concerné.` },
      { h: '2. Renvoie l’article', p: 'On te répond avec l’adresse et la marche à suivre. L’article doit être complet, dans son emballage d’origine.' },
      { h: '3. Remboursement', p: 'Dès réception, tu es remboursé sur ta carte bancaire, au plus tard sous 14 jours.' },
    ],
  },
};

export default function LegalPage({ page }: { page: PageLegale }) {
  const { titre, blocs } = PAGES[page];
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 md:py-16">
      <a href={lienAccueil()} className="inline-flex items-center gap-2 text-sm font-bold text-encre hover:underline">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Retour à la boutique
      </a>
      <h1 className="mt-6 font-display text-4xl leading-tight text-encre md:text-5xl">{titre}</h1>
      <div className="mt-8 space-y-7">
        {blocs.map((b) => (
          <section key={b.h}>
            <h2 className="text-lg font-bold text-encre">{b.h}</h2>
            <p className="mt-1.5 leading-relaxed text-encre-douce">{b.p}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
