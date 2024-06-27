import React from "react";
import * as XLSX from "xlsx";

const ExportToExcel = ({ data, headers, fileName }) => {
  const handleExport = () => {
    // Filter data according to the headers
    const filteredData = data.map((item) => {
      let filteredItem = {};
      headers.forEach((header) => {
        if (header === "createdBy") {
          filteredItem[header] = item[header].name;
          filteredItem["manager"] = item[header]?.managers[0]?.name
        } else if (header === "statusDetails") {
          let val = "";

          item[header].map((item) => {
            return filteredItem[item.status] = new Date(item["updatedAt"])?new Date(item["updatedAt"]).toLocaleDateString():"";
          });

          return val;
        } else if(header === "isComplete"){
          filteredItem[header] = item[header]
        } else if(header === "createdAt" || header === "updatedAt" || header === "startDateTime" || header === "endDateTime"  ) {
          filteredItem[header] = new Date(item[header])?new Date(item[header]).toLocaleDateString():"";
        }else{
          filteredItem[header] = item[header]
        }
      });
      return filteredItem;
    });

    // Convert filtered data to a worksheet
    const ws = XLSX.utils.json_to_sheet(filteredData);

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate a binary string representation of the workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Convert the binary string to an octet string
    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    };

    // Create a Blob object from the octet string
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Create a link element and trigger a download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  return (
    <button
      className="bg-green-600 py-2 px-4 text-white rounded"
      onClick={handleExport}
    >
      Download Excel
    </button>
  );
};

export default ExportToExcel;
