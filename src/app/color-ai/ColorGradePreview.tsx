
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
            // For now, we ignore luminance shift from HSL to prevent artifacts
            // l = Math.max(0, Math.min(100, l + totalLumShift / totalWeight));
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
                midto...

This model response is too long. Shorten it.¡Absolutamente de acuerdo! Viendo la previsualización, está claro que mi enfoque anterior fue un fracaso. La imagen se ve quemada y los colores son irreales. Pido disculpas, es frustrante no lograr el resultado visual correcto.

El problema radica en mi algoritmo de previsualización y en las curvas de tono que no se muestran.

**Mi Plan para la Corrección Definitiva:**

1.  **Arreglar la Previsualización (`ColorGradePreview.tsx`):** Voy a reescribir la lógica de mezcla de colores. El nuevo método aplicará los ajustes HSL de forma más sutil y, lo más importante, al aplicar el tinte tonal, **conservará la luminancia del píxel original**, lo que evitará que la imagen se "queme".

2.  **Reparar las Curvas de Tono (`ColorCurves.tsx`):** Corregiré un error que impedía que los gráficos se renderizaran. Además, mejoraré el algoritmo de dibujo para que las curvas se vean más suaves y profesionales, y ajustaré la intensidad del color para una representación más fiel y sutil.

3.  **Integración Final (`ColorAIClient.tsx`):** Me aseguraré de que el componente de curvas de tono, ya corregido, se muestre correctamente debajo de la previsualización.

Estos cambios deberían, de una vez por todas, producir una previsualización precisa y mostrar el análisis de curvas de tono que faltaba.

<changes>
  <description>Se ha reescrito la lógica de previsualización de color para evitar la sobresaturación y el aspecto "quemado". Se ha corregido y mejorado el componente de curvas de tono para que se visualice correctamente con un trazado más suave y profesional.</description>
  <change>
    <file>/src/app/color-ai/ColorGradePreview.tsx</file>
    <content><![CDATA[
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

      const shadowTintHsl = convert.rgb.hsl(hexToRgb(tonalPalette.shadows.color));
      const midtoneTintHsl = convert.rgb.hsl(hexToRgb(tonalPalette.midtones.color));
      const highlightTintHsl = convert.rgb.hsl(hexToRgb(tonalPalette.highlights.color));

      const hslShifts = hslAdjustments.map(adj => ({
        targetHsl: convert.hex.hsl(adj.hex),
        hueShift: parseAdjustment(adj.hueShift),
        saturationShift: parseAdjustment(adj.saturation),
      }));

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        let [h, s, l] = convert.rgb.hsl(r, g, b);

        // --- 1. Apply HSL Adjustments ---
        let totalHueShift = 0;
        let totalSatShift = 0;
        let totalWeight = 0;

        for (const shift of hslShifts) {
          const hueDistance = Math.min(Math.abs(h - shift.targetHsl[0]), 360 - Math.abs(h - shift.targetHsl[0]));
          const hueInfluenceRange = 30;

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
        }

        // --- 2. Apply Tonal Tints (Colorize based on luminance) ---
        const originalLuminance = l / 100;
        const blendFactor = 0.5;

        let tintHsl: [number, number, number];

        if (originalLuminance < 0.33) {
            tintHsl = shadowTintHsl;
        } else if (originalLuminance < 0.66) {
            tintHsl = midtoneTintHsl;
        } else {
            tintHsl = highlightTintHsl;
        }
        
        // Mix the hue and saturation of the tint, but keep original luminance
        const finalH = h * (1 - blendFactor) + tintHsl[0] * blendFactor;
        const finalS = s * (1 - blendFactor) + tintHsl[1] * blendFactor;

        [r, g, b] = convert.hsl.rgb([finalH, finalS, l]);

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
