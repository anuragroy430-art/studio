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

  Generate a response in JSON format that conforms to the following Zod schema:
  
  'z.object({
    pledge: z.string().describe("The personalized eco-pledge."),
    impact: z.string().describe("The measurable environmental impact of the pledge."),
    motivation: z.string().describe("A motivational statement to encourage the user."),
    audio: z.string().optional().describe("Audio of the eco-pledge using TTS"),
    certificateUrl: z.string().optional().describe("URL of the generated pledge certificate image."),
  })'
  
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
  Finally, write a "motivation" sentence to encourage them.
  
  Return only the valid JSON object.`,
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
    const pledgeOutput = await ecoPledgePrompt(input);
    const output = pledgeOutput.output;

    if (!output) {
      throw new Error('Failed to generate pledge output from the main prompt.');
    }

    // Temporarily disable parallel calls to debug
    // const [certificateResult, ttsResult] = await Promise.all([
    //   generateCertificate({ name: input.name, pledge: output.pledge }),
    //   ai.generate({
    //     model: 'googleai/gemini-2.5-flash-preview-tts',
    //     config: {
    //       responseModalities: ['AUDIO'],
    //       speechConfig: {
    //         voiceConfig: {
    //           prebuiltVoiceConfig: { voiceName: 'Algenib' },
    //         },
    //       },
    //     },
    //     prompt: output.pledge,
    //   })
    // ]);

    // if (certificateResult?.certificateUrl) {
    //   output.certificateUrl = certificateResult.certificateUrl;
    // }

    // if (ttsResult?.media) {
    //   const audioBuffer = Buffer.from(
    //     ttsResult.media.url.substring(ttsResult.media.url.indexOf(',') + 1),
    //     'base64'
    //   );
    //   output.audio = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
    // } else {
    //   console.log('No audio media returned from TTS.');
    // }

    return output;
  }
);
