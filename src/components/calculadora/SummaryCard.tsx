
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionButtons } from './ActionButtons';
import { BackgroundGradient } from '../ui/background-gradient';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';


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

const InfoTooltip = ({ content }: { content: React.ReactNode }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <span className="ml-2 cursor-help"><Info className="h-4 w-4 text-muted-foreground" /></span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
            <div className="text-sm text-left">{content}</div>
        </TooltipContent>
    </Tooltip>
);

export function SummaryCard({ results }: SummaryCardProps) {
  return (
    <div className="sticky top-24">
        <BackgroundGradient containerClassName="rounded-2xl" className="rounded-2xl bg-card text-card-foreground">
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader>
                    <CardTitle className="font-headline text-xl flex items-center">
                        Resumen del Presupuesto
                        <InfoTooltip content={
                           <>
                                <p className='font-bold mb-2'>Genera 3 tipos de documentos:</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li><b>Propuesta:</b> El documento oficial para el cliente. Incluye descripción de servicios y totales.</li>
                                    <li><b>Factura Proforma:</b> Una versión simplificada, ideal para mostrar los detalles de pago.</li>
                                    <li><b>Desglose Interno:</b> Solo para tus ojos. Muestra todos tus costos, la contribución a fijos y tu ganancia real.</li>
                                </ul>
                           </>
                        } />
                    </CardTitle>
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
