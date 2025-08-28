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
        const videoData = await generateForestVideo();
        
        // The URL from Veo doesn't include the API key, so we need to add it to make it accessible on the client.
        // Also, the response might need to be Base64 encoded if we're passing it as a data URI.
        // For now, let's assume direct URL access is possible with the key.
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set in the environment.");
        }

        const videoUrlWithKey = `${videoData.videoUrl}&key=${apiKey}`;

        // Fetch the video and convert to a data URI to avoid exposing the API key on the client.
        const response = await fetch(videoUrlWithKey);
        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
        }
        const videoBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(videoBuffer).toString('base64');
        const dataUri = `data:${videoData.contentType};base64,${base64}`;

        return {
            videoUrl: dataUri,
            contentType: videoData.contentType
        };
    } catch (error) {
        console.error('Error generating forest video:', error);
        throw new Error('Failed to generate your forest video. Please try again later.');
    }
}
