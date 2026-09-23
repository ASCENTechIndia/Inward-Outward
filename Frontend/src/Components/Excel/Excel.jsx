import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

const Excel = ({ tableHeader, tableData, fileName = "table.xlsx" }) => {
  const handleDownload = () => {
    const worksheetData = [tableHeader, ...tableData];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

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
      className="bg-green-600 flex items-center gap-2 hover:bg-green-700 text-white px-4 py-2 rounded-md hover:cursor-pointer"
    >
      <Download className="w-4 h-4" />
      Export to Excel
    </button>
  );
};

export default Excel;
