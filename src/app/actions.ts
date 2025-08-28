'use server';

import {
  generateEcoPledge,
} from '@/ai/flows/eco-pledge-generator';
import { askEcoBot } from '@/ai/flows/eco-bot-flow';
import { generateEcoChallenge } from '@/ai/flows/generate-challenge-flow';
import { generateEducationalContent } from '@/ai/flows/generate-education-content-flow';
import { greenifyImage } from '@/ai/flows/greenify-image-flow';
import type { EcoPledgeInput, EcoPledgeOutput, EcoBotInput, EcoBotOutput, EcoChallengeInput, EcoChallengeOutput, EducationContentInput, EducationContentOutput, GreenifyImageInput, GreenifyImageOutput } from '@/ai/schemas';

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

export async function handleGenerateEducationContent(
    data: EducationContentInput
): Promise<EducationContentOutput> {
    try {
        const contentData = await generateEducationalContent(data);
        return contentData;
    } catch (error) {
        console.error('Error generating educational content:', error);
        throw new Error('Failed to generate your educational content. Please try again.');
    }
}

export async function handleGreenifyImage(
    data: GreenifyImageInput
): Promise<GreenifyImageOutput> {
    try {
        const imageData = await greenifyImage(data);
        return imageData;
    } catch (error) {
        console.error('Error greenifying image:', error);
        throw new Error('Failed to greenify your image. Please try again.');
    }
}
