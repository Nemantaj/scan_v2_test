# Manual Testing Checklist for `ImeiEntries`

## 1. Initial Rendering

- [P] Component mounts without errors
- [P] `ShellHeader` renders with back button, date range picker, and filter button
- [P] `ShellFooter` renders with search bar and create (+) button
- [P] `VirtualList` renders with loading skeleton initially (`ImeiSkeleton`)
- [P] After data loads, `SectionHeader` displays correct title "IMEI Entries"
- [P] Subtitle shows correct count and date range string

## 2. Data Fetching & Loading States

- [P] Loading skeleton (`ImeiSkeleton`) is displayed while `isPending` is true
- [P] Loading state shows during refetching (`isRefetching`)
- [P] Data loads correctly from `GetOrders` API
- [P] Query key `["orders", dateRangeStr]` triggers refetch when date range changes
- [P] No console errors during data fetching

## 3. Date Range Filtering

- [P] Date range picker opens on click
- [P] Selecting a new date range updates `dateRange` state
- [P] Selecting a different date range triggers a new API call
- [P] Date range persists on page refresh (via `usePersistentDateRange`)
- [P] `dateRangeStr` updates correctly in subtitle
- [P] Empty state shows when no IMEI codes exist for selected date range

## 4. Search Functionality

- [P] Search bar accepts text input
- [P] Typing in search bar filters IMEI codes in real-time
- [P] Search is case-insensitive
- [P] Search matches IMEI, product name, and date
- [P] Clearing search restores all IMEI codes
- [P] Empty state shows "No results found" with search term when no matches
- [P] IMEI count in subtitle updates based on filtered results

## 5. Sorting

- [P] Filter button opens `SheetDrawer` with sort options
- [P] Selecting a sort option updates `sortBy` state
- [P] IMEI entries re-order correctly based on selected sort
- [P] Sort preference persists on page refresh (via `usePersistentSort`)
- [P] Closing drawer without selecting keeps previous sort
- [P] Drawer closes after selecting a sort option

## 6. Virtual List Behavior

- [P] List scrolls smoothly with many IMEI codes (500+)
- [P] Items render correctly as they come into view
- [P] Items unmount correctly as they scroll out of view
- [P] No duplicate key warnings in console
- [P] Correct `height="100dvh"` and `estimateSize={85}` applied

## 7. IMEI Item Interaction

- [P] Each `ImeiItem` renders with correct data (IMEI, product, date)
- [P] Item displays correctly formatted information
- [P] Copy IMEI functionality works (if implemented)

## 8. Navigation

- [P] Back button navigates to `/`
- [P] Create (+) button navigates to `/create`
- [P] Filter button opens sort drawer

## 9. Empty States

- [P] Empty list component renders when no data
- [P] Correct message shows for "No IMEI codes" (no search)
- [P] Correct message shows for "No results found" (with search)
- [P] Description text is contextually correct

## 10. Persistence (Local Storage)

- [P] `imei-entries-sort` key saved to local storage
- [P] `imei-entries-date-range` key saved to local storage
- [P] Values restore correctly on page reload

## 11. Data Processing

- [P] `processImeiEntries` correctly flattens orders to individual IMEI codes
- [P] Each IMEI entry contains parent order and product information
- [P] Filtering works on flattened data
- [P] Sorting works on flattened data

## 12. Edge Cases

- [P] Handle API returning empty array `[]`
- [P] Handle orders with no products
- [P] Handle products with no IMEI codes
- [P] Handle very long IMEI numbers (display truncation)
- [P] Handle rapid search input
- [P] Handle thousands of IMEI codes (performance)
