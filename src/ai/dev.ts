import { config } from 'dotenv';
config();

import '@/ai/schemas.ts';
import '@/ai/flows/eco-pledge-generator.ts';
import '@/ai/flows/generate-certificate.ts';
import '@/ai/flows/eco-bot-flow.ts';
import '@/ai/flows/generate-challenge-flow.ts';
import '@/ai/flows/generate-forest-flow.ts';
