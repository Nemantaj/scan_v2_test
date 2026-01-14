import moment from "moment";

// Flatten data to individual products/models
export const flattenModelData = (data) => {
  const flattened = [];
  const len = (data || []).length;

  for (let i = 0; i < len; i++) {
    const doc = data[i];
    const products = doc.products || [];
    const pLen = products.length;

    for (let j = 0; j < pLen; j++) {
      const prod = products[j];
      flattened.push({
        productName: prod.name,
        details: prod.details,
        codes: prod.codes,
        price: prod.price,
        date: doc.date,
        _id: prod._id,
        category: prod.category,
        orderName: doc.name,
        parentId: doc._id,
      });
    }
  }

  return flattened;
};

// Sorting comparator functions for Models
export const modelSortComparators = {
  date: (a, b) => new Date(a.date) - new Date(b.date),
  name: (a, b) => (a.productName || "").localeCompare(b.productName || ""),
  price: (a, b) => (a.price || 0) - (b.price || 0),
  orderName: (a, b) => (a.orderName || "").localeCompare(b.orderName || ""),
  category: (a, b) => (a.category || "").localeCompare(b.category || ""),
};

// Search filter function for Models
export const filterModelsBySearch = (data, query) => {
  if (!query) return data;

  const lowerQuery = query.toLowerCase().trim();

  return data.filter((item) => {
    if (item.productName?.toLowerCase().includes(lowerQuery)) return true;
    if (item.details?.toLowerCase().includes(lowerQuery)) return true;
    if (item.orderName?.toLowerCase().includes(lowerQuery)) return true;
    if (item.category?.toLowerCase().includes(lowerQuery)) return true;

    const formattedDate = moment(item.date).format("DD MMM YYYY").toLowerCase();
    if (formattedDate.includes(lowerQuery)) return true;

    // Search in codes
    if (item.codes?.some((code) => code?.toLowerCase().includes(lowerQuery)))
      return true;

    return false;
  });
};

// Process data: flatten + filter + sort
export const processModelEntries = (data, search, sortBy) => {
  // Step 1: Flatten
  const flattened = flattenModelData(data);

  // Step 2: Filter
  const filtered = filterModelsBySearch(flattened, search);

  // Step 3: Sort
  const comparator =
    modelSortComparators[sortBy.field] || modelSortComparators.date;
  const sorted = [...filtered].sort(comparator);

  // Reverse if descending
  if (sortBy.direction === "desc") {
    sorted.reverse();
  }

  return sorted;
};
