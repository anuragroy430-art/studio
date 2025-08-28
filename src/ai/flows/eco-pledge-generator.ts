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
  prompt: `Based on the following lifestyle questions, generate a personalized eco-pledge with specific actions, measurable impact, and a motivational tone. The user's name is {{{name}}}.

Lifestyle Questions:
Commute: {{{commute}}}
Diet: {{{diet}}}
Shopping: {{{shopping}}}
Energy Use: {{{energyUse}}}
Waste Management: {{{wasteManagement}}}
Water Consumption: {{{waterConsumption}}}
Travel Habits: {{{travelHabits}}}

Eco-Pledge:
- Specific Actions: [List specific actions the user can take]
- Measurable Impact: [Quantify the environmental impact of these actions]
- Motivational Tone: [Encourage the user with a positive and inspiring message]`, // Ensure the prompt is well-formatted and clear.
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
    const output = pledgeOutput.output!;

    const certificateOutput = await generateCertificate({ name: input.name, pledge: output.pledge });
    
    // Text to speech
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: output?.pledge ?? 'no pledge available',
    });
    if (!media) {
      console.log('no media returned');
    } else {
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      output!.audio = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
    }
    output.certificateUrl = certificateOutput.certificateUrl;
    return output;
  }
);
