'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export function ClientForm() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <BackgroundGradient containerClassName="rounded-2xl" className="rounded-2xl bg-card text-card-foreground">
        <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Detalles del Cliente y Evento</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Campo Nombre del Cliente */}
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="clientName">Nombre del Cliente</Label>
                    <Input
                    id="clientName"
                    {...register('clientName')}
                    className="bg-card"
                    />
                    {errors.clientName && (
                    <p className="text-sm text-red-500">{`${errors.clientName.message}`}</p>
                    )}
                </div>

                {/* Campo Tipo de Evento */}
                <div className="space-y-2">
                    <div className="flex items-center">
                    <Label htmlFor="eventType">Tipo de Evento</Label>
                    <InfoTooltip content="Ejemplos: Boda, Sesión de Retrato, Video Corporativo. Esto aparecerá en la propuesta." />
                    </div>
                    <Input
                    id="eventType"
                    {...register('eventType')}
                    className="bg-card"
                    />
                    {errors.eventType && (
                    <p className="text-sm text-red-500">{`${errors.eventType.message}`}</p>
                    )}
                </div>

                {/* Campo Número de Propuesta */}
                <div className="space-y-2">
                    <div className="flex items-center">
                    <Label htmlFor="invoiceNumber">Número de Propuesta</Label>
                    <InfoTooltip content="Un identificador único para tu control. Ejemplo: 2024-001." />
                    </div>
                    <Input
                    id="invoiceNumber"
                    {...register('invoiceNumber')}
                    className="bg-card"
                    />
                    {errors.invoiceNumber && (
                    <p className="text-sm text-red-500">{`${errors.invoiceNumber.message}`}</p>
                    )}
                </div>
                </div>
            </CardContent>
        </Card>
    </BackgroundGradient>
  );
}
