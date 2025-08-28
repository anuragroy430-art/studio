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
    console.log('Starting certificate generation flow with input:', input);

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

    console.log('Constructed image generation prompt.');

    try {
      console.log('Calling ai.generate for image model...');
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: promptText,
      });
      console.log('Image generation call completed.');

      if (!media?.url) {
        console.error('Image generation failed to produce a result URL.');
        throw new Error('Image generation failed to produce a result.');
      }
      
      console.log('Successfully generated certificate image URL.');
      return {
        certificateUrl: media.url,
      };
    } catch (error) {
      console.error('Error during image generation ai.generate call:', error);
      throw error; // Re-throw the error to be caught by the parent flow
    }
  }
);
