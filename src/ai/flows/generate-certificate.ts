'use server';
/**
 * @fileOverview Generates a personalized eco-pledge certificate image.
 * 
 * - generateCertificate - A function that creates a certificate image.
 */

import { ai } from '@/ai/genkit';
import { CertificateInput, CertificateOutput, CertificateInputSchema, CertificateOutputSchema } from '../schemas';
import * as fs from 'fs';
import * as path from 'path';

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

    const templatePath = path.join(process.cwd(), 'public', 'certificate-template.png');
    console.log('Reading certificate template from:', templatePath);
    
    try {
      const imageBuffer = fs.readFileSync(templatePath);
      const startingImage = imageBuffer.toString('base64');
      console.log('Successfully read certificate template.');

      const prompt = `
        This is a certificate of an eco-pledge.
        The user's name is "${input.name}".
        The date is: "${input.date}".
        
        Using the provided certificate template, please fill in the user's name and the date in the designated blank spaces.
        Do not write the pledge text on the certificate. Only the name and date.
        Use an elegant, clean, and legible script font.
        Ensure the text is centered and well-placed within the available space.
        Do not change any other part of the certificate image.
      `;
      
      console.log('Calling ai.generate for image model...');
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
          { text: prompt },
          { media: { url: `data:image/png;base64,${startingImage}` } },
        ],
        config: {
            responseModalities: ['IMAGE', 'TEXT']
        }
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
      console.error('Error during certificate generation:', error);
      throw error; // Re-throw the error to be caught by the parent flow
    }
  }
);
