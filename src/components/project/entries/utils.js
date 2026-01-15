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

// Search filter function - flexible matching across all fields
// Supports multi-word queries with intelligent phrase detection
export const filterBySearch = (data, query) => {
  if (!query) return data;

  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return data;

  // Split query into search terms, keeping certain patterns together
  // Patterns: dates (10 jan, 10 jan 2026), variants (512 gb, 128gb)
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

  if (searchTerms.length === 0) return data;

  return data.filter((item) => {
    // Collect all searchable text from entry
    const searchableTexts = [];

    // Entry name (customer name)
    if (item.name) searchableTexts.push(item.name.toLowerCase());

    // Formatted date (keep as phrase)
    searchableTexts.push(moment(item.date).format("DD MMM YYYY").toLowerCase());

    // Products info
    item.products?.forEach((product) => {
      // Product name
      if (product.name) searchableTexts.push(product.name.toLowerCase());

      // Product details/variant (normalize to remove spaces from GB patterns)
      if (product.details) {
        const details = product.details.toLowerCase();
        searchableTexts.push(details);
        // Also add normalized version without spaces (for "512gb" matching "512 GB")
        searchableTexts.push(details.replace(/\s+/g, ""));
      }

      // Product category
      if (product.category)
        searchableTexts.push(product.category.toLowerCase());

      // IMEI codes
      product.codes?.forEach((code) => {
        if (code) searchableTexts.push(code.toString().toLowerCase());
      });
    });

    // Combine all searchable text into one string for flexible matching
    const combinedText = searchableTexts.join(" ");
    // Also create a normalized version without extra spaces
    const normalizedText = combinedText.replace(/\s+/g, " ");

    // Check if ALL search terms are found somewhere in the combined text
    return searchTerms.every((term) => {
      // For variant patterns (like "512gb"), check normalized versions
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
