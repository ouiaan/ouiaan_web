// src/ai/flows/recommend-luts.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending LUTs based on a color palette.
 *
 * - recommendLuts - A function that takes a color palette as input and returns a list of recommended LUTs.
 * - RecommendLutsInput - The input type for the recommendLuts function.
 * - RecommendLutsOutput - The output type for the recommendLuts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendLutsInputSchema = z.object({
  colorPalette: z
    .string()
    .describe("A comma separated list of hex color codes representing a color palette."),
  productCatalog: z.string().optional().describe("A description of the product catalog containing available LUTs."),
});

export type RecommendLutsInput = z.infer<typeof RecommendLutsInputSchema>;

const RecommendLutsOutputSchema = z.object({
  recommendedLuts: z
    .array(z.string())
    .describe('A list of recommended LUT names from the product catalog.'),
});

export type RecommendLutsOutput = z.infer<typeof RecommendLutsOutputSchema>;

export async function recommendLuts(input: RecommendLutsInput): Promise<RecommendLutsOutput> {
  return recommendLutsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendLutsPrompt',
  input: {schema: RecommendLutsInputSchema},
  output: {schema: RecommendLutsOutputSchema},
  prompt: `You are an expert in color grading and LUT (Look-Up Table) selection.

  Given a color palette and a product catalog of available LUTs, you will recommend the most suitable LUTs that complement the color palette.

  Color Palette: {{{colorPalette}}}

  Product Catalog: {{{productCatalog}}}

  Based on the provided color palette, recommend LUTs from the following product catalog that would be a good fit. Respond with a list of LUT names.

  If the product catalog is not available, respond with a list of generic LUT styles that would be a good fit for the color palette. 

  Ensure that the LUTs you recommend enhance the visual appeal and maintain a consistent aesthetic.
  `,
});

const recommendLutsFlow = ai.defineFlow(
  {
    name: 'recommendLutsFlow',
    inputSchema: RecommendLutsInputSchema,
    outputSchema: RecommendLutsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
