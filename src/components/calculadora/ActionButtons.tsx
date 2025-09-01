
'use client';

import { useQuoteStore } from '@/context/QuoteContext';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { type FormValues } from '@/app/calculadora/schema';

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
  categoryTotals: { [key: string]: number };
}

interface ActionButtonsProps {
  results: CalculationResults;
}

export function ActionButtons({ results }: ActionButtonsProps) {
  const { getValues } = useFormContext<FormValues>();
  const setQuoteData = useQuoteStore((state) => state.setQuoteData);

  const handleGenerate = (viewType: 'proposal' | 'proforma' | 'internal') => {
    // Obtenemos los datos más frescos del formulario justo en el momento del click
    const currentFormData = getValues(); 
    setQuoteData({ formData: currentFormData, results, viewType });
    window.open('/quote', '_blank');
  };

  return (
    <div className="mt-6 space-y-2">
      <Button onClick={() => handleGenerate('proposal')} className="w-full">
        Generar Propuesta
      </Button>
      <Button onClick={() => handleGenerate('proforma')} className="w-full" variant="outline">
        Generar Factura Proforma
      </Button>
      <Button onClick={() => handleGenerate('internal')} className="w-full" variant="outline">
        Generar Desglose Interno
      </Button>
    </div>
  );
}
