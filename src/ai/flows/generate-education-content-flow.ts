'use server';
/**
 * @fileOverview Generates educational content on a given topic.
 * 
 * - generateEducationalContent - A function that creates an article about a sustainability topic.
 */

import { ai } from '@/ai/genkit';
import { 
    EducationContentInput, 
    EducationContentOutput,
    EducationContentInputSchema, 
    EducationContentOutputSchema 
} from '../schemas';

const contentPrompt = ai.definePrompt({
    name: 'educationContentPrompt',
    input: { schema: EducationContentInputSchema },
    output: { schema: EducationContentOutputSchema },
    prompt: `You are an expert environmental science writer. Your goal is to produce a clear, engaging, and informative article for a general audience based on the provided topic.

The user has requested an article on the following topic: "{{topic}}"

Please generate the following:
1.  A compelling "title" for the article.
2.  The full "content" of the article, formatted with markdown (e.g., using # for titles, ## for headings, and * for list items). The content should include an introduction, a main body explaining the topic in detail, and actionable tips.
3.  A list of 2-3 relevant "youtubeLinks" on the same topic, including their full URL and title.`,
});


const generateEducationContentFlow = ai.defineFlow(
  {
    name: 'generateEducationContentFlow',
    inputSchema: EducationContentInputSchema,
    outputSchema: EducationContentOutputSchema,
  },
  async (input: EducationContentInput): Promise<EducationContentOutput> => {
    const result = await contentPrompt(input);
    const output = result.output;

    if (!output) {
      throw new Error('Failed to generate educational content.');
    }

    return output;
  }
);

export async function generateEducationalContent(input: EducationContentInput): Promise<EducationContentOutput> {
    return generateEducationContentFlow(input);
}