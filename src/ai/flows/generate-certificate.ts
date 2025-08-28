'use server';
/**
 * @fileOverview Generates a personalized eco-pledge certificate image.
 * 
 * - generateCertificate - A function that creates a certificate image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CertificateInputSchema = z.object({
  name: z.string().describe("The user's name for the certificate."),
  pledge: z.string().describe('The personalized eco-pledge text.'),
});
type CertificateInput = z.infer<typeof CertificateInputSchema>;

const CertificateOutputSchema = z.object({
  certificateUrl: z.string().describe('The data URI of the generated certificate image.'),
});
type CertificateOutput = z.infer<typeof CertificateOutputSchema>;

export async function generateCertificate(input: CertificateInput): Promise<CertificateOutput> {
  return generateCertificateFlow(input);
}

const certificatePrompt = ai.definePrompt({
    name: 'certificatePrompt',
    input: { schema: CertificateInputSchema },
    prompt: `Generate a visually appealing eco-pledge certificate.
    
    The certificate should have a nature-inspired theme, with watercolor illustrations of leaves, trees, and flowers around the border.
    The background should be a light parchment texture.
    
    Use elegant, clean fonts.
    
    The certificate must include the following text:
    
    Title: "Certificate of Eco-Pledge"
    Recipient's Name: "{{name}}"
    Pledge Statement: "{{pledge}}"
    Signature Line: "____________________"
    Date: "${new Date().toLocaleDateString()}"
    
    The layout should be balanced and professional.`,
  });

const generateCertificateFlow = ai.defineFlow(
  {
    name: 'generateCertificateFlow',
    inputSchema: CertificateInputSchema,
    outputSchema: CertificateOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: await certificatePrompt.renderText({ input }),
      config: {
        // You can add image generation specific config here
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed to produce a result.');
    }
    
    return {
      certificateUrl: media.url,
    };
  }
);
