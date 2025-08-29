'use server';
/**
 * @fileOverview A conversational AI flow for the Eco-Bot.
 *
 * - askEcoBot - Handles a user's message and generates a response.
 */

import { ai } from '@/ai/genkit';
import { EcoBotInput, EcoBotOutput, EcoBotInputSchema, EcoBotOutputSchema } from '../schemas';

const ecoBotPrompt = ai.definePrompt({
  name: 'ecoBotPrompt',
  input: { schema: EcoBotInputSchema },
  output: { schema: EcoBotOutputSchema },
  prompt: `You are Eco-Bot, a friendly and knowledgeable AI assistant for the EcoPledger app. Your goal is to help users with their questions about environmental impact, sustainability, and how to live a greener life.

Keep your answers concise, positive, and encouraging. Use simple language that everyone can understand.

Based on the user's message and the conversation history, generate a helpful response.

Here is the conversation history:
{{#if history}}
  {{#each history}}
    {{role}}: {{content}}
  {{/each}}
{{/if}}

User's new message: {{message}}

Please place your answer in the 'response' field.`,
});

export const askEcoBot = ai.defineFlow(
  {
    name: 'ecoBotFlow',
    inputSchema: EcoBotInputSchema,
    outputSchema: EcoBotOutputSchema,
  },
  async (input: EcoBotInput): Promise<EcoBotOutput> => {
    const result = await ecoBotPrompt(input);
    const output = result.output;

    if (!output) {
      throw new Error('Failed to generate a response from the Eco-Bot.');
    }

    return output;
  }
);
