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
          <h1 className="text-2xl font-bold text-white">No hay datos</h1>
          <p className="mt-4 text-neutral-400">Vuelve a la calculadora y genera una propuesta.</p>
        </div>
      </main>
    );
  }
  
  const descriptionEntries = Object.entries(formData.categoryDescriptions || {}).filter(([key, value]) => typeof value === 'string' && value.trim() !== '');
  const documentTitle = viewType === 'proforma' ? 'Factura Proforma' : viewType === 'internal' ? 'Desglose Interno' : 'Propuesta de Servicios';

  return (
    <main className="p-4 sm:p-8 md:p-12 font-sans bg-neutral-900 text-neutral-200 min-h-screen">
      <div className="max-w-4xl mx-auto mb-4 text-right">
        <PdfDownloadButton />
      </div>
      <div id="proposal-container-for-pdf">
        <div className="mx-auto max-w-4xl rounded-lg border border-neutral-700 bg-neutral-800 p-8 md:p-16">
          <header className="flex justify-between items-start pb-8">
            <div className="flex items-center gap-4">
              {formData.companyLogo && (
                <Image src={formData.companyLogo} alt="Logo" width={80} height={80} className="object-contain" />
              )}
              <div>
                <h1 className="text-4xl font-headline font-bold">{formData.companyName}</h1>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-headline font-bold">{documentTitle}</h2>
              <div className="mt-2 text-sm">
                <p><span className="font-semibold text-neutral-400">Fecha:</span> {new Date().toLocaleDateString('es-ES')}</p>
                <p className="mt-1"><span className="font-semibold text-neutral-400">Propuesta #:</span> {formData.invoiceNumber}</p>
              </div>
            </div>
          </header>

          <section className="py-8 border-t border-neutral-700">
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
              <div className="flex justify-between"><span className="text-neutral-400">Descuento</span><span className="text-red-400">-{formatCurrency(results.discountAmount)}</span></div>
              <div className="flex justify-between"><span className="text-neutral-400">IVA ({formData.vatPercentage}%)</span><span>{formatCurrency(results.vatAmount)}</span></div>
              <div className="flex justify-between text-2xl font-bold text-lime-400 pt-4 border-t border-neutral-700"><span>Total</span><span>{formatCurrency(results.total)}</span></div>
            </div>
          </section>
          
          <footer className="border-t border-neutral-700 pt-8 mt-12 text-sm text-neutral-400">
             {viewType === 'proforma' && formData.includePaymentInfo && formData.paymentInstructions && (
              <div className="mb-8 text-left"><h4 className="font-bold text-base text-white mb-2">Instrucciones de Pago:</h4><div className="whitespace-pre-wrap text-xs">{formData.paymentInstructions}</div></div>
            )}
             {formData.companyNotes && (
              <div className="mb-8 text-left"><h4 className="font-bold text-base text-white mb-2">Notas Importantes:</h4><ul className="list-disc pl-5 space-y-1">{formData.companyNotes.split('\n').map((line: string, i: number) => (line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>))}</ul></div>
            )}
            <div className="text-center">
              <p>¡Será un honor ser parte de tu historia!</p>
              <p className="mt-4">{formData.companyWebsite} | {formData.companyEmail} | {formData.companyPhone}</p>
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
