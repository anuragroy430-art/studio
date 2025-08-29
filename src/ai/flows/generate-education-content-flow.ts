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
    prompt: `You are an expert environmental science writer. Your goal is to produce a clear, engaging, and informative article for a general audience based on the provided topic.

The user has requested an article on the following topic: "{{topic}}"

Generate a well-structured article that includes:
1.  A compelling title.
2.  An introduction that hooks the reader.
3.  A main body that explains the topic in detail, using simple language. Break it down into key points or sections.
4.  Actionable tips or advice that the reader can implement in their daily life.
5.  A concluding paragraph that summarizes the key takeaways and offers encouragement.

In addition to the article, find 2-3 relevant YouTube videos on the same topic and provide their titles and full URLs.`,
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
