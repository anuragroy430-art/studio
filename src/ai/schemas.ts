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

export const EcoBotInputSchema = z.object({
    message: z.string(),
    history: z.array(z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
    })).optional(),
});
export type EcoBotInput = z.infer<typeof EcoBotInputSchema>;

export const EcoBotOutputSchema = z.object({
    response: z.string(),
});
export type EcoBotOutput = z.infer<typeof EcoBotOutputSchema>;

export const EcoChallengeInputSchema = z.object({
    pledge: z.string().describe("The user's eco-pledge."),
});
export type EcoChallengeInput = z.infer<typeof EcoChallengeInputSchema>;

export const EcoChallengeOutputSchema = z.object({
    title: z.string().describe("A short, catchy title for the challenge."),
    description: z.string().describe("A one or two-sentence description of what the user should do."),
    benefit: z.string().describe("A brief explanation of the positive environmental impact of this action."),
});
export type EcoChallengeOutput = z.infer<typeof EcoChallengeOutputSchema>;

export const GenerateForestVideoOutputSchema = z.object({
    videoUrl: z.string().describe('The URL of the generated video.'),
    contentType: z.string().describe('The content type of the video.'),
});
export type GenerateForestVideoOutput = z.infer<typeof GenerateForestVideoOutputSchema>;

export const EducationContentInputSchema = z.object({
    topic: z.string().describe("The sustainability topic the user wants to learn about."),
});
export type EducationContentInput = z.infer<typeof EducationContentInputSchema>;

export const EducationContentOutputSchema = z.object({
    title: z.string().describe("The catchy and informative title of the article."),
    content: z.string().describe("The full content of the article, formatted with markdown (e.g., using # for titles, ## for headings, and * for list items)."),
    youtubeLinks: z.array(z.object({
        title: z.string().describe("The title of the YouTube video."),
        url: z.string().url().describe("The URL of the YouTube video."),
    })).optional().describe("A list of 2-3 relevant YouTube videos with their titles and valid URLs."),
});
export type EducationContentOutput = z.infer<typeof EducationContentOutputSchema>;


export const GreenifyImageInputSchema = z.object({
    imageDataUrl: z.string().describe("A photo to be 'greenified', as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
    prompt: z.string().describe("The user's instructions on how to make the image more eco-friendly."),
});
export type GreenifyImageInput = z.infer<typeof GreenifyImageInputSchema>;

export const GreenifyImageOutputSchema = z.object({
    greenifiedImageUrl: z.string().describe('The data URI of the generated eco-friendly image.'),
    explanation: z.string().describe('A brief explanation of the changes made and the environmental benefits.'),
});
export type GreenifyImageOutput = z.infer<typeof GreenifyImageOutputSchema>;
