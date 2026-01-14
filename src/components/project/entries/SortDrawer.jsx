import { memo, useCallback } from "react";
import { SegmentedControl, Select, Stack } from "@mantine/core";

// Sort field options
export const SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
  { value: "total_scans", label: "Total Scans" },
];

export const DIRECTION_OPTIONS = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

// Memoized Sort Drawer Content
const SortDrawerContent = memo(({ sortBy, onSortChange }) => {
  const handleFieldChange = useCallback(
    (value) => {
      onSortChange({ field: value, direction: sortBy.direction });
    },
    [sortBy.direction, onSortChange]
  );

  const handleDirectionChange = useCallback(
    (value) => {
      onSortChange({ field: sortBy.field, direction: value });
    },
    [sortBy.field, onSortChange]
  );

  return (
    <Stack gap={16}>
      <Select
        placeholder="Select sort by"
        size="md"
        data={SORT_OPTIONS}
        value={sortBy.field}
        onChange={handleFieldChange}
        comboboxProps={{ withinPortal: false }}
      />
      <SegmentedControl
        size="md"
        value={sortBy.direction}
        onChange={handleDirectionChange}
        data={DIRECTION_OPTIONS}
      />
    </Stack>
  );
});

SortDrawerContent.displayName = "SortDrawerContent";

export default SortDrawerContent;
