import moment from "moment";

// Flatten data to individual IMEIs
export const flattenImeiData = (data) => {
  const flattened = [];
  const len = data.length;

  for (let i = 0; i < len; i++) {
    const doc = data[i];
    const products = doc.products || [];
    const pLen = products.length;

    for (let j = 0; j < pLen; j++) {
      const subDoc = products[j];
      const codes = subDoc.codes || [];
      const cLen = codes.length;

      for (let k = 0; k < cLen; k++) {
        flattened.push({
          ...subDoc,
          codes: codes[k],
          date: doc.date,
          orderName: doc.name,
          orderId: doc._id,
        });
      }
    }
  }

  return flattened;
};

// Sorting comparator functions for IMEIs
export const imeiSortComparators = {
  date: (a, b) => new Date(a.date) - new Date(b.date),
  name: (a, b) => (a.name || "").localeCompare(b.name || ""),
  imei: (a, b) => (a.codes || "").localeCompare(b.codes || ""),
  orderName: (a, b) => (a.orderName || "").localeCompare(b.orderName || ""),
};

// Search filter function for IMEIs
export const filterImeisBySearch = (data, query) => {
  if (!query) return data;

  const lowerQuery = query.toLowerCase().trim();

  return data.filter((item) => {
    if (item.codes?.toLowerCase().includes(lowerQuery)) return true;
    if (item.name?.toLowerCase().includes(lowerQuery)) return true;
    if (item.orderName?.toLowerCase().includes(lowerQuery)) return true;

    const formattedDate = moment(item.date).format("DD MMM YYYY").toLowerCase();
    if (formattedDate.includes(lowerQuery)) return true;

    return false;
  });
};

// Process data: flatten + filter + sort
export const processImeiEntries = (data, search, sortBy) => {
  // Step 1: Flatten
  const flattened = flattenImeiData(data);

  // Step 2: Filter
  const filtered = filterImeisBySearch(flattened, search);

  // Step 3: Sort
  const comparator =
    imeiSortComparators[sortBy.field] || imeiSortComparators.date;
  const sorted = [...filtered].sort(comparator);

  // Reverse if descending
  if (sortBy.direction === "desc") {
    sorted.reverse();
  }

  return sorted;
};
