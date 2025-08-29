'use server';
/**
 * @fileOverview
 * This file defines the AI flow for generating a personalized eco-pledge.
 *
 * It includes the following:
 * - A prompt that takes user's lifestyle information and generates a pledge.
 * - A flow that uses the prompt to generate the pledge, converts it to speech, and creates a certificate.
 */

import { ai } from '@/ai/genkit';
import {
    EcoPledgeInputSchema,
    EcoPledgeOutputSchema,
    EcoPledgeInput,
    EcoPledgeOutput,
} from '../schemas';
import { generateCertificate, textToSpeech } from './utils';

const pledgePrompt = ai.definePrompt(
    {
        name: 'pledgePrompt',
        input: { schema: EcoPledgeInputSchema },
        output: { schema: EcoPledgeOutputSchema },
        model: 'googleai/gemini-1.5-flash-preview',
        prompt: `You are an environmental expert and motivational coach. Your goal is to generate a personalized, inspiring, and actionable eco-pledge based on the user's lifestyle.

        User's lifestyle information:
        - Name: {{name}}
        - Commute: {{commute}}
        - Diet: {{diet}}
        - Shopping Habits: {{shopping}}
        - Energy Use: {{energyUse}}
        - Waste Management: {{wasteManagement}}
        - Water Consumption: {{waterConsumption}}
        - Travel Habits: {{travelHabits}}

        Generate the following:
        1.  A personalized "pledge" (2-3 sentences) that is encouraging and focuses on one key area for improvement.
        2.  A brief "impact" statement (1-2 sentences) explaining the positive environmental impact of their pledge.
        3.  A "motivation" sentence (1 sentence) to keep them inspired.
        `,
    },
);

export const generateEcoPledge = async (input: EcoPledgeInput): Promise<EcoPledgeOutput> => {
    const result = await pledgePrompt(input);
    const output = result.output;

    if (!output) {
        throw new Error('Failed to generate pledge.');
    }

    try {
        const [audioUrl, certificateUrl] = await Promise.all([
            textToSpeech(output.pledge),
            generateCertificate(input.name, output.pledge, new Date().toLocaleDateString()),
        ]);
        return { ...output, audio: audioUrl, certificateUrl };
    } catch (error) {
        console.error('Error generating audio or certificate:', error);
        return { ...output, audio: '', certificateUrl: '' };
    }
};