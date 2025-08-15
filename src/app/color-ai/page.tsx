import { SectionTitle } from "@/components/ui/SectionTitle";
import { ColorAIClient } from "./ColorAIClient";

export default function ColorAIPage() {
  return (
    <div className="container mx-auto py-16 md:py-24 px-4">
      <SectionTitle>Color Palette AI</SectionTitle>
      <p className="text-center max-w-2xl mx-auto mb-12 text-foreground/70">
        Upload a photo to generate a custom color palette and get recommendations for LUTs from the store that match your aesthetic.
      </p>
      <ColorAIClient />
    </div>
  );
}
