
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
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
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

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const { tonalPalette, hslAdjustments } = recipe;

      // Prepare tint colors
      const shadowTint = hexToRgb(tonalPalette.shadows.color);
      const midtoneTint = hexToRgb(tonalPalette.midtones.color);
      const highlightTint = hexToRgb(tonalPalette.highlights.color);

      // Prepare HSL adjustments
      const hslShifts = hslAdjustments.map(adj => ({
        targetHsl: convert.hex.hsl(adj.hex),
        hueShift: parseAdjustment(adj.hueShift),
        saturationShift: parseAdjustment(adj.saturation),
        luminanceShift: parseAdjustment(adj.luminance),
      }));

      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        let [h, s, l] = convert.rgb.hsl(r, g, b);

        // 1. Apply HSL Adjustments
        for (const shift of hslShifts) {
          // Check if the pixel's hue is close to the target hue
          const hueDistance = Math.min(Math.abs(h - shift.targetHsl[0]), 360 - Math.abs(h - shift.targetHsl[0]));
          if (hueDistance < 30) { // Apply if hue is within a 30-degree range
            h = (h + shift.hueShift + 360) % 360;
            s = Math.max(0, Math.min(100, s + shift.saturationShift));
            l = Math.max(0, Math.min(100, l + shift.luminanceShift));
          }
        }
        
        [r, g, b] = convert.hsl.rgb(h, s, l);

        // 2. Apply Tonal Tints
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255; // Luminance
        let tint: [number, number, number] | null = null;
        let blendFactor = 0.2; // How strong the tint is

        if (luminance < 0.33) {
          tint = shadowTint;
        } else if (luminance < 0.66) {
          tint = midtoneTint;
        } else {
          tint = highlightTint;
        }
        
        if (tint) {
            r = Math.round(r * (1 - blendFactor) + tint[0] * blendFactor);
            g = Math.round(g * (1 - blendFactor) + tint[1] * blendFactor);
            b = Math.round(b * (1 - blendFactor) + tint[2] * blendFactor);
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
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
