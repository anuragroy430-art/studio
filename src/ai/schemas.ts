/**
 * @fileOverview Shared Zod schemas for AI flows.
 */
import { z } from 'zod';

export const LifestyleQuestionsSchema = z.object({
  name: z.string().describe("The user's name."),
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
  wasteManagement: z
    .string()
    .describe(
      'How do you manage your household waste? Options: general waste only, recycle sometimes, recycle regularly, compost and recycle'
    ),
  waterConsumption: z
    .string()
    .describe(
      'How conscious are you of your water usage? Options: not very, somewhat, very conscious'
    ),
  travelHabits: z
    .string()
    .describe(
      'How often do you fly per year? Options: never, 1-2 times, 3-5 times, more than 5 times'
    ),
  currentDate: z.string().describe("The current date of the pledge.")
});

export type EcoPledgeInput = z.infer<typeof LifestyleQuestionsSchema>;

export const EcoPledgeOutputSchema = z.object({
  pledge: z.string().describe('The personalized eco-pledge.'),
  impact: z.string().describe('The measurable environmental impact of the pledge.'),
  motivation: z.string().describe('A motivational statement to encourage the user.'),
  audio: z.string().optional().describe('Audio of the eco-pledge using TTS'),
  certificateUrl: z.string().optional().describe('URL of the generated pledge certificate image.'),
});

export type EcoPledgeOutput = z.infer<typeof EcoPledgeOutputSchema>;

export const CertificateInputSchema = z.object({
    name: z.string().describe("The user's name for the certificate."),
    pledge: z.string().describe('The personalized eco-pledge text.'),
    date: z.string().describe('The date for the certificate.')
});
  
export type CertificateInput = z.infer<typeof CertificateInputSchema>;
  
export const CertificateOutputSchema = z.object({
    certificateUrl: z.string().describe('The data URI of the generated certificate image.'),
});

export type CertificateOutput = z.infer<typeof CertificateOutputSchema>;