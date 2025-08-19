
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

      const shadowTintRgb = hexToRgb(tonalPalette.shadows.color);
      const midtoneTintRgb = hexToRgb(tonalPalette.midtones.color);
      const highlightTintRgb = hexToRgb(tonalPalette.highlights.color);

      // Prepare HSL adjustments
      const hslShifts = hslAdjustments.map(adj => ({
        targetHsl: convert.hex.hsl(adj.hex),
        hueShift: parseAdjustment(adj.hueShift),
        saturationShift: parseAdjustment(adj.saturation),
        luminanceShift: parseAdjustment(adj.luminance),
      }));

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        // --- 1. Apply HSL Adjustments ---
        let [h, s, l] = convert.rgb.hsl(r, g, b);

        let totalHueShift = 0;
        let totalSatShift = 0;
        let totalLumShift = 0;
        let totalWeight = 0;

        for (const shift of hslShifts) {
          const hueDistance = Math.min(Math.abs(h - shift.targetHsl[0]), 360 - Math.abs(h - shift.targetHsl[0]));
          const hueInfluenceRange = 30; // degrees

          if (hueDistance < hueInfluenceRange) {
            // Use a cosine-based falloff for smooth transitions
            const weight = (1 + Math.cos(Math.PI * hueDistance / hueInfluenceRange)) / 2;
            totalHueShift += shift.hueShift * weight;
            totalSatShift += shift.saturationShift * weight;
            totalLumShift += shift.luminanceShift * weight;
            totalWeight += weight;
          }
        }
        
        if (totalWeight > 0) {
            h = (h + totalHueShift / totalWeight + 360) % 360;
            s = Math.max(0, Math.min(100, s + totalSatShift / totalWeight));
            l = Math.max(0, Math.min(100, l + totalLumShift / totalWeight));
        }

        [r, g, b] = convert.hsl.rgb(h, s, l);

        // --- 2. Apply Tonal Tints ---
        const originalLuminance = (0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]) / 255;
        const blendFactor = 0.35; 

        let tintRgb: [number, number, number];

        // Blending tints based on luminance
        if (originalLuminance < 0.33) {
            tintRgb = shadowTintRgb;
        } else if (originalLuminance < 0.66) {
            const mixRatio = (originalLuminance - 0.33) / (0.66 - 0.33);
            tintRgb = [
                shadowTintRgb[0] * (1 - mixRatio) + midtoneTintRgb[0] * mixRatio,
                shadowTintRgb[1] * (1 - mixRatio) + midtoneTintRgb[1] * mixRatio,
                shadowTintRgb[2] * (1 - mixRatio) + midtoneTintRgb[2] * mixRatio,
            ];
        } else {
             const mixRatio = (originalLuminance - 0.66) / (1.0 - 0.66);
             tintRgb = [
                midtoneTintRgb[0] * (1 - mixRatio) + highlightTintRgb[0] * mixRatio,
                midtoneTintRgb[1] * (1 - mixRatio) + highlightTintRgb[1] * mixRatio,
                midtoneTintRgb[2] * (1 - mixRatio) + highlightTintRgb[2] * mixRatio,
            ];
        }
        
        // Linear interpolation for blending
        r = r * (1 - blendFactor) + tintRgb[0] * blendFactor;
        g = g * (1 - blendFactor) + tintRgb[1] * blendFactor;
        b = b * (1 - blendFactor) + tintRgb[2] * blendFactor;
        
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
