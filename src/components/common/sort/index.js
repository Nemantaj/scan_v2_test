import moment from "moment";

/**
 * Utility: Safely get nested value from object
 * Supports:
 * - Simple paths: "foo.bar"
 * - Array wildcards: "items.[].name" -> returns array of names
 * - Primitive arrays: "tags.[]" -> returns array of tags
 */
export function getValue(obj, path) {
  if (!obj || !path) return undefined;

  const parts = path.split(".");
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const key = parts[i];

    if (current === undefined || current === null) return undefined;

    if (key === "[]") {
      // Array wildcard found
      if (!Array.isArray(current)) return undefined;

      // If this is the last part ("tags.[]"), return the array itself
      if (i === parts.length - 1) return current;

      // Otherwise, map over the array and continue resolving the rest of the path for each item
      const restPath = parts.slice(i + 1).join(".");
      // Flatten the results
      const results = current.map((item) => getValue(item, restPath));
      // Remove undefineds/nulls and flatten
      return results.flat().filter((val) => val !== undefined && val !== null);
    }

    current = current[key];
  }

  return current;
}

/**
 * Normalize values for comparison
 */
function normalizeValue(val) {
  if (val == null) return val;

  // Check valid date
  if (moment(val, moment.ISO_8601, true).isValid() || val instanceof Date) {
    return moment(val).valueOf();
  }

  // Check number (but not empty string/boolean treated as number)
  if (!isNaN(val) && val !== "" && typeof val !== "boolean") {
    return Number(val);
  }

  // String fallback
  return String(val).toLowerCase();
}

/**
 * Check if a value (or any value in an array) matches the filter/search criteria
 */
function checkMatch(
  itemValue,
  criteria,
  { isDate = false, dateFormat = "DD MMM YYYY", strict = false } = {}
) {
  // Normalize criteria always
  const lowerCriteria = String(criteria).toLowerCase();

  // Handle array of values (from getValue with wildcard)
  if (Array.isArray(itemValue)) {
    return itemValue.some((val) =>
      checkMatch(val, criteria, { isDate, dateFormat, strict })
    );
  }

  if (itemValue == null) return false;

  // Date Handling
  if (isDate) {
    const m = moment(itemValue);
    if (!m.isValid()) return false;
    // Compare formatted date string
    return m.format(dateFormat).toLowerCase().includes(lowerCriteria);
  }

  const strVal = String(itemValue).toLowerCase();

  if (strict) {
    return strVal === lowerCriteria;
  }

  return strVal.includes(lowerCriteria);
}

/**
 * Universal Sort & Search
 *
 * @param {Array} arr - Data array
 * @param {Object} params - Current state of filters/sort { sortBy, asc, ...filters }
 * @param {string} search - Global search string
 * @param {Object} config - Configuration
 * @param {Array} config.searchKeys - Keys to search on global search e.g. ["name", "category.name"]
 * @param {Object} config.filterConfig - definitions for specific filters, e.g. { category: { match: 'exact' }, date: { type: 'date' } }
 * @param {string} config.dateFormat - Global date format preference (default: DD MMM YYYY)
 */
export default function sortAndSearch(
  arr,
  params = {},
  search = "",
  config = {}
) {
  if (!arr) return [];
  let result = [...arr];

  const {
    searchKeys = ["name"],
    filterConfig = {},
    dateFormat = "DD MMM YYYY",
  } = config;

  // 1. GLOBAL SEARCH
  if (search) {
    const lowerSearch = search.toLowerCase();
    result = result.filter((item) => {
      // Check provided keys
      return searchKeys.some((key) => {
        const val = getValue(item, key);
        // Auto-detect date for search? For now assume search is string unless specific
        // But prompt used examples like date search.
        // We'll treat search generically as "includes string" or "includes partial formatted date"

        // If it looks like a date/timestamp, try formatting it to see if it matches query?
        // It's safer to just rely on string matching unless explicitly defined, but for "smart" search:
        if (moment(val, moment.ISO_8601).isValid() && typeof val !== "number") {
          if (
            moment(val).format(dateFormat).toLowerCase().includes(lowerSearch)
          )
            return true;
        }

        return checkMatch(val, search, { strict: false });
      });
    });
  }

  // 2. SPECIFIC FILTERS
  // separate sort params from filter params
  const { sortBy, asc, ...filters } = params;

  Object.keys(filters).forEach((key) => {
    const filterVal = filters[key];

    // Skip empty/all/null
    if (
      filterVal === "" ||
      filterVal === null ||
      filterVal === undefined ||
      filterVal === "all"
    ) {
      return;
    }

    // Is this a boolean toggle? (e.g. "isActive": true/false)
    // If it's a switch for "only active", we only filter if true.
    // If value is boolean false, usually means "don't filter" or "off", UNLESS explicitly checking for false status.
    // We assume common pattern: if key exists in filterConfig, follow that.

    // Default behavior
    const def = filterConfig[key] || {}; // { type: 'date', match: 'exact', key: 'actualKeyIfNeeded' }
    const targetKey = def.key || key; // Allow mapping filter 'category' to data key 'category.name'
    const isDate =
      def.type === "date" ||
      (moment(filterVal, dateFormat, true).isValid() &&
        typeof filterVal === "string");
    const isStrict =
      def.type === "select" ||
      def.match === "exact" ||
      typeof filterVal === "boolean";

    // Special case for boolean switches (Show Active Only) which usually mean "must be true"
    if (typeof filterVal === "boolean" && !filterVal) {
      // usually 'false' in a switch "Show Active" means don't filter.
      // If we really want to filter for false values, we'd need specific config.
      // Assuming "switch" UI behavior where false = ignore filter.
      return;
    }

    result = result.filter((item) => {
      const itemVal = getValue(item, targetKey);

      // If select/enum, usually exact match
      return checkMatch(itemVal, filterVal, {
        isDate,
        dateFormat,
        strict: isStrict,
      });
    });
  });

  // 3. SORTING
  if (sortBy) {
    const isAsc = asc === "yes" || asc === true || asc === "asc";

    result.sort((a, b) => {
      // Support nested keys for sorting too
      let valA = getValue(a, sortBy);
      let valB = getValue(b, sortBy);

      // If array, take first (arbitrary consistent rule)
      if (Array.isArray(valA)) valA = valA[0];
      if (Array.isArray(valB)) valB = valB[0];

      const normA = normalizeValue(valA);
      const normB = normalizeValue(valB);

      if (normA === normB) return 0;
      if (normA == null) return 1;
      if (normB == null) return -1;

      if (normA < normB) return isAsc ? -1 : 1;
      if (normA > normB) return isAsc ? 1 : -1;
      return 0;
    });
  }

  return result;
}
