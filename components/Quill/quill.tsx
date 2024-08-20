'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import html2pdf from 'html2pdf.js';

const ClientQuill = dynamic(() => import('./ClientQuill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function Quill() {
  const [value, setValue] = useState('');
  const handleChange = (content: string) => {
    setValue(content);
  };

  const generatePDF = () => {
    const content = `
     <style>
      body { font-family: Arial, sans-serif; margin: 30px; line-height: 1.6; }
      h1 { font-size: 24px; color: #333; }
      h2 { font-size: 22px; color: #444; }
      h3 { font-size: 20px; color: #555; }
      h4 { font-size: 18px; color: #666; }
      h5 { font-size: 16px; color: #777; }
      h6 { font-size: 14px; color: #888; }
    </style>
    <div style="width: 210mm; padding: 10mm;">
      ${value}
    </div>
  `;
    const opt = {
      filename: 'quill-content.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, // Adjust scale for better quality
        useCORS: true, // Enable CORS for images
        logging: true, // Enable logging for debugging
        letterRendering: true // Improve the quality of the PDF
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Intelligent page breaks
    };
  
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
  
    html2pdf().from(tempDiv).set(opt).save();
  };

  return (
    <div>
      <ClientQuill value={value} onChange={handleChange} />
      <button className='mt-20' onClick={generatePDF}>Generate PDF</button>
    </div>
  );
}