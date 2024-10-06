import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MdSimCardDownload } from 'react-icons/md';

const DownloadExcel = ({ jsonData, headers, fileName = "data" }) => {
  // Function to export data to Excel
  const exportToExcel = () => {
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Filter the JSON data based on the selected headers
    const filteredData = jsonData.map(item =>
      headers.reduce((obj, header) => {
        obj[header] = item[header];
        return obj;
      }, {})
    );

    // Convert filtered data to worksheet
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Write workbook and create a Blob
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Save file
    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={exportToExcel}
        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md flex justify-center items-center gap-3 hover:bg-green-500"
      >
       <MdSimCardDownload/> Export Excel
      </button>
    </div>
  );
};

export default DownloadExcel;
