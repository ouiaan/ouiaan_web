'use server';

import { generateColorPalette } from '@/ai/flows/generate-color-palette';
import type { GenerateColorPaletteInput, GenerateColorPaletteOutput } from '@/ai/flows/generate-color-palette';

export async function runGeneratePalette(input: GenerateColorPaletteInput): Promise<GenerateColorPaletteOutput | { error: string }> {
  try {
    const result = await generateColorPalette(input);
    if (!result.colorPalette || !result.suggestedLuts || !result.tonalColors) {
        throw new Error("AI failed to return expected data structure.");
    }
    return result;
  } catch (e: unknown) {
    console.error(e);
    const message = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate palette: ${message}` };
  }
}
