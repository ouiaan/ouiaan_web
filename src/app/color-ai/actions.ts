
'use server';

import { generateColorGradeRecipe } from '@/ai/flows/generate-color-palette';
import type { GenerateColorGradeRecipeInput, GenerateColorGradeRecipeOutput } from '@/ai/flows/generate-color-palette';
import { rateLimiter } from '@/lib/rate-limiter';

// Renaming the function for clarity to match the new purpose.
export async function runGenerateGrade(input: GenerateColorGradeRecipeInput): Promise<GenerateColorGradeRecipeOutput | { error: string }> {
  try {
    const { success } = await rateLimiter.limit("color-ai");
    if (!success) {
      return { error: "Wow, you're all inspired today. Try again in 60 seconds, Picasso!" };
    }

    // The flow being called is now the new comparative analysis flow.
    const result = await generateColorGradeRecipe(input);
    if (!result || !result.colorPalette || !result.tonalPalette || !result.hslAdjustments || !result.toneCurveAdjustments) {
        throw new Error("AI failed to return the expected data structure for the grade recipe.");
    }
    return result;
  } catch (e: unknown)
   {
    console.error(e);
    const message = e instanceof Error ? e.message : 'An unknown error occurred.';

    if (message.includes('503') || message.toLowerCase().includes('overloaded')) {
      return { error: "The AI is currently busy. Please wait a moment and try again." };
    }
    // Added more specific error for failed generation.
    return { error: `Failed to generate color grade recipe: ${message}` };
  }
}

    