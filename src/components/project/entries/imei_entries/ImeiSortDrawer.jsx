import { memo, useCallback } from "react";
import { SegmentedControl, Select, Stack } from "@mantine/core";

// Sort options for IMEI entries
export const IMEI_SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "name", label: "Product Name" },
  { value: "imei", label: "IMEI/Serial" },
  { value: "orderName", label: "Customer Name" },
];

export const DIRECTION_OPTIONS = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

// Memoized Imei Sort Drawer Content
const ImeiSortDrawer = memo(({ sortBy, onSortChange }) => {
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
        data={IMEI_SORT_OPTIONS}
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

ImeiSortDrawer.displayName = "ImeiSortDrawer";

export default ImeiSortDrawer;
