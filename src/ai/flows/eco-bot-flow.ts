'use server';
/**
 * @fileOverview A conversational AI flow for the Eco-Bot.
 *
 * - ecoBotFlow - Handles a user's message and generates a response.
 */

import { ai } from '@/ai/genkit';
import { EcoBotInput, EcoBotOutput, EcoBotInputSchema, EcoBotOutputSchema } from '../schemas';

export async function askEcoBot(input: EcoBotInput): Promise<EcoBotOutput> {
  return ecoBotFlow(input);
}

const ecoBotPrompt = ai.definePrompt({
  name: 'ecoBotPrompt',
  input: { schema: EcoBotInputSchema },
  output: { schema: EcoBotOutputSchema },
  prompt: `You are Eco-Bot, a friendly and knowledgeable AI assistant for the EcoPledger app. Your goal is to help users with their questions about environmental impact, sustainability, and how to live a greener life.

  Keep your answers concise, positive, and encouraging. Use simple language that everyone can understand.

  Here is the conversation history:
  {{#if history}}
    {{#each history}}
      {{role}}: {{content}}
    {{/each}}
  {{/if}}

  User's new message: {{message}}
`,
});

const ecoBotFlow = ai.defineFlow(
  {
    name: 'ecoBotFlow',
    inputSchema: EcoBotInputSchema,
    outputSchema: EcoBotOutputSchema,
  },
  async (input) => {
    const result = await ecoBotPrompt(input);
    const output = result.output;

    if (!output) {
      throw new Error('Failed to generate a response from the Eco-Bot.');
    }

    return output;
  }
);
