'use server';

/**
 * @fileOverview An AI agent for generating SVG curve filter values from an image.
 *
 * - generateRgbCurves - A function that handles the curve generation process.
 * - GenerateRgbCurvesInput - The input type for the generateRgbCurves function.
 * - GenerateRgbCurvesOutput - The return type for the generateRgbCurves function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRgbCurvesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to generate RGB curves from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateRgbCurvesInput = z.infer<typeof GenerateRgbCurvesInputSchema>;


const GenerateRgbCurvesOutputSchema = z.object({
  r: z.string().describe("A space-separated string of 10-15 decimal values between 0.0 and 1.0 for the Red channel curve."),
  g: z.string().describe("A space-separated string of 10-15 decimal values between 0.0 and 1.0 for the Green channel curve."),
  b: z.string().describe("A space-separated string of 10-15 decimal values between 0.0 and 1.0 for the Blue channel curve."),
  description: z.string().describe("A brief, professional description of the color grade applied, explaining the mood and style.")
});
export type GenerateRgbCurvesOutput = z.infer<typeof GenerateRgbCurvesOutputSchema>;


export async function generateRgbCurves(input: GenerateRgbCurvesInput): Promise<GenerateRgbCurvesOutput> {
  return generateRgbCurvesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRgbCurvesPrompt',
  input: {schema: GenerateRgbCurvesInputSchema},
  output: {schema: GenerateRgbCurvesOutputSchema},
  prompt: `You are a professional color scientist and expert in digital color grading. Your task is to analyze an image and generate the 'tableValues' for an SVG <feComponentTransfer> filter to replicate the image's unique tonal curves.

You must provide a sequence of 10-15 space-separated decimal values (between 0.0 and 1.0) for EACH of the R, G, and B channels. These values represent the output intensity for evenly spaced input intensities, effectively creating a Photoshop-style curve.

- A value like "0 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1" represents a linear, unchanged curve.
- A crushed black look might start with "0.1 0.15..."
- A lifted highlight look might end with "...0.85 0.9".
- An 'S-curve' for contrast would have lower values at the start and higher values at the end.

Analyze the provided image and determine the precise curves for its red, green, and blue channels. Also provide a short, professional description of the resulting color grade style.

Image: {{media url=photoDataUri}}

Respond in JSON format.
`,
});

const generateRgbCurvesFlow = ai.defineFlow(
  {
    name: 'generateRgbCurvesFlow',
    inputSchema: GenerateRgbCurvesInputSchema,
    outputSchema: GenerateRgbCurvesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
