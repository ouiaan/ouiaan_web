
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

const TonalCharacteristicSchema = z.object({
  color: z.string().describe("A single representative hex color code that captures the tint of this tonal range. For example, for shadows with a green cast, this might be a dark olive green, not just black or gray."),
  description: z.string().describe('A detailed description of the tonal characteristics and the color cast. For example: "The shadows are lifted and infused with a deep teal/green tint, creating a moody, cinematic feel."'),
});

const GenerateColorPaletteOutputSchema = z.object({
  colorPalette: z.array(z.string()).describe('An array of 5 key color palette hex codes from the image.'),
  tonalAnalysis: z.object({
    shadows: TonalCharacteristicSchema,
    midtones: TonalCharacteristicSchema,
    highlights: TonalCharacteristicSchema,
  }).describe('A detailed analysis of the color grading characteristics for the shadows, midtones, and highlights. This should focus on the color cast/tint applied to each range.'),
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

You will analyze the provided image to create a full color grading analysis. Your primary goal is to identify the specific color tints (color casting) applied to the different tonal ranges, not just the average color.

Analyze the following image and provide:
1.  A general color palette of 5 key hex codes from the image.
2.  A detailed, professional analysis of the tonal characteristics for the shadows, midtones, and highlights. For each tonal range:
    *   Identify the specific **color cast** or **tint** applied. For example, do the shadows have a green tint? Are the highlights warm and yellow?
    *   Provide a single representative hex code that **best represents this tint** (e.g., a dark green for green-tinted shadows).
    *   Provide a professional description of the grading, offering actionable advice a creator could use in software like Lightroom or DaVinci Resolve.
3.  A list of suggested LUTs that are available for purchase to help users implement the color palettes.

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
