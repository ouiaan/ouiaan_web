'use client';

import { useState } from 'react';
import { useQuoteStore } from '@/context/QuoteContext';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js'; // Ahora TypeScript lo encontrará

export function PdfDownloadButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { formData } = useQuoteStore();

  const handleDownloadPdf = async () => {
    if (!formData) return;
    const element = document.getElementById('proposal-container-for-pdf');
    if (!element) return;
    setIsLoading(true);

    try {
      const options = {
        margin: 0,
        filename: `propuesta-${formData.clientName?.toLowerCase().replace(/\s+/g, '-') || 'cliente'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: null },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      await html2pdf().from(element).set(options).save();
    } catch (err) {
      console.error("Error al generar el PDF:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleDownloadPdf} disabled={isLoading || !formData}>
      <Download className="mr-2 h-4 w-4" />
      {isLoading ? 'Generando...' : 'Descargar PDF'}
    </Button>
  );
}