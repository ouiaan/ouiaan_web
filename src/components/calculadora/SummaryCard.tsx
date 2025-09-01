
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionButtons } from './ActionButtons';
import { type FormValues } from '@/app/calculadora/schema';
import { BackgroundGradient } from '../ui/background-gradient';

const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0);

interface CalculationResults {
  totalLabor: number;
  totalVariableCosts: number;
  overheadContribution: number;
  profit: number;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  total: number;
  downPayment: number;
  remainingBalance: number;
}

interface SummaryCardProps {
  results: CalculationResults;
}

export function SummaryCard({ results }: SummaryCardProps) {
  return (
    <div className="sticky top-24">
        <BackgroundGradient containerClassName="rounded-2xl" className="rounded-2xl bg-card text-card-foreground">
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Resumen del Presupuesto</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Mano de Obra</span><span className="font-medium">{formatCurrency(results.totalLabor)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Costos Variables</span><span className="font-medium">{formatCurrency(results.totalVariableCosts)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Contribución a Fijos</span><span className="font-medium">{formatCurrency(results.overheadContribution)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Ganancia del Negocio</span><span className="font-medium">{formatCurrency(results.profit)}</span></div>
                        
                        <div className="flex justify-between border-b border-border pb-2 pt-2 font-semibold"><span>Subtotal</span><span>{formatCurrency(results.subtotal)}</span></div>
                        
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground text-red-400">Descuento</span><span className="font-medium text-red-400">-{formatCurrency(results.discountAmount)}</span></div>
                        <div className="flex justify-between border-b border-border pb-2 text-sm"><span className="text-muted-foreground">IVA</span><span className="font-medium">{formatCurrency(results.vatAmount)}</span></div>

                        <div className="flex justify-between pt-2 text-lg font-bold"><span>Costo Total Cliente</span><span className="text-lime-400">{formatCurrency(results.total)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Anticipo</span><span className="font-medium">{formatCurrency(results.downPayment)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Saldo Restante</span><span className="font-medium">{formatCurrency(results.remainingBalance)}</span></div>
                    </div>
                    
                    <ActionButtons results={results} />
                </CardContent>
            </Card>
        </BackgroundGradient>
    </div>
  );
}
