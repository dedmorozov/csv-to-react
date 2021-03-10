import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';

export const App = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);

    // eslint-disable-next-line no-console
    console.log(dataStringLines);
    const headers = dataStringLines[0]
      .split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

    const list = [];

    for (let i = 1; i < dataStringLines.length; i += 1) {
      const row = dataStringLines[i]
        .split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

      if (headers && row.length === headers.length) {
        const obj = {};

        for (let j = 0; j < headers.length; j += 1) {
          let cell = row[j];

          if (cell.length > 0) {
            if (cell[0] === '"') {
              cell = cell.substring(1, cell.length - 1);
            }

            if (cell[cell.length - 1] === '"') {
              cell = cell.substring(cell.length - 2, 1);
            }
          }

          if (headers[j]) {
            obj[headers[j]] = cell;
          }
        }

        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // eslint-disable-next-line no-shadow
    const columns = headers.map(header => ({
      name: header,
      selector: header,
    }));

    setData(list);
    setColumns(columns);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // eslint-disable-next-line no-shadow
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });

      processData(data);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
      />

      <DataTable
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      />
    </div>
  );
};
