# Manual Testing Checklist for `ProjectEntries`

## 1. Initial Rendering

- [P] Component mounts without errors
- [P] `ShellHeader` renders with navigation menu, date range picker, and filter button
- [P] `ShellFooter` renders with search bar and create (+) button
- [P] `VirtualList` renders with loading skeleton initially (`EntrySkeleton`)
- [P] After data loads, `SectionHeader` displays correct title "Main Entries"
- [P] Subtitle shows correct count and date range string

## 2. Data Fetching & Loading States

- [P] Loading skeleton (`EntrySkeleton`) is displayed while `isPending` is true
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
- [P] Empty state shows when no entries exist for selected date range

## 4. Search Functionality

- [P] Search bar accepts text input
- [P] Typing in search bar filters entries in real-time
- [P] Search is case-insensitive
- [P] Search matches entry name, date, and IMEI
- [P] Clearing search restores all entries
- [P] Empty state shows "No results found" with search term when no matches
- [P] Entry count in subtitle updates based on filtered results

## 5. Sorting

- [P] Filter button opens `SheetDrawer` with sort options
- [P] Selecting a sort option updates `sortBy` state
- [P] Entries re-order correctly based on selected sort
- [P] Sort preference persists on page refresh (via `usePersistentSort`)
- [P] Closing drawer without selecting keeps previous sort
- [x] Drawer closes after selecting a sort option

## 6. Virtual List Behavior

- [P] List scrolls smoothly with many entries (100+)
- [P] Items render correctly as they come into view
- [P] Items unmount correctly as they scroll out of view
- [P] No duplicate key warnings in console
- [P] Correct `height="100dvh"` applied

## 7. Entry Item Interaction

- [P] Each `EntryItem` renders with correct data (name, date, products)
- [P] Clicking an entry navigates to `/entries/{id}`
- [P] Entry item shows gradient accent bar
- [P] Product list renders correctly within each entry
- [P] Scan badge shows correct total count

## 8. Navigation

- [P] `NavMenu` opens and closes correctly
- [P] Create (+) button navigates to `/create`
- [P] Back navigation works as expected
- [P] Filter button opens sort drawer

## 9. Empty States

- [P] Empty list component renders when no data
- [P] Correct message shows for "No entries" (no search)
- [P] Correct message shows for "No results found" (with search)
- [P] Description text is contextually correct

## 10. Persistence (Local Storage)

- [P] `project-entries-sort` key saved to local storage
- [P] `project-entries-date-range` key saved to local storage
- [P] Values restore correctly on page reload
- [P] Clearing local storage resets to defaults

## 11. Performance & Memoization

- [P] `processedData` only recalculates when `data`, `search`, or `sortBy` change
- [P] `renderEntryItem` callback is stable (no unnecessary re-renders)
- [P] `listHeader` and `listEmptyComponent` are memoized correctly
- [P] Handlers are stable

## 12. Edge Cases

- [P] Handle API returning empty array `[]`
- [P] Handle API returning malformed data gracefully
- [P] Handle very long entry names (truncation)
- [P] Handle entries with no products
- [P] Handle entries with many products (50+)
- [P] Handle rapid date range changes (debouncing)
- [P] Handle rapid search input (no lag)

## 13. Responsive Design

- [P] Layout adapts correctly on mobile viewport
- [P] Header and footer are fixed and accessible
- [P] Virtual list fills available height
- [P] Touch interactions work on mobile

## 14. Accessibility

- [P] Search bar has proper placeholder text
- [P] Buttons are keyboard accessible
- [P] Focus states are visible
- [P] Screen reader announces list updates
