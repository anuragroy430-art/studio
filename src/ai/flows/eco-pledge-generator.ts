'use server';
/**
 * @fileOverview
 * This file defines the AI flow for generating a personalized eco-pledge.
 *
 * It includes the following:
 * - A prompt that takes user's lifestyle information and generates a pledge.
 * - A flow that uses the prompt to generate the pledge, converts it to speech, and creates a certificate.
 */

import { ai } from '@/ai/genkit';
import {
    EcoPledgeInputSchema,
    EcoPledgeOutputSchema,
    EcoPledgeInput,
    EcoPledgeOutput,
} from '../schemas';
import { generateCertificate, textToSpeech } from './utils';

const pledgePrompt = ai.definePrompt(
    {
        name: 'pledgePrompt',
        input: { schema: EcoPledgeInputSchema },
        output: { schema: EcoPledgeOutputSchema },
        prompt: `You are an environmental expert and motivational coach. Your goal is to generate a personalized, inspiring, and actionable eco-pledge based on the user's lifestyle.

        User's lifestyle information:
        - Name: {{name}}
        - Commute: {{commute}}
        - Diet: {{diet}}
        - Shopping Habits: {{shopping}}
        - Energy Use: {{energyUse}}
        - Waste Management: {{wasteManagement}}
        - Water Consumption: {{waterConsumption}}
        - Travel Habits: {{travelHabits}}

        Generate the following:
        1.  A personalized "pledge" (2-3 sentences) that is encouraging and focuses on one key area for improvement.
        2.  A brief "impact" statement (1-2 sentences) explaining the positive environmental impact of their pledge.
        3.  A "motivation" sentence (1 sentence) to keep them inspired.
        `,
    },
);

export const generateEcoPledge = async (input: EcoPledgeInput): Promise<EcoPledgeOutput> => {
    const result = await pledgePrompt(input);
    const output = result.output;

    if (!output) {
        throw new Error('Failed to generate pledge.');
    }

    try {
        const [audioUrl, certificateUrl] = await Promise.all([
            textToSpeech(output.pledge),
            generateCertificate(input.name, output.pledge, new Date().toLocaleDateString()),
        ]);
        return { ...output, audio: audioUrl, certificateUrl };
    } catch (error) {
        console.error('Error generating audio or certificate:', error);
        return { ...output, audio: '', certificateUrl: '' };
    }
};


async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs = [] as any[];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
  }

const ecoPledgeFlow = ai.defineFlow(
  {
    name: 'ecoPledgeFlow',
    inputSchema: LifestyleQuestionsSchema,
    outputSchema: EcoPledgeOutputSchema,
  },
  async (input: EcoPledgeInput): Promise<EcoPledgeOutput> => {
    console.log('Starting ecoPledgeFlow with input:', input.name);

    const pledgeResult = await ecoPledgePrompt(input);
    const output = pledgeResult.output;

    if (!output) {
      console.error('Failed to generate pledge text from ecoPledgePrompt.');
      throw new Error('Failed to generate pledge output from the main prompt.');
    }
    console.log('Successfully generated pledge text.');

    const [certificateResult, ttsResult] = await Promise.allSettled([
      (async () => {
        try {
          console.log('Starting certificate generation...');
          const cert = await generateCertificate({ name: input.name, pledge: output.pledge, date: input.currentDate });
          console.log('Successfully generated certificate.');
          return cert;
        } catch (error) {
          console.error('Error during certificate generation:', error);
          return null;
        }
      })(),
      (async () => {
        try {
          console.log('Starting TTS generation...');
          const tts = await ai.generate({
            model: 'googleai/gemini-2.5-flash-preview-tts',
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
              },
            },
            prompt: output.pledge,
          });
          console.log('Successfully generated TTS audio.');
          return tts;
        } catch (error) {
          console.error('Error during TTS generation:', error);
          return null;
        }
      })()
    ]);
    
    if (certificateResult.status === 'fulfilled' && certificateResult.value?.certificateUrl) {
      output.certificateUrl = certificateResult.value.certificateUrl;
    } else {
      console.warn('Certificate generation did not return a URL or failed.');
    }

    if (ttsResult.status === 'fulfilled' && ttsResult.value?.media?.url) {
       const audioBuffer = Buffer.from(
          ttsResult.value.media.url.substring(ttsResult.value.media.url.indexOf(',') + 1),
          'base64'
        );
        output.audio = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
    } else {
        console.warn('TTS generation did not return any media or failed.');
    }

    console.log('ecoPledgeFlow completed.');
    return output;
  }
);

export async function generateEcoPledge(input: EcoPledgeInput): Promise<EcoPledgeOutput> {
    return ecoPledgeFlow(input);
}