'use server';

import { generateColorPalette } from '@/ai/flows/generate-color-palette';
import type { GenerateColorPaletteInput, GenerateColorPaletteOutput } from '@/ai/flows/generate-color-palette';
import { rateLimiter } from '@/lib/rate-limiter';

export async function runGeneratePalette(input: GenerateColorPaletteInput): Promise<GenerateColorPaletteOutput | { error: string }> {
  try {
    const { success } = await rateLimiter.limit("color-ai");
    if (!success) {
      return { error: "Wow, you're all inspired today, Try again in 60 seconds Picasso!" };
    }

    const result = await generateColorPalette(input);
    if (!result.colorPalette || !result.suggestedLuts) {
        throw new Error("AI failed to return expected data structure.");
    }
    return result;
  } catch (e: unknown) {
    console.error(e);
    const message = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate palette: ${message}` };
  }
}
