
'use server';

/**
 * @fileOverview A color palette generation AI agent.
 *
 * - generateColorPalette - A function that handles the color palette generation process.
 * - GenerateColorPaletteInput - The input type for the generateColorPalette function.
 * - GenerateColorPaletteOutput - The return type for the generateColorPalette function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateColorPaletteInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to generate a color palette from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateColorPaletteInput = z.infer<typeof GenerateColorPaletteInputSchema>;

const GenerateColorPaletteOutputSchema = z.object({
  colorPalette: z.array(z.string()).describe('An array of 5 key color palette hex codes from the image.'),
  suggestedLuts: z.array(z.string()).describe('An array of suggested LUTs for purchase to help users implement the color palettes.'),
});
export type GenerateColorPaletteOutput = z.infer<typeof GenerateColorPaletteOutputSchema>;

export async function generateColorPalette(input: GenerateColorPaletteInput): Promise<GenerateColorPaletteOutput> {
  return generateColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateColorPalettePrompt',
  input: {schema: GenerateColorPaletteInputSchema},
  output: {schema: GenerateColorPaletteOutputSchema},
  prompt: `You are a professional colorist and color grading expert for photographers and videographers. Your task is to analyze an image and extract its primary colors.

Analyze the following image and provide:
1.  A general color palette of 5 key hex codes from the image.
2.  A list of suggested LUTs that are available for purchase to help users implement the color palettes.

Image: {{media url=photoDataUri}}

Respond in JSON format.
`,
});

const generateColorPaletteFlow = ai.defineFlow(
  {
    name: 'generateColorPaletteFlow',
    inputSchema: GenerateColorPaletteInputSchema,
    outputSchema: GenerateColorPaletteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
