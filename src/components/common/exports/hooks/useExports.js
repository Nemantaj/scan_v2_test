import * as Xlsx from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment from "moment";

function sortByField(arr, field, fieldType) {
  return arr.sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];

    if (fieldType === "string") {
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    } else if (fieldType === "number") {
      return Number(valueA) - Number(valueB);
    } else if (fieldType === "date") {
      return new Date(valueA) - new Date(valueB);
    } else {
      throw new Error("Unsupported field type");
    }
  });
}

const useExport = ({
  list,
  title,
  sort,
  fields,
  pdfSize,
  pdfHeaders,
  fieldsPdf,
}) => {
  const exportExcel = () => {
    let data = list.map((doc) => {
      return fields(doc);
    });

    data = sortByField(data, sort.field, sort.fieldType);

    const workSheet = Xlsx.utils.json_to_sheet(data);
    const workBook = Xlsx.utils.book_new();
    Xlsx.utils.book_append_sheet(workBook, workSheet, title);
    Xlsx.writeFile(workBook, `${title}-${moment().format("DD-MMM-YYYY")}.xlsx`);
  };

  const exportPdf = () => {
    const unit = "pt";
    const size = pdfSize;
    const orientation = "landscape";
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const headers = [pdfHeaders];

    let data = sortByField([...list], sort.field, sort.fieldType);

    data = data.map((item) => {
      return fieldsPdf(item);
    });

    doc.text(title, marginLeft, 40);
    autoTable(doc, { startY: 50, head: headers, body: data });
    doc.save(`${title}-${moment().format("DD-MMM-YYYY")}.pdf`);
  };

  return { exportExcel, exportPdf };
};

export default useExport;
