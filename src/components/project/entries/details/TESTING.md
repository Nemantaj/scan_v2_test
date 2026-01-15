# Manual Testing Checklist for `EntryDetails`

## Test Results Summary

**Tested on:** 2026-01-15

![Entry Details Page](file:///C:/Users/ASUS/.gemini/antigravity/brain/428a9b80-f93e-47e6-9ea2-aaf66a28353c/entry_details_screenshot.png)

---

## 1. Initial Rendering

- [P] Component mounts without errors
- [P] `ShellHeader` renders with back button and edit button
- [P] Loading skeleton (`EntryDetailsSkeleton`) displays while fetching data
- [P] After data loads, `SectionHeader` displays entry name as title
- [P] Subtitle shows formatted date and total scan count

## 2. Data Fetching & Loading States

- [P] Loading skeleton is displayed while `isPending` is true
- [P] Data loads correctly from `GetSingleOrder` API with correct `id`
- [P] Query key `["orders", id]` is correct
- [P] Query is disabled when `id` is falsy (`enabled: !!id`)
- [P] No console errors during data fetching

## 3. Error Handling

- [ ] Error alert displays when `isError` is true
- [ ] Error message shows correct error text
- [ ] Error fallback message shows when `error.message` is undefined
- [ ] Error alert has correct styling (red, light variant)

## 4. Entry Content Display

- [P] Entry name displays correctly (or "Unknown Entry" fallback)
- [P] Date formats correctly using moment ("DD MMM YYYY")
- [P] Total scans count calculates correctly across all products
- [P] `Divider` renders between header and product list

## 5. Products List (Accordion)

- [P] `Accordion` renders when products exist
- [P] Each `ProductItem` renders with correct key
- [P] Accordion chevron icon displays correctly
- [P] Accordion expands/collapses on click
- [P] White background applied to accordion

## 6. Product Item Interaction

- [P] Product name displays correctly
- [P] Product details/category displays correctly
- [P] Scan count badge shows correct count per product
- [ ] Delete button triggers `handleDeleteClick`
- [ ] Print functionality works correctly

## 7. Empty Products State

- [ ] `EmptyList` displays when no products
- [ ] Correct message "No products" shows
- [ ] Correct description shows
- [ ] Package icon displays

## 8. Delete Functionality

- [ ] Delete button opens `DeleteConfirmDrawer`
- [ ] `selectedProduct` state is set correctly with compatible format
- [ ] `parentId` is set to `product._id`
- [ ] `productName` is set to `product.name`
- [ ] Cancel closes drawer without deleting
- [ ] Confirm deletes the product
- [ ] Drawer closes after 300ms delay before clearing `selectedProduct`

## 9. Navigation

- [P] Back button navigates correctly
- [ ] If came from `/models`, back navigates to `/models`
- [P] Otherwise, back navigates to `/`
- [ ] `location.state?.from` is checked correctly
- [P] Edit button navigates to `/entries/${id}/edit`

## 10. Print Functionality

- [ ] `handlePrint` calls `PrintBulkProductInvoice` correctly
- [ ] Filename includes entry name or id fallback
- [ ] Print process completes without errors

## 11. URL Parameters

- [P] `id` is correctly extracted from `useParams()`
- [ ] Component handles invalid `id` gracefully
- [ ] Component handles missing `id` gracefully

## 12. Edge Cases

- [ ] Handle entry with no products
- [ ] Handle entry with many products (50+)
- [P] Handle very long entry name (truncation)
- [P] Handle very long product names
- [ ] Handle products with no codes
- [ ] Handle products with many codes (100+)
- [ ] Handle network error during fetch
- [ ] Handle 404 response for invalid entry ID
