
'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

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
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Análisis de Rentabilidad</CardTitle>
        <p className="pt-1 text-sm text-muted-foreground">
          Establece tu contribución a fijos y tu margen de ganancia.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <div className="flex items-center">
                <Label htmlFor="overheadContributionPercentage">% de Contribución a Fijos (Overhead)</Label>
                <InfoTooltip content="Un porcentaje de tus costos fijos totales que cada proyecto debe 'aportar' para ayudar a cubrir los gastos generales del negocio (renta, software, etc.)." />
            </div>
           <div className="relative">
            <Input
              id="overheadContributionPercentage"
              type="number"
              {...register('overheadContributionPercentage', { valueAsNumber: true })}
              className="bg-neutral-950 pl-8"
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
              className="bg-neutral-950 pl-8"
            />
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
