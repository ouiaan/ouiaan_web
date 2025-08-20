
'use server';

/**
 * @fileOverview An AI agent that analyzes the color grade difference between two images.
 *
 * - generateColorGradeRecipe - A function that compares a source and reference image and generates a color grading recipe.
 * - GenerateColorGradeRecipeInput - The input type for the generateColorGradeRecipe function.
 * - GenerateColorGradeRecipeOutput - The return type for the generateColorGradeRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateColorGradeRecipeInputSchema = z.object({
  sourcePhotoDataUri: z
    .string()
    .describe(
      "The source image (e.g., from a camera's standard profile), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  referencePhotoDataUri: z
    .string()
    .describe(
        "The reference image with the desired look (e.g., a still from a movie), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateColorGradeRecipeInput = z.infer<typeof GenerateColorGradeRecipeInputSchema>;

const TonalPaletteColorSchema = z.object({
  description: z.string().describe("A brief, professional analysis of why this color was chosen for this tonal range and its effect on the image's mood."),
  color: z.string().describe("The hex code representing the tint for this tonal range."),
});

const HSLAdjustmentSchema = z.object({
    colorName: z.string().describe("A user-friendly name for the color being adjusted (e.g., 'Sky Blue', 'Foliage Green', 'Skin Tones')."),
    hex: z.string().describe("The representative hex code of this color in the reference image."),
    hueShift: z.string().describe("The recommended hue shift value (e.g., '+8', '-5') to apply to the source image."),
    saturation: z.string().describe("The recommended saturation adjustment value (e.g., '-15', '+10') to apply to the source image."),
    luminance: z.string().describe("The recommended luminance adjustment value (e.g., '+5', '-20') to apply to the source image."),
    reasoning: z.string().describe("A professional justification explaining how these HSL adjustments help match the source image to the reference image.")
});

const ToneCurveAdjustmentSchema = z.object({
    point: z.enum(["Blacks", "Shadows", "Midtones", "Highlights", "Whites"]),
    adjustment: z.string().describe("A description of the adjustment made to this point on the tone curve (e.g., 'Lifted slightly', 'Crushed significantly', 'Shifted towards blue')."),
});

const GenerateColorGradeRecipeOutputSchema = z.object({
  colorPalette: z.array(z.string()).describe('An array of 5 key color palette hex codes extracted from the REFERENCE image.'),
  tonalPalette: z.object({
      shadows: TonalPaletteColorSchema.describe("The generated color and analysis for the shadows (darkest areas) to match the reference."),
      midtones: TonalPaletteColorSchema.describe("The generated color and analysis for the midtones (middle grey areas) to match the reference."),
      highlights: TonalPaletteColorSchema.describe("The generated color and analysis for the highlights (brightest areas) to match the reference."),
    }).describe("A 3-color palette representing the color tint in the shadows, midtones, and highlights of the reference image."),
  hslAdjustments: z.array(HSLAdjustmentSchema).length(3).describe("An array of actionable HSL (Hue, Saturation, Luminance) adjustment recommendations for the 3 most important colors to transform the source image to the reference look."),
  toneCurveAdjustments: z.array(ToneCurveAdjustmentSchema).length(5).describe("An analysis of the tone curve adjustments required to match the contrast and exposure of the source image to the reference image."),
  whiteBalanceAnalysis: z.object({
      temperature: z.string().describe("Describes the white balance temperature shift needed (e.g., 'Warmer, push towards +15', 'Cooler, around -10', 'Neutral')."),
      tint: z.string().describe("Describes the white balance tint shift needed (e.g., 'Shift towards magenta, +8', 'Shift towards green, -5', 'Neutral')."),
      contrast: z.string().describe("A brief analysis of the overall contrast difference (e.g., 'Increased contrast significantly', 'Slightly lowered contrast for a softer look')."),
  }).describe("A general analysis of the white balance and contrast adjustments needed."),
});
export type GenerateColorGradeRecipeOutput = z.infer<typeof GenerateColorGradeRecipeOutputSchema>;

export async function generateColorGradeRecipe(input: GenerateColorGradeRecipeInput): Promise<GenerateColorGradeRecipeOutput> {
  return generateColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateColorGradeRecipePrompt',
  input: {schema: GenerateColorGradeRecipeInputSchema},
  output: {schema: GenerateColorGradeRecipeOutputSchema},
  prompt: `You are a world-class colorist and digital image technician (DIT). Your task is to analyze two images: a "Source" image (original footage) and a "Reference" image (the desired look). You will generate a detailed, actionable color grading recipe to make the Source image look like the Reference image.

You have a deep understanding of professional color grading principles, including the characteristics of digital cinema cameras (like ARRI, RED) and classic film stocks (like Kodak and Fuji).

**Core Color Grading Principles to follow:**
- **Anchor Points:** Professionally graded images maintain clean anchor points. This means deep blacks should be truly black (or near-black) and peak whites should be white, without color contamination.
- **Cinematic Tinting:** The mood and "look" are primarily created by introducing specific, subtle color tints into the **shadows** and **midtones**. Highlights are generally kept clean or have a very slight, motivated tint to avoid an amateurish look. For example, shadows in a desert scene might be tinted blue to contrast with the warm highlights.

**Your Task:**

1.  **Extract a General Palette from the Reference:** Analyze the **Reference image** and extract an array of 5 key color palette hex codes. This provides a general overview of the target aesthetic.

2.  **Analyze the Color Grading (Tonal Palette):** Following the core principles, analyze the **Reference image** to determine the color tint applied to its shadows, midtones, and highlights.
    *   For each (Shadows, Midtones, Highlights), provide:
        *   \`color\`: The hex code of the tint you identified in the Reference image.
        *   \`description\`: A professional analysis of how this tint contributes to the reference image's mood, considering the principle of keeping highlights cleaner.

3.  **Perform a Comparative HSL Analysis:** This is the most critical task. Compare the Source and Reference images to provide actionable HSL advice.
    *   Identify the **3 most photographically important colors** that differ between the images (e.g., skin tones, foliage, sky).
    *   For each of these three colors, provide specific HSL (Hue, Saturation, Luminance) adjustment recommendations to apply to the **Source image** to make it match the **Reference image**.
    *   For each HSL adjustment, you must populate:
        *   \`colorName\`: A simple, descriptive name (e.g., "Foliage Green", "Actor's Skin Tone").
        *   \`hex\`: A representative hex code for that color *from the reference image*.
        *   \`hueShift\`, \`saturation\`, \`luminance\`: Recommended numerical shifts (e.g., "+8", "-15") to apply to the source.
        *   \`reasoning\`: A professional justification explaining *why* these adjustments are needed (e.g., "The greens in the source are too vibrant. Reducing saturation and shifting the hue towards yellow will match the muted, earthy tones characteristic of the Fuji Eterna film stock emulated in the reference.").

4.  **Analyze White Balance and Tone Curve:**
    *   **White Balance & Contrast:** Compare the overall color temperature, tint, and contrast. Describe the necessary adjustments with specific direction (e.g., "Warmer, push towards +15", "Shift tint towards green, approx -12").
    *   **Tone Curve:** Compare the contrast and exposure of the Source and Reference images. Describe the adjustments needed on a 5-point tone curve (Blacks, Shadows, Midtones, Highlights, Whites) to make the source match the reference, paying attention to the cinematic principles. For each of the 5 points, describe the adjustment (e.g., "Blacks: Crushed significantly to create a deep, rich black point and increase contrast", "Highlights: Rolled off gently to create a softer, filmic look and prevent digital clipping").

**Inputs:**
*   **Source Image:** {{media url=sourcePhotoDataUri}}
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
    return output!;
  }
);
