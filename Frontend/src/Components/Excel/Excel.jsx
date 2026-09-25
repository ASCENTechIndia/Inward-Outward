import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

const Excel = ({
  tableHeader = [],
  tableData = [],
  fileName = "report.xlsx",
  sheetName = "Report",
  title = "", // Optional title row above headers
}) => {
  const handleDownload = () => {
    const worksheetData = [];

    // Optional title row (merged across all columns)
    if (title) {
      worksheetData.push([title]);
      worksheetData.push([]); // empty spacer row
    }

    // Header + data
    worksheetData.push(tableHeader);
    worksheetData.push(...tableData);

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Auto-size column widths based on content
    const colWidths = tableHeader.map((header, colIdx) => {
      const headerLen = String(header || "").length;
      const maxDataLen = tableData.reduce((max, row) => {
        const cellLen = String(row[colIdx] ?? "").length;
        return Math.max(max, cellLen);
      }, 0);
      return { wch: Math.min(Math.max(headerLen, maxDataLen) + 2, 40) };
    });
    worksheet["!cols"] = colWidths;

    // ❌ NO autofilter (removed — user doesn't want dropdown icons)
    // ❌ NO freeze rows

    // Merge title cell across all columns if title exists
    if (title && tableHeader.length > 0) {
      worksheet["!merges"] = [
        {
          s: { r: 0, c: 0 },
          e: { r: 0, c: tableHeader.length - 1 },
        },
      ];
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, fileName);
  };

  return (
    <button
      onClick={handleDownload}
      type="button"
      disabled={tableData.length === 0}
      className="bg-green-600 flex items-center gap-2 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md hover:cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
    >
      <Download className="w-4 h-4" />
      Export to Excel
    </button>
  );
};

export default Excel;
