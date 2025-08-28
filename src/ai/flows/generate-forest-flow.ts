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
    
    // The URL from Veo is temporary and needs an API key.
    // Fetch it on the server and convert to a data URI.
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
      `${video.media.url}&key=${process.env.GEMINI_API_KEY}`
    );

    if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
      throw new Error(`Failed to download video: ${videoDownloadResponse.statusText}`);
    }

    const videoBuffer = await videoDownloadResponse.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    const contentType = video.media.contentType || 'video/mp4';
    const dataUri = `data:${contentType};base64,${videoBase64}`;

    return {
        videoUrl: dataUri, 
        contentType: contentType,
    };
  }
);
