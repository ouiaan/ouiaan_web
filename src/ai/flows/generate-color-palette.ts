
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
  prompt: `You are a professional colorist and color grading expert for photographers and videographers. Your task is to analyze an image and deconstruct its color grading.

Your primary goal is to identify the specific color **tints** (color casting) applied to the different tonal ranges (shadows, midtones, highlights). **DO NOT simply average the colors in a range.** A color tint is an imbalance in the RGB channels. You must identify this imbalance.

**Your thought process MUST follow these steps:**
1.  **Analyze RGB Channels:** For each tonal range (shadows, midtones, highlights), mentally analyze its RGB composition. Ask yourself: Is the Red, Green, or Blue channel disproportionately high or low? For example, shadows with a green tint will have a higher G value compared to R and B within the dark areas.
2.  **Identify the Tint:** Based on the channel imbalance, name the resulting tint. (e.g., "The shadows have a green-cyan tint", "The highlights have a warm, yellow-orange tint").
3.  **Select a Representative Hex Code:** Choose a hex code that **represents the identified tint**, not the overall brightness.
    *   **BAD EXAMPLE:** For shadows with a green tint, the hex code &#35;3A3A35 is a bad choice because it's just a dark, slightly warm gray. It's an *average* color, not a representation of the *tint*.
    *   **GOOD EXAMPLE:** For the same shadows, &#35;2E3A2C is a good choice because it's a dark, desaturated green, which correctly represents the **green tint** itself.

Analyze the following image and provide:
1.  A general color palette of 5 key hex codes from the image.
2.  A detailed, professional analysis of the tonal characteristics for shadows, midtones, and highlights, following the thought process above to select the hex codes and write the descriptions.
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
