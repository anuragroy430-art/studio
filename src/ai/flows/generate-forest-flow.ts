'use server';
/**
 * @fileOverview Generates a video of a forest growing using a text-to-video model.
 * 
 * - generateForestVideo - A function that creates the video.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import { GenerateForestVideoOutputSchema } from '../schemas';
import type { GenerateForestVideoOutput } from '../schemas';


export async function generateForestVideo(): Promise<GenerateForestVideoOutput> {
  return generateForestFlow();
}

const generateForestFlow = ai.defineFlow(
  {
    name: 'generateForestFlow',
    inputSchema: z.void(),
    outputSchema: GenerateForestVideoOutputSchema,
  },
  async () => {
    console.log('Starting forest video generation flow...');

    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: 'A cinematic, photorealistic time-lapse of a barren, dry landscape transforming over time into a lush, vibrant, and dense green forest. Show seedlings sprouting, growing into saplings, and finally into mature trees.',
      config: {
        durationSeconds: 8,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
        throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. This may take some time.
    while (!operation.done) {
        console.log('Checking video generation status...');
        // Add a delay to avoid hitting rate limits while polling
        await new Promise((resolve) => setTimeout(resolve, 5000));
        operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
        console.error('Failed to generate video:', operation.error);
        throw new Error('Failed to generate video: ' + operation.error.message);
    }
    
    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video || !video.media?.url) {
        console.error('Failed to find the generated video in the operation output.');
        throw new Error('Failed to find the generated video');
    }

    console.log('Successfully generated forest video.');
    return {
        // The URL is already a data URI containing the video data
        videoUrl: video.media.url, 
        contentType: video.media.contentType || 'video/mp4'
    };
  }
);
