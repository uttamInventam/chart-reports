import { Device } from '../types/device';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (device: Device, containerRef: React.RefObject<HTMLDivElement | null>) => {
  if (!containerRef.current) {
    console.error("Container ref is not attached.");
    return;
  }

  try {
    // We capture the ref element.
    const canvas = await html2canvas(containerRef.current, {
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate height based on A4 aspect ratio and canvas width
    const canvasRatio = canvas.height / canvas.width;
    const imgHeight = pdfWidth * canvasRatio;

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);

    // Download the PDF
    pdf.save(`${device.name.replace(/\\s+/g, '-')}-Report.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
