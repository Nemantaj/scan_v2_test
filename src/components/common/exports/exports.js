import useExport from "./hooks/useExports";
import moment from "moment";

function checkCondition(fieldValue, condition, value) {
  switch (condition) {
    case "eq":
      return fieldValue === value;
    case "ne":
      return fieldValue !== value;
    case "lt":
      return fieldValue < value;
    case "lte":
      return fieldValue <= value;
    case "gt":
      return fieldValue > value;
    case "gte":
      return fieldValue >= value;
    default:
      throw new Error(`Unsupported condition: ${condition}`);
  }
}

function mapObjectKeys(doc, keysArray1, keysArray2) {
  return keysArray1.reduce((result, key, index) => {
    const keyMapping = keysArray2[index];

    if (Array.isArray(keyMapping)) {
      for (let mapping of keyMapping) {
        const {
          field,
          value,
          condition,
          valueField,
          default: defaultValue,
        } = mapping;
        if (checkCondition(doc[field], condition, value)) {
          if (valueField.includes(".")) {
            let [field, field2] = valueField.split(".");
            result[key] = doc[field][field2];
            return result;
          }

          result[key] =
            doc[valueField] && doc[valueField] !== ""
              ? doc[valueField]
              : defaultValue;
          return result;
        }
      }
      result[key] = keyMapping[keyMapping.length - 1].default;
      return result;
    }

    if (typeof keyMapping === "object") {
      const {
        field,
        value,
        condition,
        valueField,
        default: defaultValue,
      } = keyMapping;
      result[key] = checkCondition(doc[field], condition, value)
        ? doc[valueField]
        : defaultValue;
      return result;
    }

    if (keyMapping.includes("|")) {
      let [field, field2] = keyMapping.split("|");
      result[key] = doc[field]
        ? doc[field].map((d) => (field2 ? d[field2] : d)).join(", ")
        : "";
      return result;
    }

    if (keyMapping.includes("_F")) {
      let [field] = keyMapping.split("_F");
      result[key] = doc[field] ? moment(doc[field]).format("DD/MM/YYYY") : "";
      return result;
    }

    if (keyMapping.includes(".")) {
      let [field, field2] = keyMapping.split(".");
      result[key] = doc[field][field2];
      return result;
    }

    if (keyMapping.includes("_L")) {
      let [field] = keyMapping.split("_L");
      result[key] = Array.isArray(doc[field]) ? doc[field].length : 0;
      return result;
    }

    result[key] = doc[keyMapping];
    return result;
  }, {});
}

function getValuesFromDoc(doc, keysArray) {
  return keysArray.map((key) => {
    if (Array.isArray(key)) {
      for (let mapping of key) {
        const {
          field,
          value,
          condition,
          valueField,
          default: defaultValue,
        } = mapping;
        if (checkCondition(doc[field], condition, value)) {
          if (valueField.includes(".")) {
            let [field, field2] = valueField.split(".");
            return doc[field][field2];
          }

          return doc[valueField] && doc[valueField] !== ""
            ? doc[valueField]
            : defaultValue;
        }
      }
      return key[key.length - 1].default;
    }

    if (typeof key === "object") {
      const {
        field,
        value,
        condition,
        valueField,
        default: defaultValue,
      } = key;
      return checkCondition(doc[field], condition, value)
        ? doc[valueField]
        : defaultValue;
    }

    if (key.includes("|")) {
      let [field, field2] = key.split("|");
      return doc[field]
        ? doc[field].map((d) => (field2 ? d[field2] : d)).join(", ")
        : "";
    }

    if (key.includes("_F")) {
      let [field] = key.split("_F");
      return doc[field] ? moment(doc[field]).format("DD/MM/YYYY") : "";
    }

    if (key.includes(".")) {
      let [field, field2] = key.split(".");
      return doc[field] ? doc[field][field2] : "";
    }

    if (key.includes("_L")) {
      let [field] = key.split("_L");
      return Array.isArray(doc[field]) ? doc[field].length : 0;
    }

    return doc[key];
  });
}

export const useExportComponent = ({
  list,
  sortField,
  title,
  fields1,
  fields2,
  pdfSize,
}) => {
  const { exportExcel, exportPdf } = useExport({
    list: list,
    sort: sortField,
    title: title,
    fields: (doc) => mapObjectKeys(doc, fields1, fields2),
    pdfHeaders: fields1,
    pdfSize,
    fieldsPdf: (doc) => getValuesFromDoc(doc, fields2),
  });

  return { exportExcel, exportPdf };
};
