
'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useQuoteStore } from '@/context/QuoteContext';
import Image from 'next/image';

const PdfDownloadButton = dynamic(
  () => import('@/components/calculadora/PdfDownloadButton').then(mod => mod.PdfDownloadButton),
  { ssr: false }
);

const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0);

const QuotePageClient = () => {
  const { formData, results, viewType } = useQuoteStore((state: any) => state);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);
  
  if (!isClient) {
    return <main className="bg-neutral-900 min-h-screen flex items-center justify-center"><p className="text-white">Cargando...</p></main>;
  }

  if (!formData || !results) {
    return (
      <main className="bg-neutral-900 min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold text-white">No hay datos de propuesta</h1>
          <p className="mt-4 text-neutral-400">Por favor, vuelve a la calculadora y genera una nueva propuesta.</p>
        </div>
      </main>
    );
  }
  
  const descriptionEntries = Object.entries(formData.categoryDescriptions || {}).filter(([key, value]) => typeof value === 'string' && value.trim() !== '');
  const documentTitle = viewType === 'proforma' ? 'Factura Proforma' : viewType === 'internal' ? 'Desglose Interno' : 'Propuesta de Servicios';

  // Componente para la tabla de costos internos
  const InternalCostsTable = () => (
    <div className="space-y-8">
        <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
            {/* MANO DE OBRA */}
            <colgroup>
                <col style={{ width: '35%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '15%' }} />
            </colgroup>
            <thead>
                <tr><th colSpan={5} className="text-left text-xl font-headline font-semibold py-4">Mano de Obra</th></tr>
                <tr className="bg-neutral-700/50">
                    <th className="p-2 font-semibold text-left">Descripción</th>
                    <th className="p-2 font-semibold text-right">Horas</th>
                    <th className="p-2 font-semibold text-right">Tarifa</th>
                    <th className="p-2 font-semibold text-left pl-4">Categoría</th>
                    <th className="p-2 font-semibold text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                {formData.laborItems.map((item: any, index: number) => (
                    <tr key={`labor-${index}`} className="border-b border-neutral-700/50">
                        <td className="p-2 text-left">{item.description}</td>
                        <td className="p-2 text-right">{item.hours}</td>
                        <td className="p-2 text-right">{formatCurrency(item.rate)}</td>
                        <td className="p-2 text-left pl-4">{item.category}</td>
                        <td className="p-2 text-right font-mono">{formatCurrency(item.hours * item.rate)}</td>
                    </tr>
                ))}
            </tbody>

            {/* COSTOS VARIABLES */}
            <thead>
                <tr><th colSpan={5} className="text-left text-xl font-headline font-semibold pt-8 pb-4">Costos Variables</th></tr>
                <tr className="bg-neutral-700/50">
                    <th className="p-2 font-semibold text-left">Descripción</th>
                    <th className="p-2 font-semibold text-right">Cantidad</th>
                    <th className="p-2 font-semibold text-right">Costo</th>
                    <th className="p-2 font-semibold text-left pl-4">Categoría</th>
                    <th className="p-2 font-semibold text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                {formData.variableCostItems.map((item: any, index: number) => (
                    <tr key={`variable-${index}`} className="border-b border-neutral-700/50">
                        <td className="p-2 text-left">{item.description}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">{formatCurrency(item.cost)}</td>
                        <td className="p-2 text-left pl-4">{item.category}</td>
                        <td className="p-2 text-right font-mono">{formatCurrency(item.quantity * item.cost)}</td>
                    </tr>
                ))}
            </tbody>
            
            {/* COSTOS FIJOS */}
            <thead>
                <tr><th colSpan={5} className="text-left text-xl font-headline font-semibold pt-8 pb-4">Costos Fijos</th></tr>
                <tr className="bg-neutral-700/50">
                    <th className="p-2 font-semibold text-left">Descripción</th>
                    <th className="p-2 font-semibold text-right">Cantidad</th>
                    <th className="p-2 font-semibold text-right">Costo</th>
                    <th className="p-2 font-semibold text-left pl-4"></th>
                    <th className="p-2 font-semibold text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                {formData.fixedCostItems.map((item: any, index: number) => (
                    <tr key={`fixed-${index}`} className="border-b border-neutral-700/50">
                        <td className="p-2 text-left">{item.description}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">{formatCurrency(item.cost)}</td>
                        <td className="p-2 text-left pl-4"></td>
                        <td className="p-2 text-right font-mono">{formatCurrency(item.quantity * item.cost)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


  return (
    <main className="p-4 sm:p-8 md:p-12 font-sans bg-neutral-900 text-neutral-200 min-h-screen">
      <div className="max-w-4xl mx-auto mb-4 text-right">
        <PdfDownloadButton />
      </div>
      <div id="proposal-container-for-pdf">
        <div className="mx-auto max-w-4xl rounded-lg border border-neutral-700 bg-neutral-800 p-8 md:p-16">
            <header className="flex justify-between items-start pb-8">
                <div className="flex flex-col items-start">
                    {formData.companyLogo && (
                    <div className="mb-4">
                        <Image src={formData.companyLogo} alt="Logo" width={80} height={80} className="object-contain" />
                    </div>
                    )}
                    {formData.companyName && <h1 className="text-xl font-headline font-bold">{formData.companyName}</h1>}
                </div>
                <div className="text-right">
                <h2 className="text-2xl font-headline font-bold">{documentTitle}</h2>
                <div className="mt-2 text-sm">
                    <p><span className="font-semibold text-neutral-400">Fecha:</span> {new Date().toLocaleDateString('es-ES')}</p>
                    <p className="mt-1"><span className="font-semibold text-neutral-400">Propuesta #:</span> {formData.invoiceNumber}</p>
                    <p className="mt-1"><span className="font-semibold text-neutral-400">Cliente:</span> {formData.clientName}</p>
                </div>
                </div>
            </header>

          {viewType === 'internal' ? (
            <section className="py-8">
              <InternalCostsTable />
              <div className="pt-8 mt-8 flex justify-end">
                <div className="w-full max-w-sm space-y-4">
                  <h3 className="text-xl font-headline font-semibold mb-3">Resumen Financiero</h3>
                  <div className="flex justify-between text-sm"><span className="text-neutral-400">Total Mano de Obra</span><span>{formatCurrency(results.totalLabor)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-neutral-400">Total Costos Variables</span><span>{formatCurrency(results.totalVariableCosts)}</span></div>
                  <div className="flex justify-between border-b border-neutral-700 pb-2 text-sm"><span className="text-neutral-400">Total Costos Fijos</span><span>{formatCurrency(formData.fixedCostItems.reduce((acc: number, item: any) => acc + item.quantity * item.cost, 0))}</span></div>
                  <div className="flex justify-between font-semibold"><span className="text-neutral-300">Costo de Producción (Labor + Variables)</span><span>{formatCurrency(results.totalLabor + results.totalVariableCosts)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-neutral-400">Contribución a Fijos ({formData.overheadContributionPercentage}%)</span><span>{formatCurrency(results.overheadContribution)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-neutral-400">Ganancia del Negocio ({formData.profitMarginPercentage}%)</span><span>{formatCurrency(results.profit)}</span></div>
                  <div className="flex justify-between font-bold border-t border-neutral-700 pt-2"><span className="text-white">Precio de Venta (Subtotal)</span><span className="text-lime-400">{formatCurrency(results.subtotal)}</span></div>
                </div>
              </div>
            </section>
          ) : (
            <>
              <section className="py-8">
                <h2 className="text-sm uppercase tracking-widest text-neutral-400">Preparado para</h2>
                <p className="text-xl font-bold text-white mt-1">{formData.clientName}</p>
                <p className="text-neutral-300">{formData.eventType}</p>
              </section>

              <section className="space-y-8 py-8">
                {descriptionEntries.map(([category, description]: [string, any]) => (
                  <div key={category} className="border-b border-neutral-700 pb-8 last:border-b-0">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-headline font-semibold">{category}</h3>
                      <span className="text-xl font-semibold">{formatCurrency(results.categoryTotals[category] || 0)}</span>
                    </div>
                    <div className="max-w-none text-neutral-300">
                      <ul className="list-disc pl-5 space-y-1">{description.split('\n').map((line: string, i: number) => (line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>))}</ul>
                    </div>
                  </div>
                ))}
              </section>

              <section className="pt-8 mt-8 flex justify-end">
                <div className="w-full max-w-xs space-y-4">
                  <div className="flex justify-between"><span className="text-neutral-400">Subtotal</span><span>{formatCurrency(results.subtotal)}</span></div>
                  {results.discountAmount > 0 && <div className="flex justify-between"><span className="text-neutral-400 text-red-400">Descuento</span><span className="text-red-400">-{formatCurrency(results.discountAmount)}</span></div>}
                  {results.vatAmount > 0 && <div className="flex justify-between"><span className="text-neutral-400">IVA ({formData.vatPercentage}%)</span><span>{formatCurrency(results.vatAmount)}</span></div>}
                  <div className="flex justify-between text-2xl font-bold text-lime-400 pt-4 border-t border-neutral-700"><span>Total</span><span>{formatCurrency(results.total)}</span></div>
                </div>
              </section>
            </>
          )}

          <footer className="border-t border-neutral-700 pt-8 mt-12 text-sm text-neutral-400">
             {viewType === 'proforma' && formData.includePaymentInfo && formData.paymentInstructions && (
              <div className="mb-8 text-left"><h4 className="font-bold text-base text-white mb-2">Instrucciones de Pago:</h4><div className="whitespace-pre-wrap text-xs">{formData.paymentInstructions}</div></div>
            )}
             {formData.companyNotes && (
              <div className="mb-8 text-left"><h4 className="font-bold text-base text-white mb-2">Notas Importantes:</h4><ul className="list-disc pl-5 space-y-1">{formData.companyNotes.split('\n').map((line: string, i: number) => (line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>))}</ul></div>
            )}
            <div className="text-center">
              <p>¡Será un honor ser parte de tu historia!</p>
              {formData.companyWebsite && <p className="mt-4">{formData.companyWebsite} | {formData.companyEmail} | {formData.companyPhone}</p>}
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
};

const QuotePage = dynamic(() => Promise.resolve(QuotePageClient), {
  ssr: false,
});

export default QuotePage;
