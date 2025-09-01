
'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ProfileForm } from '@/components/calculadora/ProfileForm';
import { ClientForm } from '@/components/calculadora/ClientForm';
import { DescriptionForm } from '@/components/calculadora/DescriptionForm';
import { FinancialsForm } from '@/components/calculadora/FinancialsForm';
import { CostTables } from '@/components/calculadora/CostTables';
import { TotalsForm } from '@/components/calculadora/TotalsForm';
import { SummaryCard } from '@/components/calculadora/SummaryCard';
import { PackageManager } from '@/components/calculadora/PackageManager';
import { finalEstimateSchema, getInitialValues, type FormValues } from './schema';
import { useMemo } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

const calculateCosts = (data: FormValues) => { const totalLabor = data.laborItems.reduce((acc, item) => acc + (item.hours * item.rate), 0); const totalVariableCosts = data.variableCostItems.reduce((acc, item) => acc + (item.quantity * item.cost), 0); const totalFixedCosts = data.fixedCostItems.reduce((acc, item) => acc + (item.quantity * item.cost), 0); const costOfProduction = totalLabor + totalVariableCosts; const categoryTotals: { [key: string]: number } = {}; data.laborItems.forEach(item => { const itemTotal = item.hours * item.rate; categoryTotals[item.category] = (categoryTotals[item.category] || 0) + itemTotal; }); data.variableCostItems.forEach(item => { const itemTotal = item.quantity * item.cost; categoryTotals[item.category] = (categoryTotals[item.category] || 0) + itemTotal; }); const overheadContribution = totalFixedCosts * ((data.overheadContributionPercentage || 0) / 100); const profit = (costOfProduction + overheadContribution) * ((data.profitMarginPercentage || 0) / 100); const initialClientFacingTotal = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0); const managementCategory = "Costos de Estudio y Gestión de Proyecto"; categoryTotals[managementCategory] = (categoryTotals[managementCategory] || 0) + overheadContribution; if (initialClientFacingTotal > 0) { Object.keys(categoryTotals).forEach(category => { const originalCategoryCost = category === managementCategory ? (categoryTotals[category] || 0) - overheadContribution : (categoryTotals[category] || 0); const proportion = originalCategoryCost / initialClientFacingTotal; if (proportion > 0) { categoryTotals[category] += profit * proportion; } }); } else if (overheadContribution > 0 || profit > 0) { categoryTotals[managementCategory] = (categoryTotals[managementCategory] || 0) + profit; } const subtotal = initialClientFacingTotal + overheadContribution + profit; const discountAmount = subtotal * ((data.discountPercentage || 0) / 100); const subtotalAfterDiscount = subtotal - discountAmount; const vatAmount = subtotalAfterDiscount * ((data.vatPercentage || 0) / 100); const total = subtotalAfterDiscount + vatAmount; const downPayment = total * ((data.downPaymentPercentage || 0) / 100); const remainingBalance = total - downPayment; return { totalLabor, totalVariableCosts, overheadContribution, profit, subtotal, discountAmount, vatAmount, total, downPayment, remainingBalance, categoryTotals }; };

export default function CalculadoraPage() {
  const methods = useForm<FormValues>({ resolver: zodResolver(finalEstimateSchema), defaultValues: getInitialValues(), mode: 'onChange' });
  const { watch, reset } = methods;
  const watchedValues = watch();
  const results = useMemo(() => calculateCosts(watchedValues as FormValues), [watchedValues]);
  const handleReset = () => { reset(getInitialValues()); };
  const handleLoadPackage = (data: FormValues) => { reset(data); };

  return (
    <TooltipProvider>
      <FormProvider {...methods}>
        <main className="container mx-auto px-4 py-24 sm:py-32">
          <SectionTitle>Calculadora de Presupuestos</SectionTitle>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Una herramienta para creativos. Define tus costos, establece tu ganancia y genera propuestas profesionales en minutos.</p>
          <div className="my-12"><PackageManager onReset={handleReset} onLoadPackage={handleLoadPackage} /></div>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2"><div className="space-y-8"><ProfileForm /><ClientForm /><DescriptionForm /><FinancialsForm /><CostTables /><TotalsForm /></div></div>
              <div className="lg:col-span-1"><SummaryCard results={results} /></div>
            </div>
          </form>
        </main>
      </FormProvider>
    </TooltipProvider>
  );
}
