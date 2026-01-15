# Manual Testing Checklist for `Customers`

## 1. Initial Rendering

- [ ] Component mounts without errors
- [ ] `ShellHeader` renders with back button and filter button
- [ ] `ShellFooter` renders with search bar and create (+) button
- [ ] `VirtualList` renders with loading skeleton initially (`CustomerSkeleton`)
- [ ] After data loads, `SectionHeader` displays correct title "Customers"
- [ ] Subtitle shows correct count

## 2. Data Fetching & Loading States

- [ ] Loading skeleton (`CustomerSkeleton`) is displayed while `isPending` is true
- [ ] Loading state shows during refetching (`isRefetching`)
- [ ] Data loads correctly from `GetCustomers` API
- [ ] Query key `["customers"]` is correct
- [ ] No console errors during data fetching

## 3. Search Functionality

- [ ] Search bar accepts text input
- [ ] Typing in search bar filters customers in real-time
- [ ] Search is case-insensitive
- [ ] Search matches customer `fullName`
- [ ] Search matches customer `city`
- [ ] Clearing search restores all customers
- [ ] Empty state shows "No results found" with search term when no matches
- [ ] Customer count in subtitle updates based on filtered results

## 4. Sorting

- [ ] Filter button opens `SheetDrawer` with sort options
- [ ] Selecting a sort option updates `sortBy` state
- [ ] Customers re-order correctly based on selected sort
- [ ] Sort direction (asc/desc) works correctly
- [ ] Sort uses `localeCompare` for string comparison
- [ ] Sort preference persists on page refresh (via `usePersistentSort`)
- [ ] Default sort is `fullName` ascending
- [ ] Closing drawer without selecting keeps previous sort

## 5. Virtual List Behavior

- [ ] List scrolls smoothly with many customers (100+)
- [ ] Items render correctly as they come into view
- [ ] Items unmount correctly as they scroll out of view
- [ ] No duplicate key warnings in console
- [ ] Correct `height="100dvh"` applied

## 6. Customer Item Interaction

- [ ] Each `CustomerItem` renders with correct data (name, city, etc.)
- [ ] Clicking a customer navigates to customer details (if applicable)
- [ ] Delete button triggers `handleDeleteClick`

## 7. Delete Functionality

- [ ] Delete button opens `DeleteCustomerDrawer`
- [ ] `selectedCustomer` state is set correctly
- [ ] Cancel closes drawer without deleting
- [ ] Confirm deletes the customer
- [ ] Drawer closes after deletion
- [ ] `selectedCustomer` resets to null after 300ms delay

## 8. Navigation

- [ ] Back button navigates to `/`
- [ ] Create (+) button navigates to `/customers/new`
- [ ] Filter button opens sort drawer

## 9. Empty States

- [ ] Empty list component renders when no data
- [ ] Correct message shows for "No customers" (no search)
- [ ] Correct message shows for "No results found" (with search)
- [ ] Description text is contextually correct
- [ ] "Add one to get started" message shows when no customers

## 10. Persistence (Local Storage)

- [ ] `customers-sort` key saved to local storage
- [ ] Values restore correctly on page reload
- [ ] Default values applied when no stored value

## 11. `processCustomers` Function

- [ ] Filter correctly applies search term
- [ ] Sort correctly applies sortBy field
- [ ] Sort correctly applies sort direction
- [ ] Handle null/undefined field values gracefully
- [ ] Original data array is not mutated (spread operator used)

## 12. Edge Cases

- [ ] Handle API returning empty array `[]`
- [ ] Handle customer with missing `fullName`
- [ ] Handle customer with missing `city`
- [ ] Handle very long customer names (truncation)
- [ ] Handle rapid search input
- [ ] Handle customers with special characters in name
