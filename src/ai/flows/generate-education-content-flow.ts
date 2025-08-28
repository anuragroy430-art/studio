'use server';
/**
 * @fileOverview Generates educational content on a given topic.
 * 
 * - generateEducationalContent - A function that creates an article about a sustainability topic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { EducationContentInputSchema, EducationContentOutputSchema } from '../schemas';
import type { EducationContentInput, EducationContentOutput } from '../schemas';

export async function generateEducationalContent(input: EducationContentInput): Promise<EducationContentOutput> {
  return generateEducationContentFlow(input);
}

const contentPrompt = ai.definePrompt({
    name: 'educationContentPrompt',
    input: { schema: EducationContentInputSchema },
    output: { schema: EducationContentOutputSchema },
    prompt: `You are an expert environmental science writer and content curator. Your goal is to produce clear, engaging, and informative educational content for a general audience.
    
    The user has requested an article on the following topic: "{{topic}}"

    Please generate a well-structured article that includes:
    1. A compelling title.
    2. An introduction that hooks the reader.
    3. A main body that explains the topic in detail, using simple language. Break it down into key points or sections.
    4. Actionable tips or advice that the reader can implement in their daily life.
    5. A concluding paragraph that summarizes the key takeaways and offers encouragement.
    
    In addition to the article, please find 2-3 highly relevant and informative YouTube videos on the same topic. Provide their titles and full URLs.

    Generate a response in JSON format that conforms to the following Zod schema:

    'z.object({
        title: z.string().describe("The catchy and informative title of the article."),
        content: z.string().describe("The full content of the article, formatted with markdown (e.g., using # for titles, ## for headings, and * for list items)."),
        youtubeLinks: z.array(z.object({
            title: z.string().describe("The title of the YouTube video."),
            url: z.string().url().describe("The URL of the YouTube video."),
        })).optional().describe("A list of 2-3 relevant YouTube videos with their titles and valid URLs.")
    })'
    
    Return only the valid JSON object.`,
});


const generateEducationContentFlow = ai.defineFlow(
  {
    name: 'generateEducationContentFlow',
    inputSchema: EducationContentInputSchema,
    outputSchema: EducationContentOutputSchema,
  },
  async (input) => {
    const result = await contentPrompt(input);
    const output = result.output;

    if (!output) {
      throw new Error('Failed to generate educational content.');
    }

    return output;
  }
);
