

'use server';

/**
 * @fileOverview Un agente de IA que analiza una imagen de referencia y colores tonales seleccionados por el usuario para generar una receta de etalonaje.
 *
 * - generateColorGradeRecipe - Una función que analiza una imagen de referencia y genera una receta de etalonaje.
 * - GenerateColorGradeRecipeInput - El tipo de entrada para la función generateColorGradeRecipe.
 * - GenerateColorGradeRecipeOutput - El tipo de retorno para la función generateColorGradeRecipe.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateColorGradeRecipeInputSchema = z.object({
  referencePhotoDataUri: z
    .string()
    .describe(
        "La imagen de referencia con el look deseado (ej., un fotograma de una película), como un data URI que debe incluir un tipo MIME y usar codificación Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userSelectedTones: z.object({
    shadows: z.string().describe("El color hexadecimal para las sombras, seleccionado por el usuario con un gotero de la imagen de referencia."),
    midtones: z.string().describe("El color hexadecimal para los medios tonos, seleccionado por el usuario con un gotero de la imagen de referencia."),
    highlights: z.string().describe("El color hexadecimal para las altas luces, seleccionado por el usuario con un gotero de la imagen de referencia."),
  }).describe("Los colores tonales clave seleccionados manualmente por el usuario."),
});
export type GenerateColorGradeRecipeInput = z.infer<typeof GenerateColorGradeRecipeInputSchema>;

const TonalPaletteColorSchema = z.object({
  description: z.string().describe("Un análisis breve y profesional de por qué se eligió este color para este rango tonal y su efecto en el ambiente de la imagen. Explica la elección artística."),
  color: z.string().describe("El código hexadecimal que representa el tinte para este rango tonal, proporcionado por el usuario."),
});

const HSLAdjustmentSchema = z.object({
    colorName: z.enum(["Reds", "Oranges", "Yellows", "Greens", "Aquas", "Blues", "Purples", "Magentas"]),
    hue: z.string().describe("El valor recomendado de cambio de tono (ej., '+8', '-5', '0')."),
    saturation: z.string().describe("El valor recomendado de ajuste de saturación (ej., '-15', '+10', '0')."),
    luminance: z.string().describe("El valor recomendado de ajuste de luminancia (ej., '+5', '-20', '0')."),
});

const ToneCurvePointSchema = z.object({
    point: z.enum(["Blacks", "Shadows", "Midtones", "Highlights", "Whites"]),
    adjustment: z.string().describe("Una descripción del ajuste realizado en este punto de la curva de tonos (ej., 'Ligeramente levantados', 'Significativamente aplastados', 'Desplazado hacia el azul')."),
});

const GenerateColorGradeRecipeOutputSchema = z.object({
  colorPalette: z.array(z.string()).describe('Un array de 5 códigos de color hexadecimales clave extraídos de la imagen de REFERENCIA.'),
  tonalPalette: z.object({
      shadows: TonalPaletteColorSchema.describe("El color seleccionado por el usuario y el análisis de la IA para las sombras."),
      midtones: TonalPaletteColorSchema.describe("El color seleccionado por el usuario y el análisis de la IA para los medios tonos."),
      highlights: TonalPaletteColorSchema.describe("El color seleccionado por el usuario y el análisis de la IA para las altas luces."),
    }).describe("Una paleta de 3 colores que representa el tinte de color en las sombras, medios tonos y altas luces de la imagen de referencia."),
  hslAdjustments: z.array(HSLAdjustmentSchema).length(8).describe("Un array de recomendaciones de ajuste HSL (Tono, Saturación, Luminancia) para los 8 rangos de color primarios, similar a una herramienta de edición profesional."),
  toneCurve: z.array(ToneCurvePointSchema).length(5).describe("Un análisis de los ajustes de la curva de tonos necesarios para igualar el contraste y la exposición de la imagen de origen con la imagen de referencia."),
  whiteBalance: z.object({
      temperature: z.string().describe("Describe la temperatura del balance de blancos de la imagen (ej., 'Cálido, aprox. 4500K', 'Frío, aprox. 7500K', 'Neutral'). Proporciona consejos específicos y accionables."),
      tint: z.string().describe("Describe el tinte del balance de blancos de la imagen (ej., 'Ligero tinte magenta, +8', 'Ligero tinte verde, -5', 'Neutral'). Proporciona consejos específicos y accionables."),
  }).describe("Un análisis general del balance de blancos necesario para lograr el look de referencia."),
});
export type GenerateColorGradeRecipeOutput = z.infer<typeof GenerateColorGradeRecipeOutputSchema>;

export async function generateColorGradeRecipe(input: GenerateColorGradeRecipeInput): Promise<GenerateColorGradeRecipeOutput> {
  return generateColorPaletteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateColorGradeRecipePrompt',
  input: {schema: GenerateColorGradeRecipeInputSchema},
  output: {schema: GenerateColorGradeRecipeOutputSchema},
  prompt: `Eres un colorista y técnico de imagen digital (DIT) de clase mundial. Tu tarea es analizar una imagen de "Referencia" y un conjunto de colores seleccionados por el usuario para generar una receta de etalonaje (color grading) precisa y accionable.

Tienes un profundo conocimiento de los principios profesionales de etalonaje, incluidas las características de las cámaras de cine digital (como ARRI, RED) y las emulsiones de película clásicas (como Kodak y Fuji). Debes actuar como una herramienta de análisis que amplía las selecciones iniciales del usuario.

**Principios Fundamentales de Etalonaje a seguir:**
- **Puntos de Anclaje:** Las imágenes etalonadas profesionalmente mantienen puntos de anclaje limpios. Los negros profundos deben ser realmente negros (o casi negros) y los blancos más altos deben ser blancos, sin contaminación de color. El "look" se crea en los tonos intermedios.
- **Tinte Cinemático:** El ambiente se crea principalmente introduciendo tintes de color específicos y sutiles en las **sombras** y los **medios tonos**. Las altas luces generalmente se mantienen limpias o tienen un tinte muy ligero y motivado para evitar un aspecto amateur de "filtro".

**DATOS PROPORCIONADOS POR EL USUARIO:**
El usuario ya ha utilizado una herramienta de gotero en la imagen de referencia para seleccionar los siguientes colores tonales clave:
- **Color de Sombras:** {{{userSelectedTones.shadows}}}
- **Color de Medios Tonos:** {{{userSelectedTones.midtones}}}
- **Color de Altas Luces:** {{{userSelectedTones.highlights}}}

**TU TAREA (RESPONDE SIEMPRE EN ESPAÑOL):**

1.  **Extraer una Paleta General:** Analiza la **imagen de Referencia** general y extrae un array de 5 códigos de color hexadecimales que representen la estética general.

2.  **Analizar y Justificar la Paleta Tonal:** El usuario ha proporcionado los colores clave. Tu trabajo es actuar como el colorista experto y explicar *por qué* estas elecciones son efectivas. Para cada rango tonal (Sombras, Medios Tonos, Altas Luces):
    *   Usa el código hexadecimal proporcionado por el usuario como el valor 'color'.
    *   Proporciona una 'description' profesional que analice la elección artística detrás de este tinte y cómo contribuye al ambiente de la imagen de referencia, considerando los principios del color cinematográfico. Por ejemplo, explica cómo el azul seleccionado en las sombras crea un ambiente frío y sombrío.

3.  **Realizar un Análisis HSL Completo:** Basado en el look general de la imagen de referencia, deconstruye su manipulación de color en los 8 vectores HSL primarios utilizados en software profesional (DaVinci Resolve, Lightroom). Para cada uno de los 8 colores (Reds, Oranges, Yellows, Greens, Aquas, Blues, Purples, Magentas), analiza la imagen y determina los ajustes necesarios para lograr su aspecto desde un punto de partida neutral.
    *   Proporciona estimaciones numéricas específicas para los cambios de \`hue\`, \`saturation\` y \`luminance\` (ej., '+8', '-15', '0'). Estos valores representan el *etalonaje* aplicado a la imagen.

4.  **Analizar el Balance de Blancos:**
    *   Describe la temperatura de color y el tinte generales. Proporciona una dirección específica y profesional (ej., "Cálido, aprox. 4500K", "Ligero tinte verde, aprox -12").

5.  **Analizar la Curva de Tonos:**
    *   Describe los ajustes en una curva de tonos de 5 puntos (Blacks, Shadows, Midtones, Highlights, Whites). Presta atención a los principios cinematográficos. Para cada punto, describe el ajuste (ej., "Negros: Aplastados significativamente para crear un punto negro profundo y rico", "Altas Luces: Suavizadas suavemente para crear un aspecto más suave y fílmico").

**Imagen de Entrada:**
*   **Imagen de Referencia:** {{media url=referencePhotoDataUri}}

Responde en formato JSON.`,
});

const generateColorPaletteFlow = ai.defineFlow(
  {
    name: 'generateColorPaletteFlow',
    inputSchema: GenerateColorGradeRecipeInputSchema,
    outputSchema: GenerateColorGradeRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    if (!output) {
      throw new Error("La IA no devolvió una respuesta.");
    }
    
    // Ensure the output includes the user-selected colors.
    output.tonalPalette.shadows.color = input.userSelectedTones.shadows;
    output.tonalPalette.midtones.color = input.userSelectedTones.midtones;
    output.tonalPalette.highlights.color = input.userSelectedTones.highlights;
    
    return output;
  }
);
