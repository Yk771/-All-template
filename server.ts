// Serveur de développement local : `npm run dev` → http://localhost:3000
// Il réutilise exactement les mêmes fonctions que Vercel (dossier api/).
import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import createCheckout from './api/create-checkout.js';
import webhook from './api/webhook.js';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Le webhook Stripe doit recevoir le corps brut : il est déclaré avant express.json()
app.post('/api/webhook', (req, res) => webhook(req as any, res as any));

app.use(express.json());
app.post('/api/create-checkout', (req, res) => createCheckout(req as any, res as any));

const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
app.use(vite.middlewares);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Boutique en ligne sur http://localhost:${PORT}`);
  if (!process.env.STRIPE_SECRET_KEY) console.log('⚠ STRIPE_SECRET_KEY absente : le paiement ne marchera pas en local.');
});
