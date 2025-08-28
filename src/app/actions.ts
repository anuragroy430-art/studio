'use server';

import {
  generateEcoPledge,
} from '@/ai/flows/eco-pledge-generator';
import { askEcoBot } from '@/ai/flows/eco-bot-flow';
import { generateEcoChallenge } from '@/ai/flows/generate-challenge-flow';
import { generateForestVideo } from '@/ai/flows/generate-forest-flow';
import type { EcoPledgeInput, EcoPledgeOutput, EcoBotInput, EcoBotOutput, EcoChallengeInput, EcoChallengeOutput, GenerateForestVideoOutput } from '@/ai/schemas';

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

export async function handleGenerateChallenge(
    data: EcoChallengeInput
): Promise<EcoChallengeOutput> {
    try {
        const challengeData = await generateEcoChallenge(data);
        return challengeData;
    } catch (error) {
        console.error('Error generating eco challenge:', error);
        throw new Error('Failed to generate your eco challenge. Please try again.');
    }
}


export async function handleGenerateForestVideo(): Promise<GenerateForestVideoOutput> {
    try {
        // The AI flow now directly returns a data URI with the video content.
        // No need to fetch or re-process it here.
        const videoData = await generateForestVideo();
        return videoData;
    } catch (error) {
        console.error('Error generating forest video:', error);
        throw new Error('Failed to generate your forest video. Please try again later.');
    }
}
