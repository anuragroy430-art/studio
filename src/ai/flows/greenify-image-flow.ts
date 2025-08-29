'use server';
/**
 * @fileOverview A flow to "greenify" an image based on user input.
 * 
 * - greenifyImage - A function that takes an image and a prompt and returns a new image.
 */

import { ai } from '@/ai/genkit';
import { 
    GreenifyImageInput, 
    GreenifyImageOutput, 
    GreenifyImageInputSchema, 
    GreenifyImageOutputSchema 
} from '../schemas';

export async function greenifyImage(input: GreenifyImageInput): Promise<GreenifyImageOutput> {
    
    const llmResponse = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: [
            { text: `You are an AI assistant with a talent for creative image editing. Your task is to "greenify" a user's image based on their instructions.

            User's instructions: "${input.prompt}"
            
            Analyze the user's image and their instructions.
            Generate a new image that visually incorporates eco-friendly changes as requested. Examples include adding solar panels, replacing a gas car with an electric one, turning a lawn into a native plant garden, or replacing plastic items with reusable alternatives.
            The generated image should be a realistic and aesthetically pleasing transformation of the original.
    
            Also provide a brief "explanation" describing the changes you made and their positive environmental impact. For example, "I've added solar panels to the roof, which can reduce a household's carbon footprint by several tons per year."`},
            { media: { url: input.imageDataUrl } }
        ],
        config: {
            responseModalities: ['IMAGE', 'TEXT']
        }
    });

    const generatedImage = llmResponse.media;
    const explanationText = llmResponse.text;

    if (!generatedImage?.url || !explanationText) {
      throw new Error('Image generation failed to produce a result.');
    }

    return {
      greenifiedImageUrl: generatedImage.url,
      explanation: explanationText,
    };
}