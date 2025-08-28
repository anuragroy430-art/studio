'use server';

import {
  generateEcoPledge,
  type EcoPledgeInput,
  type EcoPledgeOutput,
} from '@/ai/flows/eco-pledge-generator';

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
