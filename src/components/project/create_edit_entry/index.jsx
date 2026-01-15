import { useEffect, useState, useCallback } from "react";
import { useForm } from "@mantine/form";
import {
  Box,
  Divider,
  Group,
  LoadingOverlay,
  PinInput,
  Text,
  Stack,
  Space,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import ShellHeader from "../../shell/header";
import NavButton from "../../shell/header/menu";
import StyledButton from "../../common/StyledButton";
import { TbCheck, TbChevronLeft, TbLock } from "react-icons/tb";
import SectionHeader from "../../common/SectionHeader";
import Section1CustomerInfo from "./Section1CustomerInfo";
import Section2Products from "./Section2Products";
import SheetDrawer from "../../common/drawers/sheet";
import BarcodeScanner from "./BarcodeScanner";
import { CreateEntry, EditEntry, GetEntry } from "./libs";

// OTP Code for edit confirmation
const EDIT_OTP_CODE = "788983";

// Validate a single product
const validateProduct = (product) => {
  const errors = {};

  if (!product.category) {
    errors.category = "Category is required";
  }
  if (!product.name?.trim()) {
    errors.name = "Product name is required";
  }
  if (!product.details?.trim()) {
    errors.details = "Variant is required";
  }
  if (!product.price || product.price <= 0) {
    errors.price = "Price must be greater than 0";
  }
  if (!product.warranty?.trim()) {
    errors.warranty = "Warranty is required";
  }
  if (!product.codes || product.codes.length === 0) {
    errors.codes = "At least 1 IMEI/serial code is required";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

const CreateEditEntry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const queryClient = useQueryClient();

  const [scannerOpen, { open: openScannerDrawer, close: closeScannerDrawer }] =
    useDisclosure(false);
  const [scannerProductIndex, setScannerProductIndex] = useState(null);
  const [otpOpen, { open: openOtp, close: closeOtp }] = useDisclosure(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpError, setOtpError] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      date: new Date(),
      products: [],
    },
    validate: {
      name: (value) => (!value?.trim() ? "Party name is required" : null),
      date: (value) => (!value ? "Date is required" : null),
      products: {
        category: (value) => (!value ? "Category is required" : null),
        name: (value) => (!value?.trim() ? "Product name is required" : null),
        details: (value) => (!value?.trim() ? "Variant is required" : null),
        price: (value) => (!value || value <= 0 ? "Price is required" : null),
        warranty: (value) => (!value?.trim() ? "Warranty is required" : null),
        codes: (value) =>
          !value || value.length === 0 ? "At least 1 code required" : null,
      },
    },
  });

  // Open scanner for a specific product
  const openScanner = useCallback(
    (productIndex) => {
      setScannerProductIndex(productIndex);
      openScannerDrawer();
    },
    [openScannerDrawer]
  );

  // Close scanner and reset
  const closeScanner = useCallback(() => {
    closeScannerDrawer();
    setScannerProductIndex(null);
  }, [closeScannerDrawer]);

  // Handle scanned code
  const handleScannedCode = useCallback(
    (code) => {
      if (scannerProductIndex !== null) {
        const currentCodes =
          form.values.products[scannerProductIndex]?.codes || [];
        if (currentCodes.includes(code)) {
          notifications.show({
            title: "Duplicate Code",
            message: `${code} already exists`,
            color: "yellow",
          });
          return;
        }
        form.setFieldValue(`products.${scannerProductIndex}.codes`, [
          ...currentCodes,
          code,
        ]);
        notifications.show({
          title: "Code Added",
          message: `Added ${code}`,
          color: "green",
        });
      }
    },
    [scannerProductIndex, form]
  );

  // Fetch existing entry data for edit mode
  const { data: existingEntry, isLoading: isLoadingEntry } = useQuery({
    queryKey: ["entry", id],
    queryFn: () => GetEntry(id),
    enabled: isEditMode,
  });

  // Populate form when entry data is loaded
  useEffect(() => {
    if (existingEntry && isEditMode) {
      form.setValues({
        name: existingEntry.name || "",
        date: existingEntry.date ? new Date(existingEntry.date) : new Date(),
        products: existingEntry.products || [],
      });
    }
  }, [existingEntry, isEditMode]);

  // Mutation for creating entry
  const createMutation = useMutation({
    mutationFn: CreateEntry,
    onSuccess: (data) => {
      if (data.success) {
        notifications.show({
          title: "Success",
          message: "Entry created successfully",
          color: "green",
        });
        form.reset();
        navigate("/");

        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
      } else {
        notifications.show({
          title: "Error",
          message: data.message || "Failed to create entry",
          color: "red",
        });
      }
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Something went wrong",
        color: "red",
      });
    },
  });

  // Mutation for editing entry
  const editMutation = useMutation({
    mutationFn: EditEntry,
    onSuccess: (data) => {
      if (data.success) {
        notifications.show({
          title: "Success",
          message: "Entry updated successfully",
          color: "green",
        });
        closeOtp();
        navigate(`/entries/${id}`);

        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
      } else {
        notifications.show({
          title: "Error",
          message: data.message || "Failed to update entry",
          color: "red",
        });
      }
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Something went wrong",
        color: "red",
      });
    },
  });

  // Validate form before submit/OTP
  const validateForm = () => {
    const validation = form.validate();

    if (validation.hasErrors) {
      const productErrors = form.values.products
        .map((p) => validateProduct(p))
        .filter(Boolean);

      if (productErrors.length > 0) {
        notifications.show({
          title: "Validation Error",
          message: `${productErrors.length} product(s) have missing fields`,
          color: "red",
        });
      } else if (validation.errors.name || validation.errors.date) {
        notifications.show({
          title: "Validation Error",
          message: "Please fill in party information",
          color: "red",
        });
      }
      return false;
    }

    if (form.values.products.length === 0) {
      notifications.show({
        title: "Validation Error",
        message: "Please add at least 1 product",
        color: "red",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (isEditMode) {
      // Open OTP drawer for edit confirmation
      setOtpValue("");
      setOtpError(false);
      openOtp();
    } else {
      // Direct submit for create
      createMutation.mutate(form.values);
    }
  };

  const handleOtpConfirm = () => {
    if (otpValue === EDIT_OTP_CODE) {
      setOtpError(false);
      editMutation.mutate({ ...form.values, _id: id });
    } else {
      setOtpError(true);
      notifications.show({
        title: "Invalid OTP",
        message: "Please enter the correct edit code",
        color: "red",
      });
    }
  };

  const isPending = createMutation.isPending || editMutation.isPending;

  return (
    <>
      <ShellHeader>
        <Group h="100%" justify="space-between">
          <NavButton
            icon={TbChevronLeft}
            link={isEditMode ? `/entries/${id}` : "/"}
          />

          <StyledButton
            tint="green"
            tintOpacity={0.75}
            leftSection={<TbCheck size="1.25rem" />}
            onClick={handleSubmit}
            loading={isPending}
          >
            Save
          </StyledButton>
        </Group>
      </ShellHeader>

      <Box pb={100} pos="relative">
        <LoadingOverlay visible={isLoadingEntry} />

        <SectionHeader
          pt={72}
          title={isEditMode ? "Edit Entry" : "New Entry"}
          subtitle={
            isEditMode
              ? "Update the entry details below"
              : "Fill the form below to create a new entry"
          }
        />
        <Divider />
        <Section1CustomerInfo form={form} />
        <Divider />
        <Section2Products form={form} onScannerOpen={openScanner} />
      </Box>

      {/* Barcode Scanner Drawer */}
      <SheetDrawer
        isDrawerOpen={scannerOpen}
        closeDrawer={closeScanner}
        title="Scan Barcode"
      >
        <BarcodeScanner
          onScan={handleScannedCode}
          onClose={closeScanner}
          existingCodes={
            scannerProductIndex !== null
              ? form.values.products[scannerProductIndex]?.codes || []
              : []
          }
        />
      </SheetDrawer>

      {/* OTP Confirmation Drawer for Edit */}
      <SheetDrawer
        isDrawerOpen={otpOpen}
        closeDrawer={closeOtp}
        title="Confirm Edit"
      >
        <Stack gap={20} py={24} align="center">
          <Box
            w={64}
            h={64}
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TbLock size={32} color="white" />
          </Box>

          <Stack gap={4} align="center">
            <Text size="lg" fw={600} c="dark.8">
              Enter Edit Code
            </Text>
            <Text size="sm" c="gray.6" ta="center">
              Please enter the 6-digit code to confirm changes
            </Text>
          </Stack>

          <PinInput
            length={6}
            size="md"
            type="number"
            value={otpValue}
            onChange={setOtpValue}
            error={otpError}
            styles={{
              input: {
                borderColor: otpError
                  ? "var(--mantine-color-red-5)"
                  : undefined,
              },
            }}
          />

          {otpError && (
            <Text size="sm" c="red.6">
              Invalid code. Please try again.
            </Text>
          )}
          <Space h={12} />
          <StyledButton
            tint="green"
            tintOpacity={0.5}
            fullWidth
            size="lg"
            onClick={handleOtpConfirm}
            loading={editMutation.isPending}
            disabled={otpValue.length !== 6}
          >
            Confirm Update
          </StyledButton>
        </Stack>
      </SheetDrawer>
    </>
  );
};

export default CreateEditEntry;
