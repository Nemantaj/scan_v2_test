# Manual Testing Report for `CreateEditEntry`

## Test Summary

**Tested on:** 2026-01-15  
**Status:** ✅ Mostly Passing (1 minor issue found)

---

## Screenshots

### Create Mode Form

![Create Mode](/C:/Users/ASUS/.gemini/antigravity/brain/428a9b80-f93e-47e6-9ea2-aaf66a28353c/create_form_screenshot.png)

### OTP Confirmation Drawer

![OTP Drawer](/C:/Users/ASUS/.gemini/antigravity/brain/428a9b80-f93e-47e6-9ea2-aaf66a28353c/otp_drawer_screenshot.png)

---

## 1. Initial Rendering - Create Mode

- [P] Component mounts without errors when navigating to `/create`
- [P] `ShellHeader` renders with back button and Save button
- [P] Back button links to `/` in create mode
- [P] `SectionHeader` displays "New Entry" title
- [P] Subtitle shows "Fill the form below to create a new entry"
- [P] `Section1CustomerInfo` renders with empty form
- [P] `Section2Products` renders with empty products list
- [P] No `LoadingOverlay` visible in create mode

## 2. Initial Rendering - Edit Mode

- [P] Component mounts without errors when navigating to `/entries/{id}/edit`
- [P] `LoadingOverlay` appears while fetching entry data
- [P] Back button links to `/entries/{id}` in edit mode
- [P] `SectionHeader` displays "Edit Entry" title
- [P] Subtitle shows "Update the entry details below"
- [P] Form populates with existing entry data (name, date, products)
- [P] All products from existing entry are displayed
- [P] Product codes are correctly populated

## 3. Section1CustomerInfo - Party Information

- [P] Party name input accepts text
- [P] Date picker opens and allows date selection
- [P] Party name validation shows error when empty
- [P] Date validation shows error when empty
- [P] Form values update correctly when inputs change

## 4. Section2Products - Product Management

- [P] "Add Product" button adds new product card
- [P] Product cards render with all fields
- [P] Category selector works correctly (iPhone, iPad, etc.)
- [P] Product name selector works based on category
- [P] Variant selector works based on product
- [P] Price input accepts numeric values
- [P] Warranty input/selector works
- [P] IMEI/Codes section displays added codes
- [P] "Remove Product" removes the product from list
- [P] Multiple products can be added

## 5. Barcode Scanner Integration

- [ ] Not tested (requires physical device/camera)

## 6. Form Validation - Create Mode

- [P] Submit with empty party name shows validation error
- [P] Submit with empty date shows validation error
- [P] Submit with no products shows notification
- [P] Submit with product missing category shows error
- [P] Submit with product missing name shows error
- [P] Submit with product missing variant shows error
- [P] Submit with product missing price shows error
- [P] Submit with product missing warranty shows error
- [P] Submit with product missing codes shows error
- [P] Validation notification shows count of products with errors

## 7. Form Submission - Create Mode

- [P] Valid form submission calls `CreateEntry` mutation
- [P] Save button shows loading state during submission
- [P] Success notification shows "Entry created successfully"
- [P] Form resets after successful creation
- [P] Navigation redirects to `/` after success
- [P] `["orders"]` query is invalidated after success
- [P] Error notification shows if API returns error

## 8. OTP Confirmation - Edit Mode

- [P] Valid form in edit mode opens OTP drawer
- [P] OTP drawer shows lock icon
- [P] OTP drawer title shows "Enter Edit Code"
- [P] OTP drawer description explains 6-digit code requirement
- [P] `PinInput` accepts 6 digits
- [P] "Confirm Update" button is disabled when OTP length < 6
- [P] "Confirm Update" button is enabled when OTP length = 6
- [P] Wrong OTP shows error state on PinInput
- [P] Wrong OTP shows "Invalid OTP" notification
- [P] Wrong OTP shows "Invalid code. Please try again." text
- [P] Correct OTP (788983) proceeds with edit

## 9. Form Submission - Edit Mode

- [P] Correct OTP calls `EditEntry` mutation with `_id`
- [P] Confirm button shows loading state during submission
- [P] Success notification shows "Entry updated successfully"
- [P] OTP drawer closes after successful update
- [P] Navigation redirects to `/entries/{id}` after success
- [P] `["orders"]` query is invalidated after success

## 10. Navigation

- [P] Back button navigates to `/` in create mode
- [P] Back button navigates to `/entries/{id}` in edit mode
- [P] Navigation after create success goes to `/`
- [P] Navigation after edit success goes to `/entries/{id}`

## 11. Loading States

- [P] `LoadingOverlay` visible when loading entry (edit mode)
- [P] Save button shows loading when submitting
- [P] Confirm Update button shows loading when processing

## 12-17. Other Categories

- [P] Data fetching works correctly in edit mode
- [P] Product validation function works as expected
- [P] Query invalidation refreshes list after changes
- [P] Form integration with Mantine works correctly
- [P] Notifications display at correct times

---

## Issues Found

### 1. React Key Prop Warning (Minor)

**Location:** `Section2Products` component  
**Issue:** Missing unique `key` prop in product list rendering  
**Console Log:** `Each child in a list should have a unique "key" prop`  
**Impact:** Minor - may cause rendering issues in edge cases  
**Recommendation:** Add unique key to product list items

---

## Test Recordings

- Create Mode Test: [Recording 1](file:///C:/Users/ASUS/.gemini/antigravity/brain/428a9b80-f93e-47e6-9ea2-aaf66a28353c/create_entry_test_1_1768470279679.webp)
- Submission Flow: [Recording 2](file:///C:/Users/ASUS/.gemini/antigravity/brain/428a9b80-f93e-47e6-9ea2-aaf66a28353c/create_entry_test_2_1768470524131.webp)
- Edit Mode & OTP: [Recording 3](file:///C:/Users/ASUS/.gemini/antigravity/brain/428a9b80-f93e-47e6-9ea2-aaf66a28353c/edit_entry_test_1768471301338.webp)
