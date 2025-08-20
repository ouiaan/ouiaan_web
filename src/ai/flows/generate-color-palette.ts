

'use server';

/**
 * @fileOverview An AI agent that analyzes a reference image and user-selected tonal colors to generate a color grade recipe.
 *
 * - generateColorGradeRecipe - A function that analyzes a reference image and generates a color grading recipe.
 * - GenerateColorGradeRecipeInput - The input type for the generateColorGradeRecipe function.
 * - GenerateColorGradeRecipeOutput - The return type for the generateColorGradeRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateColorGradeRecipeInputSchema = z.object({
  referencePhotoDataUri: z
    .string()
    .describe(
        "The reference image with the desired look (e.g., a still from a movie), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userSelectedTones: z.object({
    shadows: z.string().describe("The hex color for shadows, selected by the user with an eyedropper from the reference image."),
    midtones: z.string().describe("The hex color for midtones, selected by the user with an eyedropper from the reference image."),
    highlights: z.string().describe("The hex color for highlights, selected by the user with an eyedropper from the reference image."),
  }).describe("The key tonal colors manually selected by the user."),
});
export type GenerateColorGradeRecipeInput = z.infer<typeof GenerateColorGradeRecipeInputSchema>;

const TonalPaletteColorSchema = z.object({
  description: z.string().describe("A brief, professional analysis of why this color was chosen for this tonal range and its effect on the image's mood. Explain the artistic choice."),
  color: z.string().describe("The hex code representing the tint for this tonal range, as provided by the user."),
});

const HSLAdjustmentSchema = z.object({
    colorName: z.enum(["Reds", "Oranges", "Yellows", "Greens", "Aquas", "Blues", "Purples", "Magentas"]),
    hue: z.string().describe("The recommended hue shift value (e.g., '+8', '-5', '0')."),
    saturation: z.string().describe("The recommended saturation adjustment value (e.g., '-15', '+10', '0')."),
    luminance: z.string().describe("The recommended luminance adjustment value (e.g., '+5', '-20', '0')."),
});

const ToneCurvePointSchema = z.object({
    point: z.enum(["Blacks", "Shadows", "Midtones", "Highlights", "Whites"]),
    adjustment: z.string().describe("A description of the adjustment made to this point on the tone curve (e.g., 'Lifted slightly', 'Crushed significantly', 'Shifted towards blue')."),
});

const GenerateColorGradeRecipeOutputSchema = z.object({
  colorPalette: z.array(z.string()).describe('An array of 5 key color palette hex codes extracted from the REFERENCE image.'),
  tonalPalette: z.object({
      shadows: TonalPaletteColorSchema.describe("The user-selected color and AI analysis for the shadows."),
      midtones: TonalPaletteColorSchema.describe("The user-selected color and AI analysis for the midtones."),
      highlights: TonalPaletteColorSchema.describe("The user-selected color and AI analysis for the highlights."),
    }).describe("A 3-color palette representing the color tint in the shadows, midtones, and highlights of the reference image."),
  hslAdjustments: z.array(HSLAdjustmentSchema).length(8).describe("An array of actionable HSL (Hue, Saturation, Luminance) adjustment recommendations for all 8 primary color ranges, similar to a professional editing tool."),
  toneCurve: z.array(ToneCurvePointSchema).length(5).describe("An analysis of the tone curve adjustments required to match the contrast and exposure of the source image to the reference image."),
  whiteBalance: z.object({
      temperature: z.string().describe("Describes the white balance temperature of the image (e.g., 'Warm, approx. 4500K', 'Cool, approx. 7500K', 'Neutral'). Provide specific, actionable advice."),
      tint: z.string().describe("Describes the white balance tint of the image (e.g., 'Slight magenta tint, +8', 'Slight green tint, -5', 'Neutral'). Provide specific, actionable advice."),
  }).describe("A general analysis of the white balance needed to achieve the reference look."),
});
export type GenerateColorGradeRecipeOutput = z.infer<typeof GenerateColorGradeRecipeOutputSchema>;

export async function generateColorGradeRecipe(input: GenerateColorGradeRecipeInput): Promise<GenerateColorGradeRecipeOutput> {
  return generateColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateColorGradeRecipePrompt',
  input: {schema: GenerateColorGradeRecipeInputSchema},
  output: {schema: GenerateColorGradeRecipeOutputSchema},
  prompt: `You are a world-class colorist and digital image technician (DIT). Your task is to analyze a "Reference" image and a set of user-selected colors to generate a precise, actionable color grading recipe.

You have a deep understanding of professional color grading principles, including the characteristics of digital cinema cameras (like ARRI, RED) and classic film stocks (like Kodak and Fuji). You must act as an analysis tool that expands on the user's initial selections.

**Core Color Grading Principles to follow:**
- **Anchor Points:** Professionally graded images maintain clean anchor points. Deep blacks should be truly black (or near-black) and peak whites should be white, without color contamination. The "look" is created in the tones between.
- **Cinematic Tinting:** The mood is primarily created by introducing specific, subtle color tints into the **shadows** and **midtones**. Highlights are generally kept clean or have a very slight, motivated tint to avoid an amateurish, "filtered" look.

**USER-PROVIDED DATA:**
The user has already used an eyedropper tool on the reference image to select the following key tonal colors:
- **Shadows Color:** {{{userSelectedTones.shadows}}}
- **Midtones Color:** {{{userSelectedTones.midtones}}}
- **Highlights Color:** {{{userSelectedTones.highlights}}}

**YOUR TASK:**

1.  **Extract a General Palette:** Analyze the overall **Reference image** and extract an array of 5 key color palette hex codes that represent the overall aesthetic.

2.  **Analyze and Justify the Tonal Palette:** The user has provided the key colors. Your job is to act as the expert colorist and explain *why* these choices are effective. For each tonal range (Shadows, Midtones, Highlights):
    *   Use the hex code provided by the user as the 'color' value.
    *   Provide a professional 'description' analyzing the artistic choice behind this tint and how it contributes to the reference image's mood, considering the principles of cinematic color. For example, explain how the selected blue in the shadows creates a cold, somber mood.

3.  **Perform a Comprehensive HSL Analysis:** Based on the overall look of the reference image, deconstruct its color manipulation into the 8 primary HSL vectors used in professional software (DaVinci Resolve, Lightroom). For each of the 8 colors (Reds, Oranges, Yellows, Greens, Aquas, Blues, Purples, Magentas), analyze the image and determine the necessary adjustments to achieve its look from a neutral starting point.
    *   Provide specific, numerical estimates for \`hue\`, \`saturation\`, and \`luminance\` shifts (e.g., '+8', '-15', '0'). These values represent the *grade* applied to the image.

4.  **Analyze White Balance:**
    *   Describe the overall color temperature and tint. Provide specific, professional direction (e.g., "Warm, approx. 4500K", "Slight green tint, approx -12").

5.  **Analyze Tone Curve:**
    *   Describe the adjustments on a 5-point tone curve (Blacks, Shadows, Midtones, Highlights, Whites). Pay attention to cinematic principles. For each point, describe the adjustment (e.g., "Blacks: Crushed significantly to create a deep, rich black point", "Highlights: Rolled off gently to create a softer, filmic look").

**Input Image:**
*   **Reference Image:** {{media url=referencePhotoDataUri}}

Respond in JSON format.`,
});

const generateColorPaletteFlow = ai.defineFlow(
  {
    name: 'generateColorPaletteFlow',
    inputSchema: GenerateColorGradeRecipeInputSchema,
    outputSchema: GenerateColorGradeRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    if (!output) {
      throw new Error("AI failed to return a response.");
    }
    
    // Ensure the output includes the user-selected colors.
    output.tonalPalette.shadows.color = input.userSelectedTones.shadows;
    output.tonalPalette.midtones.color = input.userSelectedTones.midtones;
    output.tonalPalette.highlights.color = input.userSelectedTones.highlights;
    
    return output;
  }
);
