
'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
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

export function TotalsForm() {
  const { register } = useFormContext();

  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardContent className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-3">
        {/* Campo de Descuento */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="discountPercentage">Descuento (%)</Label>
            <InfoTooltip content="Aplica un descuento sobre el subtotal. Introduce un número del 0 al 100." />
          </div>
          <div className="relative">
            <Input
              id="discountPercentage"
              type="number"
              {...register('discountPercentage', { valueAsNumber: true })}
              className="bg-neutral-950 pl-8"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
          </div>
        </div>
        
        {/* Campo de IVA */}
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="vatPercentage">IVA (%)</Label>
            <InfoTooltip content="Aplica el Impuesto al Valor Agregado (IVA) si necesitas generar una factura fiscal. De lo contrario, déjalo en 0." />
          </div>
           <div className="relative">
            <Input
              id="vatPercentage"
              type="number"
              {...register('vatPercentage', { valueAsNumber: true })}
              className="bg-neutral-950 pl-8"
            />
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
          </div>
        </div>

        {/* Campo de Anticipo */}
        <div className="space-y-2">
            <div className="flex items-center">
                <Label htmlFor="downPaymentPercentage">Anticipo (%)</Label>
                <InfoTooltip content="El porcentaje del costo total que el cliente debe pagar por adelantado para reservar tus servicios." />
            </div>
           <div className="relative">
            <Input
              id="downPaymentPercentage"
              type="number"
              {...register('downPaymentPercentage', { valueAsNumber: true })}
              className="bg-neutral-950 pl-8"
            />
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
