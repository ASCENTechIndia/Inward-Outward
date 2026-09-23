import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Pdf = ({ tableData = [], tableHeader = [] }) => {
  const exportPDF = () => {
    const doc = new jsPDF();
    const rowData = tableData.map((row) => row);
    autoTable(doc, {
      head: [tableHeader],
      body: rowData,
      startY: 20,
      didDrawPage: (data) => {
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        if (pageNumber === 1) {
          doc.setFontSize(14);
          doc.text("Daily Report", 14, 15);
        }
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Page ${pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });
    doc.save("Report.pdf");
  };

  return (
    <button
      onClick={exportPDF}
      className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 hover:cursor-pointer"
    >
      PDF
    </button>
  );
};

export default Pdf;
