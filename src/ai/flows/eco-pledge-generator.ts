'use server';
/**
 * @fileOverview Generates personalized eco-pledges based on user lifestyle questions.
 *
 * - generateEcoPledge - Generates a personalized eco-pledge.
 */

import {ai} from '@/ai/genkit';
import wav from 'wav';
import { generateCertificate } from './generate-certificate';
import { EcoPledgeInput, EcoPledgeOutput, EcoPledgeOutputSchema, LifestyleQuestionsSchema } from '../schemas';

export async function generateEcoPledge(input: EcoPledgeInput): Promise<EcoPledgeOutput> {
  return ecoPledgeFlow(input);
}

const ecoPledgePrompt = ai.definePrompt({
  name: 'ecoPledgePrompt',
  input: {schema: LifestyleQuestionsSchema},
  output: {schema: EcoPledgeOutputSchema},
  prompt: `You are an AI assistant for EcoPledger. Your goal is to generate a personalized eco-pledge based on user's answers to lifestyle questions.
  
  The user's name is: {{name}}
  
  Here are the user's answers:
  - Commute: {{commute}}
  - Diet: {{diet}}
  - Shopping: {{shopping}}
  - Energy Use: {{energyUse}}
  - Waste Management: {{wasteManagement}}
  - Water Consumption: {{waterConsumption}}
  - Travel Habits: {{travelHabits}}
  
  Based on these answers, create a short, inspiring "pledge" sentence.
  Then, create a sentence for the "impact" that quantifies the positive effect of their actions.
  Finally, write a "motivation" sentence to encourage them.`,
});

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
  async input => {
    console.log('Starting ecoPledgeFlow with input:', input.name);

    // Step 1: Generate pledge text
    const pledgeResult = await ecoPledgePrompt(input);
    const output = pledgeResult.output;

    if (!output) {
      console.error('Failed to generate pledge text from ecoPledgePrompt.');
      throw new Error('Failed to generate pledge output from the main prompt.');
    }
    console.log('Successfully generated pledge text.');

    // Parallel execution for certificate and TTS
    const [certificateResult, ttsResult] = await Promise.allSettled([
      // Step 2: Generate certificate
      (async () => {
        try {
          console.log('Starting certificate generation...');
          const cert = await generateCertificate({ name: input.name, pledge: output.pledge, date: input.currentDate });
          console.log('Successfully generated certificate.');
          return cert;
        } catch (error) {
          console.error('Error during certificate generation:', error);
          return null; // Return null on failure
        }
      })(),
      // Step 3: Generate TTS audio
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
          return null; // Return null on failure
        }
      })()
    ]);
    
    // Process certificate result
    if (certificateResult.status === 'fulfilled' && certificateResult.value?.certificateUrl) {
      output.certificateUrl = certificateResult.value.certificateUrl;
    } else {
      console.warn('Certificate generation did not return a URL or failed.');
    }

    // Process TTS result
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
