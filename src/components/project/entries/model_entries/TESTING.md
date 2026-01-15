# Manual Testing Checklist for `ModelEntries`

## 1. Initial Rendering

- [P] Component mounts without errors
- [P] `ShellHeader` renders with back button, date range picker, and filter button
- [P] `ShellFooter` renders with search bar and two export buttons (Summary & Detailed)
- [P] `VirtualList` renders with loading skeleton initially (`ModelSkeleton`)
- [P] After data loads, `SectionHeader` displays correct title "By Product Entries"
- [P] Subtitle shows correct count and date range string

## 2. Data Fetching & Loading States

- [P] Loading skeleton (`ModelSkeleton`) is displayed while `isPending` is true
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
- [P] Empty state shows when no models exist for selected date range

## 4. Search Functionality

- [P] Search bar accepts text input
- [P] Typing in search bar filters models in real-time
- [P] Search is case-insensitive
- [P] Search matches model name, details
- [P] Clearing search restores all models
- [P] Empty state shows "No results found" with search term when no matches
- [P] Model count in subtitle updates based on filtered results

## 5. Sorting

- [P] Filter button opens `SheetDrawer` with sort options
- [P] Selecting a sort option updates `sortBy` state
- [P] Models re-order correctly based on selected sort
- [P] Sort preference persists on page refresh (via `usePersistentSort`)
- [P] Closing drawer without selecting keeps previous sort
- [P] Drawer closes after selecting a sort option

## 6. Virtual List Behavior

- [P] List scrolls smoothly with many models (100+)
- [P] Items render correctly as they come into view
- [P] Items unmount correctly as they scroll out of view
- [P] No duplicate key warnings in console
- [P] Correct `height="100dvh"` and `estimateSize={96}` applied

## 7. Model Item Interaction

- [P] Each `ModelItem` renders with correct data
- [P] Clicking delete opens `DeleteConfirmDrawer`
- [P] Item shows gradient accent bar
- [P] IMEI count displays correctly

## 8. Delete Functionality

- [P] Delete button opens confirmation drawer
- [P] `selectedItem` state is set correctly
- [P] Cancel closes drawer without deleting
- [P] Confirm deletes the item
- [P] Drawer closes after deletion
- [P] `selectedItem` resets to null after closing

## 9. Export Functionality

- [P] Summary export button (red) triggers `exportSummary`
- [P] Detailed export button (green) triggers `exportDetailed`
- [P] Summary export contains correct fields (Date, Name, Product, Details, Price, IMEIs, IMEIDetail)
- [P] Detailed export contains correct fields (Date, Name, Product, Details, Price, IMEI)
- [P] `flattenedByImei` correctly flattens data by individual IMEI
- [P] Excel files download with correct filenames

## 10. Navigation

- [P] Back button navigates to `/`
- [P] Filter button opens sort drawer

## 11. Empty States

- [P] Empty list component renders when no data
- [P] Correct message shows for "No models" (no search)
- [P] Correct message shows for "No results found" (with search)

## 12. Persistence (Local Storage)

- [P] `model-entries-sort` key saved to local storage
- [P] `model-entries-date-range` key saved to local storage
- [P] Values restore correctly on page reload

## 13. Edge Cases

- [P] Handle API returning empty array `[]`
- [P] Handle models with no codes (no IMEIs)
- [P] Handle models with many codes (100+)
- [P] Handle very long product names (truncation)
- [P] Handle rapid search input
