import { motion, useReducedMotion } from 'motion/react';
import type { Saison } from '../../shared/config';

const CABINES = [
  { x: 56, couleur: 'var(--rayure-1)' },
  { x: 208, couleur: 'var(--rayure-2)' },
  { x: 360, couleur: 'var(--rayure-3)' },
];
const BASE = 372;
const L = 104; // largeur d'une cabine

/** Cabines de plage rayées : soleil et mer en été, lune, montagnes et neige en hiver. */
export default function HeroScene({ saison }: { saison: Saison }) {
  const reduit = useReducedMotion();
  const hiver = saison === 'hiver';

  return (
    <svg viewBox="0 0 520 440" className="h-auto w-full" role="img" aria-label={hiver ? 'Cabines enneigées sous la lune' : 'Cabines de plage au soleil'}>
      <defs>
        <clipPath id="cadre">
          <rect x="0" y="0" width="520" height="440" rx="34" />
        </clipPath>
        {CABINES.map((c, i) => (
          <pattern key={i} id={`rayures-${i}`} patternUnits="userSpaceOnUse" x={c.x} y="0" width="26" height="10">
            <rect width="13" height="10" fill={c.couleur} />
            <rect x="13" width="13" height="10" fill="#fff" />
          </pattern>
        ))}
      </defs>

      <g clipPath="url(#cadre)">
        <rect width="520" height="440" fill="var(--lavis-fort)" />

        {/* Soleil ou lune : la seule animation de la page */}
        <motion.g
          key={saison}
          initial={reduit ? false : { y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <circle cx="388" cy="128" r="74" fill="var(--astre)" stroke="var(--encre)" strokeWidth="3" />
          {hiver && <circle cx="414" cy="108" r="58" fill="var(--lavis-fort)" />}
        </motion.g>

        {hiver ? (
          <g stroke="var(--encre)" strokeWidth="3" strokeLinejoin="round">
            <path d="M-10 300 L90 196 L168 262 L250 170 L352 268 L430 214 L540 300 Z" fill="var(--horizon)" />
            <path d="M90 196 L66 221 L84 216 L98 228 L114 214 Z" fill="#fff" />
            <path d="M250 170 L222 199 L244 192 L258 206 L276 194 Z" fill="#fff" />
            <path d="M430 214 L410 235 L428 230 L440 240 L452 230 Z" fill="#fff" />
          </g>
        ) : (
          <>
            <path
              d="M-10 262 Q 30 248 70 262 T 150 262 T 230 262 T 310 262 T 390 262 T 470 262 T 550 262 V 330 H -10 Z"
              fill="var(--horizon)"
              stroke="var(--encre)"
              strokeWidth="3"
            />
            <path d="M120 96 q 10 -10 20 0 q 10 -10 20 0" fill="none" stroke="var(--encre)" strokeWidth="3" strokeLinecap="round" />
            <path d="M176 128 q 7 -7 14 0 q 7 -7 14 0" fill="none" stroke="var(--encre)" strokeWidth="3" strokeLinecap="round" />
          </>
        )}

        {/* Sable ou neige */}
        <rect x="-10" y="318" width="540" height="140" fill="var(--sol)" stroke="var(--encre)" strokeWidth="3" />

        {CABINES.map((c, i) => (
          <g key={i} stroke="var(--encre)" strokeWidth="3" strokeLinejoin="round">
            <path d={`M${c.x} ${BASE} V${BASE - 122} H${c.x + L} V${BASE} Z`} fill={`url(#rayures-${i})`} />
            <path d={`M${c.x - 10} ${BASE - 120} L${c.x + L / 2} ${BASE - 172} L${c.x + L + 10} ${BASE - 120} Z`} fill="var(--encre)" />
            {hiver && (
              <path
                d={`M${c.x - 10} ${BASE - 120} L${c.x + L / 2} ${BASE - 172} L${c.x + L + 10} ${BASE - 120} q -10 10 -20 0 q -12 12 -24 0 q -12 10 -22 0 q -12 12 -24 0 q -10 10 -22 0 Z`}
                fill="#fff"
              />
            )}
            <path
              d={`M${c.x + 33} ${BASE} V${BASE - 62} a19 19 0 0 1 38 0 V${BASE} Z`}
              fill="#fff"
            />
          </g>
        ))}

        {hiver &&
          [
            [40, 60], [150, 40], [260, 90], [80, 150], [300, 30], [470, 250], [200, 130], [500, 60], [30, 240], [330, 140],
          ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 5 : 3.5} fill="#fff" />)}
      </g>
    </svg>
  );
}
