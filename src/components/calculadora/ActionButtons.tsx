'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useQuoteStore } from '@/context/QuoteContext';
import { type FormValues } from '@/app/calculadora/schema';

// ¡INTERFAZ SINCRONIZADA!
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
  getFormData: () => FormValues;
  results: CalculationResults;
}

export function ActionButtons({ getFormData, results }: ActionButtonsProps) {
  const setQuoteData = useQuoteStore((state: any) => state.setQuoteData);

  const handleGenerate = (viewType: 'proposal' | 'proforma' | 'internal') => {
    const formData = getFormData();
    setQuoteData({ formData, results, viewType });
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