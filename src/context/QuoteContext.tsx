import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type FormValues } from '@/app/calculadora/schema';

// Definimos esta interfaz aquí para que esté completa
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

interface QuoteState {
  formData: FormValues | null;
  results: CalculationResults | null;
  viewType: 'proposal' | 'proforma' | 'internal';
  setQuoteData: (data: { formData: FormValues; results: CalculationResults; viewType: 'proposal' | 'proforma' | 'internal' }) => void;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set) => ({
      formData: null,
      results: null,
      viewType: 'proposal',
      setQuoteData: (data) => set(data), // Simplificado y con tipos correctos
    }),
    {
      name: 'quote-storage',
    }
  )
);