'use server';
/**
 * @fileOverview Generates a personalized eco-pledge certificate image.
 * 
 * - generateCertificate - A function that creates a certificate image.
 */

import { ai } from '@/ai/genkit';
import { CertificateInput, CertificateOutput, CertificateInputSchema, CertificateOutputSchema } from '../schemas';

export async function generateCertificate(input: CertificateInput): Promise<CertificateOutput> {
  return generateCertificateFlow(input);
}

const generateCertificateFlow = ai.defineFlow(
  {
    name: 'generateCertificateFlow',
    inputSchema: CertificateInputSchema,
    outputSchema: CertificateOutputSchema,
  },
  async (input) => {
    // Correctly construct the prompt as a string for the image model.
    const promptText = `Generate a visually appealing eco-pledge certificate.
    
    The certificate should have a nature-inspired theme, with watercolor illustrations of leaves, trees, and flowers around the border.
    The background should be a light parchment texture.
    
    Use elegant, clean fonts.
    
    The certificate must include the following text:
    
    Title: "Certificate of Eco-Pledge"
    Recipient's Name: "${input.name}"
    Pledge Statement: "${input.pledge}"
    Signature Line: "____________________"
    Date: "${input.date}"
    
    The layout should be balanced and professional.`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: promptText, // Pass the simple string prompt.
    });

    if (!media.url) {
      throw new Error('Image generation failed to produce a result.');
    }
    
    return {
      certificateUrl: media.url,
    };
  }
);
