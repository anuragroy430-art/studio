'use server';

import {
  generateEcoPledge,
} from '@/ai/flows/eco-pledge-generator';
import { askEcoBot } from '@/ai/flows/eco-bot-flow';
import type { EcoPledgeInput, EcoPledgeOutput, EcoBotInput, EcoBotOutput } from '@/ai/schemas';

export async function handleGeneratePledge(
  data: EcoPledgeInput
): Promise<EcoPledgeOutput> {
  try {
    const pledgeData = await generateEcoPledge(data);
    return pledgeData;
  } catch (error) {
    console.error('Error generating eco pledge:', error);
    throw new Error('Failed to generate your eco pledge. Please try again.');
  }
}

export async function handleEcoBotQuery(
  data: EcoBotInput
): Promise<EcoBotOutput> {
    try {
        const botResponse = await askEcoBot(data);
        return botResponse;
    } catch (error) {
        console.error('Error with Eco-Bot:', error);
        return { response: "Sorry, I'm having a little trouble thinking right now. Please try again in a moment." };
    }
}
