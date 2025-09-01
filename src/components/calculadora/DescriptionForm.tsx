'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Usaremos el componente Textarea

// Definimos las categorías que necesitan una descripción
const descriptionCategories = [
  "Planeación y Pre-Boda",
  "Cobertura del Evento",
  "Post-Producción",
  "Plataforma Digital",
  "Costos de Estudio y Gestión de Proyecto",
];

export function DescriptionForm() {
  const { register } = useFormContext();

  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Descripción de Servicios por Categoría</CardTitle>
        <p className="pt-1 text-sm text-muted-foreground">
          Este texto aparecerá en la propuesta del cliente. Personalízalo para cada cotización.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {descriptionCategories.map((category) => (
          <div key={category} className="space-y-2">
            <Label htmlFor={`categoryDescriptions.${category}`}>{category}</Label>
            <Textarea
              id={`categoryDescriptions.${category}`}
              {...register(`categoryDescriptions.${category}` as const)}
              className="min-h-[100px] bg-neutral-950"
              placeholder={`Detalla los servicios incluidos en ${category.toLowerCase()}...`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}