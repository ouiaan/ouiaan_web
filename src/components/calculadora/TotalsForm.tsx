'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function TotalsForm() {
  const { register } = useFormContext();

  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardContent className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-3">
        {/* Campo de Descuento */}
        <div className="space-y-2">
          <Label htmlFor="discountPercentage">Descuento (%)</Label>
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
          <Label htmlFor="vatPercentage">IVA (%)</Label>
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
          <Label htmlFor="downPaymentPercentage">Anticipo (%)</Label>
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