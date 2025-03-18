import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfGenerator = () => {
  const contentRef = useRef();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);

  const generatePDF = async () => {
    const element = contentRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    
    const pdfBlob = pdf.output("blob");
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    
    
    setPdfBlob(pdfBlob);
    setPdfUrl(pdfBlobUrl);
  };

  const downloadPDF = () => {
    if (pdfBlob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(pdfBlob);
      link.download = "ReactPage.pdf";
      link.click();
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={generatePDF}>Generate PDF</button>
      
      {pdfUrl && <button onClick={downloadPDF} style={{ marginLeft: "10px" }}>Download PDF</button>}

      {/* Content to be converted into PDF */}
      <div ref={contentRef} style={{ padding: 20, background: "#f8f9fa", marginTop: 20 }}>
        <h2>My React Page</h2>
        <p>This is the content that will be converted into a PDF.</p>
      </div>

      {/* PDF Viewer */}
      {pdfUrl && (
        <div style={{ height: "500px", marginTop: 20 }}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer fileUrl={pdfUrl} />
          </Worker>
        </div>
      )}
    </div>
  );
};

export default PdfGenerator;
