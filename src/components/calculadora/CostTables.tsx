'use client';

import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2 } from 'lucide-react';

const clientFacingCategories = [
  "Planeación y Pre-Boda",
  "Cobertura del Evento",
  "Post-Producción",
  "Plataforma Digital",
  "Costos de Estudio y Gestión de Proyecto",
] as const;

export function CostTables() {
  const { control, register } = useFormContext();

  const { fields: laborFields, append: appendLabor, remove: removeLabor } = useFieldArray({ control, name: "laborItems" });
  const { fields: variableFields, append: appendVariable, remove: removeVariable } = useFieldArray({ control, name: "variableCostItems" });
  const { fields: fixedFields, append: appendFixed, remove: removeFixed } = useFieldArray({ control, name: "fixedCostItems" });
  
  return (
    <Card className="border-neutral-800 bg-neutral-900">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Desglose de Costos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-12">
        {/* Tabla de Mano de Obra */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Costos de Mano de Obra</h4>
          <div className="rounded-lg border border-neutral-800 p-2 space-y-2">
            {laborFields.map((item, index) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-2">
                <div className="md:col-span-5"><Input {...register(`laborItems.${index}.description`)} placeholder="Descripción" className="bg-neutral-900" /></div>
                <div className="md:col-span-2"><Input {...register(`laborItems.${index}.hours`, { valueAsNumber: true })} type="number" placeholder="Horas" className="bg-neutral-900 text-center" /></div>
                <div className="md:col-span-2"><Input {...register(`laborItems.${index}.rate`, { valueAsNumber: true })} type="number" placeholder="Tarifa/Hora" className="bg-neutral-900 text-center" /></div>
                <div className="md:col-span-2">
                   <Controller
                    control={control}
                    name={`laborItems.${index}.category`}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Categoría..." /></SelectTrigger>
                        <SelectContent>{clientFacingCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="md:col-span-1 flex justify-end"><Button type="button" variant="ghost" size="icon" onClick={() => removeLabor(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={() => appendLabor({ description: '', hours: 1, rate: 170, category: "Cobertura del Evento" })} className="border-dashed"><PlusCircle className="mr-2 h-4 w-4" />Agregar Mano de Obra</Button>
        </div>

        {/* Tabla de Costos Variables */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Costos Variables</h4>
          <div className="rounded-lg border border-neutral-800 p-2 space-y-2">
            {variableFields.map((item, index) => (
               <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-2">
                <div className="md:col-span-5"><Input {...register(`variableCostItems.${index}.description`)} placeholder="Descripción" className="bg-neutral-900" /></div>
                <div className="md:col-span-2"><Input {...register(`variableCostItems.${index}.quantity`, { valueAsNumber: true })} type="number" placeholder="Cantidad" className="bg-neutral-900 text-center" /></div>
                <div className="md:col-span-2"><Input {...register(`variableCostItems.${index}.cost`, { valueAsNumber: true })} type="number" placeholder="Costo/Unidad" className="bg-neutral-900 text-center" /></div>
                <div className="md:col-span-2">
                   <Controller
                    control={control}
                    name={`variableCostItems.${index}.category`}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Categoría..." /></SelectTrigger>
                        <SelectContent>{clientFacingCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="md:col-span-1 flex justify-end"><Button type="button" variant="ghost" size="icon" onClick={() => removeVariable(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={() => appendVariable({ description: '', quantity: 1, cost: 0, category: "Cobertura del Evento" })} className="border-dashed"><PlusCircle className="mr-2 h-4 w-4" />Agregar Costo Variable</Button>
        </div>
        
        {/* Tabla de Costos Fijos */}
        <div className="space-y-4">
           <h4 className="text-lg font-medium">Costos Fijos (Interno)</h4>
           <div className="rounded-lg border border-neutral-800 p-2 space-y-2">
             {fixedFields.map((item, index) => (
               <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-2">
                <div className="md:col-span-7"><Input {...register(`fixedCostItems.${index}.description`)} placeholder="Descripción" className="bg-neutral-900" /></div>
                <div className="md:col-span-2"><Input {...register(`fixedCostItems.${index}.quantity`, { valueAsNumber: true })} type="number" placeholder="Cantidad" className="bg-neutral-900 text-center" /></div>
                <div className="md:col-span-2"><Input {...register(`fixedCostItems.${index}.cost`, { valueAsNumber: true })} type="number" placeholder="Costo/Unidad" className="bg-neutral-900 text-center" /></div>
                <div className="md:col-span-1 flex justify-end"><Button type="button" variant="ghost" size="icon" onClick={() => removeFixed(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>
              </div>
            ))}
           </div>
          <Button type="button" variant="outline" onClick={() => appendFixed({ description: '', quantity: 1, cost: 0 })} className="border-dashed"><PlusCircle className="mr-2 h-4 w-4" />Agregar Costo Fijo</Button>
        </div>
      </CardContent>
    </Card>
  );
}