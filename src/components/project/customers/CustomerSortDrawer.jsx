import { memo, useCallback } from "react";
import { SegmentedControl, Select, Stack } from "@mantine/core";

// Sort field options for customers
export const CUSTOMER_SORT_OPTIONS = [
  { value: "fullName", label: "Name" },
  { value: "city", label: "City" },
];

export const DIRECTION_OPTIONS = [
  { value: "asc", label: "A → Z" },
  { value: "desc", label: "Z → A" },
];

// Memoized Sort Drawer Content
const CustomerSortDrawer = memo(({ sortBy, onSortChange }) => {
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
        data={CUSTOMER_SORT_OPTIONS}
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

CustomerSortDrawer.displayName = "CustomerSortDrawer";

export default CustomerSortDrawer;
