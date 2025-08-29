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
    prompt: `You are an AI assistant for EcoPledger. Your task is to create an engaging and actionable environmental challenge based on a user's pledge.

The user's pledge is: "{{pledge}}"

Based on this pledge, please generate the following:
1. A short, catchy "title" for the challenge.
2. A one or two-sentence "description" of what the user should do. Make it a specific and achievable daily or weekly task.
3. A brief "benefit" explaining the positive environmental impact of this single action.

Make the challenge feel positive and encouraging. It should feel like a small step, not a huge burden.`,
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
