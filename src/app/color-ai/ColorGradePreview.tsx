
'use client';

import { useEffect, useRef } from 'react';
import type { GenerateColorGradeRecipeOutput } from '@/ai/flows/generate-color-palette';
import convert from 'color-convert';

type ColorGradePreviewProps = {
  sourceImage: string;
  recipe: GenerateColorGradeRecipeOutput;
};

// Helper function to parse HSL adjustment string like "+10" or "-5"
const parseAdjustment = (adjustment: string): number => {
    return parseInt(adjustment, 10) || 0;
};

// Helper function to convert hex to an [r, g, b] array
const hexToRgb = (hex: string): [number, number, number] => {
  if (!hex || !/^[#a-fA-F0-9]{6,7}$/.test(hex)) return [128, 128, 128]; // Return neutral gray for invalid hex
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [128, 128, 128];
};


export function ColorGradePreview({ sourceImage, recipe }: ColorGradePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { willReadFrequently: true });
    if (!canvas || !context) return;

    const image = new Image();
    image.crossOrigin = 'anonymous'; 
    image.src = sourceImage;
    
    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);

      if (!canvas.width || !canvas.height) return;

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const { tonalPalette, hslAdjustments } = recipe;

      // Prepare HSL representations of tint colors
      const shadowTintHsl = convert.rgb.hsl(hexToRgb(tonalPalette.shadows.color));
      const midtoneTintHsl = convert.rgb.hsl(hexToRgb(tonalPalette.midtones.color));
      const highlightTintHsl = convert.rgb.hsl(hexToRgb(tonalPalette.highlights.color));

      // Prepare HSL adjustments
      const hslShifts = hslAdjustments.map(adj => ({
        targetHsl: convert.hex.hsl(adj.hex),
        hueShift: parseAdjustment(adj.hueShift),
        saturationShift: parseAdjustment(adj.saturation),
        // Luminance shift is ignored as per user feedback to reduce artifacts
        // luminanceShift: parseAdjustment(adj.luminance),
      }));

      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        let [h, s, l] = convert.rgb.hsl(r, g, b);

        // 1. Apply HSL Adjustments (Hue and Saturation only)
        let totalHueShift = 0;
        let totalSatShift = 0;
        let totalWeight = 0;

        for (const shift of hslShifts) {
          const hueDistance = Math.min(Math.abs(h - shift.targetHsl[0]), 360 - Math.abs(h - shift.targetHsl[0]));
          const hueInfluenceRange = 30; // degrees

          if (hueDistance < hueInfluenceRange) {
            const weight = (1 + Math.cos(Math.PI * hueDistance / hueInfluenceRange)) / 2;
            totalHueShift += shift.hueShift * weight;
            totalSatShift += shift.saturationShift * weight;
            totalWeight += weight;
          }
        }

        if (totalWeight > 0) {
          h = (h + totalHueShift / totalWeight + 360) % 360;
          s = Math.max(0, Math.min(100, s + totalSatShift / totalWeight));
          // l is NOT modified here
        }
        
        // Convert back to RGB to apply tonal tinting in a more controlled way
        [r, g, b] = convert.hsl.rgb(h, s, l);

        // 2. Apply Tonal Tints while preserving original luminance (l)
        const originalLuminance = l;
        const blendFactor = 0.25; // How strong the tint is

        let finalTintHsl: [number, number, number];

        if (originalLuminance < 33.3) {
            finalTintHsl = shadowTintHsl;
        } else if (originalLuminance < 66.6) {
            // Blend between shadows and midtones
            const midtoneWeight = (originalLuminance - 33.3) / (66.6 - 33.3);
            finalTintHsl = [
                shadowTintHsl[0] * (1 - midtoneWeight) + midtoneTintHsl[0] * midtoneWeight,
                shadowTintHsl[1] * (1 - midtoneWeight) + midtoneTintHsl[1] * midtoneWeight,
                shadowTintHsl[2] * (1 - midtoneWeight) + midtoneTintHsl[2] * midtoneWeight,
            ];
        } else {
            // Blend between midtones and highlights
            const highlightWeight = (originalLuminance - 66.6) / (100.0 - 66.6);
            finalTintHsl = [
                midtoneTintHsl[0] * (1 - highlightWeight) + highlightTintHsl[0] * highlightWeight,
                midtoneTintHsl[1] * (1 - highlightWeight) + highlightTintHsl[1] * highlightWeight,
                midtoneTintHsl[2] * (1 - highlightWeight) + highlightTintHsl[2] * highlightWeight,
            ];
        }
        
        // Create the new color by taking the hue and saturation from the tint, but keeping the original luminance
        const gradedHsl: [number, number, number] = [
            finalTintHsl[0], // Hue from tint
            finalTintHsl[1], // Saturation from tint
            originalLuminance, // ** Preserve original luminance **
        ];
        const [tinted_r, tinted_g, tinted_b] = convert.hsl.rgb(gradedHsl);

        // Blend the original color with the new tinted color
        r = Math.round(r * (1 - blendFactor) + tinted_r * blendFactor);
        g = Math.round(g * (1 - blendFactor) + tinted_g * blendFactor);
        b = Math.round(b * (1 - blendFactor) + tinted_b * blendFactor);

        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
      }

      context.putImageData(imageData, 0, 0);
    };

    image.onerror = (e) => {
      console.error("Error loading image for canvas:", e);
    }

  }, [sourceImage, recipe]);

  return (
      <canvas ref={canvasRef} className="w-full h-auto rounded-lg border border-border" />
  );
}
