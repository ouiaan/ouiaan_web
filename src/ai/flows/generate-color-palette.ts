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
  tonalAnalysis: z.object({
    shadows: z.string().describe('A detailed description of the shadow characteristics, including any color tints, saturation levels, and brightness. For example: "Slightly lifted with a cool, cyan tint to give a cinematic feel."'),
    midtones: z.string().describe('A detailed description of the midtone characteristics, focusing on skin tones if present, overall warmth, and contrast. For example: "Kept clean and natural, with a slight push towards magenta to contrast the shadows."'),
    highlights: z.string().describe('A detailed description of the highlight characteristics, including any color casting and how they roll off. For example: "Soft roll-off to prevent clipping, with a subtle warm cast to enhance the sunset feel."'),
  }).describe('A detailed analysis of the color grading characteristics for the shadows, midtones, and highlights.'),
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
  prompt: `You are a professional colorist and color grading expert for photographers and videographers.

You will analyze the provided image to create a full color grading analysis.

Analyze the following image and provide:
1. A general color palette of 5 key hex codes from the image.
2. A detailed, professional analysis of the tonal characteristics for the shadows, midtones, and highlights. Provide actionable descriptions that a creator could use in software like Lightroom or DaVinci Resolve.
3. A list of suggested LUTs that are available for purchase to help users implement the color palettes.

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
