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
  colorPalette: z.array(z.string()).describe('An array of suggested color palette hex codes.'),
  tonalColors: z.object({
    shadows: z.string().describe('The dominant hex color code from the shadow areas.'),
    midtones: z.string().describe('The dominant hex color code from the midtone areas.'),
    highlights: z.string().describe('The dominant hex color code from the highlight areas.'),
  }).describe('The dominant colors from the shadows, midtones, and highlights.'),
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
  prompt: `You are a color grading expert for photographers and videographers.

You will generate a color palette based on the image provided. You must also analyze the image to find the dominant color hex code in the shadows, midtones, and highlights. Finally, you will also suggest LUTs that are available for purchase to help users implement the color palettes.

Analyze the following image and provide:
1. A general color palette in hex codes.
2. The specific hex codes for the dominant color in the shadows, midtones, and highlights.
3. A list of suggested LUTs for purchase.

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
