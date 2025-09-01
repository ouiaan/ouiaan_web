'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { BackgroundGradient } from '../ui/background-gradient';

const InfoTooltip = ({ content }: { content: string }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <span className="ml-2 cursor-help"><Info className="h-4 w-4 text-muted-foreground" /></span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
            <p className="text-sm">{content}</p>
        </TooltipContent>
    </Tooltip>
);

const descriptionCategories = [
  { name: "Planeación y Pre-Boda", tooltip: "Servicios antes del evento principal. Ej: Sesión de compromiso, reuniones de planificación, scouting de locaciones." },
  { name: "Cobertura del Evento", tooltip: "Todos los servicios durante el evento. Ej: Horas de cobertura, fotógrafo principal, segundo fotógrafo, cobertura con dron." },
  { name: "Post-Producción", tooltip: "El trabajo después del evento. Ej: Edición de fotos, etalonaje de video, selección de música, revisiones." },
  { name: "Plataforma Digital", tooltip: "Entregables digitales. Ej: Galería online, video destacado (highlight), video completo, archivos RAW." },
  { name: "Costos de Estudio y Gestión de Proyecto", tooltip: "Costos administrativos y de gestión relacionados con este proyecto específico. Se calcula automáticamente en base a tu 'Overhead' y 'Ganancia'." },
];

export function DescriptionForm() {
  const { register } = useFormContext();

  return (
    <BackgroundGradient containerClassName="rounded-2xl" className="rounded-2xl bg-card text-card-foreground">
        <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
                <CardTitle className="font-headline text-xl flex items-center">
                Descripción de Servicios por Categoría
                <InfoTooltip content="Describe qué incluye cada fase del proyecto. Usa viñetas (guiones) para crear listas. Esta información es clave en la propuesta para el cliente." />
                </CardTitle>
                <p className="pt-1 text-sm text-muted-foreground">
                Este texto aparecerá en la propuesta del cliente. Personalízalo para cada cotización.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {descriptionCategories.map((category) => (
                <div key={category.name} className="space-y-2">
                    <div className="flex items-center">
                        <Label htmlFor={`categoryDescriptions.${category.name}`}>{category.name}</Label>
                        <InfoTooltip content={category.tooltip} />
                    </div>
                    <Textarea
                    id={`categoryDescriptions.${category.name}`}
                    {...register(`categoryDescriptions.${category.name}` as const)}
                    className="min-h-[100px] bg-card"
                    placeholder={`Detalla los servicios incluidos en ${category.name.toLowerCase()}...`}
                    />
                </div>
                ))}
            </CardContent>
        </Card>
    </BackgroundGradient>
  );
}
