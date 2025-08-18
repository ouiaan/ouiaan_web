
'use server';

/**
 * @fileOverview A color palette generation AI agent.
 *
 * - generateColorPalette - A function that handles the color palette generation process.
 * - GenerateColorPaletteInput - The input type for the generateColorpalette function.
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
    userShadows: z.string().optional().describe("The user-selected hex color for shadows."),
    userMidtones: z.string().optional().describe("The user-selected hex color for midtones."),
    userHighlights: z.string().optional().describe("The user-selected hex color for highlights."),
});
export type GenerateColorPaletteInput = z.infer<typeof GenerateColorPaletteInputSchema>;

const TonalCharacteristicSchema = z.object({
  description: z.string().describe("A brief, professional analysis of the provided color tint in this tonal range and its effect on the image."),
  color: z.string().describe("The hex code that was provided by the user for this tonal range."),
});

const GenerateColorPaletteOutputSchema = z.object({
  colorPalette: z.array(z.string()).describe('An array of 5 key color palette hex codes from the image.'),
  tonalAnalysis: z.object({
      shadows: TonalCharacteristicSchema.describe("Analysis of the shadows (darkest areas)."),
      midtones: TonalCharacteristicSchema.describe("Analysis of the midtones (middle grey areas)."),
      highlights: TonalCharacteristicSchema.describe("Analysis of the highlights (brightest areas)."),
    }).describe("An analysis of the user-provided primary color tints across shadows, midtones, and highlights."),
});
export type GenerateColorPaletteOutput = z.infer<typeof GenerateColorPaletteOutputSchema>;

export async function generateColorPalette(input: GenerateColorPaletteInput): Promise<GenerateColorPaletteOutput> {
  return generateColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateColorPalettePrompt',
  input: {schema: GenerateColorPaletteInputSchema},
  output: {schema: GenerateColorPaletteOutputSchema},
  prompt: `You are a professional digital image technician and expert colorist. Your task is to analyze an image and a set of user-provided colors representing the tints for shadows, midtones, and highlights.

**Your Task:**

1.  **Extract a General Palette:** Analyze the provided image and extract an array of 5 key color palette hex codes. This is a general overview of the image's colors.
2.  **Analyze User-Provided Tints:** The user has selected specific colors to represent the tint in the shadows, midtones, and highlights. Your main job is to provide a professional, insightful description for each of these user-selected colors in the context of the image.
    *   **For the user's Shadow Color ({{{userShadows}}}):** Analyze how this specific tint affects the mood and depth of the darkest parts of the image. Is it making them cooler, warmer, more cinematic, etc.?
    *   **For the user's Midtone Color ({{{userMidtones}}}):** Analyze how this tint influences the main subjects and overall color balance. How does it affect skin tones (if any) or the primary colors of the scene?
    *   **For the user's Highlight Color ({{{userHighlights}}}):** Analyze how this tint shapes the brightest parts of the image. Does it create a specific glow, a vintage feel, or a clean, modern look?

**Output Structure:**

1.  **colorPalette:** An array of 5 hex codes extracted from the overall image.
2.  **tonalAnalysis:** Your expert analysis for each user-provided tint.
    *   The \`color\` field for each (shadows, midtones, highlights) MUST be the exact hex code provided by the user in the input.
    *   The \`description\` field must be your professional analysis of that color's role.

**Input Image:** {{media url=photoDataUri}}
**User-Selected Shadow Tint:** {{{userShadows}}}
**User-Selected Midtone Tint:** {{{userMidtones}}}
**User-Selected Highlight Tint:** {{{userHighlights}}}

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
