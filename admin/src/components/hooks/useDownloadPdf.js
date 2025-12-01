import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const useDownloadPdf = () => {
  const downloadPdf = useCallback(async (ref, filename = 'report.pdf') => {
    if (!ref?.current) return;

    // Capture the element as a canvas
    const canvas = await html2canvas(ref.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    // Standard A4 size in px at 72dpi
    const pdfWidth = 595;
    const pdfHeight = 842;

    // Calculate image dimensions to fit A4
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [pdfWidth, pdfHeight],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  }, []);

  return downloadPdf;
};

export default useDownloadPdf;
