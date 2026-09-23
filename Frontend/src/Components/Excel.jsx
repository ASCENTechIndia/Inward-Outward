import React from "react";
import * as XLSX from "xlsx";

const Excel = ({ tableData = [], tableHeader = [] }) => {
  const exportExcel = () => {
    const workSheetData = [tableHeader, ...tableData];
    const workSheet = XLSX.utils.aoa_to_sheet(workSheetData);
    const range = XLSX.utils.decode_range(workSheet["!ref"]);
    for (let row = range.s.r + 1; row <= range.e.r; row++) {
      [2, 3].forEach((col) => {
        const cellAddress = { r: row, c: col };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        if (workSheet[cellRef]) {
          workSheet[cellRef].t = "s";
          workSheet[cellRef].v = String(workSheet[cellRef].v); 
        }
      });
    }
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Daily Report");
    XLSX.writeFile(workBook, "report.xlsx");
  };

  return (
    <button
      onClick={exportExcel}
      className="border border-blue-500 text-blue-500 px-4 py-1 rounded hover:bg-blue-50 hover:cursor-pointer"
    >
      Excel
    </button>
  );
};

export default Excel;
