'use server';
/**
 * @fileOverview Generates personalized eco-challenges based on a user's pledge.
 * 
 * - generateEcoChallenge - A function that creates a daily eco-challenge.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { EcoChallengeInputSchema, EcoChallengeOutputSchema } from '../schemas';
import type { EcoChallengeInput, EcoChallengeOutput } from '../schemas';

export async function generateEcoChallenge(input: EcoChallengeInput): Promise<EcoChallengeOutput> {
  return generateChallengeFlow(input);
}

const challengePrompt = ai.definePrompt({
    name: 'ecoChallengePrompt',
    input: { schema: EcoChallengeInputSchema },
    output: { schema: EcoChallengeOutputSchema },
    prompt: `You are an AI assistant for EcoPledger, designed to create engaging and actionable environmental challenges.
    
    Based on the user's pledge, generate a single, specific, and achievable daily or weekly eco-challenge.
    
    The user's pledge is: "{{pledge}}"

    Generate a response in JSON format that conforms to the following Zod schema:

    'z.object({
        title: z.string().describe("A short, catchy title for the challenge (e.g., 'Meatless Monday')."),
        description: z.string().describe("A one or two-sentence description of what the user should do."),
        benefit: z.string().describe("A brief explanation of the positive environmental impact of this action.")
    })'
    
    Make the challenge positive and encouraging. It should feel like a small step, not a huge burden.

    Return only the valid JSON object.`,
});


const generateChallengeFlow = ai.defineFlow(
  {
    name: 'generateChallengeFlow',
    inputSchema: EcoChallengeInputSchema,
    outputSchema: EcoChallengeOutputSchema,
  },
  async (input) => {
    const result = await challengePrompt(input);
    const output = result.output;

    if (!output) {
      throw new Error('Failed to generate a challenge.');
    }

    return output;
  }
);
