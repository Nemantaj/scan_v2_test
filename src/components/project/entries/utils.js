import moment from "moment";

// Sorting comparator functions
export const sortComparators = {
  date: (a, b) => new Date(a.date) - new Date(b.date),
  name: (a, b) => (a.name || "").localeCompare(b.name || ""),
  total_scans: (a, b) => {
    const getTotalScans = (item) =>
      item.products?.reduce(
        (sum, product) => sum + (product.codes?.length || 0),
        0
      ) || 0;
    return getTotalScans(a) - getTotalScans(b);
  },
};

// Search filter function
export const filterBySearch = (data, query) => {
  if (!query) return data;

  const lowerQuery = query.toLowerCase();

  return data.filter((item) => {
    // Search in entry name
    if (item.name?.toLowerCase().includes(lowerQuery)) return true;

    // Search in date
    const formattedDate = moment(item.date).format("DD MMM YYYY").toLowerCase();
    if (formattedDate.includes(lowerQuery)) return true;

    // Search in products
    if (
      item.products?.some((product) => {
        if (product.name?.toLowerCase().includes(lowerQuery)) return true;
        if (
          product.codes?.some((code) =>
            code?.toString().toLowerCase().includes(lowerQuery)
          )
        )
          return true;
        return false;
      })
    )
      return true;

    return false;
  });
};

// Process data: filter + sort
export const processEntries = (data, search, sortBy) => {
  const searchQuery = search.trim();

  // Step 1: Filter
  const filtered = filterBySearch(data, searchQuery);

  // Step 2: Sort
  const comparator = sortComparators[sortBy.field] || sortComparators.date;
  const sorted = [...filtered].sort(comparator);

  // Reverse if descending
  if (sortBy.direction === "desc") {
    sorted.reverse();
  }

  return sorted;
};
