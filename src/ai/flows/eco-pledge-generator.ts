// This is an AI-powered function that generates personalized eco-pledges based on user inputs.
'use server';
/**
 * @fileOverview Generates personalized eco-pledges based on user lifestyle questions.
 *
 * - generateEcoPledge - Generates a personalized eco-pledge.
 * - EcoPledgeInput - The input type for the generateEcoPledge function.
 * - EcoPledgeOutput - The return type for the generateEcoPledge function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const LifestyleQuestionsSchema = z.object({
  commute: z
    .string()
    .describe(
      'How do you primarily commute? Options: car, public transport, bike, walk'
    ),
  diet: z
    .string()
    .describe(
      'What is your diet like? Options: meat-heavy, balanced, vegetarian, vegan'
    ),
  shopping: z
    .string()
    .describe(
      'How often do you buy new items? Options: very often, sometimes, rarely'
    ),
  energyUse: z
    .string()
    .describe(
      'How would you describe your energy use at home? Options: high, average, low'
    ),
});

export type EcoPledgeInput = z.infer<typeof LifestyleQuestionsSchema>;

const EcoPledgeOutputSchema = z.object({
  pledge: z.string().describe('The personalized eco-pledge.'),
  impact: z.string().describe('The measurable environmental impact of the pledge.'),
  motivation: z.string().describe('A motivational statement to encourage the user.'),
  audio: z.string().optional().describe('Audio of the eco-pledge using TTS'),
});

export type EcoPledgeOutput = z.infer<typeof EcoPledgeOutputSchema>;

export async function generateEcoPledge(input: EcoPledgeInput): Promise<EcoPledgeOutput> {
  return ecoPledgeFlow(input);
}

const ecoPledgePrompt = ai.definePrompt({
  name: 'ecoPledgePrompt',
  input: {schema: LifestyleQuestionsSchema},
  output: {schema: EcoPledgeOutputSchema},
  prompt: `Based on the following lifestyle questions, generate a personalized eco-pledge with specific actions, measurable impact, and a motivational tone.

Lifestyle Questions:
Commute: {{{commute}}}
Diet: {{{diet}}}
Shopping: {{{shopping}}}
Energy Use: {{{energyUse}}}

Eco-Pledge:
- Specific Actions: [List specific actions the user can take]
- Measurable Impact: [Quantify the environmental impact of these actions]
- Motivational Tone: [Encourage the user with a positive and inspiring message]`, // Ensure the prompt is well-formatted and clear.
});

const ecoPledgeFlow = ai.defineFlow(
  {
    name: 'ecoPledgeFlow',
    inputSchema: LifestyleQuestionsSchema,
    outputSchema: EcoPledgeOutputSchema,
  },
  async input => {
    const {output} = await ecoPledgePrompt(input);

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
    return output!;
  }
);

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

