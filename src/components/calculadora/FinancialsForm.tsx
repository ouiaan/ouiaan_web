'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
          <Label htmlFor="overheadContributionPercentage">% de Contribución a Fijos (Overhead)</Label>
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
          <Label htmlFor="profitMarginPercentage">Margen de Ganancia del Negocio (%)</Label>
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