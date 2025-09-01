'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ClientForm() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <Card className="border-neutral-800 bg-neutral-900">
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
              className="bg-neutral-950"
            />
            {errors.clientName && (
              <p className="text-sm text-red-500">{`${errors.clientName.message}`}</p>
            )}
          </div>

          {/* Campo Tipo de Evento */}
          <div className="space-y-2">
            <Label htmlFor="eventType">Tipo de Evento</Label>
            <Input
              id="eventType"
              {...register('eventType')}
              className="bg-neutral-950"
            />
            {errors.eventType && (
              <p className="text-sm text-red-500">{`${errors.eventType.message}`}</p>
            )}
          </div>

          {/* Campo Número de Propuesta */}
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Número de Propuesta</Label>
            <Input
              id="invoiceNumber"
              {...register('invoiceNumber')}
              className="bg-neutral-950"
            />
             {errors.invoiceNumber && (
              <p className="text-sm text-red-500">{`${errors.invoiceNumber.message}`}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}