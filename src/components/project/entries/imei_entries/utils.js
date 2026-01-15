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

// Parse search query into terms, keeping dates and variants as phrases
const parseSearchQuery = (query) => {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  const searchTerms = [];

  // Match patterns: "DD mon", "DD mon YYYY", or "NNNNN gb/GB"
  const datePattern =
    /(\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)(?:\s+\d{4})?)/gi;
  const variantPattern = /(\d+\s*gb)/gi;

  let processedQuery = lowerQuery;

  // Extract date patterns
  const dates = lowerQuery.match(datePattern);
  if (dates) {
    dates.forEach((date) => {
      searchTerms.push(date.toLowerCase().replace(/\s+/g, " "));
      processedQuery = processedQuery.replace(date, " ");
    });
  }

  // Extract variant patterns (like "512 gb", "128gb")
  const variants = processedQuery.match(variantPattern);
  if (variants) {
    variants.forEach((variant) => {
      searchTerms.push(variant.toLowerCase().replace(/\s+/g, ""));
      processedQuery = processedQuery.replace(variant, " ");
    });
  }

  // Add remaining words
  const remainingWords = processedQuery.split(/\s+/).filter(Boolean);
  searchTerms.push(...remainingWords);

  return searchTerms;
};

// Search filter function for IMEIs - with intelligent phrase detection
export const filterImeisBySearch = (data, query) => {
  if (!query) return data;

  const searchTerms = parseSearchQuery(query);
  if (searchTerms.length === 0) return data;

  return data.filter((item) => {
    // Collect all searchable text
    const searchableTexts = [];

    if (item.codes) searchableTexts.push(item.codes.toLowerCase());
    if (item.name) searchableTexts.push(item.name.toLowerCase());
    if (item.orderName) searchableTexts.push(item.orderName.toLowerCase());
    if (item.details) {
      const details = item.details.toLowerCase();
      searchableTexts.push(details);
      searchableTexts.push(details.replace(/\s+/g, ""));
    }

    searchableTexts.push(moment(item.date).format("DD MMM YYYY").toLowerCase());

    const combinedText = searchableTexts.join(" ");
    const normalizedText = combinedText.replace(/\s+/g, " ");

    return searchTerms.every((term) => {
      if (/^\d+gb$/i.test(term)) {
        return (
          normalizedText.includes(term) ||
          combinedText.replace(/\s/g, "").includes(term)
        );
      }
      return normalizedText.includes(term);
    });
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
