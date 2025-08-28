'use server';

import {
  generateEcoPledge,
} from '@/ai/flows/eco-pledge-generator';
import type { EcoPledgeInput, EcoPledgeOutput } from '@/ai/schemas';

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
