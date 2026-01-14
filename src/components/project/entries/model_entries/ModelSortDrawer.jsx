import { memo, useCallback } from "react";
import { SegmentedControl, Select, Stack } from "@mantine/core";

// Sort options for model entries
export const MODEL_SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "name", label: "Product Name" },
  { value: "price", label: "Price" },
  { value: "orderName", label: "Customer Name" },
  { value: "category", label: "Category" },
];

export const DIRECTION_OPTIONS = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

// Memoized Model Sort Drawer Content
const ModelSortDrawer = memo(({ sortBy, onSortChange }) => {
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
        data={MODEL_SORT_OPTIONS}
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

ModelSortDrawer.displayName = "ModelSortDrawer";

export default ModelSortDrawer;
