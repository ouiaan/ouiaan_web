
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


export function FinancialsForm() {
  const { register } = useFormContext();

  return (
    <BackgroundGradient containerClassName="rounded-2xl" className="rounded-2xl bg-card text-card-foreground">
        <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Análisis de Rentabilidad</CardTitle>
                <p className="pt-1 text-sm text-muted-foreground">
                Establece tu contribución a fijos, tu tarifa por hora y tu margen de ganancia.
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center">
                        <Label htmlFor="overheadContributionPercentage">% de Contribución a Fijos (Overhead)</Label>
                        <InfoTooltip content="Imagina que es la 'renta' que este proyecto paga para mantener tu negocio. Ayuda a cubrir tus gastos fijos (Adobe, seguros, etc.). Un 15-25% es un buen punto de partida." />
                    </div>
                <div className="relative">
                    <Input
                    id="overheadContributionPercentage"
                    type="number"
                    {...register('overheadContributionPercentage', { valueAsNumber: true })}
                    className="bg-card pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
                </div>
                
                <div className="space-y-2">
                <div className="flex items-center">
                    <Label htmlFor="profitMarginPercentage">Margen de Ganancia del Negocio (%)</Label>
                    <InfoTooltip content="El porcentaje de ganancia que deseas obtener sobre el costo total de producción (mano de obra + costos variables + contribución a fijos)." />
                </div>
                <div className="relative">
                    <Input
                    id="profitMarginPercentage"
                    type="number"
                    {...register('profitMarginPercentage', { valueAsNumber: true })}
                    className="bg-card pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
                </div>

                <div className="space-y-2">
                <div className="flex items-center">
                    <Label htmlFor="defaultLaborRate">Tarifa de Mano de Obra por Hora</Label>
                    <InfoTooltip content="Define tu costo estándar por hora de trabajo. Este valor se usará para calcular automáticamente el costo total de tu mano de obra. Como referencia en la industria (MXN): Jr. $150-$250/hr, Mid $250-$450/hr, Sr. $450-$700+/hr. Ajústalo a tu mercado." />
                </div>
                <div className="relative">
                    <Input
                    id="defaultLaborRate"
                    type="number"
                    {...register('defaultLaborRate', { valueAsNumber: true })}
                    className="bg-card pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                </div>
                </div>
            </CardContent>
        </Card>
    </BackgroundGradient>
  );
}
