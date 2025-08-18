
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
  description: z.string().describe("A brief, professional analysis of the color tint in this tonal range. Focus on the 'color cast' (e.g., 'cool blue tint', 'warm yellow cast', 'lifted with a green tint')."),
  color: z.string().describe("A single hex code that best represents the specific COLOR TINT of the tonal range, not the average color. For example, if shadows have a green tint, this should be a dark, desaturated green."),
});

const GenerateColorPaletteOutputSchema = z.object({
  colorPalette: z.array(z.string()).describe('An array of 5 key color palette hex codes from the image.'),
  tonalAnalysis: z.object({
      shadows: TonalCharacteristicSchema.describe("Analysis of the shadows (darkest areas)."),
      midtones: TonalCharacteristicSchema.describe("Analysis of the midtones (middle grey areas)."),
      highlights: TonalCharacteristicSchema.describe("Analysis of the highlights (brightest areas)."),
    }).describe("An analysis of the image's primary color tints across shadows, midtones, and highlights."),
});
export type GenerateColorPaletteOutput = z.infer<typeof GenerateColorPaletteOutputSchema>;

export async function generateColorPalette(input: GenerateColorPaletteInput): Promise<GenerateColorPaletteOutput> {
  return generateColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateColorPalettePrompt',
  input: {schema: GenerateColorPaletteInputSchema},
  output: {schema: GenerateColorPaletteOutputSchema},
  prompt: `You are a professional digital image technician and expert colorist. Your task is to analyze an image to extract its main color palette and, more importantly, to identify the specific color tints (color cast) in its shadows, midtones, and highlights.

**Core Task: Analyze Color Balance, Not Just Average Color**

Think of the RGB color space as a cube. Pure black (0,0,0) and pure white (255,255,255) are neutral. A color tint occurs when the R, G, and B channels are **unbalanced**. Your primary goal is to detect this imbalance.

**Your Forced Thought Process:**

Before providing a hex code, you MUST follow these mental steps:
1.  **Analyze RGB Channel Composition:** For each tonal range (shadows, midtones, highlights), mentally inspect the balance of the Red, Green, and Blue channels.
    *   **Ask yourself:** Are the channels perfectly balanced (resulting in a neutral gray), or is one channel dominant? For example, in shadows with a green tint, the Green channel's value will be subtly higher than Red and Blue. In warm highlights, Red and Green will be higher than Blue.
2.  **Identify the Resulting Tint:** Based on the channel imbalance you observed, explicitly name the resulting tint. (e.g., "This creates a distinct green-teal tint in the shadows," or "This results in a warm, subtle yellow tint in the highlights.").
3.  **Select a Representative Hex Code:** Now, choose a single hex code that accurately **represents the identified tint**, not the average brightness or color of the area.
    *   **Good Example:** If you identify a green tint in the shadows, a hex code like &#35;2A342D is a good choice because it IS a dark, desaturated green.
    *   **Bad Example:** For the same shadows, &#35;353535 is a bad choice because it is a neutral gray and fails to capture the green tint.

**Output Structure:**

1.  **colorPalette:** Extract 5 primary, representative colors from the overall image.
2.  **tonalAnalysis:** Provide your expert analysis of the color tints for shadows, midtones, and highlights, following the thought process above. The hex code for each must represent the **tint** itself.

Image: {{media url=photoDataUri}}

Respond in JSON format.`,
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
