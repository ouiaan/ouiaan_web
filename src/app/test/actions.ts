'use server';

import { generateRgbCurves } from '@/ai/flows/generate-rgb-curves';
import type { GenerateRgbCurvesInput, GenerateRgbCurvesOutput } from '@/ai/flows/generate-rgb-curves';

export async function runGenerateRgbCurves(input: GenerateRgbCurvesInput): Promise<GenerateRgbCurvesOutput | { error: string }> {
  try {
    const result = await generateRgbCurves(input);
    if (!result.r || !result.g || !result.b) {
        throw new Error("AI failed to return valid curve data.");
    }
    return result;
  } catch (e: unknown) {
    console.error(e);
    const message = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate curves: ${message}` };
  }
}
